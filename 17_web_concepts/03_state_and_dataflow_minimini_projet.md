## TYPE

Micro-drill

## Niveau

🗸 Intermédiaire

## Prérequis

- Connaître `useState`

## CONTEXTE

Où vit l'état : URL, serveur, composant, stockage. Mal placé, il crée des bugs de partage de lien et de retour arrière.

## APPLICATION

- Pour ton filtre et ton tri, décide de porter l'état dans les paramètres d'URL plutôt que dans un `useState`.
- Implémente-le et vérifie qu'un lien filtré se partage et survit au rechargement.
- Vérifie que le bouton retour du navigateur fonctionne.

## Critère de réussite

- [ ] Pour ton filtre et ton tri, décide de porter l'état dans les paramètres d'URL plutôt que dans un `useState`.
- [ ] Implémente-le et vérifie qu'un lien filtré se partage et survit au rechargement.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quels états de ton site méritent l'URL, et lesquels doivent rester locaux ?

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes filtres sont partageables par URL.

Un visiteur peut envoyer « regarde mes projets backend » en un lien. Commit.
