---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **11_functional_js** : programmation fonctionnelle (map/filter/reduce, immuabilite).

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : `map()`/`filter()` renvoient des iterateurs paresseux ; `functools.reduce` ; immuabilite via `tuple`, `frozenset`, `dataclass(frozen=True)`.
- **Go** : Go : pas de `map`/`reduce` natifs (avant generics 1.18+) ; on ecrit des boucles explicites ; immuabilite par convention (pas de `const` structure).
- **Rust** : Rust : iterateurs paresseux natifs (`iter().map().filter().collect()`) ; immuabilite par defaut (`let` vs `let mut`) ; `fold` = reduce.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
