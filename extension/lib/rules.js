const RULE_TYPES = new Set([
  "style",
  "hide",
  "setText",
  "textReplace",
  "attribute",
  "customCss",
  "replaceNode",
  "moveNode",
  "pagePinNode",
  "pinNode"
]);
const STYLE_MERGE_STRATEGIES = new Set(["", "preserve-non-layout", "replace"]);
const COLOR_VALUE_ALIASES = new Map([
  ["红", "#ff4d4f"],
  ["红色", "#ff4d4f"],
  ["绿", "#22c55e"],
  ["绿色", "#22c55e"],
  ["蓝", "#1677ff"],
  ["蓝色", "#1677ff"],
  ["黄", "#facc15"],
  ["黄色", "#facc15"],
  ["橙", "#f97316"],
  ["橙色", "#f97316"],
  ["紫", "#a855f7"],
  ["紫色", "#a855f7"],
  ["黑", "#111111"],
  ["黑色", "#111111"],
  ["白", "#ffffff"],
  ["白色", "#ffffff"],
  ["灰", "#9ca3af"],
  ["灰色", "#9ca3af"],
  ["粉", "#ec4899"],
  ["粉色", "#ec4899"],
  ["青", "#06b6d4"],
  ["青色", "#06b6d4"],
  ["red", "red"],
  ["green", "green"],
  ["blue", "blue"],
  ["yellow", "yellow"],
  ["orange", "orange"],
  ["purple", "purple"],
  ["black", "black"],
  ["white", "white"],
  ["gray", "gray"],
  ["grey", "grey"],
  ["pink", "pink"],
  ["cyan", "cyan"],
  ["transparent", "transparent"]
]);
const LAYOUT_DECLARATION_KEYS = new Set([
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "inset",
  "transform",
  "translate",
  "scale",
  "rotate",
  "display",
  "float",
  "clear",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "flex",
  "flexBasis",
  "flexGrow",
  "flexShrink",
  "grid",
  "gridArea",
  "gridColumn",
  "gridRow",
  "alignItems",
  "alignSelf",
  "justifyContent",
  "justifyItems",
  "placeItems",
  "placeContent"
]);

export function getSiteKeyFromUrl(url) {
  try {
    return new URL(url).hostname.trim().toLowerCase();
  } catch {
    return "";
  }
}

export function sanitizeRuleSet(input, { hostname = "", fallbackSummary = "" } = {}) {
  const siteKey =
    String(input?.hostname ?? input?.siteKey ?? hostname ?? "")
      .trim()
      .toLowerCase() || "unknown-site";

  const rules = Array.isArray(input?.rules)
    ? input.rules.map((rule, index) => normalizeRule(rule, index)).filter(Boolean)
    : [];

  return {
    version: 1,
    hostname: siteKey,
    summary: String(input?.summary ?? fallbackSummary ?? "").trim(),
    generatedAt: String(input?.generatedAt ?? new Date().toISOString()).trim(),
    rules
  };
}

