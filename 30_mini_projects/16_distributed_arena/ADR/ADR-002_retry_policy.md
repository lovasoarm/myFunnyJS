---
stability: intemporel
---

# ADR-002 : politique de retry côté client

## Statut
Accepté : 2026-05

## Contexte

Le client doit retry sur les erreurs transitoires (5xx, timeout réseau)
sans amplifier une panne. Un retry mal calibré transforme un incident
localisé en tempête de charge (thundering herd).

## Décision

**Backoff exponentiel avec jitter**, plafonné à 3 tentatives.

Formule : `sleep = min(1000 * 2^n + random(0, 500), 30_000)` millisecondes,
où `n` est le numéro de tentative (0, 1, 2). Le jitter empêche les
retries de se synchroniser.

## Alternatives écartées

- **Retry fixe (1 s entre chaque)** : simple mais synchronise les clients,
  amplifie la charge sur la cible qui revient. Écarté.
- **Retry infini** : dangereux, jamais.

## Conséquences

- **Positif** : résilience réelle contre les erreurs transitoires, sans
  thundering herd.
- **Négatif** : latence utilisateur potentielle de plusieurs secondes en
  cas de retry. Acceptable pour le domaine (opération non interactive
  temps réel).
