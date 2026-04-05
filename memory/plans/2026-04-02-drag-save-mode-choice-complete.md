# Drag Save Mode Choice - Completion Report

**Date Completed:** 2026-04-02
**Original Goal:** Let users choose whether drag-save should follow page flow or stay fixed to the screen, while keeping the current free drag feeling.
**Final Result:** Dragging now opens a small save-mode chooser. The default action is `follow page`, which saves as `moveNode`; the alternate action is `fixed on screen`, which saves as `pinNode`.

## Completion Summary

| Metric | Planned | Actual |
|--------|---------|--------|
| Checkpoints | 4 | 4 |
| Tasks | 8 | 8 |
| Time | 30 min | 30 min |

## Verification Checklist

- [x] All tasks complete
- [x] Quality criteria met
- [x] Static syntax checks passed for touched JavaScript files

## What Was Delivered

- Added a compact drag-save chooser in `extension/content-script.js`
- Default recommendation is `跟随页面滚动`
- `跟随页面滚动` now persists through `moveNode`
- `固定在屏幕上` keeps the previous pinned `pinNode` behavior
- Popup descriptions now use clearer wording for the two drag save modes

## Blockers Encountered

1. Existing drag save flow always wrote `pinNode` directly → resolved by branching at save time instead of changing the drag gesture itself.
2. `follow page` needed the placeholder snapshot before restoring the element back into page flow → resolved by building the move rule first, then committing the DOM placement.

## Lessons Learned

- The least risky way to add drag behavior choice is to branch only at save time, not during pointer movement.
- `moveNode` and `pinNode` already provided the right persistence model, so the main job was exposing that choice clearly to users.
