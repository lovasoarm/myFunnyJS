---
stability: intemporel
---

# INTEMPOREL vs PERISSABLE (tableau de re-audit)

Rendre explicite ce que le front-matter `stability:` implique deja : quels
modules restent vrais dans 10 ans, lesquels doivent etre rejoues tous les
2 ans. Tu sais alors quoi rouvrir en 2029.

| Module                    | Durée de validité estimée | Signal de péremption                                             |
| ------------------------- | ------------------------- | ---------------------------------------------------------------- |
| 00_getting_started        | 2 ans                     | Node LTS bascule ; nouvel outil de package (bun stable, etc.)    |
| 00_referentiel            | intemporel                | Nouvelle "pierre" ajoutée au métier                              |
| 01_fundamentals           | intemporel                | Changement majeur de la spec ECMAScript                          |
| 02_problem_solving        | intemporel                | :                                                                |
| 03_async                  | intemporel                | Nouveau primitif de concurrence (au-delà de async/await)         |
| 04_debugging              | 5 ans                     | Nouveau DevTools majeur ; nouvel outil de trace                  |
| 05_error_handling         | intemporel                | :                                                                |
| 06_testing                | 5 ans                     | Runner par défaut change (Jest -> Vitest -> ?)                   |
| 07_math_basics            | intemporel                | :                                                                |
| 08_memory_performance     | 5 ans                     | Nouveau GC ; nouveau format de heap snapshot                     |
| 09_data_structures        | intemporel                | :                                                                |
| 10_algorithms             | intemporel                | :                                                                |
| 11_functional_js          | intemporel                | Nouvelle proposition TC39 (pipeline, records) stabilisée         |
| 12_design_patterns        | intemporel                | :                                                                |
| 13_refactoring            | intemporel                | :                                                                |
| 14_typescript             | 2 ans                     | Bascule majeure TS (strict flags, decorators v2, effect systems) |
| 15_runtime_env            | 2 ans                     | Bun/Deno atteint parité Node ; workerd change ; edge dominant    |
| 16_architecture_patterns  | 5 ans                     | Nouveau paradigme (au-delà micro-services / event-driven)        |
| 17_web_concepts           | 5 ans                     | HTTP/4 ; nouvelle spec navigateur majeure                        |
| 18_oop_js                 | intemporel                | :                                                                |
| 19_web_inclusive          | 5 ans                     | Nouvelle version WCAG ; nouveau standard i18n                    |
| 20_realtime               | 5 ans                     | WebTransport remplace WebSocket dominant                         |
| 21_api_craft              | 5 ans                     | REST remplacé par gRPC / GraphQL / autre en majorité             |
| 22_security               | 2 ans                     | Nouvelle famille d'attaques ; nouvelle version OWASP Top 10      |
| 23_ai_native_dev          | 2 ans                     | Nouveau paradigme d'assistance (au-delà du chat + suggestions)   |
| 24_databases              | 5 ans                     | Nouveau modèle (vectoriel dominant ; SQL sur objets, etc.)       |
| 25_scalability            | 5 ans                     | Nouveau modèle de déploiement (edge partout ; serverless v2)     |
| 26_observability          | 5 ans                     | OpenTelemetry remplacé ; nouveau standard de trace               |
| 27_team_craft             | intemporel                | :                                                                |
| 28_edge_cases             | intemporel                | :                                                                |
| 29_ai_agents_and_autonomy | 2 ans                     | Nouveau protocole d'agent (MCP successor, etc.)                  |
| 30_mini_projects          | 5 ans                     | Stack de référence obsolète ; sujet plus représentatif du métier |
| 31_annexes                | intemporel                | :                                                                |
| 32_tools                  | 2 ans                     | Outillage dominant remplacé (bundler, linter, formatter)         |

## Comment se servir de ce tableau

- **Chaque 2 ans** : re-audit des lignes "2 ans". Priorité absolue.
- **Chaque 5 ans** : re-audit des lignes "5 ans".
- **Intemporel** : ne veut pas dire "à ne jamais toucher" ; veut dire "aucun signal externe n'impose de re-auditer". Tu re-auditeras si un signal apparaît.

Ce tableau est lui-même à ré-auditer tous les 2 ans.
