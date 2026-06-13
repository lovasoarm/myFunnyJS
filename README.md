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
propose, tu décides. Le module `22_ai_native_dev` t'apprend exactement comment faire ça bien.

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
12  Problem Solving         =>  concevoir avant de coder : le cerveau que la syntaxe ne donne pas
13  TypeScript              =>  JS avec un casque et une armure (obligatoire en 2026)
14  Runtime Environment     =>  savoir où ton code vit vraiment
15  Architecture Patterns   =>  construire grand sans tout effondrer
16  Web Concepts            =>  tout ce qu'un ingénieur web doit avoir en tête
17  Accessibility (a11y)    =>  coder pour tout le monde, pas juste pour toi
18  i18n                    =>  parler toutes les langues sans tout réécrire
19  Real-Time               =>  WebSockets, SSE, WebRTC : le web qui respire en direct
20  API Craft               =>  construire ce que le monde consomme
21  Security                =>  ne jamais être la faille que quelqu'un exploite
22  AI Native Dev           =>  utiliser l'IA sans perdre le contrôle
23  Databases               =>  persister intelligemment dans le temps
24  Scalability             =>  tenir quand ça devient sérieux
25  Observability           =>  voir ce qui se passe en prod
26  Team Craft              =>  coder avec des humains, pas juste avec une machine
27  Edge Cases              =>  JS qui se rebelle, et comment y survivre
28  OOP en JS               =>  prototype, classes, héritage : la face cachée de JS
29  Mini Projects           =>  assembler tout ça pour de vrai
30  Annexes                 =>  toolchain, Node CLI, TypeScript avancé
31  Tools                   =>  les gadgets maison pour aller plus vite
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

**13 : TypeScript.** En 2026, ne pas savoir TypeScript, c'est se présenter à un entretien
sans chaussures. Ce n'est plus un bonus. C'est le standard.

**15 + 20 : Architecture + API Craft.** Sans patterns solides et sans API propres, ton
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
           13_typescript               <=  sans ça, t'es hors marché en 2026
                |
    15_architecture + 20_api           <=  sans ça, t'es junior à vie
