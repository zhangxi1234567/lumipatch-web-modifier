import {
  buildEndpoint,
  buildMessagesRequest,
  extractApiError,
  normalizeBaseUrl,
  parseResponseBody
} from "./lib/anthropic.js";
import {
  buildRuleGenerationSystemPrompt,
  buildRuleRepairSystemPrompt,
  buildRuleRepairUserPrompt,
  buildRuleGenerationUserPrompt,
  extractRuleSetFromText,
  getSiteKeyFromUrl,
  inferRuleSetFromInstruction,
  sanitizeRuleSet
} from "./lib/rules.js";
import {
  deleteSiteRuleSet,
  exportSiteRuleSet,
  getSettings,
  getSiteHistoryState,
  getSiteRuleSet,
  hasRequiredSettings,
  mergeSiteRuleSet,
  redoSiteRuleSet,
  saveImportedSiteRuleSet,
  saveSiteRuleSet,
  undoSiteRuleSet
} from "./lib/storage.js";

const CONTENT_SCRIPT_FILE = resolveContentScriptFile();
const RULE_GENERATION_TIMEOUT_MS = 120000;
const PAGE_THEME_INTENT_PATTERN =
  /整[个页面站]|全[页站页面]|整站|页面风格|网页风格|整体风格|全局|整个网页|整个页面|whole.?page|full.?page|entire.?page|site.?theme|page.?theme/i;

chrome.runtime.onInstalled.addListener(() => {
  void injectIntoExistingTabs();
});

chrome.runtime.onStartup.addListener(() => {
  void injectIntoExistingTabs();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !/^https?:/i.test(tab?.url ?? "")) {
    return;
  }

  void injectIntoTab(tabId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sender)
    .then((payload) => sendResponse({ ok: true, ...payload }))
    .catch((error) =>
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown extension error."
      })
    );

  return true;
});

async function handleMessage(request, sender) {
  switch (request?.type) {
    case "site:inspect":
      return inspectRequestedSite(request, sender);
    case "rules:generate":
      return generateRulesFromInstruction(request, sender);
    case "rules:preview":
      return previewRulesOnRequestedTab(request, sender);
    case "rules:clear-preview":
      return clearPreviewOnRequestedTab(request, sender);
    case "rules:save":
      return saveRulesForRequestedSite(request, sender);
    case "rules:delete":
      return deleteRulesForRequestedSite(request, sender);
    case "rules:undo":
      return undoRulesForRequestedSite(request, sender);
    case "rules:redo":
      return redoRulesForRequestedSite(request, sender);
    case "rules:export":
      return exportRulesForRequestedSite(request, sender);
    case "rules:import":
      return importRulesForRequestedSite(request, sender);
    case "rules:save-drag":
      return saveDragPositionForRequestedSite(request, sender);
    case "options:open":
      return openOptionsPage();
    default:
      throw new Error("Unsupported message type.");
  }
}

async function openOptionsPage() {
  await chrome.runtime.openOptionsPage();
  return { opened: true };
}

async function inspectRequestedSite(request, sender) {
  const settings = await getSettings();
  const tab = await getRequestedHttpTab(request, sender);
  const pageContext = await captureTabContext(tab.id, {
    includePageBody: true,
    maxChars: settings.pageBodyMaxChars
  });
  const hostname = getSiteKeyFromUrl(tab.url);
  const [savedRuleSet, history] = await Promise.all([
    getSiteRuleSet(hostname),
    getSiteHistoryState(hostname)
  ]);

  return {
    site: {
      tabId: tab.id,
      title: pageContext.title,
      url: pageContext.url,
      hostname
    },
    pageContext,
    savedRuleSet,
    history,
    settings: {
      workspaceName: settings.workspaceName,
      model: settings.model,
      baseUrl: settings.baseUrl
    }
  };
}

