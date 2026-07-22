---
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Vue d'ensemble stable du curriculum, écrite à la main.
---

# ARBORESCENCE : vue d'ensemble du curriculum

Temps de lecture ~5 min

> Carte à haut niveau, écrite à la main, pas générée. Utilise-la comme boussole, pas comme lecture.

```
MyFunnyJS/
├── README.md                        # Point d'entrée, 60 lignes exprès
├── START_HERE.md                    # Par où commencer selon ton niveau
├── COMMUNAUTE.md                    # Comment contribuer sans casser la ligne éditoriale
├── UNIVERS_AUTORISES.md             # Naruto, DBZ, Prison Break… liste fermée
├── LICENSE                          # Ce que tu peux faire avec ce contenu
│
├── 00_getting_started/              # Installer Node, ouvrir un projet, lire une doc
├── 00_referentiel/                  # Les 6 pierres : la posture d'ingénieur
│
├── 01_fundamentals/                 # Variables, portée, types, fonctions, modules
├── 02_problem_solving/              # Modéliser avant de coder, décomposer un problème
├── 03_async/                        # Callbacks, promises, async/await, event loop
├── 04_debugging/                    # Méthode scientifique de chasse aux bugs
├── 05_error_handling/               # Prévoir l'échec, lever loud, wrapper juste
├── 06_testing/                      # AAA, fixtures, mocks, mutation testing
├── 07_math_basics/                  # IEEE 754, modulo, bits, hash, proba
├── 08_memory_performance/           # GC, complexité, profilage, Core Web Vitals
├── 09_data_structures/              # Array, Map, Set, Tree, Trie
├── 10_algorithms/                   # Tri, recherche, graphes, DP, récursion
├── 11_functional_js/                # Pure functions, immutabilité, composition
├── 12_design_patterns/              # GoF revisités JS-first
├── 13_refactoring/                  # Fowler à petits pas testés
├── 14_typescript/                   # Typage graduel, tooling, types avancés
├── 15_runtime_env/                  # Node, Bun, Deno, browser : différences réelles
├── 16_architecture_patterns/        # Hexagonal, CQRS, event-driven
├── 17_web_concepts/                 # HTTP, CORS, cookies, HTTPS, HTTP/3
├── 18_oop_js/                       # Classes, prototypes, polymorphisme
├── 19_web_inclusive/                # a11y + i18n : deux angles d'inclusion
├── 20_realtime/                     # WebSocket, SSE, WebRTC
├── 21_api_craft/                    # REST, GraphQL, tRPC, contrats, versioning
├── 22_security/                     # OWASP, auth, XSS, CSRF, secrets
├── 23_ai_native_dev/                # Coder avec IA sans se faire avoir
├── 24_databases/                    # SQL, index, transactions, ORM sains
├── 25_scalability/                  # Vertical, horizontal, cache, queue
├── 26_observability/                # Logs, metrics, traces, SLI/SLO
├── 27_team_craft/                   # Revue, PR, mentorat, RFC, ADR
├── 28_edge_cases/                   # Encoding, timezone, floating point, Unicode
├── 29_ai_agents_and_autonomy/       # Déléguer à un agent sans perdre le contrôle
│
├── 30_mini_projects/                # 18 projets : de Rasengan Engine à Polyglot Forge
│   ├── 01_rasengan_engine/
│   ├── 02_garo_no_kronika/
│   ├── ...
│   └── 18_human_vs_ai_smell/        # Nouveau v20 : même bug, deux styles
│
├── 31_annexes/                      # Ce qui ne rentre pas dans un module
│   ├── PONTS_INTER_MODULES.md       # Table des transitions ponctuées
│   ├── ARBORESCENCE.md              # Ce fichier
│   ├── PERISSABILITE.md             # Qui périme quand
│   ├── templates/                   # HYPOTHESES.md, POSTMORTEM.md, PUBLICATION_CHECKLIST.md
│   ├── reading/                     # Cartographie 15 min d'une codebase inconnue
│   ├── soft_skills/                 # Demander de l'aide, désaccord technique
│   ├── versioning/                  # MIGRATION_LEARNER.md
│   ├── career/                      # Portfolio, pitch, interview arena
│   ├── interview/                   # Grilles et exos de préparation
│   └── recall/                      # Spaced repetition, fiches de rappel
│
├── 32_tools/                        # Git, terminal, IDE, éditeur, CI
│
└── assets/                        # Images du repo (title.svg, etc.)
```

## RÈGLES DE LECTURE

- **`00_*` avant `01_*`** : les préludes ne sont pas optionnels si tu es débutant absolu.
- **Un module = un `00_why_*.md`** : lis-le en premier, il te dit pourquoi tu es ici.
- **`99_PONT_*.md`** : ferme le module courant, respire, puis ouvre le suivant.
