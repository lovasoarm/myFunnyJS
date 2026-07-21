#!/usr/bin/env python3
"""Refuse un POSTMORTEM.md de mini-projet sans section OWASP + 10 items A01..A10."""
import pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
MP = ROOT / "30_mini_projects"
required = [f"A{n:02d}" for n in range(1, 11)]
MARK = "## OWASP PASSE"
fails = []
for pm in sorted(MP.glob("*/POSTMORTEM.md")):
  txt = pm.read_text(errors="ignore")
  if MARK not in txt:
    fails.append((pm.relative_to(ROOT), "section OWASP absente"))
    continue
  missing = [tag for tag in required if tag not in txt]
  if missing:
    fails.append((pm.relative_to(ROOT), f"items manquants : {','.join(missing)}"))
if fails:
  print("LINT OWASP POSTMORTEM : ECHEC")
  for p, why in fails:
    print(f"  {p} : {why}")
  sys.exit(1)
print(f"OK lint_postmortem_owasp ({len(list(MP.glob('*/POSTMORTEM.md')))} POSTMORTEM verifies)")
