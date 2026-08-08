## TYPE

Projet fil rouge

## Niveau

🗸 Fondamental

## CONTEXTE

Un composant React est une fonction : entrées (props) → sortie (JSX). Bien découper tes fonctions, c'est déjà bien découper ton portfolio.

## OBJECTIF

Ta première carte projet est à l'écran.

## APPLICATION

- Crée `components/ProjectCard.jsx` exportant un composant fonction qui reçoit un titre et une année.
- Ne mets aucune logique dans le JSX : extrais tout calcul (par ex. le libellé d'année) dans une petite fonction au-dessus.
- Affiche trois cartes en dur dans `app/page.tsx`.

## Critère de réussite

- [ ] Crée `components/ProjectCard.jsx` exportant un composant fonction qui reçoit un titre et une année.
- [ ] Ne mets aucune logique dans le JSX.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Qu'est-ce qui distingue une fonction React « composant » d'une fonction utilitaire ordinaire ?

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

Dans ce scénario, tu as vérifié que : ta première carte projet est à l'écran.

`ProjectCard` est un vrai composant du portfolio, pas un exercice : il portera les six projets du catalogue. Commit ce fichier.
