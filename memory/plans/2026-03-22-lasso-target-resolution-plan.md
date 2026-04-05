# Lasso Target Resolution Fix - Implementation Plan

**Goal:** Make freehand/lasso selection resolve to the actual circled content element instead of a broad layout container, so simple color edits do not unexpectedly move layout.
**Approach:** Tighten `resolveLassoSelection` to prefer semantic/text-bearing elements inside the lasso, heavily weight the centroid hit, and stop promoting large ancestor containers by default. Keep direct click selection unchanged.
**Estimated Total Time:** 20-30 minutes

## Checkpoint 1: Targeting strategy
- [x] Task 1: Review current lasso candidate scoring (~5 min)
  - **Action:** Inspect how sampled points, centroid, and ancestor scoring currently influence the chosen element.
  - **Verify:** The broad-container failure mode is clearly identified.
- [x] Task 2: Define a narrower content-first heuristic (~5 min)
  - **Action:** Prefer semantic/text-bearing targets from `elementsFromPoint`, reduce container promotion, and preserve a safe fallback.
  - **Verify:** The approach explains why direct click works while lasso should stop picking oversized wrappers.

## Checkpoint 2: Implementation
- [x] Task 3: Update lasso target resolution in `extension/content-script.js` (~10 min)
  - **Action:** Add content-priority helpers and apply them inside the lasso sampling flow.
  - **Verify:** Lasso selection resolves toward circled content instead of the outer layout box.

## Checkpoint 3: Verification
- [x] Task 4: Update regression coverage and rerun tests (~5 min)
  - **Action:** Add a static regression assertion for the content-first lasso helpers and run the local test suite.
  - **Verify:** `npm test` passes.

## Verification Criteria
- [x] Lasso selection prefers the circled content element over a broad container
- [x] Direct click selection behavior remains unchanged
- [x] Local tests pass
