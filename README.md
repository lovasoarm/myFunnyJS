![MyFunnyJS](./assets/title.svg)

---

Ce projet, c'est le chemin complet pour passer de **"je connais quelques trucs en JS"**
à **"je comprends ce que je fais, pourquoi je le fais, et comment ne pas tout péter en prod"**.

On apprend JavaScript. Mais l'objectif est beaucoup plus large.

Les structures de données, les algorithmes, les patterns d'architecture, la sécurité,
la performance, le testing, l'observabilité, le travail en équipe : tout ça tourne dans
n'importe quel langage. JS n'est que le vecteur. Ce qu'on construit ici, c'est **une façon
de penser**.

Le mot d'ordre : **apprendre sérieusement en s'amusant vraiment**. Pas des slides. Pas des
vidéos YouTube de 4 heures. Des fichiers `.js` avec des exercices qui ressemblent à des
missions, des combats, des escape rooms et des histoires de pirates. Ton cerveau retient
mieux quand il s'amuse. C'est prouvé. On l'exploite sans honte.

---

## Ce que tu vas devenir en finissant ce curriculum

Un développeur qui comprend ce qui se passe sous le capot.
Quelqu'un qui peut lire du code inconnu et en extraire le sens en moins d'une heure.
Un dev qui teste avant de coder, qui observe ce qui se passe en production, qui écrit du
code que les autres peuvent maintenir et que l'IA peut lire et modifier sans tout casser.

En 2026, la valeur d'un développeur ne vient plus de sa vitesse à taper du code. Elle vient
de sa capacité à **comprendre le problème, choisir le bon pattern, sécuriser ce qu'il
construit, et travailler avec les autres sans tout péter**. L'IA produit du code. Elle ne
réfléchit pas. Toi oui.

---

## Les règles du jeu

**Lis chaque fichier du début à la fin** avant de coder. Les `.md` contiennent la leçon. Ne les saute pas.

**Code toi-même.** Copier-coller une solution depuis l'IA sans la comprendre, c'est comme
regarder quelqu'un faire des pompes à ta place. Ton cerveau ne se renforce pas.

**Utilise l'IA comme un copilote**, pas comme un chauffeur. Elle génère, tu valides. Elle
propose, tu décides. Le module `21_ai_native_dev` t'apprend exactement comment faire ça bien.

**Finis les mini-projets.** Les modules t'apprennent des concepts. Les mini-projets te
forcent à les assembler pour de vrai. C'est là que tout se concrétise. Ne les saute pas.

**Remplis les TDD_JOURNAL et les POSTMORTEM.** Ce ne sont pas des formalités. C'est
l'expérience capturée par écrit. Les meilleurs développeurs savent exactement pourquoi ils
ont pris telle décision, ce qui a cassé, et ce qu'ils feraient différemment.

---

## Roadmap : dans l'ordre, sans sauter d'étape

```
01  Fundamentals            =>  les bases sans lesquelles tout le reste est du sable
02  Async & Event Loop      =>  comprendre le coeur invisible de JS
03  Error Handling          =>  survivre aux erreurs sans exploser en prod
04  Testing                 =>  tester ce qu'on comprend, pas ce qu'on espère
05  Maths utiles            =>  les maths qui servent vraiment
06  Memory & Performance    =>  comprendre ce qui coûte cher et pourquoi
07  Data Structures         =>  les armes secrètes de tout bon algorithme
08  Algorithms              =>  les patterns qui résolvent 90% des problèmes
09  Functional JS           =>  coder sans effets de bord ni regrets
10  Design Patterns         =>  les recettes de cuisine du code solide
11  Refactoring             =>  transformer du code qui fonctionne en code qui dure
12  TypeScript              =>  JS avec un casque et une armure (obligatoire en 2026)
13  Runtime Environment     =>  savoir où ton code vit vraiment
14  Architecture Patterns   =>  construire grand sans tout effondrer
15  Web Concepts            =>  tout ce qu'un ingénieur web doit avoir en tête
16  Accessibility (a11y)    =>  coder pour tout le monde, pas juste pour toi
17  i18n                    =>  parler toutes les langues sans tout réécrire
18  Real-Time               =>  WebSockets, SSE, WebRTC : le web qui respire en direct
19  API Craft               =>  construire ce que le monde consomme
20  Security                =>  ne jamais être la faille que quelqu'un exploite
21  AI Native Dev           =>  utiliser l'IA sans perdre le contrôle
22  Databases               =>  persister intelligemment dans le temps
23  Scalability             =>  tenir quand ça devient sérieux
24  Observability           =>  voir ce qui se passe en prod
25  Team Craft              =>  coder avec des humains, pas juste avec une machine
26  Edge Cases              =>  JS qui se rebelle, et comment y survivre
27  OOP en JS               =>  prototype, classes, héritage : la face cachée de JS
28  Mini Projects           =>  assembler tout ça pour de vrai
29  Annexes                 =>  toolchain, Node CLI, TypeScript avancé
30  Tools                   =>  les gadgets maison pour aller plus vite
```

---

## LE NOYAU DUR : ce que tu dois maîtriser en béton armé

Tu peux pas tout avaler d'un coup. Personne peut. Mais si tu sors de MyFunnyJS avec ces
six blocs verrouillés, t'es dangereux.

**01 + 02 : Fundamentals + Async.** Pas négociable. Si tu comprends pas les closures, le
scope, et l'Event Loop, tout le reste flotte dans le vide. C'est le sol. Tu construis pas
une maison sur du sable.

**03 + 04 : Error Handling + Testing.** Pas à la fin. Pas "quand t'as le temps". Maintenant.
Un dev qui gère pas ses erreurs et qui teste pas, c'est un pilote sans instruments : il vole,
mais il sait pas où il va ni quand ça va tomber. Les erreurs viennent avant les tests : tu
peux pas tester ce que tu sais pas attraper.

**07 + 08 : Data Structures & Algorithms.** Pas pour les entretiens. Pour penser. Savoir
quelle structure choisir dans quel contexte, c'est la différence entre du code qui tient et
du code qui s'effondre sous la charge.

