---
stability: intemporel
---

# ADR-001 : Redis Streams vs RabbitMQ comme broker

## Statut
Accepté : 2026-05

## Contexte

Le lab de system design a besoin d'une queue entre le front (producteur) et
un pool de workers (consommateurs). Deux candidats sérieux : Redis (Streams)
et RabbitMQ.

Contraintes du lab : reproductibilité en local via `docker compose`, courbe
d'apprentissage compatible avec un dev qui découvre le sujet, coût d'infra
minimum.

## Décision

**Redis (Streams)** pour le premier jet.

Motifs :
- Redis est déjà présent dans la stack (cache), donc pas de dépendance
  supplémentaire.
- Streams (Redis 5+) offrent des groupes de consommateurs, `XACK`, `XPENDING`,
  ce qui couvre 90 % des cas de messaging classiques.
- Courbe d'apprentissage plus courte que RabbitMQ (pas de notion d'exchanges,
  de bindings, de routing keys).

## Alternatives écartées

- **RabbitMQ** : plus robuste sur les garanties (`ack` transactionnels,
  routing complexe, DLX natif), mais nécessite une infra dédiée et un
  vocabulaire important. Écarté au premier jet. Documenté comme cible de
  migration si les besoins évoluent (routing multi-topics, retries à politique
  fine).
- **Kafka** : disproportionné pour un lab. Écarté.
- **Queue en mémoire (BullMQ sans persistance)** : perdrait tout au restart,
  incompatible avec l'objectif du lab (simuler la résilience).

## Conséquences

- **Positif** : une seule dépendance d'infra, ops simples, développeur
  débutant peut lancer le lab en < 5 minutes.
- **Négatif** : garanties de livraison légèrement inférieures (Redis n'est
  pas transactionnel comme RabbitMQ). Compensé au niveau applicatif par
  l'idempotence des handlers (cf. ADR-002).
- **À surveiller** : si le lab s'étend à du routing complexe (fan-out
  conditionnel, DLQ avec politique par type d'erreur), migrer vers RabbitMQ.
