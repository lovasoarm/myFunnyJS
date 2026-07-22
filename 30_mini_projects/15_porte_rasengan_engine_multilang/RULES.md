---
stability: intemporel
---

# RULES : 15_porte_rasengan_engine_multilang

Règles minimales de release. Un projet qui échoue une de ces règles est marqué
INCOMPLET par un critere binaire ecrit dans ton `TDD_JOURNAL.md`.

## ADR_MINIMUM

Nombre minimum d'ADR à livrer dans `ADR/` : **4**

Un ADR unique ("choix d'architecture") ne suffit pas. Décisions latérales attendues :
données, frontières de module, stratégie de tests, choix async, sécurité, observabilité.
Template canonique : `30_mini_projects/_templates/ADR_TEMPLATE.md`.

## SPEC_DRIFT_MODE

default: off
activation: `SPEC_DRIFT_MODE=on`
triggers: voir `SPEC_DRIFT_TRIGGERS.md` (obligatoire, 3 déclencheurs J+1/J+3/J+5)

Si activé, `POSTMORTEM.md` doit contenir la section `## Comment j'ai encaissé le drift`.

## Security Gate

Bloc obligatoire (drill `node solution.js` (auto-verif ecrite par toi)) :

- **Entrées validées** : chaque entrée externe passe par un schéma explicite (Zod, manuel documenté).
- **Secrets hors code** : jamais commités ; lus depuis env, documentés dans `SECURITY.md`.
- **Dépendances scannées** : `npm audit` (ou équivalent), snapshot copié dans `SECURITY.md`.
- **Surface d'exposition** : listée dans `SECURITY.md` (ports, endpoints, fichiers lus/écrits).

Absence de `SECURITY.md` = release refusée.

## TDD JOURNAL

Section obligatoire : `## Ce qui aurait été impossible à tester si j'avais gardé la version précédente`.
Force l'introspection sur le lien code testable / refactoring.
