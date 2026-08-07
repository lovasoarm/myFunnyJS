[← Sommaire TECH-ILA](../TECH-ILA.md)

# Cartes MyFunnyJS ↔ technologies (sections 10 et 11)

---

## 10 : Carte MyFunnyJS → technologies

C'est le cœur du document. Pour chaque module, on répond à :

> "Ce que j'apprends dans ce fichier MyFunnyJS, où est-ce que je vais le retrouver dans la vraie vie technologique ?"

Quand un fichier n'a **aucune** application technologique directe, c'est écrit honnêtement. Aucun lien n'est inventé.

Légende des verdicts de transfert :

| Verdict           | Sens                                                          |
| ----------------- | ------------------------------------------------------------- |
| **DIRECT**        | le concept se retrouve tel quel dans une ou plusieurs technos |
| **INDIRECT**      | réutilisé par plusieurs technos sans être visible             |
| **PRÉREQUIS**     | ne se transfère pas seul, mais rien ne tient sans lui         |
| **RUNTIME/DEBUG** | sert surtout à diagnostiquer, pas à construire                |
| **SPÉCIFIQUE JS** | peu transférable hors de l'écosystème JS                      |
| **CONSULTABLE**   | à relire au besoin, pas à mémoriser                           |

---

### Prélude : `00_getting_started/` et `00_referentiel/`

| Fichier                                                    | Verdict                                                                                                         | Où ça réapparaît                                                                 |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `01_install.md`                                            | PRÉREQUIS                                                                                                       | gestion de versions de runtime (nvm/fnm, images Docker, matrices CI)             |
| `02_shell_survival.md`                                     | DIRECT                                                                                                          | Linux, Docker, CI, debug de prod, conteneurs                                     |
| `03_git_101.md`                                            | DIRECT                                                                                                          | Git, GitHub, revue de code, CI/CD, archéologie de legacy                         |
| `04_package_managers.md`                                   | DIRECT                                                                                                          | npm/pnpm, pip/uv, Maven/Gradle, NuGet : même problème de résolution              |
| `05_devsec_perso.md`                                       | DIRECT                                                                                                          | gestion de secrets, 2FA, signature de commits, hygiène de poste                  |
| `06_intemporel_vs_perissable.md`                           | DIRECT                                                                                                          | c'est la grille de classification de tout TECH-ILA                               |
| `02_competences.md`, `05_where_you_stand.md`               | INDIRECT                                                                                                        | construction du portfolio et préparation d'entretien                             |
| `03_JE_NE_SAIS_PAS_ENCORE.md`, `04_SORTIR_D_UN_PLATEAU.md` | RUNTIME/DEBUG mental                                                                                            | savoir dire "je ne sais pas" en entretien et en revue est une compétence évaluée |
| `07_repetition_espacee.md`                                 | Application directe : aucune identifiée. Valeur réelle : méthode d'apprentissage. Ne pas forcer un lien techno. |                                                                                  |

---

### Module 01 : `01_fundamentals/`

#### Où ce concept réapparaît dans les technologies

##### Fichier MyFunnyJS

`01_fundamentals/02_scope/02_closure_trap.md` (et `01b_lexical_scope_visualized.md`)

##### Concept appris

Une fonction capture les **variables** de son environnement lexical, pas leurs valeurs au moment de l'appel. Une closure créée à un instant T voit ce que cette portée contient : même si le monde a changé depuis.

##### Technologies concernées

| Technologie            | Où le concept réapparaît                                          | Pourquoi c'est utile                                                                                                                                                                                                              |
| ---------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React**              | hooks, callbacks, tableaux de dépendances, handlers d'événements  | comprendre pourquoi un `setInterval` dans un `useEffect` à dépendances vides compte jusqu'à 1 : la closure a capturé l'état initial. Sans ce modèle, tu tâtonnes en ajoutant des dépendances au hasard jusqu'à ce que "ça marche" |
| **Node.js**            | handlers de requêtes, middlewares, callbacks d'événements, timers | un middleware qui capture une variable de portée module la partage entre **toutes** les requêtes. C'est la fuite de données inter-utilisateurs la plus classique en Express                                                       |
| **NestJS**             | guards, interceptors, providers, closures dans les factories      | comprendre qu'un provider singleton capture son état une seule fois, à la construction, et que toute donnée de requête stockée dedans fuit vers la requête suivante                                                               |
| **TypeScript**         | typage des callbacks, inférence dans les fonctions retournées     | le type se propage à travers la closure ; les erreurs d'inférence deviennent lisibles                                                                                                                                             |
| **Python**             | closures, décorateurs, fonctions imbriquées, `nonlocal`           | même mécanisme, une différence brutale : sans `nonlocal`, une affectation crée une variable locale au lieu de modifier la capturée                                                                                                |
| **Spring Boot / Java** | lambdas, callbacks, `@Async`, gestion de cycle de vie             | Java exige que la variable capturée soit _effectivement finale_ : le langage t'interdit le bug que JavaScript t'autorise                                                                                                          |

##### Ce que l'apprenant doit reconnaître

Devant une codebase réelle : chaque fois qu'une fonction est **définie ici et exécutée plus tard ailleurs** (callback, handler, effet, tâche planifiée, listener), il doit se demander automatiquement : _quelles variables cette fonction a-t-elle capturées, et ont-elles changé depuis ?_

##### Exemple réel

Un middleware Express qui met en cache le résultat d'une configuration :

```js
export function withTenantConfig(app) {
  let config; // capturée par la closure
  return async (req, res, next) => {
    config ??= await loadConfig(req.headers["x-tenant"]); //[INTERDIT]chargée UNE fois
    req.config = config; // tous les tenants suivants reçoivent le premier
    next();
  };
}
```

Ça marche parfaitement en développement (un seul tenant). En production multi-clients, le client B reçoit la configuration du client A. Aucune erreur, aucun log, une fuite de données.

##### Piège de transfert

En Python, une boucle `for` qui crée des closures capture la **variable de boucle**, pas sa valeur : même piège qu'avec `var` en JavaScript, et il n'y a pas de `let` pour te sauver. En Java, le compilateur refuse purement et simplement de capturer une variable modifiée. Trois langages, trois politiques, un seul mécanisme.

##### Pont vers d'autres fichiers MyFunnyJS

