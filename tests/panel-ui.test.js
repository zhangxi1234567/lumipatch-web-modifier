import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, "..");

async function readProjectFile(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

test("manifests configure the modifier for all frames and related frame fallbacks", async () => {
  const [rootManifestText, extensionManifestText] = await Promise.all([
    readProjectFile("manifest.json"),
    readProjectFile("extension/manifest.json")
  ]);

  const rootManifest = JSON.parse(rootManifestText);
  const extensionManifest = JSON.parse(extensionManifestText);

  assert.deepEqual(rootManifest.permissions?.includes("scripting"), true);
  assert.deepEqual(extensionManifest.permissions?.includes("scripting"), true);
  assert.deepEqual(rootManifest.content_scripts?.[0]?.matches, ["<all_urls>"]);
  assert.deepEqual(extensionManifest.content_scripts?.[0]?.matches, ["<all_urls>"]);
  assert.equal(rootManifest.content_scripts?.[0]?.all_frames, true);
  assert.equal(extensionManifest.content_scripts?.[0]?.all_frames, true);
  assert.equal(rootManifest.content_scripts?.[0]?.match_about_blank, true);
  assert.equal(extensionManifest.content_scripts?.[0]?.match_about_blank, true);
  assert.equal(rootManifest.content_scripts?.[0]?.match_origin_as_fallback, true);
  assert.equal(extensionManifest.content_scripts?.[0]?.match_origin_as_fallback, true);
});

test("background injects the content script into existing tabs, updated tabs, and all frames", async () => {
  const backgroundJs = await readProjectFile("extension/background.js");

  assert.match(backgroundJs, /chrome\.runtime\.onInstalled\.addListener/);
  assert.match(backgroundJs, /chrome\.runtime\.onStartup\.addListener/);
  assert.match(backgroundJs, /chrome\.tabs\.onUpdated\.addListener/);
  assert.match(backgroundJs, /injectIntoExistingTabs/);
  assert.match(backgroundJs, /injectIntoTab/);
  assert.match(backgroundJs, /resolveContentScriptFile/);
  assert.match(backgroundJs, /serviceWorkerPath\.includes\("\/"\)/);
  assert.match(backgroundJs, /"extension\/content-script\.js"/);
  assert.match(backgroundJs, /"content-script\.js"/);
  assert.match(backgroundJs, /allFrames:\s*true/);
  assert.match(backgroundJs, /injectImmediately:\s*true/);
});

test("background supports saved-rule history and transfer message handlers", async () => {
  const backgroundJs = await readProjectFile("extension/background.js");

  assert.match(backgroundJs, /case "rules:undo"/);
  assert.match(backgroundJs, /case "rules:redo"/);
  assert.match(backgroundJs, /case "rules:export"/);
  assert.match(backgroundJs, /case "rules:import"/);
  assert.match(backgroundJs, /case "rules:save-drag"/);
  assert.match(backgroundJs, /request\?\.dragRule/);
  assert.match(backgroundJs, /type:\s*"moveNode"/);
  assert.match(backgroundJs, /type:\s*"pagePinNode"/);
  assert.match(backgroundJs, /type:\s*"pinNode"/);
  assert.match(backgroundJs, /getSiteHistoryState/);
  assert.match(backgroundJs, /saveImportedSiteRuleSet/);
  assert.match(backgroundJs, /exportSiteRuleSet/);
});

test("content script auto-opens the inline editor on right-click, guards duplicate injection, and keeps Shift+right-click as escape hatch", async () => {
  const contentScriptJs = await readProjectFile("extension/content-script.js");

  assert.match(contentScriptJs, /__claudeWebModifierContentScriptLoaded/);
  assert.match(contentScriptJs, /document\.addEventListener\("contextmenu"/);
  assert.match(contentScriptJs, /if \(event\.shiftKey\)/);
  assert.match(contentScriptJs, /event\.preventDefault\(\)/);
  assert.match(contentScriptJs, /openInlineEditor/);
  assert.match(contentScriptJs, /saveInlineRuleSet/);
  assert.match(contentScriptJs, /handlePointerDown/);
});

test("repeated inline modifications surface errors and keep extension-owned UI out of later runs", async () => {
  const [contentScriptJs, backgroundJs] = await Promise.all([
    readProjectFile("extension/content-script.js"),
    readProjectFile("extension/background.js")
  ]);

  assert.match(contentScriptJs, /data-claude-web-modifier-owned/);
  assert.match(contentScriptJs, /RUNTIME_MESSAGE_TIMEOUT_MS/);
  assert.match(contentScriptJs, /formatInlineError/);
  assert.match(contentScriptJs, /生成失败：/);
  assert.match(contentScriptJs, /保存失败：/);
  assert.match(contentScriptJs, /清除失败：/);
  assert.match(contentScriptJs, /hasRelevantMutations/);
  assert.match(contentScriptJs, /!isExtensionOwnedElement\(element\)/);

  assert.match(backgroundJs, /RULE_GENERATION_TIMEOUT_MS/);
  assert.match(backgroundJs, /AbortController/);
  assert.match(backgroundJs, /规则生成超时/);
  assert.match(backgroundJs, /data-claude-web-modifier-owned/);
  assert.match(backgroundJs, /getSanitizedBodyText/);
  assert.match(backgroundJs, /querySelectorAll\(`\$\{OWNED_SELECTOR\}, script, style, noscript`\)/);
});

test("inline editor measures the real panel size so it stays inside the viewport near page edges", async () => {
  const contentScriptJs = await readProjectFile("extension/content-script.js");

  assert.match(contentScriptJs, /state\.inline\.panel = root\.querySelector\("\.cwm-inline-panel"\)/);
  assert.match(contentScriptJs, /max-height: calc\(100vh - 32px\)/);
  assert.match(contentScriptJs, /overscroll-behavior: contain/);
  assert.match(contentScriptJs, /data-placement="top"/);
  assert.match(contentScriptJs, /getBoundingClientRect\(\)/);
  assert.match(contentScriptJs, /availableBelow/);
  assert.match(contentScriptJs, /availableAbove/);
  assert.match(contentScriptJs, /state\.inline\.root\.style\.visibility = "hidden"/);
});

test("content script supports visual target picking with a popup button, Ctrl+Shift+X hotkey, and lasso drag flow", async () => {
  const contentScriptJs = await readProjectFile("extension/content-script.js");

  assert.match(contentScriptJs, /const PICKER_ROOT_ID = "claude-web-modifier-picker-root"/);
  assert.match(contentScriptJs, /document\.addEventListener\("mousemove", handlePointerMove, true\)/);
  assert.match(contentScriptJs, /document\.addEventListener\("mouseup", handlePointerUp, true\)/);
  assert.match(contentScriptJs, /event\.ctrlKey && event\.shiftKey && event\.key\.toLowerCase\(\) === "x"/);
  assert.match(contentScriptJs, /class="cwm-inline-pick"/);
  assert.match(contentScriptJs, /圈选目标 \/ 画圈/);
  assert.match(contentScriptJs, /startPickerMode/);
  assert.match(contentScriptJs, /stopPickerMode/);
  assert.match(contentScriptJs, /handlePickerPointerDown/);
  assert.match(contentScriptJs, /handlePickerPointerUp/);
  assert.match(contentScriptJs, /resolveLassoSelection/);
  assert.match(contentScriptJs, /pickPreferredLassoTargetFromStack/);
  assert.match(contentScriptJs, /getLassoTargetPriority/);
  assert.match(contentScriptJs, /isMeaningfulLassoTarget/);
  assert.match(contentScriptJs, /pointInPolygon/);
  assert.match(contentScriptJs, /cwm-picker-box/);
  assert.match(contentScriptJs, /cwm-picker-badge/);
  assert.match(contentScriptJs, /cwm-picker-lasso/);
  assert.match(contentScriptJs, /document\.documentElement\.style\.cursor = "crosshair"/);
});

test("drag mode supports free placement of live elements with placeholder persistence and click suppression", async () => {
  const contentScriptJs = await readProjectFile("extension/content-script.js");

  assert.match(contentScriptJs, /document\.addEventListener\("click", handleDragClick, true\)/);
  assert.match(contentScriptJs, /applyPinNodeRule/);
  assert.match(contentScriptJs, /finalizePinnedElement/);
  assert.match(contentScriptJs, /hydratePinnedPlaceholder/);
  assert.match(contentScriptJs, /createPlaceholderForPinnedElement/);
  assert.match(contentScriptJs, /positionDraggedPreview/);
  assert.match(contentScriptJs, /saveDropRule/);
  assert.match(contentScriptJs, /const currentRect = el\.getBoundingClientRect\(\)/);
  assert.match(contentScriptJs, /el\.style\.left = `\$\{currentRect\.left\}px`/);
  assert.match(contentScriptJs, /el\.style\.top = `\$\{currentRect\.top\}px`/);
  assert.match(contentScriptJs, /!state\.drag\.dragging && !state\.drag\.pendingTarget/);
  assert.match(contentScriptJs, /if \(state\.drag\.dragging \|\| state\.drag\.pendingTarget\) \{/);
  assert.match(contentScriptJs, /type:\s*"pinNode"/);
  assert.match(contentScriptJs, /type:\s*"pagePinNode"/);
  assert.match(contentScriptJs, /documentLeft:/);
  assert.match(contentScriptJs, /documentTop:/);
  assert.match(contentScriptJs, /DRAG_LAYER_MIN/);
  assert.match(contentScriptJs, /DRAG_LAYER_MAX/);
  assert.match(contentScriptJs, /dragLayerToZIndex/);
  assert.match(contentScriptJs, /zIndexToDragLayer/);
  assert.match(contentScriptJs, /syncDragLayerUi/);
  assert.match(contentScriptJs, /ensureLiveDragLayerBadge/);
  assert.match(contentScriptJs, /openLiveDragLayerBadge/);
  assert.match(contentScriptJs, /closeLiveDragLayerBadge/);
  assert.match(contentScriptJs, /syncLiveDragLayerBadge/);
  assert.match(contentScriptJs, /positionLiveDragLayerBadge/);
  assert.match(contentScriptJs, /实时层级/);
  assert.match(contentScriptJs, /滚轮切层/);
  assert.match(contentScriptJs, /handleDragWheel/);
  assert.match(contentScriptJs, /document\.addEventListener\("wheel", handleDragWheel, true\)/);
  assert.match(contentScriptJs, /event\.key === "\]"/);
  assert.match(contentScriptJs, /event\.key === "\["/);
  assert.match(contentScriptJs, /event\.key === "PageUp"/);
  assert.match(contentScriptJs, /event\.key === "PageDown"/);
  assert.match(contentScriptJs, /setDragLayer\(DRAG_LAYER_MAX\)/);
  assert.match(contentScriptJs, /setDragLayer\(getCurrentDragLayer\(\) \+ 1\)/);
  assert.match(contentScriptJs, /setDragLayer\(getCurrentDragLayer\(\) - 1\)/);
  assert.match(contentScriptJs, /setDragLayer\(DRAG_LAYER_MIN\)/);
  assert.match(contentScriptJs, /当前层级/);
  assert.match(contentScriptJs, /像一摞书一样排序/);
  assert.match(contentScriptJs, /left:/);
  assert.match(contentScriptJs, /top:/);
  assert.match(contentScriptJs, /width:/);
  assert.match(contentScriptJs, /height:/);
  assert.match(contentScriptJs, /state\.savedRuleSet = sanitizeRuleSet\(stored\.siteRuleSets\?\.\[getSiteKey\(\)\]\)/);
  assert.match(contentScriptJs, /function isSelectorUnique\(/);
  assert.match(contentScriptJs, /function buildSelectorSegment\(/);
  assert.match(contentScriptJs, /function getStableAttributeSelector\(/);
  assert.match(contentScriptJs, /if \(isSelectorUnique\(idSelector, element\)\)/);
  assert.match(contentScriptJs, /if \(isSelectorUnique\(testSelector, element\)\)/);
  assert.match(contentScriptJs, /depth < 12/);
  assert.match(contentScriptJs, /data-cwm-pinned-placeholder-for/);
  assert.match(contentScriptJs, /data-cwm-pin-source-selector/);
  assert.match(contentScriptJs, /targetParentSelector:\s*String\(rule\.targetParentSelector/);
  assert.match(contentScriptJs, /beforeSelector:\s*String\(rule\.beforeSelector/);
  assert.match(contentScriptJs, /state\.drag\.sourceSelector =[\s\S]*buildSelector\(el\)/);
  assert.match(contentScriptJs, /insertBefore\(placeholder, el\)/);
  assert.match(contentScriptJs, /promotePinnedElementToViewportHost/);
  assert.match(contentScriptJs, /restoreDraggedElementDomPosition/);
  assert.match(contentScriptJs, /appendChild\(element\)/);
  assert.match(contentScriptJs, /placeholder\.parentElement\.insertBefore\(target, placeholder\.nextSibling \?\? null\)/);
  assert.match(contentScriptJs, /findPinnedElementsBySourceSelector/);
  assert.match(contentScriptJs, /findDirectMatchesBySelector/);
  assert.match(contentScriptJs, /findDirectMatchesBySelector\(selector\)\[0\][\s\S]*findPinnedElementsBySourceSelector\(selector\)\[0\]/);
  assert.match(contentScriptJs, /shouldPreferExistingPinnedMenuTarget/);
  assert.match(contentScriptJs, /isDropdownLikePinnedTarget/);
  assert.match(contentScriptJs, /resolveDragPointerOffset/);
  assert.match(contentScriptJs, /if \(isDropdownLikePinnedTarget\(element\)\) \{[\s\S]*offsetX: rect\.width \* 0\.5,[\s\S]*offsetY: rect\.height \* 0\.5/);
  assert.match(contentScriptJs, /\? pinnedMatch \|\| directMatch[\s\S]*: directMatch \|\| pinnedMatch/);
  assert.match(contentScriptJs, /\["menuitem", "option"\]\.includes\(role\)/);
  assert.match(contentScriptJs, /\[class\*='dropdown'\], \[class\*='submenu'\]/);
  assert.match(contentScriptJs, /cleanupInactivePinArtifacts\(activePinSelectors\)/);
  assert.match(contentScriptJs, /adoptDirectMatchAsPinnedPlaceholder/);
  assert.match(contentScriptJs, /suppressExtraPinDuplicates/);
  assert.match(contentScriptJs, /suppressPinnedDuplicate/);
  assert.match(contentScriptJs, /PIN_ADOPTED_PLACEHOLDER_ATTRIBUTE/);
  assert.match(contentScriptJs, /PIN_SUPPRESSED_DUPLICATE_ATTRIBUTE/);
  assert.match(contentScriptJs, /!element\.hasAttribute\(PIN_SUPPRESSED_DUPLICATE_ATTRIBUTE\)/);
  assert.match(contentScriptJs, /const extraPinnedMatches = findPinnedElementsBySourceSelector\(selector\)/);
  assert.match(contentScriptJs, /element\.style\.display = "none"/);
  assert.match(contentScriptJs, /isMisplacedViewportPlaceholder/);
  assert.match(contentScriptJs, /event\.stopImmediatePropagation\(\)/);
  assert.match(contentScriptJs, /state\.drag\.suppressClick/);
});

test("README documents click-to-pick, lasso flow, and live free placement drag", async () => {
  const readme = await readProjectFile("README.md");

  assert.match(readme, /click `圈选目标` and drag along the page with your mouse to draw a freehand lasso/);
  assert.match(readme, /supports both quick click selection and freehand drag\/lasso selection/);
  assert.match(readme, /prefer the content inside the loop/);
  assert.match(readme, /color and style edits stay on the circled target/);
  assert.match(readme, /drag page elements to arbitrary screen positions/i);
  assert.match(readme, /empty placeholder behind/i);
  assert.match(readme, /original live element/i);
  assert.match(readme, /saved automatically by default/i);
  assert.match(readme, /dragging does not also click the moved element/i);
  assert.match(readme, /单击/);
  assert.match(readme, /按住拖拽/);
  assert.match(readme, /Esc/);
});

test("popup shell exposes undo, redo, export, import, and history metadata controls", async () => {
  const [popupHtml, popupCss] = await Promise.all([
    readProjectFile("extension/popup.html"),
    readProjectFile("extension/popup.css")
  ]);

  assert.match(popupHtml, /id="undo-saved"/);
  assert.match(popupHtml, /id="redo-saved"/);
  assert.match(popupHtml, /id="export-saved"/);
  assert.match(popupHtml, /id="import-saved"/);
  assert.match(popupHtml, /id="import-file-input"/);
  assert.match(popupHtml, /id="saved-history-meta"/);
  assert.match(popupCss, /management-card/);
  assert.match(popupCss, /management-actions/);
  assert.match(popupCss, /management-meta/);
});

test("popup and inline editor present friendly summaries instead of raw JSON output", async () => {
  const [popupHtml, popupJs, contentScriptJs] = await Promise.all([
    readProjectFile("extension/popup.html"),
    readProjectFile("extension/popup.js"),
    readProjectFile("extension/content-script.js")
  ]);

  assert.match(popupHtml, /AI 理解/);
  assert.match(popupHtml, /简单说明/);
  assert.doesNotMatch(popupHtml, /Raw JSON \/ notes/);
  assert.match(popupJs, /buildFriendlyRuleNarrative/);
  assert.match(contentScriptJs, /buildInlineRuleNarrative/);
  assert.doesNotMatch(contentScriptJs, /查看生成结果/);
});
