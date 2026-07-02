// FIXTURE MEMORY HUNTER : leak volontaire
// Lance avec :  node --expose-gc --inspect leaky.js
//
// Objectif : trouver POURQUOI la RSS grimpe alors que le "cache" a une taille max.
// Indice : la taille max en éléments n'est PAS la taille en octets.

const cache = new Map();
const MAX_ENTRIES = 100; // "borné" ??
const listeners = [];

function makeHeavy(id) {
  // 1 MB par entrée, mais on croit que MAX_ENTRIES suffit à borner
  const payload = Buffer.alloc(1024 * 1024, id % 256);
  const onEvent = () => payload[0]; // closure capture payload
  listeners.push(onEvent); // 🚨 jamais nettoyé
  return { id, payload, onEvent };
}

function put(id) {
  if (cache.size >= MAX_ENTRIES) {
    // évince le plus ancien... mais pas le listener associé
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(id, makeHeavy(id));
}

let i = 0;
const timer = setInterval(() => {
  for (let k = 0; k < 10; k++) put(i++);
  const m = process.memoryUsage();
  console.log(
    `t=${(i / 10).toFixed(0)}s  rss=${(m.rss / 1e6).toFixed(1)}MB  ` +
      `heap=${(m.heapUsed / 1e6).toFixed(1)}MB  cache=${cache.size}  listeners=${listeners.length}`,
  );
  if (global.gc) global.gc();
}, 1000);

process.on("SIGINT", () => {
  clearInterval(timer);
  process.exit(0);
});
