# Live Free Placement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current relayout-oriented drag flow with live-element free placement using fixed screen coordinates and persistent empty placeholders.

**Architecture:** The content script will stop treating drag as structural DOM relocation. Instead, the dragged node remains the live interactive DOM element, is pinned with `position: fixed`, and leaves behind a placeholder in its old DOM position. Persistence moves from `moveNode`-oriented drag saves to a dedicated `pinNode` rule.

**Tech Stack:** Chrome MV3 extension, plain ES modules, DOM APIs, Node built-in tests

---

### Task 1: Add failing static tests for free placement

**Files:**
- Modify: `tests/panel-ui.test.js`
- Modify: `tests/rules.test.js`

**Step 1: Write the failing test**
- Assert presence of `pinNode` rule support.
- Assert the content script contains helpers like `applyPinNodeRule`, `finalizePinnedElement`, and placeholder persistence.
- Assert drag flow no longer depends on structural drop placement helpers for the active mode.

**Step 2: Run test to verify it fails**
Run: `node --test tests/rules.test.js tests/panel-ui.test.js`
Expected: FAIL because `pinNode` support does not exist yet.

**Step 3: Write minimal implementation**
- No production code in this task.

**Step 4: Run test to verify it still fails correctly**
Run: `node --test tests/rules.test.js tests/panel-ui.test.js`
Expected: FAIL on missing `pinNode` symbols.

### Task 2: Add `pinNode` rule support

**Files:**
- Modify: `extension/lib/rules.js`
- Modify: `extension/background.js`
- Test: `tests/rules.test.js`

**Step 1: Write the failing test**
- Add normalization/merge assertions for `pinNode`.

**Step 2: Run test to verify it fails**
Run: `node --test tests/rules.test.js`
Expected: FAIL.

**Step 3: Write minimal implementation**
- Add `pinNode` normalization, merge keys, and descriptions.
- Update drag save handling in the background to persist `pinNode` rules.

**Step 4: Run test to verify it passes**
Run: `node --test tests/rules.test.js`
Expected: PASS.

### Task 3: Replace drag gesture flow with live pinning

**Files:**
- Modify: `extension/content-script.js`
- Test: `tests/panel-ui.test.js`

**Step 1: Write the failing test**
- Assert `beginDragGesture()` captures a source selector before placeholder insertion.
- Assert `finalizePinnedElement()` and `applyPinNodeRule()` exist.
- Assert `saveDropRule()` now persists `pinNode`.

**Step 2: Run test to verify it fails**
Run: `node --test tests/panel-ui.test.js`
Expected: FAIL.

**Step 3: Write minimal implementation**
- Remove dependence on structural drop resolution for the main drag path.
- Keep the live element fixed under the pointer.
- Leave a placeholder in the old location.
- Finalize fixed placement on drop.

**Step 4: Run test to verify it passes**
Run: `node --test tests/panel-ui.test.js`
Expected: PASS.

### Task 4: Rehydrate placeholders and fixed placement on refresh

**Files:**
- Modify: `extension/content-script.js`
- Test: `tests/panel-ui.test.js`

**Step 1: Write the failing test**
- Assert that the content script recreates placeholders and reapplies pinned fixed positioning on load.

**Step 2: Run test to verify it fails**
Run: `node --test tests/panel-ui.test.js`
Expected: FAIL.

**Step 3: Write minimal implementation**
- Add placeholder hydration and marker attributes for pinned nodes.
- Ensure repeat drags keep using the original selector.

**Step 4: Run test to verify it passes**
Run: `node --test tests/panel-ui.test.js`
Expected: PASS.

### Task 5: Update docs

**Files:**
- Modify: `README.md`

**Step 1: Write the failing test**
- Adjust README assertions to mention live free placement and empty placeholders.

**Step 2: Run test to verify it fails**
Run: `node --test tests/panel-ui.test.js`
Expected: FAIL if docs are stale.

**Step 3: Write minimal implementation**
- Update README drag section.

**Step 4: Run test to verify it passes**
Run: `node --test tests/panel-ui.test.js`
Expected: PASS.
