---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# MUTATION MINEFIELD : TOUCHER UN OBJET ET TOUT CASSER AILLEURS
Temps de lecture ~9 min

T'as modifié un objet. T'as rien d'autre touché. Et pourtant, trois fonctions différentes dans trois fichiers différents ont un comportement bizarre depuis ce matin.

C'est le champ de mines de la mutation. Pas de crash. Pas d'erreur. Juste un état qui dérive sans qu'on sache pourquoi : parce que plusieurs parties du code partagent silencieusement le même objet.

Ce fichier, c'est la carte du champ. On repère les mines. On apprend à traverser sans exploser.

---

## 1) LA MUTATION SILENCIEUSE

Une mutation, c'est modifier un objet existant en place. Le problème : si plusieurs variables ou fonctions pointent vers cet objet, elles voient toutes la modification : même celles qui ne devaient pas.

```js
// Le squad de Naruto
const squad = { name: "Konoha", members: 104, leader: "Hokage" };

function promote(s) {
 s.leader = "Tsunade"; // mutation directe du paramètre
 return s;
}

const promoted = promote(squad);

console.log(promoted.leader); // → "Tsunade":attendu
console.log(squad.leader); // → "Tsunade":PAS attendu
// squad et promoted sont le même objet
```

Le paramètre `s` n'est pas une copie de `squad`. C'est la même référence.
Modifier `s.leader` modifie l'objet original.

```
AVANT promote
─────────────
squad ──────────┐
        ▼
promoted ──────►{ leader: "Hokage" }

PENDANT promote (s = squad)
───────────────────────────
s ──────────────► { leader: "Tsunade" }
             ▲
squad ─────────────────►─┘
promoted ──────────────►─┘

Tous les trois pointent vers le même objet muté.
```

---

## 2) LES MINES LES PLUS COURANTES

### Mine #1 : Modifier un paramètre objet

```js
// Mauvais
function addBonus(player, bonus) {
 player.score += bonus; // mute le paramètre:l'original change
 return player;
}

// Bon
function addBonus(player, bonus) {
 return { ...player, score: player.score + bonus }; // nouvel objet
}
```

---

### Mine #2 : Pusher dans un tableau partagé

```js
// Les logs de Fox River:partagés entre modules
const logs = [];

// Module A
function logEntry(entry) {
 logs.push(entry); // mute le tableau partagé
}

// Module B lit les logs
function getLogs() {
 return logs; // retourne la référence directe:pas une copie
}

// Problème : quiconque a le résultat de getLogs() peut muter logs
const myLogs = getLogs();
myLogs.push("fake entry"); // ← mute aussi `logs`
console.log(logs.length); // impacté

// Correction
function getLogs() {
 return [...logs]; // retourne une copie:l'appelant ne peut pas muter l'original
}
```

---

### Mine #3 : L'initialisation d'objet partagée

```js
// Piège classique avec des valeurs par défaut en objet
function createNinja(name, options = { level: 1, village: "Konoha" }) {
 options.name = name;
 return options;
}

const ninja1 = createNinja("Naruto");
const ninja2 = createNinja("Sasuke");

console.log(ninja1.name); // → "Sasuke"
// l'objet par défaut est créé UNE FOIS et partagé entre les appels
// ninja1 et ninja2 partagent le même objet options
```

```js
// Correction : recréer l'objet à chaque appel
function createNinja(name, options = {}) {
 return { level: 1, village: "Konoha", ...options, name };
}
```

---

### Mine #4 : Sort qui mute le tableau original

```js
const scores = [85, 92, 78, 95, 88];

// Array.prototype.sort mute le tableau
const sorted = scores.sort((a, b) => b - a);

console.log(scores); // → [95, 92, 88, 85, 78]:MUTÉ
console.log(sorted); // → [95, 92, 88, 85, 78]
// sorted et scores sont le même tableau
```

```js
// Correction
const sorted = [...scores].sort((a, b) => b - a);
// ou en 2023+
const sorted = scores.toSorted((a, b) => b - a); // retourne une nouvelle copie
```

Les méthodes mutantes à connaître :

- `sort()`, `reverse()` → utilisent `toSorted()`, `toReversed()`
- `push()`, `pop()`, `shift()`, `unshift()`, `splice()` → utiliser spread + concat pour les alternatives immutables
- `fill()` → crée un nouveau tableau si nécessaire

---

### Mine #5 : La closure qui capture et mute

```js
// Système de statistiques de match
function createMatchStats(initialStats) {
 let stats = initialStats; // référence vers l'objet passé en paramètre

 return {
  addGoal(team) {
   stats.score[team]++; // mute l'objet original passé à createMatchStats
  },
  getStats() {
   return stats;
  },
 };
}

const liveStats = { score: { home: 0, away: 0 }, events: [] };
const tracker = createMatchStats(liveStats);

tracker.addGoal("home");
console.log(liveStats.score.home); // → 1:liveStats est muté depuis l'extérieur
```

```js
// Correction : copier à l'entrée, isoler l'état interne
function createMatchStats(initialStats) {
 let stats = structuredClone(initialStats); // copie profonde:isolé

 return {
  addGoal(team) {
   stats = {
    ...stats,
    score: { ...stats.score, [team]: stats.score[team] + 1 },
   };
  },
  getStats() {
   return structuredClone(stats);
  }, // copie à la sortie aussi
 };
}
```

---

