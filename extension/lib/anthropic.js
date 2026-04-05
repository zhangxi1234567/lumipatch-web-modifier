const DEFAULT_MAX_TOKENS = 1024;
const FILE_GENERATION_MIN_TOKENS = 4096;
const FILE_GENERATION_SYSTEM_PROMPT = [
  "When the user asks for a website, project, or local files, if file-writing tools are available, use them instead of dumping large code blocks into chat.",
  "If tools are not available, provide raw file contents in fenced code blocks with real newlines.",
  "Never serialize file contents as escaped JSON strings or escaped newline sequences like \\\\n.",
  "If your HTML references assets such as style.css, main.js, script.js, or data files, make sure those files are also created before you finish.",
  "Keep the chat response concise and progress-oriented after file work is complete."
].join("\n");
const FILE_GENERATION_PATTERN =
  /(\b(index|about|post|main|style|script)\.(html|css|js)\b|\b(html|css|javascript|website|landing page|web page|project files|codebase|repo|repository|folder|directory)\b|网站|网页|博客|页面|文件|目录|文件夹|样式|脚本|代码|项目)/i;

export function normalizeBaseUrl(value) {
  return String(value ?? "").trim().replace(/\/+$/, "");
}

export function buildEndpoint(baseUrl) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  if (/\/v\d+$/i.test(normalizedBaseUrl)) {
    return `${normalizedBaseUrl}/messages`;
  }
  return `${normalizedBaseUrl}/v1/messages`;
}

export function buildMessagesRequest({
  model,
  systemPrompt = "",
  maxTokens = DEFAULT_MAX_TOKENS,
  messages = [],
  stream = false
}) {
  const payload = {
    model: String(model ?? "").trim(),
    max_tokens: Number.isFinite(maxTokens) ? maxTokens : DEFAULT_MAX_TOKENS,
    stream: Boolean(stream),
    messages: messages
      .filter((message) => {
        return (
          message &&
          (message.role === "user" || message.role === "assistant") &&
          normalizeMessageContent(message.content).length > 0
        );
      })
      .map((message) => ({
        role: message.role,
        content: normalizeMessageContent(message.content)
      }))
  };

  const trimmedSystemPrompt = String(systemPrompt ?? "").trim();
  if (trimmedSystemPrompt) {
    payload.system = trimmedSystemPrompt;
  }

  return payload;
}

export function detectFileGenerationIntent(messages = []) {
  return Boolean(getLatestUserText(messages).match(FILE_GENERATION_PATTERN));
}

