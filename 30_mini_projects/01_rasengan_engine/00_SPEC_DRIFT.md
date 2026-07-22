---
stability: mouvant
scope: 01_rasengan_engine
---

# 00_SPEC_DRIFT.md : spec drift **en cours de projet** (mouvant)

Complement de `SPEC_DRIFT_TRIGGERS.md` (statique, liste des declencheurs
intemporels). Ce fichier-ci est **mouvant** : il documente le drift _pendant_
que tu construis 01_rasengan_engine.

## Regle

Chaque fois qu'un choix du `cahierdescharges.md` bouge en cours de route,
tu ajoutes une ligne ici. C'est la trace vivante que la specification n'est
pas gravee, elle respire.

## Format d'entree

| Date       | Ce qui a bouge                         | Trigger declencheur (voir SPEC_DRIFT_TRIGGERS.md) | Decision prise                        | ADR lie |
| ---------- | -------------------------------------- | ------------------------------------------------- | ------------------------------------- | ------- |
| 2026-MM-JJ | Exemple : format de sortie CSV -> JSON | T3 : besoin utilisateur precise                   | Adopte JSON, back-compat CSV via flag | ADR/003 |

## Rappel

- Statique = `SPEC_DRIFT_TRIGGERS.md` (les triggers eux-memes, jamais reecrits).
- Mouvant = ce fichier (les **occurrences** de drift, alimente en continu).
