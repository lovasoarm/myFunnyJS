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

---

## Architecture complète du projet

```
MyFunnyJS/
├── README.md                                              # Le manifeste CrazyDevs : lis ça avant de coder
├── CONTRIBUTING.md                                        # Comment contribuer sans tout péter
├── CHANGELOG.md                                          # Historique des décisions structurelles majeures
├── jest.config.js                                        # Config Jest partagée par tous les modules
├── .eslintrc.js                                          # Règles ESLint uniformes sur tout le repo
├── .github/
│   └── workflows/
│       └── test.yml                                      # CI : lint + tests sur chaque push
│
│
├── 01_fundamentals/                                      # Les bases : zéro excuse de les ignorer
│   ├── 00_Le_Guide_que_ton_prof_aurait_du_te_donner_le_jour_1.md
│   ├── 01_variables/                                     # Variables : le super pouvoir de base
│   │   ├── 01_intro_variables.md                         # Primitives vs objets, la vérité cachée
│   │   ├── 02_reference_chaos.md                         # Les références qui foutent tout en l'air
│   │   ├── 02_reference_chaos_solution.js
│   │   ├── 03_mutation_madness.md                        # Mutation & copies : shallow vs deep
│   │   ├── 03_mutation_madness_solution.js
│   │   ├── 04_const_trap.md                              # `const` ne veut pas dire immuable
│   │   ├── 04_const_trap_solution.js
│   │   └── 05_variable_glossary.md
│   ├── 02_scope/                                         # Scope & Contexte : où vit ton code ?
│   │   ├── 01_scope_basics.md                            # Global, local, block : les territoires
│   │   ├── 01_scope_basics_solution.js
│   │   ├── 02_closure_trap.md                            # Fermetures et pièges mortels
│   │   ├── 02_closure_trap_solution.js
│   │   ├── 03_scope_escape_room.md                       # Escape room de closures
│   │   ├── 03_scope_escape_room_solution.js
│   │   └── 04_scope_glossary.md
│   ├── 03_functions/                                     # Fonctions : jouets de guerre
│   │   ├── 01_function_basics.md                         # Définition, appel, retour
│   │   ├── 01_function_basics_solution.js
│   │   ├── 02_hof_map_filter.md                          # HOF, map, filter, reduce
│   │   ├── 02_hof_map_filter_solution.js
│   │   ├── 03_function_factory.md                        # Usines à fonctions & patterns
│   │   ├── 03_function_factory_solution.js
│   │   └── 04_function_grimoire.md
│   ├── 04_types/                                         # Types, coercition & dynamisme JS
│   │   ├── 01_primitives.md                              # string, number, boolean, symbol
│   │   ├── 01_primitives_solution.js
│   │   ├── 02_type_coercion.md                           # Conversions implicites et pièges
│   │   ├── 02_type_coercion_solution.js
│   │   ├── 03_type_transformers.md                       # Transformer et vérifier les types
│   │   ├── 03_type_transformers_solution.js
│   │   └── 04_types_grimoire.md
│   ├── 05_web_basics/                                    # Web Fundamentals immersifs
│   │   ├── 01_dom_manipulation.md                        # DOM, sélecteurs, events, animations
│   │   ├── 01_dom_manipulation_solution.js
│   │   ├── 02_fetch_adventure.md                         # Fetch API dans des missions crazys
│   │   ├── 02_fetch_adventure_solution.js
│   │   ├── 03_storage_treasure.md                        # LocalStorage & Cookies comme trésor
│   │   ├── 03_storage_treasure_solution.js
│   │   ├── 04_template_portals.md                        # Template strings & DOM templating
│   │   ├── 04_template_portals_solution.js
│   │   ├── 05_web_helpers.md                             # Fonctions DOM/event réutilisables
│   │   ├── 05_web_helpers_solution.js
│   │   └── 06_web_grimoire.md
│   ├── 06_modules/                                       # Modules ES6 : organiser son code comme un pro
│   │   ├── 01_import_export.md                           # import/export : nommé, default, namespace
│   │   ├── 01_import_export_solution.js
│   │   ├── 02_module_patterns.md                         # Encapsuler, exposer, protéger
│   │   ├── 02_module_patterns_solution.js
│   │   └── 03_modules_grimoire.md
│   └── 07_regex/                                         # Regex : l'arme secrète du parseur
│       ├── 01_regex_basics.md                            # Syntaxe, flags, patterns de base
│       ├── 01_regex_basics_solution.js
│       ├── 02_regex_combat.md                            # Validation email, URL, téléphone
│       ├── 02_regex_combat_solution.js
│       ├── 03_regex_extractor.md                         # Capturer, remplacer, splitter comme un sniper
│       ├── 03_regex_extractor_solution.js
│       └── 04_regex_grimoire.md
│
│
├── 02_async/                                             # L'Event Loop : ton cerveau doit suivre
│   ├── 01_callbacks/                                     # Callbacks : l'ancien monde qui fait encore mal
│   │   ├── 01_callback_maze.md                           # Labyrinthe de callbacks : trouve la sortie
│   │   ├── 01_callback_maze_solution.js
│   │   ├── 02_callback_challenge.md                      # Challenge pratique : sans en mourir
│   │   ├── 02_callback_challenge_solution.js
│   │   └── 03_callbacks_grimoire.md
│   ├── 02_promises/                                      # Promises : l'espoir encodé
│   │   ├── 01_promise_race.md                            # Race entre promesses : que le meilleur gagne
│   │   ├── 01_promise_race_solution.js
│   │   ├── 02_promise_chain_reactor.md                   # Chainage nucléaire : attention aux explosions
│   │   ├── 02_promise_chain_reactor_solution.js
│   │   └── 03_promises_grimoire.md
│   ├── 03_async_await/                                   # Async/await : le futur propre
│   │   ├── 01_async_jungle.md                            # Async dans une jungle de fonctions
│   │   ├── 01_async_jungle_solution.js
│   │   ├── 02_async_rescue.md                            # Opération sauvetage async
│   │   ├── 02_async_rescue_solution.js
│   │   └── 03_async_grimoire.md
│   └── 04_event_loop/                                    # Mono-thread, micro vs macrotasks
│       ├── 01_microtask_madness.md                       # Microtasks en folie totale
│       ├── 01_microtask_madness_solution.js
│       ├── 02_macrotask_monsters.md                      # Macrotasks et timing de monstre
│       ├── 02_macrotask_monsters_solution.js
│       └── 03_event_loop_grimoire.md
│
│
├── 03_error_handling/                                    # Erreurs : survivre sans exploser en prod
│   ├── 01_try_catch_basics.md                            # try/catch : attraper les bombes avant qu'elles explosent
│   ├── 01_try_catch_basics_solution.js
│   ├── 02_custom_errors.md                               # Erreurs custom : créer tes propres messages de guerre
│   ├── 02_custom_errors_solution.js
│   ├── 03_error_propagation.md                           # Propagation : qui gère quoi et où
│   ├── 03_error_propagation_solution.js
│   ├── 04_async_error_traps.md                           # Erreurs async : les plus silencieuses et les plus mortelles
│   ├── 04_async_error_traps_solution.js
│   ├── 05_error_strategy.md                              # Stratégies : fail fast, fail safe, fallback, retry
│   ├── 05_error_strategy_solution.js
│   └── 06_error_grimoire.md
│
│
├── 04_testing/                                           # Tests : pas une option, une religion
│   ├── 01_why_testing_or_die.md                          # Pourquoi tester : avant que la prod explose
│   ├── 01_why_testing_or_die_solution.js
│   ├── 02_unit_sniper.md                                 # Unit tests : tester une fonction comme un sniper
│   ├── 02_unit_sniper_solution.js
│   ├── 03_jest_crash_course.md                           # Jest from scratch : describe, it, expect
│   ├── 03_jest_crash_course_solution.js
│   ├── 04_mocking_madness.md                             # Mocking & spies : simuler la réalité
│   ├── 04_mocking_madness_solution.js
│   ├── 05_async_testing.md                               # Tester l'async : Promises, timers, event emitters
│   ├── 05_async_testing_solution.js
│   ├── 06_tdd_arena.md                                   # TDD : écrire le test avant le code, comme un boss
│   ├── 06_tdd_arena_solution.js
│   ├── 07_test_driven_refactor.md                        # Refactorer en sécurité grâce aux tests
│   ├── 07_test_driven_refactor_solution.js
│   ├── 08_integration_reactor.md                         # Tests d'intégration : plusieurs pièces ensemble
│   ├── 08_integration_reactor_solution.js
│   ├── 09_contract_testing_pact.md                       # Contract testing : API qui tiennent leur promesse
│   ├── 09_contract_testing_pact_solution.js
│   ├── 10_e2e_playwright_beast.md                        # Playwright E2E : tester comme un vrai utilisateur
│   ├── 10_e2e_playwright_beast_solution.js
│   └── 11_testing_grimoire.md
│
│
├── 05_math_basics/                                       # Maths de dev : la potion magique pour hacker le monde
│   ├── 01_boolean_logic.md                               # Vrai ou faux ? Maîtriser les if et && comme un boss
│   ├── 01_boolean_logic_solution.js
│   ├── 02_modular_arithmetic.md                          # Modulo & co : faire rebondir les nombres comme un ninja
│   ├── 02_modular_arithmetic_solution.js
│   ├── 03_bit_manipulation.md                            # Bits : jouer avec des 0 et 1 comme des Lego surpuissants
│   ├── 03_bit_manipulation_solution.js
│   ├── 04_hashing_basics.md                              # Hash : transformer le chaos en lookup instantané
│   ├── 04_hashing_basics_solution.js
│   ├── 05_probability_random.md                          # Probabilité & RNG : le destin entre tes mains
│   ├── 05_probability_random_solution.js
│   ├── 06_combinatorics_lite.md                          # Combinatoires essentielles : factorielle et permutations utiles
│   ├── 06_combinatorics_lite_solution.js
│   ├── 07_geometry_for_dev.md                            # Points, distances & collisions : mage du canvas
│   ├── 07_geometry_for_dev_solution.js
│   └── 08_math_grimoire.md
│
│
├── 06_memory_performance/                                # Mémoire & Performance : comprendre ce qui coûte cher
│   ├── 01_gc/                                            # Garbage Collector : qui nettoie tes saletés ?
│   │   ├── 01_gc_basics.md                               # Bases GC, mark & sweep
│   │   ├── 01_gc_basics_solution.js
│   │   ├── 02_gc_simulator.md                            # Simule le GC toi-même
│   │   └── 02_gc_simulator_solution.js
│   ├── 02_copy_vs_ref/                                   # Shallow vs Deep : le miroir trompeur
│   │   ├── 01_shallow_vs_deep.md                         # Copie superficielle vs profonde
│   │   ├── 01_shallow_vs_deep_solution.js
│   │   ├── 02_mutation_minefield.md                      # Champ de mines de mutations
│   │   └── 02_mutation_minefield_solution.js
│   ├── 03_complexity/                                    # Big-O : mesure tout, optimise tout
│   │   ├── 01_big_o_basics.md                            # O(1) à O(2^n) expliqués comme une carte
│   │   ├── 01_big_o_basics_solution.js
│   │   ├── 02_complexity_analysis.md                     # Analyser des algos réels sans se perdre
│   │   ├── 02_complexity_analysis_solution.js
│   │   ├── 03_runtime_race.md                            # Course de performance en live
│   │   └── 03_runtime_race_solution.js
│   ├── 04_profiling/                                     # Profiling : trouver les goulots d'étranglement
│   │   ├── 01_profiling_basics.md                        # Mesurer avec performance.now() comme un chirurgien
│   │   ├── 01_profiling_basics_solution.js
│   │   ├── 02_memory_leak_hunter.md                      # Chasse aux fuites mémoire : aucune pitié
│   │   ├── 02_memory_leak_hunter_solution.js
│   │   ├── 03_devtools_deep_dive.md                      # DevTools : breakpoints, flame graphs, memory snapshots
│   │   └── 03_devtools_deep_dive_solution.js
│   ├── 05_core_web_vitals/                               # Perf réelle mesurée : ce que Google juge
│   │   ├── 01_lcp_inp_cls_basics.md                      # LCP, INP, CLS : les 3 juges du navigateur
│   │   ├── 01_lcp_inp_cls_basics_solution.js
│   │   ├── 02_lighthouse_audit.md                        # Auditer & scorer une vraie page
│   │   ├── 02_lighthouse_audit_solution.js
│   │   ├── 03_perf_budget_enforcer.md                    # Définir et défendre un budget de performance
│   │   └── 03_perf_budget_enforcer_solution.js
│   └── 06_memory_perf_grimoire.md
│
│
├── 07_data_structures/                                   # Structures de données : les armes secrètes
│   ├── 01_array/                                         # Arrays : le couteau suisse universel
│   │   ├── 01_array_basics.md                            # Création, accès, manipulation fondamentale
│   │   ├── 01_array_basics_solution.js
│   │   ├── 02_array_methods_battle.md                    # map, filter, reduce, find : le tournoi final
│   │   └── 02_array_methods_battle_solution.js
│   ├── 02_linked_list/                                   # Linked List : la chaîne qu'on construit soi-même
│   │   ├── 01_linked_list_basics.md                      # Noeud, insertion, suppression
│   │   ├── 01_linked_list_basics_solution.js
│   │   ├── 02_linked_list_arena.md                       # Inverser, détecter les cycles, survivre
│   │   └── 02_linked_list_arena_solution.js
│   ├── 03_stack/                                         # Stack : LIFO, le tas de pancakes cosmiques
│   │   ├── 01_stack_basics.md                            # Push, pop, peek : la pile qui obéit
│   │   ├── 01_stack_basics_solution.js
│   │   ├── 02_stack_missions.md                          # Parenthèses valides, historique de navigation
│   │   └── 02_stack_missions_solution.js
│   ├── 04_queue/                                         # Queue : FIFO, la file d'attente de l'enfer
│   │   ├── 01_queue_basics.md                            # Enqueue, dequeue : premier arrivé, premier servi
│   │   ├── 01_queue_basics_solution.js
│   │   ├── 02_queue_challenges.md                        # BFS, impressions, systèmes de tickets
│   │   └── 02_queue_challenges_solution.js
│   ├── 05_heap/                                          # Heap : le roi des priorités
│   │   ├── 01_heap_basics.md                             # Min-heap, max-heap : la hiérarchie des valeurs
│   │   ├── 01_heap_basics_solution.js
│   │   ├── 02_heap_priority_queue.md                     # Priority queue : qui passe en premier ?
│   │   └── 02_heap_priority_queue_solution.js
│   ├── 06_bst/                                           # BST : arbres de recherche binaire
│   │   ├── 01_bst_basics.md                              # Insertion, recherche, suppression dans l'arbre
│   │   ├── 01_bst_basics_solution.js
│   │   ├── 02_bst_traversal.md                           # Inorder, preorder, postorder : les 3 chemins
│   │   └── 02_bst_traversal_solution.js
│   ├── 07_hash_table/                                    # Hash Table : la mémoire parfaite du hacker
│   │   ├── 01_hash_table_basics.md                       # Hashing, collisions, chaining
│   │   ├── 01_hash_table_basics_solution.js
│   │   ├── 02_hash_table_arena.md                        # Anagrammes, fréquences, lookup O(1)
│   │   └── 02_hash_table_arena_solution.js
│   ├── 08_graphs/                                        # Graphes : modéliser le monde réel en code
│   │   ├── 01_graph_basics.md                            # Noeud, arête, dirigé vs non-dirigé
│   │   ├── 01_graph_basics_solution.js
│   │   ├── 02_graph_bfs_dfs.md                           # BFS & DFS : naviguer le graphe comme un explorateur
│   │   ├── 02_graph_bfs_dfs_solution.js
│   │   ├── 03_graph_challenges.md                        # Connexité, cycles, composantes
│   │   └── 03_graph_challenges_solution.js
│   ├── 09_advanced_bonus/                                # Structures avancées : pour aller encore plus loin
│   │   ├── 01_union_find.md                              # Union-Find : qui est connecté à qui ?
│   │   ├── 01_union_find_solution.js
│   │   ├── 02_fenwick_tree.md                            # Fenwick Tree : sommes cumulées ultra-rapides (FAANG level)
│   │   ├── 02_fenwick_tree_solution.js
│   │   ├── 03_suffix_array.md                            # Suffix Array : recherche de patterns extrême (FAANG level)
│   │   └── 03_suffix_array_solution.js
│   └── 10_data_structures_grimoire.md
│
│
├── 08_algorithms/                                        # Algorithmes : les patterns qui résolvent tout
│   ├── 01_sorting/                                       # Tri : mettre de l'ordre dans le chaos absolu
│   │   ├── 01_bubble_insertion.md                        # Bubble & Insertion : les classiques à comprendre
│   │   ├── 01_bubble_insertion_solution.js
│   │   ├── 02_merge_sort.md                              # Merge Sort : diviser pour mieux régner
│   │   ├── 02_merge_sort_solution.js
│   │   ├── 03_quick_sort.md                              # Quick Sort : le plus rapide en pratique
│   │   ├── 03_quick_sort_solution.js
│   │   ├── 04_sorting_race.md                            # Course : quel tri gagne dans quel contexte ?
│   │   └── 04_sorting_race_solution.js
│   ├── 02_searching/                                     # Recherche : trouver l'aiguille dans la botte
│   │   ├── 01_linear_binary.md                           # Linear vs Binary : la nuit et le jour
│   │   ├── 01_linear_binary_solution.js
│   │   ├── 02_search_challenges.md                       # Rotation, peak, first/last occurrence
│   │   └── 02_search_challenges_solution.js
│   ├── 03_dynamic_programming/                           # DP : se souvenir pour aller plus vite
│   │   ├── 01_dp_basics.md                               # Memoization & tabulation : les deux visages de la DP
│   │   ├── 01_dp_basics_solution.js
│   │   ├── 02_dp_classics.md                             # Fibonacci, knapsack, coin change
│   │   ├── 02_dp_classics_solution.js
│   │   ├── 03_dp_matrix.md                               # Grid DP : chemins, îles, matrices
│   │   └── 03_dp_matrix_solution.js
│   ├── 04_greedy/                                        # Greedy : prendre le meilleur maintenant
│   │   ├── 01_greedy_basics.md                           # Pourquoi greedy marche (et quand il échoue)
│   │   ├── 01_greedy_basics_solution.js
│   │   ├── 02_greedy_missions.md                         # Intervalles, activités, monnaie
│   │   └── 02_greedy_missions_solution.js
│   ├── 05_backtracking/                                  # Backtracking : essayer, échouer, recommencer
│   │   ├── 01_backtracking_basics.md                     # L'idée : explorer toutes les possibilités sans se perdre
│   │   ├── 01_backtracking_basics_solution.js
│   │   ├── 02_backtracking_arena.md                      # Sudoku, N-Queens, combinaisons
│   │   └── 02_backtracking_arena_solution.js
│   ├── 06_graph_algorithms/                              # Algos de graphes : naviguer l'impossible
│   │   ├── 01_dijkstra.md                                # Dijkstra : le chemin le plus court
│   │   ├── 01_dijkstra_solution.js
│   │   ├── 02_astar.md                                   # A* : Dijkstra avec de l'intuition en plus
│   │   ├── 02_astar_solution.js
│   │   ├── 03_topological_sort.md                        # Tri topologique : qui vient avant qui
│   │   └── 03_topological_sort_solution.js
│   └── 07_algorithms_grimoire.md
│
│
├── 09_functional_js/                                     # JS Fonctionnel : coder sans effets de bord ni regrets
│   ├── 01_pure_functions.md                              # Fonctions pures : toujours le même résultat, zéro surprise
│   ├── 01_pure_functions_solution.js
│   ├── 02_immutability.md                                # Immutabilité : ne jamais modifier, toujours transformer
│   ├── 02_immutability_solution.js
│   ├── 03_composition.md                                 # Composition : assembler des fonctions comme des Lego
│   ├── 03_composition_solution.js
│   ├── 04_currying.md                                    # Currying : une fonction, un argument à la fois
│   ├── 04_currying_solution.js
│   ├── 05_partial_application.md                         # Application partielle : pré-remplir pour réutiliser
│   ├── 05_partial_application_solution.js
│   ├── 06_fp_challenge.md                                # Challenge final : tout assembler en FP pur
│   ├── 06_fp_challenge_solution.js
│   └── 07_fp_grimoire.md
│
│
├── 10_design_patterns/                                   # Design Patterns : les recettes de cuisine du code solide
│   ├── 01_creational/                                    # Créationnels : comment créer des objets intelligemment
│   │   ├── 01_factory_pattern.md                         # Factory : une usine qui sait ce qu'elle fabrique
│   │   ├── 01_factory_pattern_solution.js
│   │   ├── 02_singleton_pattern.md                       # Singleton : une seule instance, un seul roi
│   │   ├── 02_singleton_pattern_solution.js
│   │   ├── 03_builder_pattern.md                         # Builder : construire étape par étape sans devenir fou
│   │   └── 03_builder_pattern_solution.js
│   ├── 02_structural/                                    # Structuraux : comment organiser les objets entre eux
│   │   ├── 01_decorator_pattern.md                       # Decorator : ajouter des pouvoirs sans tout réécrire
│   │   ├── 01_decorator_pattern_solution.js
│   │   ├── 02_adapter_pattern.md                         # Adapter : brancher l'incompatible sans pleurer
│   │   ├── 02_adapter_pattern_solution.js
│   │   ├── 03_proxy_pattern.md                           # Proxy : surveiller et contrôler l'accès
│   │   └── 03_proxy_pattern_solution.js
│   ├── 03_behavioral/                                    # Comportementaux : comment les objets se parlent
│   │   ├── 01_observer_pattern.md                        # Observer : abonné, éditeur, tout le monde est content
│   │   ├── 01_observer_pattern_solution.js
│   │   ├── 02_strategy_pattern.md                        # Strategy : changer d'algorithme à la volée
│   │   ├── 02_strategy_pattern_solution.js
│   │   ├── 03_command_pattern.md                         # Command : encapsuler une action pour l'annuler ou la rejouer
│   │   └── 03_command_pattern_solution.js
│   └── 04_patterns_grimoire.md
│
│
├── 11_refactoring/                                       # Refactoring : écrire du code qui survit à son auteur
│   ├── 01_clean_code_basics.md                           # Nommage, lisibilité, KISS, DRY
│   ├── 01_clean_code_basics_solution.js
│   ├── 02_solid_principles.md                            # SOLID : les 5 commandements de l'architecture
│   ├── 02_solid_principles_solution.js
│   ├── 03_code_smells.md                                 # Code smells : identifier et corriger avant que ça pourrit
│   ├── 03_code_smells_solution.js
│   ├── 04_refacto_in_action.md                           # Refactorer du vrai code sale en quelque chose de propre
│   ├── 04_refacto_in_action_solution.js
│   ├── 05_refacto_challenge.md                           # Challenge : transformer du spaghetti en lasagne propre
│   ├── 05_refacto_challenge_solution.js
│   └── 06_refacto_grimoire.md
│
│
├── 12_typescript/                                        # TypeScript : JS avec un casque et une armure (obligatoire)
│   ├── 01_ts_basics/                                     # Les bases : types, interfaces, la survie
│   │   ├── 01_types_and_interfaces.md
│   │   ├── 01_types_and_interfaces_solution.ts
│   │   ├── 02_functions_typed.md
│   │   ├── 02_functions_typed_solution.ts
│   │   ├── 03_classes_typed.md
│   │   └── 03_classes_typed_solution.ts
│   ├── 02_ts_intermediate/                               # Niveau intermédiaire : là où ça devient utile
│   │   ├── 01_generics.md
│   │   ├── 01_generics_solution.ts
│   │   ├── 02_utility_types.md                           # Partial, Pick, Omit, Record : les outils magiques
│   │   ├── 02_utility_types_solution.ts
│   │   ├── 03_union_intersection.md
│   │   ├── 03_union_intersection_solution.ts
│   │   ├── 04_type_guards.md                             # Vérifier le type à l'exécution
│   │   └── 04_type_guards_solution.ts
│   ├── 03_ts_advanced/                                   # Niveau avancé : pour tenir en code review
│   │   ├── 01_conditional_types.md                       # Types conditionnels : if/else dans le système de types
│   │   ├── 01_conditional_types_solution.ts
│   │   ├── 02_mapped_types.md                            # Mapped types : transformer un type en un autre
│   │   ├── 02_mapped_types_solution.ts
│   │   ├── 03_ts_in_real_project.md                      # TS dans un vrai projet : config, migration, stratégie
│   │   └── 03_ts_in_real_project_solution.ts
│   └── 04_typescript_grimoire.md
│
│
├── 13_runtime_env/                                       # Runtime : là où ton code prend vie (ou meurt)
│   ├── 01_node_vs_browser.md                             # Node vs Browser : les différences qui comptent vraiment
│   ├── 01_node_vs_browser_solution.js
│   ├── 02_streams_buffers.md                             # Streams & Buffers : manipuler des données en flux
│   ├── 02_streams_buffers_solution.js
│   ├── 03_commonjs_vs_esm.md                             # CommonJS vs ESM : l'histoire de deux systèmes de modules
│   ├── 03_commonjs_vs_esm_solution.js
│   ├── 04_process_env_argv.md                            # process, env, argv : les variables secrètes de Node
│   ├── 04_process_env_argv_solution.js
│   ├── 05_worker_threads.md                              # Worker Threads : parallélisme en JS mono-thread
│   ├── 05_worker_threads_solution.js
│   ├── 06_node_cli_scripts/                              # Node CLI : automatiser le monde depuis le terminal
│   │   ├── 01_cli_basics.md                              # Lire les args, parser les flags, afficher proprement
│   │   ├── 01_cli_basics_solution.js
│   │   ├── 02_filesystem_ops.md                          # Lire, écrire, copier, déplacer des fichiers
│   │   ├── 02_filesystem_ops_solution.js
│   │   ├── 03_automation_scripts.md                      # Scripts d'automatisation : fini les tâches répétitives
│   │   ├── 03_automation_scripts_solution.js
│   │   ├── 04_cli_tool_builder.md                        # Construire un vrai outil CLI de A à Z
│   │   └── 04_cli_tool_builder_solution.js
│   └── 07_runtime_grimoire.md
│
│
├── 14_architecture_patterns/                             # Architecture Ninja : construire en grand, penser en sage
│   ├── 01_module_pattern.md                              # Module Pattern : encapsuler, exposer, protéger
│   ├── 01_module_pattern_solution.js
│   ├── 02_mvc_pattern.md                                 # MVC : Model, View, Controller comme des grands
│   ├── 02_mvc_pattern_solution.js
│   ├── 03_clean_architecture.md                          # Clean Architecture : les couches qui ne se mélangent pas
│   ├── 03_clean_architecture_solution.js
│   ├── 04_event_driven.md                                # Event-Driven : réagir plutôt que demander
│   ├── 04_event_driven_solution.js
│   ├── 05_microservices_intro.md                         # Microservices : quand un seul bloc ne suffit plus
│   ├── 05_microservices_intro_solution.js
│   └── 06_architecture_grimoire.md
│
│
├── 15_web_concepts/                                      # Concepts Web : tout ce qu'un ingénieur doit savoir
│   ├── 01_http_rest_basics.md                            # HTTP, verbes REST, status codes : la grammaire du web
│   ├── 01_http_rest_basics_solution.js
│   ├── 02_browser_render_pipeline.md                     # Pipeline de rendu : ce qui se passe entre URL et pixel
│   ├── 02_browser_render_pipeline_solution.js
│   ├── 03_state_and_dataflow.md                          # State & Data Flow : qui sait quoi et quand
│   ├── 03_state_and_dataflow_solution.js
│   ├── 04_caching_strategies.md                          # Caching : vitesse vs fraîcheur, choisir intelligemment
│   ├── 04_caching_strategies_solution.js
│   ├── 05_auth_authz.md                                  # Auth vs Authz : qui tu es, ce que tu peux faire
│   ├── 05_auth_authz_solution.js
│   ├── 06_serialization.md                               # JSON, XML, binaire : parler plusieurs langues de données
│   ├── 06_serialization_solution.js
│   ├── 07_seo_and_rendering.md                           # SEO & Rendering : SSR, SSG, CSR et ce que Google voit
│   ├── 07_seo_and_rendering_solution.js
│   └── 08_web_concepts_grimoire.md
│
│
├── 16_accessibility/                                     # Accessibilité : coder pour tout le monde, pas juste toi
│   ├── 01_a11y_why_it_matters.md                         # Pourquoi l'accessibilité : éthique ET légalité
│   ├── 01_a11y_why_it_matters_solution.js
│   ├── 02_aria_basics.md                                 # ARIA : les attributs qui parlent aux machines
│   ├── 02_aria_basics_solution.js
│   ├── 03_keyboard_navigation.md                         # Navigation clavier : tab, focus, skip links
│   ├── 03_keyboard_navigation_solution.js
│   ├── 04_contrast_and_colors.md                         # Contraste & couleurs : WCAG AA et AAA expliqués
│   ├── 04_contrast_and_colors_solution.js
│   ├── 05_screen_readers.md                              # Lecteurs d'écran : comment ils lisent ton HTML
│   ├── 05_screen_readers_solution.js
│   ├── 06_a11y_audit.md                                  # Auditer une page : axe, Lighthouse, corrections
│   ├── 06_a11y_audit_solution.js
│   └── 07_a11y_grimoire.md
│
│
├── 17_i18n/                                              # Internationalisation : parler toutes les langues sans tout réécrire
│   ├── 01_i18n_basics.md                                 # Locales, traductions, structure de base
│   ├── 01_i18n_basics_solution.js
│   ├── 02_dates_timezones.md                             # Dates & fuseaux : le piège que personne ne voit venir
│   ├── 02_dates_timezones_solution.js
│   ├── 03_number_formats.md                              # Formats numériques : virgule, point, devises selon la locale
│   ├── 03_number_formats_solution.js
│   ├── 04_pluralization.md                               # Pluralisation : 1 chat, 2 chats, zéro chat
│   ├── 04_pluralization_solution.js
│   ├── 05_i18n_in_project.md                             # i18n dans un vrai projet : react-i18next, next-intl
│   ├── 05_i18n_in_project_solution.js
│   └── 06_i18n_grimoire.md
│
│
├── 18_realtime/                                          # Real-Time : le web qui respire en direct
│   ├── 01_websockets/                                    # WebSockets : connexion permanente, données en temps réel
│   │   ├── 01_ws_basics.md                               # Ouvrir, envoyer, recevoir, fermer proprement
│   │   ├── 01_ws_basics_solution.js
│   │   ├── 02_ws_chat_room.md                            # Construire un chat room : rooms, broadcast, events
│   │   └── 02_ws_chat_room_solution.js
│   ├── 02_sse/                                           # SSE : Server-Sent Events, le flux unidirectionnel
│   │   ├── 01_sse_basics.md                              # Quand SSE est mieux que WebSocket (et pourquoi)
│   │   ├── 01_sse_basics_solution.js
│   │   ├── 02_sse_live_feed.md                           # Live feed : notifications, dashboards en temps réel
│   │   └── 02_sse_live_feed_solution.js
│   ├── 03_webrtc/                                        # WebRTC : pair-à-pair, vidéo, audio, data channels
│   │   ├── 01_webrtc_concepts.md                         # Signaling, ICE, STUN, TURN : les bases théoriques
│   │   ├── 01_webrtc_concepts_solution.js
│   │   ├── 02_webrtc_demo.md                             # Demo pair-à-pair : envoyer des données sans serveur
│   │   └── 02_webrtc_demo_solution.js
│   └── 04_realtime_grimoire.md
│
│
├── 19_api_craft/                                         # API Craft : construire ce que le monde consomme
│   ├── 01_express_from_scratch.md                        # Express : router, middleware, request, response
│   ├── 01_express_from_scratch_solution.js
│   ├── 02_rest_crud_complete.md                          # REST complet : CRUD propre avec validation
│   ├── 02_rest_crud_complete_solution.js
│   ├── 03_error_handling_api.md                          # Erreurs en API : ne jamais crasher en prod
│   ├── 03_error_handling_api_solution.js
│   ├── 04_auth_jwt.md                                    # Auth JWT : signer, vérifier, expirer
│   ├── 04_auth_jwt_solution.js
│   ├── 05_graphql_basics.md                              # GraphQL : queries, mutations, resolvers
│   ├── 05_graphql_basics_solution.js
│   ├── 06_api_versioning.md                              # Versioning : /v1, /v2, ne jamais casser les clients
│   ├── 06_api_versioning_solution.js
│   ├── 07_openapi_swagger.md                             # OpenAPI & Swagger : documenter pour humains et machines
│   ├── 07_openapi_swagger_solution.js
│   └── 08_api_grimoire.md
│
│
├── 20_security/                                          # Sécurité : OWASP & au-delà des nightmares
│   ├── 01_xss_injection.md                               # XSS & Injection : les attaques les plus répandues
│   ├── 01_xss_injection_solution.js
│   ├── 02_csrf_cors.md                                   # CSRF & CORS : protéger sans bloquer les bonnes requêtes
│   ├── 02_csrf_cors_solution.js
│   ├── 03_prototype_pollution.md                         # Prototype Pollution : l'attaque JS que personne ne voit
│   ├── 03_prototype_pollution_solution.js
│   ├── 04_auth_flows.md                                  # Flows d'auth : OAuth2, PKCE, sessions vs tokens
│   ├── 04_auth_flows_solution.js
│   ├── 05_hashing_bcrypt.md                              # Hashing : bcrypt, salt, stocker les mots de passe correctement
│   ├── 05_hashing_bcrypt_solution.js
│   ├── 06_owasp_checklist.md                             # OWASP Top 10 : la liste des erreurs à ne jamais faire
│   ├── 06_owasp_checklist_solution.js
│   └── 07_security_grimoire.md
│
│
├── 21_ai_native_dev/                                     # AI-Native Dev : coder avec l'IA comme un senior
│   ├── 01_ai_workflow.md                                 # Workflow IA : copilote, pas chauffeur
│   ├── 01_ai_workflow_solution.js                        # Intégration API OpenAI/Anthropic : appels, streaming, gestion d'erreurs
│   ├── 02_prompt_engineering.md                          # Prompt Engineering : générer du bon code, pas du bruit
│   ├── 02_prompt_engineering_solution.js                 # Construire et tester des prompts programmatiquement
│   ├── 03_validate_ai_output.md                          # Valider ce que l'IA produit : elle se trompe aussi
│   ├── 03_validate_ai_output_solution.js                 # Zod + parsing : valider la sortie JSON d'un LLM
│   ├── 04_ai_refactor_partner.md                         # L'IA comme partenaire de refactoring
│   ├── 04_ai_refactor_partner_solution.js                # Pipeline : soumettre du code, parser la réponse, appliquer les diffs
│   ├── 05_ai_test_generator.md                           # Générer des tests avec l'IA : vite fait, bien validé
│   ├── 05_ai_test_generator_solution.js                  # Générer + exécuter des tests Jest depuis une réponse LLM
│   └── 06_ai_grimoire.md
│
│
├── 22_databases/                                         # Bases de données : persister intelligemment
│   ├── 01_sql_basics.md                                  # SQL : requêtes, jointures, indexes, agrégations
│   ├── 01_sql_basics_solution.js
│   ├── 02_nosql_basics.md                                # NoSQL : documents, clé/valeur, quand choisir quoi
│   ├── 02_nosql_basics_solution.js
│   ├── 03_data_modeling.md                               # Modélisation : normalisation, relations, schémas
│   ├── 03_data_modeling_solution.js
│   ├── 04_redis_caching.md                               # Redis : cache, sessions, queues légères
│   ├── 04_redis_caching_solution.js
│   ├── 05_db_in_js.md                                    # DB en JS : Prisma, Drizzle, Supabase dans la pratique
│   ├── 05_db_in_js_solution.js
│   └── 06_databases_grimoire.md
│
│
├── 23_scalability/                                       # Scalabilité : tenir quand ça devient sérieux
│   ├── 01_load_balancing.md                              # Load Balancing : répartir sans faire tomber
│   ├── 01_load_balancing_solution.js
│   ├── 02_horizontal_vs_vertical.md                      # Scale horizontal vs vertical : les vraies différences
│   ├── 02_horizontal_vs_vertical_solution.js
│   ├── 03_rate_limiting.md                               # Rate Limiting : protéger sans punir les bons utilisateurs
│   ├── 03_rate_limiting_solution.js
│   ├── 04_message_queues.md                              # Message Queues : RabbitMQ, Kafka, découpler pour tenir
│   ├── 04_message_queues_solution.js
│   └── 05_scalability_grimoire.md
│
│
├── 24_observability/                                     # Observabilité : voir ce qui se passe en prod
│   ├── 01_structured_logging.md                          # Logs JSON structurés : fini les console.log nus
│   ├── 01_structured_logging_solution.js
│   ├── 02_distributed_tracing.md                         # Distributed Tracing : suivre une requête partout
│   ├── 02_distributed_tracing_solution.js
│   ├── 03_metrics_alerting.md                            # Métriques & alerting : être prévenu avant le crash
│   ├── 03_metrics_alerting_solution.js
│   ├── 04_sentry_in_prod.md                              # Sentry : capturer, trier, corriger en prod
│   ├── 04_sentry_in_prod_solution.js
│   ├── 05_debug_in_prod.md                               # Déboguer en prod sans tout casser : l'art du chirurgien
│   ├── 05_debug_in_prod_solution.js
│   └── 06_observability_grimoire.md
│
│
├── 25_team_craft/                                        # Coder en équipe : le vrai différenciateur senior
│   ├── 01_code_review.md                                 # Code Review : donner et recevoir du feedback utile
│   ├── 01_code_review_solution.js
│   ├── 02_adr_writing.md                                 # ADR : documenter les décisions techniques qui doivent durer
│   ├── 02_adr_writing_solution.js
│   ├── 03_technical_writing.md                           # Technical Writing : écrire pour des humains fatigués
│   ├── 03_technical_writing_solution.js
│   ├── 04_navigate_codebase.md                           # Naviguer un codebase inconnu sans paniquer
│   ├── 04_navigate_codebase_solution.js
│   ├── 05_pair_programming.md                            # Pair Programming : deux cerveaux valent mieux qu'un (parfois)
│   ├── 05_pair_programming_solution.js
│   └── 06_team_grimoire.md
│
│
├── 26_edge_cases/                                        # Cas Bizarres : JS qui se rebelle contre son créateur
│   ├── 01_nan_undefined_null.md                          # NaN, undefined, null : le triangle des Bermudes de JS
│   ├── 01_nan_undefined_null_solution.js
│   ├── 02_floating_point.md                              # 0.1 + 0.2 ≠ 0.3 : l'horreur des virgules flottantes
│   ├── 02_floating_point_solution.js
│   ├── 03_weird_coercions.md                             # Les coercitions que personne n'a demandées
│   ├── 03_weird_coercions_solution.js
│   ├── 04_prototype_chain_dark.md                        # La chaîne de prototypes dans ses pires moments
│   ├── 04_prototype_chain_dark_solution.js
│   └── 05_edge_cases_grimoire.md
│
│
├── 27_oop_js/                                            # OOP en JS : prototype, classes, héritage — la face cachée
│   ├── 01_prototype_chain.md                             # La chaîne de prototypes : comment JS hérite vraiment
│   ├── 01_prototype_chain_solution.js
│   ├── 02_classes_es6.md                                 # Classes ES6 : sucre syntaxique sur prototype
│   ├── 02_classes_es6_solution.js
│   ├── 03_inheritance_patterns.md                        # Héritage : composition vs héritage, le vrai débat
│   ├── 03_inheritance_patterns_solution.js
│   ├── 04_mixins.md                                      # Mixins : réutiliser sans hériter
│   ├── 04_mixins_solution.js
│   └── 05_oop_grimoire.md
│
│
├── 28_mini_projects/                                     # Projets Intégrateurs : tout assembler pour de vrai
│   ├── 01_shinobi_engine/                                # Moteur de combat Naruto : FP + patterns + maths
│   │   ├── cahierdescharges.md                           # Specs fonctionnelles et techniques détaillées
│   │   ├── README.md                                     # Contexte, objectifs, modules couverts
│   │   ├── TDD_JOURNAL.md                                # Tests écrits avant le code
│   │   ├── POSTMORTEM.md                                 # Ce qui a cassé, ce qu'on aurait fait mieux
│   │   ├── ADR/                                          # Décisions d'architecture documentées
│   │   ├── src/
│   │   └── tests/
│   ├── 02_titan_tracker/                                 # Système de détection AoT : data structures + algos
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   ├── 03_vinyl_vault/                                   # API collection vinyle : REST + auth + sécurité
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   ├── 04_ballon_dor_cli/                                # Classement Ballon d'Or en terminal : Node CLI + algos
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   ├── 05_setlist_generator/                             # Générateur de setlist concert : FP + regex + TypeScript
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   ├── 06_quirk_simulator/                               # Duels de Quirks MHA : async + SSE + event-driven
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   ├── 07_ultras_dashboard/                              # Dashboard analytics foot : observability + perf + TDD
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   └── 08_kaiju_i18n/                                    # Encyclopédie Kaijus multilingue : i18n + a11y + TypeScript
│       ├── cahierdescharges.md
│       ├── README.md
│       ├── TDD_JOURNAL.md
│       ├── POSTMORTEM.md
│       ├── ADR/
│       ├── src/
│       └── tests/
│
│
├── 29_annexes/                                           # Annexes pro : pour aller encore plus loin
│   ├── toolchain/                                        # Toolchain : l'arsenal du dev moderne
│   │   ├── 01_git_survival.md                            # Git : les commandes qui sauvent une carrière
│   │   ├── 02_vscode_setup.md                            # VSCode : extensions, shortcuts, config qui déchire
│   │   ├── 03_package_managers.md                        # npm, yarn, pnpm : qui gère quoi et comment
│   │   ├── 04_bundlers.md                                 # Vite, Webpack, esbuild : pourquoi ça existe
│   │   ├── 05_docker_basics.md                            # Docker : containeriser sans se noyer
│   │   └── 06_cicd_basics.md                              # CI/CD : automatiser pour ne plus jamais déployer à la main
│   └── typescript_advanced/                              # TypeScript avancé : pour les cas extrêmes
│       ├── 01_declaration_files.ts                        # .d.ts : typer des bibliothèques non typées
│       ├── 02_ts_compiler_config.md                       # tsconfig.json : chaque option expliquée simplement
│       └── 03_ts_migration_guide.md                       # Migrer un projet JS vers TS sans tout casser
│
│
└── 30_tools/                                             # Arsenal maison : tes gadgets pour aller plus vite
    ├── 01_logger.js                                      # Logger propre : plus jamais de console.log nu
    ├── 02_helper_functions.js                            # Fonctions utiles : le couteau suisse personnel
    ├── 03_array_utils.js                                 # Utils tableau : les raccourcis que t'as toujours voulus
    ├── 04_benchmark.js                                   # Benchmark : mesurer avant d'optimiser
    ├── 05_debug_toolkit.js                               # Debug toolkit : inspecter, tracer, comprendre
    └── 06_devtools_cheatsheet.md                         # DevTools : le guide de survie du navigateur
```

