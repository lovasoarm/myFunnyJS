## TYPE

Projet fil rouge

## Niveau

🗸 Fondamental

## CONTEXTE

Un module bien découpé expose peu et cache beaucoup. `lib/projects.js` doit exposer des fonctions de sélection, pas son tableau interne partout.

## OBJECTIF

Ta couche d'accès aux données est fermée.

## APPLICATION

- Regroupe dans `lib/projects.js` : `getAllProjects`, `getProjectBySlug`, `getProjectsByCategory`.
- Fais en sorte que les composants n'importent plus jamais `data/projects.js` directement.
- Vérifie en cherchant les imports restants dans le projet.

## Critère de réussite

- [ ] Regroupe dans `lib/projects.js`.
- [ ] Fais en sorte que les composants n'importent plus jamais `data/projects.js` directement.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quel avantage obtiens-tu le jour où tes projets viendront d'un CMS au lieu d'un fichier ?

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

Dans ce scénario, tu as vérifié que : ta couche d'accès aux données est fermée.

Tu as une frontière nette entre données et affichage : c'est le genre de choix qu'on remarque en revue de code. Commit.