async function generateRulesFromInstruction(request, sender) {
  const instruction = String(request?.instruction ?? "").trim();
  if (!instruction) {
    throw new Error("Describe the changes you want before generating rules.");
  }

  const settings = await getSettings();
  if (!hasRequiredSettings(settings)) {
    throw new Error("Open Settings and save base URL, API key, and model first.");
  }

  const tab = await getRequestedHttpTab(request, sender);
  const hostname = getSiteKeyFromUrl(tab.url);
  const targetContext = sanitizeTargetContext(request?.targetContext);
  const hasPageThemeIntent = PAGE_THEME_INTENT_PATTERN.test(instruction);
  const isWholePageTarget =
    /^(body|html)$/i.test(String(targetContext?.selector ?? "").trim()) ||
    /^(body|html)$/i.test(String(targetContext?.tagName ?? "").trim());
  const isPageTheme =
    Boolean(request?.pageTheme) ||
    Boolean(targetContext?.isPageTheme) ||
    hasPageThemeIntent ||
    isWholePageTarget;

  const deterministicRuleSet = isPageTheme
    ? null
    : inferRuleSetFromInstruction({
        instruction,
        hostname,
        targetContext
      });
  const pageThemeFallbackRuleSet = isPageTheme
    ? inferRuleSetFromInstruction({
        instruction,
        hostname,
        targetContext
      })
    : null;
  const [pageContext, savedRuleSet] = await Promise.all([
    captureTabContext(tab.id, {
      includePageBody: true,
      maxChars: settings.pageBodyMaxChars
    }),
    getSiteRuleSet(hostname)
  ]);

  if (deterministicRuleSet) {
    const shouldPreview = Boolean(request?.forcePreview) || settings.autoPreviewGeneratedRules;
    const previewApplied = shouldPreview
      ? (await sendRulesToTab(tab.id, "modifier:preview-rules", deterministicRuleSet)).delivered
      : false;

    return {
      site: {
        tabId: tab.id,
        title: pageContext.title,
        url: pageContext.url,
        hostname
      },
      pageContext,
      targetContext,
      assistantText: JSON.stringify(deterministicRuleSet, null, 2),
      ruleSet: deterministicRuleSet,
      previewApplied,
      generationSource: "local-deterministic"
    };
  }

  const pageThemeSystemExtra = isPageTheme
    ? [
        "The user wants a FULL-PAGE visual theme overhaul covering EVERY visible area of the page.",
        "Strategy: output ONE customCss rule whose css field contains all the CSS needed for the full theme.",
        "In that single css block:",
        "  1. Set CSS custom properties on :root (--bg-primary, --bg-secondary, --text-primary, --text-secondary, --accent, --border, --input-bg etc.)",
        "  2. Apply those variables to: body, *, *::before, *::after for background-color and color where appropriate.",
        "  3. Also directly target: body, main, aside, nav, header, footer, section, article, div, p, span, h1, h2, h3, h4, h5, h6, a, button, input, textarea, select, ul, li, [class*='content'], [class*='main'], [class*='container'], [class*='wrapper'], [class*='sidebar'], [class*='chat'], [class*='message'], [class*='panel'].",
        "  4. Use !important on every declaration to override the site's existing styles.",
        "Do NOT split into many small rules — put everything in ONE customCss rule's css field.",
        "Do NOT scope changes to a single element — the goal is a site-wide visual restyle of every visible element."
      ].join("\n")
    : "";
  const systemPrompt = [buildRuleGenerationSystemPrompt(settings.systemPrompt), pageThemeSystemExtra]
    .filter(Boolean)
    .join("\n\n");

  let assistantText = "";
  try {
    assistantText = await requestModelText({
      settings: isPageTheme
        ? { ...settings, maxTokens: Math.max(settings.maxTokens, 8192) }
        : settings,
      systemPrompt,
      userPrompt: buildRuleGenerationUserPrompt({
        instruction,
        pageContext,
        currentRuleSet: savedRuleSet,
        targetContext
      }),
      timeoutErrorMessage: "规则生成超时，请检查模型接口状态后再试。"
    });
  } catch (error) {
    if (isPageTheme && pageThemeFallbackRuleSet) {
      const shouldPreview = Boolean(request?.forcePreview) || settings.autoPreviewGeneratedRules;
      const previewApplied = shouldPreview
        ? (await sendRulesToTab(tab.id, "modifier:preview-rules", pageThemeFallbackRuleSet)).delivered
        : false;

      return {
        site: {
          tabId: tab.id,
          title: pageContext.title,
          url: pageContext.url,
          hostname
        },
        pageContext,
        targetContext,
        assistantText: JSON.stringify(pageThemeFallbackRuleSet, null, 2),
        ruleSet: pageThemeFallbackRuleSet,
        previewApplied,
        generationSource: "local-fallback-after-ai-error"
      };
    }
    throw error;
  }
  const { ruleSet, finalAssistantText } = await resolveRuleSet({
    assistantText,
    settings,
    hostname,
    instruction,
    pageContext,
    savedRuleSet,
    targetContext,
    isPageTheme
  });
  if (isPageTheme && (!ruleSet || !Array.isArray(ruleSet.rules) || ruleSet.rules.length === 0)) {
    try {
      const repairedAssistantText = await requestModelText({
        settings: { ...settings, maxTokens: Math.max(settings.maxTokens, 8192) },
        systemPrompt: buildRuleRepairSystemPrompt(settings.systemPrompt),
        userPrompt: buildRuleRepairUserPrompt({
          instruction,
          pageContext,
          currentRuleSet: savedRuleSet,
          targetContext,
          invalidAssistantText: finalAssistantText || assistantText,
          parseError: "Page-theme request produced an empty rule set. Regenerate a non-empty theme rule set."
        }),
        timeoutErrorMessage: "规则修复超时，请检查模型接口状态后再试。"
      });
      const repairedRuleSet = extractRuleSetFromText(repairedAssistantText, { hostname });
      if (Array.isArray(repairedRuleSet?.rules) && repairedRuleSet.rules.length > 0) {
        const shouldPreview = Boolean(request?.forcePreview) || settings.autoPreviewGeneratedRules;
        const previewApplied = shouldPreview
          ? (await sendRulesToTab(tab.id, "modifier:preview-rules", repairedRuleSet)).delivered
          : false;
        return {
          site: {
            tabId: tab.id,
            title: pageContext.title,
            url: pageContext.url,
            hostname
          },
          pageContext,
          targetContext,
          assistantText: repairedAssistantText,
          ruleSet: repairedRuleSet,
          previewApplied,
          generationSource: "ai"
        };
      }
    } catch {
      // Fall through to local fallback when repair also fails.
    }

    if (pageThemeFallbackRuleSet) {
      const shouldPreview = Boolean(request?.forcePreview) || settings.autoPreviewGeneratedRules;
      const previewApplied = shouldPreview
        ? (await sendRulesToTab(tab.id, "modifier:preview-rules", pageThemeFallbackRuleSet)).delivered
        : false;

      return {
        site: {
          tabId: tab.id,
          title: pageContext.title,
          url: pageContext.url,
          hostname
        },
        pageContext,
        targetContext,
        assistantText: JSON.stringify(pageThemeFallbackRuleSet, null, 2),
        ruleSet: pageThemeFallbackRuleSet,
        previewApplied,
        generationSource: "local-fallback-after-ai-empty"
      };
    }
  }
  const shouldPreview = Boolean(request?.forcePreview) || settings.autoPreviewGeneratedRules;
  const previewApplied = shouldPreview
    ? (await sendRulesToTab(tab.id, "modifier:preview-rules", ruleSet)).delivered
    : false;

  return {
    site: {
      tabId: tab.id,
      title: pageContext.title,
      url: pageContext.url,
      hostname
    },
    pageContext,
    targetContext,
    assistantText: finalAssistantText,
    ruleSet,
    previewApplied,
    generationSource: "ai"
  };
}

