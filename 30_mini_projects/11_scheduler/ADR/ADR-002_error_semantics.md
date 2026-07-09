---
stability: intemporel
---

# ADR-002 : gestion des erreurs partielles dans `pMap`

## Statut
Accepté : 2026-05

## Contexte

Une tâche sur 100 échoue. Deux comportements possibles :
- **fail-fast** : rejeter la promesse globale à la première erreur, annuler
  les tâches restantes,
- **collect** : attendre toutes les tâches, retourner un tableau de
  `{ ok, value | error }`.

Ce choix impacte l'ergonomie : fail-fast est ce qu'on attend de `Promise.all`,
collect est ce qu'on attend de `Promise.allSettled`.

## Décision

Défaut : **fail-fast** (aligné sur `Promise.all`, principe de moindre surprise).
Option explicite `stopOnError: false` pour basculer en mode collect, avec un
résultat typé `{ results, errors }`.

## Alternatives écartées

- **Collect par défaut** : cache les erreurs, dangereux en prod. Écarté.
- **Retry automatique** : complexifie l'API, décision hors périmètre du
  scheduler (relève d'un décorateur `pRetry`).

## Conséquences

- **Positif** : API cohérente avec l'écosystème JS, opt-in explicite pour le
  comportement tolérant.
- **Négatif** : sur les tâches déjà lancées au moment de l'échec, on ne peut
  pas les annuler (pas d'`AbortController` cablé au premier jet). Consigné
  comme dette dans le README, à traiter dans une v2.
