---
stability: intemporel
---

# REFACTO CHALLENGE
Temps de lecture ~9 min

Tout ce que t'as appris dans ce module, on le balance dans un seul exercice.
Une codebase en vrac, des smells partout, zéro test. Ton job : la rendre propre, testée, et livrable.
C'est le mini-boss avant les vrais mini-projets. Pas de triche, pas de raccourci.

---

## 1) LE CONTEXTE : LA RADIO TRAPSOUL EN MODE PANIQUE

L'équipe de Trapsoul Radio t'envoie ce module de gestion de playlist. Il marche (plus ou moins). Personne n'ose le toucher depuis 8 mois. Il y a un bug signalé (parfois la durée totale de la playlist est fausse), mais personne ne sait où il se cache dans ce bloc.

```js
// playlist-manager.js:touché par personne depuis 8 mois
class PlaylistManager {
 constructor() {
  this.tracks = [];
  this.history = [];
 }

 add(t) {
  this.tracks.push(t);
  console.log("ajout: " + t.title);
  if (t.duration > 600) {
   console.log("warning: track tres longue");
  }
  this.history.push({ action: "add", title: t.title, time: Date.now() });
 }

 remove(title) {
  for (let i = 0; i < this.tracks.length; i++) {
   if (this.tracks[i].title === title) {
    this.tracks.splice(i, 1);
    this.history.push({ action: "remove", title: title, time: Date.now() });
    return true;
   }
  }
  return false;
 }

 getTotal() {
  let d = 0;
  for (let i = 0; i <= this.tracks.length; i++) {
   d = d + this.tracks[i].duration;
  }
  return d;
 }

 getByGenre(g) {
  let r = [];
  for (let i = 0; i < this.tracks.length; i++) {
   if (this.tracks[i].genre == g) r.push(this.tracks[i]);
  }
  return r;
 }

 shuffle() {
  this.tracks = this.tracks.sort(() => Math.random() - 0.5);
  this.history.push({ action: "shuffle", title: "-", time: Date.now() });
 }
}
```

---

## 2) ÉTAPE 1 : CHASSE AUX SMELLS

Avant de toucher quoi que ce soit : liste ce qui pue. C'est ton diagnostic.