## 3) `Object.freeze` : INTERDIRE LA MUTATION

`Object.freeze` rend un objet non-modifiable. Toute tentative de mutation échoue silencieusement (ou lance une `TypeError` en strict mode).

```js
const config = Object.freeze({
 apiUrl: "https://foxriver.api",
 timeout: 5000,
 maxRetries: 3,
});

config.timeout = 10000; // silencieusement ignoré (ou TypeError en strict mode)
config.newProp = "test"; // ignoré

console.log(config.timeout); // → 5000
```

**Attention : `freeze` est shallow.** Les objets imbriqués restent mutables.

```js
const frozenNinja = Object.freeze({
 name: "Naruto",
 stats: { power: 9000 }, // pas freezé
});

frozenNinja.name = "Sasuke"; // ignoré:OK
frozenNinja.stats.power = 0; // fonctionne:stats n'est pas freezé
console.log(frozenNinja.stats.power); // → 0
```

Pour un freeze profond :

```js
function deepFreeze(obj) {
 Object.freeze(obj);

 for (const key of Object.keys(obj)) {
  if (
   obj[key] &&
   typeof obj[key] === "object" &&
   !Object.isFrozen(obj[key])
  ) {
   deepFreeze(obj[key]);
  }
 }

 return obj;
}

const frozenConfig = deepFreeze({
 server: { host: "localhost", port: 3000 },
 db: { name: "foxriver" },
});

frozenConfig.server.port = 9999; // ignoré
console.log(frozenConfig.server.port); // → 3000
```

---

## 4) LE PATTERN IMMUTABLE : PENSER EN TRANSFORMATIONS

Au lieu de muter l'état, retourner toujours un nouvel état. C'est le principe fondamental de Redux, Zustand, et de tout système de state management.

```js
// STYLE MUTATIF:dangereux
function addSurvivor(camp, survivor) {
 camp.survivors.push(survivor); // mute camp directement
 camp.headcount++;
 return camp;
}

// STYLE IMMUTABLE:prévisible
function addSurvivor(camp, survivor) {
 return {
  ...camp,
  survivors: [...camp.survivors, survivor],
  headcount: camp.headcount + 1,
 };
}

// Usage
const campV1 = { name: "Prison", survivors: ["Rick"], headcount: 1 };
const campV2 = addSurvivor(campV1, "Daryl");

console.log(campV1.headcount); // → 1:intact
console.log(campV2.headcount); // → 2:nouvel état
```

Les deux états coexistent. Tu peux comparer l'historique. Tu peux revenir en arrière. C'est pour ça que les apps React avec une immutabilité stricte sont plus faciles à débugger.

---

## EXERCICES

### EXO 1 : LOCALISER LES MINES

Chaque bloc de code ci-dessous contient une mutation silencieuse. Identifie-la et propose la correction.

```js
// Bloc A
function setActiveNinja(roster, name) {
 roster.active = name;
 return roster;
}

// Bloc B
function topScorers(players, n) {
 return players.sort((a, b) => b.goals - a.goals).slice(0, n);
}

// Bloc C
function applyDebuff(ninja, debuff) {
 ninja.stats.power -= debuff.damage;
 ninja.stats.speed -= debuff.slow;
 return ninja;
}

// Bloc D
const defaultConfig = { retries: 3, timeout: 5000 };
function createRequest(url, options = defaultConfig) {
 options.url = url;
 return options;
}
createRequest("/api/enter_dojo");
createRequest("/api/data");
```

---

### EXO 2 : LE REDUCER DU CAMP

Implémente un `campReducer(state, action)` qui gère l'état du camp de Rick Grimes sans jamais muter `state`. Chaque action retourne un nouvel état.

```js
const initialState = {
 name: "Prison",
 resources: { food: 50, ammo: 200 },
 survivors: ["Rick", "Daryl", "Glenn"],
 threatLevel: "low",
};

// Actions à gérer :
// { type: "ADD_SURVIVOR", payload: "Michonne" }
// { type: "CONSUME_FOOD", payload: 10 }
// { type: "SET_THREAT", payload: "high" }
// { type: "REMOVE_SURVIVOR", payload: "Glenn" }  ← spoiler
```

**Ta mission :** implémenter `campReducer`, tester chaque action, et vérifier que `initialState` reste intact après chaque appel.

---

### EXO 3 : DEEP FREEZE EN PROD

Dans le système de config du serveur de Fox River, n'importe quel module peut accidentellement modifier la config globale. Implémente `createImmutableConfig(config)` qui :

1. Deep freeze la config
2. Retourne un proxy qui log un message précis si quelqu'un essaie de modifier quelque chose
3. Fonctionne sur des objets imbriqués

_(Indice : `Proxy` avec un trap `set` qui retourne `false` en strict mode lève une `TypeError` : ça te permettra de donner un meilleur message d'erreur que le freeze seul)_

---

## RÉSUMÉ

En JS, passer un objet à une fonction ou l'assigner à une variable ne le copie pas : ça partage la même référence. Toute modification touche tous ceux qui la pointent. Les méthodes `sort()`, `reverse()`, `push()`, `splice()` mutent en place : il faut copier avant. `Object.freeze` protège le premier niveau : `deepFreeze` protège tout. Le pattern immutable consiste à toujours retourner un nouvel objet plutôt que de modifier l'existant : c'est ce qui rend le code prévisible, testable, et debuggable.
