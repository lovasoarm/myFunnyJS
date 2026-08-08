## CONTEXTE

Chercher un projet par slug dans un tableau est linéaire ; une `Map` le fait en temps constant et rend le code plus clair.

## APPLICATION

- Construis une `Map` slug → projet une seule fois au niveau module.
- Réécris `getProjectBySlug` pour l'utiliser.
- Vérifie qu'une clé absente renvoie bien le cas « introuvable » traité au module 5.

## Vérification

Sur six projets le gain de performance est nul : quelle est alors la vraie raison d'utiliser une `Map` ici ?

##Ta recherche par slug est directe

Le code exprime maintenant « index par slug » au lieu de « parcours du tableau ». Commit.
