---
stability: intemporel
---

# ADR 001 : choix du langage secondaire

Temps de lecture ~2 min


## Contexte
Le mini-projet impose de re-implémenter un event loop dans **deux langages** pour prouver la transférabilité (Pierre 6). Le premier est JS (référence du curriculum). Il faut choisir le second.

## Décision
Choisir soit **Python 3.11+** soit **Rust stable 1.75+**. Justifier en < 20 lignes dans le POSTMORTEM. Aucun autre langage accepté pour ce projet (garantit la reproductibilité de la grille de correction).

## Alternatives écartées
- **TypeScript** : trop proche de JS, ne prouve rien de la transférabilité.
- **Go** : accepté à titre exceptionnel si tu justifies un usage prod concret. Attention : la runtime a son propre scheduler, ce qui complique la comparaison de trace.
- **Java / C#** : trop de cérémonie pour tenir en 200 lignes.

## Conséquences
- Si Python : impl rapide, comparaison directe, faible barrière à l'entrée.
- Si Rust : impl plus longue, mais prouve que tu tiens l'ownership / borrow checker sur une structure de queue.
- Dans les deux cas : zéro dépendance externe hors stdlib.

## Statut
Accepté. À rediscuter uniquement si le curriculum ajoute un 3e mini-projet polyglot.
