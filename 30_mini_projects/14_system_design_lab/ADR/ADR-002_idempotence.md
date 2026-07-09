---
stability: intemporel
---

# ADR-002 : idempotence applicative des handlers

## Statut
Accepté : 2026-05

## Contexte

Redis Streams garantit « at-least-once » : un message peut être livré deux
fois si un consommateur crash entre `XREADGROUP` et `XACK`. Sans précaution,
un handler qui incrémente un compteur double le compte.

## Décision

Tout handler du lab est **idempotent by design** : reçoit un `messageId`,
vérifie s'il l'a déjà traité (via une clé Redis `SET messageId ex 3600 NX`),
sinon exécute la logique métier puis `SET` la clé.

TTL : 1 heure (plus long que la fenêtre de retry Redis Streams par défaut).

## Alternatives écartées

- **Transactions distribuées** : hors périmètre du lab. Écartées.
- **Ignorer les doubles livraisons** : la démo doit refléter la contrainte
  réelle de production. Écarté.

## Conséquences

- **Positif** : lab réaliste, prépare l'apprenant aux vrais systèmes
  distribués.
- **Négatif** : chaque handler doit implémenter le check idempotence, coût
  d'un round-trip Redis supplémentaire par message. Négligeable au débit
  visé (< 1000 msg/s).
