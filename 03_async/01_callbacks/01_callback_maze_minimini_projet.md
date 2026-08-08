## CONTEXTE

Les callbacks sont partout en React : `onClick`, `onChange`, callbacks d'observers. Mal nommés ou imbriqués, ils rendent un composant illisible.

## APPLICATION

- Dans ta rangée de projets, remplace les handlers anonymes en ligne par des fonctions nommées déclarées dans le composant.
- Passe un callback `onSelect` en prop de `ProjectCard` au lieu de gérer l'ouverture de la modale dans la carte.
- Vérifie que `ProjectCard` ne connaît plus la modale.

## Vérification

Pourquoi la carte ne doit-elle pas savoir ce qui se passe quand on clique dessus ?

## 🎬 Ta carte projet est devenue réutilisable

Inversion de contrôle réussie : la carte est utilisable dans n'importe quelle rangée. Commit.