export function buildEffectiveSystemPrompt({ systemPrompt = "", messages = [] } = {}) {
  const trimmedSystemPrompt = String(systemPrompt ?? "").trim();
  if (!detectFileGenerationIntent(messages)) {
    return trimmedSystemPrompt;
  }

  return [trimmedSystemPrompt, FILE_GENERATION_SYSTEM_PROMPT]
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

export function resolveMaxTokensForRequest({ maxTokens = DEFAULT_MAX_TOKENS, messages = [] } = {}) {
  const normalizedMaxTokens = Number.isFinite(maxTokens) ? maxTokens : DEFAULT_MAX_TOKENS;
  if (!detectFileGenerationIntent(messages)) {
    return normalizedMaxTokens;
  }

  return Math.max(normalizedMaxTokens, FILE_GENERATION_MIN_TOKENS);
}

export function parseAnthropicText(responseData) {
  if (!responseData || !Array.isArray(responseData.content)) {
    return "";
  }

  return responseData.content
    .filter((block) => block?.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

export function parseResponseBody(rawText, contentType = "") {
  const normalizedContentType = String(contentType ?? "").toLowerCase();

  if (normalizedContentType.includes("text/event-stream")) {
    return parseEventStreamText(rawText);
  }

  if (!rawText) {
    return "";
  }

  try {
    return parseAnthropicText(JSON.parse(rawText));
  } catch {
    return "";
  }
}

export function createEventStreamParser(onEvent) {
  let buffer = "";

  return {
    push(chunk) {
      buffer += String(chunk ?? "");

      while (true) {
        const delimiterIndex = buffer.search(/\r?\n\r?\n/);
        if (delimiterIndex === -1) {
          break;
        }

        const rawEvent = buffer.slice(0, delimiterIndex);
        const delimiter = buffer.slice(delimiterIndex).match(/^\r?\n\r?\n/);
        buffer = buffer.slice(delimiterIndex + (delimiter?.[0]?.length ?? 2));

        const parsedEvent = parseEventStreamChunk(rawEvent);
        if (parsedEvent) {
          onEvent(parsedEvent);
        }
      }
    },
    flush() {
      const remaining = buffer.trim();
      buffer = "";
      if (!remaining) {
        return;
      }

      const parsedEvent = parseEventStreamChunk(remaining);
      if (parsedEvent) {
        onEvent(parsedEvent);
      }
    }
  };
}

export function extractApiError(payload, fallback = "Request failed.") {
  if (typeof payload?.error?.message === "string" && payload.error.message.trim()) {
    return payload.error.message.trim();
  }

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  return fallback;
}

function parseEventStreamText(rawText) {
  const chunks = String(rawText ?? "")
    .split(/\n\n+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const parts = [];

  for (const chunk of chunks) {
    const dataLines = chunk
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .filter(Boolean);

    for (const dataLine of dataLines) {
      if (dataLine === "[DONE]") {
        continue;
      }

      try {
        const eventPayload = JSON.parse(dataLine);
        const deltaText = eventPayload?.delta?.text;
        const blockText = eventPayload?.content_block?.text;

        if (typeof deltaText === "string" && deltaText) {
          parts.push(deltaText);
          continue;
        }

        if (typeof blockText === "string" && blockText) {
          parts.push(blockText);
        }
      } catch {
        // Ignore non-JSON event payloads.
      }
    }
  }

  return parts.join("").trim();
}

function normalizeMessageContent(content) {
  if (typeof content === "string") {
    const text = content.trim();
    return text ? [{ type: "text", text }] : [];
  }

  if (!Array.isArray(content)) {
    return [];
  }

  return content.flatMap((block) => normalizeContentBlock(block));
}

function getLatestUserText(messages) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role !== "user") {
      continue;
    }

    const text = normalizeMessageContent(message.content)
      .filter((block) => block.type === "text")
      .map((block) => block.text.trim())
      .find(Boolean);

    if (text) {
      return text;
    }
  }

  return "";
}

function normalizeContentBlock(block) {
  if (!block || typeof block !== "object") {
    return [];
  }

  if (block.type === "text") {
    const text = String(block.text ?? "").trim();
    return text ? [{ type: "text", text }] : [];
  }

  if (block.type === "image") {
    const mediaType = String(block.mediaType ?? block.media_type ?? "").trim();
    const data = String(block.data ?? "").trim();

    if (!mediaType || !data) {
      return [];
    }

    return [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: mediaType,
          data
        }
      }
    ];
  }

  return [];
}

function parseEventStreamChunk(rawChunk) {
  const lines = String(rawChunk ?? "")
    .split(/\r?\n/)
    .map((line) => line.trimEnd());

  if (lines.length === 0) {
    return null;
  }

  let eventName = "message";
  const dataLines = [];

  for (const line of lines) {
    if (!line || line.startsWith(":")) {
      continue;
    }

    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim() || eventName;
      continue;
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }

  if (dataLines.length === 0) {
    return null;
  }

  const joinedData = dataLines.join("\n");
  if (joinedData === "[DONE]") {
    return { event: eventName, data: "[DONE]" };
  }

  try {
    return {
      event: eventName,
      data: JSON.parse(joinedData)
    };
  } catch {
    return {
      event: eventName,
      data: joinedData
    };
  }
}
