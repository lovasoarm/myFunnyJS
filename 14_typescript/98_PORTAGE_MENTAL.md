---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **14_typescript** : typage statique et generics.

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : type hints + `mypy`/`pyright` ; generics via `TypeVar` et `Generic[T]` ; pas de `readonly`, on utilise `Final` et `frozen dataclass`.
- **Go** : Go : typage statique nominal ; generics depuis 1.18 (`func F[T any](x T)`) ; pas de types utilitaires, on ecrit chaque type.
- **Rust** : Rust : typage statique fort + inference locale ; generics + traits bounds ; pas d'`any`, `unknown` = `dyn Any` ou generic.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
