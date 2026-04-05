# LEARNINGS.md

## [LRN-20260329-001] correction

**Logged**: 2026-03-29T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
Cross-container drag must use the pointer stop location as the effective insertion target, not just a rough nearest container/edge heuristic.

### Details
The earlier cross-container drag implementation could choose containers that were too deep or too generic, which caused dropped items to land somewhere near the pointer but not at the user's intended final location. On nested menus and dropdown sections this also produced visually broken placements that felt like garbled layout. The correct behavior is content-first target selection, conservative container acceptance, and insertion based on the actual pointer stop location.

### Suggested Action
Prefer a meaningful dragged element, resolve a reference element under the pointer, project that reference into a stable direct child of a structural container, and derive before/after insertion from the pointer's final location. Reject tiny wrapper containers and suppress accidental click-through after drag.

### Metadata
- Source: user_feedback
- Related Files: extension/content-script.js
- Tags: drag, relayout, cross-container, click-suppression

---
## [LRN-20260329-002] best_practice

**Logged**: 2026-03-29T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
The content script must keep its local rule sanitizer in parity with the shared rule schema, or persisted drag rules will silently disappear on reload.

### Details
`background.js` correctly stored structural `moveNode` drag rules, but `content-script.js` used a separate local `sanitizeRuleSet()` that did not preserve `targetParentSelector` and `beforeSelector`. On refresh, the extension loaded the saved rule set from local storage, then dropped the structural placement fields during normalization, so `moveNode` could no longer replay and the page looked like drag changes were not permanently saved.

### Suggested Action
Whenever new rule types or rule fields are introduced, update both the shared rule engine and any local sanitizers/readers to keep the persisted data shape intact. Add regression assertions for reload-time rule hydration.

### Metadata
- Source: conversation
- Related Files: extension/content-script.js, extension/background.js
- Tags: persistence, moveNode, reload, schema-parity
- See Also: LRN-20260329-001

---
## [LRN-20260329-003] correction

**Logged**: 2026-03-29T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
Interactive controls like buttons, links, tabs, and menu items must never be treated as structural drop containers for drag relayout.

### Details
A dropped element was being inserted inside compact interactive controls instead of beside them as a sibling. This caused text and icons to stack and overlap visually. The drag system needs to distinguish structural layout containers from atomic interactive controls even when those controls use flex/grid internally.

### Suggested Action
Reject button-like tags and roles as drop containers, then bubble to a structural ancestor and insert before/after the interactive control as a sibling.

### Metadata
- Source: user_feedback
- Related Files: extension/content-script.js
- Tags: drag, overlap, drop-container, controls
- See Also: LRN-20260329-001

---
## [LRN-20260329-004] best_practice

**Logged**: 2026-03-29T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
The drag gesture must suspend observer-driven rule reapplication, or the moved node and placeholder will fight with persisted rules and cause flicker.

### Details
While dragging, the content script mutates the live DOM by moving the placeholder and dragged node. Those mutations currently feed into the normal `MutationObserver` path, which schedules `applyRules()` again. Because `applyRules()` replays all saved rules including `moveNode`, the dragged element can jump, flicker, or make unrelated moved nodes reapply mid-gesture.

### Suggested Action
Do not schedule rule reapplication while drag mode is active or a drag gesture is in progress. Treat drag-time mutations as local interaction noise, then resume normal observer behavior after drop/cancel completes.

### Metadata
- Source: conversation
- Related Files: extension/content-script.js
- Tags: drag, flicker, mutation-observer, moveNode
- See Also: LRN-20260329-001

---
## [LRN-20260329-005] correction

**Logged**: 2026-03-29T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
Freeform drag of arbitrary DOM nodes is too unstable; the feature needs stable block-level drag semantics instead of trying to move any random fragment or oversized wrapper.

### Details
User feedback shows repeated drags become unstable, selected drag targets can expand into long wrapper blocks, and overlapping bugs increase over multiple operations. The interaction model needs a stricter definition of what a drag target is and how repeated drags update the layout.

### Suggested Action
Switch from best-effort arbitrary-node dragging to stable block dragging: identify the smallest meaningful movable block, constrain drop targets to structural container children, and keep a canonical in-memory move model so repeated drags update one item without re-mutating unrelated layout.

### Metadata
- Source: user_feedback
- Related Files: extension/content-script.js
- Tags: drag, stability, repeated-drags, target-selection
- See Also: LRN-20260329-001

---
## [LRN-20260329-006] correction

**Logged**: 2026-03-29T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
The drag requirement has shifted again: the user wants furniture-style rearrangement of fine-grained page items, not only stable block dragging.

### Details
The previous stabilization plan assumed block-level dragging would best match the user's intent. The latest correction explicitly says even smaller/finer items should be movable, closer to a freeform “redecorate the room” model where the page can be restructured around a new owner's habits.

### Suggested Action
Re-evaluate the drag model before more implementation. Compare three paths: freeform furniture mode, layout-aware micro-block mode, and dual-mode editing. Do not continue block-only assumptions without renewed approval.

### Metadata
- Source: user_feedback
- Related Files: extension/content-script.js, docs/plans/2026-03-29-stable-block-drag-design.md
- Tags: drag, requirements-change, layout-editor
- See Also: LRN-20260329-005

---
## [LRN-20260329-007] correction

**Logged**: 2026-03-29T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
The user wants true freeform dragging of essentially any visible page content, including dropdown items, table cells, inputs, logos, and images.

### Details
This requirement exceeds stable block drag or flow-based relayout. It moves the product toward a free-placement editor for existing webpages, where nearly any visible element must be movable to arbitrary screen positions while preserving meaning and interaction.

