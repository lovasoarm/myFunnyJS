## CONTEXTE

Les années et dates de projets doivent s'afficher selon la locale, sans écart entre rendu serveur et client : cause classique d'erreur d'hydratation.

## APPLICATION

- Remplace tout formatage de date manuel par `Intl.DateTimeFormat` avec une locale explicite.
- Vérifie qu'aucun `new Date()` sans argument n'est utilisé pendant le rendu.
- Recharge la page plusieurs fois : aucun avertissement d'hydratation ne doit apparaître.

## Vérification

Pourquoi une date formatée sans locale explicite peut-elle différer entre serveur et navigateur ?

##Tes dates sont stables et localisées

Un bug d'hydratation classique est éliminé avant même d'apparaître. Commit.