async function previewRulesOnRequestedTab(request, sender) {
  const tab = await getRequestedHttpTab(request, sender);
  const hostname = getSiteKeyFromUrl(tab.url);
  const normalizedRuleSet = sanitizeRuleSet(request.ruleSet, { hostname });
  const result = await sendRulesToTab(tab.id, "modifier:preview-rules", normalizedRuleSet);

  return {
    delivered: result.delivered,
    site: {
      tabId: tab.id,
      url: tab.url,
      hostname
    }
  };
}

async function clearPreviewOnRequestedTab(request, sender) {
  const tab = await getRequestedHttpTab(request, sender);
  const result = await sendRulesToTab(tab.id, "modifier:clear-preview");

  return {
    delivered: result.delivered,
    site: {
      tabId: tab.id,
      url: tab.url,
      hostname: getSiteKeyFromUrl(tab.url)
    }
  };
}

async function saveRulesForRequestedSite(request, sender) {
  const tab = await getRequestedHttpTab(request, sender);
  const hostname = getSiteKeyFromUrl(tab.url);
  const shouldMerge = Boolean(request?.merge);
  const incomingRuleSet = sanitizeRuleSet(request?.ruleSet, { hostname });
  const shouldReplaceExistingCustomCss =
    shouldMerge && hasCustomCssRule(incomingRuleSet?.rules);
  let savedRuleSet;

  if (shouldReplaceExistingCustomCss) {
    const existingRuleSet = await getSiteRuleSet(hostname);
    const existingNonCustomCssRules = (existingRuleSet?.rules ?? []).filter(
      (rule) => rule?.type !== "customCss"
    );
    const nextRuleSet = sanitizeRuleSet(
      {
        hostname,
        summary: String(
          incomingRuleSet?.summary ?? existingRuleSet?.summary ?? "Updated site rules"
        ).trim(),
        rules: [...existingNonCustomCssRules, ...(incomingRuleSet?.rules ?? [])]
      },
      { hostname }
    );
    savedRuleSet = await saveSiteRuleSet(hostname, nextRuleSet);
  } else {
    savedRuleSet = shouldMerge
      ? await mergeSiteRuleSet(hostname, incomingRuleSet)
      : await saveSiteRuleSet(hostname, incomingRuleSet);
  }
  const history = await getSiteHistoryState(hostname);
  const delivery = await sendRulesToTab(tab.id, "modifier:refresh");

  return {
    site: {
      tabId: tab.id,
      url: tab.url,
      hostname
    },
    ruleSet: savedRuleSet,
    history,
    delivered: delivery.delivered
  };
}

