---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **17_web_concepts** : concepts web (HTTP, DOM, requetes).

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : `requests`/`httpx` pour HTTP ; pas de DOM natif (BeautifulSoup pour parser HTML) ; ASGI = pendant de la fetch API cote serveur.
- **Go** : Go : `net/http` en stdlib, tres proche du bas niveau ; pas de DOM cote serveur ; middleware = composition de `http.Handler`.
- **Rust** : Rust : `reqwest`/`hyper` pour HTTP client, `axum`/`actix` cote serveur ; pas de DOM, mais WASM permet le web natif.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
