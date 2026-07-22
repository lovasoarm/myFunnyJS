---
stability: intemporel
---

# EXO : debugging a l'aveugle (Pierre 5, 11.5)

Temps de lecture ~2 min


Un mainteneur te livre un bug en une phrase, sans stack, sans repro, sans logs.

## Enonce
"Depuis vendredi, une commande sur cent est facturee deux fois. On ne sait ni laquelle, ni pourquoi."

## Regle
1. Interdit d'ouvrir le code avant d'avoir ecrit 5 hypotheses classees par probabilite (`HYPOTHESES.md`).
2. Chaque hypothese doit inclure son test de falsification.
3. Une fois le code ouvert, tu ne modifies rien avant d'avoir reproduit le bug (deterministe).

## Livrables
- `HYPOTHESES.md` (5 hypotheses minimum, verdict pour chacune).
- `REPRO.md` (comment reproduire a 100 %).
- `FIX.md` (correctif + test de non-regression).

## Auto-verification
Un pair (ou toi 24h plus tard) doit pouvoir rejouer ton `REPRO.md` et voir le bug.
