## TYPE

Micro-drill

## Niveau

🗸 Fondamental

## CONTEXTE

Avant de typer avec TypeScript, il faut savoir ce que JavaScript manipule vraiment : string, number, boolean, null, undefined. Le champ `rating` de tes projets est un `number` borné de 1 à 5, et `featured` un vrai `boolean` : pas un hasard.

## APPLICATION

- Liste chaque champ d'un projet du cahier des charges et note à côté son type primitif réel.
- Repère les champs qui peuvent légitimement être absents (`github`, `demo`).
- Écris ces observations en commentaire en tête de `data/projects.js`.

## Critère de réussite

- [ ] Liste chaque champ d'un projet du cahier des charges et note à côté son type primitif réel.
- [ ] Repère les champs qui peuvent légitimement être absents (`github`, `demo`).
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelle différence de sens fais-tu entre `null` et `undefined` pour le champ `github` ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton modèle de données est cartographié.

Tu as la carte exacte de ton type `Project` avant même de l'écrire. C'est ce qui rendra le module TypeScript facile.
