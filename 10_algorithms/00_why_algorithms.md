---
perennite: intemporel
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Tri, recherche, graphes : intemporels.
---
> **Statut de pérennité :** **intemporel** | évolutif | périssable
> Statut effectif de ce module : **intemporel**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : structures de données (09_data_structures), récursion (01_fundamentals), async (03_async). Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI CE MODULE MÉRITE TON TEMPS : ALGORITHMS

> **Durée de vie : intemporel.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.
Temps de lecture ~8 min

Un problème de code, en vrai, ressemble presque toujours à un problème que quelqu'un d'autre a déjà résolu. Trier une liste, trouver le chemin le plus court, planifier des tâches avec des contraintes : ce ne sont pas des cas exotiques, c'est le quotidien. La différence entre un dev qui galère pendant 3 heures et un dev qui code la solution en 20 minutes, c'est qu'il a reconnu le pattern (motif récurrent) derrière le problème.

Les algorithmes, c'est une bibliothèque de patterns déjà résolus. Tu n'inventes pas la roue : tu la reconnais quand elle passe devant toi.

---

## PRÉREQUIS

Ce module suppose que tu maîtrises :
- toutes les structures de `09_data_structures` : complet
- analyse de complexité ligne par ligne : voir `08_memory_performance/03_complexity/02_complexity_analysis.md`

Si ces bases ne sont pas là : reviens ici après.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Sans bagage algorithmique, chaque problème ressemble à un problème nouveau, même quand ce n'est pas le cas. Trier une liste de 100 000 éléments avec un tri à bulles (O(n²)) au lieu d'un merge sort (O(n log n)), c'est la différence entre 2 secondes et 3 minutes d'exécution sur le même volume. Chercher un élément dans une liste triée avec une recherche linéaire au lieu d'une recherche binaire (binary search), c'est la différence entre O(n) et O(log n) : littéralement des milliers de fois plus rapide sur de gros volumes.

Ce module t'apprend à reconnaître les familles de problèmes :

- tri et recherche : les opérations les plus fréquentes, avec des coûts très différents selon l'approche
- programmation dynamique (DP : découper un problème en sous-problèmes qu'on résout une seule fois et qu'on réutilise)
- approche gourmande (greedy : prendre la meilleure décision locale à chaque étape)
- backtracking (essayer, échouer, revenir en arrière intelligemment)
- algorithmes de graphes (Dijkstra, A*, tri topologique)

Une fois que tu reconnais le pattern, le problème devient prévisible.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev sans bagage algorithmique résout chaque problème en force brute (brute force : essayer toutes les possibilités sans stratégie), même quand une solution bien plus rapide existe. Il code un système de recommandation avec des triples boucles imbriquées en O(n³) là où une approche avec la bonne structure tournerait en O(n log n).

Sur un vrai projet, l'absence de ce bagage se traduit par des fonctionnalités qui semblent "marcher" en dev mais qui s'effondrent en prod dès que le volume de données dépasse ce que personne n'avait anticipé. Le bug n'est pas dans la logique : il est dans le choix d'approche.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
classement, leaderboard, tri de résultats   --> merge sort / quick sort  --> tri efficace à l'échelle
recherche dans une liste triée         --> binary search       --> O(log n) au lieu de O(n)
optimisation sous contrainte (budget, stock)  --> dynamic programming    --> solution optimale garantie
planification avec ressources limitées     --> greedy          --> décision rapide et souvent suffisante
génération de combinaisons valides (sudoku)   --> backtracking       --> exploration intelligente
calcul d'itinéraire, de plus court chemin    --> Dijkstra / A*       --> chemin optimal dans un graphe pondéré
ordonnancement de tâches dépendantes      --> tri topologique      --> jamais faire B avant A
```

Ce ne sont pas des exercices d'entretien déconnectés du réel : un GPS utilise Dijkstra ou A*, un moteur de build (comme Webpack ou Vite) utilise un tri topologique pour ordonner les dépendances, un système de cache utilise des heaps pour gérer les priorités d'éviction.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Intemporel. Un algorithme de tri ne devient pas obsolète parce qu'un nouveau framework JS sort. Merge sort fonctionne exactement pareil aujourd'hui qu'il y a 50 ans, parce qu'il décrit une stratégie logique, pas une implémentation liée à un outil particulier.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Ce qui a changé, c'est le terrain d'application : avant, ces algorithmes étaient surtout enseignés pour des systèmes bas niveau ou des entretiens techniques. Aujourd'hui, ils apparaissent directement dans des outils que les devs front-end et back-end utilisent sans le savoir : les bundlers utilisent du tri topologique, les bases de données utilisent des arbres et des structures de recherche optimisées, les systèmes de recommandation utilisent des variantes de DP et de greedy.

La montée de l'IA générative a aussi changé la donne : un LLM peut générer un algorithme de tri en 2 secondes, mais il ne peut pas juger seul si cet algorithme est le bon choix pour ton contexte précis. Comprendre les algorithmes te permet de valider ce que l'IA te propose, pas juste de le copier-coller à l'aveugle.

---

## 6) NOYAU DUR DU MÉTIER ?

Oui, explicitement : "07 + 08, Data Structures + Algos : sans ça, t'es limité". Ce module dépend entièrement de `09_data_structures` : tu ne peux pas comprendre Dijkstra sans comprendre les graphes et les heaps (`09_data_structures/05_heap` et `09_data_structures/08_graphs`), tu ne peux pas comprendre un tri efficace sans comprendre la notion de complexité vue en `08_memory_performance/03_complexity`. Si tu n'as pas ces modules derrière toi : finis-les d'abord.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Les algorithmes décrivent des stratégies logiques universelles, pas des détails d'implémentation liés à un langage. Un dev qui maîtrise ces patterns transfère cette compétence instantanément vers Python, Rust, Go, ou n'importe quel autre langage. C'est aussi la compétence qui distingue un dev capable de juger un code généré par IA d'un dev qui se contente de l'accepter sans comprendre s'il est vraiment efficace.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

La plupart des problèmes de code ressemblent à des problèmes déjà résolus. Reconnaître le pattern change tout : tu passes de "je cherche comment faire" à "je sais quelle famille d'algorithme s'applique ici". Sans ce bagage, tu codes en force brute. Avec, tu choisis.

Maintenant, ouvre `01_bubble_insertion.md`. Et vois enfin pourquoi un algorithme lent existe encore, avant de comprendre pourquoi on ne l'utilise presque plus.