function hasCustomCssRule(rules) {
  return (Array.isArray(rules) ? rules : []).some((rule) => rule?.type === "customCss");
}

async function deleteRulesForRequestedSite(request, sender) {
  const tab = await getRequestedHttpTab(request, sender);
  const hostname = getSiteKeyFromUrl(tab.url);
  await deleteSiteRuleSet(hostname);
  const history = await getSiteHistoryState(hostname);
  const delivery = await sendRulesToTab(tab.id, "modifier:refresh");

  return {
    site: {
      tabId: tab.id,
      url: tab.url,
      hostname
    },
    ruleSet: null,
    history,
    delivered: delivery.delivered
  };
}

async function undoRulesForRequestedSite(request, sender) {
  const tab = await getRequestedHttpTab(request, sender);
  const hostname = getSiteKeyFromUrl(tab.url);
  const ruleSet = await undoSiteRuleSet(hostname);
  const history = await getSiteHistoryState(hostname);
  const delivery = await sendRulesToTab(tab.id, "modifier:refresh");

  return {
    site: {
      tabId: tab.id,
      url: tab.url,
      hostname
    },
    ruleSet,
    history,
    delivered: delivery.delivered
  };
}

async function redoRulesForRequestedSite(request, sender) {
  const tab = await getRequestedHttpTab(request, sender);
  const hostname = getSiteKeyFromUrl(tab.url);
  const ruleSet = await redoSiteRuleSet(hostname);
  const history = await getSiteHistoryState(hostname);
  const delivery = await sendRulesToTab(tab.id, "modifier:refresh");

  return {
    site: {
      tabId: tab.id,
      url: tab.url,
      hostname
    },
    ruleSet,
    history,
    delivered: delivery.delivered
  };
}

async function exportRulesForRequestedSite(request, sender) {
  const tab = await getRequestedHttpTab(request, sender);
  const hostname = getSiteKeyFromUrl(tab.url);
  const payload = await exportSiteRuleSet(hostname);

  return {
    site: {
      tabId: tab.id,
      url: tab.url,
      hostname
    },
    payload
  };
}

async function importRulesForRequestedSite(request, sender) {
  const tab = await getRequestedHttpTab(request, sender);
  const hostname = getSiteKeyFromUrl(tab.url);
  const payloadHostname = String(request?.payload?.hostname ?? "").trim().toLowerCase();

  if (payloadHostname && payloadHostname !== hostname) {
    throw new Error(`This import file targets ${payloadHostname}, not ${hostname}.`);
  }

  const ruleSet = await saveImportedSiteRuleSet({
    ...request.payload,
    hostname
  });
  const history = await getSiteHistoryState(hostname);
  const delivery = await sendRulesToTab(tab.id, "modifier:refresh");

  return {
    site: {
      tabId: tab.id,
      url: tab.url,
      hostname
    },
    ruleSet,
    history,
    delivered: delivery.delivered
  };
}

async function getRequestedHttpTab(request, sender) {
  const requestedTabId = Number.parseInt(request?.tabId, 10);

  if (Number.isInteger(requestedTabId)) {
    return validateHttpTab(await chrome.tabs.get(requestedTabId));
  }

  if (sender?.tab?.id) {
    return validateHttpTab(await chrome.tabs.get(sender.tab.id));
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });

  return validateHttpTab(tab);
}

function validateHttpTab(tab) {
  if (!tab?.id || !/^https?:/i.test(tab.url ?? "")) {
    throw new Error("Open a normal website tab before using the modifier.");
  }

  return tab;
}

async function captureTabContext(tabId, { includePageBody, maxChars }) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: collectPageContext,
    args: [
      {
        includePageBody: Boolean(includePageBody),
        maxChars: Number.isFinite(maxChars) && maxChars > 0 ? maxChars : 4000
      }
    ]
  });

  if (!result) {
    throw new Error("The current page did not return any context.");
  }

  return result;
}

