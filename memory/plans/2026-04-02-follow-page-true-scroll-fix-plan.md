# Follow Page True Scroll Fix - Implementation Plan

**Goal:** Make `跟随页面滚动` behave as real page-flow placement instead of viewport-fixed positioning.
**Approach:** Preserve drag placement state until the user chooses a save mode, then commit either a structural `moveNode` save or a viewport `pinNode` save from the same drag result.

## Checkpoint 1: Confirm Root Cause
- [ ] Task 1: Inspect drag mouseup cleanup order
  - **Action:** Review `handleDragMouseUp`, `commitDragSaveMode`, and `commitElementIntoPageFlow`.
  - **Verify:** Confirm whether placeholder/source selector are cleared before mode selection.

## Checkpoint 2: Preserve Drag State Until Choice
- [ ] Task 1: Defer destructive cleanup
  - **Action:** Keep `placeholder`, `sourceSelector`, and other drag placement state alive until the user confirms follow-page or fixed-screen.
  - **Verify:** `buildMoveNodeDragRule` still has the original placeholder/container data when `follow-page` is chosen.
- [ ] Task 2: Centralize post-save cleanup
  - **Action:** Add a single cleanup path invoked after save or cancel.
  - **Verify:** No stale drag state remains after either mode is chosen.

## Checkpoint 3: Verify Follow-Page Semantics
- [ ] Task 1: Commit DOM placement before final cleanup
  - **Action:** Insert the dragged node back into page flow at the placeholder location when `follow-page` is chosen.
  - **Verify:** The element belongs to normal page layout rather than staying `position: fixed`.
- [ ] Task 2: Keep fixed-screen semantics unchanged
  - **Action:** Preserve existing pinned behavior for `fixed-screen`.
  - **Verify:** `pinNode` still saves viewport-fixed coordinates.

## Verification Criteria
- [ ] `跟随页面滚动` no longer remains fixed in the viewport
- [ ] `固定在屏幕上` still works
- [ ] Mode chooser still appears after drag end
- [ ] Drag state is cleared only after a user choice is handled
