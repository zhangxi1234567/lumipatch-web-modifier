import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_SETTINGS,
  deleteSiteRuleSet,
  exportSiteRuleSet,
  getSiteHistoryState,
  getSiteRuleSet,
  importSiteRuleSet,
  redoSiteRuleSet,
  recordSiteRuleSnapshot,
  saveSiteRuleSet,
  undoSiteRuleSet,
  sanitizeSettings,
  sanitizeSiteRuleSets
} from "../extension/lib/storage.js";

let localState;

test.beforeEach(() => {
  localState = {};
  globalThis.chrome = {
    storage: {
      local: {
        async get(defaults = {}) {
          return {
            ...defaults,
            ...localState
          };
        },
        async set(values = {}) {
          localState = {
            ...localState,
            ...values
          };
        }
      },
      sync: {
        async get(defaults = {}) {
          return defaults;
        },
        async set() {}
      },
      managed: {
        async get() {
          return {};
        }
      }
    }
  };
});

test.afterEach(() => {
  delete globalThis.chrome;
});

test("sanitizeSettings falls back to modern modifier defaults", () => {
  const settings = sanitizeSettings({
    workspaceName: "  My Modifier  ",
    baseUrl: " https://example.com/ ",
    apiKey: " key ",
    model: " claude-test ",
    maxTokens: "not-a-number",
    pageBodyMaxChars: 200,
    autoPreviewGeneratedRules: "yes",
    enableMutationObserver: false
  });

  assert.equal(settings.workspaceName, "My Modifier");
  assert.equal(settings.baseUrl, "https://example.com/");
  assert.equal(settings.apiKey, "key");
  assert.equal(settings.model, "claude-test");
  assert.equal(settings.maxTokens, DEFAULT_SETTINGS.maxTokens);
  assert.equal(settings.pageBodyMaxChars, DEFAULT_SETTINGS.pageBodyMaxChars);
  assert.equal(settings.autoPreviewGeneratedRules, DEFAULT_SETTINGS.autoPreviewGeneratedRules);
  assert.equal(settings.enableMutationObserver, false);
});

test("sanitizeSiteRuleSets normalizes hostnames and filters invalid rules", () => {
  const siteRuleSets = sanitizeSiteRuleSets({
    " Example.COM ": {
      summary: "Dark theme",
      rules: [
        {
          type: "style",
          selector: "body",
          declarations: {
            background: "#111111"
          }
        },
        {
          type: "not-supported",
          selector: ".ignored"
        }
      ]
    }
  });

  assert.deepEqual(Object.keys(siteRuleSets), ["example.com"]);
  assert.equal(siteRuleSets["example.com"].rules.length, 1);
  assert.equal(siteRuleSets["example.com"].rules[0].type, "style");
  assert.equal(siteRuleSets["example.com"].rules[0].selector, "body");
});

test("site rule history tracks snapshots, undo, redo, and delete operations", async () => {
  const firstRuleSet = {
    hostname: "example.com",
    summary: "First pass",
    rules: [
      {
        type: "setText",
        selector: ".title",
        text: "Hello"
      }
    ]
  };
  const secondRuleSet = {
    hostname: "example.com",
    summary: "Second pass",
    rules: [
      {
        type: "setText",
        selector: ".title",
        text: "Welcome"
      }
    ]
  };

  await saveSiteRuleSet("Example.COM", firstRuleSet);
  await saveSiteRuleSet("example.com", secondRuleSet);

  assert.equal((await getSiteRuleSet("example.com")).rules[0].text, "Welcome");
  assert.deepEqual(await getSiteHistoryState("example.com"), {
    canUndo: true,
    canRedo: false,
    undoCount: 1,
    redoCount: 0
  });

  await undoSiteRuleSet("example.com");
  assert.equal((await getSiteRuleSet("example.com")).rules[0].text, "Hello");
  assert.deepEqual(await getSiteHistoryState("example.com"), {
    canUndo: false,
    canRedo: true,
    undoCount: 0,
    redoCount: 1
  });

  await redoSiteRuleSet("example.com");
  assert.equal((await getSiteRuleSet("example.com")).rules[0].text, "Welcome");

  await deleteSiteRuleSet("example.com");
  assert.equal(await getSiteRuleSet("example.com"), null);
  assert.deepEqual(await getSiteHistoryState("example.com"), {
    canUndo: true,
    canRedo: false,
    undoCount: 2,
    redoCount: 0
  });

  await undoSiteRuleSet("example.com");
  assert.equal((await getSiteRuleSet("example.com")).rules[0].text, "Welcome");
});

test("site rule packages export and import safely with normalization", async () => {
  const ruleSet = {
    hostname: "example.com",
    summary: "Dark theme",
    rules: [
      {
        type: "style",
        selector: "body",
        declarations: {
          background: "#111111"
        }
      }
    ]
  };

  await recordSiteRuleSnapshot(" Example.COM ", ruleSet, { reason: "save" });

  const exported = await exportSiteRuleSet("example.com");
  assert.equal(exported.kind, "claude-web-modifier-site-rules");
  assert.equal(exported.hostname, "example.com");
  assert.equal(exported.ruleSet.rules[0].selector, "body");

  const imported = await importSiteRuleSet({
    kind: "claude-web-modifier-site-rules",
    hostname: " Example.com ",
    ruleSet: exported.ruleSet
  });

  assert.equal(imported.hostname, "example.com");
  assert.equal(imported.ruleSet.rules.length, 1);
  assert.equal(imported.ruleSet.rules[0].type, "style");
});

test("site rule import rejects invalid payloads clearly", async () => {
  await assert.rejects(() => importSiteRuleSet(null), /Invalid site rule package/);
  await assert.rejects(
    () =>
      importSiteRuleSet({
        kind: "wrong-kind",
        hostname: "example.com",
        ruleSet: {}
      }),
    /Invalid site rule package kind/
  );
  await assert.rejects(
    () =>
      importSiteRuleSet({
        kind: "claude-web-modifier-site-rules",
        ruleSet: {}
      }),
    /hostname is required/
  );
});
