import { mergeRuleSets, sanitizeRuleSet } from "./rules.js";

export const DEFAULT_SETTINGS = {
  workspaceName: "Claude Web Modifier",
  connectionPreset: "notion-proxy",
  baseUrl: "http://127.0.0.1:8010/v1",
  apiKey: "grok2api",
  model: "grok-4.1-fast",
  systemPrompt:
    "Generate concise, safe webpage modification rules for the active website. Favor stable selectors and minimal edits.",
  maxTokens: 1024,
  pageBodyMaxChars: 2000,
  autoPreviewGeneratedRules: true,
  enableMutationObserver: true
};

const CONNECTION_PRESET_SIGNATURES = {
  "notion-proxy": {
    baseUrl: "http://127.0.0.1:8010/v1",
    apiKey: "grok2api",
    model: "grok-4.1-fast"
  }
};

const DEFAULT_LOCAL_STATE = {
  siteRuleSets: {},
  siteRuleHistories: {}
};

const SITE_RULE_PACKAGE_KIND = "claude-web-modifier-site-rules";
const SITE_RULE_HISTORY_LIMIT = 20;

export async function getSettings() {
  const [userSettings, managedSettings] = await Promise.all([
    chrome.storage.sync.get(DEFAULT_SETTINGS),
    getManagedSettings()
  ]);

  const migratedUserSettings = migrateLegacyDefaultConnection(userSettings);

  const mergedSettings = sanitizeSettings({
    ...DEFAULT_SETTINGS,
    ...migratedUserSettings,
    ...managedSettings
  });

  return {
    ...mergedSettings,
    managedKeys: Object.keys(managedSettings)
  };
}

export async function saveSettings(nextSettings) {
  const [managedSettings, currentUserSettings] = await Promise.all([
    getManagedSettings(),
    chrome.storage.sync.get(DEFAULT_SETTINGS)
  ]);

  const managedKeys = new Set(Object.keys(managedSettings));
  const candidateSettings = { ...currentUserSettings };

  for (const [key, value] of Object.entries(nextSettings ?? {})) {
    if (!managedKeys.has(key)) {
      candidateSettings[key] = value;
    }
  }

  await chrome.storage.sync.set(sanitizeSettings(candidateSettings));
  return getSettings();
}

export async function getSiteRuleSets() {
  const stored = await chrome.storage.local.get(DEFAULT_LOCAL_STATE);
  return sanitizeSiteRuleSets(stored.siteRuleSets);
}

export async function getSiteRuleHistories() {
  const stored = await chrome.storage.local.get(DEFAULT_LOCAL_STATE);
  return sanitizeSiteRuleHistories(stored.siteRuleHistories);
}

export async function getSiteHistoryState(hostname) {
  const safeHostname = normalizeHostname(hostname);
  if (!safeHostname) {
    return null;
  }

  const histories = await getSiteRuleHistories();
  const history = histories[safeHostname];
  return history ? summarizeSiteRuleHistory(history) : createEmptyHistoryMetadata();
}

export async function getSiteRuleSet(hostname) {
  const safeHostname = normalizeHostname(hostname);
  if (!safeHostname) {
    return null;
  }

  const siteRuleSets = await getSiteRuleSets();
  return siteRuleSets[safeHostname] ?? null;
}

export async function saveSiteRuleSet(hostname, ruleSet) {
  const safeHostname = normalizeHostname(hostname);
  if (!safeHostname) {
    throw new Error("A hostname is required to save site rules.");
  }

  return recordSiteRuleSnapshot(safeHostname, ruleSet, { reason: "save" });
}

export async function mergeSiteRuleSet(hostname, ruleSet) {
  const safeHostname = normalizeHostname(hostname);
  if (!safeHostname) {
    throw new Error("A hostname is required to merge site rules.");
  }

  const siteRuleSets = await getSiteRuleSets();
  const mergedRuleSet = mergeRuleSets(siteRuleSets[safeHostname], ruleSet, {
    hostname: safeHostname
  });

  return recordSiteRuleSnapshot(safeHostname, mergedRuleSet, { reason: "merge" });
}

export async function deleteSiteRuleSet(hostname) {
  const safeHostname = normalizeHostname(hostname);
  if (!safeHostname) {
    return;
  }

  const siteRuleSets = await getSiteRuleSets();
  const histories = await getSiteRuleHistories();
  if (!(safeHostname in siteRuleSets) && !(safeHostname in histories)) {
    return;
  }

  await recordSiteRuleSnapshot(safeHostname, null, { reason: "delete" });
}