```

Le reste (sécurité, scalabilité, observabilité, team craft, a11y, i18n, real-time) c'est ce
qui fait la différence entre un bon dev et un senior. Mais ces six blocs, c'est le ticket
d'entrée. Maîtrise ça d'abord. Le reste vient avec le temps et les projets réels.

---

## ARBORESCENCE COMPLÈTE

```
MyFunnyJS/
├── README.md                                                   # La carte du territoire : lis ça avant de toucher quoi que ce soit
├── CONTRIBUTING.md                                             # Les règles du camp : pas de PR qui pue
│
├── 01_fundamentals/                                            # Le socle : sans ça, le reste s'effondre
│   ├── 00_Le_Guide_que_ton_prof_aurait_du_te_donner_le_jour_1.md
│   ├── 01_variables/
│   │   ├── 01_intro_variables.md                              # Ce qu'une variable est vraiment en mémoire
│   │   ├── 02_reference_chaos.md                              # Quand deux variables pointent vers le même enfer
│   │   ├── 03_mutation_madness.md                             # Muter un objet par accident et ne pas comprendre pourquoi ça fout tout en l'air
│   │   ├── 04_const_trap.md                                   # const ne veut pas dire immuable : le piège classique
│   │   └── 05_variable_glossary.md
│   ├── 02_scope/
│   │   ├── 01_scope_basics.md                                 # Portée locale, globale, et le bloc qu'on oublie toujours
│   │   ├── 02_closure_trap.md                                 # La closure qui garde une variable en otage après la mort de la fonction
│   │   ├── 03_scope_escape_room.md                            # Escape room : trouve la variable, comprends le contexte, sors vivant
│   │   └── 04_scope_glossary.md                               # closure, hoisting, TDZ : chaque terme démystifié
│   ├── 03_functions/
│   │   ├── 01_function_basics.md                              # Declaration vs expression vs arrow : les trois ne sont pas interchangeables
│   │   ├── 02_hof_map_filter.md                               # map, filter, reduce : les outils qui remplacent 80% des boucles
│   │   ├── 03_function_factory.md                             # Fabriquer des fonctions depuis d'autres fonctions : le vrai pouvoir
│   │   └── function_grimoire.md
│   ├── 04_types/
│   │   ├── 01_primitives.md                                   # string, number, boolean, null, undefined, symbol, BigInt
│   │   ├── 02_type_coercion.md                                # Quand JS décide lui-même de changer tes types et casse tout
│   │   ├── 03_type_transformers.md                            # Convertir proprement sans passer par les raccourcis dangereux
│   │   └── 04_types_grimoire.md
│   ├── 05_web_basics/
│   │   ├── 01_dom_manipulation.md                             # Toucher le DOM sans tout ralentir ni tout casser
│   │   ├── 02_fetch_adventure.md                              # Appeler une API et comprendre ce qui revient vraiment
│   │   ├── 03_storage_treasure.md                             # localStorage, sessionStorage, cookies : lequel choisir et pourquoi
│   │   ├── 04_template_portals.md                             # template literals et HTML dynamique sans innerHTML à l'arrache
│   │   ├── 05_web_helpers.md                                  # debounce, throttle, deepClone : le kit de survie
│   │   ├── 06_module_factory.md                               # Organiser son code web en modules sans framework
│   │   └── 07_web_grimoire.md
│   ├── 06_modules/
│   │   ├── 01_import_export.md                                # named, default, namespace : les trois formes et quand les utiliser
│   │   ├── 02_module_patterns.md                              # Barrel exports, circular deps, lazy loading : les pièges du monde réel
│   │   └── 03_modules_grimoire.md                             # ESM vs CJS, bundlers, tree shaking
│   └── 07_regex/
│       ├── 01_regex_basics.md                                 # Lire et écrire un pattern sans avoir peur
│       ├── 02_regex_combat.md                                 # Validation d'emails, numéros, URLs : les vraies batailles
│       ├── 03_regex_extractor.md                              # Capturer, remplacer, splitter comme un sniper
│       └── 04_regex_grimoire.md
│
├── 02_async/                                                   # Le coeur invisible de JS : rien ne bloque, tout se séquence
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
│   │   ├── 02_async_rescue.md                                 # Sauver une opération async qui part en vrille
│   │   └── 03_async_grimoire.md
│   └── 04_event_loop/
│       ├── 01_microtask_madness.md                            # microtasks vs macrotasks : l'ordre d'exécution qui surprend toujours
│       ├── 02_macrotask_monsters.md                           # setTimeout, setInterval, requestAnimationFrame
│       └── 03_event_loop_grimoire.md                          # call stack, heap, queue, microtask : le moteur JS expliqué sans magie
│
├── 03_error_handling/                                          # Les erreurs arrivent : la question c'est si tu les vois avant l'utilisateur
│   ├── 01_try_catch_basics.md                                 # try/catch en profondeur : ce qu'il attrape et ce qu'il laisse passer
│   ├── 02_custom_errors.md                                    # Créer ses propres erreurs pour que les logs racontent une histoire
│   ├── 03_error_propagation.md                                # Qui catch quoi et à quel niveau : la discipline de propagation
│   ├── 04_async_error_traps.md                                # Les erreurs async qu'on oublie de catcher : et qui tombent en silence
│   ├── 05_error_strategy.md                                   # Fail-fast, fallback, retry : choisir la bonne stratégie selon le contexte
│   └── 06_error_grimoire.md                                   # Error, TypeError, RangeError, custom errors : le bestiaire complet
│
├── 04_testing/                                                 # On teste avant de coder : pas après, pas en option
│   ├── 01_why_testing_or_die.md                               # Pourquoi les tests ne sont pas optionnels quand le code va en prod
│   ├── 02_unit_sniper.md                                      # Tester une fonction précisément : comme un sniper, pas comme un fusil à pompe
│   ├── 03_jest_crash_course.md                                # Jest de zéro à opérationnel : sans lire la doc de 200 pages
│   ├── 04_mocking_madness.md                                  # Mocker un module, une API, une dépendance : sans tout casser
│   ├── 05_integration_reactor.md                              # Tester plusieurs modules ensemble : quand l'isolation ne suffit plus
│   ├── 06_tdd_arena.md                                        # TDD pur : le test en premier, le code après, toujours
│   ├── 07_test_driven_refactor.md                             # Refactorer sans régression grâce aux tests déjà en place
│   ├── 08_contract_testing_pact.md                            # Tester le contrat entre deux services avant qu'ils soient en prod ensemble
│   ├── 09_e2e_playwright_beast.md                             # Playwright : simuler un vrai utilisateur qui clique, tape, attend
│   └── 10_testing_grimoire.md                                 # unit, integration, E2E, mock, spy, stub : chaque terme à sa place
│
├── 05_math_basics/                                             # Les maths utiles au dev : pas les inutiles
│   ├── 01_boolean_logic.md                                    # AND, OR, NOT, XOR : la logique qui pilote chaque condition
│   ├── 02_modular_arithmetic.md                               # Le modulo et ses usages : cycles, cooldowns, distributions
│   ├── 03_bit_manipulation.md                                 # Bits, masques, flags : manipuler les données à l'os
│   ├── 04_hashing_basics.md                                   # Comment fonctionne un hash et pourquoi c'est partout en dev
│   ├── 05_probability_random.md                               # Math.random, distributions, probabilités : le RNG qui ne ment pas
│   ├── 06_combinatorics_lite.md                               # Permutations, combinaisons : les maths du bruteforce et des puzzles
│   ├── 07_geometry_for_dev.md                                 # Coordonnées, distances, vecteurs : les maths du jeu, de la data viz, des cartes
│   └── 08_math_grimoire.md
│
├── 06_memory_performance/                                      # Ce qui coûte cher en mémoire et en CPU : et comment l'éviter
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
│   │   └── 03_devtools_deep_dive.md                           # DevTools Performance tab : lire un flamegraph sans se perdre
│   ├── 05_core_web_vitals/
│   │   ├── 01_lcp_inp_cls_basics.md                           # LCP, INP, CLS : ce que chaque métrique mesure et ce qui les fait sauter
│   │   ├── 02_lighthouse_audit.md                             # Lire un rapport Lighthouse sans se noyer dans les chiffres
│   │   └── 03_perf_budget_enforcer.md                         # Poser un budget de performance et le faire respecter en CI
│   └── 06_memory_perf_grimoire.md
│
├── 07_data_structures/                                         # Les structures qui font que certains devs résolvent les problèmes 10x plus vite
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
│   │   ├── 01_union_find.md                                   # Union-Find : grouper des éléments connectés en O(α(n)) quasi constant
│   │   ├── 02_fenwick_tree.md                                  # Fenwick Tree : somme de préfixes en O(log n)
│   │   └── 03_suffix_array.md                                  # Suffix Array : chercher dans des strings comme un moteur de texte
│   └── 10_data_structures_grimoire.md
│
├── 08_algorithms/                                              # Les patterns qui résolvent 90% des problèmes : si tu les reconnais à temps
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
├── 09_functional_js/                                           # Coder sans effets de bord : et dormir tranquille la nuit
│   ├── 01_pure_functions.md                                   # Même input, même output, toujours : et pas de mutation cachée
│   ├── 02_immutability.md                                     # Ne jamais muter l'état : le créer, pas le changer
│   ├── 03_composition.md                                      # Composer des fonctions comme des Lego : chaque pièce fait une chose
│   ├── 04_currying.md                                         # Transformer une fonction multi-args en fonctions unaires enchaînées
│   ├── 05_partial_application.md                              # Fixer certains arguments maintenant, passer les autres plus tard
│   ├── 06_fp_challenge.md                                     # Construire un pipeline de transformation de données 100% fonctionnel
│   └── 07_fp_grimoire.md
│
├── 10_design_patterns/                                         # Les recettes de cuisine du code solide
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
├── 11_refactoring/                                             # Transformer du code qui fonctionne en code qui dure
│   ├── 01_clean_code_basics.md                                # Nommage, fonctions courtes, commentaires utiles : les règles qui changent tout
│   ├── 02_solid_principles.md                                  # SRP, OCP, LSP, ISP, DIP : les cinq principes qui structurent un codebase
│   ├── 03_code_smells.md                                      # God class, feature envy, long method : reconnaître ce qui pue avant que ça explose
│   ├── 04_refacto_in_action.md                                # Refactorer un module entier sans rien casser ni rien perdre
│   ├── 05_refacto_challenge.md                                # Une codebase en vrac : trouver les smells, refactorer, tester, livrer
│   └── 06_refacto_grimoire.md                                 # SOLID, smells, DRY, YAGNI, KISS : le vocabulaire du code propre
│
├── 12_problem_solving/                                         # Concevoir avant de coder : le cerveau que la syntaxe ne donne pas
│   ├── 01_decompose.md                                        # Couper un système complexe en pièces qui tiennent seules
│   ├── 02_model_before_code.md                                # Penser en structures et contrats avant d'ouvrir l'éditeur
│   ├── 03_choose_an_approach.md                               # Comparer deux solutions avant d'en écrire une seule ligne
│   ├── 04_read_fuzzy_requirements.md                          # Transformer "ça marche pas" en problème précis et attaquable
│   ├── 05_design_for_change.md                                # Concevoir pour ce qui va changer, pas pour ce qui est stable aujourd'hui
│   └── 06_problem_solving_grimoire.md                         # domaine, contrat, couplage, cohésion : le lexique du dev qui conçoit
│
├── 13_typescript/                                              # JS avec un casque et une armure : obligatoire en prod en 2026
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
├── 14_runtime_env/                                             # Savoir où ton code vit vraiment : Node, navigateur, workers
│   ├── 01_node_vs_browser.md                                  # Même JS, deux environnements différents : des APIs qui ne se partagent pas
│   ├── 02_streams_buffers.md                                   # Lire des données en flux sans charger tout en mémoire
│   ├── 03_commonjs_vs_esm.md                                   # require vs import : l'histoire, les différences, et ce qu'on utilise en 2026
│   ├── 04_process_env_argv.md                                  # process.env, process.argv : lire la config sans la hard-coder
│   ├── 05_worker_threads.md                                    # Paralléliser en Node sans bloquer l'event loop
│   ├── 06_node_cli_scripts/
│   │   ├── 01_cli_basics.md                                   # args, flags, stdin/stdout : les bases du CLI Node
│   │   ├── 02_filesystem_ops.md                               # fs, path, readline : lire, écrire, traverser sans s'arracher les cheveux
│   │   ├── 03_automation_scripts.md                           # Scripts qui automatisent : renommer, transformer, synchroniser
│   │   └── 04_cli_tool_builder.md                             # Construire un vrai outil CLI distribuable avec commander ou yargs
│   └── 07_runtime_grimoire.md
│
├── 15_architecture_patterns/                                   # Construire grand sans tout effondrer en ajoutant une feature
│   ├── 01_module_pattern.md                                   # Encapsuler, exposer ce qui doit l'être, cacher le reste
│   ├── 02_mvc_pattern.md                                      # Model, View, Controller : séparer les responsabilités avant de s'y noyer
│   ├── 03_clean_architecture.md                               # Domaine au centre, infra à l'extérieur : le code qui ne dépend pas de ses outils
│   ├── 04_event_driven.md                                     # Event-driven : réagir aux événements plutôt que les anticiper
│   ├── 05_microservices_intro.md                              # Découper en services : quand ça aide et quand ça complique
│   └── 06_architecture_grimoire.md
│
├── 16_web_concepts/                                            # Tout ce qu'un ingénieur web doit avoir en tête : pas juste dans les doigts
│   ├── 01_http_rest_basics.md                                 # HTTP, verbes, status codes, headers : lire une requête comme un professionnel
│   ├── 02_browser_render_pipeline.md                          # De l'HTML brut au pixel affiché : ce qui se passe entre les deux
│   ├── 03_state_and_dataflow.md                               # L'état d'une app web : qui le possède, qui le lit, qui le modifie
│   ├── 04_caching_strategies.md                               # Cache-Control, ETags, stale-while-revalidate : mettre en cache sans mettre en danger
│   ├── 05_auth_authz.md                                       # Authentification vs autorisation : deux problèmes différents, deux solutions différentes
│   ├── 06_serialization.md                                    # JSON, MessagePack, Protobuf : sérialiser sans perdre de données
│   ├── 07_seo_and_rendering.md                                # SSR, SSG, CSR, ISR : choisir le bon mode de rendu pour la bonne raison
│   └── 08_web_concepts_grimoire.md
│
├── 17_accessibility/                                           # Coder pour tout le monde : pas juste pour les utilisateurs qui te ressemblent
│   ├── 01_a11y_why_it_matters.md                              # L'accessibilité n'est pas une option : les chiffres, les lois, et les gens réels
│   ├── 02_aria_basics.md                                      # ARIA roles, states, properties : communiquer avec les lecteurs d'écran
│   ├── 03_keyboard_navigation.md                              # tab order, focus management, skip links : naviguer sans souris
│   ├── 04_contrast_and_colors.md                              # Ratio de contraste WCAG : les calculs, les outils, les décisions
│   ├── 05_screen_readers.md                                   # VoiceOver, NVDA, TalkBack : comment un lecteur d'écran interprète ton code
│   ├── 06_a11y_audit.md                                       # Auditer une page avec axe, Lighthouse, et les tests manuels
│   └── 07_a11y_grimoire.md
│
├── 18_i18n/                                                    # Parler toutes les langues sans tout réécrire
│   ├── 01_i18n_basics.md                                      # Clés de traduction, namespaces, fallbacks : l'architecture i18n de base
│   ├── 02_dates_timezones.md                                  # Les dates à travers les fuseaux horaires : le cauchemar et comment le résoudre
│   ├── 03_number_formats.md                                   # 1,234.56 vs 1.234,56 : les formats numériques selon les pays
│   ├── 04_pluralization.md                                    # "1 résultat" vs "2 résultats" vs "many" : la pluralisation qui varie par langue
│   ├── 05_i18n_in_project.md                                  # Intégrer l'i18n dans un projet réel : organisation, performance, DX
│   └── 06_i18n_grimoire.md
│
├── 19_realtime/                                                # Le web qui respire en direct : WebSockets, SSE, WebRTC
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
├── 20_api_craft/                                               # Construire ce que le monde consomme : et qui ne tombe pas en prod
│   ├── 01_express_from_scratch.md                             # Monter un serveur Express depuis zéro : pas de boilerplate, juste la logique
│   ├── 02_rest_crud_complete.md                               # CRUD complet sur une ressource : GET, POST, PUT, PATCH, DELETE
│   ├── 03_error_handling_api.md                               # Les erreurs d'API : status codes, formats d'erreur, middleware global
│   ├── 04_auth_jwt.md                                         # JWT de bout en bout : sign, verify, refresh : et ce qui peut foirer
│   ├── 05_graphql_basics.md                                   # Schema, resolvers, queries, mutations : GraphQL sans la magie
│   ├── 06_api_versioning.md                                   # Versionner une API sans tout casser pour les clients existants
│   ├── 07_openapi_swagger.md                                  # Documenter une API avec OpenAPI : le contrat que tout le monde peut lire
│   └── 08_api_grimoire.md
│
├── 21_security/                                                # Ne jamais être la faille que quelqu'un exploite
│   ├── 01_xss_injection.md                                    # XSS et injection SQL : les deux attaques qui touchent le plus d'apps en prod
│   ├── 02_csrf_cors.md                                        # CSRF et CORS : comprendre les deux avant de misconfigurer l'un ou l'autre
│   ├── 03_prototype_pollution.md                              # Polluer Object.prototype depuis un input utilisateur : pourquoi c'est catastrophique
│   ├── 04_auth_flows.md                                       # OAuth, sessions, JWT : les trois modèles d'auth et quand choisir lequel
│   ├── 05_hashing_bcrypt.md                                   # Hasher un mot de passe : bcrypt, salt, coût, ce qu'on ne stocke jamais en clair
│   ├── 06_owasp_checklist.md                                  # Les 10 vulnérabilités OWASP les plus fréquentes : et comment les éviter
│   └── 07_security_grimoire.md
│
├── 22_ai_native_dev/                                           # Utiliser l'IA sans perdre le contrôle : ni son jugement
│   ├── 01_ai_workflow.md                                      # Comment intégrer l'IA dans son workflow sans devenir dépendant
│   ├── 02_prompt_engineering.md                               # Prompter pour obtenir du code utile : pas du code plausible
│   ├── 03_validate_ai_output.md                               # Valider ce que l'IA génère : typage, parsing, tests automatiques
│   ├── 04_ai_refactor_partner.md                              # Utiliser l'IA comme partenaire de refactoring : pas comme remplaçant
│   ├── 05_ai_test_generator.md                                # Générer des tests avec l'IA : et vérifier qu'ils testent vraiment quelque chose
│   └── 06_ai_grimoire.md
│
├── 23_databases/                                               # Persister intelligemment dans le temps : et retrouver rapidement
│   ├── 01_sql_basics.md                                       # SELECT, JOIN, INDEX, EXPLAIN : lire et interroger une DB relationnelle
│   ├── 02_nosql_basics.md                                     # Document, clé-valeur, graphe : choisir la bonne DB pour le bon problème
│   ├── 03_data_modeling.md                                    # Modéliser des données : normalisation, dénormalisation, quand faire quoi
│   ├── 04_redis_caching.md                                    # Redis comme cache : TTL, invalidation, strategies
│   ├── 05_db_in_js.md                                         # Prisma, Drizzle, pg, mongoose : se connecter et requêter sans ORM hell
│   └── 06_databases_grimoire.md
│
├── 24_scalability/                                             # Tenir quand ça devient sérieux : 10 users vs 10 millions c'est pas le même code
│   ├── 01_load_balancing.md                                   # Distribuer le trafic : round-robin, least connections, sticky sessions
│   ├── 02_horizontal_vs_vertical.md                           # Scale up vs scale out : deux stratégies, deux contextes, deux coûts
│   ├── 03_rate_limiting.md                                    # Limiter les requêtes sans bloquer les utilisateurs légitimes
│   ├── 04_message_queues.md                                   # Découpler producteur et consommateur avec une queue de messages
│   └── 05_scalability_grimoire.md
│
├── 25_observability/                                           # Voir ce qui se passe en prod : avant que l'utilisateur le signale
│   ├── 01_structured_logging.md                               # Log en JSON avec correlation ID : les logs qu'on peut chercher et analyser
│   ├── 02_distributed_tracing.md                              # Suivre une requête à travers plusieurs services : sans perdre le fil
│   ├── 03_metrics_alerting.md                                  # Compteurs, gauges, histogrammes : les métriques qui annoncent les problèmes
│   ├── 04_sentry_in_prod.md                                   # Sentry : capturer, contextualiser, prioriser les erreurs en production
│   ├── 05_debug_in_prod.md                                    # Debugger sans reproduire localement : logs, snapshots, feature flags
│   └── 06_observability_grimoire.md
│
├── 26_team_craft/                                              # Coder avec des humains : pas juste avec une machine
│   ├── 01_code_review.md                                      # Reviewer sans écraser, commenter sans blesser, approuver sans se planquer
│   ├── 02_adr_writing.md                                      # ADR : documenter une décision technique avant de coder, pas après
│   ├── 03_technical_writing.md                                # Écrire pour des devs : README, docs, runbooks : clair et utilisable
│   ├── 04_navigate_codebase.md                                # Lire un codebase inconnu sans se perdre : les techniques des dev expérimentés
│   ├── 05_pair_programming.md                                 # Pair programming efficace : driver, navigator, quand switcher
│   └── 06_team_grimoire.md
│
├── 27_edge_cases/                                              # JS qui se rebelle : et comment y survivre
│   ├── 01_nan_undefined_null.md                               # NaN, undefined, null : trois façons différentes de dire "rien" : et leurs pièges
│   ├── 02_floating_point.md                                   # 0.1 + 0.2 !== 0.3 : l'arithmétique flottante et pourquoi elle surprend toujours
│   ├── 03_weird_coercions.md                                  # [] + {} = ?, {} + [] = ? : les coercions qui font rire et qui font mal
│   ├── 04_prototype_chain_dark.md                             # La chaîne prototype dans ses zones sombres : __proto__, hasOwnProperty, pollution
│   └── 05_edge_cases_grimoire.md
│
├── 28_oop_js/                                                  # prototype, classes, héritage : la face cachée de JS
│
├── 29_mini_projects/                                           # Assembler tout ça pour de vrai : pas des exercices, des systèmes
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
│   ├── 08_trapsoul_radio/
│   │   ├── cahierdescharges.md
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md
│   │   ├── POSTMORTEM.md
│   │   ├── ADR/
│   │   ├── src/
│   │   └── tests/
│   └── 09_oracle_glitch/
│       ├── cahierdescharges.md
│       ├── README.md
│       ├── TDD_JOURNAL.md
│       ├── POSTMORTEM.md
│       ├── ADR/
│       ├── src/
│       └── tests/
│
├── 30_annexes/                                                 # La toolchain et le TypeScript avancé : ce qui fait tourner le reste
│   ├── toolchain/
│   │   ├── 01_git_survival.md                                 # Git sans pleurer : branches, rebase, conflits, bisect
│   │   ├── 02_vscode_setup.md                                 # VSCode configuré pour un dev JS/TS sérieux : pas pour faire joli
│   │   ├── 03_package_managers.md                             # npm, yarn, pnpm : les différences qui comptent vraiment en 2026
│   │   ├── 04_bundlers.md                                     # Webpack, Vite, esbuild, Rollup : choisir sans subir
│   │   ├── 05_docker_basics.md                                # Containeriser une app Node : Dockerfile, compose, multi-stage builds
│   │   └── 06_cicd_basics.md                                  # GitHub Actions de zéro : tester, builder, déployer à chaque push
│   └── typescript_advanced/
│       ├── 01_declaration_files.md                            # .d.ts : écrire les types pour du JS sans types
│       ├── 02_ts_compiler_config.md                           # tsconfig.json : chaque option expliquée avec son impact réel
│       └── 03_ts_migration_guide.md                           # Migrer du JS pur vers TypeScript : sans tout réécrire en une nuit
│
└── 31_tools/                                                   # Les gadgets maison pour aller plus vite : réutilisables dans tous les modules
```

---

## Les projets

Les 9 mini-projets couvrent l'ensemble du curriculum. Chaque projet est un assemblage réel
de 3 à 4 modules : pas d'exercice théorique, pas de "implémente une fonction map". Des
systèmes qui ont une raison d'exister, des contraintes qui forcent de vraies décisions.

```
01_rasengan_engine       =>  01_fundamentals + 05_math + 09_functional_js + 10_design_patterns
02_garo_no_kronika       =>  02_async + 03_error_handling + 19_realtime + 15_architecture
03_walking_dead_protocol =>  04_testing + 11_refactoring + 14_runtime_env + 31_tools
04_breaking_cache        =>  07_data_structures + 08_algorithms + 06_memory_performance
05_prison_break_api      =>  20_api_craft + 21_security + 23_databases + 16_web_concepts
06_ultras_dashboard      =>  25_observability + 24_scalability + 13_typescript
07_ballon_dor_cli        =>  14_runtime_env + 11_refactoring + 03_error_handling + 30_annexes
08_trapsoul_radio        =>  13_typescript + 16_web_concepts + 17_accessibility + 18_i18n
09_oracle_glitch         =>  22_ai_native_dev + 28_oop_js + 26_team_craft + 27_edge_cases
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