async function injectIntoExistingTabs() {
  const tabs = await chrome.tabs.query({});

  await Promise.allSettled(
    tabs
      .filter((tab) => /^https?:/i.test(tab.url ?? "") && Number.isInteger(tab.id))
      .map((tab) => injectIntoTab(tab.id))
  );
}

async function injectIntoTab(tabId) {
  return chrome.scripting.executeScript({
    target: {
      tabId,
      allFrames: true
    },
    files: [CONTENT_SCRIPT_FILE],
    injectImmediately: true
  });
}

async function sendRulesToTab(tabId, type, ruleSet = null) {
  try {
    await chrome.tabs.sendMessage(tabId, {
      type,
      ruleSet
    });

    return { delivered: true };
  } catch {
    return { delivered: false };
  }
}

async function resolveRuleSet({
  assistantText,
  settings,
  hostname,
  instruction,
  pageContext,
  savedRuleSet,
  targetContext,
  isPageTheme = false
}) {
  try {
    const rawRuleSet = extractRuleSetFromText(assistantText, { hostname });
    const ruleSet = isPageTheme ? rawRuleSet : pinpointRuleSetToTarget(rawRuleSet, targetContext);
    return {
      ruleSet,
      finalAssistantText: assistantText
    };
  } catch (parseError) {
    const inferredRuleSet = isPageTheme ? null : inferRuleSetFromInstruction({
      instruction,
      hostname,
      targetContext
    });

    if (inferredRuleSet) {
      return {
        ruleSet: inferredRuleSet,
        finalAssistantText: JSON.stringify(inferredRuleSet, null, 2)
      };
    }

    try {
      const repairedAssistantText = await requestModelText({
        settings,
        systemPrompt: buildRuleRepairSystemPrompt(settings.systemPrompt),
        userPrompt: buildRuleRepairUserPrompt({
          instruction,
          pageContext,
          currentRuleSet: savedRuleSet,
          targetContext,
          invalidAssistantText: assistantText,
          parseError: parseError instanceof Error ? parseError.message : String(parseError ?? "")
        }),
        timeoutErrorMessage: "规则修复超时，请检查模型接口状态后再试。"
      });
      const repairedRuleSet = isPageTheme
        ? extractRuleSetFromText(repairedAssistantText, { hostname })
        : pinpointRuleSetToTarget(
            extractRuleSetFromText(repairedAssistantText, { hostname }),
            targetContext
          );

      return {
        ruleSet: repairedRuleSet,
        finalAssistantText: repairedAssistantText
      };
    } catch {
      throw new Error(
        "模型返回的不是可用规则。请把需求写得更像修改命令，例如“把这段文字改成立即下载”或“把背景改成黑色”。"
      );
    }
  }
}

function sanitizeTargetContext(targetContext) {
  if (!targetContext || typeof targetContext !== "object") {
    return null;
  }

  const selector = String(targetContext.selector ?? "").trim();
  if (!selector) {
    return null;
  }

  return {
    selector,
    tagName: String(targetContext.tagName ?? "").trim(),
    text: String(targetContext.text ?? "").trim(),
    selectedText: String(targetContext.selectedText ?? "").trim(),
    role: String(targetContext.role ?? "").trim(),
    ariaLabel: String(targetContext.ariaLabel ?? "").trim(),
    ariaSelected: String(targetContext.ariaSelected ?? "").trim(),
    ariaExpanded: String(targetContext.ariaExpanded ?? "").trim(),
    dataTestId: String(targetContext.dataTestId ?? "").trim(),
    placeholder: String(targetContext.placeholder ?? "").trim(),
    href: String(targetContext.href ?? "").trim(),
    src: String(targetContext.src ?? "").trim(),
    computedDisplay: String(targetContext.computedDisplay ?? "").trim(),
    computedPosition: String(targetContext.computedPosition ?? "").trim(),
    isInsideList: Boolean(targetContext.isInsideList),
    isInsideNav: Boolean(targetContext.isInsideNav),
    isPageTheme: Boolean(targetContext.isPageTheme)
  };
}

