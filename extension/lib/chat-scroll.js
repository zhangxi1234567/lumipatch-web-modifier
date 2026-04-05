export function isChatScrollPinned({
  scrollHeight = 0,
  scrollTop = 0,
  clientHeight = 0,
  threshold = 48
} = {}) {
  return scrollHeight - scrollTop - clientHeight <= threshold;
}
