---
stability: intemporel
---

# ADR-004 : Stratégie de tests

Temps de lecture ~4 min

## Statut

Accepté : 2026-07

## Contexte

[Projet 14_system_design_lab] Il faut choisir entre pyramide classique (beaucoup d'unitaires, peu d'e2e),
sablier (unitaires + e2e, peu d'intégration) et tout-e2e (lent, fragile).

## Options considérées

- **Pyramide (80% unit, 15% integ, 5% e2e)**
- **Sablier (50% unit, 5% integ, 45% e2e)**
- **Tout e2e (0% unit, 100% e2e)**

## Décision

Pyramide, avec 1 e2e par cas nominal + tests de propriété sur le cœur pur.

## Conséquences

Feedback rapide (unit < 1s), régressions e2e attrapées. Fragilité minimale.

## Ce qu'on abandonne

Le tout-e2e : coût = temps de CI × 20 et debugging opaque.

## Signal de révision

Le temps de suite dépasse 30 s ou un bug prod récurrent n'est pas attrapé.