export function normalizeRule(rule, index = 0) {
  if (!rule || typeof rule !== "object") {
    return null;
  }

  const type = inferRuleType(rule);
  if (!RULE_TYPES.has(type)) {
    return null;
  }

  const normalized = {
    id: String(rule.id ?? `rule-${index + 1}`).trim() || `rule-${index + 1}`,
    type,
    label: String(rule.label ?? "").trim()
  };

  if (type === "customCss") {
    const css = String(rule.css ?? rule.customCss ?? "").trim();
    if (!css) {
      return null;
    }

    return {
      ...normalized,
      css
    };
  }

  if (type === "hide") {
    const selector = String(rule.selector ?? "").trim();
    if (!selector) {
      return null;
    }

    return {
      ...normalized,
      selector
    };
  }

  if (type === "style") {
    const selector = String(rule.selector ?? "").trim();
    const declarations = sanitizeDeclarations(
      rule.declarations ?? rule.styles ?? rule.style
    );
    if (!selector || Object.keys(declarations).length === 0) {
      return null;
    }

    return {
      ...normalized,
      selector,
      declarations,
      mergeStrategy: normalizeStyleMergeStrategy(rule.mergeStrategy)
    };
  }

  if (type === "setText") {
    const selector = String(rule.selector ?? "").trim();
    const text = String(rule.text ?? "").trim();
    if (!selector || !text) {
      return null;
    }

    return {
      ...normalized,
      selector,
      text
    };
  }

  if (type === "textReplace") {
    const selector = String(rule.selector ?? "").trim();
    const find = String(rule.find ?? "").trim();
    const replace = String(rule.replace ?? "");
    if (!selector || !find) {
      return null;
    }

    return {
      ...normalized,
      selector,
      find,
      replace,
      matchCase: Boolean(rule.matchCase),
      replaceOnce: Boolean(rule.replaceOnce)
    };
  }

  if (type === "attribute") {
    const selector = String(rule.selector ?? "").trim();
    const attribute = String(rule.attribute ?? rule.name ?? "").trim();
    const value = String(rule.value ?? "");
    if (!selector || !attribute) {
      return null;
    }

    return {
      ...normalized,
      selector,
      attribute,
      value
    };
  }

  if (type === "replaceNode") {
    const selector = String(rule.selector ?? "").trim();
    const html = String(rule.html ?? rule.templateHtml ?? "").trim();
    if (!selector || !html) {
      return null;
    }

    return {
      ...normalized,
      selector,
      html,
      replaceOnce: rule.replaceOnce === undefined ? true : Boolean(rule.replaceOnce),
      preserveText: Boolean(rule.preserveText),
      preserveHref: Boolean(rule.preserveHref),
      preserveHtml: Boolean(rule.preserveHtml)
    };
  }

  if (type === "moveNode") {
    const selector = String(rule.selector ?? "").trim();
    const targetParentSelector = String(
      rule.targetParentSelector ?? rule.parentSelector ?? rule.targetSelector ?? ""
    ).trim();
    const beforeSelector = String(rule.beforeSelector ?? "").trim();
    if (!selector || !targetParentSelector) {
      return null;
    }

    return {
      ...normalized,
      selector,
      targetParentSelector,
      beforeSelector
    };
  }

  if (type === "pinNode") {
    const selector = String(rule.selector ?? "").trim();
    const left = Number.parseFloat(rule.left);
    const top = Number.parseFloat(rule.top);
    const width = Number.parseFloat(rule.width);
    const height = Number.parseFloat(rule.height);
    const zIndex = Number.parseInt(rule.zIndex, 10);

    if (!selector || !Number.isFinite(left) || !Number.isFinite(top)) {
      return null;
    }

    return {
      ...normalized,
      selector,
      left,
      top,
      width: Number.isFinite(width) ? width : 0,
      height: Number.isFinite(height) ? height : 0,
      zIndex: Number.isInteger(zIndex) ? zIndex : 2147483644
    };
  }

  if (type === "pagePinNode") {
    const selector = String(rule.selector ?? "").trim();
    const documentLeft = Number.parseFloat(rule.documentLeft);
    const documentTop = Number.parseFloat(rule.documentTop);
    const width = Number.parseFloat(rule.width);
    const height = Number.parseFloat(rule.height);
    const zIndex = Number.parseInt(rule.zIndex, 10);

    if (!selector || !Number.isFinite(documentLeft) || !Number.isFinite(documentTop)) {
      return null;
    }

    return {
      ...normalized,
      selector,
      documentLeft,
      documentTop,
      width: Number.isFinite(width) ? width : 0,
      height: Number.isFinite(height) ? height : 0,
      zIndex: Number.isInteger(zIndex) ? zIndex : 2147483644
    };
  }

  return null;
}

