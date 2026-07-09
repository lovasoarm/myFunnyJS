---
stability: intemporel
---

# ADR-001 : stockage des ids d'idempotence

## Statut
Accepté : 2026-05

## Contexte

Dans l'arène distribuée, un client peut rejouer un `POST /increment` à cause
d'un timeout réseau ou d'un retry automatique. Sans mécanisme de
déduplication, un même id d'opération incrémente deux fois.

Il faut un stockage des ids déjà vus, avec :
- lookup O(1),
- coût mémoire borné,
- cohérence acceptable pour un lab pédagogique.

## Décision

**Set en mémoire** côté coordinateur, avec **TTL de 5 minutes** par id
(fenêtre plus longue que les retries client typiques).

Implémentation : Map dont la valeur est le timestamp d'insertion ; un
setInterval passe toutes les 60 s pour supprimer les entrées expirées.

## Alternatives écartées

- **Persistance disque (SQLite, LevelDB)** : robuste, mais alourdit le lab
  local (dépendance native, gestion des fichiers). Écartée pour ce jet.
- **Redis** : cohérent avec les autres mini-projets, mais impose un service
  externe. Écarté pour garder le mini-projet lançable en une commande
  `node index.js`.
- **UUID v7 avec vérification côté serveur seul** : ne protège pas contre
  les retries client identiques. Écarté.

## Conséquences

- **Positif** : lookup O(1), zéro dépendance externe, lab lançable en une
  commande.
- **Négatif** : les ids sont perdus si le coordinateur crash (fenêtre de
  déduplication remise à zéro). Acceptable pour un lab pédagogique,
  documenté comme limite explicite. Un client qui retry pendant les 10 s
  post-crash pourrait produire un double-count.
- **À surveiller** : si le lab évolue vers un test de résilience réelle
  (chaos day sur le coordinateur), migrer vers Redis.

## Signaux de révision

Rouvrir si :
- le mini-projet devient une base d'exercice sur la persistance,
- l'usage mémoire du Set dépasse 50 MB (indique un débit supérieur au
  périmètre pédagogique).