export async function recordSiteRuleSnapshot(hostname, ruleSet, { reason = "" } = {}) {
  const safeHostname = normalizeHostname(hostname);
  if (!safeHostname) {
    throw new Error("A hostname is required to record a site rule snapshot.");
  }

  const nextRuleSet = ruleSet === null ? null : sanitizeRuleSet(ruleSet, { hostname: safeHostname });
  const { siteRuleSets, siteRuleHistories } = await readSiteRuleState();
  const currentHistory = sanitizeSiteRuleHistory(siteRuleHistories[safeHostname], safeHostname);
  const truncatedSnapshots = currentHistory.snapshots.slice(0, currentHistory.currentIndex + 1);
  const nextSnapshots = [
    ...truncatedSnapshots,
    createHistorySnapshot(nextRuleSet, reason)
  ].slice(-SITE_RULE_HISTORY_LIMIT);
  const nextHistory = {
    ...currentHistory,
    hostname: safeHostname,
    snapshots: nextSnapshots,
    currentIndex: nextSnapshots.length - 1
  };

  const nextSiteRuleSets = { ...siteRuleSets };
  if (nextRuleSet) {
    nextSiteRuleSets[safeHostname] = nextRuleSet;
  } else {
    delete nextSiteRuleSets[safeHostname];
  }

  await persistSiteRuleState({
    siteRuleSets: nextSiteRuleSets,
    siteRuleHistories: {
      ...siteRuleHistories,
      [safeHostname]: nextHistory
    }
  });

  return nextRuleSet;
}

export async function undoSiteRuleSet(hostname) {
  return shiftSiteRuleHistory(hostname, -1);
}

export async function redoSiteRuleSet(hostname) {
  return shiftSiteRuleHistory(hostname, 1);
}

export async function exportSiteRuleSet(hostname) {
  const safeHostname = normalizeHostname(hostname);
  if (!safeHostname) {
    throw new Error("A hostname is required to export site rules.");
  }

  const ruleSet = await getSiteRuleSet(safeHostname);
  if (!ruleSet) {
    throw new Error("No saved site rules were found for this hostname.");
  }

  return {
    version: 1,
    kind: SITE_RULE_PACKAGE_KIND,
    hostname: safeHostname,
    exportedAt: new Date().toISOString(),
    ruleSet: sanitizeRuleSet(ruleSet, { hostname: safeHostname })
  };
}

export async function importSiteRuleSet(payload) {
  const normalized = normalizeImportedSiteRulePackage(payload);
  return {
    ...normalized,
    ruleSet: sanitizeRuleSet(normalized.ruleSet, { hostname: normalized.hostname })
  };
}

export async function saveImportedSiteRuleSet(payload) {
  const imported = await importSiteRuleSet(payload);
  return recordSiteRuleSnapshot(imported.hostname, imported.ruleSet, {
    reason: "import"
  });
}

export const getSiteRuleHistoryMetadata = getSiteHistoryState;
export const exportSiteRulePackage = exportSiteRuleSet;
export const importSiteRulePackage = importSiteRuleSet;
export const saveImportedSiteRulePackage = saveImportedSiteRuleSet;

export function hasRequiredSettings(settings) {
  return Boolean(
    settings &&
      String(settings.baseUrl ?? "").trim() &&
      String(settings.apiKey ?? "").trim() &&
      String(settings.model ?? "").trim()
  );
}

export function isManagedSetting(settings, key) {
  return Array.isArray(settings?.managedKeys) && settings.managedKeys.includes(key);
}

