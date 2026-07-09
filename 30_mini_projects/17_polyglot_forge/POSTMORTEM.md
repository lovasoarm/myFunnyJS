# POSTMORTEM

Temps de lecture ~2 min


## Ce qui a marché
-

## Ce qui a cassé et pourquoi
-

## Divergences de trace rencontrées (au moins 1)
Décris la première divergence entre les deux runtimes. Cause racine (pas symptôme). Comment tu l'as prouvée. Ce que tu as changé.

## Choix de langage secondaire (Python OU Rust OU Go justifié)
En < 20 lignes : pourquoi ce langage, quel angle mort il t'a exposé sur ta compréhension JS de l'event loop.

## Ce que je referais différemment
-

---
stability: stable

## Comment j'ai encaissé le drift

Section obligatoire si `SPEC_DRIFT_MODE=on` (voir `SPEC_DRIFT_TRIGGERS.md`).
Une ligne par déclencheur activé (J+1, J+3, J+5) avec le coût réel payé.
