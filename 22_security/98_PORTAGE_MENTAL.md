---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **22_security** : securite applicative (injections, auth, secrets).

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : `bandit` pour scan ; secrets via variables d'env ou `keyring` ; injections = memes classes (SQLi, XSS via templates non echappes).
- **Go** : Go : `gosec` pour scan ; secrets par env ou Vault ; `html/template` echappe par defaut, moins de XSS accidentels.
- **Rust** : Rust : `cargo audit`/`cargo deny` pour deps ; memes classes d'attaques web ; `unsafe` est le seul endroit ou la memoire est un risque.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
