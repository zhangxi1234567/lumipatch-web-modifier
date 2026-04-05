# Agent-Driven Rule Management Pack - Implementation Plan

**Goal:** Upgrade the extension with practical rule-management features: undo/redo for site rules, export/import for sharing backups, and stronger popup controls to manage saved/generated rules.
**Approach:** Keep the current right-click inline editor as-is, then add a site-level history stack and transfer format in storage/background, surface these capabilities in the popup UI, and verify the new workflow with tests. Use sub-agents for disjoint storage and popup-layout work while the main session handles message plumbing and integration.
**Estimated Total Time:** 35-55 minutes

## Checkpoint 1: Core rule history and transfer format
- [x] Task 1: Add site-level undo/redo history in storage (~10 min)
  - **Action:** Track snapshots per hostname and expose helpers for record, undo, redo, and history metadata.
  - **Verify:** Undo and redo can restore previous saved rule states for one hostname.
- [x] Task 2: Add export/import payload helpers (~5 min)
  - **Action:** Serialize site rules to a clean JSON package and validate imported payloads.
  - **Verify:** Invalid imports are rejected and valid imports normalize correctly.

## Checkpoint 2: Extension message plumbing and popup behavior
- [x] Task 3: Add background message handlers for undo/redo/export/import (~10 min)
  - **Action:** Wire new popup actions to background operations and refresh the active tab after state changes.
  - **Verify:** Popup actions can trigger history moves and import/export flows successfully.
- [x] Task 4: Add popup controls and state rendering (~10 min)
  - **Action:** Add undo/redo/export/import controls plus small state summaries for saved/generated rules.
  - **Verify:** Popup reflects availability of saved rules and history, and actions are disabled when unavailable.

## Checkpoint 3: Verify and polish
- [x] Task 5: Update tests for storage, popup UI, and background message support (~10 min)
  - **Action:** Add or extend tests for history helpers, import/export validation, and popup control presence.
  - **Verify:** Local tests pass.

## Verification Criteria
- [x] Users can undo and redo saved rule changes for the current site
- [x] Users can export a site's rules and import them back later
- [x] Popup exposes the new controls clearly and safely
- [x] Tests pass locally
