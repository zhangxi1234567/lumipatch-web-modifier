# Follow Page Scroll Fix - Implementation Plan

**Goal:** Make `跟随页面滚动` truly keep the dragged element in page flow instead of leaving it fixed to the viewport.
**Approach:** Preserve drag placement state until the user chooses a save mode, then commit either page-flow placement (`moveNode`) or viewport-fixed placement (`pinNode`) from the same final drop position.

## Checkpoint 1: Confirm the Broken State Flow
- [ ] Task 1: Inspect drag mouseup cleanup timing
  - **Action:** Review `handleDragMouseUp`, `commitDragSaveMode`, and `commitElementIntoPageFlow`.
  - **Verify:** Confirm whether `placeholder`, `sourceSelector`, or `target` are cleared before mode selection.

## Checkpoint 2: Preserve Placement State Until Choice
- [ ] Task 1: Delay drag cleanup until after save-mode decision
  - **Action:** Keep `placeholder`, `sourceSelector`, and the dragged element available while the chooser is open.
  - **Verify:** `follow page` can still access the placeholder and current DOM drop position.
- [ ] Task 2: Add a shared cleanup helper
  - **Action:** Centralize post-choice drag state cleanup.
  - **Verify:** Both `follow page` and `fixed screen` paths end in a clean state.

## Checkpoint 3: Verify Real Follow-Page Behavior
- [ ] Task 1: Save `follow page` from page-flow state
  - **Action:** Build `moveNode` before cleanup, then reinsert the live element into page flow.
  - **Verify:** Scrolling moves the element with the document, not the viewport.
- [ ] Task 2: Keep fixed-screen behavior unchanged
  - **Action:** Leave `pinNode` using viewport coordinates.
  - **Verify:** Scrolling keeps the element fixed when that mode is chosen.

## Verification Criteria
- [ ] `跟随页面滚动` no longer leaves the element fixed to the viewport
- [ ] `固定在屏幕上` still behaves as before
- [ ] Dragging feel remains unchanged before save
