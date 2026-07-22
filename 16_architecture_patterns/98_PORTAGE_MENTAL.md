---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **16_architecture_patterns** : architecture (couches, hexagonal, ports/adapters).

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : hexagonal se traduit tel quel ; `Protocol` remplace les interfaces TS ; injection via constructeurs, pas via decorators.
- **Go** : Go : hexagonal via packages + interfaces ; injection manuelle (pas de conteneur DI standard) ; `internal/` protege les frontieres.
- **Rust** : Rust : modules + `pub(crate)` protegent les frontieres ; traits = ports, structs = adapters ; DI manuelle et explicite.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
