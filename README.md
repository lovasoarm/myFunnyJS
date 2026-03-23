# MyFunnyJS

## Présentation

Bienvenue dans **MyFunnyJS**, le projet qui transforme un simple humain avec un clavier en **ingénieur logiciel qui déchire tout**. Ici on apprend JavaScript, mais les concepts sont universels : structures, algos, patterns, sécurité, architecture… bref, tu pourras coder n'importe quoi dans n'importe quel langage après ça.

Le mot d'ordre : **apprendre sérieusement en s'amusant**. Chaque dossier est un niveau ou un concept clé, avec des exercices fous, des mini-projets déjantés et des scénarios qui font travailler ton cerveau comme un hacker intergalactique.

---

## Organisation du projet estimée

```
MyFunnyJS/
├── README.md                                        # Le manifeste CrazyDevs : lis ça avant de coder
├── CONTRIBUTING.md                                  # Comment contribuer sans tout péter
├── CHANGELOG.md                                     # Historique des updates du curriculum
│
│
├── 01_fundamentals/                                 # Les bases : zéro excuse de les ignorer
│   ├── 01_variables/                               # Variables = Super Pouvoir
│   │   ├── 01_intro_variables.js                   # Primitives vs objets, la vérité cachée
│   │   ├── 02_reference_chaos.js                   # Les références qui foutent tout en l'air
│   │   └── 03_mutation_madness.js                  # Mutation & copies : shallow vs deep
│   ├── 02_scope/                                   # Scope & Contexte : où vit ton code ?
│   │   ├── 01_scope_basics.js                      # Global, local, block : les territoires
│   │   ├── 02_closure_trap.js                      # Fermetures et pièges mortels
│   │   └── 03_scope_escape_room.js                 # Escape room de closures
│   ├── 03_functions/                               # Fonctions comme jouets de guerre
│   │   ├── 01_function_basics.js                   # Définition, appel, retour
│   │   ├── 02_hof_map_filter.js                    # HOF, map, filter, reduce
│   │   └── 03_function_factory.js                  # Usines à fonctions & patterns
│   ├── 04_types/                                   # Types, coercition & dynamisme JS
│   │   ├── 01_primitives.js                        # string, number, boolean, symbol
│   │   ├── 02_type_coercion.js                     # Conversions implicites et pièges
│   │   └── 03_type_transformers.js                 # Transformer et vérifier les types
│   ├── 05_web_basics/                              # Web Fundamentals immersifs
│   │   ├── 01_dom_manipulation.js                  # DOM, sélecteurs, events, animations
│   │   ├── 02_fetch_adventure.js                   # Fetch API dans des missions crazys
│   │   ├── 03_storage_treasure.js                  # LocalStorage & Cookies comme trésor
│   │   ├── 04_template_portals.js                  # Templates strings & DOM templating
│   │   ├── 05_web_helpers.js                       # Fonctions DOM/event réutilisables
│   │   └── 06_module_factory.js                    # Modules ES6, import/export
│   └── 06_regex/                                   # Regex : l'arme secrète du parseur
│       ├── 01_regex_basics.js                      # Syntaxe, flags, patterns de base
│       ├── 02_regex_combat.js                      # Validation email, URL, téléphone
│       └── 03_regex_extractor.js                   # Capturer, remplacer, splitter comme un sniper
│
│
├── 02_async/                                        # L'Event Loop : ton cerveau doit suivre
│   ├── 01_callbacks/                               # Callbacks : l'ancien monde qui fait encore mal
│   │   ├── 01_callback_maze.js                     # Labyrinthe de callbacks
│   │   └── 02_callback_challenge.js                # Challenge pratique
│   ├── 02_promises/                                # Promises : l'espoir encodé
│   │   ├── 01_promise_race.js                      # Race entre promesses
│   │   └── 02_promise_chain_reactor.js             # Chainage nucléaire
│   ├── 03_async_await/                             # Async/await : le futur propre
│   │   ├── 01_async_jungle.js                      # Async dans une jungle de fonctions
│   │   └── 02_async_rescue.js                      # Opération sauvetage async
│   └── 04_event_loop/                              # Mono-thread, micro vs macrotasks
│       ├── 01_microtask_madness.js                 # Microtasks en folie totale
│       └── 02_macrotask_monsters.js                # Macrotasks et timing de monstre
│
│
├── 03_testing_first/                                # Tests : pas une option, une religion                                          
│   ├── 01_why_testing_or_die.js                    # Pourquoi tester : avant que la prod explose
│   ├── 02_unit_sniper.js                           # Unit tests : tester une fonction comme un sniper
│   ├── 03_jest_crash_course.js                     # Jest from scratch : describe, it, expect
│   ├── 04_mocking_madness.js                       # Mocking & spies : simuler la réalité
│   ├── 05_integration_reactor.js                   # Tests d'intégration : plusieurs pièces ensemble
│   ├── 06_tdd_arena.js                             # TDD : écrire le test avant le code, comme un boss
│   ├── 07_test_driven_refactor.js                  # Refactorer en sécurité grâce aux tests
│   ├── 08_contract_testing_pact.js                 # Contract testing : API qui tiennent leur promesse
│   └── 09_e2e_playwright_beast.js                  # Playwright E2E : tester comme un vrai utilisateur
│
│
├── 04_math_basics/                                 # Maths : les fondations invisibles du code
│   ├── 01_logic_gates.js                           # Logique booléenne & opérateurs bits
│   ├── 02_modular_arithmetic.js                    # Modulo, hashing, crypto basics
│   ├── 03_probability_basics.js                    # Probabilités pour algos randomisés
│   ├── 04_combinatorics_blast.js                   # Permutations, combinaisons, factorielles
│   └── 05_linear_algebra_lite.js                   # Matrices, vecteurs (pour ML/graphics)
│
│
├── 05_memory_performance/                          # Mémoire & Performance Turbo
│   ├── 01_gc/                                      # Garbage Collector : qui nettoie tes saletés ?
│   │   ├── 01_gc_basics.js                         # Bases GC, mark & sweep
│   │   └── 02_gc_simulator.js                      # Simule le GC toi-même
│   ├── 02_copy_vs_ref/                             # Shallow vs Deep : le miroir trompeur
│   │   ├── 01_shallow_vs_deep.js                   # Copie superficielle vs profonde
│   │   └── 02_mutation_minefield.js                # Champ de mines de mutations
│   ├── 03_complexity/                              # Big-O : mesure tout, optimise tout
│   │   ├── 01_big_o_basics.js                      # O(1) à O(2n) expliqués
│   │   ├── 02_complexity_analysis.js               # Analyser des algos réels
│   │   └── 03_runtime_race.js                      # Course de performance en live
│   ├── 04_profiling/                               # Profiling : trouver les goulots d'étranglement
│   │   ├── 01_profiling_basics.js                  # Mesurer avec performance.now()
│   │   └── 02_memory_leak_hunter.js                # Chasse aux fuites mémoire
│   └── 05_core_web_vitals/                         # Perf réelle mesurée : ce que Google juge
│       ├── 01_lcp_fid_cls_basics.js                # LCP, INP, CLS : les 3 juges du navigateur
│       ├── 02_lighthouse_audit.js                  # Auditer & scorer une vraie page
│       └── 03_perf_budget_enforcer.js              # Définir et défendre un budget de performance
│
│
├── 06_data_structures/                             # Structures de données : les armes secrètes
│   ├── 01_array/                                   # Arrays : le couteau suisse universel
│   │   ├── 01_array_basics.js                      # Manipulation fondamentale
│   │   └── 02_array_adventure.js                   # Exercices immersifs
│   ├── 02_linked_list/                             # Linked List : la chaîne de l'enfer
│   │   ├── 01_linked_list_basics.js                # Création & parcours
│   │   └── 02_linked_list_labyrinth.js             # Traversée complexe
│   ├── 03_stack/                                   # Stack : LIFO, le tas de pancakes cosmiques
│   │   ├── 01_stack_basics.js                      # Push/pop sans tricher
│   │   └── 02_stack_tower.js                       # Tour d'empilement épique
│   ├── 04_queue/                                   # Queue : FIFO, la file d'attente de l'enfer
│   │   ├── 01_queue_basics.js                      # FIFO basique
│   │   └── 02_queue_conveyor.js                    # Chaîne de production optimisée
│   ├── 05_heap/                                    # Heap : le roi des priorités
│   │   ├── 01_min_heap.js                          # Min-heap from scratch
│   │   └── 02_max_heap_battle.js                   # Battle du max-heap
│   ├── 06_bst_avl/                                 # BST & AVL : arbres de puissance pure
│   │   ├── 01_bst_basics.js                        # BST insertion/recherche
│   │   └── 02_avl_tree_escape.js                   # AVL rotations & équilibre
│   ├── 07_hash_table/                              # Hash Table : la mémoire parfaite du hacker
│   │   ├── 01_hash_basics.js                       # Clé/valeur from scratch
│   │   └── 02_hash_treasure.js                     # Chasse au trésor hashée
│   ├── 08_union_find/                              # Union-Find : qui est connecté à qui ?
│   │   ├── 01_union_find_basics.js                 # Union-find simple
│   │   └── 02_union_find_rebellion.js              # Compression de chemin avancée
│   ├── 09_graphs/                                  # Graphes : modéliser le monde réel en code
│   │   ├── 01_graph_traversal.js                   # BFS/DFS : explorer le graphe
│   │   └── 02_graph_maze.js                        # Labyrinthe de graphes
│   ├── 10_fenwick_tree/                            # Fenwick Tree : sommes cumulées à la vitesse de la lumière
│   │   └── 01_fenwick_basics.js                    # BIT from scratch
│   └── 11_suffix_array/                            # Suffix Array : recherche de patterns like a boss
│       └── 01_suffix_array_basics.js               # Construction & utilisation
│
│
├── 07_algorithms/                                  # Algorithmes : les patterns qui résolvent tout
│   ├── 01_sorting/                                 # Tri : mettre de l'ordre dans le chaos absolu
│   │   ├── 01_bubble_sort_showdown.js              # Bubble sort : le lent mais pédagogue
│   │   ├── 02_quick_sort_race.js                   # Quick sort : le rapide et brutal
│   │   └── 03_merge_sort_fusion.js                 # Merge sort : divide & conquer
│   ├── 02_searching/                               # Recherche : trouver l'aiguille dans la botte
│   │   ├── 01_linear_search_hunt.js                # Linear search
│   │   └── 02_binary_search_mission.js             # Binary search : couper en deux jusqu'à la vérité
│   ├── 03_dynamic_programming/                     # DP : se souvenir pour aller plus vite
│   │   ├── 01_fibonacci_factory.js                 # Fibonacci memoization
│   │   ├── 02_dp_knapsack_adventure.js             # Knapsack problem
│   │   └── 03_dp_matrix_dungeon.js                 # Dungeon matrix DP
│   ├── 04_greedy/                                  # Greedy : prendre le meilleur maintenant, tant pis demain
│   │   ├── 01_coin_change_caper.js                 # Rendu de monnaie optimisé
│   │   └── 02_greedy_goblin.js                     # Gobelin cupide challenge
│   ├── 05_backtracking/                            # Backtracking : essayer, échouer, recommencer sans honte
│   │   ├── 01_sudoku_escape.js                     # Résoudre un sudoku
│   │   └── 02_n_queens_battle.js                   # N-Queens battle
│   └── 06_graph_algorithms/                        # Algos de graphes : naviguer l'impossible
│       ├── 01_dijkstra_race.js                     # Dijkstra shortest path
│       └── 02_a_star_dungeon.js                    # A* pathfinding dans un donjon
│
│
├── 08_functional_js/                               # JS Fonctionnel : coder sans effets de bord ni regrets
│   ├── 01_pure_function_jungle.js                  # Pure functions & immutabilité
│   ├── 02_composition_madness.js                   # Composition de fonctions
│   └── 03_currying_castle.js                       # Currying & partial application
│
│
├── 09_refactoring/                                 # Refactoring : écrire du code qui survit à son auteur
│   ├── 01_clean_code_basics.js                     # Nommage, lisibilité, KISS, DRY
│   ├── 02_solid_principles.js                      # SOLID : les 5 commandements du bon code
│   ├── 03_code_smells_lab.js                       # Identifier et corriger les code smells
│   └── 04_refactor_challenge.js                    # Transformer du spaghetti en chef d'œuvre
│
│
├── 10_runtime_env/                                 # Runtime : là où ton code prend vie (ou meurt)
│   ├── 01_browser_vs_node.js                       # Node vs Browser : les différences vitales
│   ├── 02_streams_river.js                         # Streams : traiter sans tout charger en RAM
│   ├── 03_buffers_lab.js                           # Buffers : manipulation binaire brute
│   ├── 04_node_module_system.js                    # CommonJS vs ESM : le grand schisme Node
│   ├── 05_node_process_env.js                      # process, argv, env : piloter Node depuis dehors
│   └── 06_worker_threads.js                        # Worker Threads : parallélisme en JS mono-thread
│
│
├── 11_architecture_patterns/                       # Architecture Ninja : construire en grand, penser en sage
│   ├── 01_module_castle.js                         # Module pattern
│   ├── 02_observer_watchtower.js                   # Observer pattern
│   ├── 03_factory_machine.js                       # Factory pattern
│   ├── 04_singleton_throne.js                      # Singleton : l'unique, l'intouchable
│   ├── 05_mvc_temple.js                            # MVC — séparer les responsabilités comme un pro
│   ├── 06_clean_architecture.js                    # Clean Architecture : couches & dépendances
│   ├── 07_event_driven_reactor.js                  # Event-driven : réagir aux événements du monde
│   └── 08_microservices_intro.js                   # Microservices : découper intelligemment
│
│
├── 12_web_concepts/                                # Concepts Web : tout ce qu'un ingénieur doit savoir
│   ├── 01_client_server_model.js                   # Client-Serveur : comment ça tourne vraiment
│   ├── 02_http_rest_fundamentals.js                # HTTP, verbes REST, status codes
│   ├── 03_browser_rendering.js                     # Pipeline de rendu du navigateur
│   ├── 04_state_and_data_flow.js                   # State, props, flux de données
│   ├── 05_separation_of_concerns.js                # Séparation des responsabilités
│   ├── 06_tradeoffs_abstractions.js                # Tradeoffs & abstractions — penser en ingénieur
│   ├── 07_caching_strategies.js                    # Caching : vitesse vs fraîcheur des données
│   ├── 08_data_serialization.js                    # JSON, XML, binaire : sérialiser les données
│   ├── 09_auth_vs_authz.js                         # Authentication vs Authorization
│   ├── 10_env_config_secrets.js                    # Config, .env, secrets management
│   └── 11_a11y_basics.js                           # Accessibilité : coder pour tout le monde
│
│
├── 13_api_craft/                                   # API Craft : construire ce que le monde consomme
│   ├── 01_express_dungeon.js                       # Express from scratch : routes, req, res, middleware
│   ├── 02_rest_architecture.js                     # REST : verbes, ressources, status codes comme un pro
│   ├── 03_crud_factory.js                          # CRUD complet : créer, lire, modifier, supprimer
│   ├── 04_middleware_chain.js                      # Middleware : la chaîne de traitement des requêtes
│   ├── 05_error_handling_fortress.js               # Gestion d'erreurs : ne jamais crasher en prod
│   ├── 06_graphql_portal.js                        # GraphQL : requêter exactement ce dont tu as besoin
│   └── 07_api_auth_vault.js                        # Auth API : JWT, headers, sécuriser ses endpoints
│
│
├── 14_security/                                    # Sécurité Badass : OWASP & au-delà des nightmares
│   ├── 01_xss_fortress.js                          # XSS : injection de scripts dans le navigateur
│   ├── 02_sql_injection_trap.js                    # SQL Injection : l'attaque classique depuis 1998
│   ├── 03_csrf_maze.js                             # CSRF : requêtes forgées dans le dos
│   ├── 04_prototype_police.js                      # Prototype Pollution : JS qui se retourne contre toi
│   ├── 05_auth_flows_vault.js                      # Auth flows : JWT, sessions, OAuth
│   └── 06_hashing_fortress.js                      # Hashing : bcrypt, salt, rainbow tables
│
│
├── 15_databases/                                   # Bases de données : persister intelligemment dans le temps
│   ├── 01_sql_dungeon.js                           # SQL : requêtes, jointures, indexes
│   ├── 02_nosql_chaos.js                           # NoSQL : documents, clé/valeur, graphes
│   ├── 03_db_design_arena.js                       # Modélisation, relations, normalisation
│   └── 04_caching_layer.js                         # Redis, caching strategies, TTL
│
│
├── 16_scalability/                                 # Scalabilité : tenir sous la pression sans imploser
│   ├── 01_load_balancing.js                        # Load balancing : distribuer la charge
│   ├── 02_horizontal_vs_vertical.js                # Scale horizontalement vs verticalement
│   ├── 03_rate_limiting_guard.js                   # Rate limiting : se protéger du flood
│   └── 04_message_queues.js                        # Message queues : RabbitMQ, Kafka intro
│
│
├── 17_edge_cases/                                  # Cas Bizarres : JS qui se rebelle contre son créateur
│   ├── 01_nan_madness.js                           # NaN : le nombre qui n'est pas un nombre
│   ├── 02_undefined_abyss.js                       # undefined vs null : l'abîme philosophique
│   └── 03_floating_point_fiasco.js                 # 0.1 + 0.2 != 0.3 : le scandale mondial
│
│
├── 18_bonus_crazy/                                 # Exercices Fous : le fun ne s'excuse pas
│   ├── 01_pirates/                                 # Pirates : coder ou couler
│   │   ├── 01_pirate_treasure_map.js               # Hash tables pour localiser le trésor
│   │   ├── 02_pirate_ship_battle.js                # Graphes & pathfinding en pleine mer
│   │   └── 03_pirate_kraken_escape.js              # Backtracking pour fuir le kraken
│   ├── 02_slashers/                                # Slashers : survie par l'algorithme
│   │   ├── 01_slasher_pursuit.js                   # BFS/DFS pour échapper au tueur
│   │   ├── 02_slasher_trap_lab.js                  # Closures & scope dans le labo maudit
│   │   └── 03_slasher_last_stand.js                # DP pour maximiser tes chances de survie
│   ├── 03_titans/                                  # Titans : Attack on Data Structures
│   │   ├── 01_titan_shifters.js                    # Polymorphisme & héritage titan
│   │   ├── 02_titan_wall_defense.js                # Stack & Queue pour défendre les murs
│   │   └── 03_titan_forest_chase.js                # A* pathfinding dans la forêt
│   ├── 04_anime_arena/                             # Anime Arena : les persos codent avec toi
│   │   ├── 01_naruto_shadow_clones.js              # Références & copies style Naruto
│   │   ├── 02_hunter_exam_algo.js                  # Algorithmes style Hunter x Hunter
│   │   └── 03_dragon_ball_power.js                 # Récursion & Big-O niveau Super Saiyan
│   └── 05_magic_lab/                               # Laboratoire Magique : alchimie de code pur
│       ├── 01_magic_potions.js                     # Composition & currying alchimiste
│       ├── 02_magic_portals.js                     # Graphs & BFS entre portails dimensionnels
│       └── 03_magic_creatures.js                   # POO & polymorphisme créatures
│
│
├── 19_ai_native_dev/                               # AI-Native Dev : coder avec l'IA comme un senior
│   │                                               # Le module le plus critique de 2026
│   ├── 01_cursor_workflow_unlocked.js              # Cursor : tab completion → generation → refactor loop
│   ├── 02_copilot_sniper_mode.js                   # Copilot : accepter, rejeter, guider intelligemment
│   ├── 03_prompt_engineering_for_devs.js           # Écrire des prompts qui génèrent du bon code
│   ├── 04_ai_code_review_protocol.js               # Valider ce que l'IA produit : les pièges classiques
│   ├── 05_when_to_trust_the_ghost.js               # Quand faire confiance, quand prendre le volant
│   ├── 06_ai_refactoring_loop.js                   # Refactoring assisté IA : le workflow propre
│   └── 07_ai_maintainable_code.js                  # Écrire du code que l'IA peut relire & modifier
│
│
├── 20_observability_prod/                          # Voir ce qui se passe en prod : l'œil du senior
│   ├── 01_structured_logging_lab.js                # Logs JSON structurés : fini les console.log nus
│   ├── 02_distributed_tracing_mission.js           # Tracing distribué : suivre une requête partout
│   ├── 03_metrics_alerting_tower.js                # Métriques & alerting : être prévenu avant le crash
│   ├── 04_error_tracking_sentry.js                 # Sentry : capturer, trier, corriger en prod
│   └── 05_debugging_prod_like_a_ghost.js           # Déboguer en prod sans tout casser
│
│
├── 21_team_craft/                                  # Coder en équipe : le vrai différenciateur senior
│   ├── 01_pr_review_dojo.js                        # Code review : donner & recevoir du feedback brutal
│   ├── 02_adr_decision_scrolls.js                  # ADR : documenter les décisions techniques qui durent
│   ├── 03_technical_writing_dojo.js                # Écrire pour être compris par des humains fatigués
│   ├── 04_onboarding_a_codebase.js                 # Naviguer un projet inconnu en moins d'une heure
│   └── 05_pairing_techniques.js                    # Pair programming : driver/navigator, ping-pong TDD
│
│
├── 22_mini_projects/                               # Projets Intégrateurs : tout assembler pour de vrai
│   ├── vaika_car_app/                              # App voiture : CRUD + async + Clean Archi
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md                          # Tests écrits AVANT le code : journal de bord
│   │   ├── POSTMORTEM.md                           # Ce qui a cassé, pourquoi, ce qu'on ferait mieux
│   │   ├── src/
│   │   │   ├── main.js
│   │   │   ├── api/
│   │   │   ├── models/
│   │   │   └── ui/
│   │   └── tests/
│   │       ├── api.test.js                         # Tests de la couche fetch
│   │       ├── models.test.js                      # Tests des entités
│   │       └── ui.test.js                          # Tests des interactions DOM
│   ├── mini_social_network/                        # Réseau social : auth + data flow + state
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md                          # Journal TDD
│   │   ├── POSTMORTEM.md                           # Postmortem
│   │   ├── src/
│   │   │   ├── main.js
│   │   │   ├── auth/
│   │   │   ├── feed/
│   │   │   └── store/
│   │   └── tests/
│   │       ├── auth.test.js                        # Tests login/register/JWT
│   │       ├── feed.test.js                        # Tests posts & likes
│   │       └── store.test.js                       # Tests state management
│   ├── crypto_tracker/                             # Crypto tracker : API externe + caching + WebSocket
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md                          # Journal TDD
│   │   ├── POSTMORTEM.md                           # Postmortem
│   │   ├── src/
│   │   │   ├── main.js
│   │   │   ├── api/
│   │   │   ├── cache/
│   │   │   └── realtime/
│   │   └── tests/
│   │       ├── api.test.js                         # Tests appels CoinGecko
│   │       └── cache.test.js                       # Tests stratégie TTL
│   ├── crazy_chat_app/                             # Chat app : WebSockets + event-driven + rooms
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md                          # Journal TDD
│   │   ├── POSTMORTEM.md                           # Postmortem
│   │   ├── src/
│   │   │   ├── main.js
│   │   │   ├── server/
│   │   │   ├── client/
│   │   │   └── events/
│   │   └── tests/
│   │       ├── server.test.js                      # Tests WS server
│   │       └── events.test.js                      # Tests event bus & routing
│   └── crazydevs_prototype/                        # Le grand projet final : tout ce qu'on a appris
│       ├── README.md
│       ├── TDD_JOURNAL.md                          # Journal TDD : le plus important de tous
│       ├── POSTMORTEM.md                           # Postmortem final
│       ├── ADR/                                    # Architecture Decision Records du projet
│       │   ├── 001_why_nextjs.md
│       │   ├── 002_why_supabase.md
│       │   └── 003_state_management_choice.md
│       ├── src/
│       │   ├── main.js
│       │   ├── core/
│       │   ├── infra/
│       │   ├── ui/
│       │   └── shared/
│       └── tests/
│           ├── core.test.js                        # Tests business logic
│           ├── infra.test.js                       # Tests DB & API
│           └── integration.test.js                 # Tests end-to-end
│
│
├── 23_annexes/                                     # Annexes pro : bonus pour aller encore plus loin
│   ├── toolchain/                                  # Toolchain : l'arsenal du dev moderne
│   │   ├── 01_npm_survival_guide.js                # npm, scripts, package.json : survivre à l'écosystème
│   │   ├── 02_vite_esbuild_turbo.js                # Vite & esbuild : bundler à la vitesse de la lumière
│   │   ├── 03_eslint_code_police.js                # ESLint : la police du code qui t'empêche de péter la prod
│   │   ├── 04_prettier_formatter.js                # Prettier : formater sans débattre des espaces
│   │   ├── 05_git_workflows.js                     # Git avancé : branches, rebase, hooks
│   │   └── 06_ci_cd_pipeline.js                    # CI/CD : automatiser jusqu'à zéro effort humain
│   └── typescript/                                 # TypeScript : JS avec un casque et une armure
│       ├── 01_why_typescript.ts                    # Pourquoi TS : quand JS commence à te mentir
│       ├── 02_types_interfaces.ts                  # Types & interfaces : nommer la réalité
│       ├── 03_generics_unleashed.ts                # Generics : le code qui s'adapte à tout
│       ├── 04_narrowing_guards.ts                  # Type narrowing & guards : réduire l'incertitude
│       ├── 05_utility_types_toolbox.ts             # Utility types : Partial, Pick, Omit & co
│       └── 06_ts_in_the_wild.ts                    # TypeScript sur de vrais projets : patterns pro
│
│
└── 24_tools/                                        # Arsenal du développeur : tes gadgets maison
    ├── 01_logger.js                                # Logger custom avec niveaux (debug/info/warn/error)
    ├── 02_helper_functions.js                      # Helpers réutilisables partout dans le projet
    ├── 03_array_utils.js                           # Utilitaires tableaux avancés
    ├── 04_benchmark.js                             # Mesurer les perfs de n'importe quoi
    ├── 05_debug_toolkit.js                         # Toolkit debug pour survivre aux bugs de 2h du matin
    └── 06_devtools_survival.js                     # DevTools : breakpoints, network, profiler
```

