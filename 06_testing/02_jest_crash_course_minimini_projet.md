## TYPE

Projet fil rouge

## Niveau

🗸 Intermédiaire

## CONTEXTE

Installer, configurer, lancer : un test qui ne tourne pas en une commande ne sera jamais lancé. Sur Next.js en JavaScript, la config compte autant que les assertions.

## OBJECTIF

Une commande, tous tes tests.

## APPLICATION

- Installe et configure un lanceur de tests compatible avec ton projet (Jest ou Vitest : choisis-en un et note pourquoi).
- Ajoute le script `test` dans `package.json`.
- Fais passer tes tests de `slugify` avec cette commande unique.

## Critère de réussite

- [ ] Installe et configure un lanceur de tests compatible avec ton projet (Jest ou Vitest.
- [ ] Ajoute le script `test` dans `package.json`.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi la config de ton lanceur de tests diffère-t-elle de celle du build Next ?

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

Dans ce scénario, tu as vérifié que : une commande, tous tes tests.

`npm test` fonctionne : la barrière d'entrée est tombée, tu écriras des tests. Commit la config.
