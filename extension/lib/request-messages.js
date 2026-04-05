import { detectFileGenerationIntent } from "./anthropic.js";

const MAX_FILE_GENERATION_MESSAGES = 8;
const MAX_FILE_GENERATION_CHARS = 12_000;

export const OMITTED_FILE_CONTENTS_NOTICE =
  "Earlier generated file contents were omitted to keep this request fast. Use the current project files or tools instead of replaying prior code dumps.";

export function buildRequestMessages(messages = []) {
  const normalizedMessages = Array.isArray(messages) ? messages.filter(Boolean) : [];
  if (!detectFileGenerationIntent(normalizedMessages)) {
    return normalizedMessages.map(toApiMessage).filter(hasApiContent);
  }

  const selectedMessages = [];
  let totalChars = 0;
  let skippedEarlierContent = false;

  for (let index = normalizedMessages.length - 1; index >= 0; index -= 1) {
    const candidate = normalizedMessages[index];
    const apiMessage = toApiMessage(candidate);

    if (!hasApiContent(apiMessage)) {
      continue;
    }

    const candidateChars = estimateApiMessageChars(apiMessage);
    const canKeepByCount = selectedMessages.length < MAX_FILE_GENERATION_MESSAGES;
    const canKeepBySize = totalChars + candidateChars <= MAX_FILE_GENERATION_CHARS;
    const isLatestUserMessage =
      candidate.role === "user" && selectedMessages.every((message) => message.role !== "user");

    if ((canKeepByCount && canKeepBySize) || isLatestUserMessage) {
      selectedMessages.push(apiMessage);
      totalChars += candidateChars;
      continue;
    }

    skippedEarlierContent = true;
  }

  selectedMessages.reverse();

  if (skippedEarlierContent) {
    selectedMessages.unshift({
      role: "assistant",
      content: [{ type: "text", text: OMITTED_FILE_CONTENTS_NOTICE }]
    });
  }

  return selectedMessages;
}

export function toApiMessage(message) {
  const imageBlocks = [];
  const textBlocks = [];

  for (const block of message?.content ?? []) {
    if (block.type === "image") {
      imageBlocks.push({
        type: "image",
        mediaType: block.mediaType,
        data: block.data
      });
      continue;
    }

    if (block.type === "text") {
      const text = String(block.text ?? "");
      if (!text) {
        continue;
      }

      textBlocks.push({
        type: "text",
        text
      });
    }
  }

  if (message?.contextPrompt) {
    textBlocks.unshift({
      type: "text",
      text: `${message.contextPrompt}\n\nUser request:`
    });
  }

  return {
    role: message?.role,
    content: [...imageBlocks, ...textBlocks]
  };
}

function hasApiContent(message) {
  return Array.isArray(message?.content) && message.content.length > 0;
}

function estimateApiMessageChars(message) {
  return (message?.content ?? []).reduce((total, block) => {
    if (block.type === "text") {
      return total + String(block.text ?? "").length;
    }

    if (block.type === "image") {
      return total + String(block.data ?? "").length;
    }

    return total;
  }, 0);
}
