## CONTEXTE

Où vit l'état : URL, serveur, composant, stockage. Mal placé, il crée des bugs de partage de lien et de retour arrière.

## APPLICATION

- Pour ton filtre et ton tri, décide de porter l'état dans les paramètres d'URL plutôt que dans un `useState`.
- Implémente-le et vérifie qu'un lien filtré se partage et survit au rechargement.
- Vérifie que le bouton retour du navigateur fonctionne.

## Vérification

Quels états de ton site méritent l'URL, et lesquels doivent rester locaux ?

## 🎬 Tes filtres sont partageables par URL

Un visiteur peut envoyer « regarde mes projets backend » en un lien. Commit.
