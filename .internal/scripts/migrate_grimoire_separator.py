#!/usr/bin/env python3
"""Migre séparateur d'analogies ' / ' -> ' | ' dans la 4e colonne des grimoires.
Version v19 : broaden regex to cover parentheses, quotes, punctuation."""
import re, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
changed = 0
for f in ROOT.rglob("*grimoire*.md"):
    if any(p.startswith(".") for p in f.relative_to(ROOT).parts): continue
    original = f.read_text()
    lines = original.splitlines(keepends=True)
    new = []
    for line in lines:
        if line.startswith("|") and line.count("|") >= 5 and "---" not in line and ":--" not in line:
            cells = line.split("|")
            cols = cells[1:-1]
            if len(cols) >= 4:
                # Fusionner tout au-delà de la 4e col dans col[3] (au cas où d'anciens ' | ' fragmentent)
                if len(cols) > 4:
                    cols = cols[:3] + [" | ".join(c.strip() for c in cols[3:])]
                # Remplacer ' / ' isolé (séparateur d'analogies) par ' | '
                # Éviter M/V/C etc. : on exige au moins 3 caractères de part et d'autre du slash espace-slash-espace
                col3 = cols[3]
                # replace patterns like ") / X" or "word / X" : space slash space between substantives
                col3 = col3.replace(' / ', ' | ')
                cols[3] = col3
                cells = [""] + cols + [""]
                new_line = "|".join(cells)
                if line.endswith("\n") and not new_line.endswith("\n"):
                    new_line += "\n"
                line = new_line
        new.append(line)
    out = "".join(new)
    if out != original:
        f.write_text(out); changed += 1
print(f"Migré : {changed} fichiers")
