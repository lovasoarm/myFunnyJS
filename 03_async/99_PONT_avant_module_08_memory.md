---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PONT : de l'async à la mémoire

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `03_async` et `08_memory_performance`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de complexité réel.

## POURQUOI CE PONT EXISTE

Tu sais maintenant que `await` suspend une fonction sans bloquer le thread. Le module 08 va t'expliquer **où vivent, physiquement, les variables capturées par une fonction suspendue**. Une closure asynchrone qui garde 5 Mo vivants pendant 20 minutes, c'est le pain quotidien des fuites mémoire prod. Sans image mentale du heap, tu vas voir des OOM sans jamais comprendre d'où ils viennent.

## DRILL DE VÉRIFICATION (3 questions)

1. Quand tu écris `async function f() { const big = new Array(1e6); await sleep(60000); return big.length }`, à quel moment `big` peut-il être collecté par le GC ?
2. Une `Promise` qui n'est jamais `resolve` ni `reject` : est-ce que ses variables capturées se libèrent ?
3. Différence entre "stack" et "heap" en une phrase chacun ?

Si tu bloques : relis `03_async/` + `07_math_basics/99_PONT_avant_module_08_memory.md`.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise 80% des apprenants sur le module suivant. Aucune honte à revenir.
