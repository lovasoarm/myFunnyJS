---
stability: intemporel
---

# PONT : de refactorer en JS pur à ajouter des types à TypeScript

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `13_refactoring` et `14_typescript`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de nature.

## POURQUOI CE PONT EXISTE

Le refactoring te dit "change la forme, garde le comportement". TypeScript te dit "le compilateur peut te prouver que tu n'as rien cassé". Le mariage des deux fait passer ton refacto d'artisanal à industriel.

## CE QUE TU MAÎTRISES DÉJÀ

- Extraire une fonction sans casser les callers.
- Renommer une variable dans tout le codebase.
- Lire les tests avant de refactorer.

## VOCABULAIRE NOUVEAU QUI ARRIVE

- **Type inference** : le compilateur devine, tu n'annotes que si nécessaire.
- **Structural typing** : deux types sont compatibles s'ils ont la même forme, pas le même nom.
- **Narrowing** : le compilateur affine un type au fil des `if`.
- **`unknown` vs `any`** : `unknown` t'oblige à checker, `any` te laisse mentir.

## LE PIÈGE MENTAL TYPIQUE DU SAUT

Migrer un projet JS en TS d'un coup en mettant `any` partout pour taire le compilateur. Tu n'as gagné aucune sécurité : tu as juste ajouté du bruit.

## EXERCICE-CHARNIÈRE (5 min chrono)

Prends `function add(a, b) { return a + b }`. Ajoute des types. Sans regarder : que se passe-t-il si tu appelles `add("1", 2)` en JS ? En TS strict ? Réponse : `"12"` en JS, erreur de compilation en TS. `14_typescript/01_type_basics.md`.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise beaucoup d'apprenants. Aucune honte à revenir.
