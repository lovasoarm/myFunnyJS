[INTEMPOREL]

# ADR-001 : Redis vs RabbitMQ comme broker

Statut : accepté

## Contexte
Il faut une queue entre front et worker.
## Décision
Redis (Streams) pour le premier jet : déjà présent pour le cache, courbe d'apprentissage faible.
## Conséquences
- Positif : une seule dépendance d'infra, ops simples.
- Négatif : garanties de livraison plus faibles que RabbitMQ ; compensées par l'idempotence applicative.
## Alternatives écartées
- RabbitMQ : plus robuste mais infra supplémentaire, overkill pour le lab. Écarté au premier jet.
