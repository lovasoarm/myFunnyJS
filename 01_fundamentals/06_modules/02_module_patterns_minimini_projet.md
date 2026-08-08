## TYPE

Micro-drill

## Niveau

🗸 Fondamental

## Prérequis

- Connaître la frontière Server / Client de l'App Router Next.js

## CONTEXTE

Barrel files, modules « serveur uniquement », séparation client/serveur : dans l'App Router, un mauvais import fait basculer tout un arbre côté client.

## APPLICATION

- Marque un module réellement serveur (par ex. lecture de données) et tente de l'importer depuis un composant `"use client"` : lis l'erreur.
- Sépare les types dans `types/` pour qu'ils soient importables des deux côtés.
- Évalue si un barrel `index.js` t'aide ou masque tes dépendances : tranche et note ton choix.

## Critère de réussite

- [ ] Marque un module réellement serveur (par ex. lecture de données) et tente de l'importer depuis un composant `"use client"`.
- [ ] Sépare les types dans `types/` pour qu'ils soient importables des deux côtés.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Comment sais-tu, en lisant un fichier, s'il finira dans le bundle client ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ta frontière client/serveur est explicite.

Tu contrôles ce qui part dans le navigateur : c'est du poids de page en moins, gratuitement. Commit.