**Modules couverts :** `02_async` · `03_error_handling` · `19_realtime` · `15_architecture_patterns`

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

**Modules couverts :** `04_testing` · `11_refactoring` · `14_runtime_env` · `31_tools`

Le groupe de Rick Grimes a besoin d'un système de gestion de camp : inventaire, rotations de garde, rations alimentaires, niveaux de sécurité. Le code existe déjà. Il a été écrit en pleine apocalypse zombie, la nuit, sous la pression. C'est du spaghetti. Personne ne sait ce qu'il fait. Zéro test.

Ton boulot : ne jamais ajouter de feature avant d'avoir des tests. Refactorer sans rien casser. Transformer ce camp en forteresse de code propre.

- Suite de tests complète sur un codebase existant : unit, intégration, E2E avec Playwright
- TDD pur pour chaque nouvelle feature : le test arrive avant le code, toujours
- Mocking et spies : simuler des attaques de zombies sans vrais zombies
- Refactoring SOLID complet : v1 spaghetti → v2 modulaire — SRP, OCP, DIP appliqués sur du code réel
- Code smells identifiés et corrigés un par un
- CLI Node.js pour automatiser les rapports de camp et les alertes de rations
- Worker Threads pour paralléliser les simulations de menace
- `31_tools` intégré au pipeline : logger structuré, benchmark, debug toolkit

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