async function requestModelText({
  settings,
  systemPrompt,
  userPrompt,
  timeoutErrorMessage = "请求超时，请稍后重试。"
}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), RULE_GENERATION_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(buildEndpoint(settings.baseUrl), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": settings.apiKey,
        Authorization: `Bearer ${settings.apiKey}`,
        "anthropic-version": "2023-06-01"
      },
      signal: controller.signal,
      body: JSON.stringify(
        buildMessagesRequest({
          model: settings.model,
          systemPrompt,
          maxTokens: settings.maxTokens,
          messages: [
            {
              role: "user",
              content: userPrompt
            }
          ]
        })
      )
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(timeoutErrorMessage);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    if (response.status === 404) {
      const openAiCompatibleText = await requestOpenAICompatibleText({
        settings,
        systemPrompt,
        userPrompt,
        signal: controller.signal
      });
      if (openAiCompatibleText) {
        return openAiCompatibleText;
      }
    }

    const rawError = await response.text();
    let payload = {};

    if (rawError) {
      try {
        payload = JSON.parse(rawError);
      } catch {
        payload = { message: rawError };
      }
    }

    throw new Error(
      extractApiError(payload, `Rule generation failed with status ${response.status}.`)
    );
  }

  const contentType = String(response.headers.get("content-type") ?? "").toLowerCase();
  const rawText = await response.text();
  return parseResponseBody(rawText, contentType) || rawText;
}

function buildResponsesEndpoint(baseUrl) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  if (/\/v\d+$/i.test(normalizedBaseUrl)) {
    return `${normalizedBaseUrl}/responses`;
  }
  return `${normalizedBaseUrl}/v1/responses`;
}

async function requestOpenAICompatibleText({
  settings,
  systemPrompt,
  userPrompt,
  signal
}) {
  const endpoint = buildResponsesEndpoint(settings.baseUrl);
  const input = [];
  const safeSystemPrompt = String(systemPrompt ?? "").trim();
  if (safeSystemPrompt) {
    input.push({
      role: "system",
      content: [{ type: "input_text", text: safeSystemPrompt }]
    });
  }
  input.push({
    role: "user",
    content: [{ type: "input_text", text: String(userPrompt ?? "") }]
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": settings.apiKey,
      Authorization: `Bearer ${settings.apiKey}`
    },
    signal,
    body: JSON.stringify({
      model: settings.model,
      input,
      max_output_tokens: Number.isFinite(settings.maxTokens) ? settings.maxTokens : 1024
    })
  });

  const rawText = await response.text();
  if (!response.ok) {
    return "";
  }

  return parseOpenAIResponsesText(rawText);
}

function parseOpenAIResponsesText(rawText) {
  if (!rawText) {
    return "";
  }

  let payload = null;
  try {
    payload = JSON.parse(rawText);
  } catch {
    return "";
  }

  const direct = String(payload?.output_text ?? "").trim();
  if (direct) {
    return direct;
  }

  const chunks = [];
  const output = Array.isArray(payload?.output) ? payload.output : [];
  for (const item of output) {
    const contentList = Array.isArray(item?.content) ? item.content : [];
    for (const content of contentList) {
      const text = String(content?.text ?? content?.output_text ?? "").trim();
      if (text) {
        chunks.push(text);
      }
    }
  }

  const outputText = chunks.join("\n\n").trim();
  if (outputText) {
    return outputText;
  }

  // Compatibility fallback for gateways that mimic Chat Completions shape.
  const choices = Array.isArray(payload?.choices) ? payload.choices : [];
  for (const choice of choices) {
    const messageContent = choice?.message?.content;
    if (typeof messageContent === "string" && messageContent.trim()) {
      return messageContent.trim();
    }
    if (Array.isArray(messageContent)) {
      const parts = messageContent
        .map((part) => String(part?.text ?? part?.content ?? "").trim())
        .filter(Boolean);
      if (parts.length > 0) {
        return parts.join("\n\n").trim();
      }
    }
  }

  return "";
}

