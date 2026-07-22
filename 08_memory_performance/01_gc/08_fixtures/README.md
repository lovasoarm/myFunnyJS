---
stability: intemporel
---

# Fixtures : GC et fuites mémoire

Temps de lecture ~4 min

Support reproductible pour `05_heap_snapshot_hands_on.md`. Deux scripts
volontairement instrumentés :

| Script | Rôle |
|---|---|
| `leak_case.js` | Reproduit deux fuites classiques (cache non borné + listeners orphelins). RSS croît linéairement. |
| `fixed_case.js` | Version corrigée avec cache LRU borné et listener attaché une seule fois. RSS stable. |

## Procédure minimale (5 min)

```bash
# terminal 1 : fuite
node --expose-gc --inspect=0.0.0.0:9229 leak_case.js

# terminal 2 : version saine (comparaison)
node --expose-gc fixed_case.js
```

Laisse tourner 60 secondes chacun. Compare les colonnes `rss=` et `cache=` :

- `leak_case.js` : `rss` monte de ~20 MB / 30 s, `cache` monte à ~150 000, `listeners` monte à 60.
- `fixed_case.js` : `rss` stable à ± 2 MB, `cache` plafonne à 1000, `listeners` = 1.

## Snapshots à comparer dans Chrome DevTools

1. Ouvre `chrome://inspect`, clique sur le process de `leak_case.js`.
2. Onglet **Memory** → **Take heap snapshot** à `t=10s` (snapshot 1).
3. Attends 50 s. Refais un snapshot à `t=60s` (snapshot 2).
4. Vue **Comparison** entre 1 et 2 : le top delta doit contenir des `(string)`
   et des `Object` retenus par la `Map` globale, et des `Function` de nom
   `leakyListener` proportionnels au nombre de ticks.

## Questions de contrôle

1. **Pourquoi `heap` seul ne suffit-il pas à voir la fuite ?** Parce que `heap`
   ne compte que la mémoire JS ; les buffers natifs et le RSS englobent tout.
2. **Le GC forcé (`global.gc()`) libère-t-il la fuite ?** Non : les objets sont
   toujours atteignables via `cache` et via les closures des listeners. Le GC
   ne peut rien pour des références vivantes.

Réponses attendues consignées : `../../fixtures/CHECK_ANSWERS.md` (à créer par
l'apprenant après avoir fait l'exercice, pas avant).
