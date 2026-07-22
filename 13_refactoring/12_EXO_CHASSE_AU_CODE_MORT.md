---
stability: intemporel
---

# EXO : chasse au code mort (15.4)

Temps de lecture ~2 min


## Contexte
Reprends le mini-projet `30_mini_projects/10_legacy_dungeon`. Ton objectif : lister le code mort ET la duplication mesurable.

## Regle
1. Interdit de supprimer avant d'avoir prouve (grep + tests).
2. Chaque suppression doit reduire >=1 ligne sans casser un test.

## Livrables
- `DEAD_CODE.md` : liste par fichier:ligne, avec la preuve (grep, coverage).
- `DUPLICATION.md` : blocs > 5 lignes dupliques >=2 fois, avec proposition de factorisation.
- diff final avec tests verts.

## Auto-verification
```bash
node solution.js
# doit afficher : drill 2 OK (detection code mort)
```
