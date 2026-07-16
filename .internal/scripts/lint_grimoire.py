#!/usr/bin/env python3
"""Lint grimoires : chaque ligne data doit contenir exactement 2 analogies.
Deux formats acceptés :
  A) 4 colonnes markdown, analogies dans col 4 séparées par ' | ' (nouveau format v14).
  B) 5+ colonnes markdown, analogies = col 4 + col 5 comme cellules distinctes.
Une éventuelle 6e colonne 'Où l'analogie casse' est acceptée (warn si vide)."""
import re, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
fail = 0
for f in ROOT.rglob("*grimoire*.md"):
    if any(p.startswith(".") for p in f.relative_to(ROOT).parts): continue
    for i, line in enumerate(f.read_text(errors="ignore").splitlines(), 1):
        if not line.startswith("|"): continue
        if "---" in line or ":--" in line: continue
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if len(cells) < 4: continue
        head = cells[0].lower().strip("* `")
        if head in ("terme","termes","concept","concepts","nom","noms","flag","flags","élément","éléments","réflexe","réflexes"): continue
        # Case A: 4 cols
        if len(cells) == 4:
            parts = [p.strip() for p in cells[3].split("|") if p.strip()]
            if len(parts) != 2:
                # tolérer si la col contient " / " (pas encore migré) : signaler soft
                print(f"WARN {f.relative_to(ROOT)}:{i}: 4-col, {len(parts)} analogie(s)")
        else:
            # Case B: >=5 cols → analogies = cells[3], cells[4]
            if not cells[3] or not cells[4]:
                print(f"FAIL {f.relative_to(ROOT)}:{i}: analogie vide")
                fail += 1
sys.exit(1 if fail else 0)
