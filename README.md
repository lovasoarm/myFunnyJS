# MyFunnyJS


Ce projet, c'est le chemin complet pour passer de **"je connais quelques trucs en JS"** à **"je comprends ce que je fais, pourquoi je le fais, et comment ne pas tout péter en prod"**.

On apprend JavaScript. Mais l'objectif est beaucoup plus large.

Les structures de données, les algorithmes, les patterns d'architecture, la sécurité, la performance, le testing, l'observabilité, le travail en équipe : tout ça tourne dans n'importe quel langage. JS n'est que le vecteur. Ce qu'on construit ici, c'est **une façon de penser**.

Le mot d'ordre : **apprendre sérieusement en s'amusant vraiment**. Pas des slides. Pas des vidéos YouTube de 4 heures. Des fichiers `.js` avec des exercices qui ressemblent à des missions, des combats, des escape rooms et des histoires de pirates. Ton cerveau retient mieux quand il s'amuse. C'est prouvé. On l'exploite sans honte.

---

## Ce que tu vas devenir en finissant ce curriculum

Un développeur qui comprend ce qui se passe sous le capot.

Quelqu'un qui peut lire du code inconnu et en extraire le sens en moins d'une heure. Un dev qui teste avant de coder, qui observe ce qui se passe en production, qui écrit du code que les autres peuvent maintenir et que l'IA peut aussi lire et modifier sans tout casser.

En 2026, la valeur d'un développeur ne vient plus de sa vitesse à taper ou de sa capacité à installer dix frameworks. Elle vient de sa capacité à **comprendre le problème, choisir le bon pattern, sécuriser ce qu'il construit, et travailler avec les autres sans tout péter**. L'IA produit du code. Elle ne réfléchit pas. Toi oui.

---

## Les règles du jeu

**Lis chaque fichier du début à la fin** avant de coder. Les commentaires en haut de chaque exercice contiennent la leçon. Ne les saute pas.

**Code toi-même.** Copier-coller une solution depuis l'IA sans la comprendre, c'est comme regarder quelqu'un faire des pompes à ta place. Ton cerveau ne se renforce pas.

**Utilise l'IA comme un copilote**, pas comme un chauffeur. Elle génère, tu valides. Elle propose, tu décides. Le module `19_ai_native_dev` t'apprend exactement comment faire ça bien.

**Finis les mini-projets.** Les modules t'apprennent des concepts. Les mini-projets te forcent à les assembler pour de vrai. C'est là que tout se concrétise. Ne les saute pas.

**Remplis les TDD_JOURNAL et les POSTMORTEM.** Ce ne sont pas des formalités. C'est l'expérience capturée par écrit. Les meilleurs développeurs savent exactement pourquoi ils ont pris telle décision, ce qui a cassé, et ce qu'ils feraient différemment. Ces fichiers sont la différence entre quelqu'un qui a codé un projet et quelqu'un qui a appris quelque chose.

---


## Ce que tu dois maîtriser : la liste complète

### Fondamentaux JS

```
Primitives vs objets
  => Copier une valeur vs copier une adresse
  => Scope global, fonction, block
  => Closures et pourquoi elles piègent tout le monde

Fonctions comme valeurs
  => Les passer, les retourner, les stocker
  => Call Stack et Event Loop (mono-thread, microtasks vs macrotasks)

Coercition de types
  => Conversions implicites
  => Regex pour parser, valider, extraire
```

### Testing

```
Unit tests, mocks, spies
  => TDD : écrire le test AVANT le code
  => Tests d'intégration
  => Contract testing
  => E2E avec Playwright

Le testing n'est pas une étape après le code.
C'est une façon de coder.
```

### Mémoire et performance

```
Garbage Collector
  => Qui nettoie quoi et quand

Shallow copy vs deep copy
  => Big-O de O(1) à O(2^n)
  => Profiling avec performance.now()
  => Fuites mémoire : comment les chasser

LCP, INP, CLS
  => Les Core Web Vitals que Google mesure sur ton app
```

### Structures de données

```
Array  =>  LinkedList  =>  Stack  =>  Queue
  => Heap  =>  BST  =>  AVL  =>  Hash Table
  => Union-Find  =>  Fenwick Tree  =>  Suffix Array

Pas juste les nommer.
Les implémenter from scratch et savoir quand utiliser laquelle.
```

### Algorithmes

