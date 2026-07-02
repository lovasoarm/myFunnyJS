// tests/pmap.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { pMap } from "../src/pmap.js";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

test("respecte l'ordre des résultats", async () => {
  const out = await pMap([3, 1, 2], async (n) => { await sleep(n * 10); return n * 10; }, { concurrency: 3 });
  assert.deepEqual(out, [30, 10, 20]);
});

test("ne dépasse jamais la concurrence", async () => {
  let inFlight = 0, max = 0;
  await pMap(Array.from({length: 20}, (_, i) => i), async () => {
    inFlight++; max = Math.max(max, inFlight);
    await sleep(5);
    inFlight--;
  }, { concurrency: 4 });
  assert.ok(max <= 4, `max concurrent = ${max}`);
});

test("AbortSignal stoppe les nouvelles tâches", async () => {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), 20);
  await assert.rejects(() =>
    pMap(Array.from({length: 100}, (_, i) => i),
         async () => { await sleep(10); },
         { concurrency: 2, signal: ctrl.signal }));
});
