# Drag Save Mode Choice - Implementation Plan

**Goal:** Let users choose whether a dragged element should stay fixed on the screen or follow the page layout, while preserving the current freeform drag-to-drop behavior.
**Approach:** Reuse the existing drag gesture, show a compact save-time choice UI with `follow page` as the default, and map the choice to existing `moveNode` and `pinNode` persistence paths.
**Estimated Total Time:** 30 minutes

## Checkpoint 1: Trace Existing Drag Flow
- [x] Task 1: Inspect drag gesture lifecycle in `extension/content-script.js`
  - **Action:** Review drag start, move, mouseup, and `saveDropRule`.
  - **Verify:** Confirm where the save payload is created.
- [x] Task 2: Inspect background save routing
  - **Action:** Review `saveDragPositionForRequestedSite` in `extension/background.js`.
  - **Verify:** Confirm `moveNode` means layout placement and `pinNode` means viewport-fixed placement.

## Checkpoint 2: Add Save-Time Mode Choice
- [ ] Task 1: Add a compact mode chooser UI near drag completion
  - **Action:** Extend the content script inline UI to ask between `follow page` and `fixed on screen`.
  - **Verify:** After dragging, the chooser appears and defaults to `follow page`.
- [ ] Task 2: Preserve current drag feel for both modes
  - **Action:** Keep the same drag preview and drop heuristics; only branch when saving.
  - **Verify:** User can still drag freely and drop where the mouse stops.

## Checkpoint 3: Persist Correct Rule Type
- [ ] Task 1: Save `follow page` as structural placement
  - **Action:** Build a `moveNode` payload from the computed drop container and insertion point.
  - **Verify:** After save and scroll, the block stays with page content.
- [ ] Task 2: Save `fixed on screen` as pinned placement
  - **Action:** Build a `pinNode` payload from the final viewport coordinates.
  - **Verify:** After save and scroll, the block stays fixed in the viewport.

## Checkpoint 4: Verify End-to-End Behavior
- [ ] Task 1: Inspect touched files for scope control
  - **Action:** Review `extension/content-script.js`, `extension/background.js`, and any popup/inline UI changes.
  - **Verify:** Changes are limited to drag mode selection and persistence.
- [ ] Task 2: Validate user-facing behavior
  - **Action:** Confirm defaults and saved semantics in code paths.
  - **Verify:** Default is `follow page`, both modes still support arbitrary drag placement.

## Verification Criteria
- [ ] Dragging still feels the same before save
- [ ] User can choose between `follow page` and `fixed on screen`
- [ ] Default option is `follow page`
- [ ] `follow page` uses page-structure persistence instead of viewport pinning
- [ ] `fixed on screen` preserves the current pinned behavior
