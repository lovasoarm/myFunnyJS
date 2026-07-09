---
stability: stable
---

# assets/ : charte visuelle

Temps de lecture ~2 min

Ce dossier héberge les rares assets graphiques du curriculum. On y garde
volontairement peu de choses : le curriculum est texte-first.

## Contenu

- `title.svg` : titre du projet affiché en tête de `README.md`.

## Charte

- Format vectoriel privilégié (SVG), sinon PNG (jamais JPEG pour du texte
  ou du logo).
- Palette : noir + accent unique (à définir par livraison, pas de dégradés).
- Typographie : la même que celle du site de publication si un site existe,
  sinon `sans-serif` système.
- Poids : chaque asset < 50 KB. Un asset lourd doit être justifié dans un
  ADR.

## Ajouter un asset

1. Optimise (svgo pour SVG, oxipng ou similaire pour PNG).
2. Nom en `snake_case`, sans espace.
3. Cite l'auteur et la licence dans un commentaire SVG ou dans un fichier
   `LICENSES.md` à côté si l'asset n'est pas produit maison.
4. Documente son usage ici.