**10 + 11 : Design Patterns + Refactoring.** Parce que ton premier jet sera toujours
approximatif. Les patterns t'apprennent à ne pas réinventer la roue. Le refactoring
t'apprend à améliorer sans tout casser.

**12 : TypeScript.** En 2026, ne pas savoir TypeScript, c'est se présenter à un entretien
sans chaussures. Ce n'est plus un bonus. C'est le standard.

**14 + 19 : Architecture + API Craft.** Sans patterns solides et sans API propres, ton
projet grandit pas : il pourrit.

```
        PRIORITÉ ABSOLUE
________________|________________
                |
    01_fundamentals + 02_async         <=  sans ça, t'es aveugle
                |
    03_error_handling + 04_testing     <=  sans ça, t'es imprudent
                |
    07_data_structures + 08_algos      <=  sans ça, t'es limité
                |
    10_design_patterns + 11_refacto    <=  sans ça, t'es un risque pour ton équipe
                |
           12_typescript               <=  sans ça, t'es hors marché en 2026
                |
    14_architecture + 19_api           <=  sans ça, t'es junior à vie
```

Le reste (sécurité, scalabilité, observabilité, team craft, a11y, i18n, real-time) c'est ce
qui fait la différence entre un bon dev et un senior. Mais ces six blocs, c'est le ticket
d'entrée. Maîtrise ça d'abord. Le reste vient avec le temps et les projets réels.

## ARBORESCENCE COMPLÈTE