function collectPageContext({ includePageBody, maxChars }) {
  const OWNED_SELECTOR = '[data-claude-web-modifier-owned="true"]';
  const selectionText = String(window.getSelection?.()?.toString?.() ?? "").trim();
  const rawBodyText = includePageBody
    ? getSanitizedBodyText()
    : "";
  const bodyText = rawBodyText.replace(/\s+/g, " ").trim().slice(0, maxChars);

  const domHints = Array.from(
    document.querySelectorAll(
      "h1, h2, h3, button, a, input, textarea, select, label, nav, main, aside, section, li, [role='button'], [role='tab'], [role='menuitem'], [role='option'], [role='listitem'], [data-testid], [aria-label]"
    )
  )
    .filter((element) => !isExtensionOwnedElement(element))
    .slice(0, 60)
    .map((element) => {
      const text = String(
        element.textContent ||
          element.getAttribute("aria-label") ||
          element.getAttribute("placeholder") ||
          element.getAttribute("title") ||
          ""
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 100);

      const cs = window.getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        selector: buildSelector(element),
        text,
        id: element.id || "",
        classes: Array.from(element.classList || []).slice(0, 4),
        role: element.getAttribute("role") || "",
        ariaLabel: element.getAttribute("aria-label") || "",
        ariaSelected: element.getAttribute("aria-selected") || "",
        ariaExpanded: element.getAttribute("aria-expanded") || "",
        dataTestId: element.getAttribute("data-testid") || "",
        name: element.getAttribute("name") || "",
        placeholder: element.getAttribute("placeholder") || "",
        display: cs.display,
        position: cs.position
      };
    })
    .filter((hint) => hint.selector && hint.text);

  return {
    title: String(document.title ?? "").trim(),
    url: String(location.href ?? "").trim(),
    hostname: String(location.hostname ?? "").trim().toLowerCase(),
    selectionText,
    bodyText,
    domHints,
    capturedAt: new Date().toISOString()
  };

  function getSanitizedBodyText() {
    if (!document.body) {
      return "";
    }

    const clone = document.body.cloneNode(true);
    if (!(clone instanceof HTMLElement)) {
      return String(document.body.innerText ?? "");
    }

    clone
      .querySelectorAll(`${OWNED_SELECTOR}, script, style, noscript`)
      .forEach((element) => element.remove());

    return String(clone.innerText ?? clone.textContent ?? "");
  }

  function isExtensionOwnedElement(element) {
    return element instanceof Element && Boolean(element.closest(OWNED_SELECTOR));
  }

  function buildSelector(element) {
    if (!(element instanceof Element)) {
      return "";
    }

    if (element.id) {
      return `#${escapeSelectorToken(element.id)}`;
    }

    const testAttribute =
      element.getAttribute("data-testid") ||
      element.getAttribute("data-test") ||
      element.getAttribute("data-qa");
    if (testAttribute) {
      return `[data-testid="${escapeAttributeValue(testAttribute)}"]`;
    }

    const segments = [];
    let current = element;
    let depth = 0;

    while (current && current.nodeType === Node.ELEMENT_NODE && depth < 4) {
      let segment = current.tagName.toLowerCase();
      const classes = Array.from(current.classList || [])
        .filter(Boolean)
        .slice(0, 2)
        .map((className) => `.${escapeSelectorToken(className)}`)
        .join("");

      segment += classes;

      if (current.parentElement) {
        const siblings = Array.from(current.parentElement.children).filter(
          (child) => child.tagName === current.tagName
        );
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          segment += `:nth-of-type(${index})`;
        }
      }

      segments.unshift(segment);
      current = current.parentElement;
      depth += 1;

      if (current?.id) {
        segments.unshift(`#${escapeSelectorToken(current.id)}`);
        break;
      }
    }

    return segments.join(" > ");
  }

  function escapeSelectorToken(value) {
    return String(value ?? "").replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function escapeAttributeValue(value) {
    return String(value ?? "").replace(/"/g, '\\"');
  }
}

function pinpointRuleSetToTarget(ruleSet, targetContext) {
  const targetSelector = String(targetContext?.selector ?? "").trim();
  if (!targetSelector || !ruleSet?.rules?.length) {
    return ruleSet;
  }

  // 只有当 targetSelector 包含 nth 定位时才做替换，否则不干预
  const hasNth = /:nth-(?:of-type|child|last-of-type)\(/.test(targetSelector);
  if (!hasNth) {
    return ruleSet;
  }

  // 提取 targetSelector 的末尾叶子段（去掉祖先路径，保留最精确部分）
  const targetLeaf = targetSelector.split(/\s*>\s*/).pop();
  // 提取叶子的基础标签+class（不含 nth）
  const leafBase = targetLeaf.replace(/:nth-(?:of-type|child|last-of-type)\(\d+\)/g, "");

  const fixedRules = ruleSet.rules.map((rule) => {
    const sel = String(rule.selector ?? "").trim();
    if (!sel) return rule;

    // 如果 AI 用的 selector 是宽泛版（匹配 leafBase 但缺少 nth），替换为精确 targetSelector
    const selLeaf = sel.split(/\s*>\s*/).pop();
    const selLeafBase = selLeaf.replace(/:nth-(?:of-type|child|last-of-type)\(\d+\)/g, "");
    const isWideMatch =
      selLeafBase === leafBase && !/:nth-(?:of-type|child|last-of-type)\(/.test(sel);

    if (isWideMatch) {
      return { ...rule, selector: targetSelector };
    }
    return rule;
  });

  return { ...ruleSet, rules: fixedRules };
}

async function saveDragPositionForRequestedSite(request, sender) {
  const tab = await getRequestedHttpTab(request, sender);
  const hostname = getSiteKeyFromUrl(tab.url);
  const existing = (await getSiteRuleSet(hostname)) ?? { rules: [] };
  const { selector, styleValue } = request;
  const dragRule = request?.dragRule;

  let dragRuleId = "";
  let newRule = null;
  let dragSelector = "";

  if (dragRule?.type === "moveNode") {
    const moveSelector = String(dragRule.selector ?? "").trim();
    const targetParentSelector = String(dragRule.targetParentSelector ?? "").trim();
    const beforeSelector = String(dragRule.beforeSelector ?? "").trim();
    if (!moveSelector || !targetParentSelector) {
      throw new Error("selector and targetParentSelector are required for structural drag save.");
    }

    dragSelector = moveSelector;
    dragRuleId = `drag-move::${moveSelector}`;
    newRule = {
      id: dragRuleId,
      type: "moveNode",
      selector: moveSelector,
      targetParentSelector,
      beforeSelector,
      label: `Move ${moveSelector} into ${targetParentSelector}`
    };
  } else if (dragRule?.type === "pagePinNode") {
    const pagePinSelector = String(dragRule.selector ?? "").trim();
    const documentLeft = Number.parseFloat(dragRule.documentLeft);
    const documentTop = Number.parseFloat(dragRule.documentTop);
    const width = Number.parseFloat(dragRule.width);
    const height = Number.parseFloat(dragRule.height);
    const zIndex = Number.parseInt(dragRule.zIndex, 10);
    if (
      !pagePinSelector ||
      !Number.isFinite(documentLeft) ||
      !Number.isFinite(documentTop)
    ) {
      throw new Error(
        "selector, documentLeft, and documentTop are required for page-follow drag save."
      );
    }

    dragSelector = pagePinSelector;
    dragRuleId = `drag-page-pin::${pagePinSelector}`;
    newRule = {
      id: dragRuleId,
      type: "pagePinNode",
      selector: pagePinSelector,
      documentLeft,
      documentTop,
      width: Number.isFinite(width) ? width : 0,
      height: Number.isFinite(height) ? height : 0,
      zIndex: Number.isInteger(zIndex) ? zIndex : 2147483644,
      label: `Place ${pagePinSelector} at document (${documentLeft}, ${documentTop})`
    };
  } else if (dragRule?.type === "pinNode") {
    const pinSelector = String(dragRule.selector ?? "").trim();
    const left = Number.parseFloat(dragRule.left);
    const top = Number.parseFloat(dragRule.top);
    const width = Number.parseFloat(dragRule.width);
    const height = Number.parseFloat(dragRule.height);
    const zIndex = Number.parseInt(dragRule.zIndex, 10);
    if (!pinSelector || !Number.isFinite(left) || !Number.isFinite(top)) {
      throw new Error("selector, left, and top are required for pin drag save.");
    }

    dragSelector = pinSelector;
    dragRuleId = `drag-pin::${pinSelector}`;
    newRule = {
      id: dragRuleId,
      type: "pinNode",
      selector: pinSelector,
      left,
      top,
      width: Number.isFinite(width) ? width : 0,
      height: Number.isFinite(height) ? height : 0,
      zIndex: Number.isInteger(zIndex) ? zIndex : 2147483644,
      label: `Pin ${pinSelector} at (${left}, ${top})`
    };
  } else {
    if (!selector) {
      throw new Error("selector is required for drag position save.");
    }

    dragSelector = selector;
    dragRuleId = `drag-pos::${selector}`;
    newRule = {
      id: dragRuleId,
      type: "customCss",
      selector,
      css: `${selector} { ${styleValue} !important; }`
    };
  }

  const filtered = (existing.rules ?? []).filter((r) => {
    if (r.id === dragRuleId) {
      return false;
    }

    if (
      dragSelector &&
      (r?.type === "moveNode" || r?.type === "pinNode" || r?.type === "pagePinNode") &&
      String(r?.selector ?? "").trim() === dragSelector
    ) {
      return false;
    }

    return true;
  });
  const newRuleSet = sanitizeRuleSet({ rules: [...filtered, newRule] }, { hostname });
  await saveSiteRuleSet(hostname, newRuleSet);

  return { site: { tabId: tab.id, hostname }, saved: true };
}

function resolveContentScriptFile() {
  const manifest = chrome.runtime.getManifest();
  const serviceWorkerPath = String(manifest.background?.service_worker ?? "");
  return serviceWorkerPath.includes("/") ? "extension/content-script.js" : "content-script.js";
}
