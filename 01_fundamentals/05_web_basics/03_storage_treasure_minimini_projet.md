## TYPE

Mini-projet

## Niveau

🗸 Fondamental

## CONTEXTE

`localStorage` permet la rangée « Continuer à regarder » : se souvenir des projets déjà consultés. C'est du navigateur pur, donc du client, donc à protéger du rendu serveur.

## OBJECTIF

La rangée « Continuer à regarder » est réelle.

## APPLICATION

- Écris un hook `useRecentlyViewed` qui lit et écrit une liste d'ids dans `localStorage`.
- Appelle-le depuis la page détail d'un projet pour enregistrer la visite.
- Lis-le sur l'accueil pour construire la rangée « Continuer à regarder ».
- Assure-toi que l'accès au stockage se fait uniquement après montage.

## Critère de réussite

- [ ] Écris un hook `useRecentlyViewed` qui lit et écrit une liste d'ids dans `localStorage`.
- [ ] Appelle-le depuis la page détail d'un projet pour enregistrer la visite.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Que se passe-t-il si tu lis `localStorage` pendant le rendu serveur, et comment l'évites-tu ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : la rangée « Continuer à regarder » est réelle.

Ton portfolio se souvient du visiteur : c'est LA touche Netflix du projet. Commit ce hook.
