---
stability: intemporel
---

# 04 : npm / pnpm : ne bloque pas au premier `install`
Temps de lecture ~5 min

Un package manager, c'est ton système de logistique. Il descend du code des autres, gère les versions, lance des scripts.

## Le vocabulaire

- `package.json` : la liste de course de ton projet.
- `node_modules/` : l'entrepôt (jamais commit : `.gitignore`).
- `package-lock.json` / `pnpm-lock.yaml` : la facture exacte, versions gelées. **Commit obligatoire.**

## npm : 6 commandes

```
npm init -y      # créer package.json
npm install      # installer tout ce qui est dans package.json
npm install lodash   # ajouter une dep
npm install -D vitest # dep de dev seulement
npm uninstall lodash  # retirer
npm run test      # lancer un script défini
```

## pnpm (recommandé 2026)

Même API, disk usage divisé par 5-10. `pnpm install`, `pnpm add`, `pnpm run`. Utilise-le si tu as le choix.

## Piège

`npm install` sans lockfile en CI = build non déterministe. Utilise `npm ci` en CI, `npm install` en local.

## Ce que l'analogie cache

Le "logisticien" ne vérifie pas la qualité de la marchandise. Un paquet peut contenir du code malveillant. Voir `05_devsec_perso.md`.

## Mission

Crée un projet, ajoute `zod`, écris un script `check` qui valide `{name: string}`, lance-le via `npm run check`.
