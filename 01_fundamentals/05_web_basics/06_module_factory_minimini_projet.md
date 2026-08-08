## CONTEXTE

Un module bien découpé expose peu et cache beaucoup. `lib/projects.js` doit exposer des fonctions de sélection, pas son tableau interne partout.

## APPLICATION

- Regroupe dans `lib/projects.js` : `getAllProjects`, `getProjectBySlug`, `getProjectsByCategory`.
- Fais en sorte que les composants n'importent plus jamais `data/projects.js` directement.
- Vérifie en cherchant les imports restants dans le projet.

## Vérification

Quel avantage obtiens-tu le jour où tes projets viendront d'un CMS au lieu d'un fichier ?

## 🎬 Ta couche d'accès aux données est fermée

Tu as une frontière nette entre données et affichage : c'est le genre de choix qu'on remarque en revue de code. Commit.
