## CONTEXTE

Valider une saisie utilisateur côté client, c'est du confort ; mal la valider, c'est une fausse sécurité. Le formulaire de contact du portfolio en a besoin.

## APPLICATION

- Dans le formulaire de contact, écris une validation d'email par regex volontairement trop stricte, puis teste-la avec une adresse valide qu'elle rejette.
- Remplace-la par une validation permissive + le type `email` natif du champ.
- Note en commentaire pourquoi une regex d'email « parfaite » est une mauvaise idée.

## Vérification

Contre quoi une validation regex côté client ne protège-t-elle absolument pas ?

## 🎬 Ton formulaire valide sans frustrer

Tu as évité le classique « mon adresse est refusée » qui fait fuir un recruteur. Commit le formulaire.
