## TYPE

Projet fil rouge

## Niveau

🗸 Fondamental

## CONTEXTE

Une factory produit des fonctions préconfigurées. Pour un portfolio à rangées multiples (« Continuer », « Backend », « Tous »), une factory de filtres évite six fonctions quasi identiques.

## OBJECTIF

Tes rangées se génèrent toutes seules.

## APPLICATION

- Écris `makeRowFilter(rowName)` qui retourne une fonction prête à filtrer un tableau de projets.
- Utilise-la pour construire deux rangées différentes sur la page d'accueil.
- Range-la dans `lib/projects.js`.

## Critère de réussite

- [ ] Écris `makeRowFilter(rowName)` qui retourne une fonction prête à filtrer un tableau de projets.
- [ ] Utilise-la pour construire deux rangées différentes sur la page d'accueil.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Qu'est-ce que la fonction retournée « se souvient » du paramètre `rowName` ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Garde-fou

Avant de modifier le projet fil rouge :

1. Vérifie que le projet fonctionne.
2. Fais une modification minimale.
3. Vérifie le comportement demandé.
4. Lance les tests/build disponibles.
5. Ne supprime pas une fonctionnalité existante pour satisfaire l'exercice.
6. Si l'expérience est volontairement destructive, fais-la dans `scratch/` ou dans une branche dédiée.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes rangées se génèrent toutes seules.

Ajouter une rangée coûte maintenant une ligne. Commit `projects.js` : tu viens de rendre le catalogue extensible.
