## TYPE

Projet fil rouge

## Niveau

🗸 Fondamental

## CONTEXTE

`map` et `filter` sont le moteur de rendu d'un catalogue Netflix : une liste de données → une liste de cartes, filtrée par catégorie.

## OBJECTIF

Ta première rangée Netflix est vivante.

## APPLICATION

- Dans `data/projects.js`, écris un tableau de tes six projets (ZO, Hotelia, MyFunnyJS, Safe-driving, RECIPLY, Lovasoa) avec au minimum `id`, `title`, `category`, `year`, `featured`.
- Dans `app/page.tsx`, rends une rangée en filtrant sur `category` (et une autre sur `featured`) puis en mappant vers `<ProjectCard />`.
- Ajoute la `key` correcte sur chaque élément rendu.

## Critère de réussite

- [ ] Dans `app/page.tsx`, rends une rangée en filtrant sur `category` (et une autre sur `featured`) puis en mappant vers `<ProjectCard />`.
- [ ] Ajoute la `key` correcte sur chaque élément rendu.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi `key` doit-elle être l'id du projet et jamais l'index du tableau ?

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

Dans ce scénario, tu as vérifié que : ta première rangée Netflix est vivante.

Le catalogue existe : tes six projets sortent d'une donnée typée et non de HTML recopié. Commit ce fichier, c'est le cœur du site.
