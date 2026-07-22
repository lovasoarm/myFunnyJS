---
stability: intemporel
---

# CAHIER DES CHARGES : ULTRAS DASHBOARD

Temps de lecture ~14 min

## PRÉREQUIS

```
Node.js    : v20+
npm      : v10+
TypeScript   : v5+ (installé comme dépendance locale via npm install)
Variables env : aucune
Outils externes: aucun

# Installation
$ npm install

# Compiler et vérifier les types
$ npx tsc --noImplicitAny --noEmit

# Démarrer le serveur (ts-node pour le dev)
$ npm start

# Lancer les tests
$ npm test
```

`ts-jest` est utilisé pour exécuter les tests TypeScript directement sans étape de build séparée. La config `tsconfig.json` est fournie dans le projet. Si `npx tsc --noImplicitAny --noEmit` sort avec 0 erreurs, le typage est propre.

---

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Le club de foot le plus suivi de la saison. Des milliers d'ultras connectés pendant le match. Des événements arrivent à 200 par minute : but, passe décisive, tir cadré, faute, possession actualisée, xG (Expected Goals : buts attendus calculés selon la qualité des occasions). Le dashboard doit ingérer tout ça, le traiter, l'afficher en temps réel, et alerter si quelque chose cloche (latence trop haute, taux d'erreur qui monte, serveur sous charge). Si le serveur tombe pendant le match : les ultras brûlent tout.

Ce que tu dois voir tourner à la fin :

```
$ npm run start

[SERVER] Ultras Dashboard : écoute sur le port 4000
[INGEST] Pipeline prêt : buffer: 0 events
[METRICS] Dashboard http://localhost:4000/metrics

--- (simulation de match lancée) ---

[EVENT] But de Mbappé (32') : xG: 0.73 : possession: 58%
[TRACE] req-id: e7f2a1 | ingest -> process -> store -> broadcast | 12ms total
[ALERT] Latence P99 > 200ms depuis 30s : threshold dépassé
[SENTRY] Exception capturée : broadcastError : context: { matchId: 'PSG-OM', turn: 67 }
[METRICS] events_total: 1420 | errors_total: 3 | p99_latency_ms: 187

$ npm test
PASS tests/pipeline.test.ts (22 tests)
PASS tests/metrics.test.ts (14 tests)
PASS tests/tracing.test.ts (12 tests)
PASS tests/alerting.test.ts (10 tests)
```

Ce projet est en TypeScript. Le pipeline d'ingestion d'événements est typé de bout en bout. C'est aussi le premier projet avec de l'observabilité réelle : logging structuré, tracing distribué simulé, métriques, alertes, Sentry.

## POURQUOI CE PROJET EXISTE

Ce projet teste une compétence que les juniors n'ont pas : savoir ce que fait son système en production, avant que les utilisateurs le signalent.

- **un système qui n'a pas de logs structurés est un système aveugle** : "le dashboard a lagué pendant le match" n'est pas un rapport d'incident utilisable. "Latence P99 = 2300ms pendant 47 secondes à 21h32, corrélée avec un pic d'events de possession à 320/min" : ça, on peut travailler avec.
- **un pipeline d'events sans types, c'est une bombe à retardement** : si un event `{ goals: '1' }` arrive avec `goals` en string au lieu de number, et que le code attend un number, tout plante silencieusement. TypeScript attrape ça à la compilation.
- **scaler horizontalement sans observabilité, c'est du chaos** : si deux instances du serveur tournent en parallèle, comment savoir laquelle a reçu quel event ? Les correlation IDs (identifiants uniques attachés à chaque requête pour la suivre d'un service à l'autre) répondent à cette question.

## LES 3 MODULES QUE CE PROJET COUVRE, ET OÙ ILS SE VOIENT DANS LE CODE

### `26_observability` : logging, tracing, métriques, Sentry

**Où ça se voit** : `src/observability/` entier.
**Pourquoi c'est nécessaire ici** : sans observabilité, on ne sait pas ce que le pipeline fait en prod. Logging structuré en JSON pour chercher les events corrélés. Tracing pour suivre un event de l'ingestion à l'affichage. Métriques pour les seuils d'alerte. Sentry pour les exceptions.

### `25_scalability` : rate limiting, message queues, load balancing simulé

**Où ça se voit** : `src/queue/`, `src/balancer/`, `src/middleware/rateLimiter.ts`.
**Pourquoi c'est nécessaire ici** : 200 events par minute ça tient. 2000 events par minute si tous les ultras rafraîchissent en même temps : le pipeline doit absorber le pic sans tomber. La queue découple l'ingestion du traitement.

### `14_typescript` : generics, utility types, types stricts sur tout le pipeline

**Où ça se voit** : tous les fichiers `.ts` du projet.
**Pourquoi c'est nécessaire ici** : `Event<T>` permet de typer un event de match différemment d'un event de possession, tout en partageant la même infrastructure de traitement. `Pipeline<Input, Output>` décrit explicitement ce que chaque étape attend et retourne.

### Résumé visuel

```
26_observability --> src/observability/ (logger, tracer, metrics, sentry)
25_scalability  --> src/queue/ (message queue), src/balancer/ (round-robin simulé)
14_typescript   --> generics Event<T>, Pipeline<I,O>, utility types sur les structs
```

## FLUX D'APPEL : QUI APPELLE QUI, DANS QUEL ORDRE

```
MatchSimulator (génère des events)
 --> IngestEndpoint POST /api/events
    --> rateLimiter.check(req)
    --> tracer.startSpan('ingest', reqId)
    --> queue.push(event)        // met en file, retourne immédiatement
 --> QueueWorker (tourne en parallèle, dépile la queue)
    --> roundRobin.next()        // sélectionne le worker suivant (index circulaire)
    --> pipeline.process(event)     // le worker sélectionné traite l'event
       --> validator.validate(event) // types TypeScript + validation runtime
       --> enricher.enrich(event)  // ajoute xG calculé, possession lissée
       --> store.save(event)     // sauvegarde en mémoire
       --> broadcaster.send(event)  // pousse aux clients connectés (SSE)
    --> tracer.endSpan('process')
    --> metrics.record(event)      // compteurs, histogrammes
 --> MetricsCollector (tourne en arrière-plan)
    --> alerting.check(metrics)     // seuils dépassés ?
    --> sentry.capture(exception)    // si exception non catchée
```

## L'ARCHITECTURE DU CODE, FICHIER PAR FICHIER

```
src/
├── observability/
│  ├── logger.ts
│  ├── tracer.ts
│  ├── metrics.ts
│  ├── alerting.ts
│  └── sentry.ts
│
├── pipeline/
│  ├── validator.ts
│  ├── enricher.ts
│  ├── store.ts
│  └── broadcaster.ts
│
├── queue/
│  └── eventQueue.ts
│
├── balancer/
│  └── roundRobin.ts
│
├── middleware/
│  ├── rateLimiter.ts
│  └── errorHandler.ts
│
├── types/
│  ├── events.ts
│  └── pipeline.ts
│
├── simulator/
│  └── matchSimulator.ts
│
└── server.ts

tests/
├── pipeline.test.ts
├── metrics.test.ts
├── tracing.test.ts
└── alerting.test.ts
```

### `src/types/events.ts`

**Ce que ça fait** : définit tous les types d'events. `MatchEvent<T>` est le type générique de base. `GoalEvent`, `PossessionEvent`, `xGEvent` étendent ce type avec leurs propres champs.
**Entrée** : rien (définitions de types, pas de logique).
**Sortie** : des types TypeScript exportés.

### `src/types/pipeline.ts`

**Ce que ça fait** : définit `Pipeline<Input, Output>` (interface générique d'une étape de transformation) et `PipelineStep<T>` (une étape individuelle).

### `src/observability/logger.ts`

**Ce que ça fait** : log en JSON structuré avec correlation ID, timestamp, niveau (info, warn, error), et champs contextuels. Jamais de `console.log` brut ailleurs dans le code.
**Entrée** : un niveau, un message, un objet contexte.
**Sortie** : une ligne JSON dans stdout.

### `src/observability/tracer.ts`

**Ce que ça fait** : crée et termine des spans (unités de trace : une opération avec un début et une fin) pour suivre le chemin d'un event de l'ingestion à l'affichage.
**Entrée** : un nom d'opération, un ID de requête.
**Sortie** : une durée en ms et un log de trace.

### `src/observability/metrics.ts`

**Ce que ça fait** : expose des compteurs (`events_total`, `errors_total`) et des histogrammes de latence. Fournit un endpoint `/metrics` au format lisible.
**Entrée** : des appels à `increment(counter)` ou `record(histogram, value)`.
**Sortie** : un snapshot des métriques à `/metrics`.

### `src/observability/alerting.ts`

**Ce que ça fait** : vérifie les seuils sur les métriques. Si la latence P99 dépasse 200ms pendant plus de 30 secondes, logue une alerte et appelle un handler.
**Entrée** : les métriques courantes et les seuils configurés.
**Sortie** : des alertes loggées ou des handlers appelés.

### `src/queue/eventQueue.ts`

**Ce que ça fait** : une queue (FIFO : First In First Out, premier entré premier sorti) d'events avec une taille max. Si la queue est pleine, les nouveaux events sont rejetés avec une erreur loggée.
**Entrée** : un event à pousser, ou une demande de dépilage.
**Sortie** : l'event suivant à traiter, ou `null` si la queue est vide.

### `src/pipeline/validator.ts`

**Ce que ça fait** : valide qu'un event entrant correspond au type attendu. Si un champ manque ou a le mauvais type, rejette l'event avec une erreur loggée.
**Entrée** : un event brut (inconnu).
**Sortie** : un event typé, ou une exception.

### `src/simulator/matchSimulator.ts`

**Ce que ça fait** : génère des events de match réalistes à intervalle régulier pour simuler un vrai match. Utilisé en dev et dans les tests.
**Entrée** : une configuration (`{ matchId, eventsPerMinute, duration }`).
**Sortie** : des events envoyés à l'endpoint d'ingestion.

## L'ORDRE DE CONSTRUCTION (PAR OÙ COMMENCER)

```
1. src/types/     --> les types d'abord, aucune logique, zéro dépendance
2. src/observability/logger.ts  --> la première brique, utilisée partout ensuite
3. src/observability/metrics.ts --> indépendant du pipeline
4. src/observability/tracer.ts  --> dépend du logger
5. src/queue/eventQueue.ts    --> indépendant du reste
6. src/pipeline/validator.ts   --> dépend des types
7. src/pipeline/enricher.ts    --> dépend de validator
8. src/pipeline/store.ts     --> dépend des types
9. src/pipeline/broadcaster.ts  --> dépend des types
10. src/observability/alerting.ts --> dépend de metrics
11. src/balancer/roundRobin.ts  --> indépendant
12. src/middleware/        --> dépend du logger
13. src/simulator/        --> dépend des types + du serveur
14. src/server.ts         --> branche tout ensemble
```

## ESTIMATION DE TEMPS ET ZONES DE RÉSISTANCE

**Durée totale estimée** : 20 à 28 heures de travail réel.

| Étape              | Durée estimée | Zone de résistance                                            |
| ------------------ | ------------- | ------------------------------------------------------------- |
| Types TypeScript   | 2h            | Moyenne : bien définir les generics dès le départ             |
| logger + tracer    | 2h            | Faible                                                        |
| metrics + alerting | 3h            | Moyenne : les histogrammes P99 sont subtils                   |
| eventQueue         | 1h30          | Faible                                                        |
| pipeline complet   | 4-5h          | **Haute** : le typing de bout en bout sans `any`              |
| middleware         | 2h            | Moyenne                                                       |
| simulator          | 1h30          | Faible                                                        |
| server.ts          | 1h            | Faible                                                        |
| Tests complets     | 3-4h          | Moyenne : tester des métriques qui s'accumulent dans le temps |

Le point de résistance majeur est le pipeline typé sans `any`. La tentation d'écrire `event as any` pour contourner une erreur TypeScript est forte. Résiste. Si tu as besoin de `any`, c'est que le type d'entrée est mal défini.

## EXEMPLE DE TEST REMPLI

```ts
// tests/pipeline.test.ts
import { validateEvent } from "../src/pipeline/validator";
import { GoalEvent } from "../src/types/events";

describe("validator", () => {
  test("accepte un GoalEvent valide", () => {
    const raw = {
      type: "goal",
      matchId: "PSG-OM",
      player: "Mbappé",
      minute: 32,
      xG: 0.73,
    };

    const event = validateEvent<GoalEvent>(raw);
    expect(event.type).toBe("goal");
    expect(event.xG).toBe(0.73);
  });

  test("rejette un event avec xG en string", () => {
    const raw = {
      type: "goal",
      matchId: "PSG-OM",
      player: "X",
      minute: 10,
      xG: "0.5",
    };
    expect(() => validateEvent(raw)).toThrow();
  });
});

// tests/metrics.test.ts
import { MetricsCollector } from "../src/observability/metrics";

describe("metrics", () => {
  test("events_total s'incrémente à chaque event enregistré", () => {
    const m = new MetricsCollector();
    m.increment("events_total");
    m.increment("events_total");
    expect(m.snapshot().events_total).toBe(2);
  });
});
```

## CAS LIMITES À TESTER OBLIGATOIREMENT

1. **Queue pleine** : si la queue atteint sa taille max, le nouvel event est rejeté sans planter le serveur. Un log d'erreur doit être émis.
2. **Event avec champ manquant** : `{ type: 'goal', matchId: 'PSG-OM' }` sans le champ `minute`. Le validator doit rejeter, pas laisser passer un objet partiel.
3. **Spike soudain de 10x le volume** : le matchSimulator injecte 10x les events normaux pendant 5 secondes. Le serveur ne doit pas crasher.
4. **Alerte déclenchée puis résolue** : la latence dépasse le seuil, l'alerte se déclenche. Puis la latence repasse en dessous. L'alerte doit se résoudre sans alerte fantôme.

## LES RÈGLES QUE TU NE DOIS JAMAIS CASSER

1. **Zéro `any` dans le code TypeScript.** `unknown` est acceptable dans le validator avant que le type soit confirmé. `any` ne l'est pas.
2. **Chaque event entrant a un correlation ID.** Si l'ID n'est pas dans le body de la requête, le middleware en génère un. Aucun event ne traverse le pipeline sans ID.
3. **Les métriques sont loggées, jamais perdues.** Si le broadcaster plante, les métriques de cet event sont quand même enregistrées.

## CE QUE TU NE FAIS PAS DANS CE PROJET

- Pas de vraie base de données (les events sont en mémoire, le store est une Map).
- Pas de vrai Sentry (le module `sentry.ts` simule la capture sans appeler l'API Sentry). Raison : créer un compte Sentry et configurer un DSN sort du scope pédagogique. L'interface de `sentry.ts` est identique à celle du vrai SDK : si tu veux brancher le vrai Sentry, tu changes uniquement l'implémentation de `captureException`, pas le code qui l'appelle.
- Pas d'interface frontend (le dashboard est simulé via `/metrics` en texte).
- Pas de WebRTC.
- Le `roundRobin.ts` simule la distribution de charge entre plusieurs instances : en pratique, il distribue les events entrants entre N workers fictifs (tableau d'index, chacun son tour). Il intervient dans le `QueueWorker` au moment de choisir quel worker traite l'event suivant. Ce n'est pas un vrai load balancer réseau : c'est la simulation du comportement pour comprendre le principe avant de le voir en vrai dans une infra.

## LES ADR

```
ADR/001-pourquoi-queue-entre-ingest-et-traitement.md
ADR/002-pourquoi-generics-sur-les-events-plutot-que-union-types.md
ADR/003-pourquoi-correlation-id-genere-cote-serveur.md
```

Exemple rempli :

```markdown
# ADR 001 : Queue entre ingestion et traitement

## Contexte

Les events de match arrivent en rafales pendant un but ou une phase de jeu intense.
Sans tampon, le traitement doit s'exécuter au rythme de l'ingestion.
Si le traitement prend 50ms par event et qu'il en arrive 20 en une seconde,
les 10 derniers attendent ou sont perdus.

## Décision

Une queue FIFO avec taille max découple l'ingestion du traitement. L'ingestion
est O(1) (juste ajouter en queue). Le traitement tourne à son rythme.

## Alternatives considérées

- Traitement synchrone dans le handler de la requête : rejeté car bloquant.
  Un event lent bloque tous ceux qui arrivent derrière.
- Une queue externe (Redis, RabbitMQ) : rejeté pour ce projet (hors scope, ajoute
  une dépendance infra). La Map en mémoire suffit pour la simulation.

## Conséquences

- Si la queue est pleine : les events sont rejetés. C'est un choix délibéré
  (shed load) plutôt que de faire crasher le serveur.
- Le délai entre ingestion et affichage peut augmenter sous charge. C'est visible
  dans les métriques de latence.
```

## QUAND EST-CE QUE LE PROJET EST VRAIMENT FINI

```
[ ] la simulation de match tourne 5 minutes sans crash
[ ] chaque event a un correlation ID dans les logs
[ ] les métriques events_total et errors_total sont correctes après simulation
[ ] une alerte se déclenche quand la latence P99 dépasse le seuil configuré
[ ] zéro `any` dans les fichiers .ts (vérifié avec tsc --noImplicitAny)
[ ] les 4 cas limites ont chacun un test qui passe
[ ] les 3 ADR sont remplis avec contexte, décision, alternatives, conséquences
[ ] POSTMORTEM.md documente au moins un bug de concurrence ou de timing rencontré
[ ] TDD_JOURNAL.md trace quels tests ont été écrits avant le code correspondant
```

## SÉCURITÉ (gate obligatoire)

Un projet qui marche mais qui est vulnérable n'est pas fini. Traite ces exigences OWASP contextuelles avant de livrer.

- XSS (OWASP A03) : échapper toute donnée utilisateur affichée dans le dashboard.
- Contrôle d'accès (OWASP A01) : un utilisateur ne voit que les données de son périmètre.

Pour chaque exigence : documente dans `SECURITY.md` la menace, ta contre-mesure et le test qui la prouve. Le `verification_pack` de ce projet contient un test de sécurité qui doit passer.

---

## Securite (gate obligatoire, Partie I)

- **Exigence 1** : aucune donnee sensible (secret, token, cle) dans le code source ni dans les logs. Utiliser variables d'environnement + `.env.example` versionne (jamais `.env`).
- **Exigence 2** : toute entree externe (STDIN, fichier, HTTP, CLI) est validee AVANT usage (type, longueur, format). En cas d'invalidite : erreur explicite, jamais un crash silencieux.

Un test dans `node solution.js` (auto-verif ecrite par toi) doit prouver ces deux points (ex : lancer le programme avec une entree malformee et verifier qu'il refuse proprement).

---

## SURPRISE MI-PARCOURS (spec drift, obligatoire)

Spec drift obligatoire, voir `30_mini_projects/synthese/spec_drift.md`
(protocole unique, tirage aléatoire, déclenchement à 40 % d'avancement).

## RÔLE DES DOSSIERS (ne skippe pas)

- `src/` : **tu remplis toi-même**. Le dossier est vide exprès : c'est ton livrable. Aucun code fourni.
- `tests/` : **TDD strict : tu écris le test AVANT le code de `src/`**. Rouge → vert → refactor. Si `tests/` est vide en fin de projet, ce projet ne compte pas dans ton portfolio.
- `ADR/` : **au moins 1 décision architecturale documentée** (choix de structure, trade-off, alternative rejetée + pourquoi). Format : Contexte / Décision / Conséquences.
- `POSTMORTEM.md` : **rédigé à la fin, honnête**. Ce qui a foiré, combien de temps t'a coûté chaque blocage, ce que tu referais autrement.
- `TDD_JOURNAL.md` : trace vivante du cycle rouge/vert/refactor.

**Un CTO qui feuillette ton portfolio regarde `src/` ET `tests/` ET `ADR/`. Un `src/` vide sans `tests/` associé = projet non fini, quelle que soit la qualité du reste.**
