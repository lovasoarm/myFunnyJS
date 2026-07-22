---
stability: intemporel
---

# PONT : de prouver du code à raisonner sur les nombres à les bases mathématiques

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `06_testing` et `07_math_basics`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de nature.

## POURQUOI CE PONT EXISTE

Tester `add(2, 3) === 5`, c'est facile. Tester `add(0.1, 0.2)`, tu découvres IEEE 754. `07_math_basics/` te donne les outils pour ne pas écrire de tests qui mentent sur des flottants, du modulo, ou du bit twiddling.

## CE QUE TU MAÎTRISES DÉJÀ

- Écrire un test AAA lisible.
- Isoler une dépendance avec un fake.
- Nommer un edge case avant de l'implémenter.

## VOCABULAIRE NOUVEAU QUI ARRIVE

- **IEEE 754** : la norme des flottants, source de `0.1 + 0.2 !== 0.3`.
- **Modulo signé** : `(-1) % 3` peut valoir `-1` ou `2` selon le langage.
- **Bit mask** : sélectionner ou toggler des flags.
- **Hash** : une empreinte, jamais un identifiant réversible.

## LE PIÈGE MENTAL TYPIQUE DU SAUT

Croire que `Math.random()` est cryptographiquement sûr. Il ne l'est pas. Un jeton de session généré comme ça est cassable en secondes.

## EXERCICE-CHARNIÈRE (5 min chrono)

Quelle valeur affiche `console.log(0.1 + 0.2 === 0.3)` ? Pourquoi ? Écris un helper `approxEqual(a, b, eps)` en 3 lignes. Bonne réponse en tête ? Passe à `07_math_basics/`. Sinon, prends 15 min pour comprendre IEEE 754 d'abord.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise beaucoup d'apprenants. Aucune honte à revenir.
