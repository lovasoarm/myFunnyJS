---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LE GARBAGE COLLECTOR : LE NETTOYEUR QUE TU N'ENTENDS JAMAIS
Temps de lecture ~10 min

JS gère la mémoire à ta place. Ça a l'air cool. Et ça l'est : jusqu'au moment où ça ne l'est pas.

Le GC libère les objets que plus personne n'utilise. Mais si quelque chose garde encore une référence vers cet objet : même involontairement : il ne part jamais. Il s'accumule. Et un jour, l'app ralentit, le navigateur transpire, le serveur Node crashe à 3h du matin.

Comprendre le GC, c'est comprendre pourquoi certains bugs n'ont pas de stacktrace.

---

## 1) LA MÉMOIRE EN JS : LE TERRAIN DE JEU

Quand tu crées un objet en JS, deux zones entrent en jeu :

```
STACK            HEAP
─────────────────────    ──────────────────────────────
│ variable `ninja` │───────►│ { name: "Naruto", chakra: 9000 } │
│ variable `score` │    │                  │
│ ...        │    │ { name: "Sasuke", chakra: 8500 } │
─────────────────────    ──────────────────────────────
```

- **Stack** : les variables locales, les primitives, les références vers les objets
- **Heap** : les objets eux-mêmes, les tableaux, les fonctions

La stack se vide automatiquement quand une fonction se termine.
Le heap, lui, attend que le GC passe.

---

## 2) MARK-AND-SWEEP : L'ALGORITHME QUI NETTOIE

Le GC de V8 (le moteur JS de Chrome et Node) utilise mark-and-sweep.

Le principe est brutal et efficace :

```
ÉTAPE 1 : MARK
───────────────
Le GC part des "roots" (variables globales, stack active)
et parcourt toutes les références atteignables.
Chaque objet trouvé est "marqué" : il vit.

ÉTAPE 2 : SWEEP
────────────────
Tout ce qui N'est PAS marqué est détruit.
La mémoire est libérée.
```

Visuellement :

```
Roots
 │
 ├──► Ninja A (marqué)
 │    └──► Jutsu A1 (marqué)
 │
 ├──► Ninja B (marqué)
 │
 │
 X──► Ancien objet de combat (PAS marqué = détruit)
 X──► Tableau de logs (PAS marqué = détruit)
```

Tout ce qui est accessible depuis les roots survit.
Tout le reste disparaît.

---

## 3) LES RÉFÉRENCES : LE SEUL CRITÈRE QUI COMPTE

Le GC ne regarde pas si tu _utilises encore_ un objet.
Il regarde si quelque chose _pointe encore_ vers cet objet.

```js
// Naruto crée son clone
let clone = { name: "Kage Bunshin", power: 100 };

// Le clone disparaît:la mémoire peut être libérée
clone = null;
// plus aucune référence → le GC peut nettoyer

// ---

// Sasuke garde une référence dans une liste globale
const activeNinjas = [];
let ennemi = { name: "T-Bag" }; // oui, T-Bag, il s'est infiltré
activeNinjas.push(ennemi);

ennemi = null;
// la mémoire ne sera PAS libérée
// activeNinjas[0] pointe encore vers l'objet
// T-Bag reste en mémoire:pour l'éternité
```

**C'est le piège numéro un.** Tu "supprimes" une variable, mais l'objet vit encore ailleurs.

---

## 4) LES CYCLES DE RÉFÉRENCES : QUAND DEUX OBJETS SE TIENNENT

Un cycle, c'est quand A pointe vers B, et B pointe vers A.

```js
// Goku et Végéta se référencent mutuellement
const goku = { name: "Goku" };
const vegeta = { name: "Végéta" };

goku.rival = vegeta;
vegeta.rival = goku;

// On "supprime" les deux
goku = null; // ← impossible, const:mais pour l'exemple
vegeta = null;
```

```
AVANT null
──────────
roots ──► goku ──► vegeta
        ◄──────────

APRÈS null
──────────
roots  (plus de connexion vers goku/vegeta)

goku ──► vegeta
   ◄──────────
Les deux se tiennent... mais plus personne ne les tient depuis les roots.
```

Le mark-and-sweep moderne **gère ça correctement** : si aucune root ne peut atteindre le cycle, tout le cycle est détruit.

L'ancien algorithme (reference counting) plantait sur les cycles. C'était la catastrophe.

---

## 5) LES FUITES MÉMOIRE : LES FANTÔMES QUI RESTENT

Une fuite mémoire, c'est un objet qu'on ne veut plus, mais que le GC ne peut pas supprimer parce qu'une référence l'en empêche.

### Fuite #1 : Le tableau global qui grossit

```js
// Le système de logs de Fox River
const prisonLogs = [];

function logEvent(event) {
 prisonLogs.push({ event, timestamp: Date.now() });
 // on ajoute, on n'enlève jamais
 // après 100 000 events : 100 000 objets en mémoire, pour toujours
}
```

Correction : limiter la taille ou utiliser un ring buffer.

```js
const MAX_LOGS = 500;
const prisonLogs = [];

function logEvent(event) {
 if (prisonLogs.length >= MAX_LOGS) prisonLogs.shift();
 prisonLogs.push({ event, timestamp: Date.now() });
}
```

---

### Fuite #2 : Le listener qu'on oublie de retirer

