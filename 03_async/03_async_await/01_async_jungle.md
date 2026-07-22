---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# ASYNC/AWAIT : LA JUNGLE
Temps de lecture ~8 min

`async/await` rend l'async lisible. Mais "lisible" ne veut pas dire "correct".
Le vrai piège : le code a l'air synchrone alors qu'il ne l'est pas.
Et selon comment tu écris ta boucle, tu peux diviser ton temps d'exécution par 10 : ou le multiplier par 10.

---

## 1) LA BASE : CE QUE `async/await` EST VRAIMENT

`async` transforme une fonction en une fonction qui retourne toujours une Promise.
`await` suspend l'exécution de la fonction courante jusqu'à ce que la Promise soit résolue.

```js
// sans async/await
function getKnight() {
 return fetch("/api/knight/leon")
  .then((res) => res.json())
  .then((data) => data);
}

// avec async/await
// c'est la même chose:la syntaxe change, pas le comportement
async function getKnight() {
 const res = await fetch("/api/knight/leon");
 const data = await res.json();
 return data;
}
```

Ce que le moteur JS fait réellement :

```
appel à getKnight()
 --> la fonction démarre
 --> fetch() est lancé
 --> await suspend getKnight()
 --> la call stack est libérée, d'autres tâches peuvent tourner
 --> quand fetch() se résout : getKnight() reprend
 --> await res.json() : même chose
 --> return data --> la Promise retournée par getKnight() se résout
```

`await` ne bloque pas le thread. Il suspend la fonction, rien d'autre.

---

## 2) SEQUENTIAL VS PARALLEL : LÀ OÙ TOUT BASCULE

Deux Knights partent en mission. Tu veux les résultats des deux.

### Version séquentielle (lente)

```js
async function getMissions() {
 // Leon attend sa mission
 const missionLeon = await fetchMission("leon"); // 2 secondes
 // Zaruba attend que Leon finisse, puis attend sa mission
 const missionZaruba = await fetchMission("zaruba"); // 2 secondes
 // total : 4 secondes

 return [missionLeon, missionZaruba];
}
```

Leon et Zaruba n'ont aucun lien entre eux. Zaruba n'a pas besoin d'attendre Leon.
Mais avec deux `await` en séquence, tu les forces à faire la queue.

### Version parallèle (rapide)

```js
async function getMissions() {
 // les deux fetches démarrent EN MÊME TEMPS
 const [missionLeon, missionZaruba] = await Promise.all([
  fetchMission("leon"),
  fetchMission("zaruba"),
 ]);
 // total : 2 secondes (le temps du plus lent)

 return [missionLeon, missionZaruba];
}
```

`Promise.all` lance tout en parallèle et attend que tout soit résolu.
Si une échoue : tout échoue. Si tu veux les résultats même si certains ratent, c'est `Promise.allSettled`.

---

## 3) LE PIÈGE DES BOUCLES

### `forEach` + `await` : le combo qui ne fait pas ce qu'on croit

```js
const knights = ["leon", "zaruba", "rei"];

// PIÈGE : ça a l'air d'attendre chaque knight, mais non
knights.forEach(async (knight) => {
 const mission = await fetchMission(knight);
 console.log(mission);
});

console.log("missions terminées"); // s'affiche EN PREMIER
// forEach ignore les Promises retournées par le callback
// les awaits tournent, mais personne n'attend leur résultat
```

`forEach` ne comprend pas les Promises. Il lance le callback, ignore ce qu'il retourne, et passe au suivant.

### `for...of` : séquentiel, mais qui fonctionne vraiment

```js
// chaque knight attend que le précédent soit fini
// lent, mais prévisible et correct
for (const knight of knights) {
 const mission = await fetchMission(knight);
 console.log(mission); // dans l'ordre garanti
}
```

### `Promise.all` + `map` : parallèle, correct, rapide

```js
// tous les fetches partent en même temps
// on attend que tout soit résolu
const missions = await Promise.all(
 knights.map((knight) => fetchMission(knight)),
);
// missions = [missionLeon, missionZaruba, missionRei]
// dans le même ordre que le tableau de départ:garanti
```

