# Cross-Container Relayout Drag Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the extension's current drag behavior with a cross-container relayout system that moves real DOM nodes, avoids accidental clicks, and persists structural page moves.

**Architecture:** The content script will drive a placeholder-based drag interaction that reflows the live page while the dragged element floats. Persistence will move from CSS position snapshots to a structural `moveNode` rule that the content script replays before other DOM mutations.

**Tech Stack:** Chrome MV3 extension, plain ES modules, Node built-in test runner, DOM APIs

---

### Task 1: Add failing tests for structural drag rules

**Files:**
- Modify: `tests/rules.test.js`
- Modify: `tests/panel-ui.test.js`

**Step 1: Write the failing test**

- Add a `rules.test.js` assertion that `sanitizeRuleSet()` accepts a `moveNode` rule with `selector`, `targetParentSelector`, and `beforeSelector`.
- Add a `panel-ui.test.js` assertion that the content script contains click suppression, `moveNode`, `elementsFromPoint`, and cross-container placeholder logic.

**Step 2: Run test to verify it fails**

Run: `node --test tests/rules.test.js tests/panel-ui.test.js`
Expected: FAIL because the current code does not support `moveNode` or the new drag helpers.

**Step 3: Write minimal implementation**

- No production code in this task.

**Step 4: Run test to verify it still fails for the expected reason**

Run: `node --test tests/rules.test.js tests/panel-ui.test.js`
Expected: FAIL with missing `moveNode` support.

### Task 2: Extend the rule engine for structural moves

**Files:**
- Modify: `extension/lib/rules.js`
- Test: `tests/rules.test.js`

**Step 1: Write the failing test**

- If Task 1 did not already cover merge behavior, add a test that later `moveNode` rules for the same selector override earlier ones.

**Step 2: Run test to verify it fails**

Run: `node --test tests/rules.test.js`
Expected: FAIL because `moveNode` is not normalized/merged.

**Step 3: Write minimal implementation**

- Add `moveNode` to the supported rule types.
- Normalize its fields.
- Add merge keys and descriptions for structural move rules.

**Step 4: Run test to verify it passes**

Run: `node --test tests/rules.test.js`
Expected: PASS.

### Task 3: Save structural drag rules from the background

**Files:**
- Modify: `extension/background.js`
- Test: `tests/panel-ui.test.js`

**Step 1: Write the failing test**

- Assert that `rules:save-drag` accepts a structured drag rule path, not only `styleValue` CSS snapshots.

**Step 2: Run test to verify it fails**

Run: `node --test tests/panel-ui.test.js`
Expected: FAIL because only CSS snapshot persistence exists.

**Step 3: Write minimal implementation**

- Update `saveDragPositionForRequestedSite()` to store `moveNode` rules when given a structured drag payload.
- Preserve old style payload support for compatibility.

**Step 4: Run test to verify it passes**

Run: `node --test tests/panel-ui.test.js`
Expected: PASS.

### Task 4: Rebuild the drag interaction around placeholders

**Files:**
- Modify: `extension/content-script.js`
- Test: `tests/panel-ui.test.js`

**Step 1: Write the failing test**

- Add assertions for placeholder movement, `elementsFromPoint`, drop-container helpers, and click suppression.

**Step 2: Run test to verify it fails**

Run: `node --test tests/panel-ui.test.js`
Expected: FAIL because the old drag flow still uses fixed positioning and same-parent reorder.

**Step 3: Write minimal implementation**

- Resolve a stable drag target.
- Track pointer offsets and floating preview styles.
- Find cross-container drop locations.
- Move a placeholder through the DOM.
- Suppress click after drag.
- Save structured drag rules on drop.

**Step 4: Run test to verify it passes**

Run: `node --test tests/panel-ui.test.js`
Expected: PASS.

### Task 5: Replay structural move rules during rule application

**Files:**
- Modify: `extension/content-script.js`
- Test: `tests/rules.test.js`

**Step 1: Write the failing test**

- If needed, extend static assertions to check `moveNode` application is part of the active rule path.

**Step 2: Run test to verify it fails**

Run: `node --test tests/rules.test.js tests/panel-ui.test.js`
Expected: FAIL because `moveNode` is not applied.

**Step 3: Write minimal implementation**

- Apply structural move rules before text and attribute DOM mutations.

**Step 4: Run test to verify it passes**

Run: `node --test tests/rules.test.js tests/panel-ui.test.js`
Expected: PASS.

### Task 6: Document the new drag behavior

**Files:**
- Modify: `README.md`
- Test: `tests/panel-ui.test.js`

**Step 1: Write the failing test**

- Update the README-related assertions to mention cross-container relayout drag and click-safe dragging.

**Step 2: Run test to verify it fails**

Run: `node --test tests/panel-ui.test.js`
Expected: FAIL because the README still describes the old drag semantics.

**Step 3: Write minimal implementation**

- Update the drag description in the README.

**Step 4: Run test to verify it passes**

Run: `node --test tests/panel-ui.test.js`
Expected: PASS.

### Final Verification

**Run:** `node --test`

**Expected:** All tests pass and the drag relayout flow is covered by the updated static assertions.