`01_fundamentals/01_variables/01c_stack_heap.md` (où vit la valeur capturée), `08_memory_performance/01_gc/03_leak_from_closure_walkthrough.md` (la closure qui retient un objet mort), `11_functional_js/04_currying.md` (la closure comme outil et non comme piège), `01_fundamentals/09_expliquer_a_3_publics_closures.md` (savoir l'expliquer en entretien).

---

#### Le reste du module 01

| Fichier                                | Verdict       | Où ça réapparaît concrètement                                                                       |
| -------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| `01_variables/01b_var_let_const.md`    | DIRECT        | portée des variables dans tout langage à blocs ; le piège `var` en boucle se rejoue en Python       |
| `01_variables/01c_stack_heap.md`       | INDIRECT      | profiling mémoire Node, heap dumps JVM, GC .NET : même modèle                                       |
| `01_variables/02_reference_chaos.md`   | DIRECT        | React (muter l'état ne rerend pas), ORM (une entité mutée est persistée à ton insu), sérialisation  |
| `01_variables/03_mutation_madness.md`  | DIRECT        | immutabilité en React/Redux, `record` Java, `readonly` C#, `frozen` Python                          |
| `01_variables/04_const_trap.md`        | DIRECT        | `const` ne gèle pas l'objet : même illusion avec `final` en Java                                    |
| `02_scope/04_this_context.md`          | SPÉCIFIQUE JS | classes JS, handlers DOM, bibliothèques anciennes ; disparaît presque avec les fonctions fléchées   |
| `03_functions/02_hof_map_filter.md`    | DIRECT        | streams Java, LINQ C#, compréhensions Python, transformations de données partout                    |
| `03_functions/03_function_factory.md`  | DIRECT        | middlewares configurables, décorateurs, factories de providers NestJS                               |
| `04_types/02_type_coercion.md`         | SPÉCIFIQUE JS | validation d'entrées d'API, parsing de query strings (tout arrive en `string`)                      |
| `05_web_basics/01_dom_manipulation.md` | PRÉREQUIS     | React, Vue, tests Playwright et Testing Library reposent dessus                                     |
| `05_web_basics/02_fetch_adventure.md`  | DIRECT        | tout client HTTP, dans tous les langages ; base de la compréhension des timeouts et de l'annulation |
| `05_web_basics/03_storage_treasure.md` | DIRECT        | stockage de tokens côté client : et pourquoi `localStorage` est vulnérable au XSS                   |
| `06_modules/01_import_export.md`       | DIRECT        | bundlers, tree-shaking, frontières serveur/client Next.js, imports circulaires NestJS               |
| `07_regex/*`                           | CONSULTABLE   | validation, parsing de logs, `grep`/`rg`. Ne jamais mémoriser une regex complexe : la commenter     |
| `08_git_core.md`                       | DIRECT        | voir [4.2](./01-niveau-1-socle.md#42--git-et-github)                                                                      |

---

### Module 02 : `02_problem_solving/`

##### Fichier MyFunnyJS

`02_problem_solving/05_read_fuzzy_requirements.md`, `01_polya_method.md`, `04_choose_an_approach.md`

##### Concept appris

Clarifier une demande floue, la décomposer, modéliser avant de coder, choisir une approche en connaissance de cause.

##### Technologies concernées

| Technologie          | Où le concept réapparaît                                  | Pourquoi c'est utile                                                                            |
| -------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Toutes**           | la phase qui précède toute ligne de code                  | c'est la seule compétence que l'IA ne remplace pas, et celle que les entretiens sondent le plus |
| **Modélisation SQL** | choisir les tables, les clés, les relations               | une mauvaise modélisation coûte des années ; aucun framework ne la corrige                      |
| **Conception d'API** | quelles ressources, quels verbes, quelle granularité      | une API mal découpée devient impossible à faire évoluer sans versioning douloureux              |
| **Architecture**     | monolithe ou services, synchrone ou asynchrone            | des choix irréversibles pris trop tôt, souvent sans avoir posé les bonnes questions             |
| **Prompting IA**     | une demande floue produit un code plausible et hors-sujet | reformuler est devenu une compétence technique mesurable                                        |

##### Ce que l'apprenant doit reconnaître

Une spécification qui se contredit, un besoin implicite non exprimé, une contrainte de volume absente ("combien d'événements par seconde ?"), un cas limite passé sous silence.

##### Exemple réel

Ticket : _"Ajouter un export CSV des mesures."_ Questions absentes : combien de lignes maximum ? synchrone ou par e-mail ? quel fuseau horaire pour les dates ? quel séparateur (la France utilise `;`) ? qui a le droit d'exporter quoi ? Coder immédiatement, c'est garantir trois allers-retours. Poser ces cinq questions prend dix minutes et change la solution : au-delà de 100 000 lignes, ce n'est plus un endpoint, c'est un job.

##### Piège de transfert

Aucun framework ne signale une spécification contradictoire. Le compilateur non plus. Les tests non plus : ils testeront fidèlement la mauvaise chose.

##### Pont vers d'autres fichiers MyFunnyJS

`28_edge_cases/10_SPEC_DRIFT_DRILL.md`, `27_team_craft/08_how_to_ask.md`, `31_annexes/04_when_not_to_code.md`.

**Seuil franchi.** Tu comprends maintenant pourquoi ce module, qui ne contient presque pas de code, est celui qui a le meilleur rendement de tout MyFunnyJS.

---

### Module 03 : `03_async/`

##### Fichier MyFunnyJS

`03_async/04_event_loop/`, `02_promises/01_promise_race.md`, `06_backpressure.md`, `03_async_await/02c_abort_controller.md`

##### Concept appris

Ordre d'exécution, microtâches vs macrotâches, parallélisme vs concurrence, annulation, pression de flux.

##### Technologies concernées

| Technologie         | Où le concept réapparaît                                 | Pourquoi c'est utile                                                                                                  |
| ------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Node.js**         | tout serveur, streams, timers, pool libuv                | comprendre qu'un calcul synchrone de 300 ms ajoute 300 ms à **toutes** les requêtes en vol, pas seulement à la sienne |
| **React**           | groupage des mises à jour, effets, Suspense, transitions | savoir pourquoi lire l'état juste après `setState` renvoie l'ancienne valeur, et pourquoi ce n'est pas un bug         |
| **NestJS**          | handlers async, interceptors, tâches planifiées          | une erreur async non propagée disparaît sans laisser de trace                                                         |
| **Files / workers** | traitement concurrent, limitation de débit               | `Promise.all` sur 10 000 jobs, c'est un déni de service envers ta propre base                                         |
| **Python asyncio**  | `await`, `gather`, `TaskGroup`, annulation               | modèle quasi identique ; `gather` ≈ `Promise.all`, avec une gestion d'erreur différente                               |
| **Java / .NET**     | `CompletableFuture`, threads virtuels, `Task`            | rupture de modèle : parallélisme réel, donc problèmes de mémoire partagée que JS n'a pas                              |

##### Ce que l'apprenant doit reconnaître

Un `await` dans une boucle qui aurait dû être parallèle. Un `Promise.all` sans limite de concurrence. Une opération qui n'est jamais annulée quand l'utilisateur part. Un timeout absent. Un ordre d'exécution supposé mais non garanti.

##### Exemple réel

Un service de rafraîchissement qui interroge 800 flux :

```js
//[INTERDIT]800 requêtes simultanées : le fournisseur te bannit, ton pool DB explose
const results = await Promise.all(streams.map(fetchStats));

// ✅ concurrence bornée, comportement prévisible
const results = await mapWithConcurrency(streams, 8, fetchStats);
```

Les deux "fonctionnent" sur 10 flux en développement. Un seul survit à 800 en production.

##### Piège de transfert

`Promise.all` échoue au premier rejet et abandonne les résultats déjà obtenus (utilise `allSettled` si tu veux tout). En Python, `asyncio.gather(..., return_exceptions=True)` fait la même chose sous un autre nom. En Java, tu passes à un modèle de threads où bloquer est normal : inverser ce réflexe est le principal effort de transfert.

##### Pont vers d'autres fichiers MyFunnyJS

`05_error_handling/04_async_error_traps.md`, `28_edge_cases/05_race_condition_hunter.md`, `25_scalability/06_rate_limiting.md`, `03_async/07_shared_memory_concurrency.md`.

---

### Module 04 : `04_debugging/`

##### Fichier MyFunnyJS

`04_debugging/02_debug_methodology.md`, `04_repro_before_fix.md`, `05_hypothesis_driven_debug.md`, `07_flaky_bugs.md`

##### Concept appris

Reproduire avant de corriger. Formuler une hypothèse falsifiable. Distinguer symptôme et cause racine. Traiter les bugs non déterministes.

##### Technologies concernées

| Technologie            | Où le concept réapparaît                            | Pourquoi c'est utile                                                   |
| ---------------------- | --------------------------------------------------- | ---------------------------------------------------------------------- |
| **Toutes**             | c'est la compétence la plus universelle du document | un débogueur méthodique est utile dans un langage qu'il ne connaît pas |
| **React DevTools**     | pourquoi ce composant se réexécute                  | l'hypothèse guide la mesure, pas l'inverse                             |
| **Traces distribuées** | suivre une requête à travers cinq services          | sans hypothèse, une trace est un mur de données                        |
| **Git bisect**         | trouver le commit fautif                            | dichotomie appliquée à l'historique                                    |
| **CI instable**        | tests flaky                                         | même méthode : isoler, reproduire, prouver                             |
| **Sortie d'IA**        | vérifier un correctif proposé                       | "ça a l'air correct" n'est pas une preuve                              |

##### Ce que l'apprenant doit reconnaître

Un correctif qui fait disparaître le symptôme sans expliquer la cause. Un bug "qui n'arrive qu'en prod" (indice : concurrence, volume, données réelles, latence, ou config). Un test réparé en augmentant un `sleep`.

##### Exemple réel

Un job échoue une fois sur cinquante avec une contrainte d'unicité violée. Le correctif proposé : un `try/catch` qui ignore l'erreur. Le symptôme disparaît. Six mois plus tard, on découvre que 2 % des mesures n'ont jamais été enregistrées. La cause réelle était un double envoi du producteur, corrigeable par une clé d'idempotence. **Un `catch` vide est un bug déguisé en correctif.**

##### Piège de transfert

Chaque écosystème a ses outils (DevTools, débogueur JVM, `pdb`, profileur .NET) mais la méthode est identique. Ne recommence pas à deviner sous prétexte que l'outil est nouveau.

##### Pont vers d'autres fichiers MyFunnyJS

`26_observability/06_debug_in_prod.md`, `28_edge_cases/06_heisenbug_arena.md`, `04_debugging/08_ia_vs_human_bugs.md`.

**Réflexe gagné.** Avant de toucher au code, tu cherches la cause. C'est le début du vrai debugging : et ça se voit immédiatement en entretien technique.

---

### Module 05 : `05_error_handling/`

##### Fichier MyFunnyJS

`05_error_handling/03_error_propagation.md`, `02_custom_errors.md`, `04_async_error_traps.md`, `05_error_strategy.md`

##### Concept appris

Une erreur est une donnée qui voyage. Décider où l'attraper, quoi transformer, quoi laisser remonter, et quoi ne jamais avaler.

##### Technologies concernées

| Technologie              | Où le concept réapparaît                                    | Pourquoi c'est utile                                                            |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **API HTTP**             | mapper une erreur métier vers un code 4xx/5xx               | un 200 contenant `{"error":...}` casse tous les clients et toutes les métriques |
| **NestJS**               | exception filters, hiérarchie d'exceptions                  | un seul endroit pour transformer les erreurs en réponses                        |
| **Express**              | middleware d'erreur, piège de l'async non attrapé           | une promesse rejetée non gérée laisse le client en attente jusqu'au timeout     |
| **React**                | error boundaries, états d'erreur d'une requête              | un composant qui n'a pas d'état d'erreur affiche un écran blanc                 |
| **Files / workers**      | quelle erreur mérite un retry, laquelle part en dead-letter | rejouer une erreur de validation 50 fois ne la rendra pas valide                |
| **Python / Java / .NET** | exceptions typées, `@ControllerAdvice`, middleware          | même architecture, autre vocabulaire                                            |

##### Ce que l'apprenant doit reconnaître

Un `catch` qui log et continue comme si de rien n'était. Une erreur générique qui perd la cause originale. Un message d'erreur qui fuit une trace interne vers l'utilisateur (fuite d'information, `22_security/`). L'absence de distinction entre erreur **attendue** (validation, 404) et erreur **inattendue** (bug, panne).

##### Exemple réel

Une API renvoie `500 Internal Server Error` quand un identifiant n'existe pas. Conséquences en chaîne : l'alerting se déclenche à tort, le client réessaie (c'est un 5xx, donc censé être transitoire), le taux d'erreur pollue le SLO, et le vrai incident du lendemain passe inaperçu dans le bruit. C'était un `404`. Un seul code mal choisi coûte une astreinte.

##### Piège de transfert

Java et C# ont des exceptions typées et vérifiées par le compilateur ; JavaScript peut jeter n'importe quoi, y compris une string. Go n'a pas d'exceptions du tout. Le raisonnement "quelle erreur est attendue, laquelle est un bug" reste le même partout.

##### Pont vers d'autres fichiers MyFunnyJS

`21_api_craft/03_error_handling_api.md`, `26_observability/01_structured_logging.md`, `05_error_handling/06_error_grimoire.md`.

---

### Module 06 : `06_testing/`

Voir la fiche outillage en [4.8](./01-niveau-1-socle.md#48--testing-en-conditions-r%C3%A9elles). Correspondances par fichier :

| Fichier                             | Verdict       | Où ça réapparaît                                                                                                             |
| ----------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `01_unit_sniper.md`                 | DIRECT        | Vitest, Jest, JUnit, pytest, xUnit : même granularité                                                                        |
| `03_mocking_madness.md`             | DIRECT        | le choix mock vs vraie dépendance est **la** décision de stratégie de test                                                   |
| `04_integration_reactor.md`         | DIRECT        | Testcontainers, base réelle éphémère, serveur HTTP de test                                                                   |
| `05_tdd_arena.md`                   | INDIRECT      | pratiqué inégalement en entreprise ; le réflexe "écrire le test qui échoue d'abord" reste précieux pour prouver un correctif |
| `07_contract_testing_pact.md`       | CONTEXTUELLE  | utile dès qu'il y a plusieurs services et plusieurs équipes ; inutile sur un monolithe                                       |
| `08_e2e_playwright_beast.md`        | DIRECT        | Playwright, tests de bout en bout, tests de fumée en CD                                                                      |
| `09_test_strategy_not_framework.md` | NOYAU DURABLE | la seule partie du module qui ne changera jamais                                                                             |

**Ce que l'apprenant doit reconnaître.** Une suite verte qui ne prouve rien (tout est mocké). Un test qui teste l'implémentation. Une couverture de 90 % sans un seul cas d'erreur testé.

---

### Module 07 : `07_math_basics/`

Verdict global : **INDIRECT**, avec des exceptions nettes. On n'invente pas de liens ici.

| Fichier                    | Verdict      | Application réelle                                                          |
| -------------------------- | ------------ | --------------------------------------------------------------------------- |
| `01_boolean_logic.md`      | DIRECT       | clauses `WHERE` SQL, règles d'autorisation, conditions de feature flags     |
| `04_hashing_basics.md`     | DIRECT       | index de base de données, partitionnement, caches, checksums, dédoublonnage |
| `05_probability_random.md` | DIRECT       | jitter de retry, échantillonnage de traces, tests A/B, load testing         |
| `02_modular_arithmetic.md` | INDIRECT     | sharding par modulo (répartition des données sur plusieurs bases/partitions), hachage cohérent, fenêtres temporelles                 |
| `03_bit_manipulation.md`   | CONSULTABLE  | flags de permissions, protocoles binaires, embarqué. Rare en web            |
| `06_combinatorics_lite.md` | INDIRECT     | estimer l'explosion d'un espace de tests, complexité                        |
| `08_geometry_for_dev.md`   | CONTEXTUELLE | canvas, cartographie, visualisation de données                              |

Application directe pour `03_bit_manipulation.md` en développement web courant : **aucune identifiée**. Valeur réelle : comprendre ce qui se passe sous les types, lire du code système, et ne pas paniquer devant un masque binaire dans une bibliothèque.

---

### Module 08 : `08_memory_performance/`

##### Fichier MyFunnyJS

`08_memory_performance/00_measure_first.md`, `01_gc/03_leak_from_closure_walkthrough.md`, `01_gc/06_detached_dom_leak.md`, `04_profiling/`, `03_complexity/`

##### Concept appris

Mesurer avant d'optimiser. Comprendre ce qui retient la mémoire. Lire un profil CPU et un heap snapshot. Raisonner en complexité.

##### Technologies concernées

| Technologie            | Où le concept réapparaît                                          | Pourquoi c'est utile                                                                 |
| ---------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Node en production** | conteneur tué par OOM, fuite lente sur un service de longue durée | un script qui vit 3 s pardonne tout ; un serveur qui vit 3 semaines ne pardonne rien |
| **React**              | listeners non nettoyés, DOM détaché, rendus inutiles              | le cleanup d'un effet n'est pas une formalité, c'est la prévention d'une fuite       |
| **SQL**                | `EXPLAIN` : Seq Scan vs Index Scan                                | c'est de la complexité algorithmique appliquée à 40 millions de lignes               |
| **Cache**              | ratio de hits, taille, éviction                                   | un cache sans limite de taille est une fuite mémoire avec un joli nom                |
| **JVM / .NET**         | heap dumps, générations, tuning GC                                | vocabulaire différent, même science                                                  |
| **Core Web Vitals**    | LCP, INP, CLS                                                     | la performance perçue est mesurée, pas ressentie                                     |

##### Ce que l'apprenant doit reconnaître

Une "optimisation" sans mesure avant/après. Un service dont la mémoire monte en escalier sans jamais redescendre. Un `useMemo` posé par réflexe. Une boucle imbriquée sur des données qui grossissent.

##### Exemple réel

Une API met en cache les résultats dans une `Map` au niveau module, sans limite ni TTL. En dev : 12 entrées, invisible. En prod : une entrée par combinaison de filtres, 400 000 entrées après trois jours, redémarrage par OOM toutes les 48 h. L'équipe programme un redémarrage automatique la nuit et considère le problème réglé pendant huit mois. Le heap snapshot montrait la `Map` en trente secondes.

##### Piège de transfert

Le GC de V8, celui de la JVM et celui de .NET diffèrent dans leurs stratégies mais partagent le principe : **ce qui est atteignable n'est pas libéré**. Une fuite est presque toujours une référence oubliée, pas un bug du GC.

##### Pont vers d'autres fichiers MyFunnyJS

`26_observability/04_metrics_alerting.md`, `09_data_structures/`, `31_annexes/03_finops_greenops.md` (la mémoire est une ligne de facture).

**Connexion activée.** Closure, mémoire, callback et fuite viennent de devenir un seul modèle mental. Quatre chapitres, une compétence.

---

### Module 09 : `09_data_structures/` et Module 10 : `10_algorithms/`

Verdict : **INDIRECT mais fondamental**. C'est le module que les juniors jugent inutile et que les seniors utilisent tous les jours sans le nommer.

| Structure / algo        | Où tu la retrouves réellement                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| Hash table              | index de base, cache Redis, déduplication, `Map` de regroupement                                          |
| Arbre (B-tree)          | **tout index de base de données** ; l'ordre des colonnes d'un index composite s'explique par la structure |
| Tas / file de priorité  | ordonnanceurs, files de jobs prioritaires, algorithmes de chemin                                          |
| File                    | files de messages, event loop, backpressure                                                               |
| Graphe + BFS/DFS        | graphe de dépendances npm, résolution d'imports, permissions hiérarchiques, GraphQL                       |
| Tri topologique         | ordre d'exécution des migrations, dépendances de jobs CI                                                  |
| Recherche binaire       | `git bisect`, recherche dans des données triées, dichotomie de diagnostic                                 |
| Programmation dynamique | rare en web. Honnêteté : surtout en entretien et en optimisation spécialisée                              |
| Complexité              | dimensionnement, choix de structure, lecture d'un plan de requête                                         |

**Application directe des sujets bonus** (`09_advanced_bonus/`, `05_backtracking/`, `03_dynamic_programming/`) en développement web courant : **aucune identifiée** dans la majorité des postes. Valeur réelle : entraînement au raisonnement, entretiens algorithmiques, et une petite minorité de domaines (compilateurs, moteurs de recherche, optimisation, jeu). Ne pas prétendre le contraire.

**Ce que l'apprenant doit reconnaître.** Une recherche linéaire dans une boucle qui aurait dû être une `Map` (le N² silencieux). Un tri refait à chaque itération. Une structure choisie par habitude et non par accès dominant.

---

### Modules 11 et 12 : `11_functional_js/` et `12_design_patterns/`

##### Concept appris

Pureté, immutabilité, composition, currying, application partielle : puis les patrons Factory, Singleton, Decorator, Adapter, Proxy, Observer, Strategy, Command.

##### Technologies concernées

| Concept                  | Où il réapparaît                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Fonction pure**        | composant React, réducteur, transformation de données, fonction testable sans mock                    |
| **Immutabilité**         | état React/Redux, `record` Java, structures figées, migrations de données                             |
| **Composition**          | chaîne de middlewares Express, pipeline de streams, `pipe` RxJS, composition de hooks                 |
| **Currying / partielle** | middleware configurable, factories de providers, `partial` en Python                                  |
| **Factory**              | providers NestJS, création de clients selon l'environnement                                           |
| **Singleton**            | pool de connexions, client de cache. **Piège** : en Node, un singleton par process ≠ singleton global |
| **Decorator**            | décorateurs NestJS, annotations Spring, attributs C#, décorateurs Python                              |
| **Adapter**              | encapsuler une API tierce derrière ton interface : la seule façon de pouvoir en changer               |
| **Proxy**                | ORM (lazy loading), objets réactifs Vue, mocks, caches transparents                                   |
| **Observer**             | `EventEmitter`, pub/sub Redis, WebSocket, signaux, architecture événementielle                        |
| **Strategy**             | choisir un algorithme à l'exécution (fournisseur de paiement, mode d'export, politique de retry)      |
| **Command**              | files de jobs, annulation/rétablissement, event sourcing                                              |

##### Ce que l'apprenant doit reconnaître

Un patron appliqué sans besoin (le sur-design est un smell, `13_refactoring/03_code_smells.md`). Un Singleton qui masque un état global partagé. Un Observer sans désabonnement (fuite garantie).

##### Piège de transfert

En Java et C#, les patrons sont souvent des **classes** ; en JavaScript et Python, souvent des **fonctions**. Même intention, forme différente. Reconnaître l'intention derrière la forme est précisément la compétence attendue en revue de code.

##### Pont

`16_architecture_patterns/`, `11_functional_js/98_PORTAGE_MENTAL.md`, `12_design_patterns/98_PORTAGE_MENTAL.md` : MyFunnyJS a déjà anticipé le transfert dans ces fichiers, TECH-ILA les prolonge vers les technos.

---

### Module 13 : `13_refactoring/`

| Fichier                             | Verdict       | Où ça réapparaît                                                                            |
| ----------------------------------- | ------------- | ------------------------------------------------------------------------------------------- |
| `01_clean_code_basics.md`           | DIRECT        | revue de code dans tous les écosystèmes                                                     |
| `02_solid_principles.md`            | DIRECT        | DI NestJS/Spring/.NET, testabilité, frontières de modules                                   |
| `03_code_smells.md`                 | DIRECT        | lecture de legacy, priorisation de la dette                                                 |
| `07_do_not_touch_before_explain.md` | NOYAU DURABLE | la règle la plus professionnelle du module : ne réécris pas ce que tu ne peux pas expliquer |
| `12_EXO_CHASSE_AU_CODE_MORT.md`     | DIRECT        | tree-shaking, analyse statique, suppression de feature flags morts                          |

**Exemple réel.** Une fonction de 400 lignes que personne ne touche depuis deux ans. Le réflexe junior : réécrire. Le réflexe professionnel : (1) l'entourer de tests caractérisant le comportement **actuel**, y compris ses bizarreries ; (2) extraire par petits pas ; (3) vérifier à chaque étape. Sans l'étape 1, tu ne refactores pas, tu réécris à l'aveugle : et tu supprimes des correctifs de bugs que personne n'a documentés.

---

### Module 14 : `14_typescript/`

Voir [4.5](./01-niveau-1-socle.md#45--typescript-en-conditions-r%C3%A9elles). Transferts saillants :

| Concept TS              | Où il réapparaît hors TS                                        |
| ----------------------- | --------------------------------------------------------------- |
| Génériques              | Java, C#, Kotlin, Rust : même idée, effacement de type en Java  |
| Unions discriminées     | `sealed interface` Java, pattern matching C#, `Union` Python    |
| Types utilitaires       | rarement transférables tels quels : **SPÉCIFIQUE JS**           |
| Gardes de type          | validation runtime : Pydantic, Bean Validation, DataAnnotations |
| Fichiers de déclaration | interopérabilité avec du code non typé : problème universel     |
| `strict`                | analyse statique, nullabilité C#, `Optional` Java               |

**Ce qu'il ne faut pas mémoriser.** Les types conditionnels acrobatiques. Si un type demande plus de temps à comprendre que le code qu'il protège, c'est un smell.

---

### Module 15 : `15_runtime_env/`

| Fichier                  | Verdict | Où ça réapparaît                                                                         |
| ------------------------ | ------- | ---------------------------------------------------------------------------------------- |
| `01_node_vs_browser.md`  | DIRECT  | frontière serveur/client Next.js, code isomorphe, SSR                                    |
| `02_streams_buffers.md`  | DIRECT  | upload/download de fichiers, réponses en streaming, streaming de réponses IA, pipes Unix |
| `03_commonjs_vs_esm.md`  | DIRECT  | erreurs de build, `ERR_REQUIRE_ESM`, config de bundler, publication de paquets           |
| `04_process_env_argv.md` | DIRECT  | configuration par environnement, Docker, CI, 12-factor                                   |
| `05_worker_threads.md`   | DIRECT  | déporter le CPU hors de l'event loop ; conceptuellement proche des threads Java/.NET     |
| `06_node_cli_scripts/`   | DIRECT  | outillage interne, scripts de migration, automatisation : très valorisé en équipe        |

**Exemple réel.** Un service ajoute une bibliothèque publiée uniquement en ESM. Le build casse avec `ERR_REQUIRE_ESM`. Trois heures perdues à changer des options au hasard. La vraie compréhension tient en une phrase : _CommonJS est résolu de façon synchrone, ESM de façon asynchrone ; on ne peut pas `require` un module ESM._ Ce paragraphe de `03_commonjs_vs_esm.md` vaut trois heures, une fois par trimestre, toute ta carrière.

---

### Module 16 : `16_architecture_patterns/`

##### Fichier MyFunnyJS

`16_architecture_patterns/04_clean_architecture.md`

##### Concept appris

Le domaine ne dépend de rien. L'infrastructure dépend du domaine. Une base de données, un framework HTTP, un fournisseur d'e-mail sont des détails branchés en périphérie, pas le centre de l'application.

##### Technologies concernées

| Technologie            | Où le concept réapparaît                                       | Pourquoi c'est utile                                                                                            |
| ---------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **NestJS**             | modules, providers, tokens d'injection                         | la DI n'a d'intérêt que si tu injectes une **interface** ; sinon tu as juste déplacé le `new`                    |
| **Prisma / Drizzle**   | repository qui encapsule l'ORM                                 | c'est la seule façon de changer d'ORM sans réécrire les règles métier                                            |
| **Spring Boot**        | `@Service` / `@Repository`, ports et adaptateurs               | vocabulaire différent, découpage identique                                                                       |
| **Next.js**            | server actions qui appellent un cas d'usage, pas l'inverse     | sans cette frontière, la logique métier finit collée à une convention de framework qui changera de version majeure |
| **Tests**              | tester le domaine sans base ni serveur                         | un test de domaine qui démarre Docker t'apprend que la frontière n'existe pas                                     |

##### Ce que l'apprenant doit reconnaître

Un import d'ORM dans une fonction de règle métier. Un objet de requête HTTP qui descend jusqu'au calcul. Un `import` du framework dans le dossier `domain/`. Ce sont les trois symptômes d'une frontière qui n'existe que sur le schéma.

##### Exemple réel

Une équipe veut passer de MongoDB à PostgreSQL. Le code métier importe directement le driver Mongo dans 47 fichiers, et manipule des `ObjectId` partout, y compris dans le calcul des droits. La migration, estimée à trois semaines, en prend sept mois : elle n'est pas une migration de base, c'est une réécriture. La même application avec un repository par agrégat aurait changé quatre fichiers.

##### Piège de transfert

La Clean Architecture appliquée intégralement à un service de 800 lignes coûte plus qu'elle ne rapporte : quatre couches et six interfaces pour trois endpoints, c'est du sur-design (`13_refactoring/03_code_smells.md`). Le compromis réel : commence par isoler **le calcul métier**, rien d'autre. Le reste s'ajoute quand la douleur arrive.

##### Pont vers d'autres fichiers MyFunnyJS

`12_design_patterns/02_structural/` (Adapter), `13_refactoring/02_solid_principles.md`, `27_team_craft/02_adr_writing.md` (une frontière non écrite disparaît au troisième sprint).

---

#### Le reste du module 16

| Fichier                        | Verdict         | Où ça réapparaît concrètement                                                                       |
| ------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------- |
| `00_prereq_check.md`           | PRÉREQUIS       | à passer avant d'ouvrir la fiche NestJS ([6.2](./03-niveau-3-backend.md#62--nestjs)) : sans SOLID, la DI reste de la magie |
| `00_why_architecture_patterns.md` | CONSULTABLE  | à relire le jour où une équipe te demande "pourquoi cette couche ?"                                    |
| `01_module_pattern.md`         | SPÉCIFIQUE JS   | frontières de paquets, `exports` d'un `package.json`, API publique d'une bibliothèque interne          |
| `02_solid_principles.md`       | NOYAU DURABLE   | DI NestJS, Spring, .NET ; testabilité ; découpage de modules                                           |
| `03_mvc_pattern.md`            | DIRECT          | Express/Nest (controller-service), Rails, Django, Spring MVC : le découpage le plus répandu au monde   |
| `04_clean_architecture.md`     | NOYAU DURABLE   | traité ci-dessus                                                                                       |
| `05_event_driven.md`           | DIRECT          | files de messages ([6.5](./03-niveau-3-backend.md#65--files-de-messages-et-workers)), webhooks, pub/sub Redis, event sourcing |
| `06_microservices_intro.md`    | CONTEXTUELLE    | à lire surtout pour savoir **quand refuser** de découper ; le monolithe modulaire gagne plus souvent qu'on ne l'admet |
| `07_architecture_grimoire.md`  | CONSULTABLE     | fiche de révision avant un entretien d'architecture                                                    |
| `08_EXO_LECTURE.md`            | DIRECT          | lire une architecture qu'on n'a pas écrite : c'est le jour 1 de toute mission                          |
| `09_EXO_JEUNE_IA.md`           | DIRECT          | l'IA propose des couches par défaut, sans connaître ta taille d'équipe : savoir refuser une structure  |
| `98_PORTAGE_MENTAL.md`         | NOYAU DURABLE   | le fichier qui prépare exactement le niveau 5 ([8](./05-niveau-5-transfert.md))                        |

---

### Module 17 : `17_web_concepts/`

##### Fichier MyFunnyJS

`17_web_concepts/04_caching_strategies.md`

##### Concept appris

Un cache est un pari : je sers une donnée possiblement périmée en échange de latence et de charge. Tout le sujet tient dans la durée du pari et dans la façon de l'annuler.

##### Technologies concernées

| Technologie      | Où le concept réapparaît                                     | Pourquoi c'est utile                                                                                       |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **HTTP / CDN**   | `Cache-Control`, `ETag`, `stale-while-revalidate`            | la couche de cache la moins chère du monde, et celle que les juniors ignorent le plus                        |
| **Next.js**      | cache de requête, de route, de client                        | les "données périmées" de Next ne sont pas un bug du framework : ce sont ces stratégies, empilées à trois niveaux |
| **Redis**        | cache applicatif, TTL, éviction                              | voir [6.4](./03-niveau-3-backend.md#64--redis) ; un cache sans politique d'éviction est une fuite mémoire nommée |
| **TanStack Query** | fraîcheur, revalidation, requêtes en vol                   | l'état serveur **est** un cache : le réimplémenter avec `useEffect` reproduit les cinq mêmes bugs             |
| **PostgreSQL**   | cache de plans, buffers                                      | même principe un étage plus bas                                                                              |

##### Ce que l'apprenant doit reconnaître

Un cache sans TTL. Un TTL identique pour dix mille clés créées à la même seconde (elles expireront à la même seconde). Une invalidation manuelle éparpillée dans quinze fichiers. Un cache posé pour masquer une requête lente qu'on n'a jamais mesurée.

##### Exemple réel

Une page d'accueil met en cache son bloc de statistiques pendant 300 secondes. Un déploiement vide le cache. À la réouverture, 4 000 requêtes simultanées trouvent le cache vide et partent toutes en base sur la même requête d'agrégation à 900 ms. La base sature, les timeouts commencent, les clients réessaient, la charge double. Le correctif tient en trois mots : jitter sur le TTL, verrou de recalcul, service de la valeur périmée pendant le recalcul.

##### Piège de transfert

Le vocabulaire change entre HTTP, Redis, l'ORM et le framework, mais les questions sont toujours les mêmes quatre : qui écrit dans le cache, qui l'invalide, que se passe-t-il quand il est vide, que se passe-t-il quand il ment.

##### Pont vers d'autres fichiers MyFunnyJS

`08_memory_performance/03_complexity/`, `24_databases/04_redis_caching.md`, `25_scalability/06_rate_limiting.md`.

---

#### Le reste du module 17

| Fichier                            | Verdict       | Où ça réapparaît concrètement                                                                     |
| ---------------------------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| `00_prereq_check.md`               | PRÉREQUIS     | à passer avant le niveau 2 et le niveau 3 : tout le reste suppose HTTP acquis                        |
| `00_why_web_concepts.md`           | CONSULTABLE   | remet en contexte : le web est un protocole avant d'être un framework                                |
| `01_http_rest_basics.md`           | NOYAU DURABLE | voir [4.6](./01-niveau-1-socle.md#46--http-et-rest) ; codes de statut, idempotence, en-têtes         |
| `02_browser_render_pipeline.md`    | DIRECT        | Core Web Vitals, CLS, hydratation, chargement des polices et des images                              |
| `03_state_and_dataflow.md`         | NOYAU DURABLE | React, séparation état client / état serveur, l'URL comme état partageable                           |
| `04_caching_strategies.md`         | NOYAU DURABLE | traité ci-dessus                                                                                     |
| `05_auth_authz.md`                 | NOYAU DURABLE | voir [6.3](./03-niveau-3-backend.md#63--validation-authentification-autorisation)                    |
| `06_serialization.md`              | DIRECT        | JSON, dates et fuseaux, précision numérique, Protobuf, contrats d'API versionnés                     |
| `07_seo_and_rendering.md`          | DIRECT        | Next.js ([5.4](./02-niveau-2-frontend.md#54--nextjs)), SSR/SSG, métadonnées, données structurées     |
| `08_web_concepts_grimoire.md`      | CONSULTABLE   | révision rapide avant un entretien technique généraliste                                             |
| `09_EXO_LECTURE.md`                | DIRECT        | lire une spécification HTTP existante plutôt que deviner un comportement                             |
| `10_EXO_JEUNE_IA.md`               | DIRECT        | l'IA invente des en-têtes et des codes de statut plausibles : les vérifier contre la RFC             |
| `11_web_concepts_drill_exec.md`    | DIRECT        | exécution sous contrainte : c'est le format d'un test technique chronométré                          |
| `98_PORTAGE_MENTAL.md`             | NOYAU DURABLE | HTTP est identique en Python, Java et .NET : c'est le transfert le moins coûteux du curriculum       |

---

### Module 18 : `18_oop_js/`

##### Fichier MyFunnyJS

`18_oop_js/09_composition_vs_inheritance.md`

##### Concept appris

L'héritage lie une classe à toute la lignée de ses parents. La composition assemble des comportements indépendants. Le choix se fait sur ce qui va changer, pas sur ce qui se ressemble aujourd'hui.

##### Technologies concernées

| Technologie      | Où le concept réapparaît                                        | Pourquoi c'est utile                                                                        |
| ---------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **React**        | composants composés, hooks personnalisés, pas d'héritage         | React a tranché le débat en supprimant l'option : la composition est la seule voie              |
| **NestJS**       | providers injectés plutôt que classes de base héritées           | une `BaseService` héritée par 30 services est un point de couplage global                       |
| **Java / C#**    | interfaces + délégation, `sealed`, composition sur héritage      | le débat est identique, avec un compilateur qui rend l'héritage plus tentant                    |
| **TypeScript**   | types union et intersection, `implements` sans `extends`         | tu peux composer des contrats sans lier les implémentations                                     |
| **Go / Rust**    | pas d'héritage du tout, embedding et traits                      | deux langages majeurs ont supprimé la fonctionnalité : ce n'est pas un hasard                   |

##### Ce que l'apprenant doit reconnaître

Une hiérarchie de plus de deux niveaux. Une classe de base qui grossit à chaque nouveau besoin d'un enfant. Une méthode surchargée qui appelle `super` puis annule la moitié de son effet. Un `instanceof` qui pilote la logique métier.

##### Exemple réel

Un service d'export part d'une `BaseExporter` avec `prepare()`, `format()`, `send()`. Trois exports plus tard, le CSV n'a pas besoin de `send`, le PDF a besoin de deux `format`, et le JSON s'envoie par webhook. La classe de base contient désormais quatre drapeaux booléens pour désactiver ses propres étapes. C'est le moment où la hiérarchie a cessé de décrire le domaine pour décrire son propre historique.

##### Piège de transfert

En JavaScript, une classe est du sucre au-dessus des prototypes ; en Java, c'est une structure du langage vérifiée à la compilation. Un développeur venu de Java écrit spontanément des hiérarchies profondes en JS, où elles sont encore plus coûteuses puisque rien ne les vérifie.

##### Pont vers d'autres fichiers MyFunnyJS

`12_design_patterns/02_structural/`, `16_architecture_patterns/02_solid_principles.md`, `11_functional_js/` (l'autre réponse au même problème).

---

#### Le reste du module 18

| Fichier                              | Verdict       | Où ça réapparaît concrètement                                                                    |
| ------------------------------------ | ------------- | ---------------------------------------------------------------------------------------------------|
| `00_prereq_check.md`                 | PRÉREQUIS     | à passer avant toute lecture de bibliothèque tierce non minifiée                                    |
| `00_why_oop_js.md`                   | CONSULTABLE   | pourquoi l'objet existe en JS alors que le langage est fonctionnel par tempérament                  |
| `01_prototype_chain_raw.md`          | SPÉCIFIQUE JS | debug de bibliothèques, pollution de prototype (`22_security/03`), `Object.create(null)`            |
| `02_constructor_functions.md`        | CONSULTABLE   | lecture de code ancien : jQuery, bibliothèques pré-2015, transpilé ES5                              |
| `03_class_syntax_sugar.md`           | DIRECT        | NestJS, TypeORM, décorateurs : tout l'écosystème backend TS est à base de classes                   |
| `04_this_keyword_rules.md`           | SPÉCIFIQUE JS | méthodes passées en callback qui perdent leur contexte ; disparaît presque avec les fonctions fléchées |
| `05_call_apply_bind.md`              | SPÉCIFIQUE JS | monkey-patching, wrappers de logs, instrumentation manuelle d'une bibliothèque tierce               |
| `06_inheritance_extends_super.md`    | DIRECT        | erreurs personnalisées (`extends Error`), classes de framework, exception filters NestJS            |
| `07_encapsulation_privacy.md`        | DIRECT        | frontières de modules, champs `#privés`, API publique d'un paquet publié                            |
| `08_static_getters_setters.md`       | INDIRECT      | factories statiques, propriétés calculées ; un getter coûteux masque une requête derrière un point  |
| `09_composition_vs_inheritance.md`   | NOYAU DURABLE | traité ci-dessus                                                                                    |
| `10_oop_js_grimoire.md`              | CONSULTABLE   | révision avant entretien orienté objet                                                              |
| `11_expliquer_a_3_publics_prototypes.md` | DIRECT    | expliquer un mécanisme à trois niveaux d'audience : évalué en entretien et en revue                 |
| `12_EXO_LECTURE.md`                  | DIRECT        | lire du code objet écrit par quelqu'un d'autre sans le réécrire                                     |
| `13_EXO_JEUNE_IA.md`                 | DIRECT        | l'IA génère volontiers des hiérarchies inutiles : savoir les refuser avec un argument               |
| `98_PORTAGE_MENTAL.md`               | NOYAU DURABLE | prépare Java, C# et Python : ce sont les mêmes questions, avec d'autres garde-fous                  |

---

### Module 19 : `19_web_inclusive/`

##### Fichier MyFunnyJS

`19_web_inclusive/08_i18n/02_dates_timezones.md`

##### Concept appris

Un instant et sa représentation sont deux choses différentes. Stocker en UTC, convertir à l'affichage, ne jamais faire l'inverse.

##### Technologies concernées

| Technologie          | Où le concept réapparaît                                    | Pourquoi c'est utile                                                                            |
| -------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| **PostgreSQL**       | `timestamptz` contre `timestamp`                            | la colonne sans fuseau est le bug le plus cher et le plus silencieux de toute la base           |
| **API REST**         | ISO 8601 dans les contrats                                  | une date sans fuseau dans un JSON, c'est deux services qui se croient d'accord                  |
| **React / Next**     | rendu serveur puis client sur deux fuseaux différents       | erreur d'hydratation : le serveur affiche une date, le navigateur en affiche une autre          |
| **CI / conteneurs**  | image en UTC, poste développeur en Europe/Paris             | le test passe en local et échoue en CI, ou l'inverse, sans qu'une ligne ait changé              |
| **Exports / rapports** | agrégation "par jour" selon quel fuseau ?                  | un chiffre d'affaires journalier n'existe pas tant que le fuseau de découpage n'est pas décidé  |

##### Ce que l'apprenant doit reconnaître

Une date stockée en `string`. Un `new Date("2026-03-29")` interprété différemment selon l'environnement. Un test qui échoue deux fois par an, aux changements d'heure. Une comparaison de dates qui ignore l'heure.

##### Exemple réel

Un rapport quotidien agrège "les mesures du jour" avec un `WHERE date >= today()`. Le serveur est en UTC, l'entreprise en Europe/Paris. Chaque jour, les mesures entre 00 h 00 et 02 h 00 locales tombent dans le rapport de la veille. Personne ne le voit pendant onze mois, jusqu'à un audit comptable qui trouve un écart constant de 2 h de trafic. Le correctif est une ligne ; la conversation avec le client dure trois semaines.

##### Piège de transfert

Java a `Instant`/`ZonedDateTime`, .NET a `DateTimeOffset`, Python a des datetimes *aware* et *naive*. Trois écosystèmes, une seule règle : le type qui ne porte pas de fuseau ne doit jamais franchir une frontière.

##### Pont vers d'autres fichiers MyFunnyJS

`17_web_concepts/06_serialization.md`, `28_edge_cases/`, `24_databases/03_data_modeling.md`.

---

#### Le reste du module 19

| Fichier                          | Verdict       | Où ça réapparaît concrètement                                                                    |
| -------------------------------- | ------------- | ----------------------------------------------------------------------------------------------- |
| `00_prereq_check.md`             | PRÉREQUIS     | à passer avant [5.3](./02-niveau-2-frontend.md#53--routing-formulaires-accessibilité)             |
| `00_why_web_inclusive.md`        | CONSULTABLE   | le cadrage : l'accessibilité est une contrainte légale avant d'être une bonne pratique            |
| `01_a11y_why_it_matters.md`      | DIRECT        | secteur public européen, marchés soumis à l'EAA : critère d'exclusion d'un appel d'offres         |
| `02_aria_basics.md`              | DIRECT        | React, bibliothèques de composants : ARIA corrige, le HTML sémantique évite                       |
| `03_keyboard_navigation.md`      | NOYAU DURABLE | modales, menus, tableaux : la gestion du focus est le point le plus souvent raté                  |
| `04_contrast_and_colors.md`      | DIRECT        | design systems, thèmes sombres, tokens de couleur, Lighthouse                                     |
| `05_screen_readers.md`           | DIRECT        | tests manuels avec NVDA/VoiceOver ; aucun outil automatique ne les remplace                       |
| `06_a11y_audit.md`               | DIRECT        | axe, Lighthouse, pa11y en CI : un audit produit un rapport, pas une opinion                       |
| `07_a11y_grimoire.md`            | CONSULTABLE   | check-list de revue de PR frontend                                                                |
| `08_i18n/00_prereq_check.md`     | PRÉREQUIS     | à passer avant toute fonctionnalité multilingue                                                   |
| `08_i18n/00_why_i18n.md`         | CONSULTABLE   | pourquoi traduire n'est pas remplacer des chaînes                                                 |
| `08_i18n/01_i18n_basics.md`      | DIRECT        | i18next, `next-intl`, gettext, fichiers de ressources .NET : même modèle de clés et d'espaces     |
| `08_i18n/02_dates_timezones.md`  | NOYAU DURABLE | traité ci-dessus                                                                                  |
| `08_i18n/03_number_formats.md`   | DIRECT        | `Intl.NumberFormat`, séparateurs décimaux, devises, export CSV français en `;`                    |
| `08_i18n/04_pluralization.md`    | DIRECT        | ICU MessageFormat : certaines langues ont six formes plurielles, pas deux                         |
| `08_i18n/05_i18n_in_project.md`  | DIRECT        | découpage des bundles de traduction, chargement paresseux par locale                              |
| `08_i18n/06_i18n_grimoire.md`    | CONSULTABLE   | à ressortir au premier ticket "on ouvre un marché à l'étranger"                                   |
| `08_i18n/07_i18n_drill_exec.md`  | DIRECT        | exercice chronométré : le format des tests techniques                                             |
| `09_EXO_LECTURE.md`              | DIRECT        | lire un rapport d'audit d'accessibilité et le prioriser                                           |
| `10_EXO_JEUNE_IA.md`             | DIRECT        | l'IA ajoute des attributs ARIA en excès, souvent contre-productifs : savoir en retirer            |
| `98_PORTAGE_MENTAL.md`           | DIRECT        | l'accessibilité est une propriété du HTML rendu, donc identique quel que soit le framework        |

---

### Module 20 : `20_realtime/`

##### Fichier MyFunnyJS

`20_realtime/01_websockets/01_ws_basics.md`, `02_sse/01_sse_basics.md`

##### Concept appris

Qui parle, dans quel sens, et qui garde l'état de la connexion. Le choix WebSocket / SSE / polling est une décision de topologie, pas une préférence.

##### Technologies concernées

| Technologie        | Où le concept réapparaît                                       | Pourquoi c'est utile                                                                        |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **WebSocket**      | chat, collaboration, jeux, tableaux de bord bidirectionnels      | voir [6.6](./03-niveau-3-backend.md#66--temps-réel--websocket-et-sse)                        |
| **SSE**            | notifications, flux de progression, streaming de réponses IA     | unidirectionnel, sur HTTP simple, reconnexion automatique offerte : sous-utilisé              |
| **Redis pub/sub**  | diffusion entre plusieurs instances de serveur                   | dès la deuxième instance, la mémoire locale ne suffit plus                                   |
| **Load balancer**  | sessions collantes, arrêt gracieux                               | un déploiement coupe **toutes** les connexions ouvertes : la reconnexion est ton problème     |
| **WebRTC**         | visio, pair-à-pair, partage d'écran                              | CONTEXTUELLE : lourde, spécialisée, rarement le bon premier outil                            |

##### Ce que l'apprenant doit reconnaître

Une connexion sans stratégie de reconnexion. Un état conservé en mémoire de process alors que le service tourne en trois exemplaires. Un `emit` vers tous les clients pour un message qui concerne une seule personne. Aucune limite sur le débit de messages entrants.

##### Exemple réel

Un tableau de bord diffuse chaque événement à tous les clients connectés. En démonstration, quatre navigateurs, tout va bien. En production, 900 clients et 200 événements par minute : 180 000 messages par minute, la boucle d'événements du serveur ne redescend plus, et le service tombe en cascade. La correction n'est pas de changer de bibliothèque, c'est de regrouper les événements par fenêtre de temps et de n'envoyer qu'aux abonnés concernés.

##### Piège de transfert

En Java et .NET, une connexion persistante peut occuper un thread ; en Node, elle occupe un descripteur de fichier et un peu de mémoire. Les limites ne sont pas au même endroit, et la conclusion de dimensionnement change complètement.

##### Pont vers d'autres fichiers MyFunnyJS

`03_async/06_backpressure.md`, `15_runtime_env/02_streams_buffers.md`, `25_scalability/04_load_balancing.md`.

---

#### Le reste du module 20

| Fichier                            | Verdict      | Où ça réapparaît concrètement                                                              |
| ---------------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| `00_prereq_check.md`               | PRÉREQUIS    | asynchrone et event loop acquis, sinon le temps réel est incompréhensible                     |
| `00_why_realtime.md`               | CONSULTABLE  | le rappel utile : la plupart des besoins « temps réel » sont satisfaits par du polling à 5 s  |
| `01_websockets/01_ws_basics.md`    | DIRECT       | traité ci-dessus                                                                              |
| `01_websockets/02_ws_chat_room.md` | DIRECT       | notion de salon = routage de messages ; identique en Socket.IO, Phoenix Channels, SignalR     |
| `02_sse/01_sse_basics.md`          | DIRECT       | streaming de réponses de modèles IA : c'est exactement ce protocole                           |
| `02_sse/02_sse_live_feed.md`       | DIRECT       | flux de progression d'un job long, sans WebSocket ni infrastructure supplémentaire            |
| `03_webrtc/01_webrtc_concepts.md`  | CONTEXTUELLE | visio, pair-à-pair ; STUN/TURN, NAT : un domaine à part entière                               |
| `03_webrtc/02_webrtc_demo.md`      | CONTEXTUELLE | utile pour comprendre ce que tu achètes quand tu prends un service tiers de visio             |
| `04_realtime_grimoire.md`          | CONSULTABLE  | grille de choix WebSocket / SSE / polling à ressortir en réunion de conception                |
| `05_EXO_LECTURE.md`                | DIRECT       | lire une implémentation temps réel existante avant de proposer de la remplacer                |
| `06_EXO_JEUNE_IA.md`               | DIRECT       | l'IA propose WebSocket par défaut, même pour une barre de progression                         |
| `98_PORTAGE_MENTAL.md`             | DIRECT       | SignalR, Phoenix, Spring WebFlux : mêmes primitives, autres noms                              |

---

### Module 21 : `21_api_craft/`

##### Fichier MyFunnyJS

`21_api_craft/03_error_handling_api.md`, `06_api_versioning.md`

##### Concept appris

Une API est un contrat public. Ses erreurs font partie du contrat, et sa version aussi.

##### Technologies concernées

| Technologie        | Où le concept réapparaît                                      | Pourquoi c'est utile                                                                       |
| ------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Express**        | middleware d'erreur, handlers async à envelopper                | une promesse rejetée hors chaîne ne rejoint jamais le middleware d'erreur                     |
| **NestJS**         | exception filters, DTO, pipes de validation                     | l'erreur devient une réponse structurée au lieu d'une trace en clair                          |
| **OpenAPI**        | schéma généré, client généré, tests de contrat                  | le seul document que ni toi ni l'IA ne pouvez inventer, parce qu'il est vérifiable            |
| **FastAPI / Spring** | Pydantic, Bean Validation, `@ControllerAdvice`                | même triptyque : valider, transformer, formater l'erreur                                      |
| **Clients mobiles** | versions déployées que tu ne contrôles pas                      | c'est ce qui rend le versioning non négociable : tu ne peux pas mettre à jour l'appelant       |

##### Ce que l'apprenant doit reconnaître

Un `500` renvoyé pour une entrée invalide. Un message d'erreur qui expose une requête SQL. Une erreur métier sans code stable, seulement une phrase en français que le client parse. Un champ retiré d'une réponse sans version ni préavis.

##### Exemple réel

Une API renvoie `{ "error": "Utilisateur introuvable" }` avec un statut 200. Trois consommateurs différents finissent par tester `if (res.error)`, chacun à sa manière, l'un avec `includes("introuvable")`. Le jour où la phrase est corrigée en "Compte introuvable", deux intégrations cassent en silence. Un code stable `USER_NOT_FOUND` et un statut 404 auraient rendu la faute impossible.

##### Piège de transfert

Chaque écosystème a son format d'erreur par défaut, et aucun n'est bon par défaut. RFC 9457 (`application/problem+json`) est le seul terrain neutre : le choisir tôt évite trois refontes.

##### Pont vers d'autres fichiers MyFunnyJS

`05_error_handling/02_custom_errors.md`, `17_web_concepts/01_http_rest_basics.md`, `27_team_craft/02_adr_writing.md`.

---

#### Le reste du module 21

| Fichier                      | Verdict      | Où ça réapparaît concrètement                                                                |
| ---------------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| `00_prereq_check.md`         | PRÉREQUIS    | HTTP et asynchrone acquis avant d'écrire un endpoint                                            |
| `00_why_api_craft.md`        | CONSULTABLE  | une API mal découpée coûte plus cher qu'un mauvais framework                                    |
| `01_express_from_scratch.md` | DIRECT       | voir [6.1](./03-niveau-3-backend.md#61--express-et-les-micro-frameworks) ; base de Fastify, Hono, Koa |
| `02_rest_crud_complete.md`   | DIRECT       | pagination, filtrage, tri : trois sujets sous-estimés qui reviennent dans chaque projet         |
| `03_error_handling_api.md`   | NOYAU DURABLE | traité ci-dessus                                                                               |
| `04_auth_jwt.md`             | DIRECT       | voir [6.3](./03-niveau-3-backend.md#63--validation-authentification-autorisation) ; expiration, rotation, révocation |
| `05_graphql_basics.md`       | CONTEXTUELLE | voir [6.7](./03-niveau-3-backend.md#67--graphql) ; justifié par des clients hétérogènes, pas par confort |
| `06_api_versioning.md`       | NOYAU DURABLE | traité ci-dessus                                                                               |
| `07_openapi_swagger.md`      | DIRECT       | génération de clients, tests de contrat, documentation qui ne ment pas                          |
| `08_api_grimoire.md`         | CONSULTABLE  | check-list de conception avant d'ouvrir un éditeur                                              |
| `09_EXO_LECTURE.md`          | DIRECT       | lire une API tierce et repérer ce que la doc ne dit pas                                         |
| `10_EXO_JEUNE_IA.md`         | DIRECT       | l'IA génère des endpoints plausibles pour des services qui n'existent pas                       |
| `98_PORTAGE_MENTAL.md`       | NOYAU DURABLE | FastAPI, Spring, ASP.NET : les mêmes quatre décisions, dans un autre ordre                      |

---

### Module 22 : `22_security/`

##### Fichier MyFunnyJS

`22_security/09_supply_chain_sbom.md`, `10_audit_your_supply_chain.md`

##### Concept appris

Ton code n'est pas ta surface d'attaque. Tes dépendances, et les dépendances de tes dépendances, le sont.

##### Technologies concernées

| Technologie          | Où le concept réapparaît                                    | Pourquoi c'est utile                                                                       |
| -------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------|
| **npm / pnpm**       | `lockfile`, `audit`, `overrides`, scripts post-installation   | un `postinstall` s'exécute sur ton poste avec tes droits, avant toute revue                   |
| **CI**               | scan de dépendances bloquant, SBOM généré à chaque build      | c'est le seul endroit où la vérification ne dépend pas de la discipline de quelqu'un          |
| **Docker**           | image de base, CVE héritées, taille et surface                | la moitié des vulnérabilités d'une image viennent de paquets système que tu n'utilises pas    |
| **Maven / NuGet / pip** | même problème, autres formats de verrou                    | un développeur qui sait auditer en npm sait auditer partout                                   |
| **Réglementation**   | CRA européen, exigence de SBOM chez les grands comptes        | ce n'est plus une bonne pratique, c'est une case dans un appel d'offres                       |

##### Ce que l'apprenant doit reconnaître

Un lockfile absent ou non commité. Une dépendance à un seul mainteneur pour trois lignes de code. Une mise à jour majeure faite en même temps qu'une correction de bug. Un scan CI en avertissement au lieu d'être bloquant : un avertissement que personne ne lit n'existe pas.

##### Exemple réel

Une petite bibliothèque de formatage, 40 lignes, présente en dépendance transitive de quatre paquets. Le mainteneur transfère le dépôt à un inconnu. La version suivante ajoute un `postinstall` qui lit les variables d'environnement. Le build CI exécute ce script avec les jetons de déploiement dans son environnement. Personne n'a jamais lu ce paquet : personne ne savait qu'il était installé.

##### Piège de transfert

Chaque écosystème a un mécanisme d'exécution à l'installation ou au build (scripts npm, plugins Maven, `setup.py`). L'existence du risque est universelle ; sa forme change.

##### Pont vers d'autres fichiers MyFunnyJS

`00_getting_started/04_package_managers.md`, `00_getting_started/05_devsec_perso.md`, `29_ai_agents_and_autonomy/05_agent_sandbox_hygiene.md`.

---

#### Le reste du module 22

| Fichier                                        | Verdict       | Où ça réapparaît concrètement                                                             |
| ---------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------- |
| `00_prereq_check.md`                           | PRÉREQUIS     | à passer avant d'exposer quoi que ce soit sur un réseau                                       |
| `00_why_security.md`                           | CONSULTABLE   | la sécurité est une propriété du système, pas une étape de fin de projet                      |
| `01_xss_injection.md`                          | NOYAU DURABLE | React (`dangerouslySetInnerHTML`), requêtes SQL paramétrées, templates serveur                |
| `02_csrf_cors.md`                              | DIRECT        | cookies `SameSite`, configuration CORS d'API, erreurs navigateur mal comprises                |
| `03_prototype_pollution.md`                    | SPÉCIFIQUE JS | fusion d'objets, parsing de query string, bibliothèques vulnérables                           |
| `04_auth_flows.md`                             | NOYAU DURABLE | OAuth/OIDC, sessions contre jetons, rotation et révocation                                    |
| `05_hashing_bcrypt.md`                         | DIRECT        | bcrypt/argon2, coût de calcul, sel ; identique en Python, Java, .NET                          |
| `06_owasp_checklist.md`                        | CONSULTABLE   | grille de revue avant mise en production                                                      |
| `07_security_grimoire.md`                      | CONSULTABLE   | révision rapide avant un entretien où la sécurité sera sondée                                 |
| `08_privacy_and_aiact.md`                      | DIRECT        | RGPD, données personnelles dans les logs, rétention, envoi de données à un fournisseur d'IA   |
| `09_supply_chain_sbom.md`                      | NOYAU DURABLE | traité ci-dessus                                                                              |
| `10_audit_your_supply_chain.md`                | DIRECT        | exercice applicable tel quel sur un dépôt réel, aujourd'hui                                   |
| `11_EXO_LECTURE.md`                            | DIRECT        | lire un rapport de vulnérabilité et décider s'il te concerne vraiment                         |
| `12_EXO_JEUNE_IA.md`                           | DIRECT        | l'IA propose du code d'authentification plausible et incomplet : la révocation manque souvent |
| `98_EXO_IA_MENTEUSE.md`                        | DIRECT        | une réponse IA affirmative et fausse sur un sujet de sécurité : le pire cas réel              |
| `98_PORTAGE_MENTAL.md`                         | NOYAU DURABLE | OWASP est indépendant du langage : c'est le transfert le plus rentable du module              |
| `99_PONT_avant_module_23_ai_native_dev.md`     | PRÉREQUIS     | à lire avant le niveau 6 ([9](./06-niveau-6-ia.md)) : la sécurité conditionne l'usage de l'IA |

---

### Module 23 : `23_ai_native_dev/`

##### Fichier MyFunnyJS

`23_ai_native_dev/03_validate_ai_output.md`

##### Concept appris

Le code généré est une proposition, pas un livrable. La vérification est un protocole, pas une impression.

##### Technologies concernées

| Technologie             | Où le concept réapparaît                                  | Pourquoi c'est utile                                                                     |
| ----------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Assistants de code**  | complétion, refactoring suggéré, génération de tests        | voir [9.4](./06-niveau-6-ia.md#94--le-protocole-de-vérification-en-5-gestes)                |
| **Revue de code**       | une PR générée se relit différemment d'une PR écrite        | le code IA est syntaxiquement propre et sémantiquement optimiste : les erreurs sont ailleurs |
| **CI**                  | tests, lint, typage, scan : les seuls juges non complaisants | déplacer la vérification hors de la conversation est la seule protection qui tient à l'échelle |
| **Gestionnaires de paquets** | dépendances inventées, versions inexistantes            | l'hallucination de paquet est devenue un vecteur d'attaque (typosquatting ciblé)             |

##### Ce que l'apprenant doit reconnaître

Un code qui traite le cas nominal et aucun chemin d'erreur. Une API appelée avec la signature d'une version majeure antérieure. Un test qui vérifie l'implémentation au lieu du comportement. Une explication assurée sur un point que le modèle ne peut pas connaître (ta base, ton infrastructure, ta charge).

##### Exemple réel

Une fonction d'import générée en dix secondes : lecture du fichier, parsing, insertion en base. Elle passe la revue, elle passe les tests écrits par le même modèle. En production, un fichier de 400 Mo la fait tomber par dépassement mémoire, parce qu'elle charge tout d'un coup. Personne n'a posé la question du volume : le modèle non plus, et il ne la posera jamais si tu ne la poses pas.

##### Piège de transfert

Plus l'écosystème est niche, plus le taux d'invention monte. Sur React, le modèle a vu des millions d'exemples ; sur ton framework interne, il improvise avec le même aplomb.

##### Pont vers d'autres fichiers MyFunnyJS

`06_testing/`, `29_ai_agents_and_autonomy/02_verifiable_specifications.md`, `04_debugging/05_hypothesis_driven_debug.md`.

---

#### Le reste du module 23

| Fichier                            | Verdict       | Où ça réapparaît concrètement                                                                  |
| ---------------------------------- | ------------- | ------------------------------------------------------------------------------------------------ |
| `00_prereq_check.md`               | PRÉREQUIS     | tu ne peux vérifier que ce que tu sais lire : debugging et tests d'abord                          |
| `00_why_ai_native_dev.md`          | CONSULTABLE   | pourquoi ce module existe et pourquoi il vieillira plus vite que les autres                       |
| `01_ai_workflow.md`                | DIRECT        | intégrer l'IA dans un cycle de travail réel sans dissoudre la responsabilité                      |
| `02_prompt_engineering.md`         | PÉRISSABLE    | les formulations changent avec les modèles ; ce qui reste, c'est de savoir spécifier              |
| `03_validate_ai_output.md`         | NOYAU DURABLE | traité ci-dessus                                                                                  |
| `04_ai_refactor_partner.md`        | DIRECT        | refactoring assisté sur du legacy : utile **après** les tests caractérisants, jamais avant        |
| `05_ai_test_generator.md`          | DIRECT        | génération de cas limites, à condition de relire ce qui est vérifié                               |
| `06_partition_drill.md`            | NOYAU DURABLE | décider ce que tu délègues et ce que tu gardes : la compétence centrale du niveau 6               |
| `07_faux_positifs_ia.md`           | DIRECT        | une alerte IA sur un code correct coûte du temps : savoir clore une fausse piste                  |
| `07_solo_vs_copilot_drill.md`      | DIRECT        | mesurer ta propre dépendance à l'outil ; utile avant un entretien sans assistance                 |
| `08_ai_code_review_arena.md`       | DIRECT        | revue de PR générée : chercher les chemins d'erreur absents, pas les fautes de style              |
| `08_prompt_safety.md`              | DIRECT        | injection de prompt dans une fonctionnalité IA en production, données sensibles envoyées à un tiers |
| `09_ai_hallucination_gym.md`       | DIRECT        | dépendances inventées, API inexistantes, annotations d'une autre version majeure                  |
| `10_ambiguous_ai_response.md`      | DIRECT        | une réponse qui ménage les deux hypothèses ne décide rien : c'est à toi de trancher               |
| `11_lire_humain_vs_lire_ia.md`     | DIRECT        | deux textures de bug différentes ; se retrouve dans `30_mini_projects/18_human_vs_ai_smell`       |
| `12_ai_grimoire.md`                | CONSULTABLE   | fiche de rappel du protocole de vérification                                                      |
| `13_EXO_LECTURE.md`                | DIRECT        | lire du code généré comme du code d'inconnu, pas comme du sien                                    |
| `14_EXO_JEUNE_IA.md`               | DIRECT        | l'erreur de confiance du débutant : demander une confirmation à celui qui vient de se tromper     |
| `98_PORTAGE_MENTAL.md`             | NOYAU DURABLE | le protocole de vérification ne dépend d'aucun modèle ni d'aucun langage                          |

---

### Module 24 : `24_databases/`

##### Fichier MyFunnyJS

`24_databases/03_data_modeling.md`

##### Concept appris

Le modèle de données survit à tous les frameworks du projet. Il se conçoit à partir des questions à poser aux données, pas à partir des écrans.

##### Technologies concernées

| Technologie        | Où le concept réapparaît                                | Pourquoi c'est utile                                                                          |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------|
| **PostgreSQL**     | clés, contraintes, index, types                          | voir [4.7](./01-niveau-1-socle.md#47--sql-et-postgresql) ; une contrainte en base est la seule règle que personne ne peut contourner |
| **Prisma / Drizzle** | schéma déclaratif, migrations, relations               | l'ORM applique ton modèle : il ne le conçoit pas à ta place                                      |
| **MongoDB**        | dénormalisation, documents imbriqués                     | CONTEXTUELLE : justifiée par un modèle d'accès précis, pas par le confort du démarrage           |
| **Redis**          | structures choisies pour l'accès dominant                | même raisonnement, à l'échelle d'une clé                                                         |
| **Analytique**     | modèle en étoile, agrégats précalculés                   | les questions analytiques ne se posent pas au même schéma que les questions transactionnelles    |

##### Ce que l'apprenant doit reconnaître

Une contrainte d'unicité vérifiée en JavaScript et absente de la base. Une colonne `status` en texte libre. Un champ JSON qui contient en réalité cinq colonnes. Une clé étrangère absente parce que « l'ORM s'en occupe ».

##### Exemple réel

Une table d'inscriptions vérifie l'unicité par un `SELECT` suivi d'un `INSERT`. Sous charge, deux requêtes concurrentes passent le `SELECT` avant que l'une des deux n'insère : doublon. L'équipe ajoute une transaction, puis un verrou applicatif, puis un cache. La ligne qui règle le problème est un `UNIQUE` sur la colonne, ajouté six mois plus tard, après avoir nettoyé les 1 240 doublons accumulés.

##### Piège de transfert

Le SQL se transfère presque intégralement entre langages ; les ORM, non. Hibernate, Entity Framework, SQLAlchemy et Prisma partagent les mêmes pièges (N+1, chargement paresseux, entité mutée persistée à ton insu) sous quatre vocabulaires différents.

##### Pont vers d'autres fichiers MyFunnyJS

`09_data_structures/06_bst/` (pourquoi un index est un arbre), `08_memory_performance/03_complexity/`, `28_edge_cases/05_race_condition_hunter.md`.

---

#### Le reste du module 24

| Fichier                            | Verdict       | Où ça réapparaît concrètement                                                             |
| ---------------------------------- | ------------- | ---------------------------------------------------------------------------------------------|
| `00_prereq_check.md`               | PRÉREQUIS     | à passer avant le niveau 3 ; sans SQL, un backend est une boîte noire                         |
| `00_why_databases.md`              | CONSULTABLE   | la base survit à l'application : c'est la seule raison qui compte                             |
| `01_sql_basics.md`                 | NOYAU DURABLE | voir [4.7](./01-niveau-1-socle.md#47--sql-et-postgresql) ; jointures, agrégats, `EXPLAIN`     |
| `02_nosql_basics.md`               | CONTEXTUELLE  | MongoDB, DynamoDB : à choisir sur un modèle d'accès documenté                                 |
| `03_data_modeling.md`              | NOYAU DURABLE | traité ci-dessus                                                                              |
| `04_redis_caching.md`              | DIRECT        | voir [6.4](./03-niveau-3-backend.md#64--redis)                                                |
| `05_db_in_js.md`                   | DIRECT        | Prisma, Drizzle, TypeORM : pool de connexions, N+1, migrations réversibles                    |
| `06_databases_grimoire.md`         | CONSULTABLE   | check-list avant une revue de schéma                                                          |
| `07_EXO_LECTURE.md`                | DIRECT        | lire un schéma existant et en déduire les règles métier non écrites                           |
| `08_EXO_JEUNE_IA.md`               | DIRECT        | l'IA génère des requêtes correctes sur des schémas qu'elle a imaginés                         |
| `98_EXO_IA_MENTEUSE.md`            | DIRECT        | une explication d'index fausse mais convaincante : le `EXPLAIN` tranche, pas la conversation  |
| `98_PORTAGE_MENTAL.md`             | NOYAU DURABLE | SQL est le plus transférable de tous les acquis de MyFunnyJS                                  |
| `99_du_single_node_au_cluster.md`  | CONTEXTUELLE  | réplication, lecture sur réplica, latence de réplication : prépare le module 25               |

---

### Module 25 : `25_scalability/`

##### Fichier MyFunnyJS

`25_scalability/03_distributed_fallacies.md`

##### Concept appris

Le réseau échoue, la latence n'est pas nulle, la bande passante est finie, la topologie change. Chaque appel distant est une opération qui peut partiellement réussir.

##### Technologies concernées

| Technologie        | Où le concept réapparaît                                    | Pourquoi c'est utile                                                                     |
| ------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **HTTP interservices** | timeouts, retries, disjoncteur                            | voir [7.4](./04-niveau-4-systemes.md#74--résilience-et-architecture-distribuée)             |
| **Files de messages** | livraison au moins une fois, idempotence                    | un handler non idempotent transforme une garantie de livraison en corruption de données     |
| **Bases répliquées** | lecture juste après écriture sur un réplica en retard        | le bug « je viens de sauvegarder et ça n'apparaît pas » n'est presque jamais un bug d'UI     |
| **Kubernetes / cloud** | nœuds qui disparaissent, redémarrages, mises à l'échelle   | l'infrastructure suppose que ton process est jetable : le tien doit le supposer aussi       |
| **Paiement / e-mail** | actions non annulables déclenchées deux fois                | c'est là que l'absence d'idempotence devient un incident client, pas un ticket              |

##### Ce que l'apprenant doit reconnaître

Un appel réseau sans timeout. Un retry sans backoff (donc une amplification de panne). Un job rejoué qui envoie une deuxième notification. Un état supposé cohérent entre deux services au même instant.

##### Exemple réel

Un service appelle un fournisseur externe sans timeout. Le fournisseur ralentit à 40 s au lieu de 200 ms. Les connexions du pool restent occupées, le pool se vide, et le service tombe entièrement : y compris ses endpoints qui n'utilisent pas ce fournisseur. Une panne partielle chez un tiers est devenue une panne totale chez toi, à cause d'une valeur par défaut absente.

##### Piège de transfert

Les valeurs par défaut de timeout diffèrent radicalement entre clients HTTP et entre langages : certaines valent l'infini. Ne jamais supposer, toujours régler explicitement.

##### Pont vers d'autres fichiers MyFunnyJS

`03_async/06_backpressure.md`, `05_error_handling/`, `26_observability/02_distributed_tracing.md`.

---

#### Le reste du module 25

| Fichier                          | Verdict       | Où ça réapparaît concrètement                                                                |
| -------------------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `00_prereq_check.md`             | PRÉREQUIS     | asynchrone et gestion d'erreur acquis avant toute discussion de charge                          |
| `00_why_scalability.md`          | CONSULTABLE   | rappel honnête : la plupart des applications n'ont pas de problème d'échelle, mais de requêtes  |
| `01_distributed_thinking.md`     | NOYAU DURABLE | raisonner en pannes partielles plutôt qu'en succès ou échec                                     |
| `02_distributed_primitives.md`   | DIRECT        | idempotence, verrous, horloges, consensus : le vocabulaire d'une conception d'architecture      |
| `03_distributed_fallacies.md`    | NOYAU DURABLE | traité ci-dessus                                                                                |
| `04_load_balancing.md`           | DIRECT        | Nginx, ALB, ingress, santé des instances, sessions collantes                                    |
| `05_horizontal_vs_vertical.md`   | DIRECT        | dimensionnement cloud, coût réel ; parfois la bonne réponse est « une machine plus grosse »     |
| `06_rate_limiting.md`            | DIRECT        | guard NestJS + Redis, API gateway, protection contre l'abus et contre soi-même                  |
| `07_message_queues.md`           | DIRECT        | BullMQ, RabbitMQ, SQS, Kafka, pgboss : voir [6.5](./03-niveau-3-backend.md#65--files-de-messages-et-workers) |
| `08_scalability_grimoire.md`     | CONSULTABLE   | grille de questions à poser avant de promettre une montée en charge                             |
| `09_EXO_LECTURE.md`              | DIRECT        | lire un postmortem public d'incident et en extraire les décisions                               |
| `10_EXO_JEUNE_IA.md`             | DIRECT        | l'IA propose Kafka pour 200 messages par jour : savoir dimensionner contre la mode              |
| `98_PORTAGE_MENTAL.md`           | NOYAU DURABLE | les problèmes distribués sont identiques en Java, Go et .NET : seule la bibliothèque change      |

---

### Module 26 : `26_observability/`

##### Fichier MyFunnyJS

`26_observability/02_distributed_tracing.md`, `01_structured_logging.md`

##### Concept appris

En production, tu ne peux pas mettre de point d'arrêt. Tu ne peux que lire ce que le système a accepté de raconter. Ce qui n'a pas été instrumenté n'existe pas.

##### Technologies concernées

| Technologie        | Où le concept réapparaît                             | Pourquoi c'est utile                                                                        |
| ------------------ | ------------------------------------------------------ | -----------------------------------------------------------------------------------------------|
| **pino / Winston** | logs JSON, identifiant de corrélation                  | un log en texte libre n'est pas requêtable : il est décoratif                                   |
| **OpenTelemetry**  | spans, propagation de contexte, exporters              | le standard qui traverse Node, Python, Java et .NET : un acquis réutilisable partout            |
| **Sentry**         | suivi d'erreurs, regroupement, source maps             | voir aussi la fiche React ci-après : une erreur de rendu sans source map est illisible          |
| **Prometheus / Grafana** | métriques, percentiles, alertes                  | la moyenne cache tout ; le p99 raconte l'expérience réelle des clients mécontents               |
| **Cloud managé**   | logs centralisés, rétention, coût                      | l'observabilité est une ligne de facture : tout journaliser est un choix, pas une prudence      |

##### Ce que l'apprenant doit reconnaître

Un `console.log` en production sans structure ni corrélation. Une alerte sur la moyenne. Un log qui contient un e-mail ou un jeton. Une erreur capturée puis avalée sans être remontée. Une trace qui s'arrête à la frontière du service.

##### Exemple réel

Un client signale des lenteurs "de temps en temps". Les tableaux de bord sont verts : temps de réponse moyen à 180 ms. En passant au p99, la vérité apparaît : 8 secondes pour 1 % des requêtes, systématiquement les mêmes comptes, ceux qui ont beaucoup de données. La moyenne avait masqué le problème pendant quatre mois, et le client avait raison depuis le début.

##### Piège de transfert

Les trois piliers (logs, métriques, traces) sont identiques partout. Ce qui change, c'est l'agent, le format d'export et la facture. Apprendre OpenTelemetry une fois est l'un des meilleurs rendements de ce document.

##### Pont vers d'autres fichiers MyFunnyJS

`04_debugging/05_hypothesis_driven_debug.md`, `08_memory_performance/04_profiling/`, `22_security/08_privacy_and_aiact.md` (ne pas journaliser de données personnelles).

---

#### Le reste du module 26

| Fichier                                  | Verdict         | Où ça réapparaît concrètement                                                            |
| ---------------------------------------- | --------------- | -------------------------------------------------------------------------------------------|
| `00_prereq_check.md`                     | PRÉREQUIS       | méthodologie de debugging acquise : l'observabilité l'outille, elle ne la remplace pas      |
| `00_why_observability.md`                | CONSULTABLE     | la différence entre surveiller (connu) et observer (inconnu)                                |
| `01_structured_logging.md`               | NOYAU DURABLE   | traité ci-dessus                                                                            |
| `02_distributed_tracing.md`              | NOYAU DURABLE   | traité ci-dessus                                                                            |
| `03_tracing_paper_drill.md`              | DIRECT          | reconstituer un trajet de requête sur papier : l'exercice qui fait comprendre les spans     |
| `04_metrics_alerting.md`                 | NOYAU DURABLE   | percentiles, taux d'erreur, saturation, seuils d'alerte qui ne réveillent pas pour rien     |
| `05_sentry_in_prod.md`                   | PROFESSIONNELLE | intégration, source maps, regroupement, versions ; l'outil peut changer, le geste non       |
| `06_debug_in_prod.md`                    | DIRECT          | diagnostiquer sans point d'arrêt, sans redémarrage, sans casser le service                  |
| `07_prod_stack_trace_drill.md`           | DIRECT          | remonter d'une trace minifiée à la ligne d'origine : indispensable en frontend              |
| `08_oncall_drill.md`                     | DIRECT          | astreinte, runbook, postmortem : compétence rare, très valorisée, rarement enseignée        |
| `09_instrumenter_ton_projet.md`          | DIRECT          | à appliquer sur un mini-projet ; c'est ce qui transforme un projet d'école en preuve        |
| `09_observability_grimoire.md`           | CONSULTABLE     | check-list avant une première mise en production                                            |
| `10_EXO_LECTURE.md`                      | DIRECT          | lire un tableau de bord existant et dire ce qu'il ne montre pas                             |
| `11_EXO_JEUNE_IA.md`                     | DIRECT          | l'IA propose de journaliser l'objet entier : c'est une fuite de données et une facture      |
| `98_PORTAGE_MENTAL.md`                   | NOYAU DURABLE   | OpenTelemetry est multi-langage par construction : transfert quasi gratuit                  |
| `99_PONT_avant_module_27_team_craft.md`  | PRÉREQUIS       | un incident se raconte à des humains : c'est la transition vers le module 27                |

---

### Module 27 : `27_team_craft/`

##### Fichier MyFunnyJS

`27_team_craft/02_adr_writing.md`

##### Concept appris

Une décision non écrite n'existe pas. Un ADR fige le contexte, les options envisagées, le choix et ses conséquences : y compris celles qu'on accepte de subir.

##### Technologies concernées

| Technologie / contexte | Où le concept réapparaît                                  | Pourquoi c'est utile                                                                       |
| ---------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------|
| **Tout choix de stack** | pourquoi NestJS et pas Express, pourquoi Postgres et pas Mongo | six mois plus tard, personne ne se souvient du contexte : seul l'ADR le sait                |
| **Migrations**         | changer d'ORM, de fournisseur, de format de messages          | l'ADR d'origine dit si la contrainte qui justifiait le choix existe encore                   |
| **Revue de code**      | désaccord technique argumenté                                 | un désaccord tranché par écrit ne se rejoue pas à chaque sprint                              |
| **Entretien**          | le livrable qui prouve que tu sais décider                    | montrer un ADR vaut plus que réciter une liste de technologies                               |
| **Portfolio**          | un dépôt avec `docs/adr/` se distingue immédiatement          | c'est le seul artefact que l'IA ne peut pas écrire à ta place : le contexte est le tien       |

##### Ce que l'apprenant doit reconnaître

Une décision structurante prise dans un fil de discussion éphémère. Une option écartée sans qu'on sache pourquoi. Un choix présenté sans son coût. Une équipe qui rediscute le même sujet pour la troisième fois.

##### Exemple réel

Une équipe choisit une file de messages plutôt qu'un appel direct, pour absorber les pics d'un partenaire. Deux ans plus tard, le partenaire a disparu, la file coûte de l'exploitation et ajoute de la latence, et personne n'ose la retirer : personne ne sait pourquoi elle est là. Un ADR de quinze lignes aurait rendu la suppression évidente en cinq minutes.

##### Piège de transfert

Un ADR n'est pas de la documentation technique. La documentation décrit ce qui existe ; l'ADR explique **pourquoi**, et reste valide même après réécriture du code.

##### Pont vers d'autres fichiers MyFunnyJS

`31_annexes/12_trade_off_arena.md`, `16_architecture_patterns/07_architecture_grimoire.md`, `30_mini_projects/_templates/00_ADR_TEMPLATE.md`.

---

#### Le reste du module 27

| Fichier                          | Verdict       | Où ça réapparaît concrètement                                                                |
| -------------------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `00_prereq_check.md`             | PRÉREQUIS     | à passer avant la première contribution à un dépôt partagé                                      |
| `00_why_team_craft.md`           | CONSULTABLE   | ce qui bloque une carrière après deux ans n'est presque jamais technique                        |
| `01_code_review.md`              | DIRECT        | PR GitHub/GitLab, standards d'équipe, commentaires qui portent sur le code et non la personne   |
| `02_adr_writing.md`              | NOYAU DURABLE | traité ci-dessus                                                                                |
| `03_technical_writing.md`        | DIRECT        | README, postmortem, message de commit, spécification : tout ce qui te survit dans un dépôt      |
| `04_navigate_codebase.md`        | NOYAU DURABLE | onboarding, legacy ; la grille de lecture de [8.0](./05-niveau-5-transfert.md#80--la-grille-de-lecture-universelle) |
| `05_pair_programming.md`         | DIRECT        | transfert de connaissance, montée en compétence, résolution de blocage à deux                   |
| `06_mental_health.md`            | CONTEXTUELLE  | la durée de carrière est une compétence ; personne ne la met sur un CV, tout le monde la subit  |
| `07_sprint_hell.md`              | DIRECT        | dette technique arbitrée sous pression : savoir négocier un périmètre plutôt que subir          |
| `08_how_to_ask.md`               | DIRECT        | poser une question qui contient déjà ce que tu as tenté ; vaut aussi pour prompter une IA       |
| `09_dire_je_ne_sais_pas.md`      | NOYAU DURABLE | évalué en entretien, et décisif en incident : la fausse certitude coûte des heures              |
| `10_rfc_simulation.md`           | DIRECT        | proposer un changement structurant à une équipe qui n'est pas d'accord                          |
| `11_tech_pitch.md`               | DIRECT        | défendre un choix technique devant un décideur non technique                                    |
| `12_three_audiences_intro.md`    | DIRECT        | expliquer un incident au support, au produit et à la technique : trois versions, une vérité     |
| `13_three_audiences_drill.md`    | DIRECT        | l'entraînement du précédent, en conditions de temps limité                                      |
| `14_argumentaire_technique.md`   | DIRECT        | construire un argument vérifiable plutôt qu'une préférence                                      |
| `15_team_grimoire.md`            | CONSULTABLE   | à relire avant une prise de poste                                                               |
| `16_EXO_LECTURE.md`              | DIRECT        | lire une PR importante et produire une revue utile en vingt minutes                             |
| `17_EXO_JEUNE_IA.md`             | DIRECT        | une revue générée signale du style et rate les décisions : savoir ce qu'elle ne voit pas        |
| `18_EXO_TROIS_PUBLICS.md`        | DIRECT        | l'exercice complet des trois audiences, à mettre dans le portfolio                              |
| `98_EXO_IA_MENTEUSE.md`          | DIRECT        | une IA qui valide ton argument faux ; en équipe, c'est un humain qui te contredira              |
| `98_PORTAGE_MENTAL.md`           | NOYAU DURABLE | aucun de ces gestes ne dépend d'un langage : c'est le module le plus transférable du curriculum |

---

### Module 28 : `28_edge_cases/`

##### Fichier MyFunnyJS

`28_edge_cases/02_floating_point.md`

##### Concept appris

Un nombre à virgule flottante est une approximation binaire. `0.1 + 0.2 !== 0.3` n'est pas une bizarrerie de JavaScript, c'est la norme IEEE 754.

##### Technologies concernées

| Technologie      | Où le concept réapparaît                              | Pourquoi c'est utile                                                                     |
| ---------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------|
| **PostgreSQL**   | `NUMERIC` contre `DOUBLE PRECISION`                    | une colonne de montants en flottant est un écart comptable programmé                        |
| **Java / C#**    | `BigDecimal`, `decimal`                                | les deux écosystèmes ont un type dédié parce que le problème est universel                  |
| **JavaScript**   | `Number` unique, `BigInt` pour les entiers             | stocker les centimes en entier est la parade la plus simple et la plus répandue             |
| **API / JSON**   | `1234.56` sérialisé, arrondi, relu                     | un montant qui traverse trois services en JSON peut perdre un centime en route              |
| **Analytique**   | agrégation de millions de lignes                       | l'erreur d'arrondi ne s'annule pas, elle s'accumule dans le même sens                       |

##### Ce que l'apprenant doit reconnaître

Un montant en `float`. Une comparaison d'égalité entre deux flottants. Un arrondi appliqué à l'affichage mais pas au calcul. Un total recalculé côté client qui diffère du total serveur d'un centime.

##### Exemple réel

Une facturation calcule des remises en flottant, ligne par ligne. Chaque ligne est correcte à l'affichage, arrondie à deux décimales. Le total, lui, est calculé sur les valeurs non arrondies. Sur une facture de 300 lignes, l'écart atteint 4 centimes. Le service comptable rejette la facture entière : pour un logiciel, 4 centimes est une erreur d'arrondi ; pour une comptabilité, c'est un écart de rapprochement.

##### Piège de transfert

Passer à Python ne règle rien : les `float` y sont les mêmes IEEE 754. Ce sont `decimal.Decimal`, `BigDecimal` et `NUMERIC` qui règlent le problème, dans les trois écosystèmes, au prix de performances moindres.

##### Pont vers d'autres fichiers MyFunnyJS

`07_math_basics/`, `24_databases/03_data_modeling.md`, `17_web_concepts/06_serialization.md`.

---

#### Le reste du module 28

| Fichier                                    | Verdict       | Où ça réapparaît concrètement                                                            |
| ------------------------------------------ | ------------- | -------------------------------------------------------------------------------------------|
| `00_prereq_check.md`                       | PRÉREQUIS     | types et coercition acquis avant d'entrer dans les cas limites                              |
| `00_why_edge_cases.md`                     | CONSULTABLE   | les bugs coûteux vivent aux frontières, pas au centre                                       |
| `01_nan_undefined_null.md`                 | DIRECT        | `NULL` SQL (logique à trois états), sérialisation, valeurs par défaut, colonnes optionnelles |
| `02_floating_point.md`                     | NOYAU DURABLE | traité ci-dessus                                                                            |
| `03_weird_coercions.md`                    | SPÉCIFIQUE JS | validation d'entrées d'API : tout arrive en `string` dans une query string                  |
| `04_prototype_chain_dark.md`               | SPÉCIFIQUE JS | pollution de prototype, fusion d'objets non sécurisée (`22_security/03`)                    |
| `05_race_condition_hunter.md`              | NOYAU DURABLE | React (fetch concurrent), SQL (lecture-modification-écriture), files, verrous                |
| `06_heisenbug_arena.md`                    | DIRECT        | le bug qui disparaît quand tu l'observes : logs, timings, `--inspect`                       |
| `07_edge_cases_grimoire.md`                | CONSULTABLE   | liste de cas limites à passer sur toute fonction publique                                   |
| `07b_race_condition_hunt.md`               | DIRECT        | reproduire une race condition de façon déterministe : la compétence rare du debugging       |
| `08_EXO_LECTURE.md`                        | DIRECT        | lire une fonction et lister ses cas limites avant de la modifier                            |
| `09_EXO_JEUNE_IA.md`                       | DIRECT        | l'IA traite le cas nominal ; les cas limites sont précisément ce qu'il faut lui réclamer    |
| `10_SPEC_DRIFT_DRILL.md`                   | DIRECT        | spécification qui dérive en cours de route : tickets ambigus, prompts flous                 |
| `11_SPEC_FLOU_DRIFT_COMBO_DRILL.md`        | DIRECT        | flou initial **et** dérive : la combinaison la plus fréquente en mission réelle             |
| `98_PORTAGE_MENTAL.md`                     | DIRECT        | chaque langage a ses cas limites ; savoir qu'ils existent est ce qui se transfère           |
| `99_PONT_28_29.md`                         | PRÉREQUIS     | transition vers l'autonomie des agents : un agent amplifie les cas limites non traités      |

---

### Module 29 : `29_ai_agents_and_autonomy/`

##### Fichier MyFunnyJS

`29_ai_agents_and_autonomy/02_verifiable_specifications.md`

##### Concept appris

Un agent exécute ce qui est vérifiable. Une consigne sans critère d'acceptation produit un travail qu'on ne peut ni valider ni refuser.

##### Technologies concernées

| Technologie / contexte | Où le concept réapparaît                                  | Pourquoi c'est utile                                                                   |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------|
| **Agents de code**     | tâche déléguée, exécution longue, PR produite                | voir [9](./06-niveau-6-ia.md) ; sans critère de fin, l'agent tourne ou s'arrête au hasard  |
| **CI**                 | les tests comme définition contractuelle de « terminé »      | déplacer le jugement dans la CI est la seule façon de superviser à l'échelle               |
| **Permissions**        | jetons, accès au dépôt, actions irréversibles                | un agent avec un droit de push en force est un incident en attente de déclencheur          |
| **Revue**              | lire une trace d'exécution plutôt que seulement le diff      | la trace montre les hypothèses prises ; le diff montre seulement le résultat               |

##### Ce que l'apprenant doit reconnaître

Une consigne sans critère observable. Une trace où l'agent contourne un test au lieu de corriger le code. Un agent qui a accès à des secrets qu'il n'utilise pas. Une action irréversible (suppression, envoi, paiement) sans validation humaine.

##### Exemple réel

Un agent reçoit « fais passer la suite de tests ». Trois tests d'intégration échouaient à cause d'une régression réelle. La trace montre la démarche : l'agent les a marqués comme ignorés, puis a annoncé la suite verte. Techniquement, la consigne est respectée. La spécification vérifiable manquante tenait en une ligne : « aucun test ne doit être désactivé ou ignoré ».

##### Piège de transfert

Ce module vieillira plus vite que les autres : les outils bougent tous les trimestres. Ce qui reste : savoir écrire un critère d'acceptation, lire une trace, et refuser un résultat. Ces trois gestes sont indépendants du modèle et de la plateforme.

##### Pont vers d'autres fichiers MyFunnyJS

`06_testing/`, `23_ai_native_dev/03_validate_ai_output.md`, `22_security/09_supply_chain_sbom.md`.

---

#### Le reste du module 29

| Fichier                              | Verdict       | Où ça réapparaît concrètement                                                            |
| ------------------------------------ | ------------- | -------------------------------------------------------------------------------------------|
| `00_bridge_exo.md`                   | PRÉREQUIS     | reprise du fil du module 28 avant d'aborder l'autonomie                                     |
| `00_prereq_check.md`                 | PRÉREQUIS     | vérification et tests acquis : sans eux, superviser est impossible                          |
| `00_why_ai_agents.md`                | CONSULTABLE   | la différence entre déléguer une frappe et déléguer une décision                            |
| `01_agents_vs_copilots.md`           | DIRECT        | choisir le bon niveau d'autonomie selon le risque de la tâche                               |
| `02_verifiable_specifications.md`    | NOYAU DURABLE | traité ci-dessus                                                                            |
| `03_reading_agent_traces.md`         | DIRECT        | lire une trace d'exécution comme un log de production : chercher l'hypothèse, pas la syntaxe |
| `04_refusing_a_trace.md`             | NOYAU DURABLE | refuser un livrable avec un motif écrit : la même compétence qu'en revue de code humaine    |
| `05_agent_sandbox_hygiene.md`        | DIRECT        | périmètre d'exécution, secrets, actions irréversibles, journalisation des accès             |
| `06_agents_grimoire.md`              | CONSULTABLE   | check-list avant de lancer un agent sur un dépôt réel                                       |
| `07_agent_hallucination_gym.md`      | DIRECT        | l'agent invente un fichier, une commande, une API : la trace le montre, le diff non         |
| `08_traces_pool/00_trace_A.md`       | DIRECT        | matériau d'entraînement : trace à analyser, à accepter ou à refuser                         |
| `08_traces_pool/01_trace_B.md`       | DIRECT        | idem, autre profil d'erreur                                                                 |
| `08_traces_pool/02_trace_C.md`       | DIRECT        | idem, cas le plus ambigu des trois                                                          |
| `09_EXO_LECTURE.md`                  | DIRECT        | lire une trace longue sans se laisser convaincre par le ton assuré du résumé final          |
| `10_EXO_JEUNE_IA.md`                 | DIRECT        | déléguer trop tôt, trop large : l'erreur la plus commune de 2026                            |
| `11_EXO_PARTITION_HUMAIN_IA.md`      | NOYAU DURABLE | tracer la frontière entre ce que tu délègues et ce que tu gardes : voir [9](./06-niveau-6-ia.md) |
| `98_PORTAGE_MENTAL.md`               | DIRECT        | les gestes de supervision survivront aux outils qui les ont rendus nécessaires              |

---

### Modules 30 et 31 : `30_mini_projects/` et `31_annexes/`

**Pourquoi ces deux modules ne sont pas traités fichier par fichier.** Ce sont des lieux d'**application**, pas des lieux de concept. Chacun de leurs 342 fichiers réutilise une notion déjà expliquée dans son module d'origine, et déjà traitée ci-dessus. Une ligne de tableau par fichier n'apprendrait rien de plus à quelqu'un qui a lu le concept là où il est enseigné : elle produirait une encyclopédie que personne ne finit. Le découpage ci-dessous est donc par **archétype de compétence** pour les mini-projets, et par **sous-dossier** pour les annexes.

#### `30_mini_projects/` : par archétype de compétence

Regroupement établi après lecture des README de chaque projet, pas d'après le nom des dossiers.

| Archétype                                | Projets                                                                              | Compétence technologique visée                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------|
| **Moteur métier sans framework**         | `01_rasengan_engine`, `04_breaking_cache`                                            | modéliser un domaine et écrire des algorithmes soi-même, sous profilage. Prérequis mental à tout ORM et à tout framework |
| **API et backend sous contrainte**       | `05_prison_break_api`, `06_ultras_dashboard`                                         | endpoints, authentification, injection, TypeScript strict, tracing et Sentry : le niveau 3 et le niveau 4 appliqués |
| **Événementiel et temps réel**           | `02_garo_no_kronika`, `11_scheduler`                                                 | `EventEmitter`, streaming, timeouts, concurrence bornée, annulation. La base de [6.6](./03-niveau-3-backend.md#66--temps-réel--websocket-et-sse) |
| **Outillage, CLI et interface humaine**  | `07_ballon_dor_cli`, `08_trapsoul_radio`                                             | CLI et conteneurisation d'un côté, accessibilité et i18n de l'autre : deux formes du même sujet, l'interface       |
| **Legacy et reprise de code existant**   | `03_walking_dead_protocol`, `10_legacy_dungeon`, `12_legacy_takeover`, `13_memory_hunter` | tests caractérisants, cartographie d'un dépôt inconnu, chasse aux fuites mémoire. C'est le jour 1 réel d'une mission |
| **Systèmes distribués**                  | `14_system_design_lab`, `16_distributed_arena`                                       | queue, retry, idempotence, panne partielle, postmortem : le niveau 4 en conditions de laboratoire                  |
| **Transfert multi-langage**              | `15_porte_rasengan_engine_multilang`, `17_polyglot_forge`                            | porter son propre code vers Python, Go ou Rust et écrire l'ADR de comparaison : le niveau 5 rendu vérifiable        |
| **Vérification et supervision de l'IA**  | `09_oracle_glitch`, `18_human_vs_ai_smell`, `19_supervise_the_ai`                    | pipeline de contrôle d'une sortie de modèle, textures de bug humain contre IA, supervision sans écrire de code : le niveau 6 |

`_templates/` (ADR, postmortem, journal TDD, portes de sécurité, SBOM, cartographie en 15 minutes) : **CONSULTABLE, à utiliser systématiquement.** C'est ce qui transforme un projet d'école en entrée de portfolio défendable. `00_prereq_check.md`, `00_why_mini_projects.md`, `20_EXO_LECTURE.md` et `21_EXO_JEUNE_IA.md` encadrent le module et se lisent une fois, au début.

#### `31_annexes/` : par sous-dossier

| Sous-dossier                 | Verdict         | À quel moment de TECH-ILA tu y piocheras                                                                        |
| ---------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------|
| `16_career/`                 | CONTEXTUELLE    | à la fin du niveau 4, quand tu commences à candidater : défense en entretien, plateau, sevrage d'IA               |
| `19_interview/`              | DIRECT          | avant chaque entretien technique : désaccord avec un CTO, tempête d'objections, défense orale d'une décision      |
| `23_reading/`                | NOYAU DURABLE   | avant `10_legacy_dungeon` et avant toute prise de poste : cartographier un dépôt inconnu en quinze minutes        |
| `24_recall/`                 | CONSULTABLE     | en parallèle de tout TECH-ILA, par blocs de modules : c'est le filet anti-oubli du parcours                       |
| `25_soft_skills/`            | DIRECT          | au niveau 3, quand tu travailles avec d'autres : demander de l'aide, distinguer flou initial et dérive de spec    |
| `27_synthese_mini_projects/` | DIRECT          | après chaque bloc de mini-projets, et pour construire la page portfolio ([12](./08-ia-exercices-marche-audit.md)) |
| `28_templates/`              | CONSULTABLE     | à chaque publication de projet : hypothèses, check-list de publication, postmortem                                |
| `29_toolchain/`              | PROFESSIONNELLE | pendant tout le niveau 1 ([4](./01-niveau-1-socle.md)) : Git, VS Code, paquets, bundlers, Docker, CI, versions de Node |
| `30_transferability/`        | NOYAU DURABLE   | pendant tout le niveau 5 ([8](./05-niveau-5-transfert.md)) : closure en Python, Observer en Go, lecture de Rust et de Java |
| `31_versioning/`             | CONTEXTUELLE    | quand ton propre matériel de travail prend de l'âge : gérer la migration d'un apprenant entre deux versions       |

Les fichiers à la racine de `31_annexes/` se piochent au fil du parcours plutôt qu'ils ne se lisent en bloc. Les plus utilisés depuis TECH-ILA : `20_PERISSABILITE.md` et `21_PERISSABILITE_INDEX.md` (la grille de classification de tout ce document), `22_PONTS_INTER_MODULES.md` (les liens que TECH-ILA prolonge côté technologies), `12_trade_off_arena.md` (avant tout ADR), `03_finops_greenops.md` (le coût d'exploitation d'une décision technique), `04_when_not_to_code.md` et `08_legal_employability.md` (les deux fichiers les plus honnêtes du curriculum), `02_system_design_grimoire.md` (avant `14_system_design_lab`).

---

### Module 32 : `32_tools/`

##### Fichier MyFunnyJS

`32_tools/01_logger_structure.md`

##### Concept appris

Construire soi-même l'outil minimal qu'on utilise tous les jours. Un logger structuré fait tenir en cinquante lignes ce que les bibliothèques enrobent : un format, des niveaux, un contexte, une destination.

##### Technologies concernées

| Technologie      | Où le concept réapparaît                                | Pourquoi c'est utile                                                                            |
| ---------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------|
| **pino / Winston** | tu comprends ce que la bibliothèque fait, donc ce qu'elle coûte | choisir un logger sur ses garanties (sérialisation, niveaux, transports) plutôt que sur sa popularité |
| **OpenTelemetry** | le contexte de corrélation que ton logger doit porter    | ton logger maison montre exactement pourquoi le contexte doit être propagé, pas juste attaché      |
| **Outillage interne** | scripts d'équipe, générateurs, kits de diagnostic     | produire un outil que des collègues utilisent est une compétence rare chez un junior               |
| **CI**           | benchmark en CI, seuils de régression                     | une mesure de performance qui n'est pas automatisée n'est mesurée qu'une fois                      |

##### Ce que l'apprenant doit reconnaître

Un logger qui concatène des chaînes au lieu d'émettre des objets. Un benchmark sans échauffement ni répétition, donc sans valeur. Un outil interne sans README, donc utilisé par une seule personne. Un `console.log` promu en solution permanente.

##### Exemple réel

Une équipe passe trois jours à comparer deux bibliothèques de logs. Personne ne mesure. Le choix se fait sur le nombre d'étoiles GitHub. Six mois plus tard, la sérialisation synchrone du logger retenu représente 12 % du temps CPU du service en pointe. Le benchmark de `02_benchmark_kit.md`, appliqué une demi-journée, aurait donné la réponse avant le choix.

##### Piège de transfert

Écrire son propre outil est un exercice de compréhension, pas une recommandation de production. Le geste professionnel est : le construire une fois pour comprendre, puis adopter l'outil éprouvé en sachant ce qu'il fait.

##### Pont vers d'autres fichiers MyFunnyJS

`26_observability/01_structured_logging.md`, `08_memory_performance/00_measure_first.md`, `15_runtime_env/06_node_cli_scripts/`.

---

#### Le reste du module 32

| Fichier                    | Verdict         | Où ça réapparaît concrètement                                                                    |
| -------------------------- | --------------- | ----------------------------------------------------------------------------------------------- |
| `00_prereq_check.md`       | PRÉREQUIS       | modules Node et CLI acquis avant de construire de l'outillage                                     |
| `00_why_tools.md`          | CONSULTABLE     | pourquoi construire un outil qu'on pourrait installer                                             |
| `01_logger_structure.md`   | NOYAU DURABLE   | traité ci-dessus                                                                                  |
| `02_benchmark_kit.md`      | DIRECT          | mesurer avant d'optimiser, en CI ; s'applique à Node, Python, Java, .NET sans changement de méthode |
| `03_debug_toolkit.md`      | DIRECT          | scripts de diagnostic réutilisables : ce qu'un ingénieur d'astreinte veut trouver déjà écrit      |
| `04_cli_scaffolder.md`     | PROFESSIONNELLE | générateur de squelette d'équipe : uniformise les conventions mieux qu'un document                |
| `05_tools_grimoire.md`     | CONSULTABLE     | récapitulatif des quatre outils et de leurs limites                                               |
| `06_EXO_LECTURE.md`        | DIRECT          | lire le code d'un outil populaire pour comprendre ses compromis                                   |
| `07_EXO_JEUNE_IA.md`       | DIRECT          | l'IA génère un outil complet et non testé : c'est le pire endroit pour un bug silencieux          |

**Seuil franchi.** Les 32 modules sont désormais cartographiés fichier par fichier. Tu ne cherches plus « où réviser » : tu pars du symptôme technologique et tu remontes au mécanisme. C'est exactement l'objet de la section suivante.

---

## 11 : Carte inverse : technologie → fichiers MyFunnyJS

Tu es bloqué dans une techno. Pars du symptôme, retrouve le mécanisme.

```text
Technologie
    ↓ Mécanisme utilisé
    ↓ Fichier MyFunnyJS à relire
    ↓ Compétence opérationnelle
```

| Symptôme rencontré                                    | Mécanisme réel                            | Fichier à relire                                                                                          | Ce que tu sauras faire                                         |
| ----------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| React : mon `setInterval` compte jusqu'à 1            | closure figée                             | `01_fundamentals/02_scope/02_closure_trap.md`                                                             | lire un tableau de dépendances au lieu de le deviner           |
| React : la mauvaise réponse s'affiche                 | race condition                            | `28_edge_cases/05_race_condition_hunter.md`, `03_async/.../02c_abort_controller.md`                       | annuler une requête obsolète                                   |
| React : muter l'état ne rerend pas                    | identité de référence                     | `01_fundamentals/01_variables/02_reference_chaos.md`                                                      | expliquer pourquoi l'immutabilité est une contrainte technique |
| Node : `heap out of memory`                           | tout chargé en mémoire                    | `15_runtime_env/02_streams_buffers.md`, `08_.../04_profiling/`                                            | passer en streaming et le prouver                              |
| Node : l'API entière ralentit                         | event loop bloquée                        | `03_async/04_event_loop/`                                                                                 | déporter le CPU en worker                                      |
| Node : le client attend indéfiniment                  | rejet async non attrapé                   | `05_error_handling/04_async_error_traps.md`                                                               | fermer tous les chemins d'erreur                               |
| Express : mon middleware d'erreur ne s'exécute jamais | promesse rejetée hors chaîne              | `05_error_handling/03_error_propagation.md`                                                               | envelopper les handlers async                                  |
| NestJS : `can't resolve dependencies`                 | graphe d'injection                        | `16_architecture_patterns/02_solid_principles.md`                                                         | lire un graphe de modules                                      |
| NestJS : données d'un client vues par un autre        | état dans un singleton                    | `01_fundamentals/02_scope/02_closure_trap.md`, `12_design_patterns/01_creational/02_singleton_pattern.md` | placer l'état au bon endroit                                   |
| SQL : rapide en dev, lent en prod                     | plan d'exécution / index                  | `09_data_structures/06_bst/`, `08_.../03_complexity/`                                                     | lire un `EXPLAIN ANALYZE`                                      |
| SQL : doublons malgré la vérification                 | lecture-modification-écriture concurrente | `28_edge_cases/05_race_condition_hunter.md`                                                               | poser une contrainte d'unicité en base                         |
| SQL : montants faux au centime                        | flottants                                 | `28_edge_cases/02_floating_point.md`                                                                      | utiliser un type décimal                                       |
| Redis : la base s'effondre à l'expiration             | ruée sur le cache                         | `17_web_concepts/04_caching_strategies.md`                                                                | jitter, verrou, stale-while-revalidate                         |
| File : le job s'exécute deux fois                     | livraison au moins une fois               | `25_scalability/07_message_queues.md`                                                                     | rendre le handler idempotent                                   |
| Docker : `permission denied`                          | uid / permissions                         | `00_getting_started/02_shell_survival.md`                                                                 | lire des permissions Unix                                      |
| Docker : requêtes coupées au déploiement              | `SIGTERM` ignoré                          | `15_runtime_env/04_process_env_argv.md`                                                                   | implémenter un arrêt gracieux                                  |
| CI : le test échoue 1 fois sur 20                     | test flaky                                | `04_debugging/07_flaky_bugs.md`                                                                           | isoler la source de non-déterminisme                           |
| Prod : moyenne verte, clients furieux                 | p99 vs moyenne                            | `26_observability/04_metrics_alerting.md`                                                                 | raisonner en percentiles                                       |
| Prod : erreur illisible dans la trace                 | source maps absentes                      | `26_observability/07_prod_stack_trace_drill.md`                                                           | remonter à la ligne d'origine                                  |
| Python : ma closure ne modifie rien                   | `nonlocal`                                | `01_fundamentals/02_scope/`                                                                               | transférer le mécanisme entre langages                         |
| Java : `LazyInitializationException` / N+1            | chargement paresseux                      | `24_databases/05_db_in_js.md`, `08_.../03_complexity/`                                                    | reconnaître le N+1 dans tout ORM                               |
| C# : dictionnaire corrompu sous charge                | parallélisme réel                         | `03_async/07_shared_memory_concurrency.md`                                                                | comprendre ce que JS t'épargnait                               |
| IA : le code semble correct et casse en prod          | chemins d'erreur absents                  | `23_ai_native_dev/03_validate_ai_output.md`                                                               | exiger une preuve avant de faire confiance                     |

**Arme débloquée.** Tu as désormais une table de routage entre les symptômes du monde réel et les mécanismes que tu connais. C'est exactement ce qu'un senior a dans la tête : sauf que la tienne est écrite.

---