```
MyFunnyJS/
├── README.md
├── CONTRIBUTING.md
│
├── 01_fundamentals/
│   ├── 00_Le_Guide_que_ton_prof_aurait_du_te_donner_le_jour_1.md
│   ├── 01_variables/
│   │   ├── 01_intro_variables.md
│   │   ├── 02_reference_chaos.md
│   │   ├── 02_reference_chaos_solution.js
│   │   ├── 03_mutation_madness.md
│   │   ├── 03_mutation_madness_solution.js
│   │   ├── 04_const_trap.md
│   │   └── 05_variable_glossary.md
│   ├── 02_scope/
│   │   ├── 01_scope_basics.md
│   │   ├── 01_scope_basics_solution.js
│   │   ├── 02_closure_trap.md
│   │   ├── 02_closure_trap_solution.js
│   │   ├── 03_scope_escape_room.md
│   │   ├── 03_scope_escape_room_solution.js
│   │   └── 04_scope_glossary.md
│   ├── 03_functions/
│   │   ├── 01_function_basics.md
│   │   ├── 01_function_basics_solution.js
│   │   ├── 02_hof_map_filter.md
│   │   ├── 02_hof_map_filter_solution.js
│   │   ├── 03_function_factory.md
│   │   ├── 03_function_factory_solution.js
│   │   └── function_grimoire.md
│   ├── 04_types/
│   │   ├── 01_primitives.md
│   │   ├── 01_primitives_solution.js
│   │   ├── 02_type_coercion.md
│   │   ├── 02_type_coercion_solution.js
│   │   ├── 03_type_transformers.md
│   │   ├── 03_type_transformers_solution.js
│   │   └── 04_types_grimoire.md
│   ├── 05_web_basics/
│   │   ├── 01_dom_manipulation.md
│   │   ├── 01_dom_manipulation_solution.js
│   │   ├── 02_fetch_adventure.md
│   │   ├── 02_fetch_adventure_solution.js
│   │   ├── 03_storage_treasure.md
│   │   ├── 03_storage_treasure_solution.js
│   │   ├── 04_template_portals.md
│   │   ├── 04_template_portals_solution.js
│   │   ├── 05_web_helpers.md
│   │   ├── 05_web_helpers_solution.js
│   │   ├── 06_module_factory.md
│   │   ├── 06_module_factory_solution.js
│   │   └── 07_web_grimoire.md
|   |   06_modules/                                       
│   │   ├── 01_import_export.md                           
│   │   ├── 01_import_export_solution.js
│   │   ├── 02_module_patterns.md                        
│   │   ├── 02_module_patterns_solution.js
│   │   └── 03_modules_grimoire.md
│   └── 07_regex/                                       
│       ├── 01_regex_basics.md                           
│       ├── 01_regex_basics_solution.js
│       ├── 02_regex_combat.md                          
│       ├── 02_regex_combat_solution.js
│       ├── 03_regex_extractor.md                         
│       ├── 03_regex_extractor_solution.js
│       └── 04_regex_grimoire.md
│
├── 02_async/
│   ├── 01_callbacks/
│   │   ├── 01_callback_maze.md
│   │   ├── 01_callback_maze_solution.js
│   │   ├── 02_callback_challenge.md
│   │   ├── 02_callback_challenge_solution.js
│   │   └── 03_callbacks_grimoire.md
│   ├── 02_promises/
│   │   ├── 01_promise_race.md
│   │   ├── 01_promise_race_solution.js
│   │   ├── 02_promise_chain_reactor.md
│   │   ├── 02_promise_chain_reactor_solution.js
│   │   └── 03_promises_grimoire.md
│   ├── 03_async_await/
│   │   ├── 01_async_jungle.md
│   │   ├── 01_async_jungle_solution.js
│   │   ├── 02_async_rescue.md
│   │   ├── 02_async_rescue_solution.js
│   │   └── 03_async_grimoire.md
│   └── 04_event_loop/
│       ├── 01_microtask_madness.md
│       ├── 01_microtask_madness_solution.js
│       ├── 02_macrotask_monsters.md
│       ├── 02_macrotask_monsters_solution.js
│       └── 03_event_loop_grimoire.md
│
├── 03_testing_first/
│   ├── 01_why_testing_or_die.md
│   ├── 01_why_testing_or_die_solution.js
│   ├── 02_unit_sniper.md
│   ├── 02_unit_sniper_solution.js
│   ├── 03_jest_crash_course.md
│   ├── 03_jest_crash_course_solution.js
│   ├── 04_mocking_madness.md
│   ├── 04_mocking_madness_solution.js
│   ├── 05_integration_reactor.md
│   ├── 05_integration_reactor_solution.js
│   ├── 06_tdd_arena.md
│   ├── 06_tdd_arena_solution.js
│   ├── 07_test_driven_refactor.md
│   ├── 07_test_driven_refactor_solution.js
│   ├── 08_contract_testing_pact.md
│   ├── 08_contract_testing_pact_solution.js
│   ├── 09_e2e_playwright_beast.md
│   ├── 09_e2e_playwright_beast_solution.js
│   └── 10_testing_grimoire.md
│
├── 04_error_handling/
│   ├── 01_try_catch_basics.md
│   ├── 01_try_catch_basics_solution.js
│   ├── 02_custom_errors.md
│   ├── 02_custom_errors_solution.js
│   ├── 03_error_propagation.md
│   ├── 03_error_propagation_solution.js
│   ├── 04_async_error_traps.md
│   ├── 04_async_error_traps_solution.js
│   ├── 05_error_strategy.md
│   ├── 05_error_strategy_solution.js
│   └── 06_error_grimoire.md
│
├── 05_math_basics/
│   ├── 01_boolean_logic.md
│   ├── 01_boolean_logic_solution.js
│   ├── 02_modular_arithmetic.md
│   ├── 02_modular_arithmetic_solution.js
│   ├── 03_bit_manipulation.md
│   ├── 03_bit_manipulation_solution.js
│   ├── 04_hashing_basics.md
│   ├── 04_hashing_basics_solution.js
│   ├── 05_probability_random.md
│   ├── 05_probability_random_solution.js
│   ├── 06_combinatorics_lite.md
│   ├── 06_combinatorics_lite_solution.js
│   ├── 07_geometry_for_dev.md
│   ├── 07_geometry_for_dev_solution.js
│   └── 08_math_grimoire.md
│
├── 06_memory_performance/
│   ├── 01_gc/
│   │   ├── 01_gc_basics.md
│   │   ├── 01_gc_basics_solution.js
│   │   ├── 02_gc_simulator.md
│   │   └── 02_gc_simulator_solution.js
│   ├── 02_copy_vs_ref/
│   │   ├── 01_shallow_vs_deep.md
│   │   ├── 01_shallow_vs_deep_solution.js
│   │   ├── 02_mutation_minefield.md
│   │   └── 02_mutation_minefield_solution.js
│   ├── 03_complexity/
│   │   ├── 01_big_o_basics.md
│   │   ├── 01_big_o_basics_solution.js
│   │   ├── 02_complexity_analysis.md
│   │   ├── 02_complexity_analysis_solution.js
│   │   ├── 03_runtime_race.md
│   │   └── 03_runtime_race_solution.js
│   ├── 04_profiling/
│   │   ├── 01_profiling_basics.md
│   │   ├── 01_profiling_basics_solution.js
│   │   ├── 02_memory_leak_hunter.md
│   │   ├── 02_memory_leak_hunter_solution.js
│   │   ├── 03_devtools_deep_dive.md
│   │   └── 03_devtools_deep_dive_solution.js
│   ├── 05_core_web_vitals/
│   │   ├── 01_lcp_inp_cls_basics.md
│   │   ├── 01_lcp_inp_cls_basics_solution.js
│   │   ├── 02_lighthouse_audit.md
│   │   ├── 02_lighthouse_audit_solution.js
│   │   ├── 03_perf_budget_enforcer.md
│   │   └── 03_perf_budget_enforcer_solution.js
│   └── 06_memory_perf_grimoire.md
│
├── 07_data_structures/
│   ├── 01_array/
│   │   ├── 01_array_basics.md
│   │   ├── 01_array_basics_solution.js
│   │   ├── 02_array_methods_battle.md
│   │   └── 02_array_methods_battle_solution.js
│   ├── 02_linked_list/
│   │   ├── 01_linked_list_basics.md
│   │   ├── 01_linked_list_basics_solution.js
│   │   ├── 02_linked_list_arena.md
│   │   └── 02_linked_list_arena_solution.js
│   ├── 03_stack/
│   │   ├── 01_stack_basics.md
│   │   ├── 01_stack_basics_solution.js
│   │   ├── 02_stack_missions.md
│   │   └── 02_stack_missions_solution.js
│   ├── 04_queue/
│   │   ├── 01_queue_basics.md
│   │   ├── 01_queue_basics_solution.js
│   │   ├── 02_queue_challenges.md
│   │   └── 02_queue_challenges_solution.js
│   ├── 05_heap/
│   │   ├── 01_heap_basics.md
│   │   ├── 01_heap_basics_solution.js
│   │   ├── 02_heap_priority_queue.md
│   │   └── 02_heap_priority_queue_solution.js
│   ├── 06_bst/
│   │   ├── 01_bst_basics.md
│   │   ├── 01_bst_basics_solution.js
│   │   ├── 02_bst_traversal.md
│   │   └── 02_bst_traversal_solution.js
│   ├── 07_hash_table/
│   │   ├── 01_hash_table_basics.md
│   │   ├── 01_hash_table_basics_solution.js
│   │   ├── 02_hash_table_arena.md
│   │   └── 02_hash_table_arena_solution.js
│   ├── 08_graphs/
│   │   ├── 01_graph_basics.md
│   │   ├── 01_graph_basics_solution.js
│   │   ├── 02_graph_bfs_dfs.md
│   │   ├── 02_graph_bfs_dfs_solution.js
│   │   ├── 03_graph_challenges.md
│   │   └── 03_graph_challenges_solution.js
│   ├── 09_advanced_bonus/
│   │   ├── 01_union_find.md
│   │   ├── 01_union_find_solution.js
│   │   ├── 02_fenwick_tree.md
│   │   ├── 02_fenwick_tree_solution.js
│   │   ├── 03_suffix_array.md
│   │   └── 03_suffix_array_solution.js
│   └── 10_data_structures_grimoire.md
│
├── 08_algorithms/
│   ├── 01_sorting/
│   │   ├── 01_bubble_insertion.md
│   │   ├── 01_bubble_insertion_solution.js
│   │   ├── 02_merge_sort.md
│   │   ├── 02_merge_sort_solution.js
│   │   ├── 03_quick_sort.md
│   │   ├── 03_quick_sort_solution.js
│   │   ├── 04_sorting_race.md
│   │   └── 04_sorting_race_solution.js
│   ├── 02_searching/
│   │   ├── 01_linear_binary.md
│   │   ├── 01_linear_binary_solution.js
│   │   ├── 02_search_challenges.md
│   │   └── 02_search_challenges_solution.js
│   ├── 03_dynamic_programming/
│   │   ├── 01_dp_basics.md
│   │   ├── 01_dp_basics_solution.js
│   │   ├── 02_dp_classics.md
│   │   ├── 02_dp_classics_solution.js
│   │   ├── 03_dp_matrix.md
│   │   └── 03_dp_matrix_solution.js
│   ├── 04_greedy/
│   │   ├── 01_greedy_basics.md
│   │   ├── 01_greedy_basics_solution.js
│   │   ├── 02_greedy_missions.md
│   │   └── 02_greedy_missions_solution.js
│   ├── 05_backtracking/
│   │   ├── 01_backtracking_basics.md
│   │   ├── 01_backtracking_basics_solution.js
│   │   ├── 02_backtracking_arena.md
│   │   └── 02_backtracking_arena_solution.js
│   ├── 06_graph_algorithms/
│   │   ├── 01_dijkstra.md
│   │   ├── 01_dijkstra_solution.js
│   │   ├── 02_astar.md
│   │   ├── 02_astar_solution.js
│   │   ├── 03_topological_sort.md
│   │   └── 03_topological_sort_solution.js
│   └── 07_algorithms_grimoire.md
│
├── 09_functional_js/
│   ├── 01_pure_functions.md
│   ├── 01_pure_functions_solution.js
│   ├── 02_immutability.md
│   ├── 02_immutability_solution.js
│   ├── 03_composition.md
│   ├── 03_composition_solution.js
│   ├── 04_currying.md
│   ├── 04_currying_solution.js
│   ├── 05_partial_application.md
│   ├── 05_partial_application_solution.js
│   ├── 06_fp_challenge.md
│   ├── 06_fp_challenge_solution.js
│   └── 07_fp_grimoire.md
│
├── 10_design_patterns/
│   ├── 01_creational/
│   │   ├── 01_factory_pattern.md
│   │   ├── 01_factory_pattern_solution.js
│   │   ├── 02_singleton_pattern.md
│   │   ├── 02_singleton_pattern_solution.js
│   │   ├── 03_builder_pattern.md
│   │   └── 03_builder_pattern_solution.js
│   ├── 02_structural/
│   │   ├── 01_decorator_pattern.md
│   │   ├── 01_decorator_pattern_solution.js
│   │   ├── 02_adapter_pattern.md
│   │   ├── 02_adapter_pattern_solution.js
│   │   ├── 03_proxy_pattern.md
│   │   └── 03_proxy_pattern_solution.js
│   ├── 03_behavioral/
│   │   ├── 01_observer_pattern.md
│   │   ├── 01_observer_pattern_solution.js
│   │   ├── 02_strategy_pattern.md
│   │   ├── 02_strategy_pattern_solution.js
│   │   ├── 03_command_pattern.md
│   │   └── 03_command_pattern_solution.js
│   └── 04_patterns_grimoire.md
│
├── 11_refactoring/
│   ├── 01_clean_code_basics.md
│   ├── 01_clean_code_basics_solution.js
│   ├── 02_solid_principles.md
│   ├── 02_solid_principles_solution.js
│   ├── 03_code_smells.md
│   ├── 03_code_smells_solution.js
│   ├── 04_refacto_in_action.md
│   ├── 04_refacto_in_action_solution.js
│   ├── 05_refacto_challenge.md
│   ├── 05_refacto_challenge_solution.js
│   └── 06_refacto_grimoire.md
│
├── 12_typescript/
│   ├── 01_ts_basics/
│   │   ├── 01_types_and_interfaces.md
│   │   ├── 01_types_and_interfaces_solution.ts
│   │   ├── 02_functions_typed.md
│   │   ├── 02_functions_typed_solution.ts
│   │   ├── 03_classes_typed.md
│   │   └── 03_classes_typed_solution.ts
│   ├── 02_ts_intermediate/
│   │   ├── 01_generics.md
│   │   ├── 01_generics_solution.ts
│   │   ├── 02_utility_types.md
│   │   ├── 02_utility_types_solution.ts
│   │   ├── 03_union_intersection.md
│   │   ├── 03_union_intersection_solution.ts
│   │   ├── 04_type_guards.md
│   │   └── 04_type_guards_solution.ts
│   ├── 03_ts_advanced/
│   │   ├── 01_conditional_types.md
│   │   ├── 01_conditional_types_solution.ts
│   │   ├── 02_mapped_types.md
│   │   ├── 02_mapped_types_solution.ts
│   │   ├── 03_ts_in_real_project.md
│   │   └── 03_ts_in_real_project_solution.ts
│   └── 04_typescript_grimoire.md
│
├── 13_runtime_env/
│   ├── 01_node_vs_browser.md
│   ├── 01_node_vs_browser_solution.js
│   ├── 02_streams_buffers.md
│   ├── 02_streams_buffers_solution.js
│   ├── 03_commonjs_vs_esm.md
│   ├── 03_commonjs_vs_esm_solution.js
│   ├── 04_process_env_argv.md
│   ├── 04_process_env_argv_solution.js
│   ├── 05_worker_threads.md
│   ├── 05_worker_threads_solution.js
│   ├── 06_node_cli_scripts/
│   │   ├── 01_cli_basics.md
│   │   ├── 01_cli_basics_solution.js
│   │   ├── 02_filesystem_ops.md
│   │   ├── 02_filesystem_ops_solution.js
│   │   ├── 03_automation_scripts.md
│   │   ├── 03_automation_scripts_solution.js
│   │   ├── 04_cli_tool_builder.md
│   │   └── 04_cli_tool_builder_solution.js
│   └── 07_runtime_grimoire.md
│
├── 14_architecture_patterns/
│   ├── 01_module_pattern.md
│   ├── 01_module_pattern_solution.js
│   ├── 02_mvc_pattern.md
│   ├── 02_mvc_pattern_solution.js
│   ├── 03_clean_architecture.md
│   ├── 03_clean_architecture_solution.js
│   ├── 04_event_driven.md
│   ├── 04_event_driven_solution.js
│   ├── 05_microservices_intro.md
│   ├── 05_microservices_intro_solution.js
│   └── 06_architecture_grimoire.md
│
├── 15_web_concepts/
│   ├── 01_http_rest_basics.md
│   ├── 01_http_rest_basics_solution.js
│   ├── 02_browser_render_pipeline.md
│   ├── 02_browser_render_pipeline_solution.js
│   ├── 03_state_and_dataflow.md
│   ├── 03_state_and_dataflow_solution.js
│   ├── 04_caching_strategies.md
│   ├── 04_caching_strategies_solution.js
│   ├── 05_auth_authz.md
│   ├── 05_auth_authz_solution.js
│   ├── 06_serialization.md
│   ├── 06_serialization_solution.js
│   ├── 07_seo_and_rendering.md
│   ├── 07_seo_and_rendering_solution.js
│   └── 08_web_concepts_grimoire.md
│
├── 16_accessibility/
│   ├── 01_a11y_why_it_matters.md
│   ├── 01_a11y_why_it_matters_solution.js
│   ├── 02_aria_basics.md
│   ├── 02_aria_basics_solution.js
│   ├── 03_keyboard_navigation.md
│   ├── 03_keyboard_navigation_solution.js
│   ├── 04_contrast_and_colors.md
│   ├── 04_contrast_and_colors_solution.js
│   ├── 05_screen_readers.md
│   ├── 05_screen_readers_solution.js
│   ├── 06_a11y_audit.md
│   ├── 06_a11y_audit_solution.js
│   └── 07_a11y_grimoire.md
│
├── 17_i18n/
│   ├── 01_i18n_basics.md
│   ├── 01_i18n_basics_solution.js
│   ├── 02_dates_timezones.md
│   ├── 02_dates_timezones_solution.js
│   ├── 03_number_formats.md
│   ├── 03_number_formats_solution.js
│   ├── 04_pluralization.md
│   ├── 04_pluralization_solution.js
│   ├── 05_i18n_in_project.md
│   ├── 05_i18n_in_project_solution.js
│   └── 06_i18n_grimoire.md
│
├── 18_realtime/
│   ├── 01_websockets/
│   │   ├── 01_ws_basics.md
│   │   ├── 01_ws_basics_solution.js
│   │   ├── 02_ws_chat_room.md
│   │   └── 02_ws_chat_room_solution.js
│   ├── 02_sse/
│   │   ├── 01_sse_basics.md
│   │   ├── 01_sse_basics_solution.js
│   │   ├── 02_sse_live_feed.md
│   │   └── 02_sse_live_feed_solution.js
│   ├── 03_webrtc/
│   │   ├── 01_webrtc_concepts.md
│   │   ├── 01_webrtc_concepts_solution.js
│   │   ├── 02_webrtc_demo.md
│   │   └── 02_webrtc_demo_solution.js
│   └── 04_realtime_grimoire.md
│
├── 19_api_craft/
│   ├── 01_express_from_scratch.md
│   ├── 01_express_from_scratch_solution.js
│   ├── 02_rest_crud_complete.md
│   ├── 02_rest_crud_complete_solution.js
│   ├── 03_error_handling_api.md
│   ├── 03_error_handling_api_solution.js
│   ├── 04_auth_jwt.md
│   ├── 04_auth_jwt_solution.js
│   ├── 05_graphql_basics.md
│   ├── 05_graphql_basics_solution.js
│   ├── 06_api_versioning.md
│   ├── 06_api_versioning_solution.js
│   ├── 07_openapi_swagger.md
│   ├── 07_openapi_swagger_solution.js
│   └── 08_api_grimoire.md
│
├── 20_security/
│   ├── 01_xss_injection.md
│   ├── 01_xss_injection_solution.js
│   ├── 02_csrf_cors.md
│   ├── 02_csrf_cors_solution.js
│   ├── 03_prototype_pollution.md
│   ├── 03_prototype_pollution_solution.js
│   ├── 04_auth_flows.md
│   ├── 04_auth_flows_solution.js
│   ├── 05_hashing_bcrypt.md
│   ├── 05_hashing_bcrypt_solution.js
│   ├── 06_owasp_checklist.md
│   ├── 06_owasp_checklist_solution.js
│   └── 07_security_grimoire.md
│
├── 21_ai_native_dev/
│   ├── 01_ai_workflow.md
│   ├── 01_ai_workflow_solution.js
│   ├── 02_prompt_engineering.md
│   ├── 02_prompt_engineering_solution.js
│   ├── 03_validate_ai_output.md
│   ├── 03_validate_ai_output_solution.js
│   ├── 04_ai_refactor_partner.md
│   ├── 04_ai_refactor_partner_solution.js
│   ├── 05_ai_test_generator.md
│   ├── 05_ai_test_generator_solution.js
│   └── 06_ai_grimoire.md
│
├── 22_databases/
│   ├── 01_sql_basics.md
│   ├── 01_sql_basics_solution.js
│   ├── 02_nosql_basics.md
│   ├── 02_nosql_basics_solution.js
│   ├── 03_data_modeling.md
│   ├── 03_data_modeling_solution.js
│   ├── 04_redis_caching.md
│   ├── 04_redis_caching_solution.js
│   ├── 05_db_in_js.md
│   ├── 05_db_in_js_solution.js
│   └── 06_databases_grimoire.md
│
├── 23_scalability/
│   ├── 01_load_balancing.md
│   ├── 01_load_balancing_solution.js
│   ├── 02_horizontal_vs_vertical.md
│   ├── 02_horizontal_vs_vertical_solution.js
│   ├── 03_rate_limiting.md
│   ├── 03_rate_limiting_solution.js
│   ├── 04_message_queues.md
│   ├── 04_message_queues_solution.js
│   └── 05_scalability_grimoire.md
│
├── 24_observability/
│   ├── 01_structured_logging.md
│   ├── 01_structured_logging_solution.js
│   ├── 02_distributed_tracing.md
│   ├── 02_distributed_tracing_solution.js
│   ├── 03_metrics_alerting.md
│   ├── 03_metrics_alerting_solution.js
│   ├── 04_sentry_in_prod.md
│   ├── 04_sentry_in_prod_solution.js
│   ├── 05_debug_in_prod.md
│   ├── 05_debug_in_prod_solution.js
│   └── 06_observability_grimoire.md
│
├── 25_team_craft/
│   ├── 01_code_review.md
│   ├── 01_code_review_solution.js
│   ├── 02_adr_writing.md
│   ├── 02_adr_writing_solution.js
│   ├── 03_technical_writing.md
│   ├── 03_technical_writing_solution.js
│   ├── 04_navigate_codebase.md
│   ├── 04_navigate_codebase_solution.js
│   ├── 05_pair_programming.md
│   ├── 05_pair_programming_solution.js
│   └── 06_team_grimoire.md
│
├── 26_edge_cases/
│   ├── 01_nan_undefined_null.md
│   ├── 01_nan_undefined_null_solution.js
│   ├── 02_floating_point.md
│   ├── 02_floating_point_solution.js
│   ├── 03_weird_coercions.md
│   ├── 03_weird_coercions_solution.js
│   ├── 04_prototype_chain_dark.md
│   ├── 04_prototype_chain_dark_solution.js
│   └── 05_edge_cases_grimoire.md
│
├── 28_mini_projects/
│   ├── 01_rasengan_engine/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   ├── 02_garo_no_kronika/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   ├── 03_walking_dead_protocol/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   ├── 04_breaking_cache/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   ├── 05_prison_break_api/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   ├── 06_ultras_dashboard/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   ├── 07_ballon_dor_cli/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   └── 08_trapsoul_radio/
│       ├── cahierdescharges.md
│       ├── README.md
│       ├── TDD_JOURNAL.md
│       ├── POSTMORTEM.md
│       ├── ADR/
│       ├── src/
│       └── tests/
│   └── 09_oracle_glitch/
│       ├── cahierdescharges.md
│       ├── README.md
│       ├── TDD_JOURNAL.md
│       ├── POSTMORTEM.md
│       ├── ADR/
│       ├── src/
│       └── tests/
│
├── 29_annexes/
│   ├── toolchain/
│   │   ├── 01_git_survival.md
│   │   ├── 02_vscode_setup.md
│   │   ├── 03_package_managers.md
│   │   ├── 04_bundlers.md
│   │   ├── 05_docker_basics.md
│   │   └── 06_cicd_basics.md
│   └── typescript_advanced/
│       ├── 01_declaration_files.ts
│       ├── 02_ts_compiler_config.md
│       └── 03_ts_migration_guide.md
│
└── 30_tools/
    ├── 01_logger.js
    ├── 02_helper_functions.js
    ├── 03_array_utils.js
    ├── 04_benchmark.js
    ├── 05_debug_toolkit.js
    └── 06_devtools_cheatsheet.md
```

