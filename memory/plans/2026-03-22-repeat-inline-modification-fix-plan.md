# Repeat Inline Modification Fix - Implementation Plan

**Goal:** Make repeated right-click AI modifications work reliably on the same page, with visible errors instead of a stuck "generating" state.
**Approach:** Fix the repeated-run flow in three places: surface runtime errors in the inline popup, add request timeouts so hangs become actionable messages, and exclude extension-owned UI from captured page context and follow-up rule application.
**Estimated Total Time:** 20-30 minutes

## Checkpoint 1: Make failures visible
- [x] Task 1: Catch inline generate/save/clear failures (~5 min)
  - **Action:** Wrap inline popup actions in `catch` handlers and show the error inside the popup.
  - **Verify:** A failed request no longer leaves the popup stuck on "正在生成...".
- [x] Task 2: Add request timeout messaging (~5 min)
  - **Action:** Time out background generation fetches and content-script runtime calls with a user-facing timeout error.
  - **Verify:** A hung model endpoint returns a clear timeout message.

## Checkpoint 2: Keep extension UI out of website context
- [x] Task 3: Mark extension-owned nodes and ignore them in page capture (~5 min)
  - **Action:** Tag the inline popup and injected style tags as extension-owned, then filter them out of `bodyText` and `domHints`.
  - **Verify:** Follow-up generations do not include popup copy or previous JSON output in the model prompt.
- [x] Task 4: Ignore extension-owned nodes in DOM-rule targeting and mutation noise (~5 min)
  - **Action:** Prevent DOM rules and mutation observer churn from treating extension UI as page content.
  - **Verify:** Repeated edits stay focused on the actual website and do not self-trigger on the popup.

## Checkpoint 3: Verify regression coverage
- [x] Task 5: Update tests for repeated inline modifications (~5 min)
  - **Action:** Add assertions for timeout/error handling and extension-owned context filtering.
  - **Verify:** Local tests pass.

## Verification Criteria
- [x] Second and later inline modifications do not silently hang
- [x] Inline popup shows actionable error messages on failures
- [x] Extension UI is excluded from page-context capture
- [x] Tests pass locally
