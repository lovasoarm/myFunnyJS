---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# EXO : reimplemente une file de microtasks a la main (12.6)

Temps de lecture ~2 min


## Consigne
Sans utiliser `Promise`, `queueMicrotask`, `setTimeout(0)` ni aucune API native de scheduling, ecris `myMicrotaskQueue.js` qui expose :
- `enqueue(fn)` : ajoute une microtache.
- `runOnce()` : execute toutes les microtaches en attente (les enfilages pendant l'execution passent au prochain drainage).
- `run()` : draine jusqu'a stabilite.

## Test deterministe (a livrer)
```js
const q = require('./myMicrotaskQueue');
const log = [];
q.enqueue(() => { log.push('A'); q.enqueue(() => log.push('B')); });
q.enqueue(() => log.push('C'));
q.run();
console.log(log.join(','));
// attendu : A,C,B
```

## Vulgarisation obligatoire
Ecris dans `EXPLIQUE_A_UN_ENFANT.md` en 5 phrases ce que fait ta file, sans mot technique.
