# Lasso Picker Upgrade - Implementation Plan

**Goal:** Let the user press and drag to sketch a freehand selection path on the page, then map that lassoed region to the most appropriate webpage element/container for AI modification.
**Approach:** Extend the current picker mode so it supports both simple hover-click selection and freehand drag selection. While drawing, show a live path overlay; on release, resolve the lasso bounds and sampled points into a stable DOM target and reopen the inline editor on that target. Use a worker agent for tests/docs while the main session owns the content-script implementation.
**Estimated Total Time:** 35-55 minutes

## Checkpoint 1: Drawing interaction and overlay
- [x] Task 1: Add lasso drawing state to the picker (~10 min)
  - **Action:** Track pointer-down, pointer-move, and pointer-up while in picker mode, storing the freehand path points.
  - **Verify:** Dragging draws a visible path instead of immediately selecting the hovered element.
- [x] Task 2: Add a live lasso overlay (~5 min)
  - **Action:** Render the current freehand path and its effective bounds in the picker overlay.
  - **Verify:** Users can see the region they are sketching before they release the mouse.

## Checkpoint 2: Region-to-target resolution
- [x] Task 3: Resolve a lassoed region to the best DOM target (~10 min)
  - **Action:** Sample points inside the lasso bounds, collect candidate elements/ancestors, and choose a stable target container.
  - **Verify:** Releasing after a drag selects the intended page area more often than the tiny leaf node under one cursor point.
- [x] Task 4: Preserve existing simple click selection (~5 min)
  - **Action:** Keep short clicks as the current fast single-element picker while using drag distance to trigger lasso mode.
  - **Verify:** Existing click-to-select behavior still works.

## Checkpoint 3: Verification
- [x] Task 5: Update tests and notes for lasso mode (~5 min)
  - **Action:** Add assertions for the lasso overlay and draw/release flow.
  - **Verify:** Local tests pass.

## Verification Criteria
- [x] Users can draw a freehand path to choose a target region
- [x] Short clicks still select one element quickly
- [x] Releasing after a drag reopens the inline editor on the resolved target
- [x] Tests pass locally