```
Sorting        :  Bubble, Quick, Merge
Searching      :  Linear, Binary
Dynamic Prog.  :  memoization, knapsack, matrix
Greedy         :  prendre le meilleur maintenant
Backtracking   :  sudoku, N-Queens
Graph algos    :  Dijkstra, A*, BFS, DFS

Pour chaque pattern : comprendre QUAND l'appliquer,
pas juste comment le coder.
```

### JS Fonctionnel

```
Pure functions  =>  immutabilité  =>  composition
  => currying  =>  partial application

Coder sans effets de bord involontaires.
```

### Refactoring

```
Clean Code     :  nommage, lisibilité, KISS, DRY
SOLID          :  les cinq principes, un par un
Code smells    :  identifier et corriger

Transformer du spaghetti en quelque chose de maintenable.
```

### Runtime

```
Node vs Browser  =>  les différences qui comptent vraiment
Streams et Buffers
CommonJS vs ESM
process, argv, env
Worker Threads   =>  parallélisme en JS mono-thread
```

### Architecture et patterns

```
Module  =>  Observer  =>  Factory  =>  Singleton
  => MVC  =>  Clean Architecture
  => Event-driven  =>  Microservices

Savoir les appliquer et surtout savoir
POURQUOI on les applique dans tel contexte.
```

### Web concepts

```
Client-Serveur  =>  HTTP, verbes REST, status codes
Pipeline de rendu du navigateur
State et data flow
Séparation des responsabilités
Caching        :  vitesse vs fraîcheur
Sérialisation  :  JSON, XML, binaire
Auth vs Authz
Config et secrets
Accessibilité
```

### API

```
Express from scratch
REST propre  =>  CRUD complet  =>  Middleware
Gestion d'erreurs sans jamais crasher en prod
GraphQL
Auth API avec JWT
```

### Sécurité

```
XSS  =>  SQL Injection  =>  CSRF
  => Prototype Pollution  =>  Auth flows
  => Hashing avec bcrypt et salt

OWASP et au-delà.
```

### Bases de données

```
SQL     :  requêtes, jointures, indexes
NoSQL   :  documents, clé/valeur, graphes
Modélisation et normalisation
Redis et stratégies de cache
```

### Scalabilité

```
Load balancing
Scale horizontal vs vertical
Rate limiting
Message queues  :  RabbitMQ et Kafka
```

### Edge cases JS

```
NaN, undefined vs null, floating point
Les trucs que JS fait et que personne n'a demandé.
```

### AI-Native Dev

```
Cursor et Copilot  :  workflow propre, pas de copier-coller zombie
Prompt engineering  :  générer du bon code
Valider ce que l'IA produit
Savoir quand lui faire confiance et quand reprendre le volant
Écrire du code que l'IA peut relire et modifier sans tout casser
```

### Observabilité en prod

```
Logs JSON structurés  :  fini les console.log nus
Distributed tracing  :  suivre une requête partout
Métriques et alerting  :  être prévenu avant le crash
Sentry  :  capturer, trier, corriger en prod
Déboguer en prod sans tout casser

Sans ça, tu codes bien mais tu es aveugle
quand quelque chose explose.
```

### Team Craft

```
Code review        :  donner et recevoir du feedback utile
ADR                :  documenter les décisions techniques qui doivent durer
Technical writing  :  écrire pour des humains fatigués
Naviguer un codebase inconnu
Pair programming
```

