---
stability: stable
---

# `package.json` : mode d'emploi (2 min)

Ce dossier contient un `package.json` minimal. **Ne lance PAS `npm install`
tout de suite** : il n'y a aucune dependance a installer.

## A quoi il sert

- Declarer que ce dossier est un projet Node moderne (`"type": "module"`
  active les `import`/`export` sans configuration).
- Fournir 3 scripts pratiques :
  - `npm start` -> `node index.js`
  - `npm test`  -> `node --test` (runner natif Node)
  - `npm run watch` -> re-execute a chaque sauvegarde

## Quand faire `npm install` ici

- **Jamais**, tant qu'aucune dependance n'apparait dans la section
  `dependencies` ou `devDependencies`.
- Le jour ou tu ajoutes une lib (par exemple `zod`), tu fais
  `npm install zod`, ce qui cree `node_modules/` et `package-lock.json`.

## Requis Node

`"engines"` demande Node >= 20.11. Le curriculum vise Node 22 (LTS 2026).
Verifie avec `node -v`.

## Pourquoi ce fichier est utile meme vide

Il te sert de reference : tu regardes comment un `package.json` est
structure avant d'en generer un toi-meme avec `npm init -y`.
