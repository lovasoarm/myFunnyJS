## CONTEXTE

Le cache décide de la fraîcheur et de la vitesse. Dans l'App Router, le choix statique / revalidé / dynamique se fait route par route.

## APPLICATION

- Rends la page d'accueil statique et la donnée GitHub revalidée à intervalle (par ex. une heure).
- Vérifie dans la sortie du build quelles routes sont statiques.
- Justifie ton choix en une ligne par route dans `docs/caching.md`.

## Vérification

Quelle donnée de ton site mérite d'être revalidée, et laquelle ne changera jamais ?

##Chaque route a sa stratégie de fraîcheur

Ton site est quasi entièrement statique donc instantané. Commit.