Le résumé visuel :

```
forEach + await --> lance sans attendre  --> BROKEN
for...of + await --> séquentiel propre   --> 2s + 2s + 2s = 6s
Promise.all   --> parallèle propre   --> max(2s, 2s, 2s) = 2s
```

---

## 4) SEQUENTIAL PAR NÉCESSITÉ

Parfois, le séquentiel est obligatoire. Si tu dois utiliser le résultat d'une opération pour lancer la suivante :

```js
// Le plan d'évasion de Michael Scofield
// chaque étape dépend du résultat de la précédente

async function executePlan() {
 // étape 1 : infiltrer la salle des gardes
 const accessCode = await infiltrateGuardRoom();

 // accessCode est nécessaire pour l'étape 2
 const tunnel = await digTunnel(accessCode);

 // tunnel est nécessaire pour l'étape 3
 const exit = await reachExit(tunnel.coordinates);

 return exit;
}
```

Ici, pas le choix : chaque `await` dépend du précédent. Le séquentiel est le seul chemin possible.

---

## 5) `await` EN DEHORS D'UNE FONCTION `async` : ERREUR

```js
// ERREUR : SyntaxError
const data = await fetch("/api/data");

// correct : on emballe dans async
async function loadData() {
 const data = await fetch("/api/data");
 return data;
}

// ou en top-level dans un module ES
// (ça marche dans les modules, pas dans tous les contextes)
const data = await fetch("/api/data"); // ok en ESM top-level
```

---

## EXERCICES

## EXO 1 : LE CONSEIL DE SURVEILLANCE

Le Conseil de Surveillance de Garo doit récupérer les rapports de 5 Chevaliers : Leon, Rei, Kouga, Leo, et Bado. Chaque rapport prend 1 seconde à charger.

```js
function fetchReport(knight) {
 return new Promise((resolve) => {
  setTimeout(() => resolve(`Rapport de ${knight} : mission accomplie`), 1000);
 });
}
```

**Mission :** Récupère les 5 rapports. Version séquentielle d'abord, puis version parallèle. Mesure le temps avec `Date.now()` pour les deux. Affiche la différence.

(Indice : `console.time()` / `console.timeEnd()` sont tes amis)

---

## EXO 2 : LA BOUCLE CASSÉE

Ce code a l'air juste. Il est cassé.

```js
const horrors = ["Fetalis", "Angelia", "Kiba Galin"];

horrors.forEach(async (horror) => {
 const result = await eliminateHorror(horror);
 console.log(`${horror} éliminé : ${result}`);
});

console.log("Tous les Horrors ont été éliminés");
```

**Mission :** Explique pourquoi ce code est cassé. Propose deux corrections : une séquentielle avec `for...of`, une parallèle avec `Promise.all`. Laquelle est adaptée si l'ordre d'élimination compte ? Laquelle si ça n'a pas d'importance ?

---

## EXO 3 : LA CHAÎNE OBLIGATOIRE

Michael Scofield prépare son évasion. Chaque étape dépend de la précédente :

1. `getBlueprints()` : retourne `{ cellBlock: 'A', tunnelEntry: 'D4' }` (1 seconde)
2. `digTunnel(tunnelEntry)` : prend le point d'entrée, retourne `{ exit: 'E7', length: 40 }` (2 secondes)
3. `secureExit(exit)` : prend le point de sortie, retourne `'Sortie sécurisée'` (1 seconde)

**Mission :** Écris la fonction `executeEscape()` en async/await. Aucune étape en parallèle : chaque résultat est nécessaire pour la suivante. Mesure le temps total.

---

## RÉSUMÉ

`await` suspend la fonction, pas le thread : le reste de JS continue de tourner.
Deux `await` en séquence = la queue : l'un attend que l'autre finisse.
`Promise.all` = le parallèle : tout part en même temps, tu attends le plus lent.
`forEach` + `await` = cassé en silence : utilise `for...of` ou `Promise.all` + `map`.
Le séquentiel est obligatoire quand une étape dépend du résultat de la précédente : sinon, fais-le en parallèle.
