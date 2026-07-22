---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# 08 : Heap snapshot workshop (fuite par closure)
Temps de lecture ~5 min

> **INTEMPOREL** : un objet vivant = un objet **atteignable** depuis une racine.
> La fuite mémoire n'est pas de la magie, c'est une référence oubliée.

## Contexte

On construit un cache "malin" :

```js
const cache = new Map();
function makeHandler(user) {
 const history = new Array(100_000).fill(user.name); // gros
 return function onClick() {
  console.log(history[0]);
 };
}
for (let i = 0; i < 10_000; i++) {
 cache.set(i, makeHandler({ name: `user_${i}` }));
}
```

Sur le papier, `history` est "local". En pratique, chaque handler dans `cache`
retient sa closure → chaque `history` reste vivant → **1 Go de RAM**.

## Atelier (3 étapes)

### 1. Génère le snapshot

- Node : `node --inspect script.js` puis Chrome → `chrome://inspect` →
 "Take heap snapshot".
- Navigateur : DevTools → Memory → Heap snapshot.

Prends **trois** snapshots :
- avant la boucle,
- après la boucle,
- après un `cache.clear()`.

### 2. Diff

Dans Chrome DevTools → "Comparison" entre snapshot 1 et 2. Trie par
"Retained Size" décroissant. Cherche `(closure)` et `Array`. Tu dois voir
~10 000 fermetures et ~10 000 tableaux de 100k éléments.

### 3. Trouve la racine

Sélectionne un objet fautif → onglet "Retainers". Remonte la chaîne. Tu
tombes sur `cache` (Map) → clé → valeur (closure) → `history`.

## Question test

Pourquoi `cache.clear()` ne suffit pas toujours à libérer si un handler a été
ajouté à un `addEventListener` externe ? Réponds en une phrase (référence
retenue par le DOM / EventTarget).

## Correctifs (par ordre de préférence)

1. **Ne capture pas ce dont tu n'as pas besoin** : sors `history` de la closure.
2. **`WeakMap` / `WeakRef`** : si la clé peut disparaître, la valeur suivra.
3. **Cache borné** : `lru-cache` avec `max: 500`.

## Livrable

`FUITE_ANALYSE.md` avec :
- 3 captures d'écran des snapshots,
- la chaîne de rétention identifiée,
- le correctif retenu + mesure avant/après.

## (attention) Ce que l'outil cache

Un heap snapshot est une **photo**, pas une vidéo. Il ne montre pas les
allocations sur la durée. Pour ça : profiler "Allocation instrumentation on
timeline". Ils sont complémentaires, pas interchangeables.


---

## SCHÉMA ASCII : HEAP & GC ROOTS

```
  [ GC ROOTS ]
  ├── globalThis ──► Objet A ──► Objet B
  │            └────► Objet C
  ├── stack frame ──► Objet D
  │            └────► Objet E
  │
  ▼ (atteignables = vivants)
  ══════════════════════════════════
  [ ORPHELINS = candidats au GC ]
  Objet F Objet G (personne ne pointe dessus)
```

Règle : atteignable depuis une racine ⇒ vivant. Sinon ⇒ collecté.

---

## FORCER LE GC (debug uniquement)

En prod, JAMAIS. En debug, indispensable pour valider une fuite mémoire.

```bash
node --expose-gc mon_script.js
```

```js
console.log(process.memoryUsage().heapUsed);
if (global.gc) global.gc();     // force un cycle
console.log(process.memoryUsage().heapUsed); // devrait baisser
```

Quand l'utiliser :
- Reproduire une fuite : snapshot, `global.gc()`, snapshot, compare.
- Tester qu'un cache libère bien après un `delete`.
- Mesurer la mémoire "propre" d'un traitement, sans bruit GC en attente.

(attention) `--expose-gc` désactive certaines optimisations V8. Résultats à valider sans le flag en prod.
