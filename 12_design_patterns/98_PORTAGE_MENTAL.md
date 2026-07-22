---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **12_design_patterns** : patterns d'architecture (factory, observer, strategy).

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : patterns souvent implicites (ducktyping remplace factory + interface) ; `abc.ABC` pour formaliser ; decorator natif remplace beaucoup de wrappers.
- **Go** : Go : composition > heritage ; interfaces implicites ; les patterns GoF se simplifient (souvent une fonction suffit).
- **Rust** : Rust : traits + enums + pattern matching remplacent la moitie des patterns ; ownership rend certains patterns (singleton mutable) inutiles ou dangereux.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
