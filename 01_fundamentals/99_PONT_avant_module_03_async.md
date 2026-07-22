---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PONT : des fondamentaux à l'async

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `01_fundamentals` et `03_async`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de complexité réel.

## POURQUOI CE PONT EXISTE

Tu viens d'apprendre à déclarer des variables, écrire des fonctions, boucler. Le module 03 va te demander de raisonner sur du code qui **ne s'exécute pas dans l'ordre où il est écrit**. Le saut est réel : `console.log('A'); setTimeout(()=>console.log('B'),0); console.log('C')` affiche `A C B`. Sans un modèle mental clair de "file d'attente", tu vas coder à l'aveugle pendant 3 semaines.

## DRILL DE VÉRIFICATION (3 questions)

1. Dans quel ordre s'affichent `A`, `B`, `C` dans l'exemple ci-dessus, et pourquoi ?
2. Une fonction qui retourne une `Promise` : quand exécute-t-elle son `.then()` : avant ou après la fin du script courant ?
3. Peux-tu expliquer, sans le mot "asynchrone", ce que fait `setTimeout(fn, 0)` ?

Si tu ne peux pas répondre aux 3 sans hésiter : relis `01_fundamentals/` avant d'ouvrir `03_async/`.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise 80% des apprenants sur le module suivant. Aucune honte à revenir.
