---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PONT : de la pensée fonctionnelle aux design patterns

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `11_functional_js` et `12_design_patterns`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de complexité réel.

## POURQUOI CE PONT EXISTE

Tu viens de raisonner en pures transformations : `map`, `filter`, `reduce`, composition, immutabilité. Le module 12 va te vendre des "patterns OO" (Strategy, Observer, Factory) qui, à première lecture, ressemblent à un retour en arrière vers l'état mutable. Ce n'est pas un retour en arrière : c'est un autre vocabulaire pour exprimer des intentions récurrentes. Sans ce palier, tu vas rejeter le module 12 par pur biais fonctionnel.

## DRILL DE VÉRIFICATION (3 questions)

1. Un `Observer` implémenté en pur FP, à quoi ressemble-t-il (indice : liste de callbacks) ?
2. Une `Strategy` : en quoi est-ce différent de passer une fonction en paramètre ?
3. Un `Factory` : pourquoi ce n'est pas "juste une fonction qui retourne un objet" ?

Si les 3 réponses te semblent triviales, tant mieux : tu abordes le module 12 avec la bonne posture.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise 80% des apprenants sur le module suivant. Aucune honte à revenir.
