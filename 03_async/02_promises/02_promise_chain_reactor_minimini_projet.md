## TYPE

Micro-drill

## Niveau

🗸 Intermédiaire

## CONTEXTE

Enchaîner des promesses, c'est décider ce qui dépend de quoi. Deux appels indépendants doivent partir en parallèle, pas l'un après l'autre.

## APPLICATION

- Ajoute un second appel réseau (par ex. les derniers commits) à côté du premier.
- Écris-les d'abord en séquence, mesure le temps.
- Réécris avec `Promise.all`, mesure à nouveau.
- Gère le cas où l'un des deux échoue sans faire tomber l'autre.

## Critère de réussite

- [ ] Ajoute un second appel réseau (par ex. les derniers commits) à côté du premier.
- [ ] Écris-les d'abord en séquence, mesure le temps.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quand `Promise.all` est-il le mauvais choix, et par quoi le remplaces-tu ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes appels réseau partent en parallèle.

Tu as réduit le temps de rendu serveur de ta page d'accueil, mesuré. Commit.