function inferRuleType(rule) {
  const explicitType = String(rule?.type ?? "").trim();
  if (explicitType && RULE_TYPES.has(explicitType)) {
    return explicitType;
  }

  if (String(rule?.css ?? rule?.customCss ?? "").trim()) {
    return "customCss";
  }

  if (
    String(rule?.selector ?? "").trim() &&
    rule &&
    typeof rule === "object" &&
    (rule.declarations || rule.styles || rule.style)
  ) {
    return "style";
  }

  if (String(rule?.selector ?? "").trim() && String(rule?.html ?? rule?.templateHtml ?? "").trim()) {
    return "replaceNode";
  }

  return explicitType;
}

export function mergeRuleSets(existingRuleSet, incomingRuleSet, { hostname = "" } = {}) {
  const existing = sanitizeRuleSet(existingRuleSet, {
    hostname,
    fallbackSummary: String(existingRuleSet?.summary ?? "").trim()
  });
  const incoming = sanitizeRuleSet(incomingRuleSet, {
    hostname: existing.hostname || hostname,
    fallbackSummary: String(incomingRuleSet?.summary ?? "").trim()
  });

  const mergedRules = [];
  const indexByKey = new Map();

  for (const rule of [...existing.rules, ...incoming.rules]) {
    const key = buildRuleMergeKey(rule);

    if (indexByKey.has(key)) {
      const currentIndex = indexByKey.get(key);
      mergedRules[currentIndex] = mergeRules(mergedRules[currentIndex], rule);
      continue;
    }

    indexByKey.set(key, mergedRules.length);
    mergedRules.push(rule);
  }

  return {
    version: 1,
    hostname: incoming.hostname || existing.hostname || String(hostname ?? "").trim().toLowerCase(),
    summary: [existing.summary, incoming.summary].filter(Boolean).join(" | ").slice(-300),
    generatedAt: new Date().toISOString(),
    rules: mergedRules.map((rule, index) => ({
      ...rule,
      id: String(rule.id ?? `rule-${index + 1}`).trim() || `rule-${index + 1}`
    }))
  };
}

export function buildRuleGenerationSystemPrompt(customPrompt = "") {
  const basePrompt = [
    "You generate safe browser-extension webpage modification rules.",
    "Return raw JSON only. Do not use Markdown fences.",
    'The top-level JSON object must be: {"summary": string, "rules": Rule[]}.',
    "Only use these rule types: style, hide, setText, textReplace, attribute, customCss, replaceNode.",
    "Never output JavaScript, event handlers, remote URLs, or executable code.",
    "Prefer selectors from the provided domHints whenever possible.",
    "If targetContext is present AND targetContext.isPageTheme is false, you MUST use targetContext.selector verbatim as the rule selector — do NOT simplify, broaden, or remove :nth-of-type/:nth-child/:nth-last-of-type from it.",
    "If targetContext.isPageTheme is true, ignore the targetContext.selector and instead generate rules targeting :root, body, and all major structural elements for a full-page theme.",
    "Never replace a specific nth-selector with a class-only or tag-only selector; doing so would affect all matching siblings instead of only the intended one.",
    "If targetContext.selectedText is present and the user asks to change wording, prefer textReplace on the target selector.",
    "If the user wants to replace the whole clicked element, prefer setText on the target selector.",
    "For style rules, use a declarations object with CSS property names as strings.",
    "If the request is only about color or another tiny visual tweak, return the minimum relevant style declarations only.",
    "Do not add layout or position declarations such as position, top, left, right, bottom, display, width, height, margin, padding, or transform unless the user explicitly asks for layout changes.",
    "For textReplace rules, always include selector, find, replace, and optional matchCase.",
    "For replaceNode rules, include selector and html only. html must be safe static HTML (no script, no inline event handlers).",
    "If the request is unclear, return the safest minimal rules that still satisfy it.",
    "For tab bars / nav items (role=tab, role=menuitem, [aria-selected]): target the specific item using its nth-of-type or data-testid selector, not the whole nav container.",
    "For elements using CSS variables (var(--x)): also output a customCss rule that overrides the CSS variable on :root or the nearest scoping element.",
    "For elements with position:sticky or position:fixed: do not change their position unless explicitly requested; only change visual properties.",
    "For SVG elements: use attribute rules to change fill/stroke, or wrap in a style rule using the SVG element selector.",
    "For select/option elements: use style rules on the select selector; for individual options use nth-of-type selectors.",
    "Always use !important in customCss rules to ensure the extension's styles override the page's existing styles.",
    "If targetContext.isInsideNav is true: the target is inside a navigation bar — be careful to scope the selector precisely to avoid affecting other nav items.",
    "If targetContext.computedPosition is 'fixed' or 'sticky': do not add position rules."
  ].join("\n");

  return [String(customPrompt ?? "").trim(), basePrompt].filter(Boolean).join("\n\n");
}

