---
stability: intemporel
---

# CHALLENGE CROSS-LANGUAGE : preuve de transferabilité

Temps de lecture ~3 min

-> ~6-10 h de travail effectif, à répartir sur 1-2 semaines

Compétence visée : prouver, par produit, que ton raisonnement d'ingénieur ne dépend pas de JavaScript. C'est la Pierre 6 (pensée transférable) qui cesse d'être une promesse pour devenir une preuve.

> **CHECKPOINT BLOQUANT (v20.3)** : ce challenge est **obligatoire apres le module
> `14_typescript`**. Tant qu'il n'est pas passe avec produit commite (algo + pattern
> dans un langage non-JS, tests verts sur `crosslang_compare.sh`), tu ne considere
> pas le module 14 comme valide, meme si la roadmap continue. Raison : sans drill
> valide dans un second langage, la Pierre 6 (pensee transferable) reste postulee,
> pas prouvee. Aucune auto-attestation de module 14 sans ce livrable. Le
> `POSTMORTEM.md` du mini-projet 15 s'appuie explicitement sur ce checkpoint.

Ce challenge complète et remplace la question ouverte "je saurais refaire ça ailleurs" par un livrable comparable à la référence JS.

Renvois utiles :

- `31_annexes/transferability/` (exercices ciblés existants : `01_closure_in_python.md`, `03_event_loop_in_pseudorust.md`, `06_observer_in_go.md`, `08_final_cross_language_challenge.md`).
- `30_mini_projects/15_porte_rasengan_engine_multilang/` (mini-projet cross-language de référence).
- `node solution.js` (auto-verif ecrite par toi) (comparateur de sorties, fourni).

## LE CONTRAT

Tu vas produire, dans **un langage non-JS au choix** (Python, Go, Rust, Java, C#) :

1. **Un algorithme** issu de `10_algorithms/`. Choix libre : tri, recherche binaire, graphe (BFS/DFS/Dijkstra), programmation dynamique. Complexité annoncée identique à la version JS.
2. **Un pattern** issu de `12_design_patterns/`. Choix libre parmi Strategy, Observer, Builder, Adapter, Decorator, State. Interface publique équivalente.

Les deux livrables doivent :

- Prendre les mêmes entrées (format identique, JSON ou lignes de texte) que la version JS.
- Produire les mêmes sorties (byte-exact ou à `EPSILON` près pour du flottant).
- Passer la même batterie de tests (portée par `crosslang_compare.sh`).

## STRUCTURE DE LIVRAISON

```
crosslang_challenge/
  algo_<nom>/
    js/    (référence, extraite de 10_algorithms)
    <lang>/
      src/
      tests/
      README.md   (choix de langage, ADR mini)
  pattern_<nom>/
    js/
    <lang>/
      src/
      tests/
      README.md
  RAPPORT.md      (ce que tu as appris, ce qui a résisté, ce qui a plié)
```

## GRILLE DE CONFORMITÉ (à cocher toi-même)

| #   | Critère                                                                             | OK  |
| --- | ----------------------------------------------------------------------------------- | --- |
| 1   | Sorties identiques à la version JS sur ≥ 10 cas de test                             |     |
| 2   | Complexité asymptotique documentée et respectée                                     |     |
| 3   | Erreurs / cas limites gérés de façon équivalente (pas de crash silencieux)          |     |
| 4   | Choix de langage justifié en 5 lignes minimum                                       |     |
| 5   | RAPPORT.md nomme au moins 3 choses qui ont mieux fonctionné, ou moins bien, hors JS |     |
| 6   | `crosslang_compare.sh` renvoie 0 sur la totalité des cas de test                    |     |

6/6 obligatoire. Pas de 5/6 "presque bon". **Rappel checkpoint bloquant** : ce
6/6 est le prerequis de sortie du module 14 ; sans lui, la Pierre 6 reste une
promesse.

## POURQUOI CETTE GREFFE, ET PAS UN NOUVEAU MODULE

Un nouveau module aurait allongé le curriculum sans preuve additionnelle. Une greffe unique à la fin du parcours, exigeant deux artefacts vérifiables, prouve la transferabilité **une fois pour toutes** : et ça passe au portfolio.

## RAPPORT.md : STRUCTURE OBLIGATOIRE

1. **Langage choisi et pourquoi.** Pas "j'aime Python", mais "j'avais besoin de X".
2. **Ce que le typage / la mémoire manuelle / le GC différent m'a forcé à reconsidérer.**
3. **Un concept JS qui a mal survécu au portage** (closure, coercion, event loop, prototype).
4. **Un concept qui a mieux survécu que prévu.**
5. **Ce que je changerais dans mon code JS après avoir fait ce challenge.**

## ENCHAÎNEMENT

- Prérequis : `10_algorithms/` complet, `12_design_patterns/` complet, `31_annexes/transferability/README.md` lu.
- Ne pas commencer avant : la fin des mini-projets `01`, `05`, `15`. Sinon tu n'as pas la maturité pour comparer.
- Après : passe à `31_annexes/career/interview_defense.md` scénario 2. Tu défendras plus solidement.

---

## PALIERS OBLIGATOIRES (v20.4) : 3 langages, une même fonction pure

Le "un langage non-JS au choix" reste la porte d'entrée. Mais pour prouver
la Pierre 6 comme un pilier (et non une note de bas de page), tu franchis
**3 paliers cumulatifs** en réimplémentant la **même fonction pure**
(entrée -> sortie déterministe, pas d'effet de bord) dans 3 familles de
langages :

### Palier A : langage à typage dynamique proche (Python)

- Choix imposé : **Python**.
- Objectif : voir ce qui change quand la stdlib est riche et le typage nominal absent.
- Livrable : `crosslang_challenge/pure_fn/python/` avec `src/`, `tests/`, `README.md`.

### Palier B : langage à typage statique et modèle mémoire différent (Go **ou** Rust)

- Choix libre entre **Go** et **Rust**.
- Objectif : affronter le compilateur, gérer la mémoire ou le GC autrement.
- Livrable : `crosslang_challenge/pure_fn/<go|rust>/`.

### Palier C : langage jamais vu (Elixir, Zig, Gleam, OCaml, Roc...)

- Choix libre parmi une famille inconnue **au moment où tu commences**.
- Objectif : prouver que tu peux atteindre "hello world utile" dans un
  écosystème neuf en <= 8 h, tests compris.
- Livrable : `crosslang_challenge/pure_fn/<lang>/` + une section
  "ce que je n'aurais pas trouvé sans la doc officielle" dans le README.

### Grille 6/6 par palier

Chaque palier doit passer la même grille que ci-dessus (sorties identiques,
complexité, cas limites, justification, RAPPORT, comparateur à 0). **3 x 6/6
obligatoire** pour valider le diplôme. Un palier à 5/6 = palier non passé.

### Pourquoi 3 paliers, pas 1

Un seul langage prouve "je peux". Trois paliers prouvent "je peux dans
n'importe quelle famille" : ce qui est la définition opérationnelle de la
Pierre 6. C'est ce qui bloque le diplôme, pas la roadmap.
