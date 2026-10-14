// Tests for the VN_Journey pure helpers (see index.html).
// No dependencies: run with `node --test tests/journey.test.js`.
// The helpers are extracted from index.html and evaluated in a sandbox,
// so these tests verify the shipped code, not a copy of it.
"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadJourney() {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const start = html.indexOf("window.VN_Journey = (function () {");
  const end = html.indexOf("})();", start);
  assert.ok(start >= 0, "VN_Journey block not found in index.html");
  const src = html.slice(start, end + 5);
  const sandbox = { window: {}, btoa: (s) => Buffer.from(s, "binary").toString("base64"),
    atob: (s) => Buffer.from(s, "base64").toString("binary") };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox.window.VN_Journey;
}
const J = loadJourney();

test("phase boundaries: 23:40 late, 00:30 deep, 03:30 pre-dawn, 05:00 wraps", () => {
  assert.equal(J.phaseFor(23 * 60 + 40).id, "late");
  assert.equal(J.phaseFor(29).id, "late");
  assert.equal(J.phaseFor(30).id, "deep");
  assert.equal(J.phaseFor(3 * 60 + 29).id, "deep");
  assert.equal(J.phaseFor(3 * 60 + 30).id, "predawn");
  assert.equal(J.phaseFor(5 * 60).id, "late");
});

test("fmt pads hours and minutes", () => {
  assert.equal(J.fmt(23 * 60 + 40), "23:40");
  assert.equal(J.fmt(5), "00:05");
  assert.equal(J.fmt(24 * 60 + 30), "00:30");
});

test("tint darkens toward 02:00 and lifts toward dawn", () => {
  const midnight = J.tintFor(0).darkness;
  const two = J.tintFor(2 * 60).darkness;
  const dawn = J.tintFor(4 * 60 + 30).darkness;
  assert.ok(two >= midnight, "02:00 should be darkest");
  assert.ok(dawn < two, "04:30 should be lighter than 02:00");
});

test("moon arcs left-to-right and fades at dawn", () => {
  const start = J.moonPos(23 * 60 + 40);
  const mid = J.moonPos(1 * 60 + 20);
  const end = J.moonPos(5 * 60);
  assert.ok(start.leftPct < mid.leftPct && mid.leftPct < end.leftPct);
  assert.ok(mid.topPct < start.topPct, "moon rises mid-journey");
  assert.ok(end.opacity < 1, "moon fades near dawn");
});

test("squared curve is perceptual: 0.5 -> 0.25", () => {
  assert.equal(J.squared(0.5), 0.25);
  assert.equal(J.squared(0), 0);
  assert.equal(J.squared(1), 1);
  assert.equal(J.squared(2), 1);
  assert.equal(J.squared(-1), 0);
});

test("share-state encode/decode round-trips", () => {
  const state = { station: 2, music: 0.6, ambient: 0.45, layers: ["rain", "horn"], clock: 137, muffle: true };
  const decoded = J.decodeState("#j=" + J.encodeState(state));
  // Compare via JSON: the decoded object lives in the vm sandbox realm,
  // so its prototype differs from this realm's Object.prototype.
  assert.deepEqual(JSON.parse(JSON.stringify(decoded)), state);
});

test("decodeState rejects garbage and out-of-range values", () => {
  assert.equal(J.decodeState("not-a-token!!!"), null);
  assert.equal(J.decodeState(""), null);
  assert.equal(J.decodeState("#j=" + J.encodeState({ station: 99, music: 0.5, ambient: 0.5, layers: [], clock: 0 })), null);
  assert.equal(J.decodeState("#j=" + J.encodeState({ station: 0, music: 2, ambient: 0.5, layers: [], clock: 0 })), null);
});
