# MATRICE DE PERENNITE : quoi vaut encore en 2031 et 2036 ?

> Consolide les tags dispersés `[INTEMPOREL]` / `[PERISSABLE]`.
> Regle : si un module tombe en `PERISSABLE 2031`, prevoir sa reecriture avant fin 2030.

| Module | Coeur | Horizon 2031 | Horizon 2036 | Note |
|---|---|---|---|---|
| 01_fundamentals | syntaxe + modele mental | INTEMPOREL | INTEMPOREL | six pierres |
| 02_problem_solving | decoupage | INTEMPOREL | INTEMPOREL | |
| 03_async | event loop | INTEMPOREL | INTEMPOREL | modele universel |
| 04_debugging | methode scientifique | INTEMPOREL | INTEMPOREL | |
| 05_error_handling | gestion d'erreur | INTEMPOREL | INTEMPOREL | |
| 06_testing | strategie | INTEMPOREL | INTEMPOREL | frameworks periront, strategie non |
| 07_math_basics | maths | INTEMPOREL | INTEMPOREL | |
| 08_memory_performance | GC, closures | INTEMPOREL | INTEMPOREL | |
| 09_data_structures | structures | INTEMPOREL | INTEMPOREL | |
| 10_algorithms | algos | INTEMPOREL | INTEMPOREL | |
| 11_functional_js | paradigme | INTEMPOREL | INTEMPOREL | |
| 12_oop_js | prototype JS | INTEMPOREL | INTEMPOREL | |
| 13_design_patterns | patterns | INTEMPOREL | INTEMPOREL | |
| 14_refactoring | refactor | INTEMPOREL | INTEMPOREL | |
| 15_typescript | TS 5.x specifique | INTEMPOREL (concept) | PERISSABLE (syntaxe TS>=8) | reprofiler en 2031 |
| 16_runtime_env | Node 20/24 | PERISSABLE 2031 | PERISSABLE | rebasculer sur runtime LTS courant |
| 17_architecture_patterns | archi | INTEMPOREL | INTEMPOREL | |
| 18_web_concepts | web 2026 | PERISSABLE 2031 | PERISSABLE | HTTP/QUIC evolue |
| 19_web_inclusive | a11y/i18n | INTEMPOREL (principes) | INTEMPOREL | WCAG >=3 a integrer |
| 20_realtime | patterns temps reel | INTEMPOREL | INTEMPOREL | |
| 21_api_craft | REST/GraphQL | PERISSABLE 2031 | PERISSABLE | protocoles evoluent |
| 22_security | OWASP | INTEMPOREL (principes) | PERISSABLE (menaces) | remettre a jour top-10 tous les 3 ans |
| 23_ai_native_dev | outils IA 2026 | PERISSABLE 2031 | PERISSABLE | reecrire tous les 18 mois |
| 23bis_ai_agents_and_autonomy | agents autonomes | PERISSABLE 2031 | PERISSABLE | idem |
| 24_databases | SQL/NoSQL | INTEMPOREL | INTEMPOREL | moteurs evoluent, modele non |
| 25_scalability | scalabilite | INTEMPOREL | INTEMPOREL | |
| 26_observability | logs/metriques/traces | INTEMPOREL | INTEMPOREL | |
| 27_team_craft | collaboration | INTEMPOREL | INTEMPOREL | |
| 28_edge_cases | cas limites | INTEMPOREL | INTEMPOREL | |
| 30_mini_projects | livrables | INTEMPOREL | INTEMPOREL | |
| 31_annexes | carriere + methode | INTEMPOREL (methode) | PERISSABLE (marche emploi) | pivoter section carriere |
| 32_tools | outillage | PERISSABLE 2031 | PERISSABLE | reecrire a chaque migration |

## Ligne de conduite maintenance
- Verifier cette matrice une fois par an.
- Tout module tagge `PERISSABLE 2031` doit avoir une PR de refresh datee.
- Ne jamais retirer un module INTEMPOREL sous pretexte de mode.