Indices pour te lancer (cherche-en d'autres) :

- `getTotal()` boucle avec `<=` au lieu de `<` : ça lit un élément qui n'existe pas
- comparaison `==` au lieu de `===` dans `getByGenre`
- magic number `600` sans nom
- `console.log` mélangé avec la logique métier (feature envy vers un futur `Logger`)
- duplication : chaque méthode pousse manuellement dans `this.history` avec le même pattern
- `shuffle()` utilise `.sort()` avec un random, ce qui n'est PAS un vrai shuffle uniforme (biais connu)

```
PlaylistManager (le god class en miniature)
 --> gestion des tracks
 --> logging console
 --> historique
 --> "shuffle" (biaisé)
```

---

## 3) ÉTAPE 2 : LE BUG EN PROD

Le `getTotal()` boucle de `i = 0` à `i <= this.tracks.length`. Sur un tableau de 3 éléments (indices 0, 1, 2), la boucle va jusqu'à `i = 3`. `this.tracks[3]` est `undefined`. `undefined.duration` plante, ou pire : `d + undefined` donne `NaN`, et `NaN` se propage silencieusement dans tout le total.

```js
// reproduction minimale du bug
const tracks = [{ duration: 180 }, { duration: 200 }, { duration: 150 }];
let d = 0;
for (let i = 0; i <= tracks.length; i++) {
 d = d + tracks[i].duration; // i=3 : tracks[3] est undefined, .duration crash
}
```

C'est exactement le genre de bug que `29_edge_cases` (NaN, undefined) t'a appris à reconnaître. Ici il est planqué dans une boucle mal bornée.

---

## 4) ÉTAPE 3 : FIGE LE COMPORTEMENT (LE VRAI, PAS LE BUGGÉ)

Avant de fixer le bug, écris les tests pour le comportement ATTENDU (pas le comportement buggé). C'est la différence entre "figer un bug" et "documenter une intention".

```js
// playlist-manager.test.js
describe("PlaylistManager", () => {
 test("getTotal additionne la durée de toutes les tracks", () => {
  const pm = new PlaylistManager();
  pm.add({ title: "A", duration: 180, genre: "trapsoul" });
  pm.add({ title: "B", duration: 200, genre: "rnb" });
  expect(pm.getTotal()).toBe(380);
 });

 test("getTotal retourne 0 sur une playlist vide", () => {
  const pm = new PlaylistManager();
  expect(pm.getTotal()).toBe(0);
 });

 test("remove enlève la bonne track et retourne true", () => {
  const pm = new PlaylistManager();
  pm.add({ title: "A", duration: 180, genre: "trapsoul" });
  expect(pm.remove("A")).toBe(true);
  expect(pm.getTotal()).toBe(0);
 });

 test("remove retourne false si la track n'existe pas", () => {
  const pm = new PlaylistManager();
  expect(pm.remove("Inconnue")).toBe(false);
 });

 test("getByGenre filtre correctement", () => {
  const pm = new PlaylistManager();
  pm.add({ title: "A", duration: 180, genre: "trapsoul" });
  pm.add({ title: "B", duration: 200, genre: "rnb" });
  expect(pm.getByGenre("trapsoul")).toHaveLength(1);
 });
});
```

Lance ces tests sur le code original : le premier test (`getTotal` sur 2 tracks) plante ou retourne `NaN`. C'est attendu : tu viens de prouver le bug avec un test, pas juste avec une intuition.

---

## 5) ÉTAPE 4 : REFACTO PAS À PAS

**Transformation 1 : corriger la borne de boucle (le fix du bug, isolé)**

```js
getTotal() {
 let total = 0
 for (let i = 0; i < this.tracks.length; i++) {
  total += this.tracks[i].duration
 }
 return total
}
```

Relance les tests : `getTotal` passe maintenant au vert. Le bug est corrigé, et le test le prouve.

**Transformation 2 : remplacer les boucles manuelles par des méthodes natives (lisibilité)**

```js
getTotal() {
 return this.tracks.reduce((total, track) => total + track.duration, 0)
}

getByGenre(genre) {
 return this.tracks.filter(track => track.genre === genre) // === au lieu de ==
}

remove(title) {
 const index = this.tracks.findIndex(track => track.title === title)
 if (index === -1) return false
 this.tracks.splice(index, 1)
 this.logAction('remove', title)
 return true
}
```

**Transformation 3 : extraire le logging de l'historique (SRP)**

```js
class PlaylistHistory {
 constructor() {
  this.entries = [];
 }
 record(action, title) {
  this.entries.push({ action, title, time: Date.now() });
 }
}
```

```js
class PlaylistManager {
 constructor(history = new PlaylistHistory()) {
  this.tracks = [];
  this.history = history;
 }

 add(track) {
  this.tracks.push(track);
  this.history.record("add", track.title);
 }

 remove(title) {
  const index = this.tracks.findIndex((t) => t.title === title);
  if (index === -1) return false;
  this.tracks.splice(index, 1);
  this.history.record("remove", title);
  return true;
 }

 getTotal() {
  return this.tracks.reduce((total, track) => total + track.duration, 0);
 }

 getByGenre(genre) {
  return this.tracks.filter((track) => track.genre === genre);
 }
}
```

**Transformation 4 : nommer le magic number et sortir le warning du flux principal**

```js
const LONG_TRACK_THRESHOLD_SECONDS = 600;

class PlaylistManager {
 // ...
 add(track) {
  this.tracks.push(track);
  this.history.record("add", track.title);
  if (track.duration > LONG_TRACK_THRESHOLD_SECONDS) {
   this.history.record("warning_long_track", track.title);
  }
 }
}
```

Le `console.log` a disparu : c'est maintenant l'historique (ou un futur logger injecté, cf module 12 sur les patterns) qui porte l'info, pas une sortie console qui pollue tout.

```
v1 : god class + bug NaN + console.log partout
v2 : PlaylistManager (tracks) + PlaylistHistory (logs) + bug corrigé + tests verts
```

---

## 6) ÉTAPE 5 : LE `shuffle()` BIAISÉ : TU L'AS REPÉRÉ ?

`this.tracks.sort(() => Math.random() - 0.5)` est un classique du "ça a l'air random mais ça ne l'est pas". Le tri par comparaison n'est pas conçu pour ça, et le résultat favorise certains ordres selon l'implémentation du moteur JS.

```js
// Fisher-Yates : le vrai algorithme de shuffle uniforme
shuffle() {
 const shuffled = [...this.tracks]
 for (let i = shuffled.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
 }
 this.tracks = shuffled
 this.history.record('shuffle', '-')
}
```

C'est le genre de smell invisible : ça "marche", personne ne s'en plaint, et pourtant c'est faux. Le repérer, c'est déjà avoir un oeil de senior.

---

## EXERCICES

## EXO 1 : audit complet

Avant de lire la correction proposée plus haut, fais ta propre liste de smells sur le code de départ. Compare avec la liste de l'étape 1 : t'en as trouvé combien en plus ? lesquels t'as ratés ?
(durée cible : 10 minutes)

## EXO 2 : écris le test du shuffle

`shuffle()` utilise `Math.random()`, donc tu ne peux pas tester "l'ordre exact". Mais tu peux tester des invariants.

Mission : écris 2 tests pour `shuffle()` qui ne dépendent pas de l'ordre exact (indice : la taille du tableau après shuffle, et le fait que chaque track présente avant est toujours présente après).

## EXO 3 : livre la v2

Prends la version finale de `PlaylistManager` + `PlaylistHistory`, ajoute une méthode `getLongTracks()` qui retourne les tracks dépassant `LONG_TRACK_THRESHOLD_SECONDS`, en respectant SRP (decide où elle vit et pourquoi).
(durée cible : 15 minutes)

---

## RÉSUMÉ

Une codebase en vrac, tu ne la réécris pas : tu l'audites, tu la figes avec des tests qui décrivent l'intention correcte, puis tu avances par petites transformations. Le bug NaN planqué dans une boucle mal bornée, le shuffle biaisé, le god class qui mélange logs et logique : ce sont les mêmes patterns que tu retrouveras dans n'importe quelle vraie codebase. Les reconnaître ici, c'est les reconnaître partout.
