---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **13_refactoring** : refactoring et code smells.

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : `black`/`ruff` figent le style ; `rope`/`libcst` refactorent ; les code smells restent identiques (long function, feature envy).
- **Go** : Go : `gofmt`/`golangci-lint` imposent le style ; refactor via `gopls` ; code smells classiques restent.
- **Rust** : Rust : `rustfmt`/`clippy` sont severes ; le compilateur guide le refactor ; smells classiques + specifiques au borrow checker.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
