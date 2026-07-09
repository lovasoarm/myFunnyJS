---
stability: stable
---

# Tests : 12_legacy_takeover

Temps de lecture ~3 min

Les tests sont ceux du repo forké : tu ne les réécris pas, tu les fais
**repasser au vert avant tout patch fonctionnel**.

## Lancer

```bash
npm test
# ou, si le repo utilise un runner alternatif, cf. le README original
```

## Structure attendue

- Tests d'origine (dossier `tests/` ou `__tests__/` selon le repo forké) :
  laissés tels quels.
- `tests/regression/` : à créer par toi, contient au moins un test qui
  reproduit le bug ciblé (rouge avant patch, vert après).
- `tests/README.md` : ce fichier.

## Critère de succès

1. Tous les tests d'origine sont verts (aucun ignoré, aucun skip ajouté).
2. Le test de régression que tu as écrit passe au rouge sur `HEAD~1` et
   au vert sur `HEAD`.
3. Le temps d'exécution total n'a pas doublé.

## Piège classique

Un test d'origine était vert « par hasard » (mock trop laxiste, assertion
imprécise). Tu le corriges pour qu'il devienne strict : le signaler dans
le POSTMORTEM comme *découverte* (pas comme régression que tu aurais
causée).