export function buildRuleRepairSystemPrompt(customPrompt = "") {
  const basePrompt = [
    "You repair invalid browser-extension webpage modification outputs into safe JSON rules.",
    "Return raw JSON only. Do not use Markdown fences.",
    'The top-level JSON object must be: {"summary": string, "rules": Rule[]}.',
    "Only use these rule types: style, hide, setText, textReplace, attribute, customCss, replaceNode.",
    "Never output JavaScript, event handlers, remote URLs, or executable code.",
    "If the invalid model output is conversational, ignore it and regenerate the safest minimal rules from the instruction and targetContext.",
    "If targetContext is present, prefer targetContext.selector first and keep modifications scoped to that target whenever possible.",
    "If the instruction is short literal replacement text and targetContext is present, prefer a setText rule on targetContext.selector with that exact text.",
    "For style rules, use a declarations object with CSS property names as strings.",
    "If the request is only about color or another tiny visual tweak, keep the style rule minimal and avoid layout or position declarations unless explicitly requested.",
    "For textReplace rules, always include selector, find, replace, and optional matchCase.",
    "For replaceNode rules, include selector and safe static html (no script, no inline event handlers)."
  ].join("\n");

  return [String(customPrompt ?? "").trim(), basePrompt].filter(Boolean).join("\n\n");
}

export function buildRuleGenerationUserPrompt({
  instruction = "",
  pageContext = null,
  currentRuleSet = null,
  targetContext = null
} = {}) {
  const payload = {
    instruction: String(instruction ?? "").trim(),
    pageContext: {
      title: String(pageContext?.title ?? "").trim(),
      url: String(pageContext?.url ?? "").trim(),
      hostname: String(pageContext?.hostname ?? "").trim(),
      selectionText: String(pageContext?.selectionText ?? "").trim(),
      bodyText: String(pageContext?.bodyText ?? "").trim(),
      domHints: Array.isArray(pageContext?.domHints) ? pageContext.domHints.slice(0, 48) : []
    },
    targetContext: targetContext
      ? {
          selector: String(targetContext.selector ?? "").trim(),
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
        }
      : null,
    currentRuleSet: currentRuleSet?.rules ?? []
  };

  return [
    "Generate webpage modification rules for this active site.",
    targetContext && !targetContext.isPageTheme
      ? `Primary edit target: use EXACTLY "${String(targetContext?.selector ?? "").trim()}" as the selector — copy it character-for-character including any :nth-of-type/:nth-child parts. Do NOT broaden it to a class or tag selector.`
      : "Use stable selectors when possible and keep the rules minimal.",
    JSON.stringify(payload, null, 2)
  ].join("\n\n");
}

