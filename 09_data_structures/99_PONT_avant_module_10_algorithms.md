---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PONT : de stocker à traiter à les algorithmes

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `09_data_structures` et `10_algorithms`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de nature.

## POURQUOI CE PONT EXISTE

Les structures rangent, les algos manipulent. Passer de l'une à l'autre demande de voir un problème comme une transformation d'état, pas comme un tas de données. Tri, recherche, parcours : tu vas raisonner en O() plutôt qu'en "ça marche".

## CE QUE TU MAÎTRISES DÉJÀ

- Choisir Array, Map, Set, Tree selon l'usage.
- Estimer les coûts asymptotiques.
- Repérer un accès O(n²) caché dans une boucle imbriquée.

## VOCABULAIRE NOUVEAU QUI ARRIVE

- **Diviser pour régner** : couper le problème en deux, résoudre chaque moitié.
- **Récursion** : une fonction qui s'appelle elle-même, avec cas de base obligatoire.
- **BFS / DFS** : parcourir un graphe en largeur ou en profondeur.
- **Programmation dynamique** : mémoriser les sous-résultats pour ne pas les recalculer.

## LE PIÈGE MENTAL TYPIQUE DU SAUT

Écrire une récursion sans cas de base clair : stack overflow. Ou l'inverse : rendre tout itératif par peur de la récursion, et perdre la lisibilité sur un problème naturellement arborescent.

## EXERCICE-CHARNIÈRE (5 min chrono)

Écris `factorial(n)` en récursif puis en itératif. Quelle version explose à `n = 100000` ? Pourquoi ? Réponse : la récursive, sans TCO. `10_algorithms/03_recursion.md` détaille.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise beaucoup d'apprenants. Aucune honte à revenir.
