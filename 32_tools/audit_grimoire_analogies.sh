#!/usr/bin/env bash
# 32_tools/audit_grimoire_analogies.sh
# Regle : dans tout *grimoire*.md, chaque ligne de donnees d'un tableau
# markdown doit avoir sa cellule "Analogies" au format
# "analogie1 / analogie2" -> exactement UNE occurrence de " / ".
# La colonne Analogies est detectee par l'en-tete (compatible avec les
# tableaux a 4 ou 5 colonnes : "| Terme | Definition | Code | Analogies |"
# ou "| Terme | Definition | Code | Analogies | Limite |").
# Spec : .internal/README.md, section "Regle analogies (grimoires)".
set -euo pipefail

ROOT="${1:-.}"

python3 - "$ROOT" <<'PY'
import re, sys, pathlib
root = pathlib.Path(sys.argv[1])
fail = 0
print("# Rapport analogies grimoires (exactement 1 ' / ' par cellule analogies)")
print()

def cells_of(row):
    row = row.strip()
    if row.endswith('|'): row = row[:-1]
    if row.startswith('|'): row = row[1:]
    return [c.strip() for c in row.split('|')]

for f in sorted(root.rglob('*grimoire*.md')):
    lines = f.read_text().split('\n')
    analog_idx = None
    in_table = False
    header_row = None
    for i, s in enumerate(lines, 1):
        stripped = s.strip()
        # header candidate : starts with |, contains "Analog"
        if not in_table and stripped.startswith('|') and 'Analog' in stripped and '---' not in stripped:
            hc = cells_of(stripped)
            for j, c in enumerate(hc):
                if c.lower().startswith('analog'):
                    analog_idx = j
                    break
            header_row = i
            continue
        if re.match(r'^\s*\|\s*[-:]+[\s\|:\-]+$', s):
            in_table = analog_idx is not None
            continue
        if not in_table:
            continue
        if not stripped.startswith('|') or stripped == '':
            in_table = False
            analog_idx = None
            continue
        cs = cells_of(stripped)
        if analog_idx is None or analog_idx >= len(cs):
            continue
        cell = cs[analog_idx]
        n = len(re.findall(r' / ', cell))
        if n != 1:
            print(f"- [FAIL] {f}:{i}  slashes={n}")
            fail += 1
print()
if fail:
    print(f"Total en derive : {fail} ligne(s).")
    sys.exit(1)
print("Toutes les cellules analogies ont exactement 1 ' / '.")
PY
