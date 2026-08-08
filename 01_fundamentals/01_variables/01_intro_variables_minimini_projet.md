## TYPE

Projet fil rouge

## Niveau

🗸 Fondamental

## CONTEXTE

Une variable, c'est une étiquette posée sur une valeur. Le portfolio Lovasoa commence exactement là : avant tout composant, il faut nommer les données du site (nom, métier, projets). Un nom flou aujourd'hui = un refactor douloureux au module 4.

Cette implémentation en JavaScript est volontaire. Elle sera progressivement typée et migrée vers TypeScript dans le module 14.

## OBJECTIF

Ton nom s'affiche depuis une source unique.

## APPLICATION

- Crée le dossier `data/` à la racine de ton projet Next.js.
- Dans `data/personal.js`, déclare une variable exportée `personalInfo` qui contient tes informations personnelles : `name`, `alias`, `role`, `location`, `email`.
- Importe-la dans `app/page.tsx` et affiche uniquement le `name` dans un `<h1>`.
- Renomme ensuite ta variable pour qu'elle décrive la donnée, pas son usage (`personalInfo`, pas `data1`).

## Critère de réussite

- [ ] Crée le dossier `data/` à la racine de ton projet Next.js.
- [ ] Importe-la dans `app/page.tsx` et affiche uniquement le `name` dans un `<h1>`.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi mettre ces informations dans une variable exportée plutôt que de les écrire en dur dans le JSX de la page ?

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

Dans ce scénario, tu as vérifié que : ton nom s'affiche depuis une source unique.

Tu viens de créer la première source de vérité du portfolio : `data/personal.js`. Chaque page qui parlera de toi lira ce fichier, jamais du texte recopié. C'est la brique sur laquelle les 5 modules suivants s'appuient. Commit ce fichier.
