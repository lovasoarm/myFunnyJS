## CONTEXTE

Une variable, c'est une étiquette posée sur une valeur. Le portfolio Lovasoa commence exactement là : avant tout composant, il faut nommer les données du site (nom, métier, projets). Un nom flou aujourd'hui = un refactor douloureux au module 4.

## APPLICATION

- Crée le dossier `data/` à la racine de ton projet Next.js.
- Dans `data/personal.js`, déclare une variable exportée `personalInfo` qui contient tes informations personnelles : `name`, `alias`, `role`, `location`, `email`.
- Importe-la dans `app/page.tsx` et affiche uniquement le `name` dans un `<h1>`.
- Renomme ensuite ta variable pour qu'elle décrive la donnée, pas son usage (`personalInfo`, pas `data1`).

## Vérification

Pourquoi mettre ces informations dans une variable exportée plutôt que de les écrire en dur dans le JSX de la page ?

##Ton nom s'affiche depuis une source unique

Tu viens de créer la première source de vérité du portfolio : `data/personal.js`. Chaque page qui parlera de toi lira ce fichier, jamais du texte recopié. C'est la brique sur laquelle les 5 modules suivants s'appuient. Commit ce fichier.
