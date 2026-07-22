---
stability: perissable_2027
---

# PONT : de typer du code à connaître le sol sur lequel il tourne à l'environnement d'exécution

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `14_typescript` et `15_runtime_env`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de nature.

## POURQUOI CE PONT EXISTE

TypeScript t'a donné une sécurité statique. Reste à comprendre où ton code s'exécute vraiment : Node, Bun, Deno, browser. Chaque runtime a ses APIs, ses limites, ses pièges. Un `require` casse dans Deno, un `Deno.readFile` n'existe pas ailleurs.

## CE QUE TU MAÎTRISES DÉJÀ

- Écrire un module TypeScript strict.
- Séparer types et implémentation.
- Lire un `tsconfig.json` sans peur.

## VOCABULAIRE NOUVEAU QUI ARRIVE

- **Runtime** : la machine qui exécute ton JS (V8, JavaScriptCore, SpiderMonkey).
- **ESM vs CommonJS** : deux formats de modules incompatibles.
- **Global objects** : `window` (browser), `global` (Node), `Deno` (Deno).
- **Environment variables** : jamais dans le code, toujours au boot.

## LE PIÈGE MENTAL TYPIQUE DU SAUT

Croire que "JavaScript = JavaScript partout". `fetch` n'existait pas dans Node avant v18. `Buffer` n'existe pas dans le browser. Le socle change.

## EXERCICE-CHARNIÈRE (5 min chrono)

Écris un module qui lit un fichier. Fais-le tourner dans Node, puis dans Deno. Note les 3 différences que tu rencontres. `15_runtime_env/01_node_vs_deno.md` liste les principales.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise beaucoup d'apprenants. Aucune honte à revenir.
