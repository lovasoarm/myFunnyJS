---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# GC SIMULATOR : RENDRE VISIBLE CE QUE LE RUNTIME CACHE
Temps de lecture ~10 min

Le GC travaille en silence. Tu ne le vois jamais. Tu ne sais pas quand il passe, ni combien d'objets il détruit. Ça marche : jusqu'au moment où ça ne marche plus, et là t'as aucun outil mental pour comprendre pourquoi.

Ce fichier, c'est le correctif. On simule le GC à la main : on crée des objets, on trace les références, on voit ce qui survit et ce qui meurt. Quand tu auras fait tourner ce simulateur dans ta tête, le vrai GC n'aura plus de secret.

---

## 1) LE MODÈLE MENTAL : OBJETS ET RÉFÉRENCES

Chaque objet en mémoire a deux propriétés qui comptent :

- ses **références sortantes** : les objets vers lesquels il pointe
- son **état de vie** : est-il atteignable depuis une root ?

```js
// On modélise un objet vivant
const obj = {
 id: "A",
 ref: null, // référence vers un autre objet (ou null)
 alive: true, // le GC le verra-t-il encore ?
};
```

Le simulateur va recréer le cycle mark-and-sweep complet :

```
Phase 1 : MARK
 Partir des roots (variables actives)
 Parcourir toutes les références
 Marquer chaque objet atteignable

Phase 2 : SWEEP
 Parcourir tous les objets alloués
 Détruire ceux qui ne sont pas marqués
 Libérer la mémoire

Phase 3 : RAPPORT
 Afficher ce qui a survécu et pourquoi
```

---

## 2) LE SIMULATEUR

```js
// Le registre de tous les objets alloués
// Dans le vrai runtime, c'est le heap. Ici, c'est notre tableau.
const heap = [];

// Les roots : points de départ du mark
// Dans le vrai runtime : variables globales + stack active
let roots = [];

// Allouer un objet et l'enregistrer dans le heap
function allocate(id, refs = []) {
 const obj = { id, refs, marked: false };
 heap.push(obj);
 console.log(`[ALLOC] ${id} créé`);
 return obj;
}

// Phase MARK : parcourir depuis les roots et marquer
function mark() {
 const queue = [...roots];

 while (queue.length > 0) {
  const obj = queue.shift();
  if (obj.marked) continue; // déjà vu, on évite les cycles infinis

  obj.marked = true;
  console.log(`[MARK] ${obj.id} → atteignable`);

  // on ajoute ses références à visiter
  for (const ref of obj.refs) {
   if (!ref.marked) queue.push(ref);
  }
 }
}

// Phase SWEEP : détruire ce qui n'est pas marqué
function sweep() {
 const survivors = [];

 for (const obj of heap) {
  if (obj.marked) {
   obj.marked = false; // reset pour le prochain cycle GC
   survivors.push(obj);
  } else {
   console.log(`[SWEEP] ${obj.id} → détruit (mémoire libérée)`);
  }
 }

 // le heap ne contient plus que les survivants
 heap.length = 0;
 heap.push(...survivors);
}

// Lancer un cycle GC complet
function runGC() {
 console.log("\n─── GC CYCLE START ───");
 mark();
 sweep();
 console.log(`─── GC CYCLE END : ${heap.length} objet(s) en vie ───\n`);
}
```

---

## 3) SIMULATION 1 : LES NINJAS DE KONOHA

```js
// Créer les ninjas
const naruto = allocate("Naruto");
const sasuke = allocate("Sasuke");
const sakura = allocate("Sakura");
const kakashi = allocate("Kakashi");

// Kakashi référence ses élèves
kakashi.refs = [naruto, sasuke, sakura];

// Naruto référence son rival
naruto.refs = [sasuke];

// Les roots : seul Kakashi est accessible depuis le programme actif
roots = [kakashi];

runGC();
// → Naruto : marqué (via Kakashi)
// → Sasuke : marqué (via Kakashi ET via Naruto)
// → Sakura : marquée (via Kakashi)
// → Kakashi : marqué (root)
// Tout le monde survit.
```

```
roots
 │
 └──► Kakashi ──► Naruto ──► Sasuke
       │        ▲
       ├──────────────►┘
       └──► Sakura
```

---

## 4) SIMULATION 2 : OROCHIMARU LÂCHÉ DANS LA NATURE

```js
// Un ennemi arrive:il n'est référencé par personne d'utile
const orochimaru = allocate("Orochimaru");
const kabuto = allocate("Kabuto");

orochimaru.refs = [kabuto];
kabuto.refs = [orochimaru]; // cycle entre eux deux

// Les roots ne changent pas : seulement Kakashi
// Orochimaru et Kabuto ne sont atteignables par personne

runGC();
// → Orochimaru : NON marqué → détruit
// → Kabuto   : NON marqué → détruit
// Le cycle entre eux n'empêche pas leur destruction
// Mark-and-sweep gère les cycles. Reference counting non.
```

```
roots
 │
 └──► Kakashi ──► ...

 X (pas de chemin vers Orochimaru)

 Orochimaru ◄──► Kabuto  (cycle isolé = tous les deux détruits)
```

---

## 5) SIMULATION 3 : LA FUITE QUI SE CACHE

