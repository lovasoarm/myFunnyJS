---
stability: intemporel
---

# SPEC DRIFT TRIGGERS : 16_distributed_arena

Trois déclencheurs à activer si `SPEC_DRIFT_MODE=on`. Chacun simule un changement
de spec en cours de projet : pas au démarrage. Objectif : entraîner à renégocier
sans bricoler.

## J+1 : nouveau champ obligatoire

Le donneur d'ordre ajoute un champ obligatoire à ton contrat d'entrée (ex. `traceId`
sur chaque événement). Tu dois : (1) refuser proprement les anciens payloads OU
(2) rétro-remplir. Documente le choix dans `POSTMORTEM.md`.

## J+3 : changement de format d'entrée

Le format d'entrée passe de JSON à NDJSON (ou CSV -> Parquet, ou GET -> POST body).
Tu ne peux pas tout réécrire. Tu dois isoler l'adaptateur d'entrée derrière une
frontière et faire cohabiter les deux formats pendant une fenêtre de migration.

## J+5 : exigence de perf ajoutée en cours de route

Le donneur d'ordre exige désormais un P95 < 100 ms (ou un throughput × 10, ou
un cold-start < 500 ms). Ta stack actuelle ne le tient pas. Tu dois : mesurer
avant de toucher, choisir un axe (cache / algo / batch / dédup) et documenter
l'ADR correspondant.

## Livrable obligatoire

Section `## Comment j'ai encaissé le drift` dans `POSTMORTEM.md`, avec au moins
une ligne par déclencheur activé et le coût réel payé.
