## CONTEXTE

Entre Server et Client Components, tout ce qui passe doit être sérialisable. Une fonction ou une `Map` dans les props casse le rendu.

## APPLICATION

- Essaie de passer une `Map` ou une fonction en prop d'un composant `"use client"` : lis l'erreur.
- Corrige en passant des données simples et en gardant la logique côté serveur.
- Note la règle de frontière en commentaire.

## Vérification

Quelles valeurs peuvent franchir la frontière serveur → client, et pourquoi cette limite existe-t-elle ?

##Ta frontière de sérialisation est comprise

Tu ne subiras plus les erreurs de props non sérialisables. Commit.
