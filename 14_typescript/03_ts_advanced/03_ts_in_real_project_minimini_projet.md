## TYPE

Projet fil rouge

## Niveau

🗸 Avancé

## CONTEXTE

Objectif : minimiser les contournements du système de types, pas atteindre artificiellement zéro `as`. Une assertion de type peut être légitime ; ce qui compte est de savoir la justifier.

## OBJECTIF

Ton portfolio compile sans contournement inutile du système de types.

## APPLICATION

- Recherche `any`, `@ts-ignore`, `@ts-expect-error` et les assertions `as` dans tout le projet (`app/`, `components/`, `lib/`, `data/`, `types/`).
- Pour chaque occurrence, détermine si elle est réellement nécessaire.
- Supprime les usages évitables.
- Justifie les exceptions restantes dans la documentation (`docs/typescript.md`) plutôt que par des commentaires dispersés dans le code.
- Fais passer le build TypeScript sans erreur.

## Critère de réussite

- [ ] Recherche `any`, `@ts-ignore`, `@ts-expect-error` et les assertions `as` dans tout le projet (`app/`, `components/`, `lib/`, `data/`, `types/`).
- [ ] Pour chaque occurrence, détermine si elle est réellement nécessaire.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quel `as` restait-il, et qu'est-ce qu'il masquait réellement ?

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

Dans ce scénario, tu as vérifié que : ton portfolio compile sans contournement inutile du système de types.

Un dépôt TypeScript propre de bout en bout : c'est vérifiable en 30 secondes par un recruteur. Commit.
