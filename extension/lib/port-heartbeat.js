export const HEARTBEAT_INTERVAL_MS = 20_000;
export const HEARTBEAT_MESSAGE_TYPE = "assistant:heartbeat";

export function createPortHeartbeat({
  requestId,
  sendMessage,
  intervalMs = HEARTBEAT_INTERVAL_MS,
  timers = globalThis
}) {
  let intervalId = null;

  const emitHeartbeat = () => {
    sendMessage({
      type: HEARTBEAT_MESSAGE_TYPE,
      requestId
    });
  };

  return {
    start() {
      if (intervalId !== null) {
        return;
      }

      emitHeartbeat();
      intervalId = timers.setInterval(emitHeartbeat, intervalMs);
    },

    stop() {
      if (intervalId === null) {
        return;
      }

      timers.clearInterval(intervalId);
      intervalId = null;
    }
  };
}
