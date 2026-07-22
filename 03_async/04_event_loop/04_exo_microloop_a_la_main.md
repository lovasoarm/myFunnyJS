---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# EXO : IMPLÉMENTER UNE MINI FILE DE MICROTASKS À LA MAIN
Temps de lecture ~7 min. Temps d'implémentation ~30 min.

> **Prérequis** : avoir lu `01_microtask_madness.md`, `02_macrotask_monsters.md`, `03_event_loop_grimoire.md`.
> **Objectif** : prouver que tu comprends l'event loop en le simulant sans event loop. Si tu ne sais pas l'écrire, tu ne le comprends pas.

---

## LA CONSIGNE

Écris `microloop.js` (< 30 lignes) qui expose :

```javascript
const loop = createMicroloop();
loop.schedule(() => console.log("A"));
loop.schedule(() => {
  console.log("B");
  loop.schedule(() => console.log("D"));
});
loop.schedule(() => console.log("C"));
loop.tick();
// Sortie attendue : A B C D
```

Contraintes :

1. `schedule(fn)` empile une tâche.
2. `tick()` vide **entièrement** la file, y compris les tâches ajoutées **pendant** l'exécution (comportement microtask, pas macrotask).
3. Aucune utilisation de `Promise`, `queueMicrotask`, `setTimeout`, `setImmediate`, `process.nextTick`. Tu n'as **pas** d'event loop : tu la simules.
4. Erreurs isolées : si une tâche throw, elle ne casse pas les suivantes. Rapport en fin de `tick()`.

---

## VARIANTE : DIFFÉRENCIER MICRO ET MACRO

Ajoute `scheduleMacro(fn)` : les macrotasks ne s'exécutent qu'**après** que la file microtask soit vide. Reproduis l'ordre :

```javascript
loop.schedule(() => console.log("micro1"));
loop.scheduleMacro(() => console.log("macro1"));
loop.schedule(() => console.log("micro2"));
loop.tick();
// Sortie attendue : micro1 micro2 macro1
```

---

## AUTO-VÉRIFICATION

Ta version passe si :

- [ ] La sortie du snippet principal est exactement `A B C D`.
- [ ] `tick()` termine même si une tâche schedule 10 000 tâches en cascade.
- [ ] Une tâche qui throw n'empêche pas la suite.
- [ ] Aucun appel à `Promise`, `queueMicrotask`, `setTimeout`, `setImmediate`, `process.nextTick`.

Si un seul de ces points casse : ton modèle mental de l'event loop est faux. Recolle le grimoire.

---

## POURQUOI CET EXO EXISTE

Un dev qui écrit `await` sans savoir ce qu'il y a dessous est un passager. Ce fichier te force à devenir conducteur pendant 30 minutes. Après ça, tu n'oublieras plus jamais que la file microtask est **drainée jusqu'au bout** avant la macrotask suivante : parce que tu l'auras codée toi-même.