---

## Ce que tu dois maîtriser : la carte complète

### Fondamentaux JS

```
Primitives vs objets
  => Copier une valeur vs copier une adresse
  => Scope global, fonction, block
  => Closures et pourquoi elles piègent tout le monde
Fonctions comme valeurs
  => Les passer, les retourner, les stocker
  => Call Stack et Event Loop : mono-thread, microtasks vs macrotasks
Coercition de types
  => Conversions implicites
  => Regex pour parser, valider, extraire
```

### Error Handling

```
try/catch/finally : attraper sans perdre le contexte
  => Erreurs custom : créer ses propres types d'erreur
  => Propagation : qui gère quoi et à quel niveau
  => Erreurs async : les plus silencieuses et les plus mortelles
  => Stratégies : fail fast, fail safe, fallback, retry
```

### Testing

```
Unit tests, mocks, spies
  => Async testing : Promises, timers, event emitters
  => TDD : écrire le test AVANT le code
  => Tests d'intégration
  => Contract testing
  => E2E avec Playwright
Le testing n'est pas une étape après le code.
C'est une façon de coder.
```

### TypeScript

```
Types, interfaces, type alias
  => Generics : flexible et typé en même temps
  => Utility types : Partial, Pick, Omit, Record
  => Type guards : vérifier le type à l'exécution
  => Types conditionnels & mapped types
En 2026, TS n'est plus optionnel.
```