export function buildRuleRepairUserPrompt({
  instruction = "",
  pageContext = null,
  currentRuleSet = null,
  targetContext = null,
  invalidAssistantText = "",
  parseError = ""
} = {}) {
  const payload = {
    instruction: String(instruction ?? "").trim(),
    parseError: String(parseError ?? "").trim(),
    invalidAssistantText: String(invalidAssistantText ?? "").trim(),
    pageContext: {
      title: String(pageContext?.title ?? "").trim(),
      url: String(pageContext?.url ?? "").trim(),
      hostname: String(pageContext?.hostname ?? "").trim(),
      selectionText: String(pageContext?.selectionText ?? "").trim(),
      bodyText: String(pageContext?.bodyText ?? "").trim(),
      domHints: Array.isArray(pageContext?.domHints) ? pageContext.domHints.slice(0, 32) : []
    },
    targetContext: targetContext
      ? {
          selector: String(targetContext.selector ?? "").trim(),
          tagName: String(targetContext.tagName ?? "").trim(),
          text: String(targetContext.text ?? "").trim(),
          selectedText: String(targetContext.selectedText ?? "").trim(),
          role: String(targetContext.role ?? "").trim(),
          href: String(targetContext.href ?? "").trim(),
          src: String(targetContext.src ?? "").trim(),
          placeholder: String(targetContext.placeholder ?? "").trim()
        }
      : null,
    currentRuleSet: currentRuleSet?.rules ?? []
  };

  return [
    "Repair this invalid webpage-modification response into valid rules JSON.",
    "If the invalid response is not usable, regenerate the smallest safe rule set that matches the instruction.",
    JSON.stringify(payload, null, 2)
  ].join("\n\n");
}

export function extractRuleSetFromText(rawText, { hostname = "" } = {}) {
  const normalizedText = String(rawText ?? "").trim();
  if (!normalizedText) {
    throw new Error("The model response was empty.");
  }

  const candidate = extractLikelyJson(normalizedText);
  let parsed;

  try {
    parsed = JSON.parse(candidate);
  } catch {
    throw new Error("The model response did not contain valid JSON rules.");
  }

  if (Array.isArray(parsed)) {
    return sanitizeRuleSet({ hostname, rules: parsed }, { hostname });
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("The model response did not contain a rule object.");
  }

  return sanitizeRuleSet(normalizeParsedRulePayload(parsed), {
    hostname,
    fallbackSummary: String(parsed.summary ?? "").trim()
  });
}

function normalizeParsedRulePayload(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return parsed;
  }

  const normalized = { ...parsed };
  const existingRules = Array.isArray(parsed.rules) ? parsed.rules : [];
  const compatibleRules = [];

  const topLevelCss = String(parsed.customCss ?? parsed.css ?? "").trim();
  if (topLevelCss) {
    compatibleRules.push({
      type: "customCss",
      css: topLevelCss
    });
  }

  const cssRuleChunks = existingRules
    .filter((rule) => typeof rule === "string")
    .map((rule) => String(rule).trim())
    .filter(Boolean);
  if (cssRuleChunks.length > 0) {
    compatibleRules.push({
      type: "customCss",
      css: cssRuleChunks.join("\n")
    });
  }

  for (const rule of existingRules) {
    if (rule && typeof rule === "object" && !Array.isArray(rule)) {
      compatibleRules.push(rule);
    }
  }

  if (compatibleRules.length > 0) {
    normalized.rules = compatibleRules;
  }

  return normalized;
}

export function inferRuleSetFromInstruction({
  instruction = "",
  hostname = "",
  targetContext = null,
  preferStyleOnly = false
} = {}) {
  const selector = String(targetContext?.selector ?? "").trim();
  const normalizedInstruction = String(instruction ?? "").trim();
  if (!selector || !normalizedInstruction) {
    return null;
  }

  const inferredStyleRuleSet = inferStyleRuleSetFromInstruction({
    instruction: normalizedInstruction,
    hostname,
    targetContext
  });
  if (inferredStyleRuleSet) {
    return inferredStyleRuleSet;
  }

  const inferredComponentRuleSet = inferComponentTemplateRuleSetFromInstruction({
    instruction: normalizedInstruction,
    hostname,
    targetContext
  });
  if (inferredComponentRuleSet) {
    return inferredComponentRuleSet;
  }

  if (preferStyleOnly) {
    return null;
  }

  const directReplacementText =
    extractReplacementText(normalizedInstruction) || inferBareReplacementText(normalizedInstruction);
  if (!directReplacementText) {
    return null;
  }

  const selectedText = String(targetContext?.selectedText ?? "").trim();
  if (selectedText && selectedText !== directReplacementText) {
    return sanitizeRuleSet(
      {
        hostname,
        summary: `Replace selected text on ${selector}`,
        rules: [
          {
            type: "textReplace",
            selector,
            find: selectedText,
            replace: directReplacementText,
            matchCase: false,
            replaceOnce: true,
            label: `Replace selected text on ${selector}`
          }
        ]
      },
      { hostname }
    );
  }

  return sanitizeRuleSet(
    {
      hostname,
      summary: `Set text on ${selector}`,
      rules: [
        {
          type: "setText",
          selector,
          text: directReplacementText,
          label: `Set text on ${selector}`
        }
      ]
    },
    { hostname }
  );
}