---

## Les projets

Les 9 mini-projets couvrent l'ensemble du curriculum. Chaque projet est un assemblage réel
de 3 à 4 modules : pas d'exercice théorique, pas de "implémente une fonction map". Des
systèmes qui ont une raison d'exister, des contraintes qui forcent de vraies décisions.

```
01_rasengan_engine       =>  01_fundamentals + 05_math + 09_functional_js + 10_design_patterns
02_garo_no_kronika       =>  02_async + 03_error_handling + 18_realtime + 14_architecture
03_walking_dead_protocol =>  04_testing + 11_refactoring + 13_runtime_env + 30_tools
04_breaking_cache        =>  07_data_structures + 08_algorithms + 06_memory_performance
05_prison_break_api      =>  19_api_craft + 20_security + 22_databases + 15_web_concepts
06_ultras_dashboard      =>  24_observability + 23_scalability + 12_typescript
07_ballon_dor_cli        =>  13_runtime_env + 11_refactoring + 03_error_handling + 29_annexes
08_trapsoul_radio        =>  12_typescript + 15_web_concepts + 16_accessibility + 17_i18n
09_oracle_glitch         =>  21_ai_native_dev + 27_oop_js + 25_team_craft + 26_edge_cases
```

---

### 01_rasengan_engine/ : Le moteur de jutsu de Naruto

