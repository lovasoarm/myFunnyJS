---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# 00 : Mesure avant d'optimiser (règle non négociable)
Temps de lecture ~5 min

> **Mesure avant d'optimiser.** Sans mesure, ce n'est pas de l'optimisation,
> c'est de la superstition.

## La règle

Aucune "optimisation" n'entre dans le code sans **3 chiffres** :

1. La valeur **avant**.
2. La valeur **après**.
3. La **charge** exacte utilisée pour mesurer (taille des données, nombre
  d'itérations, hardware).

Si tu ne peux pas produire ces 3 chiffres, tu n'optimises pas : tu
compliques le code au hasard.

## Benchmark minimal

```js
function bench(label, fn, iters = 1e6) {
 const t0 = performance.now();
 for (let i = 0; i < iters; i++) fn(i);
 const dt = performance.now() - t0;
 console.log(`${label}: ${dt.toFixed(2)}ms (${(iters/dt*1000|0)} op/s)`);
}
```

Exercice : compare `Array.push` vs `Array[i] = x` pour construire un tableau
de 1M d'entiers. Publie les 3 chiffres.

## Pièges classiques

- **JIT warmup** : les 1 000 premières itérations ne sont pas représentatives.
 Fais un "warmup" muet avant la mesure.
- **Dead code elimination** : si le résultat n'est jamais utilisé, le moteur
 peut supprimer l'appel. Utilise un accumulateur (`let acc = 0; acc += fn(i);`)
 et log-le une fois à la fin.
- **Variance** : lance 5 fois, garde la médiane, pas la moyenne.

## Encart à copier dans tout PR "perf"

```
### Bench
- Avant : ___ ms (charge : ___)
- Après : ___ ms
- Δ   : ___%
- Machine : ___
```

## (attention) Ce que l'analogie "plus rapide = mieux" cache

Une version 20% plus rapide mais 3× plus complexe à maintenir est une
**régression** business. La lisibilité est aussi une perf : la perf du
prochain humain qui lit le code.
