---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **26_observability** : observabilite (logs, traces, metriques).

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : `structlog`/`logging` pour logs, `opentelemetry-python` pour traces/metrics, memes 3 piliers (logs/traces/metrics).
- **Go** : Go : `slog` en stdlib (1.21+), `opentelemetry-go` mature ; memes 3 piliers.
- **Rust** : Rust : `tracing` (crate officiel) unifie logs+spans ; `opentelemetry` s'y branche ; memes 3 piliers.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