**Modules couverts :** `01_fundamentals` · `05_math_basics` · `09_functional_js` · `10_design_patterns`

Naruto veut un simulateur de combat textuel. Chaque ninja a des stats (chakra, vitesse, force), une liste de jutsus, et un style de combat. Le moteur calcule les dégâts, gère les cooldowns, résout les esquives. Le tout sans une seule mutation d'état : chaque tour retourne un nouvel état, jamais modifié.

C'est le premier projet. Ici t'apprends à penser fonctionnel, à composer des comportements, à utiliser les maths comme des armes. Pas de framework. Pas de bibliothèque. Du JS pur.

- Fonctions pures et composition (`pipe`, `compose`) pour assembler les capacités de chaque ninja
- Immutabilité totale : `Object.freeze`, spread, jamais de mutation directe sur les stats
- Strategy pattern pour les jutsus : chaque technique est une fonction interchangeable
- Factory pattern pour créer les ninjas et leurs configurations
- Probabilité et RNG pour les critiques, les esquives, les ratés
- Arithmétique modulaire pour les cycles de chakra et les cooldowns
- HOF : `map`, `filter`, `reduce` comme seuls outils de transformation de l'état de combat

---

### 02_garo_no_kronika/ : La Chronique des Chevaliers de la Flamme

**Modules couverts :** `02_async` · `03_error_handling` · `18_realtime` · `14_architecture_patterns`

