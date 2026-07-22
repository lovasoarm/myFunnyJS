#!/usr/bin/env bash
# 32_tools/audit_grimoire_analogies.sh
# Regle : dans tout *grimoire*.md, chaque ligne de donnees d'un tableau
# markdown doit avoir sa DERNIERE cellule (colonne "Analogies") au format
# "analogie1 / analogie2" -> exactement UNE occurrence de " / ".
# Spec : .internal/README.md, section "Regle analogies (grimoires)".
set -euo pipefail

ROOT="${1:-.}"

python3 - "$ROOT" <<'PY'
import re, sys, pathlib
root = pathlib.Path(sys.argv[1])
fail = 0
print("# Rapport analogies grimoires (exactement 1 ' / ' par cellule analogies)")
print()
for f in sorted(root.rglob('*grimoire*.md')):
    in_table = False
    lines = f.read_text().split('\n')
    for i, s in enumerate(lines, 1):
        if re.match(r'^\s*\|\s*[-:]+[\s\|:\-]+$', s):
            in_table = True
            continue
        if not in_table:
            continue
        if not s.lstrip().startswith('|') or s.strip() == '':
            in_table = False
            continue
        row = s.strip()
        if row.endswith('|'):
            row = row[:-1]
        cells = row.split('|')[1:]
        if not cells:
            continue
        last = cells[-1].strip()
        if not last or last.lower() in ('analogies', 'contre-analogies'):
            continue
        n = len(re.findall(r' / ', last))
        if n != 1:
            print(f"- [FAIL] {f}:{i}  slashes={n}")
            fail += 1
print()
if fail:
    print(f"Total en derive : {fail} ligne(s).")
    sys.exit(1)
print("Toutes les cellules analogies ont exactement 1 ' / '.")
PY
