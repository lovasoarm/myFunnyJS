## CONTEXTE

Currying : transformer `f(a, b)` en `f(a)(b)`. Utile pour préconfigurer un filtre de `category` réutilisé dans plusieurs rangées.

## APPLICATION

- Écris `filterBy(champ)(valeur)(projects)`.
- Utilise-la pour créer `filterByCategory` et `filterByStatus` sans dupliquer la logique.
- Emploie-les sur la page d'accueil.

## Vérification

En quoi le currying diffère-t-il d'une fonction à paramètres par défaut ?

## 🎬 Ton filtre générique est en place

Un seul filtre couvre tous les champs du catalogue. Commit.
