---
stability: perissable
last_reviewed: 2026-07
depends_on_vendor: false
---

# 09 : Instrumenter TON projet (OpenTelemetry local, zéro compte externe)

Temps ~4 h (une fois) + 30 min par projet supplémentaire

## POURQUOI

Tant que tu n'as pas vu ton propre code se plaindre dans un dashboard, l'observabilité
reste une leçon. Ce fichier impose le geste concret sur trois mini-projets déjà livrés.

## STACK IMPOSÉ (léger, local, durable)

- **OpenTelemetry SDK JS** : instrumentation applicative
- **OTLP Collector** : reçoit les données
- **Jaeger** : traces distribuées
- **Prometheus + Grafana** : métriques et dashboards

Tout tourne en `docker-compose` local. Aucun compte SaaS. Aucun secret externe.

## PROJETS OBLIGATOIRES À INSTRUMENTER

1. `30_mini_projects/01_rasengan_engine`
2. `30_mini_projects/11_scheduler`
3. `30_mini_projects/16_distributed_arena`

## LIVRABLE PAR PROJET : `OBSERVABILITY.md`

- **3 traces réelles** capturées (screenshots ou export JSON Jaeger).
- **1 alerte déclenchée volontairement** (règle Prometheus + capture Grafana).
- **1 dashboard exporté** (JSON Grafana commité dans `observability/dashboard.json`).

## SETUP MINIMAL (`observability/docker-compose.yml`)

```yaml
services:
  otel-collector:
    image: otel/opentelemetry-collector:0.100.0
    command: ["--config=/etc/otel-collector.yaml"]
    volumes: ["./otel-collector.yaml:/etc/otel-collector.yaml"]
    ports: ["4317:4317", "4318:4318"]
  jaeger:
    image: jaegertracing/all-in-one:1.56
    ports: ["16686:16686"]
  prometheus:
    image: prom/prometheus:v2.52.0
    volumes: ["./prometheus.yml:/etc/prometheus/prometheus.yml"]
    ports: ["9090:9090"]
  grafana:
    image: grafana/grafana:11.0.0
    ports: ["3000:3000"]
```

## INSTRUMENTATION JS (extrait)

```js
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "http://localhost:4318/v1/traces",
  }),
});
sdk.start();
```

## DRILL

`node solution.js` (auto-verif ecrite par toi) vérifie qu'un
endpoint OTLP répond pendant la démo apprenant.