Inspiré de Garo Honoo no Kokuin. Des Chevaliers d'Or patrouillent les villes la nuit. Chaque apparition d'un Horror déclenche une alerte asynchrone : le Chevalier le plus proche reçoit la mission, prépare son armure avec un délai, combat, et le résultat est streamé en direct vers le Conseil de Surveillance. Si le combat dépasse 99.9 secondes, l'armure se désintègre. Erreur fatale. Propagation immédiate.

- Dispatcher de missions asynchrone : chaque alerte Horror est une Promise chainée
- `Promise.race` pour gérer la limite des 99.9 secondes d'armure
- `Promise.allSettled` pour les combats simultanés dans plusieurs quartiers
- SSE pour streamer les events de combat vers le Conseil en temps réel
- Event-driven architecture : chaque action déclenche des réactions en cascade
- Module pattern pour isoler chaque Chevalier et ses capacités
- Stratégie d'erreur complète : `HorrorEscapeError`, `ArmorCollapseError`, `KnightDownError`
- Fail-fast sur les missions critiques, fallback sur les missions secondaires

---

### 03_walking_dead_protocol/ : Le protocole de survie des survivants

**Modules couverts :** `04_testing` · `11_refactoring` · `13_runtime_env` · `30_tools`

Le groupe de Rick Grimes a besoin d'un système de gestion de camp : inventaire, rotations de garde, rations alimentaires, niveaux de sécurité. Le code existe déjà. Il a été écrit en pleine apocalypse zombie, la nuit, sous la pression. C'est du spaghetti. Personne ne sait ce qu'il fait. Zéro test.

