# ADR-001 : stockage des ids d'idempotence

Statut : accepté

## Contexte
Le retry peut rejouer un incrément. Il faut mémoriser les ids déjà vus.
## Décision
Set en mémoire côté coordinateur, avec TTL de 5 minutes par id.
## Conséquences
- Positif : lookup O(1), simple à raisonner en local.
- Négatif : perdu si le coordinateur crash ; acceptable pour le lab, documenté comme limite.
## Alternatives écartées
- Persistance disque : robuste mais alourdit le lab local. Écartée.
