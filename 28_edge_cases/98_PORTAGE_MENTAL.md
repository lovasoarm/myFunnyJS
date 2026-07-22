---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **28_edge_cases** : cas limites (float, timezones, unicode).

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : `float` = IEEE-754 (memes pieges qu'en JS), `decimal.Decimal` pour l'exact ; timezones via `zoneinfo` (stdlib depuis 3.9).
- **Go** : Go : `float64` = IEEE-754 (memes pieges) ; `math/big` pour l'exact ; `time.Time` avec fuseau embarque.
- **Rust** : Rust : `f32`/`f64` = IEEE-754 (memes pieges) ; `rust_decimal` pour l'exact ; `chrono`/`time` pour fuseaux.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
