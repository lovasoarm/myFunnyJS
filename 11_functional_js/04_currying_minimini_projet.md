## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

Currying : transformer `f(a, b)` en `f(a)(b)`. Utile pour préconfigurer un filtre de `category` réutilisé dans plusieurs rangées.

## OBJECTIF

Ton filtre générique est en place.

## APPLICATION

- Écris `filterBy(champ)(valeur)(projects)`.
- Utilise-la pour créer `filterByCategory` et `filterByStatus` sans dupliquer la logique.
- Emploie-les sur la page d'accueil.

## Critère de réussite

- [ ] Écris `filterBy(champ)(valeur)(projects)`.
- [ ] Utilise-la pour créer `filterByCategory` et `filterByStatus` sans dupliquer la logique.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

En quoi le currying diffère-t-il d'une fonction à paramètres par défaut ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton filtre générique est en place.

Un seul filtre couvre tous les champs du catalogue. Commit.
