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
├── README.md                                                   # La carte du territoire : lis ça avant de toucher quoi que ce soit
├── CONTRIBUTING.md                                             # Les règles du camp : pas de PR qui pue
│
├── 01_fundamentals/                                            # Le socle : sans ça, le reste s'effondre
│   ├── 00_Le_Guide_que_ton_prof_aurait_du_te_donner_le_jour_1.md   # Ce que personne ne t'a dit en cours : et qui change tout
│   ├── 01_variables/                                           # Les briques de base : var, let, const et leurs pièges
│   │   ├── 01_intro_variables.md                              # Ce qu'une variable est vraiment en mémoire
│   │   ├── 02_reference_chaos.md                              # Quand deux variables pointent vers le même enfer
│   │   ├── 02_reference_chaos_solution.js                     # La sortie du chaos, propre et documentée
│   │   ├── 03_mutation_madness.md                             # Muter un objet par accident et ne pas comprendre pourquoi ça fout tout en l'air
│   │   ├── 03_mutation_madness_solution.js                    # L'antidote : copier sans contaminer
│   │   ├── 04_const_trap.md                                   # const ne veut pas dire immuable : le piège classique
│   │   └── 05_variable_glossary.md                            # Le lexique de survie pour ne plus confondre scope et portée
│   ├── 02_scope/                                               # Où vit ta variable : et pourquoi elle disparaît parfois
│   │   ├── 01_scope_basics.md                                 # Portée locale, globale, et le bloc qu'on oublie toujours
│   │   ├── 01_scope_basics_solution.js                        # Les bonnes frontières, bien tracées
│   │   ├── 02_closure_trap.md                                 # La closure qui garde une variable en otage après la mort de la fonction
│   │   ├── 02_closure_trap_solution.js                        # Apprivoiser la closure plutôt que la subir
│   │   ├── 03_scope_escape_room.md                            # Escape room : trouve la variable, comprends le contexte, sors vivant
│   │   ├── 03_scope_escape_room_solution.js                   # Le chemin de sortie, commenté pas à pas
│   │   └── 04_scope_glossary.md                               # closure, hoisting, TDZ : chaque terme démystifié
│   ├── 03_functions/                                           # Les fonctions font tout : encore faut-il savoir les manier
│   │   ├── 01_function_basics.md                              # Declaration vs expression vs arrow : les trois ne sont pas interchangeables
│   │   ├── 01_function_basics_solution.js                     # Chaque forme à sa place, pour les bonnes raisons
│   │   ├── 02_hof_map_filter.md                               # map, filter, reduce : les outils qui remplacent 80% des boucles
│   │   ├── 02_hof_map_filter_solution.js                      # HOF en action sur des données réelles
│   │   ├── 03_function_factory.md                             # Fabriquer des fonctions depuis d'autres fonctions : le vrai pouvoir
│   │   ├── 03_function_factory_solution.js                    # La factory qui génère sans répéter
│   │   └── function_grimoire.md                               # Toutes les formes de fonctions, leurs forces et leurs pièges
│   ├── 04_types/                                               # JS a des types : il les cache juste bien
│   │   ├── 01_primitives.md                                   # string, number, boolean, null, undefined, symbol, BigInt — leur vrai comportement
│   │   ├── 01_primitives_solution.js                          # Les primitives en action, sans surprise
│   │   ├── 02_type_coercion.md                                # Quand JS décide lui-même de changer tes types et casse tout
│   │   ├── 02_type_coercion_solution.js                       # Forcer la coercition plutôt que la subir
│   │   ├── 03_type_transformers.md                            # Convertir proprement sans passer par les raccourcis dangereux
│   │   ├── 03_type_transformers_solution.js                   # Les transformations explicites, testées et fiables
│   │   └── 04_types_grimoire.md                               # typeof, instanceof, coercition : le guide de survie du typage JS
│   ├── 05_web_basics/                                          # Le DOM, le réseau, le stockage : le vrai terrain du dev web
│   │   ├── 01_dom_manipulation.md                             # Toucher le DOM sans tout ralentir ni tout casser
│   │   ├── 01_dom_manipulation_solution.js                    # Sélectionner, modifier, réagir : proprement
│   │   ├── 02_fetch_adventure.md                              # Appeler une API et comprendre ce qui revient vraiment
│   │   ├── 02_fetch_adventure_solution.js                     # fetch avec gestion d'erreurs et parsing correct
│   │   ├── 03_storage_treasure.md                             # localStorage, sessionStorage, cookies : lequel choisir et pourquoi
│   │   ├── 03_storage_treasure_solution.js                    # Stocker sans exposer, lire sans planter
│   │   ├── 04_template_portals.md                             # template literals et HTML dynamique sans innerHTML à l'arrache
│   │   ├── 04_template_portals_solution.js                    # Générer du DOM propre depuis des données
│   │   ├── 05_web_helpers.md                                  # Les utilitaires web qu'on réinvente trop souvent
│   │   ├── 05_web_helpers_solution.js                         # debounce, throttle, deepClone : le kit de survie
│   │   ├── 06_module_factory.md                               # Organiser son code web en modules sans framework
│   │   ├── 06_module_factory_solution.js                      # Le module pattern appliqué à une feature réelle
│   │   └── 07_web_grimoire.md                                 # DOM, fetch, storage, events : tout ce qui constitue le web côté navigateur
│   ├── 06_modules/                                             # import/export : le système qui donne une structure à tout le reste
│   │   ├── 01_import_export.md                                # named, default, namespace : les trois formes et quand les utiliser
│   │   ├── 01_import_export_solution.js                       # Un module propre, bien découpé, bien exposé
│   │   ├── 02_module_patterns.md                              # Barrel exports, circular deps, lazy loading : les pièges du monde réel
│   │   ├── 02_module_patterns_solution.js                     # Les patterns qui tiennent en prod
│   │   └── 03_modules_grimoire.md                             # ESM vs CJS, bundlers, tree shaking : comprendre ce qui se passe derrière
│   └── 07_regex/                                               # Les expressions régulières : illisibles jusqu'à ce que tu comprennes la logique
│       ├── 01_regex_basics.md                                 # Lire et écrire un pattern sans avoir peur
│       ├── 01_regex_basics_solution.js                        # Les patterns de base qui couvrent 70% des cas réels
│       ├── 02_regex_combat.md                                 # Validation d'emails, numéros, URLs : les vraies batailles
│       ├── 02_regex_combat_solution.js                        # Les regex qui tiennent face aux données du monde réel
│       ├── 03_regex_extractor.md                              # Capturer, remplacer, splitter comme un sniper
│       ├── 03_regex_extractor_solution.js                     # Groups, backreferences, lookahead : l'artillerie lourde
│       └── 04_regex_grimoire.md                               # Tous les symboles, tous les flags, tous les pièges — en un seul endroit
│
├── 02_async/                                                   # Le coeur invisible de JS : rien ne bloque, tout se séquence
│   ├── 01_callbacks/                                           # L'ancêtre de l'async : on part de là pour comprendre pourquoi on a changé
│   │   ├── 01_callback_maze.md                                # Le labyrinthe du callback hell : entrer est facile, sortir est une leçon
│   │   ├── 01_callback_maze_solution.js                       # La sortie du labyrinthe, organisée
│   │   ├── 02_callback_challenge.md                           # Orchestrer plusieurs callbacks sans perdre le fil
│   │   ├── 02_callback_challenge_solution.js                  # Coordination async sans Promise : pour comprendre la douleur
│   │   └── 03_callbacks_grimoire.md                           # callback, error-first, inversion of control : les termes qui expliquent tout
│   ├── 02_promises/                                            # La promesse que JS tient (ou pas) : et comment la gérer
│   │   ├── 01_promise_race.md                                 # Promise.race, allSettled, any : quand plusieurs opérations s'affrontent
│   │   ├── 01_promise_race_solution.js                        # Choisir le bon combinator selon la situation
│   │   ├── 02_promise_chain_reactor.md                        # Chaîner des opérations async sans perdre les erreurs en route
│   │   ├── 02_promise_chain_reactor_solution.js               # La chaîne solide, avec gestion d'erreur à chaque maillon
│   │   └── 03_promises_grimoire.md                            # resolve, reject, then, catch, finally : anatomie complète d'une Promise
│   ├── 03_async_await/                                         # La syntaxe qui rend l'async lisible : sans cacher ses pièges
│   │   ├── 01_async_jungle.md                                 # async/await dans tous les sens : loops, parallel, sequential : les différences comptent
│   │   ├── 01_async_jungle_solution.js                        # Chaque pattern async, utilisé au bon endroit
│   │   ├── 02_async_rescue.md                                 # Sauver une opération async qui part en vrille —> without crashing everything
│   │   ├── 02_async_rescue_solution.js                        # Le rescue pattern propre, testé, robuste
│   │   └── 03_async_grimoire.md                               # async, await, try/catch async, top-level await : le guide complet
│   └── 04_event_loop/                                          # Comprendre l'event loop c'est comprendre pourquoi JS fait ce qu'il fait
│       ├── 01_microtask_madness.md                            # microtasks vs macrotasks : l'ordre d'exécution qui surprend toujours
│       ├── 01_microtask_madness_solution.js                   # Prédire l'ordre avant d'exécuter —> le vrai test de compréhension
│       ├── 02_macrotask_monsters.md                           # setTimeout, setInterval, requestAnimationFrame : les monstres de la task queue
│       ├── 02_macrotask_monsters_solution.js                  # Dompter les macrotasks sans bloquer le rendu
│       └── 03_event_loop_grimoire.md                          # call stack, heap, queue, microtask : le moteur JS expliqué sans magie
│
├── 03_testing_first/                                           # On teste avant de coder —> pas après, pas en option
│   ├── 01_why_testing_or_die.md                               # Pourquoi les tests ne sont pas optionnels quand le code va en prod
│   ├── 01_why_testing_or_die_solution.js                      # Un premier test qui prouve que tester c'est pas compliqué
│   ├── 02_unit_sniper.md                                       # Tester une fonction précisément —> comme un sniper, pas comme un fusil à pompe
│   ├── 02_unit_sniper_solution.js                             # Le test unitaire propre, isolé, fiable
│   ├── 03_jest_crash_course.md                                # Jest de zéro à opérationnel —> sans lire la doc de 200 pages
│   ├── 03_jest_crash_course_solution.js                       # La configuration minimale qui marche vraiment
│   ├── 04_mocking_madness.md                                  # Mocker un module, une API, une dépendance —> sans tout casser
│   ├── 04_mocking_madness_solution.js                         # Les mocks propres qui n'infectent pas les autres tests
│   ├── 05_integration_reactor.md                              # Tester plusieurs modules ensemble —> quand l'isolation ne suffit plus
│   ├── 05_integration_reactor_solution.js                     # L'integration test qui attrape ce que le unit test rate
│   ├── 06_tdd_arena.md                                        # TDD pur : le test en premier, le code après, toujours
│   ├── 06_tdd_arena_solution.js                               # Le cycle red-green-refactor appliqué pour de vrai
│   ├── 07_test_driven_refactor.md                             # Refactorer sans régression grâce aux tests déjà en place
│   ├── 07_test_driven_refactor_solution.js                    # Le filet de sécurité qui permet de tout changer sans tout casser
│   ├── 08_contract_testing_pact.md                            # Tester le contrat entre deux services avant qu'ils soient en prod ensemble
│   ├── 08_contract_testing_pact_solution.js                   # Consumer-driven contracts : la paix entre les équipes
│   ├── 09_e2e_playwright_beast.md                             # Playwright : simuler un vrai utilisateur qui clique, tape, attend
│   ├── 09_e2e_playwright_beast_solution.js                    # Le test E2E qui attrape ce que personne d'autre ne voit
│   └── 10_testing_grimoire.md                                 # unit, integration, E2E, mock, spy, stub : chaque terme à sa place
│
├── 04_error_handling/                                          # Les erreurs arrivent : la question c'est si tu les vois avant l'utilisateur
│   ├── 01_try_catch_basics.md                                 # try/catch en profondeur : ce qu'il attrape et ce qu'il laisse passer
│   ├── 01_try_catch_basics_solution.js                        # Les cas classiques gérés proprement
│   ├── 02_custom_errors.md                                    # Créer ses propres erreurs pour que les logs racontent une histoire
│   ├── 02_custom_errors_solution.js                           # ValidationError, NotFoundError, AuthError : les classes qui disent tout
│   ├── 03_error_propagation.md                                # Qui catch quoi et à quel niveau : la discipline de propagation
│   ├── 03_error_propagation_solution.js                       # La pyramide d'erreurs qui remonte sans se perdre
│   ├── 04_async_error_traps.md                                # Les erreurs async qu'on oublie de catcher : et qui tombent en silence
│   ├── 04_async_error_traps_solution.js                       # Catcher même les erreurs dans les Promises non attendues
│   ├── 05_error_strategy.md                                   # Fail-fast, fallback, retry : choisir la bonne stratégie selon le contexte
│   ├── 05_error_strategy_solution.js                          # Les trois stratégies implémentées sur des cas réels
│   └── 06_error_grimoire.md                                   # Error, TypeError, RangeError, custom errors : le bestiaire complet
│
├── 05_math_basics/                                             # Les maths utiles au dev —> pas les inutiles
│   ├── 01_boolean_logic.md                                    # AND, OR, NOT, XOR : la logique qui pilote chaque condition
│   ├── 01_boolean_logic_solution.js                           # Les opérateurs logiques dans des cas qui ressemblent au vrai monde
│   ├── 02_modular_arithmetic.md                               # Le modulo et ses usages : cycles, cooldowns, distributions
│   ├── 02_modular_arithmetic_solution.js                      # L'arithmétique modulaire en action dans un système de jeu
│   ├── 03_bit_manipulation.md                                 # Bits, masques, flags : manipuler les données à l'os
│   ├── 03_bit_manipulation_solution.js                        # Permissions codées en bits, flags testés avec XOR
│   ├── 04_hashing_basics.md                                   # Comment fonctionne un hash et pourquoi c'est partout en dev
│   ├── 04_hashing_basics_solution.js                          # Implémenter un hash simple et comprendre ses limites
│   ├── 05_probability_random.md                               # Math.random, distributions, probabilités : le RNG qui ne ment pas
│   ├── 05_probability_random_solution.js                      # Générateur de critique, esquive, drop rate —> comme dans un vrai jeu
│   ├── 06_combinatorics_lite.md                               # Permutations, combinaisons : les maths du bruteforce et des puzzles
│   ├── 06_combinatorics_lite_solution.js                      # Énumérer des combinaisons sans exploser la mémoire
│   ├── 07_geometry_for_dev.md                                 # Coordonnées, distances, vecteurs : les maths du jeu, de la data viz, des cartes
│   ├── 07_geometry_for_dev_solution.js                        # Calculer une heatmap, détecter une collision, tracer un chemin
│   └── 08_math_grimoire.md                                    # modulo, bitwise, hash, vecteur : les maths qu'un dev croise vraiment
│
├── 06_memory_performance/                                      # Ce qui coûte cher en mémoire et en CPU —> et comment l'éviter
│   ├── 01_gc/                                                  # Le garbage collector : comment JS libère la mémoire (et quand il échoue)
│   │   ├── 01_gc_basics.md                                    # mark-and-sweep, références, cycles : comprendre sans peur
│   │   ├── 01_gc_basics_solution.js                           # Créer une fuite mémoire intentionnelle, puis la corriger
│   │   ├── 02_gc_simulator.md                                 # Simuler le comportement du GC sur des objets qui vivent et meurent
│   │   └── 02_gc_simulator_solution.js                        # Le simulateur qui rend visible ce que le runtime cache
│   ├── 02_copy_vs_ref/                                         # Copier par valeur vs copier par référence —> la confusion qui fout tout en l'air
│   │   ├── 01_shallow_vs_deep.md                              # shallow copy : ça copie la surface mais pas le fond
│   │   ├── 01_shallow_vs_deep_solution.js                     # structuredClone vs spread vs JSON —> lequel choisir et pourquoi
│   │   ├── 02_mutation_minefield.md                           # Le champ de mines : toucher un objet et tout casser ailleurs
│   │   └── 02_mutation_minefield_solution.js                  # Traverser le champ sans explosion : les patterns de copie sûre
│   ├── 03_complexity/                                          # Big O : comprendre le coût avant de mesurer
│   │   ├── 01_big_o_basics.md                                 # O(1), O(n), O(n²) : ce que ça veut dire sur du vrai code
│   │   ├── 01_big_o_basics_solution.js                        # Analyser la complexité d'une fonction réelle, pas d'un algo textbook
│   │   ├── 02_complexity_analysis.md                          # Analyser un algorithme ligne par ligne —> sans formule magique
│   │   ├── 02_complexity_analysis_solution.js                 # L'analyse appliquée sur du code qu'on croiserait en prod
│   │   ├── 03_runtime_race.md                                 # O(n log n) vs O(n²) : voir la différence à l'écran sur 100k éléments
│   │   └── 03_runtime_race_solution.js                        # La course où les courbes de complexité s'affrontent pour de vrai
│   ├── 04_profiling/                                           # Mesurer avant d'optimiser —> sinon tu optimises au mauvais endroit
│   │   ├── 01_profiling_basics.md                             # performance.now(), console.time() : les outils qui mesurent sans mentir
│   │   ├── 01_profiling_basics_solution.js                    # Benchmark réel sur deux implémentations du même algo
│   │   ├── 02_memory_leak_hunter.md                           # Traquer une fuite mémoire dans DevTools —> la chasse au fantôme
│   │   ├── 02_memory_leak_hunter_solution.js                  # Identifier la source, corriger, vérifier que ça ne revient pas
│   │   ├── 03_devtools_deep_dive.md                           # DevTools Performance tab : lire un flamegraph sans se perdre
│   │   └── 03_devtools_deep_dive_solution.js                  # Le code lent, profilé, puis optimisé —> avec avant/après
│   ├── 05_core_web_vitals/                                     # LCP, INP, CLS : les métriques que Google mesure sur ton site
│   │   ├── 01_lcp_inp_cls_basics.md                           # Ce que chaque métrique mesure et ce qui les fait sauter
│   │   ├── 01_lcp_inp_cls_basics_solution.js                  # Mesurer les Core Web Vitals sur une page réelle
│   │   ├── 02_lighthouse_audit.md                             # Lire un rapport Lighthouse sans se noyer dans les chiffres
│   │   ├── 02_lighthouse_audit_solution.js                    # Corriger les 3 problèmes les plus courants qui plombent le score
│   │   ├── 03_perf_budget_enforcer.md                         # Poser un budget de performance et le faire respecter en CI
│   │   └── 03_perf_budget_enforcer_solution.js                # Le script qui bloque le build si les vitals passent en rouge
│   └── 06_memory_perf_grimoire.md                             # GC, Big O, flamegraph, CWV : les concepts qui définissent un dev performant
│
├── 07_data_structures/                                         # Les structures qui font que certains devs résolvent les problèmes 10x plus vite
│   ├── 01_array/                                               # Le tableau : l'outil de base —> mais ses méthodes cachent de vraies décisions
│   │   ├── 01_array_basics.md                                 # Indexing, slicing, spreading : ce que chaque opération coûte vraiment
│   │   ├── 01_array_basics_solution.js                        # Les opérations array sur des données réelles, avec leur coût en tête
│   │   ├── 02_array_methods_battle.md                         # map vs forEach vs for...of vs reduce : le match qui détermine le vrai niveau
│   │   └── 02_array_methods_battle_solution.js                # Choisir la bonne méthode selon le contexte —> pas la plus connue
│   ├── 02_linked_list/                                         # La liste chaînée : pointer vers le suivant, pas vers l'index
│   │   ├── 01_linked_list_basics.md                           # Node, next, head, tail : construire la structure depuis zéro
│   │   ├── 01_linked_list_basics_solution.js                  # La linked list fonctionnelle, avec insert et delete
│   │   ├── 02_linked_list_arena.md                            # Inverser une liste, détecter un cycle, trouver le milieu
│   │   └── 02_linked_list_arena_solution.js                   # Les algos classiques sur linked list —> ceux qu'on retrouve en entretien
│   ├── 03_stack/                                               # LIFO : le dernier entré est le premier sorti —> et ça résout des tonnes de problèmes
│   │   ├── 01_stack_basics.md                                 # push, pop, peek : la stack implémentée et comprise
│   │   ├── 01_stack_basics_solution.js                        # La stack propre, avec tous ses cas limites
│   │   ├── 02_stack_missions.md                               # Parenthèses balancées, historique de navigation, undo/redo
│   │   └── 02_stack_missions_solution.js                      # Trois usages réels de la stack, trois missions résolues
│   ├── 04_queue/                                               # FIFO : le premier arrivé est le premier servi —> comme dans la vraie vie
│   │   ├── 01_queue_basics.md                                 # enqueue, dequeue, peek : la queue construite et comprise
│   │   ├── 01_queue_basics_solution.js                        # La queue solide avec ring buffer optionnel
│   │   ├── 02_queue_challenges.md                             # Simuler une file d'attente, un système de tickets, un BFS
│   │   └── 02_queue_challenges_solution.js                    # La queue dans des cas qui justifient son existence
│   ├── 05_heap/                                               # Le tas : toujours accéder au min ou au max en O(log n)
│   │   ├── 01_heap_basics.md                                  # Min-heap, max-heap : la structure qui garde l'ordre sans tout trier
│   │   ├── 01_heap_basics_solution.js                         # Le heap construit depuis zéro, avec heapify
│   │   ├── 02_heap_priority_queue.md                          # Priority queue : les tâches les plus urgentes passent devant
│   │   └── 02_heap_priority_queue_solution.js                 # Un scheduler de tâches basé sur un min-heap réel
│   ├── 06_bst/                                                 # Arbre binaire de recherche : chercher en O(log n) quand l'arbre est équilibré
│   │   ├── 01_bst_basics.md                                   # insert, search, delete : les trois opérations qui définissent un BST
│   │   ├── 01_bst_basics_solution.js                          # Le BST fonctionnel avec ses trois opérations
│   │   ├── 02_bst_traversal.md                                # inorder, preorder, postorder : lire un arbre dans le bon sens
│   │   └── 02_bst_traversal_solution.js                       # Les trois traversals, plus BFS sur le BST
│   ├── 07_hash_table/                                          # La table de hachage : O(1) pour chercher, si le hash est bon
│   │   ├── 01_hash_table_basics.md                            # hash function, collision, chaining : comment ça marche sous le capot
│   │   ├── 01_hash_table_basics_solution.js                   # La hash table maison, avec gestion des collisions
│   │   ├── 02_hash_table_arena.md                             # Two sum, anagrammes, comptage de fréquences : les classiques
│   │   └── 02_hash_table_arena_solution.js                    # Les algos hash table qui reviennent dans tous les entretiens
│   ├── 08_graphs/                                              # Graphes : modéliser des réseaux, des dépendances, des chemins
│   │   ├── 01_graph_basics.md                                 # Noeud, arête, directed, weighted : construire un graphe en JS
│   │   ├── 01_graph_basics_solution.js                        # Le graphe en adjacency list et adjacency matrix
│   │   ├── 02_graph_bfs_dfs.md                                # BFS vs DFS : deux façons de traverser, deux cas d'usage différents
│   │   ├── 02_graph_bfs_dfs_solution.js                       # BFS pour le plus court chemin, DFS pour l'exploration complète
│   │   ├── 03_graph_challenges.md                             # Détecter un cycle, trouver les composants connexes, topological sort
│   │   └── 03_graph_challenges_solution.js                    # Les problèmes graphe qu'on retrouve en prod et en entretien
│   ├── 09_advanced_bonus/                                      # Pour les curieux qui veulent aller plus loin que le standard
│   │   ├── 01_union_find.md                                   # Union-Find : grouper des éléments connectés en O(α(n)) quasi constant
│   │   ├── 01_union_find_solution.js                          # Union-Find avec path compression et union by rank
│   │   ├── 02_fenwick_tree.md                                  # Fenwick Tree : somme de préfixes en O(log n) sans tableau auxiliaire
│   │   ├── 02_fenwick_tree_solution.js                         # Le Fenwick Tree implémenté et testé sur des range queries
│   │   ├── 03_suffix_array.md                                  # Suffix Array : chercher dans des strings comme un moteur de texte
│   │   └── 03_suffix_array_solution.js                         # Construction et search sur un suffix array réel
│   └── 10_data_structures_grimoire.md                         # array, linked list, stack, queue, heap, BST, hash, graph : le dictionnaire complet
│
├── 08_algorithms/                                              # Les patterns qui résolvent 90% des problèmes : si tu les reconnais à temps
│   ├── 01_sorting/                                             # Trier : comparer les algorithmes, pas juste les utiliser
│   │   ├── 01_bubble_insertion.md                             # O(n²) : comprendre les algos lents pour apprécier les rapides
│   │   ├── 01_bubble_insertion_solution.js                    # Bubble et insertion sort, animés et comparés
│   │   ├── 02_merge_sort.md                                    # Divide and conquer : couper pour mieux fusionner en O(n log n)
│   │   ├── 02_merge_sort_solution.js                          # Merge sort stable, implémenté proprement
│   │   ├── 03_quick_sort.md                                    # Quick sort : le plus rapide en pratique, le moins stable en théorie
│   │   ├── 03_quick_sort_solution.js                          # Quick sort avec pivot aléatoire pour éviter le pire cas
│   │   ├── 04_sorting_race.md                                  # Bubble vs Merge vs Quick sur 10k, 100k, 1M éléments : qui gagne et pourquoi
│   │   └── 04_sorting_race_solution.js                        # Le benchmark comparatif, avec mesures réelles
│   ├── 02_searching/                                           # Chercher : linéaire vs binaire : et quand chaque approche est la bonne
│   │   ├── 01_linear_binary.md                                # O(n) vs O(log n) : la différence qui compte sur des millions d'éléments
│   │   ├── 01_linear_binary_solution.js                       # Les deux implémentations, benchmarkées sur de vraies données
│   │   ├── 02_search_challenges.md                            # Rotated array, matrix search, search in stream : les variantes qui piègent
│   │   └── 02_search_challenges_solution.js                   # Les variants de binary search qui reviennent en entretien
│   ├── 03_dynamic_programming/                                 # DP : ne calculer qu'une fois ce qu'on a déjà calculé
│   │   ├── 01_dp_basics.md                                    # Mémoization vs tabulation : deux façons d'attaquer le même problème
│   │   ├── 01_dp_basics_solution.js                           # Fibonacci, climbing stairs : les introductions qui éclairent tout
│   │   ├── 02_dp_classics.md                                  # Knapsack, longest common subsequence, coin change : les classiques incontournables
│   │   ├── 02_dp_classics_solution.js                         # Les classiques DP résolus, expliqués, visualisés
│   │   ├── 03_dp_matrix.md                                    # DP sur une grille 2D : chemins, obstacles, coûts minimaux
│   │   └── 03_dp_matrix_solution.js                           # Minimum path sum, unique paths : grilles et transitions
│   ├── 04_greedy/                                              # Greedy : prendre le meilleur choix local et espérer que ça marche globalement
│   │   ├── 01_greedy_basics.md                                # Quand greedy est optimal, quand il échoue : la frontière à connaître
│   │   ├── 01_greedy_basics_solution.js                       # Activity selection, fractional knapsack : les cas où greedy gagne
│   │   ├── 02_greedy_missions.md                              # Planifier des missions avec des contraintes de temps et de priorité
│   │   └── 02_greedy_missions_solution.js                     # Le scheduler greedy qui maximise ce qui peut l'être
│   ├── 05_backtracking/                                        # Backtracking : explorer toutes les options et reculer quand ça bloque
│   │   ├── 01_backtracking_basics.md                          # Arbre de décision, pruning, état : les trois concepts qui font tout
│   │   ├── 01_backtracking_basics_solution.js                 # N-Queens, subsets, permutations : l'exploration contrôlée
│   │   ├── 02_backtracking_arena.md                           # Sudoku solver, word search, combination sum : les arènes réelles
│   │   └── 02_backtracking_arena_solution.js                  # Le backtracking qui trouve, coupe, revient : et trouve quand même
│   ├── 06_graph_algorithms/                                    # Dijkstra, A*, Topo Sort : les algos qui gèrent les graphes réels
│   │   ├── 01_dijkstra.md                                     # Le chemin le plus court dans un graphe pondéré : l'algo qui alimente tous les GPS
│   │   ├── 01_dijkstra_solution.js                            # Dijkstra avec priority queue, sur un graphe réaliste
│   │   ├── 02_astar.md                                        # A* : Dijkstra avec une heuristique : plus rapide, plus intelligent
│   │   ├── 02_astar_solution.js                               # A* sur une grille, avec Manhattan distance comme heuristique
│   │   ├── 03_topological_sort.md                             # Trier des tâches dépendantes : sans jamais faire B avant A
│   │   └── 03_topological_sort_solution.js                    # Kahn's algorithm et DFS-based topo sort sur des dépendances réelles
│   └── 07_algorithms_grimoire.md                              # sorting, DP, greedy, backtracking, graphes : les patterns et leur terrain d'application
│
├── 09_functional_js/                                           # Coder sans effets de bord —> et dormir tranquille la nuit
│   ├── 01_pure_functions.md                                   # Même input, même output, toujours —> et pas de mutation cachée
│   ├── 01_pure_functions_solution.js                          # Refactorer des fonctions impures en fonctions pures
│   ├── 02_immutability.md                                     # Ne jamais muter l'état —> le créer, pas le changer
│   ├── 02_immutability_solution.js                            # Object.freeze, spread, immer : les outils de l'immutabilité
│   ├── 03_composition.md                                      # Composer des fonctions comme des Lego —> chaque pièce fait une chose
│   ├── 03_composition_solution.js                             # pipe et compose implémentés, utilisés sur un vrai pipeline de données
│   ├── 04_currying.md                                         # Transformer une fonction multi-args en fonctions unaires enchaînées
│   ├── 04_currying_solution.js                                # curry() maison + usages réels sur des fonctions de config
│   ├── 05_partial_application.md                              # Fixer certains arguments maintenant, passer les autres plus tard
│   ├── 05_partial_application_solution.js                     # partial() implémenté et utilisé dans un contexte d'API calls
│   ├── 06_fp_challenge.md                                     # Construire un pipeline de transformation de données 100% fonctionnel
│   ├── 06_fp_challenge_solution.js                            # Le pipeline qui prouve que FP n'est pas juste théorique
│   └── 07_fp_grimoire.md                                      # pure, immutabilité, composition, curry, monade : le lexique FP sans les mathématiques inutiles
│
├── 10_design_patterns/                                         # Les recettes de cuisine du code solide —> inventées par ceux qui ont eu les problèmes avant toi
│   ├── 01_creational/                                          # Patterns de création : contrôler comment les objets naissent
│   │   ├── 01_factory_pattern.md                              # Factory : créer sans exposer la logique de construction
│   │   ├── 01_factory_pattern_solution.js                     # La factory appliquée à un système de ninjas et leurs configurations
│   │   ├── 02_singleton_pattern.md                            # Singleton : une seule instance, point final —> et ses dangers
│   │   ├── 02_singleton_pattern_solution.js                   # Le singleton propre, avec ses use cases légitimes
│   │   ├── 03_builder_pattern.md                              # Builder : construire des objets complexes étape par étape
│   │   └── 03_builder_pattern_solution.js                     # Le builder fluent qui assemble sans s'embrouiller
│   ├── 02_structural/                                          # Patterns structurels : organiser les relations entre objets
│   │   ├── 01_decorator_pattern.md                            # Decorator : ajouter du comportement sans modifier la source
│   │   ├── 01_decorator_pattern_solution.js                   # Le decorator en action sur un logger et un validateur
│   │   ├── 02_adapter_pattern.md                              # Adapter : brancher deux interfaces incompatibles l'une sur l'autre
│   │   ├── 02_adapter_pattern_solution.js                     # L'adaptateur qui rend compatible ce qui ne l'était pas
│   │   ├── 03_proxy_pattern.md                                # Proxy : intercepter les accès à un objet et y ajouter de la logique
│   │   └── 03_proxy_pattern_solution.js                       # Le proxy JS natif utilisé pour du lazy loading et de la validation
│   ├── 03_behavioral/                                          # Patterns comportementaux : organiser comment les objets communiquent
│   │   ├── 01_observer_pattern.md                             # Observer : un événement se passe, tous les abonnés réagissent
│   │   ├── 01_observer_pattern_solution.js                    # L'EventEmitter maison, propre et typé
│   │   ├── 02_strategy_pattern.md                             # Strategy : changer d'algorithme à la volée selon le contexte
│   │   ├── 02_strategy_pattern_solution.js                    # Les strategies de tri, de paiement, de compression —> interchangeables
│   │   ├── 03_command_pattern.md                              # Command : encapsuler une action pour pouvoir l'annuler et la rejouer
│   │   └── 03_command_pattern_solution.js                     # Undo/redo implémenté avec le command pattern
│   └── 04_patterns_grimoire.md                                # factory, singleton, decorator, observer, strategy : chaque pattern et son terrain d'élection
│
├── 11_refactoring/                                             # Transformer du code qui fonctionne en code qui dure
│   ├── 01_clean_code_basics.md                                # Nommage, fonctions courtes, commentaires utiles : les règles qui changent tout
│   ├── 01_clean_code_basics_solution.js                       # Avant/après sur du code réel : la différence parle d'elle-même
│   ├── 02_solid_principles.md                                  # SRP, OCP, LSP, ISP, DIP : les cinq principes qui structurent un codebase
│   ├── 02_solid_principles_solution.js                        # SOLID appliqué sur du code qui ne l'était pas : avec les étapes
│   ├── 03_code_smells.md                                      # God class, feature envy, long method : reconnaître ce qui pue avant que ça explose
│   ├── 03_code_smells_solution.js                             # Identifier et corriger les smells un par un sur du vrai code
│   ├── 04_refacto_in_action.md                                # Refactorer un module entier sans rien casser ni rien perdre
│   ├── 04_refacto_in_action_solution.js                       # Le module avant et après : chaque décision documentée
│   ├── 05_refacto_challenge.md                                # Une codebase en vrac : trouver les smells, refactorer, tester, livrer
│   ├── 05_refacto_challenge_solution.js                       # Le challenge résolu : clean, testé, documenté
│   └── 06_refacto_grimoire.md                                 # SOLID, smells, DRY, YAGNI, KISS : le vocabulaire du code propre
│
├── 12_typescript/                                              # JS avec un casque et une armure : obligatoire en prod en 2026
│   ├── 01_ts_basics/                                           # Les fondations : types, interfaces, classes : comprendre avant d'annoter
│   │   ├── 01_types_and_interfaces.md                         # type vs interface : pas la même chose, pas interchangeables
│   │   ├── 01_types_and_interfaces_solution.ts                # Les deux en action, chacun là où il a sa place
│   │   ├── 02_functions_typed.md                              # Typer les fonctions : params, retour, overloads, callbacks
│   │   ├── 02_functions_typed_solution.ts                     # Les fonctions typées qui éliminent les bugs avant l'exécution
│   │   ├── 03_classes_typed.md                                # Classes TS : public, private, protected, readonly, abstract
│   │   └── 03_classes_typed_solution.ts                       # La classe typée de A à Z, avec ses contrats respectés
│   ├── 02_ts_intermediate/                                     # Les outils qui rendent TS vraiment puissant
│   │   ├── 01_generics.md                                     # Generics : écrire une fois, utiliser pour n'importe quel type
│   │   ├── 01_generics_solution.ts                            # Les generics appliqués sur un pipeline de données réel
│   │   ├── 02_utility_types.md                                # Partial, Required, Pick, Omit, Record : les outils qui transforment les types
│   │   ├── 02_utility_types_solution.ts                       # Chaque utility type utilisé sur un cas concret, pas sur un exemple jouet
│   │   ├── 03_union_intersection.md                           # Union et intersection : composer des types comme des sets mathématiques
│   │   ├── 03_union_intersection_solution.ts                  # Les types composés dans un système de rôles et de permissions
│   │   ├── 04_type_guards.md                                  # Rétrécir un type à runtime : typeof, instanceof, discriminated unions
│   │   └── 04_type_guards_solution.ts                         # Les type guards qui évitent les crashes à runtime
│   ├── 03_ts_advanced/                                         # Le niveau qui sépare les utilisateurs de TS de ceux qui le maîtrisent
│   │   ├── 01_conditional_types.md                            # T extends U ? X : Y : les types qui dépendent d'autres types
│   │   ├── 01_conditional_types_solution.ts                   # Les conditional types sur un système de validation générique
│   │   ├── 02_mapped_types.md                                  # Transformer chaque propriété d'un type —> sans les réécrire une par une
│   │   ├── 02_mapped_types_solution.ts                        # Les mapped types qui génèrent des types depuis d'autres types
│   │   ├── 03_ts_in_real_project.md                           # TS dans un vrai projet : config, migration, boundaries, décisions
│   │   └── 03_ts_in_real_project_solution.ts                  # La mise en place TS sur un projet existant —> sans tout casser
│   └── 04_typescript_grimoire.md                              # type, interface, generic, utility type, mapped type : le grimoire TS complet
│
├── 13_runtime_env/                                             # Savoir où ton code vit vraiment —> Node, navigateur, workers
│   ├── 01_node_vs_browser.md                                  # Même JS, deux environnements différents —> et des APIs qui ne se partagent pas
│   ├── 01_node_vs_browser_solution.js                         # Le code qui s'adapte à son environnement sans if partout
│   ├── 02_streams_buffers.md                                   # Lire des données en flux sans charger tout en mémoire
│   ├── 02_streams_buffers_solution.js                         # Un pipeline de streams qui traite un gros fichier sans exploser le RAM
│   ├── 03_commonjs_vs_esm.md                                   # require vs import : l'histoire, les différences, et ce qu'on utilise en 2026
│   ├── 03_commonjs_vs_esm_solution.js                         # Les deux systèmes côte à côte —> interopérabilité et pièges
│   ├── 04_process_env_argv.md                                  # process.env, process.argv : lire la config sans la hard-coder
│   ├── 04_process_env_argv_solution.js                        # Le module de config propre qui lit l'environnement correctement
│   ├── 05_worker_threads.md                                    # Paralléliser en Node sans bloquer l'event loop
│   ├── 05_worker_threads_solution.js                          # Un calcul CPU-intensif déplacé dans un worker thread
│   ├── 06_node_cli_scripts/                                    # Construire des outils en ligne de commande
│   │   ├── 01_cli_basics.md                                   # args, flags, stdin/stdout : les bases du CLI Node
│   │   ├── 01_cli_basics_solution.js                          # Un CLI fonctionnel avec parsing d'arguments propre
│   │   ├── 02_filesystem_ops.md                               # fs, path, readline : lire, écrire, traverser sans s'arracher les cheveux
│   │   ├── 02_filesystem_ops_solution.js                      # Les opérations filesystem qui couvrent 90% des cas réels
│   │   ├── 03_automation_scripts.md                           # Scripts qui automatisent : renommer, transformer, synchroniser
│   │   ├── 03_automation_scripts_solution.js                  # L'automation qui fait en 2 secondes ce qu'on faisait à la main en 20 minutes
│   │   ├── 04_cli_tool_builder.md                             # Construire un vrai outil CLI distribuable avec commander ou yargs
│   │   └── 04_cli_tool_builder_solution.js                    # Le CLI packagé, installable, utilisable par n'importe qui
│   └── 07_runtime_grimoire.md                                 # Node, navigateur, workers, streams, CJS, ESM : tout l'environnement d'exécution
│
├── 14_architecture_patterns/                                   # Construire grand sans tout effondrer en ajoutant une feature
│   ├── 01_module_pattern.md                                   # Encapsuler, exposer ce qui doit l'être, cacher le reste
│   ├── 01_module_pattern_solution.js                          # Le module pattern appliqué à un système réel
│   ├── 02_mvc_pattern.md                                      # Model, View, Controller : séparer les responsabilités avant de s'y noyer
│   ├── 02_mvc_pattern_solution.js                             # MVC sans framework —> pour comprendre ce que React et Angular font sous le capot
│   ├── 03_clean_architecture.md                               # Domaine au centre, infra à l'extérieur : le code qui ne dépend pas de ses outils
│   ├── 03_clean_architecture_solution.js                      # La clean architecture appliquée sur un use case métier réel
│   ├── 04_event_driven.md                                     # Event-driven : réagir aux événements plutôt que les anticiper
│   ├── 04_event_driven_solution.js                            # Un système d'événements maison, extensible sans modifier la source
│   ├── 05_microservices_intro.md                              # Découper en services : quand ça aide et quand ça complique
│   ├── 05_microservices_intro_solution.js                     # La simulation de deux services qui communiquent sans se connaître
│   └── 06_architecture_grimoire.md                            # MVC, clean architecture, event-driven, microservices : le dictionnaire de l'architecte
│
├── 15_web_concepts/                                            # Tout ce qu'un ingénieur web doit avoir en tête —> pas juste dans les doigts
│   ├── 01_http_rest_basics.md                                 # HTTP, verbes, status codes, headers : lire une requête comme un professionnel
│   ├── 01_http_rest_basics_solution.js                        # Les scénarios HTTP les plus courants, bien gérés
│   ├── 02_browser_render_pipeline.md                          # De l'HTML brut au pixel affiché : ce qui se passe entre les deux
│   ├── 02_browser_render_pipeline_solution.js                 # Optimiser le chemin critique sans sacrifier la richesse visuelle
│   ├── 03_state_and_dataflow.md                               # L'état d'une app web : qui le possède, qui le lit, qui le modifie
│   ├── 03_state_and_dataflow_solution.js                      # Un flux de données unidirectionnel, sans framework
│   ├── 04_caching_strategies.md                               # Cache-Control, ETags, stale-while-revalidate : mettre en cache sans mettre en danger
│   ├── 04_caching_strategies_solution.js                      # Les stratégies de cache appliquées à une API et à des assets statiques
│   ├── 05_auth_authz.md                                       # Authentification vs autorisation : deux problèmes différents, deux solutions différentes
│   ├── 05_auth_authz_solution.js                              # Auth avec sessions et JWT —> les deux approches côte à côte
│   ├── 06_serialization.md                                    # JSON, MessagePack, Protobuf : sérialiser sans perdre de données ni exploser les perfs
│   ├── 06_serialization_solution.js                           # Sérialiser et désérialiser des données complexes sans se planter
│   ├── 07_seo_and_rendering.md                                # SSR, SSG, CSR, ISR : choisir le bon mode de rendu pour la bonne raison
│   ├── 07_seo_and_rendering_solution.js                       # Les quatre modes de rendu simulés et comparés sur leurs points forts
│   └── 08_web_concepts_grimoire.md                            # HTTP, REST, cache, auth, sérialisation, rendering : les fondations du web côté ingé
│
├── 16_accessibility/                                           # Coder pour tout le monde —> pas juste pour les utilisateurs qui te ressemblent
│   ├── 01_a11y_why_it_matters.md                              # L'accessibilité n'est pas une option : les chiffres, les lois, et les gens réels
│   ├── 01_a11y_why_it_matters_solution.js                     # Un composant avant/après accessibilité —> la différence que ça fait
│   ├── 02_aria_basics.md                                      # ARIA roles, states, properties : communiquer avec les lecteurs d'écran
│   ├── 02_aria_basics_solution.js                             # Les ARIA attrs sur des composants courants —> modal, menu, live region
│   ├── 03_keyboard_navigation.md                              # tab order, focus management, skip links : naviguer sans souris
│   ├── 03_keyboard_navigation_solution.js                     # Le focus trap, le skip link, le tab order —> implémentés proprement
│   ├── 04_contrast_and_colors.md                              # Ratio de contraste WCAG : les calculs, les outils, les décisions
│   ├── 04_contrast_and_colors_solution.js                     # Vérifier le contraste programmatiquement sur une palette entière
│   ├── 05_screen_readers.md                                   # VoiceOver, NVDA, TalkBack : comment un lecteur d'écran interprète ton code
│   ├── 05_screen_readers_solution.js                          # Le composant qui passe le test lecteur d'écran sans accroc
│   ├── 06_a11y_audit.md                                       # Auditer une page avec axe, Lighthouse, et les tests manuels qu'on ne peut pas automatiser
│   ├── 06_a11y_audit_solution.js                              # L'audit complet sur une page réelle —> et les corrections qui suivent
│   └── 07_a11y_grimoire.md                                    # ARIA, WCAG, contrast ratio, focus management : le vocabulaire de l'accessibilité
│
├── 17_i18n/                                                    # Parler toutes les langues sans tout réécrire
│   ├── 01_i18n_basics.md                                      # Clés de traduction, namespaces, fallbacks : l'architecture i18n de base
│   ├── 01_i18n_basics_solution.js                             # Un système de traduction minimaliste qui tient la route
│   ├── 02_dates_timezones.md                                  # Les dates à travers les fuseaux horaires : le cauchemar et comment le résoudre
│   ├── 02_dates_timezones_solution.js                         # Intl.DateTimeFormat sur quatre locales —> sans une seule bibliothèque externe
│   ├── 03_number_formats.md                                   # 1,234.56 vs 1.234,56 : les formats numériques selon les pays
│   ├── 03_number_formats_solution.js                          # Formater les nombres pour chaque locale avec Intl.NumberFormat
│   ├── 04_pluralization.md                                    # "1 résultat" vs "2 résultats" vs "many" : la pluralisation qui varie par langue
│   ├── 04_pluralization_solution.js                           # Intl.PluralRules sur le français, l'anglais, l'arabe —> les trois cas qui changent tout
│   ├── 05_i18n_in_project.md                                  # Intégrer l'i18n dans un projet réel : organisation, performance, DX
│   ├── 05_i18n_in_project_solution.js                         # L'i18n complet sur une feature —> clés typées, lazy loading, fallbacks
│   └── 06_i18n_grimoire.md                                    # locale, clés de traduction, pluralisation, Intl : le glossaire i18n
│
├── 18_realtime/                                                # Le web qui respire en direct : WebSockets, SSE, WebRTC
│   ├── 01_websockets/                                          # Connexion persistante bidirectionnelle : le chat, le jeu, la colla
│   │   ├── 01_ws_basics.md                                    # Ouvrir, envoyer, recevoir, fermer : le cycle de vie d'une WebSocket
│   │   ├── 01_ws_basics_solution.js                           # La WebSocket fonctionnelle avec reconnect et heartbeat
│   │   ├── 02_ws_chat_room.md                                  # Construire un chat room avec rooms, broadcast, historique
│   │   └── 02_ws_chat_room_solution.js                        # Le chat room complet : messages, rooms, présence en ligne
│   ├── 02_sse/                                                 # Server-Sent Events : pousser des données du serveur sans WebSocket
│   │   ├── 01_sse_basics.md                                   # EventSource, event types, reconnect automatique : les bases SSE
│   │   ├── 01_sse_basics_solution.js                          # Un feed live en SSE — propre, avec retry et last-event-id
│   │   ├── 02_sse_live_feed.md                                 # Dashboard live avec SSE : données de match en temps réel
│   │   └── 02_sse_live_feed_solution.js                       # Le feed de match qui stream les events sans perdre un seul goal
│   ├── 03_webrtc/                                              # Peer-to-peer direct : appel vidéo, partage d'écran, transfert de fichiers
│   │   ├── 01_webrtc_concepts.md                              # ICE, SDP, STUN, TURN : le vocabulaire WebRTC sans la peur
│   │   ├── 01_webrtc_concepts_solution.js                     # La signalisation WebRTC : handshake complet simulé
│   │   ├── 02_webrtc_demo.md                                  # Appel vidéo peer-to-peer dans le navigateur
│   │   └── 02_webrtc_demo_solution.js                         # Le demo WebRTC fonctionnel, avec gestion des ICE candidates
│   └── 04_realtime_grimoire.md                                # WebSocket, SSE, WebRTC, signaling, ICE : le dictionnaire du temps réel
│
├── 19_api_craft/                                               # Construire ce que le monde consomme : et qui ne tombe pas en prod
│   ├── 01_express_from_scratch.md                             # Monter un serveur Express depuis zéro : pas de boilerplate, juste la logique
│   ├── 01_express_from_scratch_solution.js                    # Le serveur minimal qui gère les routes, les middlewares, les erreurs
│   ├── 02_rest_crud_complete.md                               # CRUD complet sur une ressource : GET, POST, PUT, PATCH, DELETE
│   ├── 02_rest_crud_complete_solution.js                      # Le CRUD propre avec validation, pagination, et filtres
│   ├── 03_error_handling_api.md                               # Les erreurs d'API : status codes, formats d'erreur, middleware global
│   ├── 03_error_handling_api_solution.js                      # Le middleware d'erreur qui transforme tout en réponse lisible
│   ├── 04_auth_jwt.md                                         # JWT de bout en bout : sign, verify, refresh : et ce qui peut foirer
│   ├── 04_auth_jwt_solution.js                                # L'auth JWT complète avec access token et refresh token
│   ├── 05_graphql_basics.md                                   # Schema, resolvers, queries, mutations : GraphQL sans la magie
│   ├── 05_graphql_basics_solution.js                          # Une API GraphQL fonctionnelle sur un domaine réel
│   ├── 06_api_versioning.md                                   # Versionner une API sans tout casser pour les clients existants
│   ├── 06_api_versioning_solution.js                          # v1 et v2 coexistent : la migration sans régression
│   ├── 07_openapi_swagger.md                                  # Documenter une API avec OpenAPI : le contrat que tout le monde peut lire
│   ├── 07_openapi_swagger_solution.js                         # La spec OpenAPI générée automatiquement depuis le code
│   └── 08_api_grimoire.md                                     # REST, CRUD, JWT, GraphQL, OpenAPI, versioning : le lexique de l'API builder
│
├── 20_security/                                                # Ne jamais être la faille que quelqu'un exploite
│   ├── 01_xss_injection.md                                    # XSS et injection SQL : les deux attaques qui touchent le plus d'apps en prod
│   ├── 01_xss_injection_solution.js                           # Sanitizer, parameterized queries, CSP : les trois lignes de défense
│   ├── 02_csrf_cors.md                                        # CSRF et CORS : comprendre les deux avant de misconfigurer l'un ou l'autre
│   ├── 02_csrf_cors_solution.js                               # La config CORS correcte + le token CSRF qui bloque les requêtes forgées
│   ├── 03_prototype_pollution.md                              # Polluer Object.prototype depuis un input utilisateur —> et pourquoi c'est catastrophique
│   ├── 03_prototype_pollution_solution.js                     # Bloquer la pollution : Object.create(null), validation de clé, freeze
│   ├── 04_auth_flows.md                                       # OAuth, sessions, JWT : les trois modèles d'auth et quand choisir lequel
│   ├── 04_auth_flows_solution.js                              # Les trois flows implémentés et comparés côte à côte
│   ├── 05_hashing_bcrypt.md                                   # Hasher un mot de passe : bcrypt, salt, coût, ce qu'on ne stocke jamais en clair
│   ├── 05_hashing_bcrypt_solution.js                          # bcrypt de A à Z : hashing, comparaison, migration de hash
│   ├── 06_owasp_checklist.md                                  # Les 10 vulnérabilités OWASP les plus fréquentes : et comment les éviter
│   ├── 06_owasp_checklist_solution.js                         # La checklist OWASP appliquée à une app Express réelle
│   └── 07_security_grimoire.md                                # XSS, CSRF, injection, auth, OWASP : le vocabulaire du dev qui pense à la sécurité
│
├── 21_ai_native_dev/                                           # Utiliser l'IA sans perdre le contrôle —> ni son jugement
│   ├── 01_ai_workflow.md                                      # Comment intégrer l'IA dans son workflow sans devenir dépendant
│   ├── 01_ai_workflow_solution.js                             # Le workflow dev-IA : génération, revue, validation, commit
│   ├── 02_prompt_engineering.md                               # Prompter pour obtenir du code utile : pas du code plausible
│   ├── 02_prompt_engineering_solution.js                      # Les patterns de prompt qui produisent du code vérifiable
│   ├── 03_validate_ai_output.md                               # Valider ce que l'IA génère : typage, parsing, tests automatiques
│   ├── 03_validate_ai_output_solution.js                      # Le pipeline de validation Zod sur une sortie LLM réelle
│   ├── 04_ai_refactor_partner.md                              # Utiliser l'IA comme partenaire de refactoring : pas comme remplaçant
│   ├── 04_ai_refactor_partner_solution.js                     # Le workflow human-in-the-loop pour refactorer avec l'IA
│   ├── 05_ai_test_generator.md                                # Générer des tests avec l'IA : et vérifier qu'ils testent vraiment quelque chose
│   ├── 05_ai_test_generator_solution.js                       # Les tests générés par IA, revus, corrigés, validés
│   └── 06_ai_grimoire.md                                      # LLM, prompt, output validation, hallucination, human-in-the-loop : le lexique du dev AI-native
│
├── 22_databases/                                               # Persister intelligemment dans le temps —> et retrouver rapidement
│   ├── 01_sql_basics.md                                       # SELECT, JOIN, INDEX, EXPLAIN : lire et interroger une DB relationnelle
│   ├── 01_sql_basics_solution.js                              # Les queries SQL les plus utiles sur un schéma réaliste
│   ├── 02_nosql_basics.md                                     # Document, clé-valeur, graphe : choisir la bonne DB pour le bon problème
│   ├── 02_nosql_basics_solution.js                            # MongoDB et Redis en action sur des cas d'usage distincts
│   ├── 03_data_modeling.md                                    # Modéliser des données : normalisation, dénormalisation, quand faire quoi
│   ├── 03_data_modeling_solution.js                           # Un schéma DB conçu pour les bonnes raisons —> avec les compromis assumés
│   ├── 04_redis_caching.md                                    # Redis comme cache : TTL, invalidation, strategies —> et ce qu'on ne met pas en cache
│   ├── 04_redis_caching_solution.js                           # Le cache Redis sur une API réelle avec invalidation propre
│   ├── 05_db_in_js.md                                         # Prisma, Drizzle, pg, mongoose : se connecter et requêter sans ORM hell
│   ├── 05_db_in_js_solution.js                                # Le client DB propre avec connection pool et gestion d'erreurs
│   └── 06_databases_grimoire.md                               # SQL, NoSQL, index, cache, ORM, connection pool : le vocabulaire de la data persistence
│
├── 23_scalability/                                             # Tenir quand ça devient sérieux —> 10 users vs 10 millions c'est pas le même code
│   ├── 01_load_balancing.md                                   # Distribuer le trafic : round-robin, least connections, sticky sessions
│   ├── 01_load_balancing_solution.js                          # Un load balancer simulé avec plusieurs instances
│   ├── 02_horizontal_vs_vertical.md                           # Scale up vs scale out : deux stratégies, deux contextes, deux coûts
│   ├── 02_horizontal_vs_vertical_solution.js                  # Simulation d'un système qui scale horizontalement sur montée en charge
│   ├── 03_rate_limiting.md                                    # Limiter les requêtes sans bloquer les utilisateurs légitimes
│   ├── 03_rate_limiting_solution.js                           # Token bucket et sliding window implémentés proprement
│   ├── 04_message_queues.md                                   # Découpler producteur et consommateur avec une queue de messages
│   ├── 04_message_queues_solution.js                          # Un système de jobs asynchrones avec retry et dead letter queue
│   └── 05_scalability_grimoire.md                             # load balancing, horizontal scaling, rate limiting, message queue : le lexique de la scalabilité
│
├── 24_observability/                                           # Voir ce qui se passe en prod —> avant que l'utilisateur le signale
│   ├── 01_structured_logging.md                               # Log en JSON avec correlation ID : les logs qu'on peut chercher et analyser
│   ├── 01_structured_logging_solution.js                      # Le logger structuré qui produit des logs utiles, pas du bruit
│   ├── 02_distributed_tracing.md                              # Suivre une requête à travers plusieurs services —> sans perdre le fil
│   ├── 02_distributed_tracing_solution.js                     # OpenTelemetry sur une API simple : spans, traces, context propagation
│   ├── 03_metrics_alerting.md                                  # Compteurs, gauges, histogrammes : les métriques qui annoncent les problèmes
│   ├── 03_metrics_alerting_solution.js                        # Les métriques exposées sur un endpoint Prometheus réel
│   ├── 04_sentry_in_prod.md                                   # Sentry : capturer, contextualiser, prioriser les erreurs en production
│   ├── 04_sentry_in_prod_solution.js                          # L'intégration Sentry complète avec context, breadcrumbs, release tracking
│   ├── 05_debug_in_prod.md                                    # Debugger sans reproduire localement : logs, snapshots, feature flags
│   ├── 05_debug_in_prod_solution.js                           # Les techniques de debug prod qui ne nécessitent pas de reproduire le bug
│   └── 06_observability_grimoire.md                           # logging, tracing, metrics, alerting, Sentry : le dictionnaire du dev qui voit en prod
│
├── 25_team_craft/                                              # Coder avec des humains : pas juste avec une machine
│   ├── 01_code_review.md                                      # Reviewer sans écraser, commenter sans blesser, approuver sans se planquer
│   ├── 01_code_review_solution.js                             # Un script de PR review qui applique les règles de façon automatique
│   ├── 02_adr_writing.md                                      # ADR : documenter une décision technique avant de coder, pas après
│   ├── 02_adr_writing_solution.js                             # Le template ADR rempli sur une vraie décision d'architecture
│   ├── 03_technical_writing.md                                # Écrire pour des devs : README, docs, runbooks —> clair et utilisable
│   ├── 03_technical_writing_solution.js                       # Un README et une doc API écrits selon les standards qui font la différence
│   ├── 04_navigate_codebase.md                                # Lire un codebase inconnu sans se perdre —> les techniques des dev expérimentés
│   ├── 04_navigate_codebase_solution.js                       # Le playbook de navigation : entry points, call graphs, grep stratégique
│   ├── 05_pair_programming.md                                 # Pair programming efficace : driver, navigator, quand switcher, comment ne pas se tuer
│   ├── 05_pair_programming_solution.js                        # Un exercice de pair programming structuré sur un problème réel
│   └── 06_team_grimoire.md                                    # ADR, code review, runbook, pair programming, bus factor : le vocabulaire du dev en équipe
│
├── 26_edge_cases/                                              # JS qui se rebelle —> et comment y survivre
│   ├── 01_nan_undefined_null.md                               # NaN, undefined, null : trois façons différentes de dire "rien" : et leurs pièges
│   ├── 01_nan_undefined_null_solution.js                      # Distinguer les trois, les gérer proprement, éviter les if imbriqués
│   ├── 02_floating_point.md                                   # 0.1 + 0.2 !== 0.3 : l'arithmétique flottante et pourquoi elle surprend toujours
│   ├── 02_floating_point_solution.js                          # Les workarounds sûrs pour le floating point : et quand utiliser BigInt
│   ├── 03_weird_coercions.md                                  # [] + {} = ?, {} + [] = ? : les coercions qui font rire et qui font mal
│   ├── 03_weird_coercions_solution.js                         # Décoder chaque coercition bizarre : et savoir quand les éviter
│   ├── 04_prototype_chain_dark.md                             # La chaîne prototype dans ses zones sombres : __proto__, hasOwnProperty, pollution
│   ├── 04_prototype_chain_dark_solution.js                    # Les manipulations de prototype qui éclairent et celles qu'on évite en prod
│   └── 05_edge_cases_grimoire.md                              # NaN, null, floating point, coercition, prototype : les cas limites qui piègent les meilleurs
│
├── 28_mini_projects/                                           # Assembler tout ça pour de vrai > pas des exercices, des systèmes
│   ├── 01_rasengan_engine/                                    # Le moteur de jutsu de Naruto : JS pur, FP total, zéro mutation
│   │   ├── cahierdescharges.md                                # Les specs du moteur : ce qu'il fait, ce qu'il ne fait pas, les contraintes
│   │   ├── README.md                                          # Comment lancer, tester, contribuer au projet
│   │   ├── TDD_JOURNAL.md                                     # Le journal des tests : red, green, refactor —> chaque étape documentée
│   │   ├── POSTMORTEM.md                                      # Ce qui a bien marché, ce qui a planté, ce qu'on referait différemment
│   │   ├── ADR/                                               # Les décisions d'architecture documentées avant d'avoir été prises
│   │   ├── src/                                               # Le code source du moteur
│   │   └── tests/                                             # La suite de tests qui prouve que le moteur tient
│   ├── 02_garo_no_kronika/                                    # Les Chevaliers de la Flamme : async, erreurs, real-time, architecture
│   │   ├── cahierdescharges.md                                # Le système de dispatch, les limites d'armure, le streaming vers le Conseil
│   │   ├── README.md                                          # Comment lancer le serveur, simuler une mission, lire les logs
│   │   ├── TDD_JOURNAL.md                                     # Test après test : chaque comportement async vérifié avant le code
│   │   ├── POSTMORTEM.md                                      # Ce que Promise.race a cassé et pourquoi c'était prévisible
│   │   ├── ADR/                                               # Les choix SSE vs WebSocket, Event-driven vs polling —> argumentés
│   │   ├── src/                                               # Le dispatcher, le Chevalier, le Conseil de Surveillance
│   │   └── tests/                                             # Les tests async qui vérifient les timings critiques
│   ├── 03_walking_dead_protocol/                              # Le camp de Rick Grimes : testing, refactoring, CLI, outils maison
│   │   ├── cahierdescharges.md                                # L'inventaire, les gardes, les rations —> et le code spaghetti à nettoyer
│   │   ├── README.md                                          # Comment naviguer dans la v1, comprendre la v2, lancer les tests
│   │   ├── TDD_JOURNAL.md                                     # Le journal de la transformation : chaque refacto précédé de ses tests
│   │   ├── POSTMORTEM.md                                      # Ce que le spaghetti a appris sur les coûts de la dette technique
│   │   ├── ADR/                                               # Les décisions SOLID : SRP ici, DIP là —> chaque choix justifié
│   │   ├── src/                                               # La v1 (à ne pas reproduire) et la v2 (la référence)
│   │   └── tests/                                             # La suite qui couvre tout le camp sans laisser de zombie passer
│   ├── 04_breaking_cache/                                     # La supply chain de Walter White : graphes, algos, profilage
│   │   ├── cahierdescharges.md                                # Le réseau de distribution, les routes, les risques, les contraintes de perf
│   │   ├── README.md                                          # Comment lancer les benchmarks, lire les résultats, interpréter les courbes
│   │   ├── TDD_JOURNAL.md                                     # Un test par algo : Dijkstra, heap, DP —> chacun prouvé avant d'être utilisé
│   │   ├── POSTMORTEM.md                                      # L'algo qui semblait bon et qui explosait sur les grands graphes
│   │   ├── ADR/                                               # Pourquoi min-heap plutôt que sorted array, pourquoi adjacency list
│   │   ├── src/                                               # Le graphe, le heap, les algos de recherche et d'optimisation
│   │   └── tests/                                             # Les tests de perf et de correctness sur des datasets réels
│   ├── 05_prison_break_api/                                   # L'évasion de Fox River : API, auth, DB, sécurité
│   │   ├── cahierdescharges.md                                # Les profils, les sections, les endpoints > et T-Bag qui essaie de tout hacker
│   │   ├── README.md                                          # Comment démarrer l'API, configurer la DB, tester les endpoints
│   │   ├── TDD_JOURNAL.md                                     # Chaque endpoint testé : happy path, edge cases, attaques simulées
│   │   ├── POSTMORTEM.md                                      # La vulnérabilité qu'on n'avait pas vue —> et comment on l'a trouvée
│   │   ├── ADR/                                               # JWT vs session, Redis vs DB pour le cache —> les compromis assumés
│   │   ├── src/                                               # L'API Express complète : routes, middlewares, controllers, services
│   │   └── tests/                                             # Les tests de sécurité, d'intégration, et de charge
│   ├── 06_ultras_dashboard/                                   # Le dashboard des ultras : TypeScript, observabilité, scalabilité
│   │   ├── cahierdescharges.md                                # Le pipeline d'events de match, les métriques, les alertes en temps réel
│   │   ├── README.md                                          # Comment lancer le dashboard, simuler un match, lire les traces
│   │   ├── TDD_JOURNAL.md                                     # Les tests de pipeline : chaque event typé, chaque transformation vérifiée
│   │   ├── POSTMORTEM.md                                      # Le spike de trafic pendant un but —> et ce qui a failli tomber
│   │   ├── ADR/                                               # Structured logging vs console.log, Sentry vs ELK —> le choix et ses raisons
│   │   ├── src/                                               # Le pipeline TypeScript, les métriques, le dashboard live
│   │   └── tests/                                             # Les tests de charge et les tests de tracing
│   ├── 07_ballon_dor_cli/                                     # Le vote du Ballon d'Or : CLI Node, refactoring, Docker, CI/CD
│   │   ├── cahierdescharges.md                                # Les commandes, la persistance, la v1 spaghetti à refactorer
│   │   ├── README.md                                          # Comment installer, voter, simuler, exporter
│   │   ├── TDD_JOURNAL.md                                     # TDD sur le CLI : chaque commande testée avant d'être implémentée
│   │   ├── POSTMORTEM.md                                      # Ce que la refacto a révélé sur la v1 : les coûts cachés
│   │   ├── ADR/                                               # commander vs yargs, JSON vs SQLite pour la persistance
│   │   ├── src/                                               # Le CLI complet : v1 (référence) et v2 (cible)
│   │   └── tests/                                             # Les tests E2E du CLI avec des simulations de vote massif
│   ├── 08_trapsoul_radio/                                     # La radio underground : TypeScript, a11y, i18n, web concepts
│   │   ├── cahierdescharges.md                                # La plateforme, les 4 locales, les contraintes WCAG, le pipeline TS
│   │   ├── README.md                                          # Comment lancer la radio, changer de locale, auditer l'accessibilité
│   │   ├── TDD_JOURNAL.md                                     # Tests a11y automatisés, tests i18n par locale, tests de rendu
│   │   ├── POSTMORTEM.md                                      # La locale malgache qui a tout cassé : et pourquoi on ne l'avait pas prévue
│   │   ├── ADR/                                               # SSR vs CSR pour le SEO, Intl natif vs bibliothèque i18n
│   │   ├── src/                                               # L'interface TypeScript avec ses composants accessibles et traduits
│   │   └── tests/                                             # Les tests a11y avec axe, les tests i18n sur les 4 locales
│   └── 09_oracle_glitch/                                      # Le LLM qui hallucine : AI-native dev, OOP, edge cases, team craft
│       ├── cahierdescharges.md                                # Le pipeline de validation, les classes OOP, les edge cases injectés
│       ├── README.md                                          # Comment lancer le pipeline, simuler des hallucinations, lire les rejets
│       ├── TDD_JOURNAL.md                                     # Un test par edge case : NaN dans les métriques, JSON tronqué, timeout
│       ├── POSTMORTEM.md                                      # Ce que l'IA a inventé : et comment le pipeline l'a intercepté
│       ├── ADR/                                               # Zod vs validation manuelle, streaming vs batch : les décisions du pipeline
│       ├── src/                                               # CodeAnalyzer, PromptBuilder, OutputValidator : trois classes, trois rôles
│       └── tests/                                             # Les tests qui injectent de vraies hallucinations et vérifient le rejet
│
├── 29_annexes/                                                 # La toolchain et le TypeScript avancé : ce qui fait tourner le reste
│   ├── toolchain/                                              # Les outils du dev moderne : git, Docker, CI/CD
│   │   ├── 01_git_survival.md                                 # Git sans pleurer : branches, rebase, conflits, bisect : le minimum vital
│   │   ├── 02_vscode_setup.md                                 # VSCode configuré pour un dev JS/TS sérieux : pas pour faire joli
│   │   ├── 03_package_managers.md                             # npm, yarn, pnpm : les différences qui comptent vraiment en 2026
│   │   ├── 04_bundlers.md                                     # Webpack, Vite, esbuild, Rollup : choisir sans subir
│   │   ├── 05_docker_basics.md                                # Containeriser une app Node : Dockerfile, compose, multi-stage builds
│   │   └── 06_cicd_basics.md                                  # GitHub Actions de zéro : tester, builder, déployer à chaque push
│   └── typescript_advanced/                                    # TS pour les cas que les bases n'expliquent pas
│       ├── 01_declaration_files.ts                            # .d.ts : écrire les types pour du JS sans types
│       ├── 02_ts_compiler_config.md                           # tsconfig.json : chaque option expliquée avec son impact réel
│       └── 03_ts_migration_guide.md                           # Migrer du JS pur vers TypeScript : sans tout réécrire en une nuit
│
└── 30_tools/                                                   # Les gadgets maison pour aller plus vite —> réutilisables dans tous les modules
    ├── 01_logger.js                                            # Le logger structuré qui tourne dans tous les projets
    ├── 02_helper_functions.js                                  # Les utilitaires qu'on réinvente trop souvent —> maintenant ils sont là
    ├── 03_array_utils.js                                       # chunk, flatten, unique, groupBy : les méthodes que Array.prototype n'a pas
    ├── 04_benchmark.js                                         # Mesurer le temps et la mémoire avant de décider si c'est assez rapide
    ├── 05_debug_toolkit.js                                     # deep inspect, diff, trace —> ce qu'on sort quand console.log ne suffit plus
    └── 06_devtools_cheatsheet.md                              # Les raccourcis DevTools qu'on cherche toujours au mauvais moment
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
