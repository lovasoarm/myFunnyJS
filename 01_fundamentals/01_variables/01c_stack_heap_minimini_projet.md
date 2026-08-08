## CONTEXTE

Primitives en pile, objets et tableaux dans le tas. Ton tableau `projects` est un objet : le passer à un composant ne le copie pas. C'est exactement ce qui décide si un filtre casse ou non tes données d'origine.

## APPLICATION

- Dans `scratch.js`, crée un tableau de 3 objets projets simplifiés.
- Copie-le avec `=`, modifie un titre dans la copie, affiche l'original.
- Recommence avec une copie superficielle (`[...projects]`) puis une copie profonde (`structuredClone`).
- Écris en commentaire quel niveau de copie protège quoi.

## Vérification

Après `[...projects]`, pourquoi modifier `copie[0].title` change-t-il quand même l'original ?

##Tu sais où vivent tes données

Tu viens de comprendre pourquoi ton futur filtre « par `category` » ne doit jamais muter `projects`. Cette intuition te fera gagner une soirée de debug au module 4.
