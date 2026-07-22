---
stability: intemporel
---

# 17_polyglot_forge

Temps de lecture ~2 min


Deuxième mini-projet cross-language de MyFunnyJS. Prouve que ta modélisation de l'event loop **transfère** d'un langage à l'autre en produisant strictement la même trace pour la même entrée.

- Lis `cahierdescharges.md` pour l'objectif verrouillé et la grille scorée.
- Lis `ADR/ADR-001_choix_langage_secondaire.md` avant de coder.
- Remplis `TDD_JOURNAL.md` au fil de l'eau.
- Rédige `POSTMORTEM.md` à la fin, même si tu as réussi.

Lance :
```bash
bash tests/run_all.sh
```

Attendu : `POLYGLOT PARITY OK`.

---
stability: stable

---

## REPRODUCTIBILITÉ

Installation canonique : `npm ci` (pas `npm install`). `npm ci` respecte strictement le `package-lock.json` : deux personnes qui clonent obtiennent exactement les mêmes versions. Committe toujours ton `package-lock.json`. Sans lui, un `npm install` 3 mois plus tard installera d'autres versions et tu debug un fantôme.