### Accessibilité

```
ARIA : les attributs qui parlent aux machines
  => Navigation clavier : tab, focus, skip links
  => Contraste & couleurs : WCAG AA et AAA
  => Lecteurs d'écran : comment ils lisent ton HTML
Coder pour tout le monde, pas juste pour les gens qui te ressemblent.
```

### Design Patterns

```
Creational  : Factory, Singleton, Builder
  => Structural  : Decorator, Adapter, Proxy
  => Behavioral  : Observer, Strategy, Command
Pas juste les nommer.
Les appliquer dans le bon contexte.
```

### Mémoire et performance

```
Garbage Collector : qui nettoie quoi et quand
  => Shallow copy vs deep copy
  => Big-O de O(1) à O(2^n)
  => Profiling avec performance.now()
  => Fuites mémoire : comment les chasser
  => DevTools : breakpoints, flame graphs, memory snapshots
LCP, INP, CLS : les Core Web Vitals que Google mesure sur ton app
```

### Real-Time

```
WebSockets : connexion permanente, bidirectionnelle
  => SSE : quand le serveur parle seul
  => WebRTC : pair-à-pair, sans serveur entre les deux
Choisir le bon outil selon le besoin réel.
```

### Architecture et patterns

```
Module  =>  MVC  =>  Clean Architecture
  => Event-driven  =>  Microservices
Savoir les appliquer et surtout savoir
POURQUOI on les applique dans tel contexte.
```

