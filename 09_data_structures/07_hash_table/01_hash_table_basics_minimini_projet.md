## TYPE

Mini-projet

## Niveau

🗸 Intermédiaire

## CONTEXTE

Chercher un projet par slug dans un tableau coûte O(n) dans le cas général. Une `Map` offre en moyenne un accès en O(1), sous les hypothèses habituelles de son implémentation (le module dédié à la complexité précise ce raisonnement).

## OBJECTIF

Ta recherche par slug est directe.

## APPLICATION

- Construis une `Map` slug → projet une seule fois au niveau module.
- Réécris `getProjectBySlug` pour l'utiliser.
- Vérifie qu'une clé absente renvoie bien le cas « introuvable » traité au module 5.

## Critère de réussite

- [ ] Construis une `Map` slug → projet une seule fois au niveau module.
- [ ] Réécris `getProjectBySlug` pour l'utiliser.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Sur six projets le gain de performance est nul : quelle est alors la vraie raison d'utiliser une `Map` ici ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta recherche par slug est directe.

Le code exprime maintenant « index par slug » au lieu de « parcours du tableau ». Commit.