---

## Philosophie et tips

### Comprendre ce qui change vraiment

- Avant l'IA : la valeur = taper vite + connaître la syntaxe + installer 10 frameworks.
- Aujourd'hui : la valeur = **comprendre le code, choisir les bons patterns, sécuriser ton bazar**.
- L'IA fait du code, mais ne réfléchit pas. **Toi oui**, toi tu optimises, tu sécurises, tu domines.

### Ce qu'il faut apprendre pour devenir une légende

1. **Fondamentaux hardcore** : algos, structures, complexité, systèmes, bases de données.
2. **Architecture ninja** : Clean Architecture, microservices, event-driven, scalabilité, caching.
3. **Sécurité badass** : OWASP, injection, XSS, auth flows, hashing.
4. **Performance turbo** : profiling, optimisation mémoire, async/concurrency, threading.
5. **IA comme copilote** : générer, corriger, refactorer, comprendre le code IA. **Jamais copier-coller comme un zombie.**

---

## Concepts que tu dois maîtriser

- **Variables** : primitives vs objets, copier valeur vs copier adresse.
- **Scope & Contexte** : global, fonction, block, closures.
- **Fonctions comme jouets** : passer, retourner, stocker.
- **Call Stack & Event Loop** : mono-thread, microtasks vs macrotasks (ton cerveau doit suivre).
- **Structures de données** : Array, LinkedList, Stack, Queue, Heap, BST, AVL, Hash Table, Union-Find, Fenwick Tree, Suffix Array.
- **Complexité & Big-O** : O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ).
- **Patterns algorithmiques** : Brute Force, Divide & Conquer, Greedy, DP, Backtracking, Graph Traversal.
- **Patterns design & architecture** : Singleton, Factory, Observer, Module, MVC, Event-driven.
- **Sécurité & performance** : Injection, XSS, CSRF, hashing, threading, async/concurrency.
- **Maths** : logique booléenne, modular arithmetic, probabilités, combinatoires.
- **Refactoring** : SOLID, Clean Code, KISS, DRY, code smells.
- **Web concepts** : Client-Serveur, HTTP/REST, rendering pipeline, auth flows, caching, sérialisation.

> Tout ça fonctionne **pour n'importe quel langage**, JS n'est qu'un vecteur pour apprendre comme un boss.

---

## Bonus

Quelques exercices fous et interactifs :

- Pirates, slashers, titans, persos d'animés, laboratoires magiques...
- Objectif : appliquer variables, références, scope, async, structures, patterns dans des **contextes déjantés**.

---

## Roadmap de survie et domination

1. Fundamentals
2. Async & Event Loop
3. Testing
4. Math for Devs
5. Memory & Performance
6. Data Structures
7. Algorithms
8. Functional JS
9. Refactoring
10. Runtime Environment
11. Architecture & Patterns
12. Web Concepts
13. API
14. Security
15. Databases
16. Scalability
17. Edge Cases
18. Bonus Crazy
19. AI Native Dev
20. observability
21. Team CRAFT
22. mini-projects
23. annexes
24. tools

---

## Auteur

LOVASOA RAMAHALY
