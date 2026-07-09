---
stability: intemporel
---

# ADR-002 : Choix de la forme des données

Temps de lecture ~4 min

## Statut

Accepté : 2026-07

## Contexte

[Projet 11_scheduler] Le projet manipule un état structuré : forme flat vs imbriquée, immutable vs mutable,
in-memory vs sérialisée sur disque. Chaque choix engage la testabilité et la performance.

## Options considérées

- **Structure flat + immutable (facile à comparer, coût mémoire moyen)**
- **Structure imbriquée + mutable (perf mémoire, tests plus durs)**
- **Persistance disque JSON (relance possible, IO à chaque tick)**

## Décision

Structure flat + immutable en mémoire, sérialisation optionnelle au checkpoint.

## Conséquences

Diff/test triviaux. Coût mémoire visible sous fort volume : accepté, tracé dans POSTMORTEM.

## Ce qu'on abandonne

La mutation locale (Immer, structures partagées) : coût = plus de code de spread manuel.

## Signal de révision

> 100k entrées d'état simultanées OU besoin de rollback partiel.
