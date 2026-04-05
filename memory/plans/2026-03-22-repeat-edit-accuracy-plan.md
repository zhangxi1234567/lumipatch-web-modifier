# Repeat Edit Accuracy Fix - Implementation Plan

**Goal:** Make repeated edits on the same target more accurate, especially for short color-only commands like “改成红色”, by avoiding unnecessary model creativity.
**Approach:** Detect simple style instructions locally and generate the narrowest possible style rule for the current target before calling the model. Add prompt guardrails so the model also avoids layout changes when the request is only about color or small style tweaks.
**Estimated Total Time:** 25-35 minutes

## Checkpoint 1: Repeated-edit analysis
- [x] Task 1: Review the current generate → infer/repair flow (~5 min)
  - **Action:** Inspect where simple commands are still sent through freeform model generation.
  - **Verify:** The repeated-edit failure mode is clearly identified.
- [x] Task 2: Define a deterministic local-inference path for short style commands (~5 min)
  - **Action:** Map text-color/background/border-color style requests to minimal `style` rules on the current target selector.
  - **Verify:** “改成红色/绿色” can be handled without the model inventing layout changes.

## Checkpoint 2: Implementation
- [x] Task 3: Add local style inference in `extension/lib/rules.js` and use it earlier in `extension/background.js` (~10 min)
  - **Action:** Expand instruction inference and let `rules:generate` short-circuit for simple style edits.
  - **Verify:** Repeated color changes on the same target produce deterministic style rules.
- [x] Task 4: Strengthen prompt guardrails for color-only requests (~5 min)
  - **Action:** Tell the model not to change position/layout when the user only asks for color or similar tiny style tweaks.
  - **Verify:** Model-driven fallback behavior becomes narrower too.

## Checkpoint 3: Verification
- [x] Task 5: Add tests for repeated color edits and rerun the suite (~5 min)
  - **Action:** Cover local style inference and repeated merge behavior.
  - **Verify:** `npm test` passes.

## Verification Criteria
- [x] Short color-only commands resolve to minimal style rules
- [x] Repeated edits on the same target stay on the same selector
- [x] Color-only changes do not introduce layout/position declarations
- [x] Local tests pass
