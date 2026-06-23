# ULTRAS DASHBOARD

Le club de foot le plus suivi de la saison. Des milliers d'ultras connectés pendant un match. Des events de jeu qui arrivent à 200 par minute. Un dashboard qui affiche possession, xG, heatmap de passes, alertes temps réel, sans jamais tomber. Si le serveur crash pendant un match, les ultras brûlent tout.

TypeScript de bout en bout. Tracing. Métriques. Alerting. Sentry en prod.

---

## CE QUE ÇA FAIT

```
$ npm start

[SERVER] Démarrage : port 3000, TypeScript strict, compilation OK
[INGEST] Pipeline d'events connecté (200 events/min simulés)
[METRICS] Compteurs initialisés : possession, xG, passes, fautes
[TRACE] Correlation ID actif sur chaque requête

[EVENT] id:1 type:passe joueur:Messi --> Benzema zone:C xG:0.12
[ALERT] xG cumulé dépasse 2.5 -- analyse recommandée
[SENTRY] Context mis à jour : match_id=UCL-23, minute=67
```

---

## INSTALLATION

```
Node.js        : v20+
npm            : v10+
TypeScript     : v5+ (installé via npm install)
Variables env  : SENTRY_DSN (optionnel pour l'env de dev)
Outils externes: aucun
```

```bash
npm install
npx tsc --noImplicitAny --noEmit   # 0 erreur = typage propre
npm start                           # démarre avec ts-node
npm test                            # ts-jest, pas de build séparé
```

---

## ARCHITECTURE

```
src/
├── types/
│   ├── events.ts           # Event<T>, MatchEvent, PassEvent, GoalEvent
│   ├── pipeline.ts         # Pipeline<Input, Output>, Stage<T, U>
│   └── metrics.ts          # MetricSnapshot, Alert, Threshold
│
├── ingest/
│   └── eventIngester.ts    # reçoit les events bruts, les type-check, les passe au pipeline
│
├── pipeline/
│   ├── pipelineRunner.ts   # orchestre les stages, type-safe de bout en bout
│   ├── stages/
│   │   ├── enrichStage.ts  # enrichit un event avec des métadonnées de match
│   │   ├── validateStage.ts# valide les valeurs numériques (xG entre 0 et 1)
│   │   └── aggregateStage.ts # cumule les métriques par période
│
├── metrics/
│   ├── counters.ts         # compteurs simples (passes, fautes, buts)
│   ├── gauges.ts           # valeurs instantanées (possession %, xG cumulé)
│   └── alertEngine.ts      # compare les gauges aux seuils, déclenche les alertes
│
├── observability/
│   ├── logger.ts           # JSON structuré avec correlation ID
│   ├── tracer.ts           # crée et ferme des spans pour chaque requête
│   └── sentryClient.ts     # setContext, captureException, release tracking
│
├── server.ts               # Express + routes dashboard
└── index.ts                # point d'entrée

tests/
├── pipeline.test.ts
├── metrics.test.ts
├── alertEngine.test.ts
└── tracer.test.ts
```

Flux d'un event de match :

```
eventIngester.receive(rawEvent)
  --> validateStage.process(event)
  --> enrichStage.process(event)
  --> aggregateStage.process(event)
  --> gauges.update(event)
  --> alertEngine.check(gauges.snapshot())  # si seuil dépassé : Alert
  --> logger.info({ event, traceId })
  --> tracer.closeSpan()
```

---

## MODULES CRAZYDEVS COUVERTS

| Module | Où ça se voit |
|---|---|
| `25_observability` | `logger.ts` (JSON structuré, correlation ID), `tracer.ts`, `sentryClient.ts` |
| `24_scalability` | rate limiting sur l'endpoint live, simulation de load horizontal |
| `13_typescript` | `Event<T>`, `Pipeline<I,O>`, utility types sur les structs d'events |

---

## RÈGLES NON-NÉGOCIABLES DE CE PROJET

```
1. npx tsc --noImplicitAny --noEmit retourne 0 erreur avant chaque commit
2. Chaque requête a un correlation ID unique : visible dans tous les logs qui s'y rattachent
3. Les seuils d'alerte sont configurables, pas hardcodés dans alertEngine
4. Sentry.captureException() est appelé sur toutes les erreurs non catchées
5. Aucun event ne passe le pipeline sans passer par validateStage d'abord
```

---

## DOCUMENTS DU PROJET

```
cahierdescharges.md   --> spécification complète, ordre de construction, cas limites
TDD_JOURNAL.md        --> trace de l'écriture des tests, dans l'ordre réel
POSTMORTEM.md         --> ce qui a coincé, ce qui a été appris
ADR/                  --> décisions d'architecture documentées
```
