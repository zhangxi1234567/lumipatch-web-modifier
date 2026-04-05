import test from "node:test";
import assert from "node:assert/strict";

import {
  buildRuleGenerationSystemPrompt,
  buildRuleRepairSystemPrompt,
  buildRuleRepairUserPrompt,
  buildRuleGenerationUserPrompt,
  extractRuleSetFromText,
  inferRuleSetFromInstruction,
  mergeRuleSets,
  sanitizeRuleSet
} from "../extension/lib/rules.js";

test("sanitizeRuleSet keeps supported rule types and discards invalid ones", () => {
  const ruleSet = sanitizeRuleSet(
    {
      hostname: "example.com",
      summary: "Custom page theme",
      rules: [
        {
          type: "hide",
          selector: ".ad-banner"
        },
        {
          type: "style",
          selector: "body",
          declarations: {
            background: "#101010",
            color: "#f9f0e7"
          }
        },
        {
          type: "moveNode",
          selector: ".nav-home",
          targetParentSelector: ".sidebar-history",
          beforeSelector: ".history-item:nth-of-type(1)"
        },
        {
          type: "pinNode",
          selector: ".logo",
          left: 880,
          top: 36,
          width: 48,
          height: 48,
          zIndex: 2147483644
        },
        {
          type: "pagePinNode",
          selector: ".floating-card",
          documentLeft: 1440,
          documentTop: 820,
          width: 320,
          height: 180,
          zIndex: 2147483644
        },
        {
          type: "unknown"
        }
      ]
    },
    {
      hostname: "example.com"
    }
  );

  assert.equal(ruleSet.hostname, "example.com");
  assert.equal(ruleSet.rules.length, 5);
  assert.equal(ruleSet.rules[0].type, "hide");
  assert.equal(ruleSet.rules[1].type, "style");
  assert.equal(ruleSet.rules[2].type, "moveNode");
  assert.equal(ruleSet.rules[2].selector, ".nav-home");
  assert.equal(ruleSet.rules[2].targetParentSelector, ".sidebar-history");
  assert.equal(ruleSet.rules[2].beforeSelector, ".history-item:nth-of-type(1)");
  assert.equal(ruleSet.rules[3].type, "pinNode");
  assert.equal(ruleSet.rules[3].selector, ".logo");
  assert.equal(ruleSet.rules[3].left, 880);
  assert.equal(ruleSet.rules[3].top, 36);
  assert.equal(ruleSet.rules[4].type, "pagePinNode");
  assert.equal(ruleSet.rules[4].selector, ".floating-card");
  assert.equal(ruleSet.rules[4].documentLeft, 1440);
  assert.equal(ruleSet.rules[4].documentTop, 820);
});

test("extractRuleSetFromText reads fenced JSON output from the model", () => {
  const ruleSet = extractRuleSetFromText(
    [
      "Here you go:",
      "```json",
      JSON.stringify(
        {
          summary: "Darken the site and rename the button",
          rules: [
            {
              type: "style",
              selector: "body",
              declarations: {
                background: "#111111"
              }
            },
            {
              type: "setText",
              selector: "button.primary",
              text: "Reply"
            }
          ]
        },
        null,
        2
      ),
      "```"
    ].join("\n"),
    {
      hostname: "example.com"
    }
  );

  assert.equal(ruleSet.hostname, "example.com");
  assert.equal(ruleSet.rules.length, 2);
  assert.equal(ruleSet.rules[1].type, "setText");
});

test("extractRuleSetFromText accepts grok-style customCss and styles payloads", () => {
  const ruleSet = extractRuleSetFromText(
    [
      "```json",
      JSON.stringify(
        {
          summary: "Soft blue pink page theme",
          rules: [
            {
              customCss:
                "body { background: linear-gradient(135deg, #f0e6ff, #e6f0ff, #ffe6f0) !important; }"
            },
            {
              selector: "a",
              styles: {
                color: "#9b7fd9"
              }
            }
          ]
        },
        null,
        2
      ),
      "```"
    ].join("\n"),
    {
      hostname: "example.com"
    }
  );

  assert.equal(ruleSet.hostname, "example.com");
  assert.equal(ruleSet.rules.length, 2);
  assert.equal(ruleSet.rules[0].type, "customCss");
  assert.match(ruleSet.rules[0].css, /linear-gradient/i);
  assert.equal(ruleSet.rules[1].type, "style");
  assert.equal(ruleSet.rules[1].selector, "a");
  assert.equal(ruleSet.rules[1].declarations?.color, "#9b7fd9");
});

