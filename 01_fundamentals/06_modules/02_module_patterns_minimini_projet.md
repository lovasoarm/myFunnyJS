## CONTEXTE

Barrel files, modules « serveur uniquement », séparation client/serveur : dans l'App Router, un mauvais import fait basculer tout un arbre côté client.

## APPLICATION

- Marque un module réellement serveur (par ex. lecture de données) et tente de l'importer depuis un composant `"use client"` : lis l'erreur.
- Sépare les types dans `types/` pour qu'ils soient importables des deux côtés.
- Évalue si un barrel `index.js` t'aide ou masque tes dépendances : tranche et note ton choix.

## Vérification

Comment sais-tu, en lisant un fichier, s'il finira dans le bundle client ?

## 🎬 Ta frontière client/serveur est explicite

Tu contrôles ce qui part dans le navigateur : c'est du poids de page en moins, gratuitement. Commit.
