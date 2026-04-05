import {
  DEFAULT_SETTINGS,
  getSettings,
  isManagedSetting,
  saveSettings
} from "./lib/storage.js";

const CONNECTION_PRESETS = {
  "notion-proxy": {
    baseUrl: "http://127.0.0.1:8010/v1",
    apiKey: "grok2api",
    model: "grok-4.1-fast"
  }
};

const form = document.querySelector("#settings-form");
const statusNode = document.querySelector("#status");
const resetDefaultsButton = document.querySelector("#reset-defaults");

const fields = {
  workspaceName: document.querySelector("#workspace-name"),
  connectionPreset: document.querySelector("#connection-preset"),
  baseUrl: document.querySelector("#base-url"),
  apiKey: document.querySelector("#api-key"),
  model: document.querySelector("#model"),
  maxTokens: document.querySelector("#max-tokens"),
  systemPrompt: document.querySelector("#system-prompt"),
  pageBodyMaxChars: document.querySelector("#page-body-max-chars"),
  autoPreviewGeneratedRules: document.querySelector("#auto-preview-generated-rules"),
  enableMutationObserver: document.querySelector("#enable-mutation-observer")
};

bootstrap().catch((error) => {
  setStatus(error instanceof Error ? error.message : "Failed to load settings.", "error");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const savedSettings = await saveSettings(readForm());
    writeForm(savedSettings);
    syncManagedState(savedSettings);
    setStatus("Settings saved.", "success");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Failed to save settings.", "error");
  }
});

resetDefaultsButton.addEventListener("click", async () => {
  try {
    const savedSettings = await saveSettings(DEFAULT_SETTINGS);
    writeForm(savedSettings);
    syncManagedState(savedSettings);
    setStatus("Defaults restored where policy allows.", "success");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Failed to reset settings.", "error");
  }
});

fields.connectionPreset.addEventListener("change", () => {
  applyPreset(fields.connectionPreset.value);
});

fields.baseUrl.addEventListener("input", syncPresetSelectionFromFields);
fields.apiKey.addEventListener("input", syncPresetSelectionFromFields);
fields.model.addEventListener("input", syncPresetSelectionFromFields);

async function bootstrap() {
  const settings = await getSettings();
  writeForm(settings);
  syncManagedState(settings);
  setStatus("Settings loaded.");
}

function readForm() {
  return {
    workspaceName: fields.workspaceName.value,
    connectionPreset: fields.connectionPreset.value,
    baseUrl: fields.baseUrl.value,
    apiKey: fields.apiKey.value,
    model: fields.model.value,
    maxTokens: fields.maxTokens.value,
    systemPrompt: fields.systemPrompt.value,
    pageBodyMaxChars: fields.pageBodyMaxChars.value,
    autoPreviewGeneratedRules: fields.autoPreviewGeneratedRules.checked,
    enableMutationObserver: fields.enableMutationObserver.checked
  };
}

function writeForm(settings) {
  fields.workspaceName.value = settings.workspaceName;
  fields.connectionPreset.value = resolvePresetId(settings);
  fields.baseUrl.value = settings.baseUrl;
  fields.apiKey.value = settings.apiKey;
  fields.model.value = settings.model;
  fields.maxTokens.value = settings.maxTokens;
  fields.systemPrompt.value = settings.systemPrompt;
  fields.pageBodyMaxChars.value = settings.pageBodyMaxChars;
  fields.autoPreviewGeneratedRules.checked = settings.autoPreviewGeneratedRules;
  fields.enableMutationObserver.checked = settings.enableMutationObserver;
}

function syncManagedState(settings) {
  for (const [key, field] of Object.entries(fields)) {
    const managed = isManagedSetting(settings, key);
    field.disabled = managed;
    field.dataset.managed = managed ? "true" : "false";
  }
}

function applyPreset(presetId) {
  const preset = CONNECTION_PRESETS[presetId];
  if (!preset) {
    return;
  }

  fields.baseUrl.value = preset.baseUrl;
  fields.apiKey.value = preset.apiKey;
  fields.model.value = preset.model;
}

function syncPresetSelectionFromFields() {
  fields.connectionPreset.value = detectMatchingPreset({
    baseUrl: fields.baseUrl.value,
    apiKey: fields.apiKey.value,
    model: fields.model.value
  });
}

function resolvePresetId(settings) {
  const storedPreset = String(settings?.connectionPreset ?? "").trim();
  if (storedPreset && CONNECTION_PRESETS[storedPreset]) {
    return storedPreset;
  }

  return detectMatchingPreset(settings);
}

function detectMatchingPreset(settings) {
  const safeBaseUrl = String(settings?.baseUrl ?? "").trim();
  const safeApiKey = String(settings?.apiKey ?? "").trim();
  const safeModel = String(settings?.model ?? "").trim();

  for (const [presetId, preset] of Object.entries(CONNECTION_PRESETS)) {
    if (
      preset.baseUrl === safeBaseUrl &&
      preset.apiKey === safeApiKey &&
      preset.model === safeModel
    ) {
      return presetId;
    }
  }

  return "custom";
}

function setStatus(message, tone) {
  statusNode.textContent = message;
  statusNode.dataset.tone = tone ?? "";
}
