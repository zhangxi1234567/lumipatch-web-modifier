# Stable Block Drag Design

**Date:** 2026-03-29

## Goal

+Replace the current best-effort arbitrary-node drag model with a stable block drag model that moves one meaningful UI block at a time, keeps repeated drags predictable, and limits layout impact to the moved block plus the space it occupies.
+
+## User Requirements
+
+- Dragging should operate on one stable block, not random text fragments or giant wrapper strips.
+- Repeated drags of the same item should remain stable and not degrade over time.
+- The moved block may enter another container, but unrelated content should not be rewritten or re-laid out beyond making room.
+- Dragging should not insert content inside compact controls like buttons, tabs, or inline action chips.
+- The final result should persist across refresh.
+
+## Recommended Model
+
+Use **stable block dragging** instead of arbitrary DOM dragging.
+
+At drag start, resolve the user's pointer target to the smallest meaningful movable block that is also a direct child of a structural container. During drag, operate only on that block and a placeholder. Drop targets are limited to structural containers and their direct block children. The resulting persistence record remains a single `moveNode` rule for that block.
+
+## Why This Is Better
+
+- It matches how users perceive sidebars, rows, cards, chips, and menu items.
+- It avoids wrapper explosions where one drag accidentally captures a huge strip of layout.
+- It reduces repeated-drag instability because the system manipulates canonical blocks instead of fragile fragments.
+- It narrows layout impact to one moved block and nearby siblings.
+
+## Core Rules
+
+### Movable Block
+
+A movable block must satisfy at least one of these:
+
+- Interactive item such as link, button, menu item, tab, list item
+- Semantic row/card-like element with visible text or icon
+- Direct child of a structural container and not a giant wrapper
+
+### Structural Container
+
+A structural drop container must satisfy all of these:
+
+- Not an atomic interactive control
+- Not a tiny wrapper or single-fragment inline node
+- Holds multiple direct child blocks or is a known layout container
+- Accepts drops only at the direct child level
+
+## Drag Flow
+
+1. Pointer down resolves to a stable block
+2. Placeholder is inserted at the block's original slot
+3. Drag preview follows the pointer
+4. Drop target resolves to a structural container and a direct child boundary
+5. Only that block moves; siblings merely yield space
+6. A single `moveNode` rule is persisted for the moved block
+
+## Stability Constraints
+
+- Suspend observer-driven rule replay while dragging
+- Do not treat buttons, links, chips, or tabs as drop containers
+- Prefer the smallest meaningful candidate when multiple drag targets are possible
+- Avoid using giant wrapper elements as movable blocks unless nothing better exists
+
+## Validation Focus
+
+- Repeated drags of the same sidebar/chat/menu item stay stable
+- Moved items become siblings of nearby items, not children of compact controls
+- Only the moved block and its neighbors change layout
+- Refresh keeps the moved block in its final saved location
+EOF

cat > /mnt/c/Users/21604/Desktop/谷歌/docs/plans/2026-03-29-stable-block-drag.md <<'EOF'
# Stable Block Drag Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Stabilize drag-and-drop by resolving draggable targets to meaningful UI blocks and limiting drop operations to structural container child boundaries.

**Architecture:** The content script will stop dragging arbitrary DOM fragments and instead resolve a canonical movable block tied to a structural container. Drop resolution will operate on direct child blocks only, so repeated drags stay predictable and unrelated layout does not mutate beyond yielding space.

**Tech Stack:** Chrome MV3 extension, plain ES modules, DOM APIs, Node built-in test runner

---

### Task 1: Add failing block-drag assertions

**Files:**
- Modify: `tests/panel-ui.test.js`

**Step 1: Write the failing test**
- Assert that the content script contains a stable block resolver and structural child collection helpers.
- Assert that drop logic uses structural child lists instead of arbitrary raw children.

**Step 2: Run test to verify it fails**
Run: `node --test tests/panel-ui.test.js`
Expected: FAIL because the helpers do not exist yet.

**Step 3: Write minimal implementation**
- No production code in this task.

**Step 4: Run test to verify it still fails correctly**
Run: `node --test tests/panel-ui.test.js`
Expected: FAIL for missing helper names.

### Task 2: Resolve stable movable blocks

**Files:**
- Modify: `extension/content-script.js`
- Test: `tests/panel-ui.test.js`

**Step 1: Write the failing test**
- Covered by Task 1.

**Step 2: Run test to verify it fails**
Run: `node --test tests/panel-ui.test.js`
Expected: FAIL.

**Step 3: Write minimal implementation**
- Add `resolveMovableBlock()` and block scoring logic.
- Use the nearest meaningful block that is a child of a structural container.

**Step 4: Run test to verify it passes**
Run: `node --test tests/panel-ui.test.js`
Expected: PASS.

### Task 3: Limit drop containers to structural child boundaries

**Files:**
- Modify: `extension/content-script.js`
- Test: `tests/panel-ui.test.js`

**Step 1: Write the failing test**
- Covered by Task 1.

**Step 2: Run test to verify it fails**
Run: `node --test tests/panel-ui.test.js`
Expected: FAIL.

**Step 3: Write minimal implementation**
- Add `collectStructuralContainerChildren()`.
- Make projection and insertion operate only on those block children.
- Reject compact controls as containers.

**Step 4: Run test to verify it passes**
Run: `node --test tests/panel-ui.test.js`
Expected: PASS.

### Task 4: Preserve repeat-drag stability

**Files:**
- Modify: `extension/content-script.js`
- Test: `tests/panel-ui.test.js`

**Step 1: Write the failing test**
- Assert that drag operations are routed through the stable block helper and structural child helper in both drag start and drop logic.

**Step 2: Run test to verify it fails**
Run: `node --test tests/panel-ui.test.js`
Expected: FAIL.

**Step 3: Write minimal implementation**
- Ensure the drag session always tracks one canonical movable block.
- Ensure repeated drags update one block path instead of drifting into nested descendants.

**Step 4: Run test to verify it passes**
Run: `node --test tests/panel-ui.test.js`
Expected: PASS.

### Task 5: Document the stabilized behavior

**Files:**
- Modify: `README.md`

**Step 1: Write the failing test**
- Extend existing README assertions to mention stable block dragging if needed.

**Step 2: Run test to verify it fails**
Run: `node --test tests/panel-ui.test.js`
Expected: FAIL if docs are stale.

**Step 3: Write minimal implementation**
- Document that drag operates on stable blocks and only nearby siblings yield space.

**Step 4: Run test to verify it passes**
Run: `node --test tests/panel-ui.test.js`
Expected: PASS.