```js
// Un tableau global garde une référence cachée
const missionLog = []; // jamais nettoyé → c'est une root permanente

const mission1 = allocate("Mission-A-rang");
const mission2 = allocate("Mission-S-rang");
const mission3 = allocate("Mission-Cachée"); // on pense l'avoir supprimé

missionLog.push(mission1);
missionLog.push(mission3); // mission3 est dans le log:pour toujours

// On "supprime" les références locales
// mission1 = null (simulation)
// mission2 = null
// mission3 = null

// Les roots : Kakashi + missionLog
roots = [kakashi, ...missionLog];

runGC();
// → mission1 : marquée (dans missionLog):SURVIT alors qu'on pensait l'avoir supprimée
// → mission2 : NON marquée → détruite (personne ne la référence)
// → mission3 : marquée (dans missionLog):SURVIT. C'est la fuite.
```

```
roots
 ├──► Kakashi ──► ...
 └──► missionLog ──► mission1 (survit)
         └──► mission3 (survit : fuite cachée)

mission2 (isolé → détruit)
```

**La leçon :** `null` sur une variable locale ne suffit pas si l'objet vit aussi dans une collection globale. La fuite vient toujours de là où on ne regarde pas.

---

## 6) LIRE LA MÉMOIRE DANS LES DEVTOOLS

Dans Chrome, tu peux voir le heap en vrai :

```
DevTools → Memory → Take heap snapshot

Colonnes importantes :
 Constructor  → le type de l'objet (Array, Object, closure...)
 Retained size → mémoire totale libérée si cet objet disparaissait
 Shallow size → mémoire de l'objet lui-même sans ses références

Ce qui révèle une fuite :
 → prendre deux snapshots avec du temps entre les deux
 → filtrer sur "Objects allocated between snapshots"
 → si tu vois des objets qui grossissent sans raison : fuite
```

Indicateur rapide en Node :

```js
// Snapshot de la mémoire utilisée à ce moment précis
function memSnapshot(label) {
 const used = process.memoryUsage().heapUsed;
 console.log(`[MEM] ${label} : ${(used / 1024 / 1024).toFixed(2)} MB`);
}

memSnapshot("avant allocation");
const bigArray = new Array(100_000).fill({ stat: "xG", value: 0.34 });
memSnapshot("après allocation");
bigArray.length = 0; // vide le tableau:les objets peuvent être collectés
memSnapshot("après nettoyage");
```

---

## EXERCICES

### EXO 1 : TRACE LE CYCLE GC

Voici un état mémoire. Trace quels objets survivent et lesquels sont détruits.

```
roots = [App]

App    → refs: [UserService, Logger]
UserService → refs: [Cache, DB]
Logger  → refs: [FileWriter]
Cache   → refs: [UserService]  ← cycle avec UserService
DB    → refs: []
FileWriter → refs: []
OldSession → refs: [Cache]    ← plus de root vers OldSession
OrphanObj → refs: []       ← totalement isolé
```

**Ta mission :** lister les objets marqués et les objets détruits. Expliquer pourquoi `OldSession` et `Cache` ont des comportements différents malgré le cycle.

---

### EXO 2 : IMPLÉMENTER `collectGarbage()`

En utilisant le modèle du simulateur vu dans ce fichier, implémente une version complète avec :

- `allocate(id, refs)` : crée un objet dans le heap
- `addRoot(obj)` : ajoute un objet aux roots
- `removeRoot(obj)` : retire un objet des roots
- `collectGarbage()` : lance mark + sweep + affiche un rapport

**Ta mission :** simuler ce scénario :

1. Créer 5 objets (Rick, Daryl, Glenn, Negan, Gouverneur)
2. Rick et Daryl sont roots
3. Rick référence Glenn
4. Negan et Gouverneur ne sont référencés par personne
5. Lancer le GC → vérifier que Negan et Gouverneur sont détruits
6. Retirer Rick des roots → lancer le GC → vérifier que Rick et Glenn disparaissent

---

### EXO 3 : TROUVER LA FUITE

Ce code tourne en Node. Après 10 000 itérations, l'app utilise 800 MB de RAM. Trouve la fuite en lisant le code, explique pourquoi elle existe, et propose la correction.

```js
const eventBus = {
 listeners: {},
 on(event, fn) {
  if (!this.listeners[event]) this.listeners[event] = [];
  this.listeners[event].push(fn);
 },
 emit(event, data) {
  (this.listeners[event] || []).forEach((fn) => fn(data));
 },
};

// Système de scoring pour chaque épisode de Walking Dead
function processEpisode(episodeId) {
 const scores = new Array(50_000).fill(0);

 eventBus.on("score_update", (data) => {
  // capture scores par closure
  scores[data.index] = data.value;
 });

 return scores.reduce((a, b) => a + b, 0);
}

for (let i = 0; i < 10_000; i++) {
 processEpisode(i);
}
```

---

## RÉSUMÉ

Le GC suit toujours le même chemin : partir des roots, marquer ce qui est atteignable, détruire le reste. Les cycles entre objets ne posent pas de problème si aucune root ne les atteint : mark-and-sweep les détruit quand même. Une fuite mémoire, c'est une root qui garde involontairement un objet en vie : tableau global, listener non retiré, closure qui capture. Simuler le GC à la main force à voir les références là où le code semble "propre".
