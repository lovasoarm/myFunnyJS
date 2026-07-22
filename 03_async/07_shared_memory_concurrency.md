---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# CONCURRENCE MÉMOIRE : SharedArrayBuffer & Atomics
Temps de lecture ~15 min

JS "single-thread" ? Plus tout à fait. Avec les Workers + `SharedArrayBuffer`, deux threads voient la MÊME mémoire. Bienvenue dans le monde des data races.

---

## POURQUOI ÇA EXISTE

Tu veux traiter une image de 50 Mo en parallèle sur 4 cœurs sans la recopier 4 fois. `SharedArrayBuffer` partage un bloc mémoire brut entre le main thread et des Workers. `Atomics` te donne des opérations indivisibles pour éviter que deux threads corrompent le même octet.

---

## L'EXEMPLE QUI FAIT MAL (data race)

```js
// main.js
const sab = new SharedArrayBuffer(4);
const view = new Int32Array(sab);
const w1 = new Worker("worker.js");
const w2 = new Worker("worker.js");
w1.postMessage(sab); w2.postMessage(sab);

// worker.js
onmessage = (e) => {
 const v = new Int32Array(e.data);
 for (let i=0;i<100000;i++) v[0]++; // [NON] pas atomique
};
```

Résultat après les deux workers : PAS 200000. Chaque `v[0]++` est en réalité lire→incrémenter→écrire. Les deux threads se marchent dessus.

Fix :
```js
Atomics.add(v, 0, 1); // [OK] indivisible
```

---

## (attention) CE QUE L'ANALOGIE (« deux mecs qui écrivent sur le même tableau ») CACHE

Le CPU réordonne les lectures/écritures pour la perf. Sans `Atomics`, tu n'as même pas la garantie que l'autre thread VOIT ce que tu viens d'écrire. C'est pire qu'une simple collision : c'est de l'invisibilité.

---

## MISSION

Écris deux Workers qui incrémentent un compteur partagé 1M de fois chacun. Compare : version naïve vs `Atomics.add`. Note l'écart au résultat attendu et le temps.

Bonus : implémente un mutex avec `Atomics.wait` / `Atomics.notify`.

---

## PRINCIPES DURABLES

- Mémoire partagée = data races par défaut.
- `Atomics` = opérations indivisibles, obligatoires dès qu'on partage.
- La visibilité mémoire n'est PAS gratuite ; il faut la demander.
