import test from "node:test";
import assert from "node:assert/strict";

import {
  HEARTBEAT_INTERVAL_MS,
  HEARTBEAT_MESSAGE_TYPE,
  createPortHeartbeat
} from "../extension/lib/port-heartbeat.js";

function createFakeTimers() {
  let nextId = 1;
  const intervals = new Map();

  return {
    timers: {
      setInterval(callback, delay) {
        const id = nextId++;
        intervals.set(id, { callback, delay });
        return id;
      },
      clearInterval(id) {
        intervals.delete(id);
      }
    },
    intervals
  };
}

test("createPortHeartbeat sends an immediate heartbeat and keeps repeating until stopped", () => {
  const sent = [];
  const { timers, intervals } = createFakeTimers();
  const heartbeat = createPortHeartbeat({
    requestId: "req-1",
    sendMessage(payload) {
      sent.push(payload);
    },
    timers
  });

  heartbeat.start();

  assert.deepEqual(sent, [
    {
      type: HEARTBEAT_MESSAGE_TYPE,
      requestId: "req-1"
    }
  ]);
  assert.equal(intervals.size, 1);
  assert.equal(intervals.values().next().value.delay, HEARTBEAT_INTERVAL_MS);

  intervals.values().next().value.callback();

  assert.deepEqual(sent, [
    {
      type: HEARTBEAT_MESSAGE_TYPE,
      requestId: "req-1"
    },
    {
      type: HEARTBEAT_MESSAGE_TYPE,
      requestId: "req-1"
    }
  ]);

  heartbeat.stop();
  assert.equal(intervals.size, 0);
});

test("createPortHeartbeat does not register duplicate timers on repeated start calls", () => {
  const sent = [];
  const { timers, intervals } = createFakeTimers();
  const heartbeat = createPortHeartbeat({
    requestId: "req-2",
    sendMessage(payload) {
      sent.push(payload);
    },
    intervalMs: 1234,
    timers
  });

  heartbeat.start();
  heartbeat.start();

  assert.equal(intervals.size, 1);
  assert.equal(sent.length, 1);
});
