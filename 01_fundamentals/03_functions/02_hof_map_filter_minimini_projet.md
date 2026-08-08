## CONTEXTE

`map` et `filter` sont le moteur de rendu d'un catalogue Netflix : une liste de données → une liste de cartes, filtrée par catégorie.

## APPLICATION

- Dans `data/projects.js`, écris un tableau de tes six projets (ZO, Hotelia, MyFunnyJS, Safe-driving, RECIPLY, Lovasoa) avec au minimum `id`, `title`, `category`, `year`, `featured`.
- Dans `app/page.tsx`, rends une rangée en filtrant sur `category` (et une autre sur `featured`) puis en mappant vers `<ProjectCard />`.
- Ajoute la `key` correcte sur chaque élément rendu.

## Vérification

Pourquoi `key` doit-elle être l'id du projet et jamais l'index du tableau ?

##Ta première rangée Netflix est vivante

Le catalogue existe : tes six projets sortent d'une donnée typée et non de HTML recopié. Commit ce fichier, c'est le cœur du site.
