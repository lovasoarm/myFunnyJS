// tests/loop.test.js : spec d'acceptation. Ne révèle pas l'implémentation.
import test from "node:test";
import assert from "node:assert/strict";
import { Loop } from "../src/loop.js";

test("micros vidées entre chaque macro", async () => {
  const out = [];
  const loop = new Loop();
  loop.queueMacro(() => out.push("A"));
  loop.queueMicro(() => out.push("B"));
  loop.queueMacro(() => out.push("C"));
  await loop.drain();
  assert.deepEqual(out, ["A", "B", "C"]);
});

test("microtask peut en enfiler d'autres, toutes drainées avant macro suivante", async () => {
  const out = [];
  const loop = new Loop();
  loop.queueMacro(() => out.push("M1"));
  loop.queueMicro(function chain() {
    out.push("u");
    if (out.filter((x) => x === "u").length < 3) loop.queueMicro(chain);
  });
  loop.queueMacro(() => out.push("M2"));
  await loop.drain();
  assert.deepEqual(out, ["M1", "u", "u", "u", "M2"]);
});
