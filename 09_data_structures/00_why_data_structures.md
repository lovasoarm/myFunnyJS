---
perennite: intemporel
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Arrays, maps, sets, trees : socle CS.
---
> **Statut de pérennité :** **intemporel** | évolutif | périssable
> Statut effectif de ce module : **intemporel**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : objets & tableaux (01_fundamentals), big-O (10_algorithms anticipé), mémoire (08_memory_performance). Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

> **9 sous-dossiers dans ce module, c'est plus dense que la moyenne.**
> Avant de foncer, lis `00_navigation.md` : il découpe la progression en 3
> paliers digestes plutôt qu'un seul bloc de 9 structures d'affilée.

# POURQUOI CE MODULE MÉRITE TON TEMPS : DATA STRUCTURES

> **Durée de vie : intemporel.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.
Temps de lecture ~8 min

Tu peux tout stocker dans un tableau et tout chercher avec une boucle. Ça marche. Jusqu'à ce que ta liste passe de 100 à 1 million d'éléments, et que ta recherche qui prenait 1ms en prenne maintenant 4 secondes. Le bug n'est pas dans ton code : il est dans ta structure de données.

Choisir la bonne structure, c'est la différence entre un dev qui résout un problème en O(1) (temps constant, peu importe le volume) et un dev qui le résout en O(n²) sans même s'en rendre compte.

---

## PRÉREQUIS

Ce module suppose que tu maîtrises :
- complexité O(n) et notation Big-O : voir `08_memory_performance/03_complexity/01_big_o_basics.md`
- copie par référence vs par valeur : voir `08_memory_performance/02_copy_vs_ref/01_shallow_vs_deep.md`

Si ces bases ne sont pas là : reviens ici après.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Un tableau (array) est pratique, mais il a des coûts cachés selon l'opération : chercher un élément précis dans un tableau non trié coûte O(n) (il faut potentiellement tout parcourir). Une hash table (table de hachage) fait la même recherche en O(1) dans la majorité des cas. Une queue (file) garantit un ordre FIFO (first in, first out) sans réinventer la roue à chaque fois. Un heap (tas) garde toujours l'élément le plus prioritaire accessible instantanément, sans trier toute la liste à chaque ajout.

Sans connaître ces structures, tu résous chaque problème avec le même outil par défaut : le tableau, avec des boucles `for` et `find`. Ça fonctionne pour les petits volumes. Mais dès que l'échelle change, ton choix de structure devient le facteur qui détermine si ton système tient la charge ou s'effondre.

Ce module te donne le vocabulaire et les outils pour répondre à la question : "quelle structure de données représente le mieux ce problème, et qu'est-ce que chaque opération va me coûter ?"

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui ne connaît que le tableau réinvente systématiquement des solutions lentes. Il code un système de file d'attente avec un tableau et `.shift()` (qui coûte O(n) à chaque appel parce que tout le tableau doit se décaler), alors qu'une vraie queue ferait la même chose en O(1). Il fait une recherche répétée dans un tableau alors qu'une hash table donnerait un accès direct.

Dans `04_breaking_cache`, Walter White a besoin de gérer des priorités en temps réel sur son réseau de distribution : quelle livraison est la plus urgente, quelle route est compromise. Un dev qui ne connaît pas les heaps passe une heure à trier une liste entière à chaque insertion. Un dev qui connaît le min-heap accède au plus prioritaire en O(1) et l'insère en O(log n). La différence se sent à l'échelle.

Sur un graphe (réseau de noeuds connectés : relations sociales, routes, dépendances), le dev qui ne connaît pas BFS/DFS (parcours en largeur/en profondeur) ne sait même pas par où commencer pour répondre à des questions pourtant basiques : "quel est le chemin le plus court entre ces deux points ?", "ces deux noeuds sont-ils connectés ?".

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
historique de navigation, undo/redo     --> stack (pile)  --> dernier entré, premier sorti
file d'attente de tâches ou de tickets    --> queue      --> premier entré, premier sorti
système de priorités (urgence, scoring)    --> heap      --> accès immédiat au plus prioritaire
recherche rapide par clé (cache, index)    --> hash table   --> accès quasi instantané en O(1)
relations, réseau social, routes        --> graphe     --> BFS/DFS pour explorer ou connecter
arbre de décision, autocomplétion       --> BST (binary search tree) --> recherche en O(log n)
```

Ces structures ne sont pas théoriques : elles sont le moteur derrière des fonctionnalités que tu utilises tous les jours. L'autocomplétion d'un moteur de recherche, le bouton "annuler" d'un éditeur, le système de recommandation d'un réseau social : tout ça repose sur une structure de données bien choisie.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Intemporel à 100%. Une hash table fonctionne sur les mêmes principes depuis des décennies. Un BST (binary search tree : arbre binaire de recherche) ne change pas de comportement selon le framework JS du moment. Ce sont des concepts d'informatique fondamentale, indépendants du langage et de l'époque.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Ce qui a changé, c'est l'accessibilité : avant, JS n'avait pas de vraie structure `Map` ou `Set` native, donc les devs simulaient des hash tables avec des objets bruts, avec tous les pièges que ça implique (collision avec des propriétés héritées du prototype, par exemple). Aujourd'hui, `Map` et `Set` sont natifs et résolvent ces pièges proprement.

La demande pour ces compétences a aussi augmenté : avec la montée des entretiens techniques orientés algorithmique, et avec des systèmes qui gèrent des volumes de données massifs (analytics en temps réel, recommandation, recherche), connaître les bonnes structures n'est plus optionnel même pour un dev jutsu classique.

---

## 6) NOYAU DUR DU MÉTIER ?

Oui, explicitement dans le noyau dur : "09 + 10, Data Structures + Algos : sans ça, t'es limité". Ce module dépend de `01_fundamentals` et de la notion de complexité vue en `08_memory_performance/03_complexity` (Big-O, O(1), O(n), O(log n) : si ces notations ne sont pas claires, ouvre `08_memory_performance/03_complexity/01_big_o_basics.md` avant de continuer ici), et il devient à son tour le prérequis complet de `10_algorithms`. Sans cette base, tu ne peux pas comprendre pourquoi Dijkstra utilise un min-heap, ou pourquoi un BFS utilise une queue et un DFS une pile.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Les structures de données sont la couche la plus stable de toute l'informatique : un graphe reste un graphe, une queue reste une queue, peu importe le langage ou la mode du moment. Ce que tu apprends ici se transfère directement vers n'importe quel autre langage que tu croiseras dans ta carrière. C'est un investissement qui ne périme jamais, contrairement à la syntaxe d'un framework JS qui aura changé trois fois dans cinq ans.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

Le tableau n'est pas toujours le bon outil, et le mauvais choix de structure transforme un problème simple en mur de performance. Ce module te donne le vocabulaire pour choisir juste : stack, queue, heap, hash table, graphe, BST. Chacun répond à une famille de problèmes précise. Apprendre à les reconnaître, c'est apprendre à ne plus coder à l'aveugle.

Maintenant, ouvre `01_array_basics.md`. Et regarde enfin ce que `.push()`, `.shift()` et `.splice()` te coûtent vraiment.
