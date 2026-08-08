## TYPE

Micro-drill

## Niveau

🗸 Fondamental

## Prérequis

- Connaître `useState`

## CONTEXTE

Muter un objet en place, c'est invisible pour React : sans nouvelle référence, pas de re-render. Ton futur filtre de catalogue en dépend directement.

## APPLICATION

- Dans un composant client, mets un tableau de projets dans un `useState`.
- Ajoute un bouton qui fait `projects.push(...)` puis `setProjects(projects)` : constate que rien ne se réaffiche.
- Corrige en construisant un nouveau tableau.
- Note en commentaire la règle : nouvelle donnée = nouvelle référence.

## Critère de réussite

- [ ] Dans un composant client, mets un tableau de projets dans un `useState`.
- [ ] Ajoute un bouton qui fait `projects.push(...)` puis `setProjects(projects)`.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi React ne « voit » pas un `push` alors que la donnée a bien changé ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton state React réagit vraiment.

Tu tiens la règle qui gouvernera tous les états du portfolio : filtres, recherche, favoris. Montre ce mini-exemple à quelqu'un en 2 minutes : s'il comprend, tu as compris.
