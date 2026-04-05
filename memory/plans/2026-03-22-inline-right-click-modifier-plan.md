# Popup-Only Right-Click Modifier - Implementation Plan

**Goal:** Make the extension open a single inline AI popup directly on normal webpages when the user right-clicks content, without relying on a side panel or a context-menu submenu click.
**Approach:** Keep the Claude-compatible rule engine and per-site storage, but remove side-panel/menu dependencies and let the content script intercept right-click on normal webpages to open the inline editor immediately. Preserve `Shift + 右键` as the native-menu escape hatch.
**Estimated Total Time:** 20-40 minutes

## Checkpoint 1: Simplify the extension shell
- [x] Task 1: Remove side-panel and context-menu permissions from manifests (~5 min)
  - **Action:** Keep only the permissions needed for storage, tabs, scripting, and background requests.
  - **Verify:** The manifests no longer reference side panels or context menus.
- [x] Task 2: Trim background logic to generation/storage only (~5 min)
  - **Action:** Remove menu registration and side-panel handling while keeping the Claude-compatible request pipeline.
  - **Verify:** The background worker only handles page inspection, generation, preview, save, and delete messages.

## Checkpoint 2: Make right-click open the popup directly
- [x] Task 3: Intercept right-click on normal webpages (~5 min)
  - **Action:** On `contextmenu`, capture the current target and selected text, suppress the native menu, and open the inline AI popup immediately.
  - **Verify:** Right-clicking webpage content opens the inline popup without any extra click.
- [x] Task 4: Preserve a native-menu escape hatch (~5 min)
  - **Action:** Allow `Shift + 右键` to bypass the popup and keep the browser's original context menu.
  - **Verify:** Native context menu is still reachable when needed.

## Checkpoint 3: Verify and document
- [x] Task 5: Update tests for popup-only behavior (~5 min)
  - **Action:** Assert that the manifests are popup-free, the background has no menu/side-panel plumbing, and the content script auto-opens on right-click.
  - **Verify:** Tests pass locally.
- [x] Task 6: Update README to describe the popup-only workflow (~5 min)
  - **Action:** Document `右键 -> 弹窗 -> 输入需求 -> 生成并预览 -> 保存到本站`, plus the `Shift + 右键` escape hatch.
  - **Verify:** README matches the final runtime behavior.

## Verification Criteria
- [x] No side panel is required
- [x] No extra menu-item click is required
- [x] Right-click on normal webpages opens the inline popup
- [x] `Shift + 右键` preserves the native context menu
- [x] Tests pass locally
