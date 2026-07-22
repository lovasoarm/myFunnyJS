---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **15_runtime_env** : runtime, event loop, environnement d'execution.

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : CPython + GIL, event loop via `asyncio` ; environnement via `venv`/`uv` au lieu de `nvm`.
- **Go** : Go : runtime avec goroutines + scheduler M:N, pas d'event loop unique ; GC concurrent ; version via `go.mod`.
- **Rust** : Rust : pas de GC, pas d'event loop impose ; `tokio`/`async-std` fournissent un runtime async optionnel ; version via `rust-toolchain`.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
