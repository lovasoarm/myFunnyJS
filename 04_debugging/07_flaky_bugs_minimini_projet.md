## CONTEXTE

Un bug intermittent a presque toujours une cause temporelle : hydratation, course réseau, animation. Ton splash et ta recherche en sont des candidats.

## APPLICATION

- Recharge ta page d'accueil 20 fois de suite en réseau throttlé et note toute différence d'affichage.
- Cherche une erreur d'hydratation dans la console.
- Identifie la valeur non déterministe en cause (date, aléatoire, stockage local) et rends-la stable.

## Vérification

Quelle valeur de ton rendu n'était pas identique entre serveur et client ?

##Ton rendu est déterministe

Les avertissements d'hydratation ont disparu : ton site est stable au rechargement. Commit.
