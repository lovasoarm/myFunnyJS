---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **20_realtime** : temps reel (WebSocket, SSE, streams).

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : WebSocket via `websockets`/`starlette` ; SSE via `sse-starlette` ; streams = generators + `asyncio.Queue`.
- **Go** : Go : `gorilla/websocket` ou `nhooyr/websocket` ; SSE trivial avec `http.Flusher` ; channels = primitive naturelle des streams.
- **Rust** : Rust : `tokio-tungstenite` pour WebSocket ; `axum::sse` pour SSE ; streams = `futures::Stream` (primitive du langage async).

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
