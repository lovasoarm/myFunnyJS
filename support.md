# MyFunnyJS : Support de rappel

Ce qui doit rester dans la tête. Le reste vit dans le repo.

---

## Mode d'emploi

Ce document n'est pas un cours. C'est un filet mental. Ouvre le repo pour le détail.

Quatre marqueurs, partout, sans exception :

**Noyau ★** : la seule chose qui doit survivre du module. Si tu ne gardes qu'elle, tu retrouves ou reconstruis le reste en moins de 2 minutes.

**Piège** : l'erreur que tu vas commettre, ou que l'IA fera pour toi.

**Zappable** : périssable, ou déjà géré par ton LSP (le correcteur automatique intégré à ton éditeur, celui qui souligne tes erreurs en rouge). Le repo suffit.

**Pont** : connexion avec un autre module. C'est ce qui fait pensée.

Règle : si tu ne peux pas expliquer un item en 30 secondes, à voix haute, sans relire, il n'est pas encore à toi.

Chaque Noyau ★ pointe vers un fichier précis du repo : le grimoire de synthèse quand il existe, sinon le fichier le plus dense. C'est le seul endroit où rouvrir en cas de doute : pas besoin de fouiller le dossier entier.

---

## La carte en un coup d'œil

Avant les 34 fiches en détail, la carte complète. Le module 00 compte pour deux fiches (Getting Started et Référentiel) : au total, 34 fiches réparties sur 33 numéros de module. Tu la relis en 2 minutes quand tu veux savoir où mettre ton énergie de révision cette semaine.

| #   | Module          | Ce que tu dois en garder                       | Statut 10 ans                   |
| --- | --------------- | ---------------------------------------------- | ------------------------------- |
| 00  | Getting Started | Node LTS, `.nvmrc`, hygiène du jour 1          | Stable                          |
| 00  | Référentiel     | Révision espacée à J+1/J+7/J+21/J+60            | Intemporel                      |
| 01  | Fundamentals    | Closures, types, `===`                         | Intemporel                      |
| 02  | Problem Solving | Méthode Polya                                  | Intemporel                      |
| 03  | Async           | Boucle d'événements, micro/macrotasks          | Intemporel                      |
| 04  | Debugging       | Hypothèse avant test                           | Intemporel                      |
| 05  | Error Handling  | Erreurs typées, pas de try/catch générique     | Stable                          |
| 06  | Testing         | Comportement, pas implémentation               | Intemporel (syntaxe périssable) |
| 07  | Math            | Falsy, modulo JS, hash ≠ chiffrement           | Intemporel                      |
| 08  | Memory & Perf   | Mesurer avant d'optimiser, closures qui fuient | Intemporel                      |
| 09  | Data Structures | Map/Set en réflexe                             | Intemporel                      |
| 10  | Algorithms      | Reconnaître le pattern                         | Intemporel                      |
| 11  | Functional JS   | Pureté, immutabilité                           | Intemporel                      |
| 12  | Design Patterns | Vocabulaire commun                             | Stable                          |
| 13  | Refactoring     | Renommer avant de découper                     | Intemporel                      |
| 14  | TypeScript      | Types qui distinguent les cas, `unknown`       | **Périssable : 2027**           |
| 15  | Runtime Env     | Node vs Browser                                | Stable                          |
| 16  | Architecture    | Dépendances vers le domaine (le cœur métier)   | Intemporel                      |
| 17  | Web Concepts    | Pipeline d'affichage, connexion ≠ droits       | Stable                          |
| 18  | OOP JS          | `this`, prototype                              | Intemporel                      |
| 19  | Web Inclusive   | Accessibilité = contrainte, pas couche         | Intemporel                      |
| 20  | Realtime        | WebSocket / SSE / WebRTC, le bon choix         | Stable                          |
| 21  | API Craft       | Rejouable sans risque, limite de débit, versions | Stable                        |
| 22  | Security        | Donnée user = hostile par défaut               | Intemporel                      |
| 23  | AI-Native Dev   | 4 niveaux de validation                        | **Périssable : 2028**           |
| 24  | Databases       | Requêtes de base, transactions tout-ou-rien    | Intemporel                      |
| 25  | Scalability     | 8 croyances fausses sur le distribué           | Intemporel                      |
| 26  | Observability   | Logs + traces + indicateurs de santé           | Stable                          |
| 27  | Team Craft      | Expliquer à 3 publics                          | Intemporel                      |
| 28  | Edge Cases      | Accès concurrents = coordination               | Intemporel                      |
| 29  | AI Agents       | B.O.R.N.É., isolation obligatoire              | **Périssable : 2028**           |
| 30  | Mini-Projets    | Ce qu'ils prouvent, pas leur code              | Intemporel (la méthode)         |
| 31  | Annexes         | Ne pas coder, quand c'est mieux ainsi          | Intemporel                      |
| 32  | Tools           | 3 scripts perso, pas 30                        | Très périssable                 |

**Lecture rapide** : 22 fiches intemporelles (le socle qui ne bouge pas), 8 stables (bougent lentement), 3 explicitement datées (14, 23, 29 : à revalider à leur échéance), 1 très périssable (32, les outils changent tout le temps). Total : 34. Si tu dois choisir où réviser en premier avant un entretien : les intemporelles d'abord, elles ne périment jamais.

---

## Les six pierres

_Oublie tout, garde ça, et le reste se raccroche._

```
[ RUNTIME ]  où le code tourne vraiment
   |         (V8 = le moteur qui exécute ton JS dans Chrome/Node ;
   |          event loop = la boucle qui décide quoi exécuter, et quand ;
   |          threads = les fils d'exécution parallèles du processeur)
   v
[ MÉMOIRE ]  ce qui vit, ce qui meurt, ce qui fuit
   |
   v
[ ASYNCHRONE ] l'ordre n'est jamais celui du fichier
   |
   v
[ ARCHITECTURE ] où va quoi, et ce qui casse quand ça bouge
   |
   v
[ DEBUGGING ] hypothèse d'abord, fichier ensuite
   |
   v
[ PENSÉE TRANSFÉRABLE ] le geste survit au langage
```

**Noyau ★** : l'IA fera la syntaxe. Elle ne choisira pas à ta place, ne sécurisera pas à ta place, n'expliquera pas à ta place. Les six pierres, c'est ce qui te rend irremplaçable.
_Fichier : `31_annexes/22_PONTS_INTER_MODULES.md`_

---

## 00 · Getting Started

_installer, écrire, ne pas se perdre_

**Noyau ★** : Node ≥ 22 LTS (version longue durée, la plus stable), `.nvmrc` = ton fichier source de vérité pour la version utilisée. Vérifie `node -v` et `git --version` avant tout.
_Fichier : `00_getting_started/01_install.md`_

**Piège** : installer Node "en dur" sur ta machine ET utiliser nvm (un gestionnaire de versions Node) en même temps crée deux versions qui se battent pour savoir laquelle répond quand tu tapes `node`. Choisis un seul gestionnaire de versions (nvm, volta, ou asdf) et reste dessus.

