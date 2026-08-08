## TYPE

Micro-drill

## Niveau

🗸 Fondamental

## CONTEXTE

Les primitives et les objets n'ont pas le même comportement de stockage et de référence observable. Pour comprendre les copies, raisonne surtout en termes de valeur et de référence plutôt qu'en supposant une implémentation précise de la mémoire. Ton tableau `projects` est un objet : le passer à un composant ne le copie pas. C'est exactement ce qui décide si un filtre casse ou non tes données d'origine.

## APPLICATION

- Dans `scratch.js`, crée un tableau de 3 objets projets simplifiés.
- Copie-le avec `=`, modifie un titre dans la copie, affiche l'original.
- Recommence avec une copie superficielle (`[...projects]`) puis une copie profonde (`structuredClone`).
- Écris en commentaire quel niveau de copie protège quoi.

## Critère de réussite

- [ ] Dans `scratch.js`, crée un tableau de 3 objets projets simplifiés.
- [ ] Copie-le avec `=`, modifie un titre dans la copie, affiche l'original.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Après `[...projects]`, pourquoi modifier `copie[0].title` change-t-il quand même l'original ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tu sais où vivent tes données.

Tu viens de comprendre pourquoi ton futur filtre « par `category` » ne doit jamais muter `projects`. Cette intuition te fera gagner une soirée de debug au module 4.