```js
// Chaque fois qu'un Chevalier de la Flamme entre en combat
function startCombat(knight) {
 document.addEventListener("keydown", knight.handleInput);
 // le combat finit... mais le listener reste attaché
 // chaque nouveau combat en ajoute un autre
 // Walter White dirait : c'est de la mauvaise chimie
}
```

Correction : retirer le listener quand on n'en a plus besoin.

```js
function startCombat(knight) {
 document.addEventListener("keydown", knight.handleInput);

 return function cleanup() {
  document.removeEventListener("keydown", knight.handleInput);
 };
}

const stop = startCombat(knight);
// ... combat terminé ...
stop(); // on libère
```

---

### Fuite #3 : La closure qui garde trop

```js
// Le cache de métriques du dashboard des ultras
function createCache() {
 const bigData = new Array(1_000_000).fill("stat");

 return function getMetric(id) {
  // cette closure capture bigData en entier
  // bigData vivra aussi longtemps que getMetric est en vie
  return bigData[id];
 };
}

const cache = createCache();
// cache garde bigData en vie:même si on n'en utilise que 3 valeurs
```

Correction : extraire seulement ce dont on a besoin.

```js
function createCache() {
 const bigData = new Array(1_000_000).fill("stat");
 const needed = { 0: bigData[0], 1: bigData[1], 2: bigData[2] };
 // bigData peut maintenant être collecté par le GC

 return function getMetric(id) {
  return needed[id];
 };
}
```

---

## 6) WEAKMAP ET WEAKSET : LES RÉFÉRENCES QUI SAVENT LÂCHER

`WeakMap` et `WeakSet` tiennent des références **faibles** : elles n'empêchent pas le GC de collecter.

```js
// Stocker des données liées à des objets DOM
// sans empêcher la libération quand l'élément est retiré du DOM

const metadata = new WeakMap();

let bouton = document.getElementById("attack-btn");
metadata.set(bouton, { clicks: 0, lastUsed: Date.now() });

// Quand bouton est retiré du DOM et dereferencé :
bouton = null;
// la clé disparaît du WeakMap automatiquement
// les metadata aussi:le GC peut tout nettoyer
```

Avec un `Map` classique : la clé survit, les données survivent, l'objet DOM survit. Fuite mémoire garantie si tu fais ça sur 10 000 éléments.

```
Map classique :
map ──► { key: bouton ──► objet DOM (bloqué) }

WeakMap :
map ── ~ ──► { key: bouton } (référence faible)
       objet DOM ← plus accessible depuis root = GC le détruit
       entrée WeakMap disparaît avec lui
```

---

## EXERCICES

### EXO 1 : L'INFILTRÉ QUI RESTE EN MÉMOIRE

T-Bag s'est infiltré dans le système de Fox River. À chaque connexion, on crée un objet `session`. Le problème : les sessions ne sont jamais supprimées. Après 10 000 connexions de T-Bag, le serveur meurt.

```js
const sessions = {};

function createSession(userId) {
 sessions[userId] = {
  userId,
  token: Math.random().toString(36),
  createdAt: Date.now(),
  data: new Array(10_000).fill("payload"),
 };
 return sessions[userId].token;
}

function getSession(userId) {
 return sessions[userId];
}
```

**Ta mission :** identifier la fuite, corriger `createSession` avec une fonction `deleteSession`, et ajouter une expiration automatique après 30 minutes.

_(Indice : `Date.now()` retourne des millisecondes)_

---

### EXO 2 : LE LISTENER DE L'ENFER

Dans le dashboard des ultras, chaque fois qu'un nouveau match commence, on attache un listener sur `window` pour capter les events de jeu en direct. Mais les matchs se terminent, les listeners restent. Après 50 matchs, il y a 50 listeners actifs sur le même event.

```js
function startLiveMatch(matchId) {
 const handler = (event) => {
  if (event.detail.matchId === matchId) {
   updateScore(event.detail);
  }
 };
 window.addEventListener("matchEvent", handler);
}
```

**Ta mission :** réécrire `startLiveMatch` pour qu'elle retourne une fonction de cleanup. Simuler 3 matchs, en nettoyer 2, vérifier que le 3e répond encore.

---

### EXO 3 : WEAKMAP OU MAP ?

Voici deux implémentations d'un système de cache pour les ninjas actifs en combat.

```js
// Version A:Map classique
const ninjaCache = new Map();

function registerNinja(ninja) {
 ninjaCache.set(ninja, { combatStart: Date.now(), jutsuCount: 0 });
}

// Version B:WeakMap
const ninjaCache = new WeakMap();

function registerNinja(ninja) {
 ninjaCache.set(ninja, { combatStart: Date.now(), jutsuCount: 0 });
}
```

**Ta mission :** expliquer dans quels scénarios chaque version cause une fuite mémoire. Écrire un test qui démontre la différence. _(Indice : que se passe-t-il si `ninja` est un objet DOM ? Un objet long-lived ? Un objet temporaire ?)_

---

## RÉSUMÉ

Le GC de V8 utilise mark-and-sweep : tout ce qui est atteignable depuis les roots survit, le reste meurt. Une fuite mémoire, c'est un objet qu'on ne veut plus mais qu'une référence maintient en vie : tableau global qui grossit, listener non retiré, closure qui capture trop. `WeakMap` et `WeakSet` résolvent le cas où tu veux associer des données à un objet sans empêcher sa destruction. Comprendre le GC, c'est comprendre pourquoi ton app ralentit sans raison apparente.