export function describeRule(rule) {
  if (!rule || typeof rule !== "object") {
    return "";
  }

  if (rule.label) {
    return rule.label;
  }

  switch (rule.type) {
    case "style":
      return `Style ${rule.selector}`;
    case "hide":
      return `Hide ${rule.selector}`;
    case "setText":
      return `Set text on ${rule.selector}`;
    case "textReplace":
      return `Replace text in ${rule.selector}`;
    case "attribute":
      return `Set ${rule.attribute} on ${rule.selector}`;
    case "customCss":
      return "Inject custom CSS";
    case "replaceNode":
      return `Replace ${rule.selector} with a UI component template`;
    case "moveNode":
      return `Move ${rule.selector} into ${rule.targetParentSelector}`;
    case "pagePinNode":
      return `Place ${rule.selector} at document (${rule.documentLeft}, ${rule.documentTop})`;
    case "pinNode":
      return `Pin ${rule.selector} at (${rule.left}, ${rule.top})`;
    default:
      return rule.type;
  }
}

function sanitizeDeclarations(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, declarationValue]) => [
        String(key ?? "").trim(),
        String(declarationValue ?? "").trim()
      ])
      .filter(([key, declarationValue]) => key && declarationValue)
  );
}

function normalizeStyleMergeStrategy(value) {
  const normalized = String(value ?? "").trim();
  return STYLE_MERGE_STRATEGIES.has(normalized) ? normalized : "";
}

function buildRuleMergeKey(rule) {
  switch (rule.type) {
    case "style":
      return `style|${rule.selector}`;
    case "hide":
      return `hide|${rule.selector}`;
    case "setText":
      return `setText|${rule.selector}`;
    case "textReplace":
      return `textReplace|${rule.selector}|${rule.find}|${rule.matchCase ? "case" : "nocase"}|${rule.replaceOnce ? "once" : "all"}`;
    case "attribute":
      return `attribute|${rule.selector}|${rule.attribute}`;
    case "customCss":
      return `customCss|${rule.css}`;
    case "replaceNode":
      return `replaceNode|${rule.selector}`;
    case "moveNode":
      return `moveNode|${rule.selector}`;
    case "pagePinNode":
      return `pagePinNode|${rule.selector}`;
    case "pinNode":
      return `pinNode|${rule.selector}`;
    default:
      return `${rule.type}|${rule.selector ?? ""}|${rule.id ?? ""}`;
  }
}

function mergeRules(existingRule, incomingRule) {
  if (existingRule.type !== incomingRule.type) {
    return incomingRule;
  }

  if (existingRule.type === "style") {
    if (incomingRule.mergeStrategy === "replace") {
      return {
        ...existingRule,
        ...incomingRule,
        declarations: {
          ...(incomingRule.declarations ?? {})
        }
      };
    }

    const existingDeclarations =
      incomingRule.mergeStrategy === "preserve-non-layout"
        ? removeLayoutDeclarations(existingRule.declarations ?? {})
        : existingRule.declarations ?? {};

    return {
      ...existingRule,
      ...incomingRule,
      declarations: {
        ...existingDeclarations,
        ...(incomingRule.declarations ?? {})
      }
    };
  }

  return {
    ...existingRule,
    ...incomingRule
  };
}

