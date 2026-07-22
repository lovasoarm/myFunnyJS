// Version corrigée de leak_case.js. Deux corrections minimales :
//   1) Le cache global devient une LRU bornée (taille max 1000).
//   2) Le listener est attaché UNE fois, hors du setInterval.
//
// Lance côte à côte avec leak_case.js et compare le RSS à t=60s.

"use strict";

const { EventEmitter } = require("node:events");

const emitter = new EventEmitter();

// Cache LRU minimal via l'ordre d'insertion de Map
const MAX = 1000;
const cache = new Map();
function cachePut(k, v) {
  if (cache.has(k)) cache.delete(k);
  cache.set(k, v);
  if (cache.size > MAX) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

let tick = 0;

function makePayload(seed) {
  return {
    seed,
    data: new Array(200).fill(0).map((_, i) => `item_${seed}_${i}`),
    createdAt: Date.now(),
  };
}

// FIX 2 : listener attaché une seule fois
emitter.on("data", function stableListener(chunk) {
  void chunk;
});

function heartbeat() {
  const mb = (n) => (n / 1024 / 1024).toFixed(1);
  const m = process.memoryUsage();
  console.log(
    `[t=${String(tick).padStart(3, "0")}s] ` +
      `rss=${mb(m.rss)}MB heap=${mb(m.heapUsed)}MB ` +
      `cache=${cache.size} listeners=${emitter.listenerCount("data")}`,
  );
}

setInterval(() => {
  tick += 1;
  for (let i = 0; i < 5000; i += 1) {
    cachePut(`${tick}:${i}`, makePayload(`${tick}:${i}`));
  }
  heartbeat();
}, 1000);

setInterval(() => {
  if (typeof global.gc === "function") global.gc();
}, 5000);
