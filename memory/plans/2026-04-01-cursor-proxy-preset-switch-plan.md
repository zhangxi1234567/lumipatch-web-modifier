# Cursor Proxy Preset Switch - Implementation Plan

**Goal:** Make `cursor反代` the new default connection preset while preserving previous proxy presets and avoiding incorrect migration of existing saved settings.
**Approach:** Keep the UI preset dropdown intact, tighten storage migration to classify legacy saved connections into the right preset, and verify local runtime prerequisites.
**Estimated Total Time:** 20 minutes

## Checkpoint 1: Inspect Current State
- [ ] Task 1: Review extension preset definitions (~3 min)
  - **Action:** Read `extension/options.js` and `extension/options.html`.
  - **Verify:** Confirm `cursor-proxy`, `notion-proxy`, `local-claude-proxy`, and `custom` are present.
- [ ] Task 2: Review saved settings migration logic (~3 min)
  - **Action:** Read `extension/lib/storage.js`.
  - **Verify:** Identify how preset-less saved settings are currently migrated.
- [ ] Task 3: Confirm local cursor proxy endpoint details (~2 min)
  - **Action:** Read `C:\Users\21604\Desktop\cursor反代\README.md` and check `/health`.
  - **Verify:** Confirm expected URL is `http://127.0.0.1:3030` and note whether the service is running.

## Checkpoint 2: Update Migration Logic
- [ ] Task 1: Preserve old saved connections as matching presets (~5 min)
  - **Action:** Update `extension/lib/storage.js` so missing `connectionPreset` is inferred from saved connection fields instead of forcing the new default.
  - **Verify:** Old local Claude values resolve to `local-claude-proxy`, Notion values resolve to `notion-proxy`, and current cursor values resolve to `cursor-proxy`.
- [ ] Task 2: Keep cursor proxy as the new default for fresh installs (~2 min)
  - **Action:** Retain `DEFAULT_SETTINGS.connectionPreset` and related connection fields for `cursor-proxy`.
  - **Verify:** Default settings still point to `http://127.0.0.1:3030` with the cursor proxy model.

## Checkpoint 3: Verify And Hand Off
- [ ] Task 1: Review diff for the touched files (~3 min)
  - **Action:** Inspect `git diff -- extension/lib/storage.js extension/options.js extension/options.html extension/options.css`.
  - **Verify:** Changes are limited to preset/default behavior.
- [ ] Task 2: Check runtime prerequisite and user steps (~2 min)
  - **Action:** Re-check `http://127.0.0.1:3030/health`.
  - **Verify:** If unavailable, note that `C:\Users\21604\Desktop\cursor反代` still needs to be started locally.

## Verification Criteria
- [ ] All checkpoints complete
- [ ] New installs default to `cursor-proxy`
- [ ] Existing preset-less saved settings are mapped to the correct preset without silent overwrites
- [ ] Old preset options remain available in the dropdown
