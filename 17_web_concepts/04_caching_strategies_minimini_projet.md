## TYPE

Micro-drill

## Niveau

🗸 Avancé

## Prérequis

- Connaître la frontière Server / Client de l'App Router Next.js

## CONTEXTE

Le cache décide de la fraîcheur et de la vitesse. Dans l'App Router, le choix statique / revalidé / dynamique se fait route par route.

## APPLICATION

- Rends la page d'accueil statique et la donnée GitHub revalidée à intervalle (par ex. une heure).
- Vérifie dans la sortie du build quelles routes sont statiques.
- Pour chaque donnée du portfolio, note dans `docs/caching.md` : fréquence de changement, coût de récupération, fraîcheur nécessaire, stratégie choisie.

## Critère de réussite

- [ ] Rends la page d'accueil statique et la donnée GitHub revalidée à intervalle (par ex. une heure).
- [ ] Vérifie dans la sortie du build quelles routes sont statiques.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quelle donnée de ton site mérite d'être revalidée, et laquelle ne changera jamais ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : chaque route a sa stratégie de fraîcheur.

Ton site privilégie une stratégie de rendu et de cache adaptée à la fréquence de changement de chaque donnée. Commit.
