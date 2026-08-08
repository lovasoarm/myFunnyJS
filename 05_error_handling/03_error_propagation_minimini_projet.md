## TYPE

Projet fil rouge

## Niveau

🗸 Intermédiaire

## CONTEXTE

Décider où l'erreur s'arrête : la couche données la remonte, la couche UI la traduit. Mélanger les deux produit des messages incompréhensibles.

## OBJECTIF

Tes erreurs remontent proprement.

## APPLICATION

- Trace le chemin d'une erreur de fetch depuis `lib/` jusqu'au composant.
- Fais en sorte que `lib/` ne rende jamais de JSX et que le composant n'affiche jamais un message technique brut.
- Écris le message destiné au visiteur.

## Critère de réussite

- [ ] Trace le chemin d'une erreur de fetch depuis `lib/` jusqu'au composant.
- [ ] Fais en sorte que `lib/` ne rende jamais de JSX et que le composant n'affiche jamais un message technique brut.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelle couche connaît la cause, et quelle couche connaît le bon message ?

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

Dans ce scénario, tu as vérifié que : tes erreurs remontent proprement.

Le visiteur lit une phrase humaine, toi tu gardes la cause technique dans les logs. Commit.
