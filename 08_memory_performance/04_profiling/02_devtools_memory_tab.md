---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# 02 : DevTools Memory tab : le guide de terrain
Temps de lecture ~5 min

Trois outils dans l'onglet Memory. Chacun répond à une question différente.

## 1. Heap snapshot : "qui vit maintenant ?"

- Snapshot avant l'action suspecte.
- Snapshot après.
- Comparaison (dropdown "Comparison").
- Tri par "Delta". Les objets qui grossissent, c'est là.

Colonnes qui comptent : **Shallow size** (l'objet seul), **Retained size** (l'objet + ce qu'il empêche de collecter).

## 2. Allocation instrumentation on timeline : "qui alloue trop ?"

Enregistre. Fais l'action. Stop. Les barres bleues persistantes = alloué et jamais libéré = suspect.

## 3. Allocation sampling : "où alloue mon code chaud ?"

Léger. Bon pour prod-like. Te dit **quelle fonction** alloue le plus.

## Workflow anti-fuite

1. Baseline : snapshot A à froid.
2. Fais l'action 3 fois (chauffe caches).
3. Snapshot B.
4. Fais l'action 10 fois.
5. Snapshot C.
6. Compare B→C. Si delta > 0 régulier → fuite.

## Piège

DevTools force un GC avant snapshot, mais **pas** entre allocations. Ne panique pas sur un pic si le suivant est plat.

## Mission

Sur n'importe quelle SPA (la tienne, un mini-projet), trouve une fuite en < 20 min avec ce workflow. Note-la dans un fichier `LEAK_REPORT.md`.