### Suggested Action
Pause further incremental refactors and clarify the most important interaction guarantee before implementation: whether moved elements must remain the original live DOM node with full functionality, or whether some categories may use a visual editor layer/clone model.

### Metadata
- Source: user_feedback
- Related Files: extension/content-script.js, docs/plans/2026-03-29-stable-block-drag-design.md
- Tags: drag, freeform, arbitrary-elements, requirement-shift
- See Also: LRN-20260329-006

---
## [LRN-20260330-001] best_practice

**Logged**: 2026-03-30T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
Pinned free-placement must capture the live element's final screen rect before clearing drag preview styles, or the final position collapses to incorrect coordinates.

### Details
The free-placement implementation cleared `left/top` in `clearDraggedPreviewStyles()` before `finalizePinnedElement()` reused them. That zeroed out the final pinned coordinates and produced placements that did not match the user's drop location. The correct sequence is to read `getBoundingClientRect()` first, then clear preview-only styles, then reapply `position: fixed` with the captured rect.

### Suggested Action
Always snapshot final live geometry before cleaning up transient drag styles in fixed-placement mode.

### Metadata
- Source: conversation
- Related Files: extension/content-script.js
- Tags: pinNode, drag, coordinates, fixed-position
- See Also: LRN-20260329-007

---
## [LRN-20260331-001] best_practice

**Logged**: 2026-03-31T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
On framework-driven pages, a pinned live node can trigger the app to re-render a fresh selector match; pin hydration must adopt that rerendered replacement as the placeholder and suppress extra duplicates instead of recreating a placeholder under `body`.

### Details
After a dragged element is promoted to a viewport host, React/Vue-style pages may render a replacement node back into the original toolbar or menu. If `applyPinNodeRule()` always prefers the already pinned live node and blindly rehydrates a missing placeholder relative to that node, the placeholder can be recreated next to the pinned element in `body` while the framework replacement stays visible in the original flow. The result is duplicate or overlapping UI after state changes like entering/exiting a tab or mode.

### Suggested Action
When a pin rule reapplies, first look for direct selector matches that reappeared in the page flow. If one exists, convert that rerendered match into the placeholder (invisible but layout-preserving) and suppress any extra duplicates. Only create a fresh owned placeholder when the element is still in-flow and no rerendered anchor exists.

### Metadata
- Source: conversation
- Related Files: extension/content-script.js, tests/panel-ui.test.js
- Tags: pinNode, rerender, placeholder, duplicate-ui, react-like-pages
- See Also: LRN-20260330-001

---
## [LRN-20260331-002] best_practice

**Logged**: 2026-03-31T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
When a framework page rerenders a pinned control, the fresh in-flow match should become the canonical pinned node; keeping the older body-level node can break clickability because its event wiring may be stale.

### Details
After adopting rerendered toolbar/menu matches as placeholders, the code still preferred `findPinnedElementsBySourceSelector()` before `findDirectMatchesBySelector()`. On React-like pages this can keep an older detached DOM node pinned on screen while the framework has already recreated the current interactive control in the page flow. The old node may look right but not respond to clicks because the app now considers the newer DOM instance authoritative.

### Suggested Action
Prefer fresh direct selector matches over previously pinned nodes when replaying `pinNode` rules, and suppress extra pinned duplicates so only one interactive copy stays active.

### Metadata
- Source: conversation
- Related Files: extension/content-script.js, tests/panel-ui.test.js
- Tags: pinNode, clickability, rerender, stale-dom, react-like-pages
- See Also: LRN-20260331-001

---
## [LRN-20260331-003] best_practice

**Logged**: 2026-03-31T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
`pinNode` canonical-node selection cannot use one global priority for every element type; ephemeral dropdown/menu items need pinned-first stability, while normal rerendered controls often need direct-match-first interactivity.

### Details
A global direct-match-first rule fixed clickability on rerendered toolbar buttons, but it regressed transient dropdown items because each fresh menu instance could replace the previously pinned live node. For menu-like elements this makes drag placement unstable across open/close cycles. The correct approach is type-aware selection: menu/dropdown items prefer the existing pinned node when present, while non-menu controls can still prefer the fresh direct match.

### Suggested Action
Keep `pinNode` replay heuristics scoped by element type instead of using one universal ordering. Detect menu-like targets by role/container and only apply pinned-first ordering there.

### Metadata
- Source: conversation
- Related Files: extension/content-script.js, tests/panel-ui.test.js
- Tags: pinNode, dropdown, menuitem, selection-priority, regression-avoidance
- See Also: LRN-20260331-001, LRN-20260331-002

---
## [LRN-20260331-004] best_practice

**Logged**: 2026-03-31T00:00:00+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
Ephemeral dropdown/menu drags need a different pointer hotspot from normal elements; preserving the original click offset makes menu items feel visibly detached from the cursor.

### Details
The generic drag code preserved `clientX - rect.left` and `clientY - rect.top` for every element. That works for free-form content blocks, but for compact dropdown/menu items it makes the dragged item appear offset from the cursor by the original grab point. User feedback requires menu items to stay effectively under the pointer during drag/drop, so these targets need a cursor-centered hotspot.

### Suggested Action
Use a menu-specific drag hotspot for dropdown-like targets instead of the generic click-offset hotspot, while leaving normal elements on the old behavior.

### Metadata
- Source: conversation
- Related Files: extension/content-script.js, tests/panel-ui.test.js
- Tags: drag, dropdown, pointer-hotspot, cursor-alignment
- See Also: LRN-20260331-003

---
