---
stability: stable
---

# 30_mini_projects — 17 mini-projets appliqués

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

## Livrables communs à chaque projet

- `README.md` : contexte + comment lancer.
- `POSTMORTEM.md` : rempli à la fin.
- `TDD_JOURNAL.md` : le journal des cycles rouge → vert → refactor.
- `ADR/ADR-001_*.md` : au moins un ADR par projet, souvent plusieurs.

Les synthèses transverses sont dans `_synthesis/` (à lire après un bloc
complet de projets).
