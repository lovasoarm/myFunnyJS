---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **24_databases** : bases de donnees (SQL, transactions, index).

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : `SQLAlchemy`/`asyncpg` ; transactions et niveaux d'isolation identiques ; migrations via `alembic`.
- **Go** : Go : `database/sql` + drivers ; `sqlc` genere du code type-safe depuis SQL ; transactions identiques.
- **Rust** : Rust : `sqlx` (types verifies contre la DB a la compilation) ou `diesel` ; transactions et isolation identiques.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
