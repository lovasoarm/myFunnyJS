---
stability: stable
---

# 30_mini_projects : 19 mini-projets appliqués

Temps de lecture ~3 min

Ce bloc rassemble les mini-projets qui obligent à assembler ce que les
modules 01 → 29 t'ont appris. Chaque mini-projet a un README propre, un
POSTMORTEM à remplir, un TDD_JOURNAL, et au moins un ADR.

## Ordre pédagogique

Les projets sont numérotés dans l'ordre où l'ambition monte, pas dans
l'ordre où tu dois les faire strictement. Recommandation :

- **01 → 05** : dès que tu as fini les modules 01 → 07 (fundamentals,
  problem solving, async, debugging, errors, testing, math).
- **06 → 10** : après les modules 08 → 13 (mémoire, structures, algos,
  fp, patterns, refactoring).
- **11 → 14** : après 15 → 22 (runtime, architecture, web, realtime, API,
  security).
- **15 → 17** : après 23 → 29 (AI-native, databases, scalability,
  observability, team, edge cases, AI agents).

## Liste

| # | Projet | Cible pédagogique dominante |
|---|---|---|
| 01 | `01_rasengan_engine` | Fondamentaux + composition |
| 02 | `02_garo_no_kronika` | Manipulation d'état, timers |
| 03 | `03_walking_dead_protocol` | Async + résilience |
| 04 | `04_breaking_cache` | Cache, expiration, invalidation |
| 05 | `05_prison_break_api` | API, auth, boundaries |
| 06 | `06_ultras_dashboard` | UI, données live |
| 07 | `07_ballon_dor_cli` | CLI, ergonomie terminal |
| 08 | `08_trapsoul_radio` | Streaming, backpressure |
| 09 | `09_oracle_glitch` | Debug avancé |
| 10 | `10_legacy_dungeon` | Lecture de code hérité |
| 11 | `11_scheduler` | Concurrence, pMap, backpressure |
| 12 | `12_legacy_takeover` | Reprise de repo, TDD sur legacy |
| 13 | `13_memory_hunter` | Fuites mémoire, heap snapshots |
| 14 | `14_system_design_lab` | System design pratique, brokers |
| 15 | `15_porte_rasengan_engine_multilang` | Transfert de compétence (Go) |
| 16 | `16_distributed_arena` | Systèmes distribués, idempotence |
| 17 | `17_polyglot_forge` | Bonus : intégration multi-langages |
| 19 | `19_supervise_the_ai` | Architecte-superviseur : zero code applicatif, ADR + prompts + reviews + POSTMORTEM |

## Livrables communs à chaque projet

- `README.md` : contexte + comment lancer.
- `POSTMORTEM.md` : rempli à la fin.
- `TDD_JOURNAL.md` : le journal des cycles rouge → vert → refactor.
- `ADR/ADR-001_*.md` : au moins un ADR par projet, souvent plusieurs.
- `SECURITY_GATE.md` : gate bloquante. **Rejouer avant POSTMORTEM**
  à chaque livraison de mini-projet (correction #2 de la revue).
- `SECURITY.md` : entrées validées, secrets hors code, dépendances
  scannées, surface d'exposition. Livré comme template avec des
  placeholders : un mini-projet n'est pas terminé tant que ce fichier
  contient encore "ajoute ici..." ou le snapshot `npm audit` par défaut.
  Vérifie-le toi-même avant de considérer un projet fini :
  `node solution.js 30_mini_projects/<nom_du_projet>`

Les synthèses transverses sont dans `synthese/` (à lire après un bloc
complet de projets).

## Changement de niveau de guidage a partir du projet 11

Les mini-projets 1 a 10 te donnent l'architecture attendue (fichiers dans `src/`, flux d'appel, ordre de construction). A partir du projet 11, le cahier des charges te donne l'objectif verrouille et la grille de score, mais pas l'architecture : tu la deduis toi-meme. Ce n'est pas un cahier bacle, c'est le but pedagogique de cette seconde moitie, plus d'autonomie exigee a mesure que tu progresses.


> Note v14 : `synthese/` déplacé vers `31_annexes/synthese_mini_projects/` (méta-doc, pas un projet).

## Drill hors serie : 18bis "IA en panne"

`31_annexes/16_career/05_ai_famine_drill.md` n'est pas dans la sequence numerotee 01-17. C'est un
drill de survie technologique : reconstruire un module deja etudie, sur une
machine vierge, sans IA, sans internet, sans autocompletion. A rejouer une
fois par trimestre. Voir `31_annexes/16_career/05_ai_famine_drill.md`.

## Gate securite (OWASP) : bloquant pour cloturer un projet

Chaque POSTMORTEM de mini-projet doit contenir la checklist OWASP Top 10
(voir `_templates/01_POSTMORTEM_TEMPLATE.md`, section "GATE SECURITE").
Tant qu'une ligne reste en `TODO`, le projet **n'est pas livre**, meme si
les tests passent. La checklist est obligatoire pour les **17 projets
numerotes** (le drill 18bis a son propre POSTMORTEM, sans gate reseau si
le drill est fait hors-ligne).

## Objection storm par ADR : bloquant pour signer un ADR

Chaque ADR d'un mini-projet declenche **un objection storm chronometre**
(voir `31_annexes/19_interview/03_objection_storm.md`). Pas de storm =
ADR non defendu = projet non livre.