### i18n

```
Locales, traductions, structure
  => Dates & fuseaux horaires : le piège universel
  => Formats numériques selon la locale
  => Pluralisation
  => react-i18next, next-intl dans la pratique
```

### AI-Native Dev

```
Cursor et Copilot : workflow propre, pas de copier-coller zombie
  => Prompt engineering : générer du bon code
  => Valider ce que l'IA produit
  => Savoir quand lui faire confiance et quand reprendre le volant
  => Écrire du code que l'IA peut relire et modifier sans tout casser
```

### Observabilité en prod

```
Logs JSON structurés : fini les console.log nus
  => Distributed tracing : suivre une requête partout
  => Métriques et alerting : être prévenu avant le crash
  => Sentry : capturer, trier, corriger en prod
  => Déboguer en prod sans tout casser
Sans ça, tu codes bien mais tu es aveugle
quand quelque chose explose.
```

### Team Craft

```
Code review : donner et recevoir du feedback utile
  => ADR : documenter les décisions techniques qui doivent durer
  => Technical writing : écrire pour des humains fatigués
  => Naviguer un codebase inconnu
  => Pair programming
```

> Tout ça fonctionne dans n'importe quel langage.
> JS est le terrain d'entraînement. La façon de penser, elle, est universelle.

---

## Les projets

