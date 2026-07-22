---
stability: intemporel
---

# CHARTE ASCII : LA NORME UNIQUE
Temps de lecture ~8 min

> Un seul style de schéma. Un seul vocabulaire. Pas de version maison par module.

Tu vas croiser l'event loop dans `03_async`, dans `08_memory_performance`, et encore dans `15_runtime_env`.
Si chaque module dessine son propre schéma avec ses propres mots, ton cerveau doit réapprendre la lecture à chaque fois. C'est du gaspillage.

Cette charte fixe 8 schémas canoniques. Quand un module a besoin d'un de ces 8 schémas : il pointe ici, ou il recopie le schéma identique. Pas de variante.

**Règle de syntaxe commune :**
```
A --> B      une étape suit une autre
A --> B --> C    une séquence
A -.-> B      relation indirecte ou asynchrone (ligne pointillée)
[ ]         une boîte = un état ou un composant
( )         une parenthèse = une précision courte
```

---

## 1) CALL STACK : LES FRAMES EMPILÉES

Chaque appel de fonction empile une frame. Quand la fonction finit, sa frame disparaît. LIFO (Last In First Out, le dernier arrivé sort en premier) pur.

```
function c() { return 1 }
function b() { return c() }
function a() { return b() }
a()

ÉTAT DE LA STACK PENDANT L'EXÉCUTION :

 |    |    | c()  |    |
 | b()  | b()  | b()  | b()  |
 | a()  | a()  | a()  | a()  |
 +--------+--------+--------+--------+
  a appelle b appelle c    c finit,
  b      c    s'exécute retour à b
```

Si tu stack des appels sans jamais redescendre (récursion sans fin) : `RangeError: Maximum call stack size exceeded`. C'est littéralement la stack qui déborde.

**Référencé dans :** `01_fundamentals/03_functions`, `03_async/04_event_loop`, `28_edge_cases`.

---

## 2) EVENT LOOP : STACK, QUEUE, MICROTASKS

Le mécanisme qui décide quoi exécuter ensuite quand le call stack est vide.

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

Ordre d'exécution typique :
```
synchrone --> toutes les microtasks --> une macrotask --> toutes les microtasks --> une macrotask --> ...
```

**Référencé dans :** `03_async/04_event_loop`, `08_memory_performance/04_profiling`, `20_realtime`.

---

## 3) HEAP VS STACK : ALLOCATION ET RÉFÉRENCES

Le stack stocke les valeurs primitives et les références. Le heap stocke les objets eux-mêmes.

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

C'est la racine de 90% des bugs "je touche un truc et un autre truc casse ailleurs".

**Référencé dans :** `01_fundamentals/01_variables`, `08_memory_performance/02_copy_vs_ref`.

---

## 4) FLUX ASYNC : AWAIT, RESOLVE, REJECT

Une Promise a 3 états. Une fois résolue ou rejetée, elle reste figée dans cet état pour toujours.

```
new Promise()
   |
   v
 [ PENDING ]
  /    \
 v     v
[ FULFILLED ] [ REJECTED ]
 (resolve)   (reject)
   |       |
   v       v
  .then()    .catch()
```

Avec `await` :
```
await promise()
 --> si FULFILLED : la valeur résolue, exécution continue
 --> si REJECTED : une exception levée, à catcher avec try/catch
```

**Référencé dans :** `03_async/02_promises`, `03_async/03_async_await`, `05_error_handling/04_async_error_traps`.

---

## 5) CYCLE DE VIE HTTP : REQUÊTE, MIDDLEWARE, RÉPONSE

Une requête HTTP traverse une chaîne de middlewares avant d'atteindre le handler final, puis repart en sens inverse pour la réponse.

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
[ Handler ]         (logique métier, génère la réponse)
 |
 v
[ Middleware: error handler ] (catch les erreurs remontées)
 |
 v
CLIENT (réponse)
```

Chaque middleware peut couper la chaîne (`return` sans `next()`) ou laisser passer.

**Référencé dans :** `21_api_craft/01_express_from_scratch`, `22_security`, `05_error_handling/03_error_propagation`.

---

## 6) ARCHITECTURE EN COUCHES : UI, DOMAINE, INFRA

Le principe de la clean architecture : le domaine (la logique métier) ne dépend jamais de l'infra (DB, framework, réseau). C'est l'inverse qui est vrai.

```
[ UI / Présentation ]
    |
    v (dépend de)
[ Domaine / Logique métier ]
    ^
    | (dépend de, via interface)
[ Infra / DB, API externes, framework ]
```

La flèche entre Domaine et Infra pointe vers le HAUT : c'est l'infra qui implémente une interface définie par le domaine, pas le contraire. Si tu changes de DB, le domaine ne bouge pas d'une ligne.

**Référencé dans :** `16_architecture_patterns/04_clean_architecture`, `13_refactoring/02_solid_principles`.

---

## 7) PIPELINE RÉSEAU : CLIENT, EDGE, ORIGIN

Le trajet d'une requête entre l'utilisateur et ton serveur final, avec les points d'arrêt possibles en chemin.

```
CLIENT
 |
 v
[ EDGE / CDN ]   <-- cache statique, peut répondre direct sans aller plus loin
 | (cache miss)
 v
[ LOAD BALANCER ] <-- répartit vers une instance
 |
 v
[ ORIGIN SERVER ] <-- ton code qui tourne vraiment
 |
 v
[ DATABASE ]
```

Plus la réponse vient de haut dans ce schéma (edge plutôt qu'origin), plus c'est rapide pour l'utilisateur.

**Référencé dans :** `17_web_concepts/04_caching_strategies`, `25_scalability/01_load_balancing`.

---

## 8) FLUX DE DONNÉES : SOURCE, TRANSFORM, SINK

Le schéma générique de tout pipeline de traitement de données, du plus simple `.map().filter()` jusqu'à un pipeline d'ingestion d'events complet.

```
[ SOURCE ]    d'où vient la donnée brute (API, fichier, stream, DB)
  |
  v
[ TRANSFORM ]   map, filter, validate, normalize : la donnée change de forme
  |
  v
[ SINK ]     où la donnée atterrit (DB, UI, fichier, autre service)
```

Une erreur dans TRANSFORM doit jamais silencieusement corrompre ce qui arrive au SINK. D'où l'intérêt de valider à chaque étape, pas juste à la fin.

**Référencé dans :** `11_functional_js/06_fp_challenge`, `23_ai_native_dev/03_validate_ai_output`, `26_observability/01_structured_logging`.

---

## RÈGLE D'USAGE

Tu écris une leçon et t'as besoin d'un de ces 8 schémas : tu recopies le schéma exact ci-dessus, tu l'adaptes au contexte narratif du module si besoin (les noms de variables peuvent changer, la structure du schéma non), et tu mentionnes "voir charte ASCII" si tu veux éviter de répéter l'explication complète.

Si ton module a besoin d'un 9e schéma canonique qui sert dans plusieurs modules : tu le proposes ici, tu l'ajoutes pas en solo dans ta leçon.