**Zappable** : la liste complète des flags npm (les options qu'on ajoute après une commande npm). Google la ressort en 5 secondes.

**Pont** : toute la sécurité du jour 180 se joue au jour 1 : un gestionnaire de mots de passe, la double authentification (2FA, un deuxième code en plus du mot de passe), une clé SSH différente par machine (ta carte d'identité numérique pour te connecter à distance sans mot de passe), et zéro secret écrit en clair dans un fichier.

---

## 00 · Référentiel

_la boussole avant les modules_

**Noyau ★** : révision espacée : tu revois chaque module à J+1, J+7, J+21, J+60 après l'avoir appris. Sans ce rythme, 70% de ce que tu as appris disparaît en 24h.
_Fichier : `00_referentiel/00_why_referentiel.md`_

**Piège** : sauter l'auto-diagnostic trimestriel (le moment où, tous les 3 mois, tu listes toi-même ce que tu maîtrises et ce qui coince). Sans savoir où tu bloques précisément, tu ne peux pas progresser dessus.

**Pont** : le tri intemporel / stable / périssable que tu vois dans la carte plus haut gouverne tout le repo : c'est lui qui te dit où revenir en priorité.

---

## 01 · Fundamentals

_variables, scope (la zone où une variable existe et reste accessible), fonctions, types, modules_

**Noyau ★** : une closure, c'est une fonction qui se souvient encore des variables qui l'entouraient au moment où elle a été créée, même après que la fonction autour ait fini de s'exécuter. Si tu ne peux pas l'expliquer à un enfant, à un junior, et à un senior, tu ne l'as pas encore comprise.
_Fichier : `01_fundamentals/02_scope/02_closure_trap.md`_

**Noyau** : fonction déclarée / fonction expression / fonction fléchée (`() => {}`) sont 3 objets différents, pas 3 façons d'écrire la même chose. La fléchée n'a ni `this` (le contexte d'appel), ni `arguments` (la liste des arguments reçus), ni prototype (le modèle dont hérite un objet). C'est un choix qui change le sens du code, pas juste son look.

**Piège** : `typeof null` renvoie `"object"` (un bug historique de JavaScript qu'on ne peut plus corriger sans tout casser, alors on vit avec). Utilise toujours `===` (égalité stricte, sans conversion de type) plutôt que `==`. Seule exception tolérée : `x == null`, qui teste "null ou undefined" en une seule comparaison.

**Zappable** : `let`/`const` par défaut, `var` jamais. Inutile d'apprendre les regex (motifs de recherche dans du texte) par cœur : retiens juste que `(?:...)` existe, que les lookaheads existent (regarder ce qui suit sans le consommer), et que dès qu'une regex devient longue et complexe, il vaut mieux appeler un vrai parseur (un outil dédié à lire une structure, comme du JSON ou du HTML).

**Pont** : les closures reviennent partout : dans l'asynchrone (les callbacks les utilisent), dans la mémoire (elles peuvent créer des fuites), et dans le fonctionnel (elles permettent la composition de fonctions).

---

## 02 · Problem Solving

_la méthode de Polya, décomposer et modéliser avant de coder_

**Noyau ★** : méthode de Polya, dans cet ordre strict : comprendre le problème → planifier une approche → exécuter → réviser le résultat. La cause n°1 des bugs qu'on croit "techniques" est en réalité un malentendu sur ce qui était demandé.
_Fichier : `02_problem_solving/01_polya_method.md`_

**Piège** : une spécification floue n'est jamais neutre : elle te refile silencieusement la décision que quelqu'un aurait dû prendre. Reformule le besoin à l'écrit avant de coder. Si le modèle du problème ne tient pas sur une feuille de papier, le code ne tiendra pas dans ta tête non plus.

**Zappable** : les 12 heuristiques (astuces de résolution) que chaque bouquin réinvente sous un nom différent. Garde juste Polya, ça couvre l'essentiel.

---

## 03 · Async

_callbacks, promises, async/await, boucle d'événements (event loop)_

**Noyau ★** : un seul thread (fil d'exécution) en JavaScript. Une seule pile d'appel (call stack, la liste des fonctions en train de s'exécuter, empilées). Une file de microtasks (les Promises, `queueMicrotask`) et une file de macrotasks (`setTimeout`, les entrées/sorties). Les microtasks se vident entièrement avant qu'une seule macrotask ne passe.
_Fichier : `03_async/04_event_loop/03_event_loop_grimoire.md`_

```
[ CALL STACK ] <-- vidée en premier, toujours
    |
    v (stack vide ?)
[ MICROTASK QUEUE ]  <-- Promises, queueMicrotask : vidée ENTIÈREMENT avant la suite
    |
    v (microtasks vidées ?)
[ MACROTASK QUEUE ]  <-- setTimeout, setInterval, I/O : UNE tâche à la fois
    |
    v
  retour au call stack, le cycle recommence
```

**Noyau** : `async/await` n'est qu'une façon plus lisible d'écrire des promesses, qui elles-mêmes ne sont qu'une façon plus lisible d'écrire des callbacks. Connaître la couche du dessous rend le bug lisible au lieu de magique.

**Piège** : `await` dans une boucle `for...of` lance les requêtes une par une (en série), même si elles ne dépendent pas les unes des autres. `Promise.all` sur un `map` les lance toutes en même temps (en parallèle) : plus rapide, mais ça coûte cher en prod si tu en lances trop d'un coup. Un `throw` (une erreur levée) dans une Promise que personne n'attend devient une erreur silencieuse (`unhandledRejection`) : mets toujours un `.catch` ou un `try/await`.

**Zappable** : `SharedArrayBuffer` et `Atomics` (des outils bas niveau pour partager de la mémoire entre threads) : sache juste que ça existe, évite tant que possible.

**Pont** : le temps réel (module 20), l'observabilité (module 26), et les accès concurrents (module 28) partent tous de ce module.

---

## 04 · Debugging

_la méthode avant l'outil_

**Noyau ★** : écris ton hypothèse par écrit avant de tester quoi que ce soit. Pas de reproduction du bug (le refaire arriver exprès, à volonté), pas de correction valable. Une correction sans reproduction, c'est de la superstition, pas de l'ingénierie.
_Fichier : `04_debugging/05_hypothesis_driven_debug.md`_

**Piège** : un test "flaky" (qui plante au hasard, sans raison apparente) n'est pas juste lent, c'est le signe d'une hypothèse fausse sur le déterminisme du code. Si tu le supprimes sans comprendre pourquoi il plante, ça devient une vraie race condition (bug de timing) en prod plus tard. Bug généré par l'IA vs bug humain : l'IA invente ce qui ressemble à une bonne réponse (des imports qui n'existent pas, des API inventées), l'humain se plante par fatigue. Ce sont deux façons différentes de relire le code.

**Zappable** : les raccourcis clavier des DevTools (les outils de développement du navigateur) : tu les apprends au fil de l'eau, pas besoin de les bachoter.

---

## 05 · Error Handling

_try/catch n'est pas une stratégie_

**Noyau ★** : une hiérarchie d'erreurs typées (des classes d'erreurs précises, une par type de problème) vaut mieux que cent try/catch génériques. Utilise `extends Error`, garde toujours la stack (la trace qui montre d'où vient l'erreur), et ajoute un `cause` (la raison d'origine, quand une erreur en cache une autre).
_Fichier : `05_error_handling/02_custom_errors.md`_

**Piège** : un `throw` dans un `setTimeout` ou un `forEach` asynchrone ne remonte à personne : l'erreur disparaît dans le vide. Choisis explicitement qui va l'attraper, et à quel niveau du code.

**Zappable** : 3 questions à te poser pour chaque erreur (est-ce que je réessaie ? est-ce que je fais échouer fort et clair ? est-ce que j'envoie un événement métier ?) : à répondre au moment où tu conçois le code, pas au moment où le bug arrive.

---

## 06 · Testing

_stratégie avant framework_

**Noyau ★** : un test vérifie un comportement (ce que le code doit garantir), pas une implémentation (comment il le fait en interne). Nomme tes tests par ce qu'ils garantissent, pas par la fonction qu'ils appellent.
_Fichier : `06_testing/01_unit_sniper.md`_

**Piège** : mocker (remplacer par une version fake) ce que tu possèdes toi-même est un anti-pattern (une mauvaise pratique reconnue) : on mock la frontière du système : le réseau, l'horloge, le système de fichiers : pas ton propre code. Confondre couverture de test et confiance réelle : un test de bout en bout (E2E, qui simule un vrai utilisateur qui clique) qui passe ne couvre souvent qu'un seul chemin, le chemin heureux, pas les cas limites.

**Zappable** : la syntaxe précise de Jest, Vitest ou Playwright (les outils de test) est périssable, elle change avec le temps. Le raisonnement sur "quoi tester" est intemporel. Le TDD (écrire le test avant le code) est un outil pour concevoir, pas juste pour vérifier après coup.

---

## 07 · Math

_juste ce qu'il faut pour ne pas se faire piéger_

**Noyau ★** : les valeurs "falsy" (qui deviennent `false` dans un `if`) : `0`, `''`, `null`, `undefined`, `NaN`, `false`. Avec la loi de De Morgan (une règle qui dit comment transformer un ET/OU niés) et le court-circuit (`&&`/`||` qui arrêtent l'évaluation dès que le résultat est connu), tu couvres la moitié des bugs de conditions.
_Fichier : `07_math_basics/01_boolean_logic.md`_

**Piège** : `-1 % 3` renvoie `-1` en JavaScript, pas `2`. Le modulo "mathématique" (qui donne toujours un résultat positif) n'est pas celui de JS.

**Zappable** : un hash (une empreinte à sens unique) n'est pas un chiffrement (réversible avec une clé) : confondre les deux ouvre de vraies failles de sécurité. La géométrie et les probabilités avancées : à revoir seulement au besoin.

---

## 08 · Memory & Performance

_mesurer avant d'optimiser_

**Noyau ★** : aucune optimisation sans avoir mesuré d'abord. Utilise l'onglet Performance de Chrome, `node --inspect`, ou un heap snapshot (une photo de tout ce qui est en mémoire à un instant donné). Sinon, tu chasses un fantôme.
_Fichier : `08_memory_performance/04_profiling/01_profiling_basics.md`_

**Noyau** : les objets sont passés par référence (une adresse mémoire partagée), les primitives (nombres, chaînes, booléens) par valeur (une copie). Une closure qui garde une référence vers un gros objet le maintient artificiellement en vie en mémoire : c'est la cause n°1 des fuites mémoire.

```
STACK             HEAP
+----------------+       +------------------------+
| a -> 42    |       |            |
| obj -> 0x4F2A ----------->   | 0x4F2A : { x: 1, y: 2 } |
| obj2 -> 0x4F2A --------/    |            |
+----------------+       +------------------------+

obj et obj2 pointent vers LA MÊME adresse mémoire.
Muter obj.x modifie ce que obj2 voit aussi.
```

**Zappable** : la notation Big-O (comment le temps d'exécution grandit avec la taille des données) : `O(1)` constant, `O(log n)` logarithmique, `O(n)` linéaire, `O(n log n)`, `O(n²)` quadratique, `O(2ⁿ)` exponentiel. Retiens l'ordre et le sens, pas les formules par cœur. Les "hidden classes" et "inline caches" de V8 (des optimisations internes du moteur JS) : fascinant à lire, rarement quelque chose que tu contrôles directement.

**Pont** : les fuites mémoire viennent presque toujours d'un code asynchrone mal géré ou d'un listener (un écouteur d'événement) jamais retiré.

---

## 09 · Data Structures

_les 8 qui suffisent 95% du temps_

**Noyau ★** : `Map` dès que tu as des clés dynamiques (qui changent), `Set` pour garantir l'unicité des valeurs. Ces deux réflexes valent 10 optimisations plus compliquées.
_Fichier : `09_data_structures/07_hash_table/01_hash_table_basics.md`_

**Piège** : un tableau (`Array`) a un accès en `O(1)` (instantané) mais une insertion en tête en `O(n)` (qui ralentit avec la taille). `splice` modifie le tableau original, `slice` en fait une copie : confondre les deux est un classique en relecture de code.

**Zappable** : un tas (heap) sert de file de priorité (pour de l'ordonnancement de tâches, ou trouver le top-K des plus grands éléments). Un graphe dès qu'on parle de relations entre éléments (BFS pour un parcours simple non pondéré, Dijkstra quand chaque lien a un coût différent). Les arbres AVL, B-tree en détail : à revoir juste avant un entretien technique poussé, pas au quotidien.

---

## 10 · Algorithms

_reconnaître le pattern, pas réciter le code_

**Noyau ★** : recherche binaire (couper l'espace de recherche en deux à chaque fois) sur une liste triée, table de hash sinon. Toute autre variante que tu croises est un cas particulier de l'un des deux.
_Fichier : `10_algorithms/02_searching/01_linear_binary.md`_

**Piège** : un algorithme en `O(n²)` qui passe très bien en dev (avec peu de données) meurt dès qu'il touche 10⁵ éléments en prod. Annonce toujours la complexité de ton algo dans ta Pull Request (ta demande de fusion de code).

**Zappable** : `Array.sort` est stable (garde l'ordre des éléments égaux) depuis 2019. Le vrai skill de la programmation dynamique (DP : découper un problème en sous-problèmes qu'on résout une fois et qu'on réutilise) c'est de reconnaître les sous-problèmes qui se répètent, pas de coder la table de mémoïsation par cœur.

---

## 11 · Functional JS

_pas de dogme, quelques réflexes_

**Noyau ★** : une fonction pure (même entrée = toujours même sortie, sans effet de bord ailleurs) est la brique la plus facile à tester. L'immutabilité par défaut (ne jamais modifier une donnée, en créer une nouvelle à la place) élimine une classe entière de bugs.
_Fichier : `11_functional_js/01_pure_functions.md`_

**Piège** : le "curry" à outrance (transformer une fonction à plusieurs arguments en une chaîne de fonctions à un seul argument chacune) a la même odeur que la sur-ingénierie orientée objet. Currifie seulement quand ça rend le code plus clair, pas par principe.

**Zappable** : écrire ton propre `Symbol.iterator` (pour rendre un objet "parcourable" avec une boucle) : rare en pratique. `for...of`, les générateurs, et le spread (`...`) suffisent dans l'immense majorité des cas.

**Pont** : ce module éclaire les design patterns (Strategy et Decorator sont en fait des fonctions d'ordre supérieur déguisées) et le refactoring.

---

## 12 · Design Patterns

_vocabulaire, pas recettes_

**Noyau ★** : un pattern (une solution nommée à un problème récurrent) permet à deux devs de se comprendre en 3 mots au lieu de 3 paragraphes. C'est toute sa valeur.
_Fichier : `12_design_patterns/04_patterns_grimoire.md`_

**Piège** : nommer le pattern après avoir écrit le code, pas avant de commencer. Se dire "je vais faire un Visitor" en premier produit presque toujours plus de code que de valeur réelle apportée.

**Zappable** : un Singleton (un objet dont il n'existe qu'une seule instance) en JavaScript, c'est juste... un module. Préfère ça à une vraie classe Singleton.

---

## 13 · Refactoring

_détecter avant de réécrire_

**Noyau ★** : un nom qui ment sur ce qu'il fait coûte plus cher qu'une fonction trop longue. Renommer une variable ou une fonction est le refactoring le plus rentable qui existe.
_Fichier : `13_refactoring/01_clean_code_basics.md`_

**Piège** : refactoriser un code que tu ne peux pas expliquer à voix haute, c'est garantir des régressions silencieuses (des bugs qui reviennent sans prévenir).

**Zappable** : le SRP (une fonction ou une classe ne devrait faire qu'une seule chose) et le DIP (dépendre d'une interface générale plutôt que d'un détail concret) sont utiles au quotidien. L'OCP (le code devrait être ouvert à l'extension, fermé à la modification directe) sert souvent d'excuse à une abstraction ajoutée trop tôt, avant d'en avoir vraiment besoin. Une duplication de structure (deux bouts de code qui se ressemblent) est souvent un faux problème ; une duplication de logique métier (la même règle codée deux fois) est un vrai signal à corriger.

---

## 14 · TypeScript

_périssable 2027 : vérifie l'année en te relisant_

**Noyau ★** : les "discriminated unions" (un type qui regroupe plusieurs formes possibles d'une donnée, avec un champ qui dit laquelle c'est exactement) sont ta meilleure défense contre les états impossibles dans ton code. Combinées aux types primitifs, aux unions (`A | B`), aux littéraux, au narrowing (réduire un type large à un type précis selon le contexte) et aux type guards (des fonctions qui confirment un type), ces briques suffisent à lire 90% des codebases TypeScript.
_Fichier : `14_typescript/02_ts_intermediate/04_type_guards.md`_

**Noyau** : `any` n'est pas vraiment "typé", c'est une trappe qui désactive toutes les vérifications de TypeScript. `unknown` t'oblige à vérifier le type avant de l'utiliser (le narrowing) : c'est lui, le vrai remplaçant sûr de `any`.

**Zappable** : les génériques (`<T>`) ne sont qu'une "variable de type", pas de la magie : c'est `keyof` (récupérer les noms des propriétés d'un type), `typeof`, et l'accès indexé qui sont le vrai pouvoir de TypeScript. Dans ton `tsconfig` (le fichier de config TS), active `strict` (toutes les vérifications strictes), `noUncheckedIndexedAccess` (force à vérifier qu'un élément d'un tableau existe avant de l'utiliser), et `exactOptionalPropertyTypes` (interdit de confondre "propriété absente" et "propriété à `undefined`"). Les types conditionnels, les template literal types, et les mapped types récursifs : au repo, à consulter au besoin.

---

## 15 · Runtime Env

_où le code tourne, et ce que ça change_

**Noyau ★** : côté Node (serveur) : `fs` (fichiers), `process` (infos sur l'environnement d'exécution), les streams (flux de données). Côté navigateur : le DOM (la représentation de la page), les Web APIs. Les deux environnements ont en commun `fetch` et `Promise`.
_Fichier : `15_runtime_env/01_node_vs_browser.md`_

```
              L'APPLICATION
    ________________________________________________
    |                        |
    |  NODE (serveur)       BROWSER (client)  |
    |                        |
    |  fs (fichiers)       DOM        |
    |  process (env, args)    Web APIs      |
    |  streams          fetch, Promise  |
    |  http/net          (les deux les ont) |
    |________________________________________________|
```

**Piège** : mélanger `require` (l'ancien système d'import) et `import` (le nouveau) dans un même paquet est une source majeure de bugs d'empaquetage : c'est le champ `type: "module"` dans `package.json` qui tranche lequel utiliser. `process.env` (les variables d'environnement) est toujours une chaîne de texte : `'false'` est "truthy" (considéré vrai dans un `if`), `'0'` aussi. Il faut toujours convertir explicitement.

**Zappable** : un stream traite les données morceau par morceau, indispensable pour les gros fichiers, les uploads, ou les logs. Les `worker_threads` (des threads séparés pour paralléliser du travail) : rares en pratique, car les faire communiquer entre eux coûte cher.

---

## 16 · Architecture

_où va quoi, et pourquoi_

**Noyau ★** : Clean Architecture, une seule règle à retenir : les dépendances pointent toujours vers le domaine (le cœur métier de l'application), jamais l'inverse.
_Fichier : `16_architecture_patterns/04_clean_architecture.md`_

```
[ UI / Présentation ]
    |
    v (dépend de)
[ Domaine / Logique métier ]
    ^
    | (dépend de, via interface)
[ Infra / DB, API externes, framework ]
```

La flèche entre Domaine et Infra pointe vers le HAUT : c'est l'infrastructure (la base de données, les API externes) qui implémente une interface définie par le domaine, pas l'inverse. Si tu changes de base de données, le domaine ne bouge pas d'une ligne.

**Piège** : adopter une architecture pour son prestige, pas pour un besoin réel. Le vrai test à te poser : qu'est-ce qui casse concrètement si l'exigence métier change ?

**Zappable** : lancer des microservices avant d'être une équipe de 20 devs, c'est de la dette technique choisie volontairement. Le pattern MVC : le Modèle a bien résisté au temps, la Vue et le Contrôleur se sont dilués dans les frameworks modernes.

---

## 17 · Web Concepts

_ce que tout dev web sait à froid_

**Noyau ★** : le pipeline d'affichage d'une page : parse (lire le HTML) → DOM (construire l'arbre de la page) → CSSOM (construire l'arbre des styles) → layout (calculer les positions) → paint (dessiner les pixels) → composite (assembler les calques déjà dessinés). Un "reflow" (recalculer toute la mise en page) coûte cher en performance, un "composite" (juste réafficher des calques déjà prêts) ne coûte presque rien. Ça guide 100% de l'optimisation front.
_Fichier : `17_web_concepts/02_browser_render_pipeline.md`_

**Piège** : l'authentification (auth, prouver qui tu es) n'est pas l'autorisation (authz, avoir le droit de faire une action précise). Un utilisateur connu et identifié n'est pas forcément autorisé à tout faire. Confondre les deux, c'est ouvrir la porte à une escalade de privilège (accéder à des droits qu'on n'a pas).

**Zappable** : les méthodes HTTP idempotentes (rejouables sans risque : `GET`, `PUT`, `DELETE`) contre les non-idempotentes (`POST`, `PATCH`), et les codes de statut 2xx/3xx/4xx/5xx : c'est ta grille de lecture des logs serveur. SSR (rendu généré côté serveur à chaque requête), SSG (généré une fois à l'avance), ISR (généré à l'avance puis régénéré de temps en temps), CSR (rendu directement dans le navigateur) : choisis selon ton besoin d'indexation par les moteurs de recherche, pas par mode du moment.

---

## 18 · OOP JS

_prototype, this, et pourquoi ça vaut d'être compris_

**Noyau ★** : `this` est déterminé au moment de l'appel de la fonction, pas au moment où elle est définie. Seule exception : la fonction fléchée, qui capture `this` de son environnement de création. Le reste n'est qu'un cas particulier de cette règle.
_Fichier : `18_oop_js/04_this_keyword_rules.md`_

**Piège** : oublier que `class` n'est qu'une écriture plus lisible par-dessus les prototypes (le mécanisme d'héritage natif de JS). `Object.getPrototypeOf` remonte la chaîne de prototypes et règle 100% des "pourquoi cette méthode n'est pas trouvée".

**Zappable** : préfère la composition (assembler des objets) à l'héritage (hérite uniquement quand la relation "est un" tient vraiment pour 100% des méthodes). `call`/`apply`/`bind` : `bind` fige définitivement le contexte `this`, `call`/`apply` l'invoquent directement : utile pour les callbacks qui perdent leur contexte d'origine.

---

## 19 · Web Inclusive

_accessibilité (a11y) et internationalisation (i18n), pas des couches ajoutées après_

**Noyau ★** : l'accessibilité est une contrainte de conception dès le départ, pas une couche qu'on ajoute à la fin. Un composant inaccessible est un composant cassé, pour environ 15% des utilisateurs.
_Fichier : `19_web_inclusive/01_a11y_why_it_matters.md`_

**Piège** : un attribut ARIA (des attributs HTML qui décrivent un élément aux lecteurs d'écran) mal utilisé est pire que pas d'ARIA du tout. Utilise du HTML sémantique (`button`, `nav`, `main` : des balises qui ont un sens clair) avant tout `role="..."` ajouté à la main.

**Zappable** : le focus visible (voir où on en est au clavier), une tabulation logique, et la touche Escape qui ferme les fenêtres modales : ça couvre 80% des audits d'accessibilité. Le niveau WCAG AA (la norme d'accessibilité web) demande un rapport de contraste d'au moins 4.5:1 pour du texte normal, 3:1 pour du grand texte.

**Pont** : pour l'internationalisation : les bibliothèques changent souvent, mais les règles de pluralisation, le format des dates, et le sens de lecture restent.

---

## 20 · Realtime

_trois transports, trois compromis_

**Noyau ★** : WebSockets : bidirectionnel (les deux côtés peuvent parler en même temps), stateful (la connexion garde un état, coûteux à faire grossir à l'échelle) : pour le chat, la collaboration en direct, le jeu en ligne. SSE (Server-Sent Events) : uniquement serveur vers client, mais sur du HTTP simple : pour les notifications, les fils d'actualité. WebRTC : de pair à pair (les appareils se parlent directement), complexe à mettre en place (STUN/TURN/signaling, des mécanismes pour connecter deux appareils derrière des box internet différentes) : pour la voix et la vidéo.
_Fichier : `20_realtime/04_realtime_grimoire.md`_

```
WEBSOCKETS         SSE              WEBRTC
::::::::::         :::              ::::::
bidirectionnel       server -> client seul     peer-to-peer
stateful          sur HTTP simple        STUN/TURN/signaling
coûteux à scaler      simple à mettre en place   complexe
chat, collab, jeu     notifs, feeds         voix, vidéo
```

**Piège** : partir sur des WebSockets par défaut est l'erreur la plus fréquente. Le SSE suffit dans environ 60% des cas, et t'évite l'enfer de la reconnexion automatique.

**Pont** : le temps réel révèle tous les bugs asynchrones mal gérés, tous les manques d'observabilité, et tous les raccourcis de sécurité pris ailleurs.

---

## 21 · API Craft

_REST et au-delà_

**Noyau ★** : des ressources nommées au pluriel, des verbes HTTP porteurs de sens, des statuts de réponse corrects. L'idempotence (`GET`/`PUT`/`DELETE` peuvent être rejoués plusieurs fois sans changer le résultat, contrairement à `POST`) couvre 80% d'une bonne API.
_Fichier : `21_api_craft/08_api_grimoire.md`_

```
CLIENT
 |
 v
[ Middleware: auth ]    (vérifie le token, sinon coupe ici)
 |
 v
[ Middleware: validation ] (vérifie le payload, sinon coupe ici)
 |
 v
[ Middleware: rate limit ] (trop de requêtes ? coupe ici aussi)
 |
 v
[ Handler ]         (logique métier, génère la réponse)
 |
 v
[ Middleware: error handler ] (catch les erreurs remontées)
 |
 v
CLIENT (réponse)
```

**Noyau** : la limite de débit (rate limiting, limiter le nombre de requêtes par utilisateur) et le versioning (gérer plusieurs versions d'une API en même temps) ne sont pas des extras, ce sont les deux trucs qu'on ajoute toujours trop tard. Mets une limite de débit dès le premier endpoint public (contre le brute-force et les abus). Casser une API en silence, sans prévenir, c'est le pire souvenir que tu peux laisser à un client qui l'utilise.

**Piège** : un JWT (JSON Web Token, un jeton qui prouve ton identité) n'est pas chiffré, il est juste signé : n'importe qui peut le lire, mais personne ne peut le falsifier sans la clé. Zéro secret dedans, et vérifie toujours la signature. En GraphQL, le problème N+1 (un même resolver, la fonction qui va chercher une donnée, se retrouve appelé N fois au lieu d'une seule) est LE piège classique : un DataLoader regroupe ces appels en un seul et le résout.

**Zappable** : garde un format d'erreur cohérent (type, message, code, détails) pour que le client puisse le traiter sans avoir à le deviner. La syntaxe exacte de GraphQL est périssable, mais le principe (un schéma fort, surveiller le N+1) reste vrai.

**Pont** : la sécurité (JWT, limite de débit) et l'observabilité (le versioning, c'est ce que tu dois tracer en prod) recoupent directement ce module.

---

## 22 · Security

_OWASP (Open Web Application Security Project, la référence mondiale des failles web les plus courantes) dans le sang_

**Noyau ★** : toute donnée envoyée par un utilisateur est hostile jusqu'à preuve du contraire. Échappe les données à l'affichage (pour éviter qu'un bout de code s'exécute par erreur), utilise des requêtes préparées (prepared statements, qui séparent la requête SQL des données), et jamais `innerHTML` sur du contenu non contrôlé.
_Fichier : `22_security/07_security_grimoire.md`_

**Noyau** : les 3 fautes qui reviennent le plus en prod, dans l'ordre où elles font le plus mal :

```
[ Mot de passe en MD5/SHA (hash rapide, cassable en masse) ]
     |
     v (corrige avec)
[ bcrypt / argon2 / scrypt : des hash volontairement lents ]

[ Rôle utilisateur lu depuis le cookie ou le body de la requête ]
     |
     v (corrige avec)
[ Rôle TOUJOURS relu depuis le token signé côté serveur ]

[ JWT stocké en localStorage (accessible en JavaScript) ]
     |
     v (corrige avec)
[ Access token en mémoire, refresh token en cookie httpOnly ]
     accessible par une faille XSS       inaccessible en JS, donc protégé
```

**Piège** : la pollution de prototype : `Object.assign({}, req.body)` sans filtre permet à un attaquant d'injecter une clé `__proto__` et de modifier le comportement global de tes objets. Utilise `Object.create(null)` ou une `Map` pour l'éviter. L'IDOR (accéder à la ressource d'un autre utilisateur juste en changeant un identifiant dans l'URL) se corrige avec une double vérification systématique (`WHERE id = $1 AND user_id = $2`), pas une vérification ponctuelle qu'on peut oublier.

**Zappable** : le Top 10 OWASP (la liste des failles les plus fréquentes) change peu d'une année à l'autre, la relire chaque année vaut 10 formations. `npm install` exécute du code écrit par d'autres : un SBOM (la liste complète de tout ce qui compose ton appli) et un audit régulier des dépendances ne sont plus optionnels. Le CORS n'est pas un mécanisme de sécurité en soi, c'est une relaxation contrôlée d'une restriction de sécurité (le "same-origin").

---

## 23 · AI-Native Dev

_collaborer avec l'IA, pas lui déléguer : périssable 2028, un an de plus que prévu au départ_

**Noyau ★** : l'IA propose, c'est toi qui décides. La signature d'un dev qui a compris ce qu'il fait : il peut expliquer ce qu'il a accepté ET ce qu'il a refusé, et pourquoi.
_Fichier : `23_ai_native_dev/12_ai_grimoire.md`_

**Noyau** : 4 niveaux de validation, cumulatifs : jamais un seul qui suffit à lui tout seul :

```
[ Lecture critique du code généré ]
    |
    v
[ Exécution réelle ] <-- un test qui passe est la seule vraie preuve,
    |          "ça a l'air correct" n'en est pas une
    v
[ Vérification de la doc officielle ] <-- pour tout import inconnu
    |
    v
[ Relecture par un pair humain ] <-- sur la sécurité et l'architecture uniquement
```

_Fichier : `23_ai_native_dev/03_validate_ai_output.md`_

**Piège** : l'IA invente des API avec un aplomb total : elle génère ce qui ressemble à la bonne réponse, pas forcément ce qui l'est vraiment. Vérifie toujours la doc avant d'accepter un import que tu ne connais pas. Jamais de secret dans un prompt, jamais de code d'un client sans autorisation explicite.

**Zappable** : un prompt utile est spécifique, contextualisé, et donne un critère de succès clair.

**Pont** : ce module éclaire le testing (ne fais jamais confiance aveuglément aux tests générés par l'IA), les agents autonomes (module 29, même échéance de péremption : 2028), et toute la surface sécurité.

---

## 24 · Databases

_SQL d'abord, NoSQL quand c'est justifié_

**Noyau ★** : `SELECT` (choisir des colonnes), `JOIN` (relier deux tables entre elles), `GROUP BY` (regrouper des lignes pour calculer des totaux), et les index (des raccourcis de recherche) couvrent 90% du besoin. Un dev qui ne sait pas lire un `EXPLAIN` (la commande qui montre comment la base va exécuter ta requête) se prive du seul vrai outil pour comprendre la performance d'une base de données.
_Fichier : `24_databases/06_databases_grimoire.md`_

**Noyau** : une transaction est un bloc d'opérations exécuté comme un tout indivisible : soit tout passe, soit rien ne passe. C'est la garantie ACID qui l'assure : Atomicité (tout ou rien), Cohérence (la base reste dans un état valide), Isolation (deux transactions ne se marchent pas dessus), Durabilité (une fois validé, ça reste enregistré même en cas de panne).

```
[ BEGIN ]
   |
   v
[ UPDATE compte_A ]
   |
   v
[ UPDATE compte_B ]  <-- si le serveur crash ICI, sans transaction :
   |            compte_A débité, compte_B jamais crédité
   v
[ COMMIT ] -- tout passe ensemble, ou rien ne passe (ROLLBACK)
```

Le risque réel sans transaction : un crash serveur entre deux `UPDATE` liés laisse la donnée à moitié faite. Ça n'apparaît jamais en dev, ça arrive en prod, sous charge, au pire moment.
_Fichier : `24_databases/03_data_modeling.md`_

**Piège** : choisir du NoSQL juste pour éviter d'apprendre le SQL se paye cash au premier vrai rapport analytique à sortir. Un cache sans TTL (durée de vie avant expiration) et sans stratégie de mise à jour, c'est une donnée fausse servie avec toute la confiance du monde.

**Zappable** : modélise d'abord tes données, choisis la technologie après. Une bonne normalisation (organiser les données sans doublons) évite dix caches ajoutés plus tard en rustine.

**Pont** : les transactions recoupent la gestion d'erreur (module 05) : qui annule quoi, à quel niveau, si une opération composée de plusieurs étapes échoue à mi-chemin.

---

## 25 · Scalability

_avant de scaler (faire grossir), mesurer_

**Noyau ★** : les 8 croyances fausses classiques sur les systèmes distribués (par exemple : croire que le réseau est fiable, que la latence est nulle, ou que la bande passante est infinie : la liste complète des 8 est dans le fichier source). À relire tous les ans, elles ne prennent pas une ride.
_Fichier : `25_scalability/03_distributed_fallacies.md`_

**Piège** : scaler à la verticale (une machine plus puissante) est simple, mais ça plafonne et échoue tout d'un coup en cas de panne. Scaler à l'horizontale (plusieurs machines) demande de la coordination entre elles. Choisis selon le coût opérationnel réel, pas par élégance technique.

**Zappable** : les files de messages (message queues) livrent "au moins une fois" par défaut (un message peut arriver en double, jamais zéro fois) : l'idempotence côté récepteur est ta seule vraie protection contre les doublons. Le "token bucket" (chaque requête consomme un jeton, les jetons se rechargent avec le temps) est la méthode standard pour limiter le débit, à appliquer à plusieurs niveaux : par IP, par utilisateur, par endpoint.

---

## 26 · Observability

_les trois piliers, réellement_

**Noyau ★** : des logs structurés (au format JSON, avec des niveaux de gravité et un identifiant de corrélation qui suit une même requête à travers tous les services) + des traces distribuées (le chemin complet d'une requête à travers plusieurs services) + les indicateurs RED (Rate, Errors, Duration : pour les services) ou USE (Utilization, Saturation, Errors : pour les ressources comme le CPU ou la mémoire). Sans ça, un bug dans un système à plusieurs services devient un vrai mystère à résoudre.
_Fichier : `26_observability/02_distributed_tracing.md`_

**Piège** : logger un secret par accident est aussi grave que de le committer (l'enregistrer) dans le code. Audite tes logs comme tu auditerais du code source.

**Zappable** : reproduire un bug en local à partir des seuls indices trouvés en prod, c'est un geste de senior. Une stack trace anonymisée (sans données personnelles) accompagnée du contexte utilisateur suffit souvent à y arriver.

---

## 27 · Team Craft

_ce qui te rend embauchable en 2035_

**Noyau ★** : sache expliquer la même chose à un enfant, à un pair développeur, et à un décideur non-technique. C'est ce qui sépare ceux qui ont vraiment compris de ceux qui ont juste lu.
_Fichier : `27_team_craft/12_three_audiences_intro.md`_

**Piège** : une Pull Request (PR, une demande de fusion de code) se relit d'abord pour son intention, avant même son diff (les lignes changées). Sans poser de question dessus, ce n'est pas une vraie review, c'est une approbation polie qui ne sert à rien. Dire "je ne sais pas encore, je regarde et je reviens" est plus professionnel qu'une réponse inventée sur le moment : c'est l'antidote au bullshit que l'IA rend plus facile à produire.

**Zappable** : un ADR (Architecture Decision Record, un petit document qui capture une décision technique) note le contexte, la décision prise, les alternatives envisagées, et les conséquences. Six mois plus tard, il t'évite de rejouer le même débat depuis zéro.

---

## 28 · Edge Cases

_les traîtres de JavaScript_

**Noyau ★** : une race condition (un bug qui dépend de l'ordre d'exécution de deux bouts de code en même temps) ne se corrige jamais en réessayant simplement, mais par de la coordination : un mutex (un verrou qui empêche deux bouts de code de toucher la même donnée en même temps), une transaction, ou un verrou optimiste (on vérifie juste avant d'enregistrer que rien n'a changé entre-temps).
_Fichier : `28_edge_cases/05_race_condition_hunter.md`_

**Piège** : `null` vs `undefined` : fige une convention d'équipe dès le départ, sinon ce sont des débats sans fin. Une clé `__proto__` dans un JSON qu'on vient de parser peut réécrire toute la chaîne de prototypes (ça rejoint la pollution de prototype du module 22).

**Zappable** : `NaN !== NaN` est vrai en JS, `Number.isNaN` est le seul test fiable pour le détecter. `0.1 + 0.2 !== 0.3` : pour manipuler de l'argent, utilise toujours une bibliothèque de calcul dédiée, jamais des nombres à virgule flottante bruts.

---

## 29 · AI Agents & Autonomy

_au-delà du simple copilote : périssable 2028, même échéance que le module 23_

**Noyau ★** : un copilote suggère → tu valides toi-même chaque étape. Un agent agit sur plusieurs étapes sans validation entre chacune. La différence, c'est un facteur de risque, pas un facteur de productivité.
_Fichier : `29_ai_agents_and_autonomy/01_agents_vs_copilots.md`_

**Noyau** : le format B.O.R.N.É., pour donner à un agent une spécification qu'il peut exécuter sans avoir à deviner. Cinq lettres, cinq vérifications, aucune n'est optionnelle :

```
B  Behavior          que doit faire le système APRÈS la tâche ? (un verbe d'action précis,
                     pas un ressenti du genre "améliorer l'auth")
O  Observability     quelle commande ou quel log prouve le succès, sans ambiguïté possible ?
R  Regression tests  quels tests déjà existants doivent continuer à passer après le changement ?
N  Non-goals         qu'est-ce que l'agent n'a explicitement PAS le droit de toucher ?
É  Escape hatch      un signal de sortie clair : "si tu n'y arrives pas, dis-le, n'improvise pas"
```

Chaque lettre saute = un audit d'une heure garanti à la fin. Chaque minute passée à remplir ces 5 cases t'en économise 10 en audit, et t'évite 3 mois de dette technique invisible.
_Fichier : `29_ai_agents_and_autonomy/02_verifiable_specifications.md`_

**Piège** : un agent qui a fait 30 appels d'affilée et qui propose une Pull Request n'est pas une autorité à qui faire confiance par défaut : refuser une trace d'exécution opaque (qu'on ne peut pas suivre étape par étape) fait partie du métier. Un agent sans bac à sable (sandbox, un environnement isolé) est un incident qui attend juste son heure : isolation du réseau, du système de fichiers, et des secrets, par défaut, systématiquement.

**Zappable** : un agent n'est vraiment utile que sur une spécification vérifiable (un critère binaire, des tests, un contrat clair). Sinon, c'est juste du plausible facturé au token.

**Pont** : même échéance de péremption que le module 23 (2028) : ce qui reste vrai des deux modules, c'est le principe de garder le contrôle, pas l'outil du moment.

---

## 30 · Mini-Projets

_où les concepts s'assemblent_

**Noyau ★** : on ne mémorise pas le code des projets, on retient ce qu'ils prouvent qu'on sait faire. Chaque projet se clôt par un POSTMORTEM (un bilan écrit après coup) signé : sans postmortem, c'est comme si le projet n'avait pas eu lieu.
_Fichier : `30_mini_projects/_templates/01_POSTMORTEM_TEMPLATE.md`_

**Piège** : une case "SECURITY_GATE" (le passage obligé de vérification sécurité) cochée sans preuve à l'appui, c'est une case cochée frauduleusement : ça ne compte pas.

**Zappable** : la liste des 19 projets vit dans le repo. Aucun intérêt à la mémoriser par cœur, seul ce qu'ils prouvent compte.

---

## 31 · Annexes

_le méta-module, pour la longévité_

**Noyau ★** : la meilleure ligne de code est celle que tu n'as pas eu besoin d'écrire. Une solution sans code, un SaaS existant (un logiciel prêt à l'emploi), ou simplement une conversation avec la bonne personne valent souvent mieux qu'un sprint entier de développement.
_Fichier : `31_annexes/04_when_not_to_code.md`_

**Piège** : en entretien technique, verbaliser ta façon de penser vaut plus que finir l'exercice. On cherche à voir comment tu raisonnes, pas juste si tu arrives au bout.

**Zappable** : un code plus performant coûte moins cher à faire tourner et pollue moins. Le FinOps (optimiser les coûts liés au cloud) et le GreenOps (réduire l'empreinte énergétique du code) convergent sur ce point.

**Pont** : les fichiers PERISSABILITE et PONTS_INTER_MODULES sont tes deux cartes à garder ouvertes en permanence. Elles remplacent la table des matières.
_Fichiers : `31_annexes/20_PERISSABILITE.md`, `31_annexes/22_PONTS_INTER_MODULES.md`_

---

## 32 · Tools

_outils personnels, minimum viable : très périssable_

**Noyau ★** : un logger structuré (qui écrit des logs dans un format lisible par une machine, pas juste du texte brut), un kit de benchmark reproductible (pour mesurer une performance de façon fiable et répétable), un scaffolder en ligne de commande (un outil qui génère la structure de départ d'un projet), un kit de debug personnel : 3 scripts, pas 30.
_Fichier : `32_tools/00_why_tools.md`_

**Zappable** : les noms des outils changent tout le temps. Les gestes derrière, eux, ne changent pas.

**Pont** : c'est la matérialisation quotidienne du debugging, du testing, et de l'observabilité. Ce sont tes vraies armes du quotidien.

---

## Je deviens quoi après MyFunnyJS, concrètement

Pas du rêve, pas du recrutement déguisé : ce que le guide carrière du repo lui-même documente (`31_annexes/16_career/00_guide.md`), condensé à l'essentiel.

### Ce que ce curriculum te rend capable de faire

Les 34 fiches te donnent un profil **Full-Stack / Backend-fort** en JS/TS, avec des fondations qui débordent largement d'un seul langage : algorithmes, architecture, sécurité, bases de données, observabilité. C'est le socle du métier de **Software Engineer généraliste**, pas d'une spécialité étroite.

```
CE QUE TU AS FAIT           CE QUE ÇA VEUT DIRE SUR LE MARCHÉ
::::::::::::::::::::         :::::::::::::::::::::::::::::::::::
01-13  Fondamentaux JS      -> tu passes les tests techniques
                    "vanilla JS" sans trembler
14   TypeScript          -> tu es employable sur la majorité
                    des offres web 2026 (TS = standard de facto)
16-18  Architecture, OOP      -> tu peux concevoir une feature,
                    pas juste l'implémenter
20-21  Realtime, API Craft     -> tu construis un vrai backend,
                    pas un script qui répond à des requêtes
22   Security            -> tu ne fais pas les 3 fautes qui
                    coûtent une CVE (une faille recensée) en prod
24-26  DB, Scalability, Observability -> tu tiens en production,
                    pas juste en dev
23,29  AI-Native, Agents      -> tu utilises l'IA sans t'y noyer
                    ni t'y faire piéger (ça se recrute déjà)
27,30  Team Craft, Mini-Projets  -> tu as des artefacts (POSTMORTEM,
                    ADR) à montrer, pas juste "j'ai fait un cours"
```

### Les métiers réalistes en sortie directe

```
FULL-STACK DEV (le plus direct)
::::::::::::::::::::::::::::::::
 Stack     : React/Next.js + Node.js + PostgreSQL
 Ce que tu livres : une feature de A à Z, front + back
 Accès    : 6-12 mois d'employabilité réelle après le curriculum

BACKEND DEV
::::::::::::::::::::::::::::::::
 Stack     : Node.js/Express + PostgreSQL/MongoDB + Docker
 Ce que tu livres : APIs, logique métier, sécurité des données
 Accès    : direct, c'est le cœur des modules 21-26

FRONTEND DEV
::::::::::::::::::::::::::::::::
 Stack     : React/TS + Tailwind + tests (Vitest/Playwright)
 Ce que tu livres : interfaces, perf, accessibilité
 Accès    : direct si tu approfondis 17-19 en particulier
```

Trois autres métiers deviennent accessibles **avec un peu plus** (pas depuis zéro) :

```
DEVOPS / CLOUD  : ajoute Docker/Kubernetes/Terraform en profondeur
              (25_scalability + 26_observability sont ton point de départ,
               pas ton point d'arrivée)

AI ENGINEER   : ajoute Python + un framework de Machine Learning
              (23_ai_native_dev te donne le réflexe de validation,
               pas la stack ML elle-même)

CYBERSÉCURITÉ  : ajoute Kali/Burp Suite/du pentest actif (des tests
              d'intrusion volontaires)
              (22_security te donne les fondations défensives,
               pas l'attaque)
```

### La réalité du marché : local vs remote

C'est le point le plus important du guide carrière, et il change tout. Le même profil, les mêmes compétences, valent différemment selon à qui tu factures ton travail.

```
                MÊME DEV, MÊME CODE
     _______________________________________________
     |                       |
   MARCHÉ LOCAL              MARCHÉ REMOTE
   (Madagascar, exemple)          (clients US/EU/UK)
     |                       |
  Junior : ~5 400 $/an           Junior : 20 000-35 000 $/an
  Senior : ~22 000 $/an          Mid   : 40 000-65 000 $/an
  Réalité terrain : souvent moins     Senior : 70 000-100 000 $/an
     |                       |
     |___________ ratio x3 à x4 environ __________|
```

_(Chiffres 2026 du guide carrière du repo : ordres de grandeur, pas des promesses. Ils varient selon le pays, l'entreprise et la conjoncture.)_

La conclusion du guide, sans détour : **la question n'est pas "quel métier choisir", c'est "comment accéder au marché remote".** Trois choses y mènent, dans l'ordre : un portfolio GitHub avec 2-3 projets propres et documentés (tes mini-projets du module 30 sont exactement ça), un profil LinkedIn en anglais, et une première mission sur une plateforme comme Upwork ou Toptal : peu importe le tarif de départ, c'est pour la réputation que tu construis, pas pour le chèque immédiat.

### La progression réaliste, pas le fantasme

```
ANNÉES 1-2  : le débroussaillage : tu casses autant que tu apprends, normal
ANNÉES 3-5  : l'autonomie : tu livres une feature de A à Z sans supervision
ANNÉES 5-8  : l'impact : ton code affecte des équipes entières, tu mentores
ANNÉES 8-15 : la force tranquille : impact large, ou indépendance (freelance/startup)
```

La différence entre junior et senior n'est pas le nombre de langages connus. C'est la capacité à voir ce qui va mal **avant** que ça arrive : exactement ce que les modules 04 (Debugging), 25 (Scalability) et 30 (Mini-Projets avec POSTMORTEM) construisent, module après module.

### Ce qui ne change pas, quoi qu'il arrive au marché

```
+------------------------------------------------------------------+
|     LES PILIERS QUI DURENT (d'après le guide carrière)     |
+------------------------------------------------------------------+
| Pensée algorithmique  -> module 10                  |
| Structures de données  -> module 09                  |
| Réseaux et web     -> modules 17, 20, 21              |
| Débogage systématique  -> module 04                  |
| Bases de données    -> module 24                    |
| Sécurité de base    -> module 22                    |
| Communication technique -> module 27                   |
| Apprendre en continu  -> modules 23, 29 (justement parce que  |
|              ce sont eux qui bougent)          |
+------------------------------------------------------------------+
```

Les frameworks meurent tous les 3 ans. Ce curriculum ne t'a pas appris un framework. Il t'a appris ce qui reste quand le framework du moment aura disparu : ce qui, d'après le guide carrière lui-même, est la seule vraie assurance-carrière qui existe.

---

## Après ce document

Ce n'est pas la matière. C'est ce qui reste quand tu as oublié la matière. Le repo se rouvre au moment précis du doute, pas en boucle.

Quatre habitudes suffisent à la longévité :

- Un ADR par décision non triviale (qui mérite réflexion). Six mois plus tard, tu te remercies toi-même.
- Un POSTMORTEM par bug de plus de 2h. La honte s'efface avec le temps, la leçon reste, elle.
- Une révision espacée après chaque module : J+1, J+7, J+21, J+60.
- Un DEPENDENCY_LEDGER (un carnet perso) sur ta dépendance à l'IA. Au-delà de 25% de code que tu n'as pas vraiment compris toi-même, c'est un signal à prendre au sérieux : pas un jugement moral, juste un signal.

Tu ne construis pas une pile de connaissances qu'on peut oublier du jour au lendemain. Tu construis un geste, une façon de penser. Un geste, ça se garde en le refaisant, encore et encore.

Regarde où t'en es, concrètement, là maintenant : 34 fiches tenues à jour, un audit multi-session qui a traqué chaque lien cassé un par un jusqu'à ce qu'il n'en reste plus, 19 projets qui prouvent un savoir-faire réel et pas juste "j'ai suivi un cours", et un système de révision qui tient sur la durée au lieu de compter sur ta mémoire du moment. La majorité des gens qui apprennent à coder n'ont ni l'un ni l'autre. Toi, t'as les deux, et un repo qui les prouve noir sur blanc.

Le marché ne demande pas d'être parfait à J1. Il demande de tenir la distance, module après module, sans lâcher au premier passage à vide. C'est exactement ce que ce document est fait pour t'aider à faire.

_MyFunnyJS : support de rappel_