### 01_shinobi_engine/ — Le moteur de combat Naruto

**Modules couverts :** `01_fundamentals` · `05_math_basics` · `09_functional_js` · `10_design_patterns`

Un moteur de combat textuel entre ninjas. Chaque shinobi a des stats, des jutsus, un chakra. Les combats se résolvent via des fonctions pures, les jutsus sont des Strategy patterns, et le système de chakra tourne autour de probabilité et de modulo.

- Fonctions pures pour les calculs de dégâts
- Strategy pattern pour chaque type de jutsu
- Composition pour assembler les capacités
- Probabilité & RNG pour les critiques et les esquives
- Immutabilité : jamais de mutation d'état direct

### 02_titan_tracker/ — Le système de détection des Titans

**Modules couverts :** `07_data_structures` · `08_algorithms` · `06_memory_performance`

Un système de surveillance des murs inspiré d'Attack on Titan. Des capteurs détectent des Titans à différentes positions, le système les trie par niveau de menace, calcule les chemins d'évacuation les plus courts, et repère les zones d'invasion connectées.

- Graph pour modéliser la carte des murs et des chemins
- Dijkstra pour trouver les routes d'évacuation optimales
- Min-heap pour la priority queue des menaces
- BFS pour détecter les zones envahies connectées
- Big-O analysis sur chaque algo utilisé

