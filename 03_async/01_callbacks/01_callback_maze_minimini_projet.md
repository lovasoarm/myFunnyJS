## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

Les callbacks sont partout en React : `onClick`, `onChange`, callbacks d'observers. Mal nommés ou imbriqués, ils rendent un composant illisible.

## OBJECTIF

Ta carte projet est devenue réutilisable.

## APPLICATION

- Dans ta rangée de projets, remplace les handlers anonymes en ligne par des fonctions nommées déclarées dans le composant.
- Passe un callback `onSelect` en prop de `ProjectCard` au lieu de gérer l'ouverture de la modale dans la carte.
- Vérifie que `ProjectCard` ne connaît plus la modale.

## Critère de réussite

- [ ] Dans ta rangée de projets, remplace les handlers anonymes en ligne par des fonctions nommées déclarées dans le composant.
- [ ] Passe un callback `onSelect` en prop de `ProjectCard` au lieu de gérer l'ouverture de la modale dans la carte.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi la carte ne doit-elle pas savoir ce qui se passe quand on clique dessus ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta carte projet est devenue réutilisable.

Inversion de contrôle réussie : la carte est utilisable dans n'importe quelle rangée. Commit.
