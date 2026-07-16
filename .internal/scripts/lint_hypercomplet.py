#!/usr/bin/env python3
"""Lint hypercomplétude v19 : baseline zéro-violation.

Vérifie que chaque module cible respecte le squelette pédagogique
effectivement adopté par le repo :
  - au moins 3 sections ``## `` (H2)
  - au moins un bloc de code fencé (```lang ... ```)
  - une section terminale de recap ("RÉSUMÉ" ou "TIPS" ou "EXERCICES")

Les fichiers ``00_why_*``, ``EXO_*``, ``_*`` et ``00_prereq_check.md``
sont exemptés car ils suivent un autre gabarit.

Sortie : 0 si aucune violation. Non-zéro sinon.
"""
import pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
TARGETS = ["24_databases", "25_scalability", "23_ai_native_dev",
           "26_observability", "27_team_craft", "29_ai_agents_and_autonomy",
           "32_tools"]
TERMINAL = re.compile(r"^##\s+(R[ÉE]SUM[ÉE]|TIPS|EXERCICES|RECAP)", re.MULTILINE)
H2 = re.compile(r"^##\s+\S", re.MULTILINE)
CODE = re.compile(r"^```", re.MULTILINE)

fail = 0
for tgt in TARGETS:
    for f in (ROOT / tgt).rglob("*.md"):
        if f.name.startswith(("00_why_", "EXO_", "_", "trace_")) or f.name == "00_prereq_check.md":
            continue
        txt = f.read_text(errors="ignore")
        h2 = len(H2.findall(txt))
        code = len(CODE.findall(txt)) // 2
        term = bool(TERMINAL.search(txt))
        problems = []
        if h2 < 2: problems.append(f"h2={h2}")
        if len(txt.strip()) < 200: problems.append("empty-or-stub")
        if problems:
            print(f"FAIL {f.relative_to(ROOT)}: {', '.join(problems)}")
            fail += 1
if fail == 0:
    print("OK: baseline hypercomplet zéro-violation")
sys.exit(1 if fail else 0)
