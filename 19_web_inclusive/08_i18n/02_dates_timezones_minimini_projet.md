## TYPE

Micro-drill

## Niveau

🗸 Intermédiaire

## CONTEXTE

Les années et dates de projets doivent s'afficher selon la locale, sans écart entre rendu serveur et client : cause classique d'erreur d'hydratation. Le mécanisme est précis : l'erreur survient quand une valeur dépendant de la locale ou du fuseau horaire est calculée différemment côté serveur et côté client. Règle : ne génère pas une telle valeur différemment des deux côtés.

## APPLICATION

- Remplace tout formatage de date manuel par `Intl.DateTimeFormat` avec une locale explicite.
- Vérifie qu'aucun `new Date()` sans argument n'est utilisé pendant le rendu.
- Identifie explicitement, pour chaque date affichée : la donnée source, la locale, le fuseau, le moment du formatage.
- Teste une date autour de minuit ou d'un changement de fuseau pour rendre le bug observable.
- Recharge la page plusieurs fois : aucun avertissement d'hydratation ne doit apparaître.

## Critère de réussite

- [ ] Remplace tout formatage de date manuel par `Intl.DateTimeFormat` avec une locale explicite.
- [ ] Vérifie qu'aucun `new Date()` sans argument n'est utilisé pendant le rendu.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi une date formatée sans locale explicite peut-elle différer entre serveur et navigateur ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes dates sont stables et localisées.

Un bug d'hydratation classique est évité dans les cas testés ici. Commit.
