---
stability: intemporel
---

# PONTS INTER-MODULES : la carte

Temps de lecture ~3 min

> Note de structure. Rien à apprendre ici. Table de référence des ponts qui existent entre modules et de la raison de chacun.

## POLITIQUE ÉDITORIALE (v20)

Un pont existe entre deux modules quand **le saut change la nature du travail** : paradigme, échelle de temps, type de responsabilité, ou densité de vocabulaire. Chaque pont tient en 60-100 lignes et suit toujours le même gabarit : ce que tu maîtrises déjà, le vocabulaire qui arrive, le piège mental typique, un exercice-charnière de 5 min.

Les transitions "évidentes" (le sujet évolue mais la posture reste) n'ont pas de pont : chaque module ouvre par son `00_why_*.md` qui te resitue. Si un enchaînement te semble abrupt et qu'il n'a pas de pont, ouvre une issue.

## TABLE DES PONTS

| De | Vers | Fichier | Nature du saut |
|----|------|---------|----------------|
| 01_fundamentals | 03_async | `01_fundamentals/99_PONT_avant_module_03_async.md` | Syntaxe séquentielle -> concurrence |
| 02_problem_solving | 03_async | `02_problem_solving/99_PONT_avant_module_03_async.md` | Modèle statique -> modèle temporel |
| 03_async | 08_memory_performance | `03_async/99_PONT_avant_module_08_memory.md` | Opérations -> ressources |
| 04_debugging | 05_error_handling | `04_debugging/99_PONT_avant_module_05_error_handling.md` | Réagir -> prévoir |
| 05_error_handling | 06_testing | `05_error_handling/99_PONT_avant_module_06_testing.md` | Prévoir l'échec -> le prouver |
| 06_testing | 07_math_basics | `06_testing/99_PONT_avant_module_07_math_basics.md` | Prouver -> raisonner sur les nombres |
| 07_math_basics | 08_memory_performance | `07_math_basics/99_PONT_avant_module_08_memory.md` | Nombres -> ressources |
| 08_memory_performance | 09_data_structures | `08_memory_performance/99_PONT_avant_module_09_data_structures.md` | Mesure -> choix de structure |
| 09_data_structures | 10_algorithms | `09_data_structures/99_PONT_avant_module_10_algorithms.md` | Stocker -> traiter |
| 11_functional_js | 12_design_patterns | `11_functional_js/99_PONT_avant_module_12_design_patterns.md` | Fonctions -> structures d'objets |
| 12_design_patterns | 13_refactoring | `12_design_patterns/99_PONT_avant_module_13_refactoring.md` | Reconnaître -> réécrire |
| 13_refactoring | 14_typescript | `13_refactoring/99_PONT_avant_module_14_typescript.md` | Refactor JS -> refactor typé |
| 14_typescript | 15_runtime_env | `14_typescript/99_PONT_avant_module_15_runtime_env.md` | Types -> runtime |
| 22_security | 23_ai_native_dev | `22_security/99_PONT_avant_module_23_ai_native_dev.md` | Code humain -> code IA |
| 26_observability | 27_team_craft | `26_observability/99_PONT_avant_module_27_team_craft.md` | Observer machines -> observer humains |
| 28_edge_cases | 29_ai_agents_and_autonomy | `28_edge_cases/99_PONT_28_29.md` | Ingénierie humaine -> délégation |

## LES TRANSITIONS SANS PONT

Toutes les autres transitions du curriculum. Elles ne posent pas de saut de nature : le sujet évolue, la posture reste. Ouvre simplement le `00_why_*.md` du module suivant.

## RÈGLE POUR L'AVENIR

Un nouveau pont s'ajoute **seulement si** la transition change la nature du travail. Pas si elle change juste le sujet. Ça évite la dérive vers 31 ponts creux.
