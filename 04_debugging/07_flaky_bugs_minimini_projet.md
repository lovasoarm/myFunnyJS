## TYPE

Micro-drill

## Niveau

🗸 Intermédiaire

## CONTEXTE

Un bug intermittent a presque toujours une cause temporelle : hydratation, course réseau, animation. Ton splash et ta recherche en sont des candidats.

## APPLICATION

- Recharge ta page d'accueil 20 fois de suite en réseau throttlé et note toute différence d'affichage.
- Cherche une erreur d'hydratation dans la console.
- Identifie la valeur non déterministe en cause (date, aléatoire, stockage local) et rends-la stable.

## Critère de réussite

- [ ] Recharge ta page d'accueil 20 fois de suite en réseau throttlé et note toute différence d'affichage.
- [ ] Cherche une erreur d'hydratation dans la console.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelle valeur de ton rendu n'était pas identique entre serveur et client ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton rendu est déterministe.

Les avertissements d'hydratation ont disparu : ton site est stable au rechargement. Commit.
