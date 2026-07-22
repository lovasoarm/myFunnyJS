---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# DRILL : L'event loop explique a un enfant de 5 ans, PUIS reconstruit en 20 lignes

Temps de lecture ~3 min


Objectif : tester que tu tiens le concept a deux profondeurs opposees.
Prerequis : avoir lu `04_event_loop/` en entier.

## Partie 1 : L'explication a un enfant de 5 ans (5 min max)

Contrainte : **aucun mot technique**. Ni "microtask", ni "callback", ni "queue", ni "stack".
Tu as le droit a : image, jouet, histoire, dessin.

Exemple d'explication cible (ne la copie pas, invente la tienne) :

> Imagine que tu es le seul serveur d'un tres petit restaurant.
> Devant toi il y a une pile d'assiettes a servir : tu prends celle du haut, tu la sers, tu passes a la suivante.
> Un client arrive et dit : "je veux une pizza, ca prend 20 min a cuire".
> Tu ne restes PAS devant le four a attendre. Tu poses un post-it "pizza pour la table 3" sur le comptoir, et tu retournes servir les autres assiettes.
> Quand la pizza est prête, le cuisinier pose le post-it dans une petite boite prioritaire (la boite "urgent-tres-vite").
> Entre chaque assiette servie, tu regardes la boite urgente EN PREMIER, avant de reprendre la pile normale.
>
> Le serveur = le moteur JS.
> La pile d'assiettes = la callstack.
> Le post-it "pizza" = un `setTimeout`.
> La boite urgente = les microtasks (promesses).

## Partie 2 : Reimplemente une boucle evenementielle en 20 lignes de JS pur

Contrainte : aucune bibliotheque, aucun `setImmediate`/`setTimeout` interne, uniquement des tableaux.
Cible : rendre visible la difference microtask vs macrotask.

Squelette minimal (a completer, PAS a copier tel quel) :

```js
const macrotasks = [];
const microtasks = [];

function scheduleMacro(fn) { macrotasks.push(fn); }
function scheduleMicro(fn) { microtasks.push(fn); }

function tick() {
 // 1. vider TOUTES les microtasks avant de toucher aux macrotasks
 while (microtasks.length) microtasks.shift()();
 // 2. traiter UNE seule macrotask par tick
 if (macrotasks.length) macrotasks.shift()();
}

function run() { while (macrotasks.length || microtasks.length) tick(); }

// TEST : tu dois voir A, C, D, B (D est microtask avant la macrotask suivante)
scheduleMacro(() => console.log("A"));
scheduleMacro(() => { console.log("B"); });
scheduleMacro(() => console.log("C"));
scheduleMicro(() => console.log("D"));
run();
```

## Sortie attendue

- Un enregistrement audio ou texte de ton explication a l'enfant de 5 ans.
- Le fichier `event_loop_mini.js` qui tourne et affiche la trace attendue.
- Une phrase : "ce qui manque a mon mini pour etre le vrai event loop V8, c'est ...".

## Auto-eval

- [ ] Ton neveu/petit frere/petite soeur t'a repete l'idee sans le mot "async".
- [ ] Ton `run()` termine sans stack overflow sur 10_000 macrotasks.
- [ ] Tu peux nommer 3 differences avec le vrai event loop (I/O, timers, phases libuv).

Ce module reutilise : les modeles mentaux de `03_async/00_why_async.md`.


> ATTENTION - ou cette analogie casse :
> les analogies mecaniquement sensibles (prototype, closure, event loop, reference vs copie)
> creent de faux modeles si on les prend trop loin. Consulte ce court aide-memoire :
>
> - **prototype != clone** : `Object.create(p)` ne COPIE pas p, il LIE dessus. Modifier p impacte l'enfant.
> - **closure != variable capturee** : la closure capture la REFERENCE au binding, pas la valeur au moment de la creation.
> - **event loop != file simple** : microtasks drainent COMPLETEMENT entre chaque macrotask - pas un round-robin.
> - **reference != alias** : `let b = a; b = {...}` ne mute pas a. `b.x = 1` mute a si a est objet.
