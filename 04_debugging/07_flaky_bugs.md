---
stability: intemporel
---

# 07 : Flaky bugs (les bugs non déterministes)
Temps de lecture ~5 min

> **INTEMPOREL** : race conditions, timing, ordre d'exécution : ces bugs
> existent dans tous les langages avec du concurrent. Le protocole est le même.

## Le piège

Un test passe 99 fois sur 100. Le junior dit "flaky, on relance". Le senior
dit "**il y a un bug**, la CI ne fait que le révéler".

**Règle d'or Thor** : un test flaky n'existe pas. Il y a un bug de
synchronisation caché derrière.

## Mission

Voici un compteur incrémenté depuis N callbacks asynchrones :

```js
let count = 0;
async function bump() {
 const v = count;     // 1. lecture
 await Promise.resolve(); // 2. yield
 count = v + 1;      // 3. écriture
}
await Promise.all(Array.from({length: 1000}, bump));
console.log(count); // attendu 1000 : obtenu ?
```

Tâches :

1. **Reproduis** le bug avec un seed fixe (utilise un pRNG déterministe :
  [mulberry32](https://stackoverflow.com/a/47593316)) pour ordonnancer les
  yields dans un ordre reproductible.
2. **Logs différentiels** : instrumente les trois étapes (lecture, yield,
  écriture) avec un `traceId` par appel. Compare deux exécutions et repère
  les entrelacements fautifs.
3. **Replay déterministe** : écris un mini-scheduler qui rejoue la même
  séquence d'entrelacements deux fois de suite. Le bug doit apparaître au
  même endroit.
4. **Corrige** : propose deux solutions (une mutex `p-limit`-style et une
  variable atomique via `Atomics` sur un `SharedArrayBuffer`) et discute
  leurs coûts.

## Livrable

- `WRITE_UP.md` : hypothèse → expérience → conclusion → correctif.
- Le correctif doit passer 10 000 exécutions consécutives.

## (attention) Ce que l'analogie "flaky" cache

"Flaky" suggère un défaut du **test**. En réalité, c'est un défaut du **code**
ou du **modèle mental**. Renommer le problème est déjà la moitié de la solution.

## Transférable

Même protocole en Python (`asyncio`), Go (goroutines + `race` detector),
Rust (`loom` pour tester tous les entrelacements).