Ton boulot : ne jamais ajouter de feature avant d'avoir des tests. Refactorer sans rien casser. Transformer ce camp en forteresse de code propre.

- Suite de tests complète sur un codebase existant : unit, intégration, E2E avec Playwright
- TDD pur pour chaque nouvelle feature : le test arrive avant le code, toujours
- Mocking et spies : simuler des attaques de zombies sans vrais zombies
- Refactoring SOLID complet : v1 spaghetti → v2 modulaire — SRP, OCP, DIP appliqués sur du code réel
- Code smells identifiés et corrigés un par un
- CLI Node.js pour automatiser les rapports de camp et les alertes de rations
- Worker Threads pour paralléliser les simulations de menace
- `30_tools` intégré au pipeline : logger structuré, benchmark, debug toolkit

---

### 04_breaking_cache/ : La cuisine de Walter White

**Modules couverts :** `07_data_structures` · `08_algorithms` · `06_memory_performance`

Walter White a besoin d'optimiser sa supply chain. Il a des distributeurs, des routes, des stocks, des niveaux de menace. Chaque décision doit être calculée à froid, avec précision. Le réseau de distribution est un graphe. Les priorités sont gérées par un heap. Chaque algorithme tourne sous profilage : Walter ne tolère pas les inefficacités.

- Graphe orienté pondéré pour modéliser le réseau de distribution (villes, routes, risques)
- Dijkstra pour trouver les chemins de livraison les plus sûrs
- Min-heap pour prioriser les urgences : pénurie, concurrence, danger immédiat
- BFS pour détecter les routes compromises, DFS pour l'exploration complète du réseau
- Merge Sort et Quick Sort sur les lots : analyse comparative dans quel contexte chacun gagne
- Dynamic Programming : optimisation du stock sous contraintes (knapsack)
- `performance.now()` et profilage sur chaque algo : aucun algo non mesuré n'est accepté
- Big-O analysis complète : O(1), O(log n), O(n log n), O(n²) — le coût de chaque décision

---

### 05_prison_break_api/ : L'évasion de Fox River

**Modules couverts :** `19_api_craft` · `20_security` · `22_databases` · `15_web_concepts`

Michael Scofield a besoin d'une infrastructure. Chaque prisonnier a un profil, chaque section de la prison a des access logs, et le plan d'évasion est une série d'endpoints sécurisés. L'API doit tenir sous pression, ne jamais exposer d'info sensible, et résister aux tentatives d'injection de T-Bag qui essaie de hacker le système depuis l'intérieur.

- API REST Express complète : CRUD sur les profils, plans d'évasion, sections de la prison
- Auth JWT avec sign, verify, refresh — chaque endpoint vérifie qui tu es
- Bcrypt sur tous les mots de passe : T-Bag ne trouvera rien d'utile dans la DB
- Rate limiting par IP : pas de brute force sur l'endpoint de login
- Sanitization contre XSS, injection SQL et prototype pollution
- Modélisation de DB : relations profils / plans / sections, indexes sur les colonnes critiques
- Redis pour cacher les plans souvent consultés, TTL et invalidation
- OpenAPI doc : chaque endpoint documenté, chaque erreur spécifiée
- Browser render pipeline, state et dataflow : ce qui se passe entre la requête et l'affichage
- Caching strategies : quand mettre en cache, quand invalider, quand ne pas cacher

---

### 06_ultras_dashboard/ : Le dashboard d'analytics d'un club de foot

**Modules couverts :** `24_observability` · `23_scalability` · `12_typescript`

Le club de foot le plus suivi de la saison. Des milliers d'ultras connectés en même temps. Des données de match qui arrivent à 200 events par minute. Un dashboard qui doit afficher possession, xG, heatmap de passes, alertes en temps réel — sans jamais tomber. Si le serveur crash pendant un match, les ultras brûlent tout.

