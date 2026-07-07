---
stability: stable
---

# FIXTURE : MEMORY HUNTER

Temps de lecture ~2 min


Deux scripts pour t'entraîner à trouver une fuite mémoire réelle, pas théorique.

## Ce que tu as

- `leaky.js` : script instrumenté qui log `rss / heap / cache size / listeners count`
 toutes les secondes. Il contient AU MOINS UNE fuite. Peut-être deux.

## Ta mission (3 étapes, dans l'ordre)

### Étape 1 : Observer sans code (5 min)

```bash
node --expose-gc leaky.js
```

Laisse tourner 60 secondes. Note dans `LEAK_REPORT.md` :
- courbe `rss` en 6 points (t=10, 20, 30, 40, 50, 60s),
- courbe `cache` sur les mêmes points,
- courbe `listeners` sur les mêmes points.

Question : laquelle des trois croît **linéairement sans borne** ?

### Étape 2 : Snapshot chirurgical (15 min)

Suis le protocole de `08_memory_performance/01_gc/05_heap_snapshot_hands_on.md`.
Snapshots à t=10s et t=60s. Compare. Le top 3 delta est ta liste de suspects. Note-la.

### Étape 3 : Fix + preuve (15 min)

Écris `fixed.js` en ne touchant qu'aux lignes strictement nécessaires. Relance,
compare `rss` à t=60s entre `leaky.js` et `fixed.js`. Consigne le delta dans
`LEAK_REPORT.md`. Si le delta est < 50 MB → succès. Sinon → il te reste une fuite.

## Livrable final

`LEAK_REPORT.md` avec :
- 3 courbes ASCII observées,
- top 3 retainers avec chemin complet,
- diff `leaky.js → fixed.js`,
- courbe `rss` finale prouvant le fix.
