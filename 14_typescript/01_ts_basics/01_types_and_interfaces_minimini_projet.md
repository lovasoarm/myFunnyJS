## TYPE

Projet fil rouge

## Niveau

🗸 Intermédiaire

## CONTEXTE

C'est le moment central du portfolio : écrire les types `Project` et `PersonalInfo` du cahier des charges. Tout le reste du site en dépendra.

## OBJECTIF

Le type Project du cahier des charges existe.

## APPLICATION

- Crée `types/index.ts` (à la racine du projet, pas sous `src/`) et déclare d'abord les deux unions littérales : `ProjectStatus` (`'completed' | 'in-progress' | 'concept'`) et `ProjectCategory` (`'web' | 'mobile' | 'ux' | 'open-source' | 'backend'`).
- Déclare `interface Project` avec exactement ces champs : `id`, `slug`, `title`, `tagline`, `description` (string), `category: ProjectCategory`, `status: ProjectStatus`, `year: number`, `duration: string`, `stack: string[]`, `github?: string`, `demo?: string`, `thumbnail: string`, `featured: boolean`, `rating: number` (1 à 5, commente la contrainte).
- Déclare `interface PersonalInfo` avec : `name`, `alias`, `role`, `bio`, `location`, `email`, `github`, `linkedin` : tous en `string`.
- Applique `Project[]` à `data/projects.ts` et `PersonalInfo` à tes infos personnelles, puis corrige toutes les erreurs remontées.

## Critère de réussite

- [ ] Déclare `interface PersonalInfo` avec.
- [ ] Applique `Project[]` à `data/projects.ts` et `PersonalInfo` à tes infos personnelles, puis corrige toutes les erreurs remontées.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelle erreur TypeScript t'a révélé une incohérence que tu n'avais pas vue ?

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

Dans ce scénario, tu as vérifié que : le type Project du cahier des charges existe.

C'est la brique n°1 de tout le portfolio : chaque composant s'y adossera désormais. Commit ce fichier.