- Pipeline d'ingestion d'events de match typé TypeScript de bout en bout
- Structured JSON logging sur chaque event avec correlation IDs
- Distributed tracing : suivre une requête de l'event de match jusqu'à l'affichage
- Métriques et alerting : seuils de latence, taux d'erreur, alertes automatiques
- Sentry en prod : `captureException`, `setContext`, release tracking
- Rate limiting sur l'endpoint live : protéger sans couper les ultras légitimes
- Scale horizontal simulé : plusieurs instances, load balancing, message queues
- Generics TypeScript sur tout le pipeline : `Event<T>`, `Pipeline<Input, Output>`
- Utility types sur les structs d'events : `Readonly`, `Pick`, `Omit`, `Record`

---

### 07_ballon_dor_cli/ : Le vote du Ballon d'Or en terminal

**Modules couverts :** `13_runtime_env` · `11_refactoring` · `03_error_handling` · `29_annexes`

Les journalistes du monde entier votent. Les points s'agrègent. Le classement se met à jour en direct. Commandes disponibles : `vote`, `rank`, `simulate`, `reset`, `export`. La v1 a été codée en une nuit par un stagiaire. Elle fonctionne. Mais elle est illisible. La v2, c'est toi qui l'écris. Et cette fois, elle est containerisée, testée, et déployée proprement.

- CLI Node.js complet : `process.argv`, parsing de flags, affichage formaté dans le terminal
- Filesystem : lecture/écriture JSON pour la persistance des votes entre sessions
- Worker Threads pour paralléliser les simulations de vote massif
- Custom errors : `InvalidVoteError`, `PlayerNotFoundError`, `QuotaExceededError`
- Propagation d'erreurs : qui gère quoi et à quel niveau du CLI
- Refactoring complet v1 → v2 : SOLID sur du code CLI procédural, code smells éliminés
- Toolchain via `29_annexes` : Git workflow propre, Docker pour containeriser, CI/CD sur chaque push
- Scripts d'automatisation : générer des votes de test, exporter le classement en CSV

---

### 08_trapsoul_radio/ : La radio underground qui ne dort jamais

**Modules couverts :** `12_typescript` · `15_web_concepts` · `16_accessibility` · `17_i18n`

Une plateforme de radio web dédiée au trapsoul, au RnB et au country underground. Des artistes du monde entier. Des auditeurs de toutes les langues. Une interface qui doit fonctionner au clavier, à la souris, aux lecteurs d'écran, et en 4 langues sans que le code parte en vrille. Si un auditeur aveugle ne peut pas naviguer, la radio ne sort pas.

- Interface TypeScript de bout en bout : types stricts, interfaces, generics sur les tracks et playlists
- Clés de traduction typées en TS : si une clé n'existe pas, erreur de compilation
- 4 locales : français, anglais, japonais, malgache — pluralisation et dates formatées par locale
- `Intl.DateTimeFormat` et `Intl.NumberFormat` pour chaque locale sans bibliothèque externe
- ARIA roles complets : `role="radio"`, `aria-live` sur les updates de track en cours
- Navigation clavier : tab order logique, focus visible, skip links, focus trap dans les modals
- Contraste WCAG AA vérifié sur toutes les couleurs de l'interface
- Browser render pipeline optimisé : LCP, INP, CLS sous les seuils Google
- SEO et rendering : métadonnées dynamiques, SSR sur les pages d'artistes

---

### 09_oracle_glitch/ : Le LLM qui hallucine et toi qui le surveilles

**Modules couverts :** `21_ai_native_dev` · `27_oop_js` · `25_team_craft` · `26_edge_cases`

L'IA se prend pour un génie. Elle analyse ton code JS, détecte des bugs, propose des fixes, génère des tests. Parfois elle a raison. Parfois elle invente des fonctions qui n'existent pas, retourne du JSON malformé, te jure qu'un `NaN === NaN`, ou te sort un `undefined is not a function` en guise de fix. Ton boulot : construire le pipeline qui la surveille, la valide, et la remet à sa place quand elle délire.

C'est ça, coder avec l'IA en 2026. Pas la croire. La contrôler.

- Streaming Anthropic token par token : tu lis pendant que l'IA génère, tu n'attends pas la fin
- Zod comme garde du corps : si la sortie LLM ne matche pas le schema, elle passe pas
- `CodeAnalyzer`, `PromptBuilder`, `OutputValidator` : trois classes OOP, trois responsabilités, zéro spaghetti
- Prototype chain utilisée intentionnellement : `Validator` → `StrictValidator` → `LLMOutputValidator`
- Mixins pour composer les comportements de validation sans hériter de tout
- Edge cases injectés comme des pièges réels : timeout à 3s, quota dépassé, `NaN` dans les métriques, réponse tronquée à mi-JSON, `undefined` au milieu d'un tableau
- `0.1 + 0.2` dans les métriques de scoring : l'IA ne voit pas le problème, toi tu le catches
- Code review outillée : l'IA propose, tu valides avec des règles, tu approuves ou rejettes
- ADR : chaque décision technique du pipeline documentée avant de coder, pas après
- POSTMORTEM : ce que l'IA a cassé, comment tu l'as vu venir, ce que tu as mis en place

---

## Ce que ce curriculum ne peut pas faire à ta place

Finir ce curriculum te mène à 95 sur 100. Les 5 points restants ne viennent pas d'un
fichier `.js`.

Ils viennent d'avoir survécu à un bug de prod à 2h du matin. D'avoir eu une PR rejetée par
quelqu'un qui t'a expliqué exactement pourquoi ton approche était mauvaise. D'avoir vu un
utilisateur utiliser ton app d'une façon que tu n'avais pas du tout prévue. D'avoir expliqué
un concept à un junior et réalisé que tu ne le comprenais pas aussi bien que tu croyais.

Ces choses-là ne se simulent pas. Elles se vivent. Le curriculum te prépare à les vivre dans
les meilleures conditions possibles. Le reste, c'est le temps, les gens, et les projets réels.

Contribue à au moins un projet open source avant de te dire senior. Une vraie PR, même petite,
mergée par quelqu'un que tu ne connais pas : ça vaut dix modules.

---

## Auteur

**Lovasoarm AKA Aramis**