**Modules couverts :** `20_api_craft` · `21_security` · `23_databases` · `16_web_concepts`

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

**Modules couverts :** `25_observability` · `24_scalability` · `13_typescript`

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

**Modules couverts :** `14_runtime_env` · `11_refactoring` · `03_error_handling` · `30_annexes`

Les journalistes du monde entier votent. Les points s'agrègent. Le classement se met à jour en direct. Commandes disponibles : `vote`, `rank`, `simulate`, `reset`, `export`. La v1 a été codée en une nuit par un stagiaire. Elle fonctionne. Mais elle est illisible. La v2, c'est toi qui l'écris. Et cette fois, elle est containerisée, testée, et déployée proprement.

- CLI Node.js complet : `process.argv`, parsing de flags, affichage formaté dans le terminal
- Filesystem : lecture/écriture JSON pour la persistance des votes entre sessions
- Worker Threads pour paralléliser les simulations de vote massif
- Custom errors : `InvalidVoteError`, `PlayerNotFoundError`, `QuotaExceededError`
- Propagation d'erreurs : qui gère quoi et à quel niveau du CLI
- Refactoring complet v1 → v2 : SOLID sur du code CLI procédural, code smells éliminés
- Toolchain via `30_annexes` : Git workflow propre, Docker pour containeriser, CI/CD sur chaque push
- Scripts d'automatisation : générer des votes de test, exporter le classement en CSV

---

### 08_trapsoul_radio/ : La radio underground qui ne dort jamais

**Modules couverts :** `13_typescript` · `16_web_concepts` · `17_accessibility` · `18_i18n`

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

**Modules couverts :** `22_ai_native_dev` · `28_oop_js` · `26_team_craft` · `27_edge_cases`

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