> Tout ça fonctionne dans n'importe quel langage. JS est le terrain d'entraînement. La façon de penser, elle, est universelle.

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
│   ├── 01_variables/                               # Variables : le Super Pouvoir
│   │   ├── 01_intro_variables.js                   # Primitives vs objets, la vérité cachée
│   │   ├── 02_reference_chaos.js                   # Les références qui foutent tout en l'air
│   │   └── 03_mutation_madness.js                  # Mutation & copies : shallow vs deep
│   ├── 02_scope/                                   # Scope & Contexte : où vit ton code ?
│   │   ├── 01_scope_basics.js                      # Global, local, block : les territoires
│   │   ├── 02_closure_trap.js                      # Fermetures et pièges mortels
│   │   └── 03_scope_escape_room.js                 # Escape room de closures
│   ├── 03_functions/                               # Fonctions : jouets de guerre
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
├── 04_math_basics/                                  # Maths de dev : la potion magique pour hacker le monde
    ├── 01_boolean_logic.js                         # Vrai ou faux ? Ton arme secrète pour dominer les if et && comme un boss
    ├── 02_modular_arithmetic.js                    # Modulo & co : quand tu veux faire rebondir les nombres comme un ninja
    ├── 03_bit_manipulation.js                      # Bit à bit : jouer avec des 0 et 1 comme des Lego surpuissants
    ├── 04_hashing_basics.js                        # Hash & cache : transformer le chaos en lookup instantané
    ├── 05_probability_random.js                    # Probabilité & RNG : le destin entre tes mains, Monte Carlo style
    ├── 06_combinatorics.js                         # Factorielle & permutations : calculer toutes les combinaisons possibles sans exploser ton cerveau
    └── 07_geometry_for_dev.js                      # Points, distances & collisions : dompter les pixels et le plan XY comme un mage du canvas
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
│   │   ├── 01_big_o_basics.js                      # O(1) à O(2^n) expliqués
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
│   ├── 02_linked_list/                             # Linked List : la chaîne de l'enfer
│   ├── 03_stack/                                   # Stack : LIFO, le tas de pancakes cosmiques
│   ├── 04_queue/                                   # Queue : FIFO, la file d'attente de l'enfer
│   ├── 05_heap/                                    # Heap : le roi des priorités
│   ├── 06_bst_avl/                                 # BST & AVL : arbres de puissance pure
│   ├── 07_hash_table/                              # Hash Table : la mémoire parfaite du hacker
│   ├── 08_union_find/                              # Union-Find : qui est connecté à qui ?
│   ├── 09_graphs/                                  # Graphes : modéliser le monde réel en code
│   ├── 10_fenwick_tree/                            # Fenwick Tree : sommes cumulées ultra-rapides
│   └── 11_suffix_array/                            # Suffix Array : recherche de patterns like a boss
│
│
├── 07_algorithms/                                  # Algorithmes : les patterns qui résolvent tout
│   ├── 01_sorting/                                 # Tri : mettre de l'ordre dans le chaos absolu
│   ├── 02_searching/                               # Recherche : trouver l'aiguille dans la botte
│   ├── 03_dynamic_programming/                     # DP : se souvenir pour aller plus vite
│   ├── 04_greedy/                                  # Greedy : prendre le meilleur maintenant
│   ├── 05_backtracking/                            # Backtracking : essayer, échouer, recommencer sans honte
│   └── 06_graph_algorithms/                        # Algos de graphes : naviguer l'impossible
│
│
├── 08_functional_js/                               # JS Fonctionnel : coder sans effets de bord ni regrets
├── 09_refactoring/                                 # Refactoring : écrire du code qui survit à son auteur
├── 10_runtime_env/                                 # Runtime : là où ton code prend vie (ou meurt)
├── 11_architecture_patterns/                       # Architecture Ninja : construire en grand, penser en sage
├── 12_web_concepts/                                # Concepts Web : tout ce qu'un ingénieur doit savoir
├── 13_api_craft/                                   # API Craft : construire ce que le monde consomme
├── 14_security/                                    # Sécurité Badass : OWASP & au-delà des nightmares
├── 15_databases/                                   # Bases de données : persister intelligemment
├── 16_scalability/                                 # Scalabilité : tenir sous la pression sans imploser
├── 17_edge_cases/                                  # Cas Bizarres : JS qui se rebelle contre son créateur
│
│
├── 18_bonus_crazy/                                 # Exercices Fous : le fun ne s'excuse pas
│   ├── 01_pirates/                                 # Pirates : coder ou couler
│   ├── 02_slashers/                                # Slashers : survie par l'algorithme
│   ├── 03_titans/                                  # Titans : Attack on Data Structures
│   ├── 04_anime_arena/                             # Anime Arena : les persos codent avec toi
│   └── 05_magic_lab/                               # Laboratoire Magique : alchimie de code pur
│
│
├── 19_ai_native_dev/                               # AI-Native Dev : coder avec l'IA comme un senior
├── 20_observability_prod/                          # Voir ce qui se passe en prod : l'oeil du senior
├── 21_team_craft/                                  # Coder en équipe : le vrai différenciateur senior
│
│
├── 22_mini_projects/                               # Projets Intégrateurs : tout assembler pour de vrai
│   ├── vaika_car_app/                              # App voiture : CRUD + async + Clean Archi
│   │   ├── README.md
│   │   ├── TDD_JOURNAL.md                          # Tests écrits AVANT le code
│   │   ├── POSTMORTEM.md                           # Ce qui a cassé, pourquoi, ce qu'on ferait mieux
│   │   ├── src/
│   │   └── tests/
│   ├── mini_social_network/                        # Réseau social : auth + data flow + state
│   ├── crypto_tracker/                             # Crypto tracker : API externe + caching + WebSocket
│   ├── crazy_chat_app/                             # Chat app : WebSockets + event-driven + rooms
│   └── crazydevs_prototype/                        # Le grand projet final : tout ce qu'on a appris
│       ├── README.md
│       ├── TDD_JOURNAL.md                          # Le plus important de tous
│       ├── POSTMORTEM.md
│       ├── ADR/                                    # Architecture Decision Records
│       │   ├── 001_why_nextjs.md
│       │   ├── 002_why_supabase.md
│       │   └── 003_state_management_choice.md
│       ├── src/
│       └── tests/
│
│
├── 23_annexes/                                     # Annexes pro : bonus pour aller encore plus loin
│   ├── toolchain/                                  # Toolchain : l'arsenal du dev moderne
│   └── typescript/                                 # TypeScript : JS avec un casque et une armure
│
│
└── 24_tools/                                       # Arsenal du développeur : tes gadgets maison
    ├── 01_logger.js
    ├── 02_helper_functions.js
    ├── 03_array_utils.js
    ├── 04_benchmark.js
    ├── 05_debug_toolkit.js
    └── 06_devtools_survival.js
