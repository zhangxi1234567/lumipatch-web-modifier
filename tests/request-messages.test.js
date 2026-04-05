import test from "node:test";
import assert from "node:assert/strict";

import {
  OMITTED_FILE_CONTENTS_NOTICE,
  buildRequestMessages
} from "../extension/lib/request-messages.js";

test("buildRequestMessages preserves normal chat history", () => {
  const messages = buildRequestMessages([
    {
      role: "user",
      content: [{ type: "text", text: "你好" }]
    },
    {
      role: "assistant",
      content: [{ type: "text", text: "你好，请问需要什么帮助？" }]
    }
  ]);

  assert.deepEqual(messages, [
    {
      role: "user",
      content: [{ type: "text", text: "你好" }]
    },
    {
      role: "assistant",
      content: [{ type: "text", text: "你好，请问需要什么帮助？" }]
    }
  ]);
});

test("buildRequestMessages trims oversized earlier code dumps for file-generation requests", () => {
  const hugeCodeBlob = "<style>\n" + "x".repeat(14_000) + "\n</style>";
  const messages = buildRequestMessages([
    {
      role: "user",
      content: [{ type: "text", text: "帮我做一个博客网站，生成 index.html style.css main.js" }]
    },
    {
      role: "assistant",
      content: [{ type: "text", text: hugeCodeBlob }]
    },
    {
      role: "user",
      content: [{ type: "text", text: "继续，把 about.html 也补上，并修复导航。" }]
    }
  ]);

  assert.equal(messages.some((message) => JSON.stringify(message).includes(hugeCodeBlob)), false);
  assert.equal(messages[0].role, "assistant");
  assert.match(messages[0].content[0].text, new RegExp(OMITTED_FILE_CONTENTS_NOTICE));
  assert.equal(messages.at(-1).role, "user");
  assert.match(messages.at(-1).content[0].text, /about\.html/);
});