### 03_vinyl_vault/ — L'API secrète de la collection vinyle

**Modules couverts :** `19_api_craft` · `22_databases` · `20_security` · `15_web_concepts`

Une API REST complète pour gérer une collection de vinyles. Artistes, albums, tracks, notes perso. Avec auth JWT, recherche, et rate limiting pour que personne ne scrappe ta collection privée.

- Express CRUD complet sur albums, artistes et tracks
- Auth JWT : sign, verify, refresh token
- Hashing bcrypt pour les mots de passe
- Rate limiting par IP
- Sanitization des inputs contre XSS et injection
- OpenAPI doc minimale

### 04_ballon_dor_cli/ — Le classement Ballon d'Or en terminal

**Modules couverts :** `13_runtime_env` · `08_algorithms` · `11_refactoring` · `03_error_handling`

Un outil CLI Node.js pour gérer et simuler le vote du Ballon d'Or. Les journalistes votent, les points s'agrègent, le classement se met à jour. Plusieurs commandes disponibles : `vote`, `rank`, `reset`, `simulate`. Sauvegarde locale JSON incluse.

- CLI avec `process.argv` et parsing de flags
- Merge Sort pour le classement final
- Filesystem pour la persistance via `fs`
- Custom errors : `InvalidVoteError`, `PlayerNotFoundError`
- Refactoring challenge : v1 procédurale → v2 modulaire propre
- Tests unitaires sur les fonctions de calcul de score

