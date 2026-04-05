export function createConversation({
  title = "New chat",
  pageContext = null,
  messages = []
} = {}) {
  const timestamp = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: String(title).trim() || "New chat",
    createdAt: timestamp,
    updatedAt: timestamp,
    pageContext,
    messages
  };
}

export function createConversationTitle({ pageContext = null, messages = [] } = {}) {
  const pageTitle = String(pageContext?.title ?? "").trim();
  if (pageTitle) {
    return trimTitle(pageTitle);
  }

  const firstUserText = messages
    .filter((message) => message?.role === "user")
    .flatMap((message) => getTextBlocks(message.content))
    .map((block) => block.text.trim())
    .find(Boolean);

  if (firstUserText) {
    return trimTitle(firstUserText);
  }

  return "New chat";
}

export function buildContextPrompt(pageContext) {
  if (!pageContext) {
    return "";
  }

  const lines = ["Current page context:"];

  if (pageContext.title) {
    lines.push(`Title: ${pageContext.title}`);
  }

  if (pageContext.url) {
    lines.push(`URL: ${pageContext.url}`);
  }

  if (pageContext.selectionText) {
    lines.push(`Selected text: ${pageContext.selectionText}`);
  }

  if (pageContext.bodyText) {
    lines.push(`Page summary: ${pageContext.bodyText}`);
  }

  if (pageContext.capturedAt) {
    lines.push(`Captured at: ${pageContext.capturedAt}`);
  }

  return lines.join("\n");
}

export function exportConversationMarkdown({ workspaceName, conversation }) {
  const safeWorkspaceName = String(workspaceName ?? "Workspace").trim();
  const safeConversation = conversation ?? {};
  const sections = [`# ${safeWorkspaceName}`, "", `## ${safeConversation.title ?? "Conversation"}`, ""];

  if (safeConversation.updatedAt) {
    sections.push(`Updated: ${safeConversation.updatedAt}`, "");
  }

  if (safeConversation.pageContext) {
    sections.push("### Page Context", "");

    if (safeConversation.pageContext.title) {
      sections.push(`- Title: ${safeConversation.pageContext.title}`);
    }

    if (safeConversation.pageContext.url) {
      sections.push(`- URL: ${safeConversation.pageContext.url}`);
    }

    if (safeConversation.pageContext.selectionText) {
      sections.push(`- Selected Text: ${safeConversation.pageContext.selectionText}`);
    }

    if (safeConversation.pageContext.bodyText) {
      sections.push(`- Page Summary: ${safeConversation.pageContext.bodyText}`);
    }

    sections.push("");
  }

  sections.push("### Transcript", "");

  for (const message of safeConversation.messages ?? []) {
    const heading = message.role === "assistant" ? "Assistant" : "User";
    sections.push(`#### ${heading}`, "");

    if (message.contextPrompt) {
      sections.push("> Attached page context", "");
    }

    for (const block of message.content ?? []) {
      if (block.type === "text" && block.text) {
        sections.push(block.text, "");
      }

      if (block.type === "image") {
        sections.push(`![${block.name ?? "image"}](data:${block.mediaType};base64,${block.data})`, "");
      }
    }
  }

  return sections.join("\n").trim() + "\n";
}

export function buildConversationPreview(conversation) {
  const lastMessage = [...(conversation?.messages ?? [])].reverse().find(Boolean);
  if (!lastMessage) {
    return "Start chatting";
  }

  const text = getTextBlocks(lastMessage.content)
    .map((block) => block.text.trim())
    .find(Boolean);

  return trimTitle(text || "Image attachment");
}

function getTextBlocks(content) {
  return Array.isArray(content)
    ? content.filter((block) => block?.type === "text" && typeof block.text === "string")
    : [];
}

function trimTitle(value) {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized.length > 60 ? `${normalized.slice(0, 57)}...` : normalized;
}
