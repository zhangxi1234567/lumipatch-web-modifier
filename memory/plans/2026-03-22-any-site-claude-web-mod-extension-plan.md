# Any-Site Claude Web Modifier - Implementation Plan

**Goal:** Build a Chrome extension in this folder that can work on any website, use a Claude-compatible endpoint to generate structured page-modification rules, and apply those rules safely to the active tab.
**Approach:** Reuse the architecture of the existing Anthropic-compatible side-panel extension as a reference, but implement a generic per-domain rule engine, active-tab DOM capture, and content-script application path.
**Estimated Total Time:** 60-90 minutes

## Checkpoint 1: Scaffold the extension project
- [x] Task 1: Create the base project files and folders (~5 min)
  - **Action:** Add `manifest.json`, `package.json`, `README.md`, and `extension/`, `tests/` directories.
  - **Verify:** The current folder contains a loadable Chrome extension structure.
- [x] Task 2: Seed the extension from the existing chat workspace reference (~5 min)
  - **Action:** Copy or recreate the side-panel, options page, and Anthropic-compatible helpers needed for a standalone project in this folder.
  - **Verify:** Core files exist locally under this project and reference local paths only.

## Checkpoint 2: Build the rule engine
- [x] Task 3: Define the modification rule schema and storage model (~5 min)
  - **Action:** Implement rule types for text replacement, style overrides, hide/show, attribute updates, and custom CSS.
  - **Verify:** Rule helpers can normalize, validate, and persist rules per domain.
- [x] Task 4: Implement a content script that applies rules on any site (~10 min)
  - **Action:** Inject a content script on matching pages, apply rules immediately, and re-apply as DOM changes through observers.
  - **Verify:** A saved rule can visibly change page text or styling on reload.

## Checkpoint 3: Connect Claude-powered generation
- [x] Task 5: Add active-tab page capture and background message routing (~10 min)
  - **Action:** Capture tab URL/title/body excerpts and route them to the Claude-compatible endpoint.
  - **Verify:** The background worker can receive a prompt and send a structured generation request.
- [x] Task 6: Add side-panel actions for generate, preview, apply, and save (~15 min)
  - **Action:** Let the user describe a change in natural language, review generated rules, then apply/save them for the current domain.
  - **Verify:** The panel can generate a rule draft and apply it to the active tab without manual code edits.

## Checkpoint 4: Test and document
- [x] Task 7: Add focused tests for rule normalization and request-building (~10 min)
  - **Action:** Cover storage/rule helpers and model request formatting with local tests.
  - **Verify:** Tests pass locally.
- [x] Task 8: Document setup and usage (~5 min)
  - **Action:** Update `README.md` with how to load the extension, configure the API, and use domain rules.
  - **Verify:** A user can follow the README to run the extension.

## Verification Criteria
- [x] All checkpoints complete
- [x] Extension loads in Chrome as unpacked extension
- [x] Claude-compatible settings can be configured
- [x] Generated rules can modify arbitrary websites by domain
- [x] User can inspect and save rules before auto-applying them
- [x] Tests run successfully

## Execution Choice

Assumption for this session: **Single-Agent execution**. The work will be completed sequentially in this session with checkpoint-based verification.
