## CONTEXTE

Enchaîner des promesses, c'est décider ce qui dépend de quoi. Deux appels indépendants doivent partir en parallèle, pas l'un après l'autre.

## APPLICATION

- Ajoute un second appel réseau (par ex. les derniers commits) à côté du premier.
- Écris-les d'abord en séquence, mesure le temps.
- Réécris avec `Promise.all`, mesure à nouveau.
- Gère le cas où l'un des deux échoue sans faire tomber l'autre.

## Vérification

Quand `Promise.all` est-il le mauvais choix, et par quoi le remplaces-tu ?

##Tes appels réseau partent en parallèle

Tu as réduit le temps de rendu serveur de ta page d'accueil, mesuré. Commit.
