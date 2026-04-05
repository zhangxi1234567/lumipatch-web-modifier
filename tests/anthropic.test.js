import test from "node:test";
import assert from "node:assert/strict";

import {
  buildEffectiveSystemPrompt,
  buildMessagesRequest,
  createEventStreamParser,
  detectFileGenerationIntent,
  extractApiError,
  normalizeBaseUrl,
  parseAnthropicText,
  parseResponseBody,
  resolveMaxTokensForRequest
} from "../extension/lib/anthropic.js";

test("normalizeBaseUrl trims whitespace and trailing slashes", () => {
  assert.equal(
    normalizeBaseUrl(" http://127.0.0.1:3030/ "),
    "http://127.0.0.1:3030"
  );
});

test("buildMessagesRequest includes system prompt when provided", () => {
  const payload = buildMessagesRequest({
    model: "sonnet4.6",
    systemPrompt: "You are concise.",
    maxTokens: 512,
    messages: [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi" }
    ]
  });

  assert.deepEqual(payload, {
    model: "sonnet4.6",
    max_tokens: 512,
    stream: false,
    system: "You are concise.",
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: "Hello" }]
      },
      {
        role: "assistant",
        content: [{ type: "text", text: "Hi" }]
      }
    ]
  });
});

test("parseAnthropicText joins multiple text blocks", () => {
  const text = parseAnthropicText({
    content: [
      { type: "text", text: "Line 1" },
      { type: "tool_use", name: "ignore" },
      { type: "text", text: "Line 2" }
    ]
  });

  assert.equal(text, "Line 1\n\nLine 2");
});

test("extractApiError prefers anthropic error message", () => {
  const error = extractApiError({
    error: {
      type: "invalid_request_error",
      message: "Bad request"
    }
  });

  assert.equal(error, "Bad request");
});

test("parseResponseBody reads event-stream delta text", () => {
  const text = parseResponseBody(
    [
      "event: message_start",
      'data: {"type":"message_start","message":{"content":[]}}',
      "",
      "event: content_block_start",
      'data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}',
      "",
      "event: content_block_delta",
      'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"你好"}}',
      "",
      "event: content_block_delta",
      'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"！"}}'
    ].join("\n"),
    "text/event-stream; charset=utf-8"
  );

  assert.equal(text, "你好！");
});

test("buildMessagesRequest supports multimodal user content", () => {
  const payload = buildMessagesRequest({
    model: "sonnet4.6",
    maxTokens: 256,
    stream: true,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            mediaType: "image/png",
            data: "ZmFrZS1iYXNlNjQ="
          },
          {
            type: "text",
            text: "Describe this image."
          }
        ]
      }
    ]
  });

  assert.deepEqual(payload, {
    model: "sonnet4.6",
    max_tokens: 256,
    stream: true,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/png",
              data: "ZmFrZS1iYXNlNjQ="
            }
          },
          {
            type: "text",
            text: "Describe this image."
          }
        ]
      }
    ]
  });
});

test("createEventStreamParser emits events from fragmented chunks", () => {
  const events = [];
  const parser = createEventStreamParser((event) => {
    events.push(event);
  });

  parser.push(
    'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"你"}}\n'
  );
  parser.push(
    '\nevent: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"好"}}\n\n'
  );

  assert.deepEqual(events, [
    {
      event: "content_block_delta",
      data: {
        type: "content_block_delta",
        delta: {
          type: "text_delta",
          text: "你"
        }
      }
    },
    {
      event: "content_block_delta",
      data: {
        type: "content_block_delta",
        delta: {
          type: "text_delta",
          text: "好"
        }
      }
    }
  ]);
});

test("detectFileGenerationIntent recognizes website and file-authoring prompts", () => {
  assert.equal(
    detectFileGenerationIntent([
      {
        role: "user",
        content: [{ type: "text", text: "帮我在这个目录里写一个博客网站，包含 index.html、style.css 和 main.js" }]
      }
    ]),
    true
  );

  assert.equal(
    detectFileGenerationIntent([
      {
        role: "user",
        content: [{ type: "text", text: "你好，帮我总结一下这段文章。" }]
      }
    ]),
    false
  );
});

test("buildEffectiveSystemPrompt appends file-authoring guardrails for generation tasks", () => {
  const prompt = buildEffectiveSystemPrompt({
    systemPrompt: "You are a helpful assistant.",
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: "Create a landing page with html css and js files." }]
      }
    ]
  });

  assert.match(prompt, /You are a helpful assistant\./);
  assert.match(prompt, /use them instead of dumping large code blocks/i);
  assert.match(prompt, /Never serialize file contents as escaped/i);
  assert.match(prompt, /style\.css/i);
});

test("resolveMaxTokensForRequest raises the token budget for file-generation tasks", () => {
  assert.equal(
    resolveMaxTokensForRequest({
      maxTokens: 1024,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: "请帮我生成一个完整博客网站项目文件。" }]
        }
      ]
    }) >= 4096,
    true
  );

  assert.equal(
    resolveMaxTokensForRequest({
      maxTokens: 1024,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: "请用一句话介绍你自己。" }]
        }
      ]
    }),
    1024
  );
});
