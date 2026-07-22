---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **25_scalability** : scalabilite (cache, sharding, queues).

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : GIL force le multiprocessing pour CPU ; `asyncio`/uvicorn workers pour I/O ; Redis/Celery/RQ pour queues.
- **Go** : Go : goroutines + channels = concurrence bon marche ; queues via NATS/Redis ; profiling via `pprof`.
- **Rust** : Rust : `tokio` + `rayon` (data-parallel) ; zero-cost abstractions ; profils via `cargo flamegraph`.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
