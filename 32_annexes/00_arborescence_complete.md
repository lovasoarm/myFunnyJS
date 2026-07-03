[DÉCENNIE]

# ARBORESCENCE COMPLÈTE
Temps de lecture ~30 min

> Carte complète du dépôt. Chaque dossier, chaque fichier, chaque rôle en une ligne.
> Pas un fichier à lire d'une traite. Un plan que tu consultes quand tu cherches un module précis
> ou que tu veux voir où un sujet est traité.

Si tu cherches juste la séquence d'apprentissage (l'ordre dans lequel suivre les modules), va voir
la ROADMAP dans le `README.md` à la racine. Ce fichier-ci, c'est le détail fichier par fichier.

---

```
MyFunnyJS/
├── 01_START_HERE.md                                            # Le tout premier fichier à lire. Court, direct, prérequis machine.
├── GUIDE_CARRIERE_DEV.md                                        # Le contexte du métier dev en 2026 : avant de toucher au code
├── 03_WHERE_YOU_STAND.md                                        # 4 axes (Runtime, Lecture, Debug, Architecture), 4 niveaux chacun : où t'en es vraiment
├── README.md                                                   # La roadmap des 32 modules, dans l'ordre
├── CONTRIBUTING.md                                             # Les règles du camp : pas de PR qui pue
├── DEPENDENCY_LEDGER.md                                        # Journal transversal : drill solo-vs-copilot rejoué à 4 moments du curriculum, voir 23_ai_native_dev/07
│
├── 01_fundamentals/
│   ├── 00_why_fundamentals.md                      # Sans ces bases, tu codes au feeling et tu pries pour que ça remarche
│   ├── 01_variables/
│   │   ├── 01_intro_variables.md                  # Ce qu'une variable est vraiment en mémoire
│   │   ├── 02_reference_chaos.md                  # Quand deux variables pointent vers le même enfer
│   │   ├── 03_mutation_madness.md                 # Muter un objet par accident et ne pas comprendre pourquoi ça fout tout en l'air
│   │   ├── 04_const_trap.md                       # const ne veut pas dire immuable : le piège classique
│   │   └── 05_variable_glossary.md
│   ├── 02_scope/
│   │   ├── 01_scope_basics.md                     # Portée locale, globale, et le bloc qu'on oublie toujours
│   │   ├── 02_closure_trap.md                     # La closure qui garde une variable en otage après la mort de la fonction
│   │   ├── 03_scope_escape_room.md                # Escape room : trouve la variable, comprends le contexte, sors vivant
│   │   ├── 04_this_context.md                     # this : le mot-clé qui change de sens selon qui l'appelle
│   │   └── 05_scope_glossary.md                   # closure, hoisting, TDZ, this : chaque terme démystifié
│   ├── 03_functions/
│   │   ├── 01_function_basics.md                  # Declaration vs expression vs arrow : les trois ne sont pas interchangeables
│   │   ├── 02_hof_map_filter.md                   # map, filter, reduce : les outils qui remplacent 80% des boucles
│   │   ├── 03_function_factory.md                 # Fabriquer des fonctions depuis d'autres fonctions : le vrai pouvoir
│   │   └── 04_function_grimoire.md
│   ├── 04_types/
│   │   ├── 01_primitives.md                       # string, number, boolean, null, undefined, symbol, BigInt
│   │   ├── 02_type_coercion.md                    # Quand JS décide lui-même de changer tes types et casse tout
│   │   ├── 03_type_transformers.md                # Convertir proprement sans passer par les raccourcis dangereux
│   │   └── 04_type_grimoire.md
│   ├── 05_web_basics/
│   │   ├── 01_dom_manipulation.md                 # Toucher le DOM sans tout ralentir ni tout casser
│   │   ├── 02_fetch_adventure.md                  # Appeler une API et comprendre ce qui revient vraiment
│   │   ├── 03_storage_treasure.md                 # localStorage, sessionStorage, cookies : lequel choisir et pourquoi
│   │   ├── 04_template_portals.md                 # template literals et HTML dynamique sans innerHTML à l'arrache
│   │   ├── 05_web_helpers.md                      # debounce, throttle, deepClone : le kit de survie
│   │   ├── 06_module_factory.md                   # Organiser son code web en modules sans framework
│   │   └── 07_web_grimoire.md
│   ├── 06_modules/
│   │   ├── 01_import_export.md                    # named, default, namespace : les trois formes et quand les utiliser
│   │   ├── 02_module_patterns.md                  # Barrel exports, circular deps, lazy loading : les pièges du monde réel
│   │   └── 03_modules_grimoire.md                 # ESM vs CJS, bundlers, tree shaking
│   ├── 07_regex/
│   │   ├── 01_regex_basics.md                     # Lire et écrire un pattern sans avoir peur
│   │   ├── 02_regex_combat.md                     # Validation d'emails, numéros, URLs : les vraies batailles
│   │   ├── 03_regex_extractor.md                  # Capturer, remplacer, splitter comme un sniper
│   │   └── 04_regex_grimoire.md
│   └── 08_debugging/
│       ├── 01_read_stack_trace.md                 # Anatomie d'une stack trace : lire de bas en haut, identifier la ligne qui t'appartient
│       ├── 02_debug_methodology.md                # Reproduire, isoler, corriger, vérifier : le process en quatre étapes sans raccourci
│       └── 03_devtools_debugger.md                # Breakpoints, watch expressions, step over/into/out : débugger sans toucher le code
│
├── 02_problem_solving/                                         # Concevoir avant de coder : le cerveau que la syntaxe ne donne pas
│   ├── 00_why_problem_solving.md                               # Tu connais la syntaxe, mais face à un problème flou tu ouvres l'éditeur sans savoir où commencer
│   ├── 01_decompose.md                                        # Couper un système complexe en pièces qui tiennent seules
│   ├── 02_model_before_code.md                                # Penser en structures et contrats avant d'ouvrir l'éditeur
│   ├── 03_choose_an_approach.md                                # Comparer deux solutions avant d'en écrire une seule ligne
│   ├── 04_read_fuzzy_requirements.md                          # Transformer "ça marche pas" en problème précis et attaquable
│   ├── 05_design_for_change.md                                # Concevoir pour ce qui va changer, pas pour ce qui est stable aujourd'hui
│   └── 06_problem_solving_grimoire.md                         # domaine, contrat, couplage, cohésion : le lexique du dev qui conçoit
│
├── 03_async/                                                   # Le coeur invisible de JS : rien ne bloque, tout se séquence
│   ├── 00_why_async.md                                         # JS tourne sur un seul thread : comprendre l'event loop ou coder avec un fantôme
│   ├── 01_callbacks/
│   │   ├── 01_callback_maze.md                                # Le labyrinthe du callback hell : entrer est facile, sortir est une leçon
│   │   ├── 02_callback_challenge.md                           # Orchestrer plusieurs callbacks sans perdre le fil
│   │   └── 03_callbacks_grimoire.md                           # callback, error-first, inversion of control
│   ├── 02_promises/
│   │   ├── 01_promise_race.md                                 # Promise.race, allSettled, any : quand plusieurs opérations s'affrontent
│   │   ├── 02_promise_chain_reactor.md                        # Chaîner des opérations async sans perdre les erreurs en route
│   │   └── 03_promises_grimoire.md
│   ├── 03_async_await/
│   │   ├── 01_async_jungle.md                                 # loops, parallel, sequential : les différences comptent
│   │   ├── 03_async_rescue.md                                 # Sauver une opération async qui part en vrille
│   │   ├── 02b_generators_yield.md                            # function* et yield : la fonction qui fait pause et reprend
│   │   ├── 02c_abort_controller.md                            # AbortController : annuler ce qui ne doit plus se terminer
│   │   └── 03_async_grimoire.md
│   └── 04_event_loop/
│       ├── 01_microtask_madness.md                            # microtasks vs macrotasks : l'ordre d'exécution qui surprend toujours
│       ├── 02_macrotask_monsters.md                           # setTimeout, setInterval, requestAnimationFrame
│       └── 03_event_loop_grimoire.md                          # call stack, heap, queue, microtask : le moteur JS expliqué sans magie
│
├── 04_debugging/                                              # Le vrai module debug : hypothèses, debug à l'aveugle, bugs qui reviennent jamais pareil
│   ├── 00_prereq_check.md
│   ├── 00_why_debugging.md                                     # Un bug, c'est pas de la chance : c'est une méthode ou c'est du hasard, choisis
│   ├── 01_read_stack_trace.md                                  # Anatomie d'une stack trace : lire de bas en haut, identifier la ligne qui t'appartient
│   ├── 02_debug_methodology.md                                 # Reproduire, isoler, corriger, vérifier : le process en quatre étapes sans raccourci
│   ├── 03_devtools_debugger.md                                 # Breakpoints, watch expressions, step over/into/out : débugger sans toucher le code
│   ├── 04_repro_before_fix.md                                  # Reproduire le bug avant de le corriger : sinon tu répares au hasard
│   ├── 05_hypothesis_driven_debug.md                           # Débugger avec des hypothèses écrites : pas en changeant du code au pif
│   ├── 06_blind_debug.md                                       # Débugger sans debugger, juste avec les logs : la vraie compétence de prod
│   ├── 07_flaky_bugs.md                                        # Le bug qui apparaît une fois sur dix : le pire ennemi, la vraie leçon
│   ├── CONSIGNE_HYPOTHESES_OBLIGATOIRE.md
│   ├── EXO_DEBUG_AVEUGLE.md
│   ├── EXO_JEUNE_IA.md
│   ├── HYPOTHESES_exemple.md
│   ├── _EXEMPLE_HYPOTHESES.md
│   └── _TEMPLATE_HYPOTHESES.md
│
├── 05_error_handling/                                          # Les erreurs arrivent : la question c'est si tu les vois avant l'shinobi
│   ├── 00_why_error_handling.md                                # Ton code va planter : la question c'est si tu le vois venir ou pas
│   ├── 01_try_catch_basics.md                                 # try/catch en profondeur : ce qu'il attrape et ce qu'il laisse passer
│   ├── 02_custom_errors.md                                    # Créer ses propres erreurs pour que les logs racontent une histoire
│   ├── 03_error_propagation.md                                # Qui catch quoi et à quel niveau : la discipline de propagation
│   ├── 04_async_error_traps.md                                # Les erreurs async qu'on oublie de catcher : et qui tombent en silence
│   ├── 05_error_strategy.md                                   # Fail-fast, fallback, retry : choisir la bonne stratégie selon le contexte
│   └── 06_error_grimoire.md                                   # Error, TypeError, RangeError, custom errors : le bestiaire complet
│
├── 06_testing/                                                 # On teste avant de coder : pas après, pas en option
│   ├── 00_why_testing.md                                      # T'as déjà pushé un fix qui cassait autre chose ? Ce module règle ça
│   ├── 01_unit_sniper.md                                      # Tester une fonction précisément : comme un sniper, pas comme un fusil à pompe
│   ├── 02_jest_crash_course.md                                # Jest de zéro à opérationnel : sans lire la doc de 200 pages
│   ├── 03_mocking_madness.md                                  # Mocker un module, une API, une dépendance : sans tout casser
│   ├── 04_integration_reactor.md                              # Tester plusieurs modules ensemble : quand l'isolation ne suffit plus
│   ├── 05_tdd_arena.md                                        # TDD pur : le test en premier, le code après, toujours
│   ├── 06_test_driven_refactor.md                             # Refactorer sans régression grâce aux tests déjà en place
│   ├── 07_contract_testing_pact.md                            # Tester le contrat entre deux services avant qu'ils soient en prod ensemble
│   ├── 08_e2e_playwright_beast.md                             # Playwright : simuler un vrai shinobi qui clique, tape, attend
│   └── 09_testing_grimoire.md                                 # unit, integration, E2E, mock, spy, stub : chaque terme à sa place
│
├── 07_math_basics/                                             # Les maths utiles au dev : pas les inutiles
│   ├── 00_why_math_basics.md                                   # Pas besoin de calculus : modulo, logique booléenne, Math.random, l'arsenal qui sert vraiment
│   ├── 01_boolean_logic.md                                    # AND, OR, NOT, XOR : la logique qui pilote chaque condition
│   ├── 02_modular_arithmetic.md                               # Le modulo et ses usages : cycles, cooldowns, distributions
│   ├── 03_bit_manipulation.md                                 # Bits, masques, flags : manipuler les données à l'os
│   ├── 04_hashing_basics.md                                   # Comment fonctionne un hash et pourquoi c'est partout en dev
│   ├── 05_probability_random.md                               # Math.random, distributions, probabilités : le RNG qui ne ment pas
│   ├── 06_combinatorics_lite.md                               # Permutations, combinaisons : les maths du bruteforce et des puzzles
│   ├── 07_geometry_for_dev.md                                 # Coordonnées, distances, vecteurs : les maths du jeu, de la data viz, des cartes
│   └── 08_math_grimoire.md
│
├── 08_memory_performance/                                      # Ce qui coûte cher en mémoire et en CPU : et comment l'éviter
│   ├── 00_why_memory_performance.md                            # Ça marche en local avec 10 lignes, ça rame en prod avec 100 000 : voilà pourquoi
│   ├── 01_gc/
│   │   ├── 01_gc_basics.md                                    # mark-and-sweep, références, cycles : comprendre sans peur
│   │   └── 02_gc_simulator.md                                 # Simuler le comportement du GC sur des objets qui vivent et meurent
│   ├── 02_copy_vs_ref/
│   │   ├── 01_shallow_vs_deep.md                              # shallow copy : ça copie la surface mais pas le fond
│   │   └── 02_mutation_minefield.md                           # Le champ de mines : toucher un objet et tout casser ailleurs
│   ├── 03_complexity/
│   │   ├── 01_big_o_basics.md                                 # O(1), O(n), O(n²) : ce que ça veut dire sur du vrai code
│   │   ├── 02_complexity_analysis.md                          # Analyser un algorithme ligne par ligne : sans formule magique
│   │   └── 03_runtime_race.md                                 # O(n log n) vs O(n²) : voir la différence à l'écran sur 100k éléments
│   ├── 04_profiling/
│   │   ├── 01_profiling_basics.md                             # performance.now(), console.time() : les outils qui mesurent sans mentir
│   │   ├── 02_memory_leak_hunter.md                           # Traquer une fuite mémoire dans DevTools : la chasse au fantôme
│   │   ├── 03_devtools_deep_dive.md                           # DevTools Performance tab : lire un flamegraph sans se perdre
│   │   └── 04_node_cpu_profiling.md                           # node --prof : mesurer le CPU côté Node sur des scripts réels
│   ├── 05_core_web_vitals/
│   │   ├── 01_lcp_inp_cls_basics.md                           # LCP, INP, CLS : ce que chaque métrique mesure et ce qui les fait sauter
│   │   ├── 02_lighthouse_audit.md                             # Lire un rapport Lighthouse sans se noyer dans les chiffres
│   │   └── 03_perf_budget_enforcer.md                         # Poser un budget de performance et le faire respecter en CI
│   └── 06_memory_perf_grimoire.md
│
├── 09_data_structures/                                         # Les structures qui font que certains devs résolvent les problèmes 10x plus vite
│   ├── 00_why_data_structures.md                               # Une recherche qui prend 1ms à 100 éléments peut en prendre 4s à 1 million : le bug est dans la structure
│   ├── 01_array/
│   │   ├── 01_array_basics.md                                 # Indexing, slicing, spreading : ce que chaque opération coûte vraiment
│   │   └── 02_array_methods_battle.md                         # map vs forEach vs for...of vs reduce : le match qui détermine le vrai niveau
│   ├── 02_linked_list/
│   │   ├── 01_linked_list_basics.md                           # Node, next, head, tail : construire la structure depuis zéro
│   │   └── 02_linked_list_arena.md                            # Inverser une liste, détecter un cycle, trouver le milieu
│   ├── 03_stack/
│   │   ├── 01_stack_basics.md
│   │   └── 02_stack_missions.md                               # Parenthèses balancées, historique de navigation, undo/redo
│   ├── 04_queue/
│   │   ├── 01_queue_basics.md
│   │   └── 02_queue_challenges.md                             # Simuler une file d'attente, un système de tickets, un BFS
│   ├── 05_heap/
│   │   ├── 01_heap_basics.md                                  # Min-heap, max-heap : la structure qui garde l'ordre sans tout trier
│   │   └── 02_heap_priority_queue.md                          # Priority queue : les tâches les plus urgentes passent devant
│   ├── 06_bst/
│   │   ├── 01_bst_basics.md                                   # insert, search, delete : les trois opérations qui définissent un BST
│   │   └── 02_bst_traversal.md                                # inorder, preorder, postorder : lire un arbre dans le bon sens
│   ├── 07_hash_table/
│   │   ├── 01_hash_table_basics.md                            # hash function, collision, chaining : comment ça marche sous le capot
│   │   └── 02_hash_table_arena.md                             # Two sum, anagrammes, comptage de fréquences : les classiques
│   ├── 08_graphs/
│   │   ├── 01_graph_basics.md                                 # Noeud, arête, directed, weighted : construire un graphe en JS
│   │   ├── 02_graph_bfs_dfs.md                                # BFS vs DFS : deux façons de traverser, deux cas d'usage différents
│   │   └── 03_graph_challenges.md                             # Détecter un cycle, composants connexes, topological sort
│   ├── 09_advanced_bonus/
│   │   ├── README.md                                          # HORS SCOPE : niveau algo compétitif, lis ça avant d'entrer
│   │   ├── 01_union_find.md                                   # Union-Find : grouper des éléments connectés en O(α(n)) quasi constant
│   │   ├── 02_fenwick_tree.md                                  # Fenwick Tree : somme de préfixes en O(log n)
│   │   └── 03_suffix_array.md                                  # Suffix Array : chercher dans des strings comme un moteur de texte
│   └── 10_data_structures_grimoire.md
│
├── 10_algorithms/                                              # Les patterns qui résolvent 90% des problèmes : si tu les reconnais à temps
│   ├── 00_why_algorithms.md                                    # La différence entre 3h de galère et 20 min : reconnaître le pattern derrière le problème
│   ├── 01_sorting/
│   │   ├── 01_bubble_insertion.md                             # O(n²) : comprendre les algos lents pour apprécier les rapides
│   │   ├── 02_merge_sort.md                                    # Divide and conquer : couper pour mieux fusionner en O(n log n)
│   │   ├── 03_quick_sort.md                                    # Quick sort : le plus rapide en pratique, le moins stable en théorie
│   │   └── 04_sorting_race.md                                  # Bubble vs Merge vs Quick sur 10k, 100k, 1M éléments : qui gagne et pourquoi
│   ├── 02_searching/
│   │   ├── 01_linear_binary.md                                # O(n) vs O(log n) : la différence qui compte sur des millions d'éléments
│   │   └── 02_search_challenges.md                            # Rotated array, matrix search, search in stream : les variantes qui piègent
│   ├── 03_dynamic_programming/
│   │   ├── 01_dp_basics.md                                    # Mémoization vs tabulation : deux façons d'attaquer le même problème
│   │   ├── 02_dp_classics.md                                  # Knapsack, longest common subsequence, coin change
│   │   └── 03_dp_matrix.md                                    # DP sur une grille 2D : chemins, obstacles, coûts minimaux
│   ├── 04_greedy/
│   │   ├── 01_greedy_basics.md                                # Quand greedy est optimal, quand il échoue : la frontière à connaître
│   │   └── 02_greedy_missions.md                              # Planifier des missions avec des contraintes de temps et de priorité
│   ├── 05_backtracking/
│   │   ├── 01_backtracking_basics.md                          # Arbre de décision, pruning, état : les trois concepts qui font tout
│   │   └── 02_backtracking_arena.md                           # Sudoku solver, word search, combination sum
│   ├── 06_graph_algorithms/
│   │   ├── 01_dijkstra.md                                     # Le chemin le plus court dans un graphe pondéré
│   │   ├── 02_astar.md                                        # A* : Dijkstra avec une heuristique : plus rapide, plus intelligent
│   │   └── 03_topological_sort.md                             # Trier des tâches dépendantes : sans jamais faire B avant A
│   └── 07_algorithms_grimoire.md
│
├── 11_functional_js/                                           # Coder sans effets de bord : et dormir tranquille la nuit
│   ├── 00_why_functional_js.md                                 # Le bug le plus dur à tracer : une mutation cachée sur un objet partagé entre deux fonctions
│   ├── 01_pure_functions.md                                   # Même input, même output, toujours : et pas de mutation cachée
│   ├── 02_immutability.md                                     # Ne jamais muter l'état : le créer, pas le changer
│   ├── 03_composition.md                                      # Composer des fonctions comme des Lego : chaque pièce fait une chose
│   ├── 04_currying.md                                         # Transformer une fonction multi-args en fonctions unaires enchaînées
│   ├── 05_partial_application.md                              # Fixer certains arguments maintenant, passer les autres plus tard
│   ├── 05b_iterators_symbol.md                                # Symbol.iterator : créer des structures qui se parcourent avec for...of
│   ├── 06_fp_challenge.md                                     # Construire un pipeline de transformation de données 100% fonctionnel
│   └── 07_fp_grimoire.md
│
├── 12_design_patterns/                                         # Les recettes de cuisine du code solide
│   ├── 00_why_design_patterns.md                               # Le même problème d'archi résolu deux fois, deux façons différentes : aucune des deux n'était la meilleure
│   ├── 01_creational/
│   │   ├── 01_factory_pattern.md                              # Factory : créer sans exposer la logique de construction
│   │   ├── 02_singleton_pattern.md                            # Singleton : une seule instance, point final : et ses dangers
│   │   └── 03_builder_pattern.md                              # Builder : construire des objets complexes étape par étape
│   ├── 02_structural/
│   │   ├── 01_decorator_pattern.md                            # Decorator : ajouter du comportement sans modifier la source
│   │   ├── 02_adapter_pattern.md                              # Adapter : brancher deux interfaces incompatibles l'une sur l'autre
│   │   └── 03_proxy_pattern.md                                # Proxy : intercepter les accès à un objet et y ajouter de la logique
│   ├── 03_behavioral/
│   │   ├── 01_observer_pattern.md                             # Observer : un événement se passe, tous les abonnés réagissent
│   │   ├── 02_strategy_pattern.md                             # Strategy : changer d'algorithme à la volée selon le contexte
│   │   └── 03_command_pattern.md                              # Command : encapsuler une action pour pouvoir l'annuler et la rejouer
│   └── 04_patterns_grimoire.md
│
├── 13_refactoring/                                             # Transformer du code qui fonctionne en code qui dure
│   ├── 00_why_refactoring.md                                   # Coder vite et coder durable, c'est pas la même compétence : ça, c'est la deuxième
│   ├── 01_clean_code_basics.md                                # Nommage, fonctions courtes, commentaires utiles : les règles qui changent tout
│   ├── 02_solid_principles.md                                  # SRP, OCP, LSP, ISP, DIP : les cinq principes qui structurent un codebase
│   ├── 03_code_smells.md                                      # God class, feature envy, long method : reconnaître ce qui pue avant que ça explose
│   ├── 04_refacto_in_action.md                                # Refactorer un module entier sans rien casser ni rien perdre
│   ├── 05_refacto_challenge.md                                # Une codebase en vrac : trouver les smells, refactorer, tester, livrer
│   └── 06_refacto_grimoire.md                                 # SOLID, smells, DRY, YAGNI, KISS : le vocabulaire du code propre
│
│
├── 14_typescript/                                              # JS avec un casque et une armure : obligatoire en prod en 2026
│   ├── 00_why_typescript.md                                    # "undefined is not a function" en prod : TS te le dit avant, pas l'shinobi après
│   ├── 01_ts_basics/
│   │   ├── 01_types_and_interfaces.md                         # type vs interface : pas la même chose, pas interchangeables
│   │   ├── 02_functions_typed.md                              # Typer les fonctions : params, retour, overloads, callbacks
│   │   └── 03_classes_typed.md                                # Classes TS : public, private, protected, readonly, abstract
│   ├── 02_ts_intermediate/
│   │   ├── 01_generics.md                                     # Generics : écrire une fois, utiliser pour n'importe quel type
│   │   ├── 02_utility_types.md                                # Partial, Required, Pick, Omit, Record
│   │   ├── 03_union_intersection.md                           # Union et intersection : composer des types comme des sets mathématiques
│   │   └── 04_type_guards.md                                  # Rétrécir un type à runtime : typeof, instanceof, discriminated unions
│   ├── 03_ts_advanced/
│   │   ├── 01_conditional_types.md                            # T extends U ? X : Y : les types qui dépendent d'autres types
│   │   ├── 02_mapped_types.md                                  # Transformer chaque propriété d'un type sans les réécrire une par une
│   │   └── 03_ts_in_real_project.md                           # TS dans un vrai projet : config, migration, boundaries, décisions
│   └── 04_typescript_grimoire.md
│
├── 15_runtime_env/                                             # Savoir où ton code vit vraiment : Node, navigateur, workers
│   ├── 00_why_runtime_env.md                                   # window n'existe pas dans Node : même JS, plusieurs mondes, des règles différentes
│   ├── 01_node_vs_browser.md                                  # Même JS, deux environnements différents : des APIs qui ne se partagent pas
│   ├── 02_streams_buffers.md                                   # Lire des données en flux sans charger tout en mémoire
│   ├── 03_commonjs_vs_esm.md                                   # require vs import : l'histoire, les différences, et ce qu'on utilise en 2026
│   ├── 04_process_env_argv.md                                  # process.env, process.argv : lire la config sans la hard-coder
│   ├── 05_worker_threads.md                                    # Paralléliser en Node sans bloquer l'event loop
│   ├── 06_node_cli_scripts/
│   │   ├── 01_cli_basics.md                                   # args, flags, stdin/stdout : les bases du CLI Node
│   │   ├── 02_filesystem_ops.md                               # fs, path, readline : lire, écrire, traverser sans s'arracher les cheveux
│   │   ├── 03_automation_scripts.md                           # Scripts qui automatisent : renommer, transformer, synchroniser
│   │   └── 04_cli_tool_builder.md                             # Construire un vrai outil CLI distribuable avec titanr ou yargs
│   └── 07_runtime_grimoire.md
│
├── 16_architecture_patterns/                                   # Construire grand sans tout effondrer en ajoutant une feature
│   ├── 00_why_architecture_patterns.md                         # 5 fichiers tiennent debout peu importe l'organisation, 500 s'effondrent à la première feature mal placée
│   ├── 01_module_pattern.md                                   # Encapsuler, exposer ce qui doit l'être, cacher le reste
│   ├── 02_mvc_pattern.md                                      # Model, View, Controller : séparer les responsabilités avant de s'y noyer
│   ├── 03_clean_architecture.md                               # Domaine au centre, infra à l'extérieur : le code qui ne dépend pas de ses outils
│   ├── 04_event_driven.md                                     # Event-driven : réagir aux événements plutôt que les anticiper
│   ├── 05_microservices_intro.md                              # Découper en services : quand ça aide et quand ça complique
│   └── 06_architecture_grimoire.md
│
├── 17_web_concepts/                                            # Tout ce qu'un ingénieur web doit avoir en tête : pas juste dans les doigts
│   ├── 00_why_web_concepts.md                                  # Tu sais écrire un fetch, mais sais-tu pourquoi ça répond 403 et pas 401 ?
│   ├── 01_http_rest_basics.md                                 # HTTP, verbes, status codes, headers : lire une requête comme un professionnel
│   ├── 02_browser_render_pipeline.md                          # De l'HTML brut au pixel affiché : ce qui se passe entre les deux
│   ├── 03_state_and_dataflow.md                               # L'état d'une app web : qui le possède, qui le lit, qui le modifie
│   ├── 04_caching_strategies.md                               # Cache-Control, ETags, stale-while-revalidate : mettre en cache sans mettre en danger
│   ├── 05_auth_authz.md                                       # Authentification vs autorisation : deux problèmes différents, deux solutions différentes
│   ├── 06_serialization.md                                    # JSON, MessagePack, Protobuf : sérialiser sans perdre de données
│   ├── 07_seo_and_rendering.md                                # SSR, SSG, CSR, ISR : choisir le bon mode de rendu pour la bonne raison
│   └── 08_web_concepts_grimoire.md
│
├── 18_accessibility/                                           # Coder pour tout le monde : pas juste pour les shinobis qui te ressemblent
│   ├── 00_why_accessibility.md                                 # Ferme les yeux, navigue ton site au clavier : si tu bloques, tu exclus du monde réel
│   ├── 01_a11y_why_it_matters.md                              # L'accessibilité n'est pas une option : les chiffres, les lois, et les gens réels
│   ├── 02_aria_basics.md                                      # ARIA roles, states, properties : communiquer avec les lecteurs d'écran
│   ├── 03_keyboard_navigation.md                              # tab order, focus management, skip links : naviguer sans souris
│   ├── 04_contrast_and_colors.md                              # Ratio de contraste WCAG : les calculs, les outils, les décisions
│   ├── 05_screen_readers.md                                   # VoiceOver, NVDA, TalkBack : comment un lecteur d'écran interprète ton code
│   ├── 06_a11y_audit.md                                       # Auditer une page avec axe, Lighthouse, et les tests manuels
│   └── 07_a11y_grimoire.md
│
├── 19_i18n/                                                    # Parler toutes les langues sans tout réécrire
│   ├── 00_why_i18n.md                                          # Une date japonaise lue à l'envers, un prix allemand qui semble 1000x moins cher : l'i18n c'est une architecture, pas une traduction
│   ├── 01_i18n_basics.md                                      # Clés de traduction, namespaces, fallbacks : l'architecture i18n de base
│   ├── 02_dates_timezones.md                                  # Les dates à travers les fuseaux horaires : le cauchemar et comment le résoudre
│   ├── 03_number_formats.md                                   # 1,234.56 vs 1.234,56 : les formats numériques selon les pays
│   ├── 04_pluralization.md                                    # "1 résultat" vs "2 résultats" vs "many" : la pluralisation qui varie par langue
│   ├── 05_i18n_in_project.md                                  # Intégrer l'i18n dans un projet réel : organisation, performance, DX
│   └── 06_i18n_grimoire.md
│
├── 20_realtime/                                                # Le web qui respire en direct : WebSockets, SSE, WebRTC
│   ├── 00_why_realtime.md                                      # Un chat qu'il faut rafraîchir, un score affiché 5 minutes en retard : du HTTP classique qui ne suffit plus
│   ├── 01_websockets/
│   │   ├── 01_ws_basics.md                                    # Ouvrir, envoyer, recevoir, fermer : le cycle de vie d'une WebSocket
│   │   └── 02_ws_chat_room.md                                  # Construire un chat room avec rooms, broadcast, historique
│   ├── 02_sse/
│   │   ├── 01_sse_basics.md                                   # EventSource, event types, reconnect automatique
│   │   └── 02_sse_live_feed.md                                 # Dashboard live avec SSE : données de match en temps réel
│   ├── 03_webrtc/
│   │   ├── 01_webrtc_concepts.md                              # ICE, SDP, STUN, TURN : le vocabulaire WebRTC sans la peur
│   │   └── 02_webrtc_demo.md                                  # Appel vidéo peer-to-peer dans le navigateur
│   └── 04_realtime_grimoire.md
│
├── 21_api_craft/                                               # Construire ce que le monde consomme : et qui ne tombe pas en prod
│   ├── 00_why_api_craft.md                                     # Écrire une route, ça va. Construire une API que d'autres consomment pendant des années sans tout casser, c'est un métier
│   ├── 01_express_from_scratch.md                             # Monter un serveur Express depuis zéro : pas de boilerplate, juste la logique
│   ├── 02_rest_crud_complete.md                               # CRUD complet sur une ressource : GET, POST, PUT, PATCH, DELETE
│   ├── 05_error_handling_api.md                               # Les erreurs d'API : status codes, formats d'erreur, middleware global
│   ├── 04_auth_jwt.md                                         # JWT de bout en bout : sign, verify, refresh : et ce qui peut foirer
│   ├── 05_graphql_basics.md                                   # Schema, resolvers, queries, mutations : GraphQL sans la magie
│   ├── 06_api_versioning.md                                   # Versionner une API sans tout casser pour les clients existants
│   ├── 07_openapi_swagger.md                                  # Documenter une API avec OpenAPI : le contrat que tout le monde peut lire
│   └── 08_api_grimoire.md
│
├── 22_security/                                                # Ne jamais être la faille que quelqu'un exploite
│   ├── 00_why_security.md                                      # Pas besoin d'un hacker en cagoule : un script automatisé qui scanne 24/7 trouve ton input non sanitisé
│   ├── 01_xss_injection.md                                    # XSS et injection SQL : les deux attaques qui touchent le plus d'apps en prod
│   ├── 02_csrf_cors.md                                        # CSRF et CORS : comprendre les deux avant de misconfigurer l'un ou l'autre
│   ├── 03_prototype_pollution.md                              # Polluer Object.prototype depuis un input shinobi : pourquoi c'est catastrophique
│   ├── 04_auth_flows.md                                       # OAuth, sessions, JWT : les trois modèles d'auth et quand choisir lequel
│   ├── 05_hashing_bcrypt.md                                   # Hasher un mot de passe : bcrypt, salt, coût, ce qu'on ne stocke jamais en clair
│   ├── 06_owasp_checklist.md                                  # Les 10 vulnérabilités OWASP les plus fréquentes : et comment les éviter
│   └── 07_security_grimoire.md
│
├── 23_ai_native_dev/                                           # Utiliser l'IA sans perdre le contrôle : ni son jugement
│   ├── 00_why_ai_native_dev.md                                 # L'IA génère du code qui compile et qui a l'air bon, et qui peut quand même halluciner une fonction qui n'existe pas
│   ├── 01_ai_workflow.md                                      # Comment intégrer l'IA dans son workflow sans devenir dépendant
│   ├── 02_prompt_engineering.md                               # Prompter pour obtenir du code utile : pas du code plausible
│   ├── 03_validate_ai_output.md                               # Valider ce que l'IA génère : typage, parsing, tests automatiques
│   ├── 04_ai_refactor_partner.md                              # Utiliser l'IA comme partenaire de refactoring : pas comme remplaçant
│   ├── 05_ai_test_generator.md                                # Générer des tests avec l'IA : et vérifier qu'ils testent vraiment quelque chose
│   ├── 07_solo_vs_copilot_drill.md                            # Mesurer ta dépendance à l'IA dans le temps : pas une croyance, une donnée datée
│   ├── 08_ai_code_review_arena.md                             # 5 snippets piégés à reviewer : patterns IA vs patterns humains, corrigé en spoiler
│   └── 09_ai_grimoire.md
│
├── 24_ai_agents_and_autonomy/                                  # Quand l'IA agit toute seule : lui faire confiance, ou pas, ça se vérifie
│   ├── 00_prereq_check.md
│   ├── 00_why_ai_agents.md                                     # Un agent qui code sans supervision, c'est un stagiaire avec les clés du serveur
│   ├── 01_agents_vs_copilots.md                                # Copilot propose, agent agit : la différence qui change tout niveau risque
│   ├── 02_verifiable_specifications.md                         # Écrire un cahier des charges qu'un agent peut pas mal interpréter
│   ├── 03_reading_agent_traces.md                              # Lire ce qu'un agent a vraiment fait : pas ce qu'il prétend avoir fait
│   ├── 04_refusing_a_trace.md                                  # Savoir dire non à une action d'agent avant qu'elle parte en prod
│   ├── 05_agent_sandbox_hygiene.md                             # Isoler un agent : lui donner un bac à sable, pas les clés de la maison
│   ├── 06_agents_grimoire.md
│   ├── 07_agent_hallucination_gym.md                           # Entraîner ton œil à repérer un agent qui invente
│   └── EXO_PARTITION_HUMAIN_IA.md
│
├── 25_databases/                                               # Persister intelligemment dans le temps : et retrouver rapidement
│   ├── 00_why_databases.md                                     # Une requête à 5ms sur 1000 lignes peut en prendre 8s sur 10 millions, juste parce qu'il manque un index
│   ├── 01_sql_basics.md                                       # SELECT, JOIN, INDEX, EXPLAIN : lire et interroger une DB relationnelle
│   ├── 02_nosql_basics.md                                     # Document, clé-valeur, graphe : choisir la bonne DB pour le bon problème
│   ├── 03_data_modeling.md                                    # Modéliser des données : normalisation, dénormalisation, quand faire quoi
│   ├── 04_redis_caching.md                                    # Redis comme cache : TTL, invalidation, strategies
│   ├── 05_db_in_js.md                                         # Prisma, Drizzle, pg, mongoose : se connecter et requêter sans ORM hell
│   └── 06_databases_grimoire.md
│
├── 26_scalability/                                             # Tenir quand ça devient sérieux : 10 users vs 10 millions c'est pas le même code
│   ├── 00_why_scalability.md                                   # 10 shinobis ça va, 10 millions sur le même serveur sans rien changer : effondrement garanti
│   ├── 01_load_balancing.md                                   # Distribuer le trafic : round-robin, least connections, sticky sessions
│   ├── 02_horizontal_vs_vertical.md                           # Scale up vs scale out : deux stratégies, deux contextes, deux coûts
│   ├── 03_rate_limiting.md                                    # Limiter les requêtes sans bloquer les shinobis légitimes
│   ├── 04_message_queues.md                                   # Découpler producteur et consommateur avec une queue de messages
│   └── 05_scalability_grimoire.md
│
├── 27_observability/                                           # Voir ce qui se passe en prod : avant que l'shinobi le signale
│   ├── 00_why_observability.md                                 # "Ça marche pas parfois" et toi sans logs, sans traces, sans métriques : t'es aveugle en prod
│   ├── 01_structured_logging.md                               # Log en JSON avec correlation ID : les logs qu'on peut chercher et analyser
│   ├── 02_distributed_tracing.md                              # Suivre une requête à travers plusieurs services : sans perdre le fil
│   ├── 03_metrics_alerting.md                                  # Compteurs, gauges, histogrammes : les métriques qui annoncent les problèmes
│   ├── 04_sentry_in_prod.md                                   # Sentry : capturer, contextualiser, prioriser les erreurs en production
│   ├── 05_debug_in_prod.md                                    # Debugger sans reproduire localement : logs, snapshots, feature flags
│   └── 06_observability_grimoire.md
│
├── 28_team_craft/                                              # Coder avec des humains : pas juste avec une machine
│   ├── 00_why_team_craft.md                                    # Tu sais coder mais tu sais pas travailler avec des humains : t'es pas un dev senior, t'es un problème
│   ├── 01_code_review.md                                      # Reviewer sans écraser, commenter sans blesser, approuver sans se planquer
│   ├── 02_adr_writing.md                                      # ADR : documenter une décision technique avant de coder, pas après
│   ├── 03_technical_writing.md                                # Écrire pour des devs : README, docs, runbooks : clair et utilisable
│   ├── 04_navigate_codebase.md                                # Lire un codebase inconnu sans se perdre : les techniques des dev expérimentés
│   ├── 05_pair_programming.md                                 # Pair programming efficace : driver, navigator, quand switcher
│   └── 06_team_grimoire.md
│
├── 29_edge_cases/                                              # JS qui se rebelle : et comment y survivre
│   ├── 00_why_edge_cases.md                                    # JS construit en 10 jours en 1995 : des zones sombres permanentes, et elles sont dans ton code aujourd'hui
│   ├── 01_nan_undefined_null.md                               # NaN, undefined, null : trois façons différentes de dire "rien" : et leurs pièges
│   ├── 02_floating_point.md                                   # 0.1 + 0.2 !== 0.3 : l'arithmétique flottante et pourquoi elle surprend toujours
│   ├── 03_weird_coercions.md                                  # [] + {} = ?, {} + [] = ? : les coercions qui font rire et qui font mal
│   ├── 04_prototype_chain_dark.md                             # La chaîne prototype dans ses zones sombres : __proto__, hasOwnProperty, pollution
│   ├── 05_edge_cases_grimoire.md
│   └── 06_heisenbug_arena.md                                   # 5 bugs intermittents fournis : non-déterministes dans leur timing, déterministes dans leur cause
│
├── 30_oop_js/                                                  # prototype, classes, héritage : la face cachée de JS
│   ├── 00_why_oop_js.md                                        # class en JS, c'est une façade : derrière, c'est la chaîne de prototypes qui tient toute la baraque
│   ├── 01_prototype_chain_raw.md                              # Object.create, [[Prototype]] : la chaîne brute, sans aucun sucre
│   ├── 02_constructor_functions.md                            # new, this, .prototype : la façon old school avant "class"
│   ├── 03_class_syntax_sugar.md                               # preuve que class = wrapper sur tout ce qu'on vient de voir
│   ├── 04_this_keyword_rules.md                                # this selon le call-site : méthode, fonction libre, arrow
│   ├── 05_call_apply_bind.md                                   # emprunter une fonction, figer this
│   ├── 06_inheritance_extends_super.md                         # extends/super, et pourquoi les hiérarchies profondes piègent
│   ├── 07_encapsulation_privacy.md                             # # private fields vs closures : ce qu'on protège vraiment
│   ├── 08_static_getters_setters.md                            # static, get/set : logique cachée derrière une syntaxe d'attribut
│   ├── 09_composition_vs_inheritance.md                        # mixins, "has-a" vs "is-a" : la vraie décision senior
│   └── 10_oop_js_grimoire.md
│
├── 31_mini_projects/                                           # Assembler tout ça pour de vrai : pas des exercices, des systèmes
│   ├── 00_why_mini_projects.md                                 # Pourquoi des projets et pas juste des exercices : tableau de prérequis par projet, comment aborder le premier
│   ├── 01_rasengan_engine/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/                    # à créer manuellement pendant le projet
│   │   └── tests/                  # à créer manuellement avant le code
│   ├── 02_garo_no_kronika/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/                    # à créer manuellement pendant le projet
│   │   └── tests/                  # à créer manuellement avant le code
│   ├── 03_walking_dead_protocol/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/                    # à créer manuellement pendant le projet
│   │   └── tests/                  # à créer manuellement avant le code
│   ├── 04_breaking_cache/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/                    # à créer manuellement pendant le projet
│   │   └── tests/                  # à créer manuellement avant le code
│   ├── 05_prison_break_api/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/                    # à créer manuellement pendant le projet
│   │   └── tests/                  # à créer manuellement avant le code
│   ├── 06_ultras_dashboard/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/                    # à créer manuellement pendant le projet
│   │   └── tests/                  # à créer manuellement avant le code
│   ├── 07_ballon_dor_cli/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/                    # à créer manuellement pendant le projet
│   │   └── tests/                  # à créer manuellement avant le code
│   ├── 08_trapsoul_radio/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/                    # à créer manuellement pendant le projet
│   │   └── tests/                  # à créer manuellement avant le code
│   ├── 09_oracle_glitch/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/                    # à créer manuellement pendant le projet
│   │   └── tests/                  # à créer manuellement avant le code
│   ├── 10_legacy_dungeon/                                      # Pas de src/ ni tests/ : tu investigues un repo cloné à côté, pas écrit ici
│   │   ├── cahierdescharges.md                                 # les 4 critères de choix du repo, les 3 étapes, les candidats de départ
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md                                      # journal d'investigation (partie 1) + TDD classique du bugfix (partie 2)
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   │   └── ADR-001_pourquoi_ce_code_est_ce_quil_est.md     # gabarit avec exemple rempli (Express), décision déduite après coup
│   │   ├── MAP.md                  # à créer manuellement (Étape 1 : cartographie, 2h chrono)
│   │   └── BUGFIX.md               # à créer manuellement (Étape 2 : preuve avant/après)
│   └── _synthesis/                                             # Les 5 missions qui te forcent à croiser plusieurs blocs de modules d'un coup
│       ├── synthese_A.md                                       # Après 01-04 : runtime + async + erreurs + tests
│       ├── synthese_B.md                                       # Après 05-09 : perf + structures + algos + FP
│       ├── synthese_C.md                                       # Après 10-13 : patterns + refactor + résolution + TS
│       ├── synthese_D.md                                       # Après 14-21 : runtime web + archi + sécurité
│       └── synthese_E.md                                       # Après 22-28 : IA + data + scale + observabilité + OOP
│
├── 32_annexes/
│   ├── 00_arborescence_complete.md                             # Ce fichier-ci : la carte complète du dépôt
│   ├── 01_ascii_charte.md                                         # 8 schémas canoniques (call stack, event loop, heap/stack, etc.) : une seule version, partout
│   ├── 02_system_design_grimoire.md
│   ├── toolchain/
│   │   ├── 00_why_toolchain.md                                # Un dev qui code bien mais maîtrise pas sa toolchain, c'est un survivant sans radio
│   │   ├── 01_git_survival.md                                 # Git sans pleurer : branches, rebase, conflits, bisect
│   │   ├── 02_vscode_setup.md                                 # VSCode configuré pour un dev JS/TS sérieux : pas pour faire joli
│   │   ├── 03_package_managers.md                             # npm, yarn, pnpm : les différences qui comptent vraiment en 2026
│   │   ├── 04_bundlers.md                                     # Webpack, Vite, esbuild, Rollup : choisir sans subir
│   │   ├── 05_docker_basics.md                                # Containeriser une app Node : Dockerfile, compose, multi-stage builds
│   │   ├── 06_cicd_basics.md                                  # GitHub Actions de zéro : tester, builder, déployer à chaque push
│   │   └── 07_toolchain_grimoire.md                           # Le vocabulaire de la chaîne : chaque terme à sa place
│   └── typescript_advanced/
│       ├── 00_why_typescript_advanced.md                       # Scofield prépare son évasion mur par mur : ici, c'est typer du code que t'as pas écrit, configurer le compilateur, migrer sans tout casser
│       ├── 01_declaration_files.md                            # .d.ts : écrire les types pour du JS sans types
│       ├── 02_ts_compiler_config.md                           # tsconfig.json : chaque option expliquée avec son impact réel
│       ├── 03_ts_migration_guide.md                           # Migrer du JS pur vers TypeScript : sans tout réécrire en une nuit
│       └── 04_ts_advanced_grimoire.md                         # Le vocabulaire du TS avancé : declaration files, compiler config, migration
│
└── 33_tools/                                                   # Les gadgets maison pour aller plus vite : réutilisables dans tous les modules
    ├── 00_why_tools.md                                         # Pas une leçon en plus : l'établi du camp, le marteau lui-même, prêt à frapper dans chaque mini-projet
    ├── 01_logger_structure.md                                  # Logger structuré réutilisable : la base de l'observabilité maison
    ├── 02_benchmark_kit.md                                     # Mesurer la perf de n'importe quel bout de code sans réinventer la roue
    ├── 03_debug_toolkit.md                                     # Le kit de debug qu'on rebranche sur chaque projet
    ├── 04_cli_scaffolder.md                                    # Générer la structure d'un nouveau projet en une ordre_mission
    └── 05_tools_grimoire.md
```

---
