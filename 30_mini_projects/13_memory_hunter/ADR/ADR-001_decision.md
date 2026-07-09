---
stability: intemporel
---

# ADR-001 : politique d'éviction du cache

## Statut
Accepté : 2026-05

## Contexte

Le cache `Map` du serveur n'a aucune politique d'éviction : il grossit à
l'infini tant que le process tourne. En 4 heures de trafic normal, le RSS
passe de 80 MB à 1,2 GB, puis le process est OOM-killed.

Il faut borner la taille sans casser le hit-rate observé (85 % sur les
1000 requêtes les plus fréquentes de la journée).

## Décision

**LRU (Least Recently Used) avec taille max = 1000 entrées.**

Implémentation minimale via l'ordre d'insertion de `Map` : à chaque `get`
qui hit, on `delete` puis `set` pour remonter l'entrée en fin de Map. À
chaque `set`, si `size > 1000`, on supprime la première clé (la plus vieille).

## Alternatives écartées

- **TTL seul (expiration temporelle)** : ne borne pas la taille sous forte
  charge. Un burst de 100k requêtes uniques en 60 s remplit toujours le heap
  avant que le TTL n'expire. Écarté comme unique politique. Combinable avec
  LRU (LRU + TTL) dans une v2 si besoin.
- **FIFO** : simple mais évince des entrées chaudes, dégrade le hit-rate.
  Mesuré sur les traces d'usage : LRU garde ~85 % de hit-rate, FIFO tombe
  à ~55 %. Écarté.
- **LFU (Least Frequently Used)** : meilleur théorique mais nécessite un
  compteur par entrée et un tri, coût O(log n) au lieu de O(1) amorti pour
  LRU. Overkill pour la charge visée.
- **Cache externe (Redis)** : ajoute une dépendance d'infra pour un cache
  de 1000 entrées in-memory. Écarté : disproportionné.

## Conséquences

- **Positif** : mémoire bornée (~2 MB pour 1000 entrées de 2 KB), hit-rate
  préservé, logique O(1) amortie.
- **Négatif** : logique plus complexe qu'une Map nue, deux opérations
  supplémentaires par `get` qui hit. Négligeable sur les traces mesurées.
- **À surveiller** : si la distribution d'accès devient uniforme (chaque clé
  vue une seule fois), LRU dégénère et FIFO devient équivalent. Réviser.
