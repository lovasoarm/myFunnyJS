## CONTEXTE

Un composant React est une fonction : entrées (props) → sortie (JSX). Bien découper tes fonctions, c'est déjà bien découper ton portfolio.

## APPLICATION

- Crée `components/ProjectCard.jsx` exportant un composant fonction qui reçoit un titre et une année.
- Ne mets aucune logique dans le JSX : extrais tout calcul (par ex. le libellé d'année) dans une petite fonction au-dessus.
- Affiche trois cartes en dur dans `app/page.tsx`.

## Vérification

Qu'est-ce qui distingue une fonction React « composant » d'une fonction utilitaire ordinaire ?

##Ta première carte projet est à l'écran

`ProjectCard` est un vrai composant du portfolio, pas un exercice : il portera les six projets du catalogue. Commit ce fichier.
