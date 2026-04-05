import test from "node:test";
import assert from "node:assert/strict";

import {
  buildContextPrompt,
  createConversationTitle,
  exportConversationMarkdown
} from "../extension/lib/workspace.js";

test("createConversationTitle prefers explicit page title before generic fallback", () => {
  const title = createConversationTitle({
    pageContext: {
      title: "Quarterly Revenue Dashboard"
    },
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: "Summarize the current page." }]
      }
    ]
  });

  assert.equal(title, "Quarterly Revenue Dashboard");
});

test("buildContextPrompt formats page url selection and body excerpt", () => {
  const prompt = buildContextPrompt({
    title: "Pricing Review",
    url: "https://example.com/pricing",
    selectionText: "Enterprise plan starts at 99 dollars",
    bodyText: "Pricing page body summary here"
  });

  assert.match(prompt, /Pricing Review/);
  assert.match(prompt, /https:\/\/example\.com\/pricing/);
  assert.match(prompt, /Enterprise plan starts at 99 dollars/);
  assert.match(prompt, /Pricing page body summary here/);
});

test("exportConversationMarkdown includes workspace metadata context and transcript", () => {
  const markdown = exportConversationMarkdown({
    workspaceName: "Acme AI Workspace",
    conversation: {
      id: "conv-1",
      title: "Pricing Review",
      updatedAt: "2026-03-20T07:05:00.000Z",
      pageContext: {
        title: "Pricing Review",
        url: "https://example.com/pricing"
      },
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: "Summarize the pricing model." }]
        },
        {
          role: "assistant",
          content: [{ type: "text", text: "The page describes three pricing tiers." }]
        }
      ]
    }
  });

  assert.match(markdown, /Acme AI Workspace/);
  assert.match(markdown, /Pricing Review/);
  assert.match(markdown, /https:\/\/example\.com\/pricing/);
  assert.match(markdown, /Summarize the pricing model/);
  assert.match(markdown, /three pricing tiers/);
});
