---
stability: intemporel
---

# PONT : de prévoir l'échec à le prouver à les tests

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `05_error_handling` et `06_testing`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de nature.

## POURQUOI CE PONT EXISTE

Tu sais désormais quoi lever et quand. Reste à démontrer que ton code s'y tient sans avoir à le vérifier à la main à chaque changement. Les tests transforment tes intentions d'erreur en garde-fous exécutables.

## CE QUE TU MAÎTRISES DÉJÀ

- Distinguer erreur attendue et bug.
- Écrire un `throw` qui porte du sens.
- Choisir entre relancer, wrapper, ou traiter.

## VOCABULAIRE NOUVEAU QUI ARRIVE

- **AAA (Arrange, Act, Assert)** : structure d'un test lisible.
- **Fixture** : donnée figée qu'on rejoue à chaque run.
- **Coverage** : pourcentage de lignes touchées : indicatif, pas objectif.
- **Mutation testing** : on casse volontairement le code pour voir si un test attrape.

## LE PIÈGE MENTAL TYPIQUE DU SAUT

Écrire des tests qui répètent l'implémentation. Un test qui casse à chaque refacto propre ne teste rien : il photographie le code.

## EXERCICE-CHARNIÈRE (5 min chrono)

Prends une fonction qui `throw` deux erreurs distinctes. Écris trois tests : chemin heureux, erreur A, erreur B. Sans ouvrir la doc du runner. Si tu ne peux pas nommer les 3 étapes AAA de chaque test, ouvre `06_testing/02_test_structure.md` d'abord.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise beaucoup d'apprenants. Aucune honte à revenir.