export function sanitizeSettings(settings) {
  const maxTokens = Number.parseInt(settings?.maxTokens, 10);
  const pageBodyMaxChars = Number.parseInt(settings?.pageBodyMaxChars, 10);

  return {
    workspaceName: String(settings?.workspaceName ?? DEFAULT_SETTINGS.workspaceName).trim(),
    connectionPreset: String(
      settings?.connectionPreset ?? DEFAULT_SETTINGS.connectionPreset
    ).trim(),
    baseUrl: String(settings?.baseUrl ?? DEFAULT_SETTINGS.baseUrl).trim(),
    apiKey: String(settings?.apiKey ?? DEFAULT_SETTINGS.apiKey).trim(),
    model: String(settings?.model ?? DEFAULT_SETTINGS.model).trim(),
    systemPrompt: String(settings?.systemPrompt ?? DEFAULT_SETTINGS.systemPrompt).trim(),
    maxTokens:
      Number.isFinite(maxTokens) && maxTokens > 0 ? maxTokens : DEFAULT_SETTINGS.maxTokens,
    pageBodyMaxChars:
      Number.isFinite(pageBodyMaxChars) && pageBodyMaxChars >= 500
        ? pageBodyMaxChars
        : DEFAULT_SETTINGS.pageBodyMaxChars,
    autoPreviewGeneratedRules:
      typeof settings?.autoPreviewGeneratedRules === "boolean"
        ? settings.autoPreviewGeneratedRules
        : DEFAULT_SETTINGS.autoPreviewGeneratedRules,
    enableMutationObserver:
      typeof settings?.enableMutationObserver === "boolean"
        ? settings.enableMutationObserver
        : DEFAULT_SETTINGS.enableMutationObserver
  };
}

function migrateLegacyDefaultConnection(settings) {
  const safeSettings = settings && typeof settings === "object" ? settings : {};
  const savedPreset = String(safeSettings.connectionPreset ?? "").trim();

  if (savedPreset) {
    return safeSettings;
  }

  const inferredPreset = inferConnectionPreset(safeSettings);
  if (!inferredPreset) {
    return safeSettings;
  }

  return {
    ...safeSettings,
    connectionPreset: inferredPreset
  };
}

function inferConnectionPreset(settings) {
  const safeBaseUrl = String(settings?.baseUrl ?? "").trim();
  const safeApiKey = String(settings?.apiKey ?? "").trim();
  const safeModel = String(settings?.model ?? "").trim();

  for (const [presetId, preset] of Object.entries(CONNECTION_PRESET_SIGNATURES)) {
    if (
      preset.baseUrl === safeBaseUrl &&
      preset.apiKey === safeApiKey &&
      preset.model === safeModel
    ) {
      return presetId;
    }
  }

  return "";
}

export function sanitizeSiteRuleSets(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([hostname, ruleSet]) => {
        const safeHostname = normalizeHostname(hostname);
        if (!safeHostname || !ruleSet || typeof ruleSet !== "object") {
          return null;
        }

        return [
          safeHostname,
          sanitizeRuleSet(ruleSet, {
            hostname: safeHostname,
            fallbackSummary: String(ruleSet?.summary ?? "").trim()
          })
        ];
      })
      .filter(Boolean)
  );
}

export function sanitizeSiteRuleHistories(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([hostname, history]) => {
        const safeHostname = normalizeHostname(hostname);
        if (!safeHostname) {
          return null;
        }

        return [safeHostname, sanitizeSiteRuleHistory(history, safeHostname)];
      })
      .filter(Boolean)
  );
}

async function getManagedSettings() {
  if (!chrome.storage?.managed?.get) {
    return {};
  }

  try {
    const settings = await chrome.storage.managed.get(null);
    return settings && typeof settings === "object" ? settings : {};
  } catch {
    return {};
  }
}

function normalizeHostname(hostname) {
  return String(hostname ?? "").trim().toLowerCase();
}

async function readSiteRuleState() {
  const stored = await chrome.storage.local.get(DEFAULT_LOCAL_STATE);
  return {
    siteRuleSets: sanitizeSiteRuleSets(stored.siteRuleSets),
    siteRuleHistories: sanitizeSiteRuleHistories(stored.siteRuleHistories)
  };
}

async function persistSiteRuleState({ siteRuleSets = {}, siteRuleHistories = {} } = {}) {
  await chrome.storage.local.set({
    siteRuleSets,
    siteRuleHistories
  });
}

