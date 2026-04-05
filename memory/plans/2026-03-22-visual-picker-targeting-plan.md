# Visual Picker Targeting - Implementation Plan

**Goal:** Let the user visually highlight and choose any page element/region for AI modifications such as color, background, spacing, or text changes, without relying on text selection.
**Approach:** Keep the existing right-click popup, then add a visual picker mode with hover highlight, click-to-select, and a keyboard shortcut. The popup will preserve the user's draft prompt while re-targeting.
**Estimated Total Time:** 25-40 minutes

## Checkpoint 1: Add a visual target picker
- [x] Task 1: Add picker state and owned overlay UI (~5 min)
  - **Action:** Create a lightweight fixed highlight box and hint badge that are marked as extension-owned.
  - **Verify:** Picker overlay can be shown without polluting page capture or rule application.
- [x] Task 2: Drive picker with mouse hover and click (~10 min)
  - **Action:** Track the hovered element, draw a visible outline around it, and allow click-to-select as the new AI target.
  - **Verify:** Clicking a highlighted element updates the target summary for later edits.

## Checkpoint 2: Make the picker easy to enter
- [x] Task 3: Add a popup button for re-picking the target (~5 min)
  - **Action:** Add a `圈选目标` action to the inline popup and preserve the current prompt while re-targeting.
  - **Verify:** Users can reopen the picker from the popup without losing what they already typed.
- [x] Task 4: Add a page-wide shortcut (~5 min)
  - **Action:** Support `Ctrl+Shift+X` to enter picker mode anywhere on the page, plus `Esc` to cancel.
  - **Verify:** Picker can be entered without right-clicking first.

## Checkpoint 3: Verify and document
- [x] Task 5: Update tests for picker-mode behavior (~5 min)
  - **Action:** Add assertions for picker UI, hotkey, and retargeting flow.
  - **Verify:** Local tests pass.

## Verification Criteria
- [x] User can visually pick any element/region without selecting text
- [x] The popup preserves draft instructions when re-picking
- [x] `Ctrl+Shift+X` enters picker mode and `Esc` cancels it
- [x] Tests pass locally