### 05_setlist_generator/ — Le générateur de setlist pour concerts

**Modules couverts :** `09_functional_js` · `01_fundamentals/07_regex` · `12_typescript`

Un outil qui prend une bibliothèque de chansons en JSON et génère des setlists optimisées selon des critères : énergie, durée, cohérence de genre. Le tout en FP pur, typé en TypeScript, avec parsing de métadonnées via regex.

- Fonctions pures et composition pour les filtres et les tris
- Currying pour les critères de sélection
- Regex pour parser durées (`3:45`), BPM, tonalités depuis des strings
- TypeScript : generics, utility types (`Partial`, `Pick`), type guards
- Immutabilité totale sur la bibliothèque source

### 06_quirk_simulator/ — Les duels de Quirks en temps réel

**Modules couverts :** `02_async` · `03_error_handling` · `18_realtime` · `14_architecture_patterns`

Un simulateur de duels de héros inspiré de My Hero Academia. Les Quirks ont des effets asynchrones : délais de charge, recharge, effets persistants. Le moteur streame les events du combat via SSE vers un frontend minimaliste.

- Async/await pour les effets de Quirk avec délais
- `Promise.race` pour les interruptions de combat
- SSE pour streamer les events du duel en live
- Event-driven architecture pour les effets chaînés
- Custom errors : `QuirkOverheatError`, `HeroDownError`
- Module pattern pour isoler chaque Quirk

