---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# 05 : Race Condition Hunter
Temps de lecture ~5 min

> **Principe universel** : deux acteurs, une ressource, aucun ordre garanti = danger. Vrai en JS async, en threads, en microservices.

## Bug fourni

`race-damage.js` : deux Chevaliers Garo frappent le même Horror et incrémentent un compteur de dégâts partagé, via deux requêtes concurrentes `POST /hit`. Environ **1 fois sur 100**, le total de dégâts est faux (un coup disparaît).

## Protocole

1. Reproduis (voir `04_debugging/04_repro_before_fix.md`). Boucle : `for i in $(seq 10000); do ...`.
2. Instrumente : logs avec `performance.now()` haute résolution + correlation ID par requête.
3. Identifie la **section critique** (les 2 lignes qui doivent être atomiques).
4. Choisis un remède : mutex applicatif, opération atomique DB (`UPDATE ... SET n = n + 1`), file d'attente, versionning optimiste.
5. Écris un ADR : pourquoi CE remède et pas les autres.

## Livrable

- `HYPOTHESES.md` + trace annotée.
- Fix + test qui casse **sans** le fix.
- ADR (1 page).

## (attention) Piège

Un `console.log` change le timing → le bug disparaît. Utilise un **buffer** logué à la fin, pas des logs synchrones.
