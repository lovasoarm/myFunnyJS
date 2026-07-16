---
stability: intemporel
---

# NAVIGATION : DATA STRUCTURES EN 3 PALIERS

Temps de lecture ~2 min

Ce module a 9 sous-dossiers. C'est plus que les autres modules du
curriculum, et c'est voulu : les structures de données forment une
famille dense, mais pas une famille homogène. Les enchaîner d'un coup
sans respirer, c'est le meilleur moyen de finir avec une bouillie
mentale où tout se mélange.

Découpe-toi ce module en 3 paliers. Fais une vraie pause entre chaque
(pas juste un café : une session de sommeil, ou au moins un autre module
entre les deux si tu es pressé).

```
PALIER A : structures linéaires
  01_array --> 02_linked_list --> 03_stack --> 04_queue

  Point commun : un seul chemin pour naviguer les éléments
  (avant/arrière). Si tu comprends un array, tu comprends
  déjà 80% de la logique des 3 suivants.

PALIER B : structures non-linéaires
  05_heap --> 06_bst --> 07_hash_table --> 08_graphs

  Point commun : navigation qui n'est plus une ligne droite
  (arbre, hachage, graphe). Change de logiciel mental ici :
  la question n'est plus "avant ou après" mais "où exactement".

PALIER C : bonus
  09_advanced_bonus

  Optionnel dans une première passe. Reviens-y après avoir
  pratiqué le module 10_algorithms : certaines structures
  bonus ne prennent sens qu'avec un peu d'algo derrière.
```

## Pourquoi cette coupure précisément

Le palier A regroupe des structures qui partagent un seul mécanisme
mental (position dans une séquence). Le palier B regroupe des
structures qui demandent un vrai changement de paradigme (arborescence,
hachage, graphe) : chacune a sa propre façon de répondre à "où est mon
élément", contrairement au palier A où c'est toujours une question de
position linéaire.

Si tu sens que tu confonds heap et BST après les avoir vus à la suite :
c'est normal, pas un échec. Reviens sur le `10_data_structures_grimoire.md`
avant de continuer, il te redonne les 9 définitions côte à côte pour
trancher les confusions.

## Ce que ce fichier ne remplace pas

`00_prereq_check.md` reste le gate d'entrée du module entier (basé sur ce
que `08_memory_performance` t'a déjà enseigné). Cette navigation ne
remplace pas ce gate : elle organise ce qui vient après.
