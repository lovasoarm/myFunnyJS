---
stability: periss-2028
duree_de_vie_estimee: 1-2 ans
raison: Les patterns d'hallucination IA évoluent avec les modèles.
---

# Faux positifs IA : le snippet propre qui ment

Temps de lecture ~25 min

> Cinq snippets. Chacun a l'air propre. Chacun cache trois pièges. Ton exercice : trouver, prouver, corriger. Correction cachée dans `node solution.js` (auto-verif ecrite par toi).

## LA RÈGLE DU JEU

Pour chaque snippet :

1. Repère les 3 pièges. Nomme-les.
2. Prouve chaque piège avec un test minimal (2-5 lignes).
3. Propose la version corrigée.

Interdiction absolue d'exécuter le code avant d'avoir écrit tes 3 hypothèses. Sinon, l'exercice ne compte pas.

---

## SNIPPET 1 : "Copilot m'a proposé un cache mémoire"

Contexte : tu veux mémoriser le résultat de `fetchGaraStats(id)` pour ne pas retaper l'API.

```js
const cache = {};
async function getStats(id) {
  if (cache[id]) return cache[id];
  cache[id] = await fetchGaraStats(id);
  return cache[id];
}
```

Cherche : hallucination d'API ? race condition ? fuite mémoire ? mauvais pattern archi ? benchmark biaisé ?

---

## SNIPPET 2 : "Copilot m'a proposé une fonction de hash"

Contexte : hacher un mot de passe avant de le stocker.

```js
import crypto from "crypto";
export function hashPassword(pw) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}
```

Cherche les 3 pièges. Un est cryptographique, un est fonctionnel, un est architectural.

---

## SNIPPET 3 : "Copilot m'a proposé un rate limiter"

Contexte : limiter à 5 requêtes par IP par minute.

```js
const hits = new Map();
export function rateLimit(ip) {
  const now = Date.now();
  const arr = hits.get(ip) || [];
  const recent = arr.filter((t) => now - t < 60_000);
  if (recent.length >= 5) return false;
  recent.push(now);
  hits.set(ip, recent);
  return true;
}
```

Cherche : concurrence, mémoire, correction du comptage.

---

## SNIPPET 4 : "Copilot m'a proposé un benchmark"

Contexte : comparer `Array.includes` et `Set.has`.

```js
const arr = Array.from({ length: 1000 }, (_, i) => i);
const set = new Set(arr);

console.time("arr");
arr.includes(999);
console.timeEnd("arr");

console.time("set");
set.has(999);
console.timeEnd("set");
```

Cherche : biais de mesure, warmup, statistiquement invalide.

---

## SNIPPET 5 : "Copilot m'a proposé une lecture de fichier"

Contexte : lire un fichier de config au démarrage.

```js
import fs from "fs";
export const config = JSON.parse(fs.readFileSync("./config.json"));
```

Cherche : encoding, top-level side effect, erreur silencieuse.

---

## LIVRABLE

Un fichier `AUDIT_FAUX_POSITIFS.md` avec 5 sections numérotées. Chaque section :

- Les 3 pièges nommés.
- Le test minimal qui prouve chaque piège.
- La version corrigée du snippet.

Puis lance `node solution.js faux_positifs`. Si tu as raté un piège, le verify te dit lequel sans te donner la réponse.

## POURQUOI CET EXERCICE

Un output IA plausible-mais-faux est plus dangereux qu'un output visiblement cassé : il passe les tests superficiels, il passe la revue rapide, il crashe en prod. Le seul remède : la lecture méthodique. Cet exo t'entraîne à cette lecture.
