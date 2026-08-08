## TYPE

Projet fil rouge

## Niveau

🗸 Intermédiaire

## CONTEXTE

Typer les entrées/sorties des fonctions de `lib/` transforme la doc en garantie. Un mauvais argument devient impossible à écrire.

## OBJECTIF

Ta couche lib est entièrement typée.

## APPLICATION

- Type toutes les signatures de `lib/projects.ts` et `lib/format.ts`.
- Type explicitement les valeurs de retour, sans t'appuyer sur l'inférence.
- Type les props de `ProjectCard` et supprime tout `any` restant.

## Critère de réussite

- [ ] Type toutes les signatures de `lib/projects.ts` et `lib/format.ts`.
- [ ] Type explicitement les valeurs de retour, sans t'appuyer sur l'inférence.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi expliciter le type de retour d'une fonction exportée alors que TypeScript sait l'inférer ?

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

Dans ce scénario, tu as vérifié que : ta couche lib est entièrement typée.

L'autocomplétion travaille pour toi dans tout le projet. Commit.
