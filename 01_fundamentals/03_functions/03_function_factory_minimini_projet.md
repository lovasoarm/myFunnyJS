## CONTEXTE

Une factory produit des fonctions préconfigurées. Pour un portfolio à rangées multiples (« Continuer », « Backend », « Tous »), une factory de filtres évite six fonctions quasi identiques.

## APPLICATION

- Écris `makeRowFilter(rowName)` qui retourne une fonction prête à filtrer un tableau de projets.
- Utilise-la pour construire deux rangées différentes sur la page d'accueil.
- Range-la dans `lib/projects.js`.

## Vérification

Qu'est-ce que la fonction retournée « se souvient » du paramètre `rowName` ?

##Tes rangées se génèrent toutes seules

Ajouter une rangée coûte maintenant une ligne. Commit `projects.js` : tu viens de rendre le catalogue extensible.