```

---

## Roadmap : dans l'ordre, sans sauter d'étape

```
01  Fundamentals          =>  les bases sans lesquelles tout le reste est du sable
02  Async & Event Loop    =>  comprendre le coeur invisible de JS
03  Testing First         =>  tester avant de coder, pas après
04  Maths utiles          =>  les maths qui servent vraiment
05  Memory & Performance  =>  comprendre ce qui coûte cher et pourquoi
06  Data Structures       =>  les armes secrètes de tout bon algorithme
07  Algorithms            =>  les patterns qui résolvent 90% des problèmes
08  Functional JS         =>  coder sans effets de bord ni regrets
09  Refactoring           =>  transformer du code qui fonctionne en code qui dure
10  Runtime Environment   =>  savoir où ton code vit vraiment
11  Architecture Patterns =>  construire grand sans tout effondrer
12  Web Concepts          =>  tout ce qu'un ingénieur web doit avoir en tête
13  API Craft             =>  construire ce que le monde consomme
14  Security              =>  ne jamais être la faille que quelqu'un exploite
15  Databases             =>  persister intelligemment dans le temps
16  Scalability           =>  tenir quand ça devient sérieux
17  Edge Cases            =>  JS qui se rebelle, et comment y survivre
18  Bonus Crazy           =>  appliquer tout ça dans des contextes déjantés
19  AI Native Dev         =>  utiliser l'IA sans perdre le contrôle
20  Observability         =>  voir ce qui se passe en prod
21  Team Craft            =>  coder avec des humains, pas juste avec une machine
22  Mini Projects         =>  assembler tout ça pour de vrai
23  Annexes               =>  TypeScript, toolchain, le reste
24  Tools                 =>  les gadgets maison pour aller plus vite
```


---

## Ce que ce curriculum ne peut pas faire à ta place

Finir ce curriculum te mène à 95 sur 100. Les 5 points restants ne viennent pas d'un fichier `.js`.

Ils viennent d'avoir survécu à un bug de prod à 2h du matin. D'avoir eu une PR rejetée par quelqu'un qui t'a expliqué exactement pourquoi ton approche était mauvaise. D'avoir vu un utilisateur utiliser ton app d'une façon que tu n'avais pas du tout prévue. D'avoir expliqué un concept à un junior et réalisé que tu ne le comprenais pas aussi bien que tu croyais.

Ces choses-là ne se simulent pas. Elles se vivent. Le curriculum te prépare à les vivent dans les meilleures conditions possibles. Le reste, c'est le temps, les gens, et les projets réels.

Contribue à au moins un projet open source avant de te dire senior. Une vraie PR, même petite, mergée par quelqu'un que tu ne connais pas : ça vaut dix modules.

---

## Auteur

**RAMAHALY Lovasoa David**
