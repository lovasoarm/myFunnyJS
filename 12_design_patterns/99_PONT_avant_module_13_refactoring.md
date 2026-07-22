---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PONT : de reconnaître des patterns à réécrire pour les révéler à le refactoring

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `12_design_patterns` et `13_refactoring`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de nature.

## POURQUOI CE PONT EXISTE

Un pattern est un vocabulaire. Le refactoring est la grammaire qui l'installe dans du code existant, sans casser. Tu vas apprendre à modifier la forme sans toucher au comportement, à petits pas testés.

## CE QUE TU MAÎTRISES DÉJÀ

- Nommer les 20 patterns GoF principaux.
- Voir un pattern dans du code qui ne le nomme pas.
- Distinguer sur-ingénierie et pattern utile.

## VOCABULAIRE NOUVEAU QUI ARRIVE

- **Code smell** : indice qu'un refacto est possible (long method, feature envy, primitive obsession).
- **Extract Function / Inline Function** : les deux mouvements de base.
- **Rename** : un refacto qui a l'air trivial, qui change la compréhension du code.
- **Strangler fig** : remplacer un module vieux morceau par morceau, sans big bang.

## LE PIÈGE MENTAL TYPIQUE DU SAUT

Refactoriser sans tests. Chaque changement devient un pari. Le refacto n'est pas courageux, il est sûr : et il est sûr grâce aux tests, pas grâce à ton flair.

## EXERCICE-CHARNIÈRE (5 min chrono)

Prends une fonction de 40 lignes du curriculum, nomme 3 code smells, propose le premier refacto (le plus petit possible). Ne l'exécute pas : décris juste le mouvement. Si tu ne vois aucun smell : `13_refactoring/01_smells.md`.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise beaucoup d'apprenants. Aucune honte à revenir.
