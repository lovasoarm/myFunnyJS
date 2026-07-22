---
stability: intemporel
---

# 17_polyglot_forge

Temps de lecture ~2 min

Mini-projet scoré : reprendre l'event loop de `03_async/04_event_loop/` et le prouver équivalent en **deux langages** (JS + Python OU JS + Rust) via tests déterministes partagés. Deuxième livrable cross-language de MyFunnyJS (après `15_porte_rasengan_engine_multilang`), pour matérialiser la Pierre 6 "Pensée Transférable".

## Objectif verrouillé

Modéliser un event loop simplifié (macrotask queue + microtask queue + tick) dans **2 langages**. Prouver que pour la même séquence d'entrée, les deux implémentations produisent la **même trace de sortie**, ligne pour ligne.

## Critère de succès (binaire, mesurable)

```bash
bash tests/run_all.sh
# doit sortir "POLYGLOT PARITY OK" et code 0
```

Le script compare `output_js.txt` et `output_pyOrRust.txt` avec `diff`. Zéro divergence = OK.

## Contraintes

- Aucune dépendance externe hors stdlib du langage cible.
- Chaque implémentation doit tenir en < 200 lignes.
- Le fichier `tests/scenario.json` est la seule source d'entrée : les deux runtimes le lisent.
- Zéro comportement dépendant du wall-clock (utilise des tokens de temps logiques `t=0, t=1, ...`).

## Livrables

- `src/loop.js`
- `src/loop.py` (ou `src/loop.rs` avec un `Cargo.toml` minimal)
- `tests/scenario.json`
- `tests/expected.txt`
- `tests/run_all.sh`
- `ADR/ADR-001_choix_langage_secondaire.md`
- `TDD_JOURNAL.md`
- `POSTMORTEM.md`

## Grille de correction (scorée sur 10)

| Critère                                                      | Points |
| ------------------------------------------------------------ | ------ |
| `run_all.sh` sort "POLYGLOT PARITY OK"                       | 3      |
| ADR justifie le choix Python vs Rust en < 20 lignes          | 1      |
| Aucune dépendance externe hors stdlib                        | 1      |
| Les deux impls < 200 lignes chacune                          | 1      |
| Trace de sortie déterministe sur 3 scénarios différents      | 2      |
| POSTMORTEM cite au moins 1 divergence rencontrée et sa cause | 2      |

Seuil de réussite : 8/10. En dessous, `EXO_JEUNE_IA.md` du module concerné et re-tenter.

## RÔLE DES DOSSIERS (ne skippe pas)

- `src/` : **tu remplis toi-même**. Le dossier est vide exprès : c'est ton livrable. Aucun code fourni.
- `tests/` : **TDD strict : tu écris le test AVANT le code de `src/`**. Rouge → vert → refactor. Si `tests/` est vide en fin de projet, ce projet ne compte pas dans ton portfolio.
- `ADR/` : **au moins 1 décision architecturale documentée** (choix de structure, trade-off, alternative rejetée + pourquoi). Format : Contexte / Décision / Conséquences.
- `POSTMORTEM.md` : **rédigé à la fin, honnête**. Ce qui a foiré, combien de temps t'a coûté chaque blocage, ce que tu referais autrement.
- `TDD_JOURNAL.md` : trace vivante du cycle rouge/vert/refactor.

**Un CTO qui feuillette ton portfolio regarde `src/` ET `tests/` ET `ADR/`. Un `src/` vide sans `tests/` associé = projet non fini, quelle que soit la qualité du reste.**
