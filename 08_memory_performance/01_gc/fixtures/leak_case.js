// Fixture de fuite mémoire reproductible pour 05_heap_snapshot_hands_on.md
// Usage :
//   node --expose-gc --inspect=0.0.0.0:9229 08_memory_performance/01_gc/fixtures/leak_case.js
//
// Le process alloue un batch de 5000 objets par tick, en garde une référence
// dans un cache global qui n'est jamais vidé, et enregistre à chaque tick
// un listener supplémentaire sur un EventEmitter. Deux fuites classiques :
//   1) cache non borné (Map globale qui grossit à l'infini),
//   2) listeners orphelins (aucun removeListener).
//
// Attendu :
//   - RSS croît linéairement (~20 MB / 30 s selon la machine),
//   - snapshot 1 (t=10s) vs snapshot 2 (t=60s) : top delta = strings/objects
//     retenus par la Map globale + closures des listeners.

"use strict";

const { EventEmitter } = require("node:events");

const emitter = new EventEmitter();
emitter.setMaxListeners(0); // silence le warning volontairement

const cache = new Map(); // FUITE 1 : jamais vidée
let tick = 0;

function makePayload(seed) {
  // ~2 KB de données par item pour rendre la fuite visible dans le RSS
  return {
    seed,
    data: new Array(200).fill(0).map((_, i) => `item_${seed}_${i}`),
    createdAt: Date.now(),
  };
}

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
  // Alloue 5000 objets, tous conservés dans le cache global
  for (let i = 0; i < 5000; i += 1) {
    const key = `${tick}:${i}`;
    cache.set(key, makePayload(key));
  }
  // FUITE 2 : listener ajouté à chaque tick, jamais retiré
  emitter.on("data", function leakyListener(chunk) {
    // capture "cache" par closure : chaque listener retient une réf du cache
    void cache.size;
    void chunk;
  });
  heartbeat();
}, 1000);

// Force un GC visible toutes les 5 secondes pour prouver que la fuite ne dépend
// pas de la paresse du GC : elle persiste après GC forcé.
setInterval(() => {
  if (typeof global.gc === "function") {
    global.gc();
    console.log("  -- forced GC --");
  }
}, 5000);
