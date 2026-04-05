# Live Element Free Placement Design

**Date:** 2026-03-29

## Goal

Convert the drag system from structural relayout into a live-element free placement mode where the original DOM node is dragged to an arbitrary screen position, remains fully interactive after drop, leaves an empty placeholder at its old location, and is restored to that same screen position on refresh.

## Confirmed Requirements

- Any visible content may be draggable: dropdown items, table content, inputs, logos, images, links, and menu items.
- The dropped element must remain the original live DOM node.
- Clicking the dropped element in its new location must still trigger the original behavior.
- The element should stay exactly where the user released it, tied to screen coordinates.
- The original location should remain empty rather than auto-compacting.
- The placement should persist automatically across refresh.

## Recommended Model

Use **live element pinning** instead of flow-based relayout.

At drag start, the original element is kept as the active draggable node. A placeholder is inserted at its old DOM position to preserve the empty gap. The real element is switched to `position: fixed` and follows the pointer. On drop, that same live element remains fixed at the final screen coordinates. Persistence stores a pin rule containing the element selector and viewport coordinates.

## Why This Matches The User Better

- It preserves element behavior because no clone layer handles clicks.
- It matches the “move furniture” mental model better than structural sibling insertion.
- It avoids automatic backfilling of the old location.
- It makes final placement deterministic: where the pointer stops is where the element stays.

## Rule Model

Add a `pinNode` rule with fields:

- `selector`
- `left`
- `top`
- `width`
- `height`
- `zIndex`

The content script will hydrate a placeholder before pinning the node. The rule itself only needs the pinned element coordinates; the placeholder shape can be reconstructed from current computed styles during apply.

## Interaction Model

### Drag Start
- Resolve the real target element
- Record a stable selector before DOM mutation
- Insert a placeholder before the target
- Switch the target to `position: fixed`

### Drag Move
- Keep the live element under the pointer
- Do not trigger structural drop-container logic
- Do not reapply saved rules during the gesture

### Drop
- Freeze the live element at the final viewport coordinates
- Keep the placeholder in the original DOM slot
- Persist `pinNode`
- Suppress the release click

## Persistence Model

On reload:
- Find the original element by selector
- If the placeholder is missing, recreate it before the element
- Reapply fixed positioning from the stored `pinNode` rule
- Restore the source selector marker on the element for repeat drags

## Scope

### In scope
- Free placement of live elements at screen coordinates
- Empty gap left behind
- Automatic persistence across refresh
- Repeat dragging of already pinned elements

### Out of scope
- Collision avoidance between multiple freely placed items
- Auto-snapping, guides, and alignment systems
- Full undo/redo for pin placement mode