### 07_ultras_dashboard/ — Le dashboard d'analytics d'un club de foot

**Modules couverts :** `24_observability` · `23_scalability` · `06_memory_performance` · `04_testing`

Un dashboard Node.js qui ingère des données de matchs en temps réel : passes, tirs, positions. Il génère des stats live, profile les calculs lourds, et tient la charge grâce au rate limiting. Tous les agrégateurs sont testés en TDD.

- Structured JSON logging de chaque event de match
- Métriques : possession, xG, heatmap de passes
- Rate limiting sur l'endpoint de mise à jour live
- `performance.now()` et profiling sur les agrégations
- TDD : tests écrits avant les fonctions d'analytics
- Big-O analysis sur les agrégations

### 08_kaiju_i18n/ — L'encyclopédie multilingue des Kaijus

**Modules couverts :** `17_i18n` · `16_accessibility` · `12_typescript` · `15_web_concepts`

Une encyclopédie web des Kaijus inspirée de Godzilla et Pacific Rim, disponible en français, anglais, japonais et malgache. Chaque fiche affiche les stats, la catégorie de menace, et les dates formatées selon la locale. Entièrement accessible.

- i18n complet avec 4 locales dont une custom (malgache)
- Dates formatées selon la locale avec `Intl.DateTimeFormat`
- Pluralisation : `1 attaque`, `3 attaques`, `0 attaque`
- TypeScript : clés de traduction typées, utility types
- ARIA roles complets et navigation clavier
- Contraste WCAG AA vérifié sur toutes les fiches

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

**Lovasoarm**