test("extractRuleSetFromText converts css-string rule arrays into customCss rules", () => {
  const ruleSet = extractRuleSetFromText(
    [
      "```json",
      JSON.stringify(
        {
          summary: "Soft palette theme",
          customCss: "body { background: #f6f8ff !important; }",
          rules: [
            "button { background: #ffb6c1 !important; }",
            "main { color: #32415a !important; }"
          ]
        },
        null,
        2
      ),
      "```"
    ].join("\n"),
    {
      hostname: "example.com"
    }
  );

  assert.equal(ruleSet.hostname, "example.com");
  assert.equal(ruleSet.rules.length, 2);
  assert.equal(ruleSet.rules[0].type, "customCss");
  assert.match(ruleSet.rules[0].css, /background:\s*#f6f8ff/i);
  assert.equal(ruleSet.rules[1].type, "customCss");
  assert.match(ruleSet.rules[1].css, /button\s*\{/i);
  assert.match(ruleSet.rules[1].css, /main\s*\{/i);
});

test("sanitizeRuleSet accepts replaceNode rule with safe html payload", () => {
  const ruleSet = sanitizeRuleSet(
    {
      hostname: "example.com",
      rules: [
        {
          type: "replaceNode",
          selector: ".cta",
          html: "<button>立即下载</button>",
          preserveText: true
        }
      ]
    },
    { hostname: "example.com" }
  );

  assert.equal(ruleSet.rules.length, 1);
  assert.equal(ruleSet.rules[0].type, "replaceNode");
  assert.equal(ruleSet.rules[0].selector, ".cta");
  assert.equal(ruleSet.rules[0].html, "<button>立即下载</button>");
  assert.equal(ruleSet.rules[0].replaceOnce, true);
});

test("sanitizeRuleSet preserves replaceNode html retention flags", () => {
  const ruleSet = sanitizeRuleSet(
    {
      hostname: "example.com",
      rules: [
        {
          type: "replaceNode",
          selector: ".cta",
          html: "<button>{{content}}</button>",
          preserveText: true,
          preserveHref: true,
          preserveHtml: true,
          replaceOnce: false
        }
      ]
    },
    { hostname: "example.com" }
  );

  assert.equal(ruleSet.rules.length, 1);
  assert.equal(ruleSet.rules[0].preserveText, true);
  assert.equal(ruleSet.rules[0].preserveHref, true);
  assert.equal(ruleSet.rules[0].preserveHtml, true);
  assert.equal(ruleSet.rules[0].replaceOnce, false);
});

test("inferRuleSetFromInstruction can switch selected target into a button component", () => {
  const ruleSet = inferRuleSetFromInstruction({
    instruction: "把这个改成按钮组件",
    hostname: "example.com",
    targetContext: {
      selector: ".hero-cta",
      tagName: "div",
      text: "开始使用"
    }
  });

  assert.equal(ruleSet?.rules?.length, 1);
  assert.equal(ruleSet?.rules?.[0]?.type, "replaceNode");
  assert.equal(ruleSet?.rules?.[0]?.selector, ".hero-cta");
  assert.match(ruleSet?.rules?.[0]?.html ?? "", /<button/i);
});

test("rule-generation prompts encode safety, site context, and targeted element context", () => {
  const systemPrompt = buildRuleGenerationSystemPrompt("Prefer concise summaries.");
  const userPrompt = buildRuleGenerationUserPrompt({
    instruction: "把这个按钮改成立即下载。",
    pageContext: {
      title: "Example",
      url: "https://example.com",
      hostname: "example.com",
      bodyText: "Example website body",
      domHints: [
        {
          selector: "header nav",
          text: "Home Pricing Docs"
        }
      ]
    },
    targetContext: {
      selector: "main .cta-button",
      tagName: "button",
      text: "Start now",
      selectedText: "Start now"
    }
  });

  assert.match(systemPrompt, /Return raw JSON only/i);
  assert.match(systemPrompt, /Never output JavaScript/i);
  assert.match(systemPrompt, /you MUST use targetContext\.selector verbatim/i);
  assert.match(systemPrompt, /Do not add layout or position declarations/i);
  assert.match(userPrompt, /把这个按钮改成立即下载。/);
  assert.match(userPrompt, /main \.cta-button/);
  assert.match(userPrompt, /"selectedText": "Start now"/);
});

test("repair prompts preserve the invalid output and target context for a second-pass fix", () => {
  const systemPrompt = buildRuleRepairSystemPrompt("Prefer minimal edits.");
  const userPrompt = buildRuleRepairUserPrompt({
    instruction: "你是谁",
    invalidAssistantText: "我是一个 AI 助手。",
    parseError: "The model response did not contain valid JSON rules.",
    targetContext: {
      selector: ".model-selector",
      tagName: "span",
      text: "测试"
    }
  });

  assert.match(systemPrompt, /repair invalid browser-extension webpage modification outputs/i);
  assert.match(systemPrompt, /Return raw JSON only/i);
  assert.match(userPrompt, /我是一个 AI 助手/);
  assert.match(userPrompt, /The model response did not contain valid JSON rules/);
  assert.match(userPrompt, /"selector": "\.model-selector"/);
});

test("inferRuleSetFromInstruction can fall back to a direct text replacement on the clicked target", () => {
  const ruleSet = inferRuleSetFromInstruction({
    instruction: "你是谁",
    hostname: "chat.qwen.ai",
    targetContext: {
      selector: "#qwen-chat-header-left > span.ant-dropdown-trigger",
      text: "测试"
    }
  });

  assert.equal(ruleSet?.hostname, "chat.qwen.ai");
  assert.equal(ruleSet?.rules.length, 1);
  assert.equal(ruleSet?.rules[0]?.type, "setText");
  assert.equal(ruleSet?.rules[0]?.text, "你是谁");
});

test("inferRuleSetFromInstruction turns short color-only commands into minimal style rules", () => {
  const ruleSet = inferRuleSetFromInstruction({
    instruction: "改成红色",
    hostname: "chat.qwen.ai",
    targetContext: {
      selector: ".hero-title",
      tagName: "h2",
      text: "风格来创建你的第一个作品"
    },
    preferStyleOnly: true
  });

  assert.equal(ruleSet?.hostname, "chat.qwen.ai");
  assert.equal(ruleSet?.rules.length, 1);
  assert.equal(ruleSet?.rules[0]?.type, "style");
  assert.equal(ruleSet?.rules[0]?.selector, ".hero-title");
  assert.equal(ruleSet?.rules[0]?.declarations?.color, "#ff4d4f");
  assert.equal(ruleSet?.rules[0]?.mergeStrategy, "preserve-non-layout");
});

test("mergeRuleSets appends and overrides targeted rules without dropping earlier site rules", () => {
  const merged = mergeRuleSets(
    {
      hostname: "example.com",
      summary: "Existing changes",
      rules: [
        {
          type: "setText",
          selector: ".hero-title",
          text: "Old title"
        }
      ]
    },
    {
      hostname: "example.com",
      summary: "Right-click button edit",
      rules: [
        {
          type: "setText",
          selector: ".cta-button",
          text: "立即下载"
        },
        {
          type: "setText",
          selector: ".hero-title",
          text: "New title"
        }
      ]
    },
    {
      hostname: "example.com"
    }
  );

  assert.equal(merged.rules.length, 2);
  assert.equal(
    merged.rules.find((rule) => rule.selector === ".hero-title")?.text,
    "New title"
  );
  assert.equal(
    merged.rules.find((rule) => rule.selector === ".cta-button")?.text,
    "立即下载"
  );
});

test("mergeRuleSets keeps the latest moveNode destination for the same selector", () => {
  const merged = mergeRuleSets(
    {
      hostname: "example.com",
      summary: "Move home once",
      rules: [
        {
          type: "moveNode",
          selector: ".nav-home",
          targetParentSelector: ".sidebar-top",
          beforeSelector: ".nav-cloud"
        }
      ]
    },
    {
      hostname: "example.com",
      summary: "Move home again",
      rules: [
        {
          type: "moveNode",
          selector: ".nav-home",
          targetParentSelector: ".sidebar-history",
          beforeSelector: ".history-item:nth-of-type(1)"
        }
      ]
    }
  );

  assert.equal(merged.rules.length, 1);
  assert.equal(merged.rules[0].type, "moveNode");
  assert.equal(merged.rules[0].selector, ".nav-home");
  assert.equal(merged.rules[0].targetParentSelector, ".sidebar-history");
  assert.equal(merged.rules[0].beforeSelector, ".history-item:nth-of-type(1)");
});

test("mergeRuleSets keeps the latest pinNode placement for the same selector", () => {
  const merged = mergeRuleSets(
    {
      hostname: "example.com",
      summary: "Pin logo once",
      rules: [
        {
          type: "pinNode",
          selector: ".logo",
          left: 120,
          top: 30,
          width: 48,
          height: 48,
          zIndex: 9999
        }
      ]
    },
    {
      hostname: "example.com",
      summary: "Pin logo again",
      rules: [
        {
          type: "pinNode",
          selector: ".logo",
          left: 880,
          top: 36,
          width: 48,
          height: 48,
          zIndex: 2147483644
        }
      ]
    }
  );

  assert.equal(merged.rules.length, 1);
  assert.equal(merged.rules[0].type, "pinNode");
  assert.equal(merged.rules[0].selector, ".logo");
  assert.equal(merged.rules[0].left, 880);
  assert.equal(merged.rules[0].top, 36);
});

test("mergeRuleSets keeps the latest pagePinNode placement for the same selector", () => {
  const merged = mergeRuleSets(
    {
      hostname: "example.com",
      summary: "Place card once",
      rules: [
        {
          type: "pagePinNode",
          selector: ".floating-card",
          documentLeft: 400,
          documentTop: 300,
          width: 320,
          height: 180,
          zIndex: 9999
        }
      ]
    },
    {
      hostname: "example.com",
      summary: "Place card again",
      rules: [
        {
          type: "pagePinNode",
          selector: ".floating-card",
          documentLeft: 1440,
          documentTop: 820,
          width: 320,
          height: 180,
          zIndex: 2147483644
        }
      ]
    }
  );

  assert.equal(merged.rules.length, 1);
  assert.equal(merged.rules[0].type, "pagePinNode");
  assert.equal(merged.rules[0].selector, ".floating-card");
  assert.equal(merged.rules[0].documentLeft, 1440);
  assert.equal(merged.rules[0].documentTop, 820);
});

test("mergeRuleSets keeps repeated style edits scoped to the same selector", () => {
  const merged = mergeRuleSets(
    {
      hostname: "example.com",
      summary: "Existing style pass",
      rules: [
        {
          type: "style",
          selector: ".hero-title",
          declarations: {
            color: "#00aa00",
            position: "relative",
            left: "0"
          }
        }
      ]
    },
    {
      hostname: "example.com",
      summary: "Second color pass",
      rules: [
        {
          type: "style",
          selector: ".hero-title",
          declarations: {
            color: "#dd0000"
          },
          mergeStrategy: "preserve-non-layout"
        }
      ]
    },
    {
      hostname: "example.com"
    }
  );

  assert.equal(merged.rules.length, 1);
  assert.equal(merged.rules[0].type, "style");
  assert.equal(merged.rules[0].selector, ".hero-title");
  assert.deepEqual(merged.rules[0].declarations, {
    color: "#dd0000"
  });
});
