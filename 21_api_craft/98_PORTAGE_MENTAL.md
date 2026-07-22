---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **21_api_craft** : conception d'API (REST, GraphQL, contrats).

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : `FastAPI` genere le contrat OpenAPI depuis les types ; validation via `pydantic` (equivalent zod) ; versioning par chemin/entete identique.
- **Go** : Go : contrats via OpenAPI + `oapi-codegen` ; validation avec `go-playground/validator` ; versioning par chemin comme partout.
- **Rust** : Rust : `utoipa` genere OpenAPI depuis les types ; validation via `validator`/`serde` ; contrats types-safe end-to-end.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
