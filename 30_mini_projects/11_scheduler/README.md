---
stability: intemporel
---

[PORTFOLIO]

# 11 : SCHEDULER (obligatoire, pas optionnel)

-> ~5 min

Implémente ton propre event loop miniature, puis un `pMap` avec limite de concurrence et annulation.

## Pitch 3 lignes

Ce projet prouve que je comprends la différence microtask/macrotask, que je sais borner la concurrence, et que je gère l'AbortController comme un adulte. Base pour toute discussion async en entretien.

## Livrables

### 1. `mini-loop.js`

- File de microtasks, file de macrotasks.
- Priorité : tout drainer la microtask queue avant chaque macrotask.
- API : `enqueueMicro(fn)`, `enqueueMacro(fn)`, `run()`.

### 2. `pMap.js`

```
pMap(items, mapper, { concurrency: 5, signal: AbortController.signal })
```

- Lance max N mappers en parallèle.
- Si `signal.aborted` → rejette immédiatement, annule les in-flight (si possible).
- Ordre de sortie préservé.

### 3. Tests

- Ordre d'exécution micro/macro conforme au spec.
- `pMap` avec `concurrency=1` = série stricte.
- Annulation propre : pas de fuite de timer.

## Critères d'acceptation

- Aucun `setTimeout(fn, 0)` pour "hack" une microtask. Utilise `queueMicrotask`.
- `pMap` mesure ≤ (N / concurrency) \* temps_unitaire à ±10 %.
- Empreinte carbone : justifie ton choix de concurrence par défaut (10 vs 100).

## Piège

Rejeter tôt sans annuler les in-flight = fuite. Pense au cleanup.

## THÈME NEUTRE (optionnel)

Si les références Naruto/DBZ ne te parlent pas, remplace mentalement par un domaine que tu connais (foot, cuisine, musique). Le concept technique reste identique.

---

## REPRODUCTIBILITÉ

Installation canonique : `npm ci` (pas `npm install`). `npm ci` respecte strictement le `package-lock.json` : deux personnes qui clonent obtiennent exactement les mêmes versions. Committe toujours ton `package-lock.json`. Sans lui, un `npm install` 3 mois plus tard installera d'autres versions et tu debug un fantôme.
