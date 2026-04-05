export function shouldSubmitOnEnterKey(event) {
  return Boolean(
    event?.key === "Enter" &&
      !event?.shiftKey &&
      !event?.altKey &&
      !event?.ctrlKey &&
      !event?.metaKey &&
      !event?.isComposing
  );
}
