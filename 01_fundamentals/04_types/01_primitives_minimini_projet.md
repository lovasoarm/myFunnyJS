## CONTEXTE

Avant de typer avec TypeScript, il faut savoir ce que JavaScript manipule vraiment : string, number, boolean, null, undefined. Le champ `rating` de tes projets est un `number` borné de 1 à 5, et `featured` un vrai `boolean` : pas un hasard.

## APPLICATION

- Liste chaque champ d'un projet du cahier des charges et note à côté son type primitif réel.
- Repère les champs qui peuvent légitimement être absents (`github`, `demo`).
- Écris ces observations en commentaire en tête de `data/projects.js`.

## Vérification

Quelle différence de sens fais-tu entre `null` et `undefined` pour le champ `github` ?

##Ton modèle de données est cartographié

Tu as la carte exacte de ton type `Project` avant même de l'écrire. C'est ce qui rendra le module TypeScript facile.