async function shiftSiteRuleHistory(hostname, delta) {
  const safeHostname = normalizeHostname(hostname);
  if (!safeHostname) {
    return null;
  }

  const { siteRuleSets, siteRuleHistories } = await readSiteRuleState();
  const history = sanitizeSiteRuleHistory(siteRuleHistories[safeHostname], safeHostname);
  if (history.snapshots.length === 0) {
    return null;
  }

  const nextIndex = history.currentIndex + delta;
  if (nextIndex < 0 || nextIndex >= history.snapshots.length) {
    return null;
  }

  const nextHistory = {
    ...history,
    currentIndex: nextIndex
  };
  const nextSnapshot = nextHistory.snapshots[nextIndex];
  const nextRuleSet = nextSnapshot?.ruleSet ?? null;
  const nextSiteRuleSets = { ...siteRuleSets };

  if (nextRuleSet) {
    nextSiteRuleSets[safeHostname] = nextRuleSet;
  } else {
    delete nextSiteRuleSets[safeHostname];
  }

  await persistSiteRuleState({
    siteRuleSets: nextSiteRuleSets,
    siteRuleHistories: {
      ...siteRuleHistories,
      [safeHostname]: nextHistory
    }
  });

  return nextRuleSet;
}

function sanitizeSiteRuleHistory(value, hostname = "") {
  const safeHostname = normalizeHostname(value?.hostname ?? hostname);
  const snapshots = Array.isArray(value?.snapshots)
    ? value.snapshots.map((snapshot) => sanitizeHistorySnapshot(snapshot, safeHostname)).filter(Boolean)
    : [];
  const currentIndex = Number.parseInt(value?.currentIndex, 10);
  const maxIndex = snapshots.length === 0 ? -1 : snapshots.length - 1;

  return {
    version: 1,
    hostname: safeHostname,
    currentIndex:
      Number.isInteger(currentIndex) && currentIndex >= 0 ? Math.min(currentIndex, maxIndex) : maxIndex,
    snapshots
  };
}

function sanitizeHistorySnapshot(snapshot, hostname = "") {
  if (!snapshot || typeof snapshot !== "object") {
    return null;
  }

  const hasRuleSet = Object.prototype.hasOwnProperty.call(snapshot, "ruleSet");
  const ruleSet = hasRuleSet
    ? snapshot.ruleSet === null
      ? null
      : sanitizeRuleSet(snapshot.ruleSet, { hostname })
    : null;

  return {
    savedAt: String(snapshot.savedAt ?? new Date().toISOString()).trim(),
    reason: String(snapshot.reason ?? "").trim(),
    ruleSet
  };
}

function createHistorySnapshot(ruleSet, reason = "") {
  return {
    savedAt: new Date().toISOString(),
    reason: String(reason ?? "").trim(),
    ruleSet
  };
}

function summarizeSiteRuleHistory(history) {
  const snapshots = Array.isArray(history?.snapshots) ? history.snapshots : [];
  const currentIndex = Number.isInteger(history?.currentIndex) ? history.currentIndex : -1;

  return {
    canUndo: currentIndex > 0,
    canRedo: currentIndex >= 0 && currentIndex < snapshots.length - 1,
    undoCount: currentIndex > 0 ? currentIndex : 0,
    redoCount:
      currentIndex >= 0 && snapshots.length > 0
        ? Math.max(0, snapshots.length - currentIndex - 1)
        : 0
  };
}

function createEmptyHistoryMetadata() {
  return {
    canUndo: false,
    canRedo: false,
    undoCount: 0,
    redoCount: 0
  };
}

function normalizeImportedSiteRulePackage(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Invalid site rule package.");
  }

  const kind = String(payload.kind ?? payload.type ?? "").trim();
  if (kind && kind !== SITE_RULE_PACKAGE_KIND) {
    throw new Error("Invalid site rule package kind.");
  }

  const hostname = normalizeHostname(payload.hostname ?? payload.siteHostname ?? payload.siteKey);
  const ruleSetCandidate =
    payload.ruleSet ??
    payload.siteRuleSet ??
    (Array.isArray(payload.rules) || payload.summary || payload.generatedAt
      ? payload
      : null);
  const inferredHostname = normalizeHostname(ruleSetCandidate?.hostname ?? hostname);

  if (!inferredHostname) {
    throw new Error("Invalid site rule package: hostname is required.");
  }

  if (!ruleSetCandidate || typeof ruleSetCandidate !== "object") {
    throw new Error("Invalid site rule package: ruleSet is required.");
  }

  return {
    version: 1,
    kind: SITE_RULE_PACKAGE_KIND,
    hostname: inferredHostname,
    exportedAt: String(payload.exportedAt ?? payload.importedAt ?? new Date().toISOString()).trim(),
    ruleSet: ruleSetCandidate
  };
}