function extractLikelyJson(value) {
  const fencedMatch = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const startObject = value.indexOf("{");
  const startArray = value.indexOf("[");

  if (startObject === -1 && startArray === -1) {
    return value;
  }

  const startIndex =
    startObject === -1
      ? startArray
      : startArray === -1
        ? startObject
        : Math.min(startObject, startArray);

  const openChar = value[startIndex];
  const closeChar = openChar === "[" ? "]" : "}";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < value.length; index += 1) {
    const character = value[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === "\"") {
        inString = false;
      }
      continue;
    }

    if (character === "\"") {
      inString = true;
      continue;
    }

    if (character === openChar) {
      depth += 1;
    } else if (character === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return value.slice(startIndex, index + 1).trim();
      }
    }
  }

  return value.slice(startIndex).trim();
}

function extractReplacementText(instruction) {
  const patterns = [
    /^(?:把|将)?(?:这|这个|当前)?(?:个|段|行)?(?:按钮|标题|文字|文本|内容)?(?:改成|改为|换成|替换成|设为|设置为|叫做|变成)\s*[“"'「『]?([\s\S]+?)[”"'」』]?[。.!！？?]*$/i,
    /^(?:改成|改为|换成|替换成|设为|设置为|叫做|变成)\s*[“"'「『]?([\s\S]+?)[”"'」』]?[。.!！？?]*$/i
  ];

  for (const pattern of patterns) {
    const match = instruction.match(pattern);
    const candidate = String(match?.[1] ?? "").trim();
    if (candidate) {
      return candidate;
    }
  }

  return "";
}

function inferBareReplacementText(instruction) {
  if (!instruction || instruction.length > 40 || instruction.includes("\n")) {
    return "";
  }

  if (/[{}\[\]<>]/.test(instruction)) {
    return "";
  }

  if (
    /(颜色|背景|字体|字号|宽度|高度|隐藏|删除|移除|样式|主题|布局|边框|圆角|阴影|对齐|链接|属性|css|style|theme|hide|remove|delete|background|color|font|width|height|padding|margin)/i.test(
      instruction
    )
  ) {
    return "";
  }

  return instruction;
}

function inferStyleRuleSetFromInstruction({
  instruction = "",
  hostname = "",
  targetContext = null
} = {}) {
  const selector = String(targetContext?.selector ?? "").trim();
  if (!selector) {
    return null;
  }

  const colorValue = extractColorValue(instruction);
  if (!colorValue) {
    return null;
  }

  const property = inferStylePropertyForColorInstruction(instruction, targetContext);
  if (!property) {
    return null;
  }

  return sanitizeRuleSet(
    {
      hostname,
      summary: `Update ${property} on ${selector}`,
      rules: [
        {
          type: "style",
          selector,
          declarations: {
            [property]: colorValue
          },
          mergeStrategy: "preserve-non-layout",
          label: `Set ${property} on ${selector}`
        }
      ]
    },
    { hostname }
  );
}

function extractColorValue(instruction) {
  const normalizedInstruction = String(instruction ?? "").trim();
  if (!normalizedInstruction) {
    return "";
  }

  const hexMatch = normalizedInstruction.match(
    /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/
  );
  if (hexMatch?.[0]) {
    return hexMatch[0];
  }

  const rgbMatch = normalizedInstruction.match(/\b(?:rgb|rgba|hsl|hsla)\([^)]+\)/i);
  if (rgbMatch?.[0]) {
    return rgbMatch[0];
  }

  const compactInstruction = normalizedInstruction.toLowerCase().replace(/\s+/g, "");
  for (const [alias, colorValue] of COLOR_VALUE_ALIASES.entries()) {
    if (compactInstruction.includes(alias.toLowerCase())) {
      return colorValue;
    }
  }

  return "";
}

function inferStylePropertyForColorInstruction(instruction, targetContext) {
  const normalizedInstruction = String(instruction ?? "");
  const tagName = String(targetContext?.tagName ?? "").trim().toLowerCase();

  if (/(页面|网页|整页|全页|整站|网站|whole.?page|full.?page|entire.?page|site)/i.test(normalizedInstruction)) {
    return "backgroundColor";
  }

  if (/^(html|body|main)$/i.test(tagName)) {
    return "backgroundColor";
  }

  if (/(背景|背景色|background|bg)/i.test(instruction)) {
    return "backgroundColor";
  }

  if (/(边框|描边|border|outline)/i.test(instruction)) {
    return /(outline)/i.test(instruction) ? "outlineColor" : "borderColor";
  }

  if (/(文字|文本|字色|字体|font|text|color|颜色)/i.test(instruction)) {
    return "color";
  }

  return isTextLikeTargetContext(targetContext) ? "color" : "backgroundColor";
}

function isTextLikeTargetContext(targetContext) {
  const tagName = String(targetContext?.tagName ?? "").trim().toLowerCase();
  const text = String(targetContext?.text ?? targetContext?.selectedText ?? "").trim();

  if (/^(button|a|label|p|span|li|h1|h2|h3|h4|h5|h6|small|strong|em)$/i.test(tagName)) {
    return true;
  }

  return Boolean(text);
}

function removeLayoutDeclarations(declarations) {
  return Object.fromEntries(
    Object.entries(declarations ?? {}).filter(
      ([property]) => !LAYOUT_DECLARATION_KEYS.has(String(property ?? "").trim())
    )
  );
}

function inferComponentTemplateRuleSetFromInstruction({
  instruction = "",
  hostname = "",
  targetContext = null
} = {}) {
  const selector = String(targetContext?.selector ?? "").trim();
  if (!selector) {
    return null;
  }

  const normalized = String(instruction ?? "").toLowerCase();
  const originalText = String(targetContext?.text ?? targetContext?.selectedText ?? "").trim() || "立即操作";
  const buttonText = originalText.length > 24 ? originalText.slice(0, 24) : originalText;

  let html = "";
  let summary = "";

  if (/(换成|替换成|改成).*(按钮|button|cta)/i.test(normalized)) {
    html = `<button type="button" style="background: linear-gradient(135deg,#2563eb,#7c3aed); color: #ffffff; border: 0; border-radius: 12px; padding: 10px 18px; font-weight: 700; cursor: pointer;">${escapeHtml(buttonText)}</button>`;
    summary = `Replace ${selector} with a button component`;
  } else if (/(换成|替换成|改成).*(输入框|input|搜索框|search)/i.test(normalized)) {
    html = `<input type="text" placeholder="${escapeHtml(buttonText || "请输入内容")}" style="width: 100%; max-width: 360px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; font-size: 14px; color: #0f172a; background: #ffffff;" />`;
    summary = `Replace ${selector} with an input component`;
  } else if (/(换成|替换成|改成).*(卡片|card)/i.test(normalized)) {
    html = `<div style="border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff; padding: 14px 16px; box-shadow: 0 10px 30px rgba(15,23,42,0.08);"><div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">组件卡片</div><div style="font-size: 15px; color: #0f172a; font-weight: 600;">${escapeHtml(buttonText)}</div></div>`;
    summary = `Replace ${selector} with a card component`;
  } else if (/(换成|替换成|改成).*(标签|tag|badge)/i.test(normalized)) {
    html = `<span style="display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px; background: #e0e7ff; color: #3730a3; font-size: 12px; font-weight: 600;">${escapeHtml(buttonText)}</span>`;
    summary = `Replace ${selector} with a badge component`;
  } else if (/(换成|替换成|改成).*(下拉|select|选择器)/i.test(normalized)) {
    html = `<select style="border: 1px solid #cbd5e1; border-radius: 10px; padding: 8px 10px; background: #ffffff; color: #0f172a;"><option>${escapeHtml(buttonText || "选项 1")}</option><option>选项 2</option><option>选项 3</option></select>`;
    summary = `Replace ${selector} with a select component`;
  }

  if (!html) {
    return null;
  }

  return sanitizeRuleSet(
    {
      hostname,
      summary,
      rules: [
        {
          type: "replaceNode",
          selector,
          html,
          replaceOnce: true,
          preserveText: true,
          preserveHref: true,
          preserveHtml: true,
          label: `Replace ${selector} with UI component`
        }
      ]
    },
    { hostname }
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
