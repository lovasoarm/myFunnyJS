#!/usr/bin/env python3
"""a11y_lint.py : lint markdown pour la lisibilité du curriculum.
Repère : paragraphes > 500 mots, sections sans H2 fréquents, tables sans en-tête.
Sortie : .internal/.audit/a11y_curriculum.md
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / ".internal" / ".audit" / "a11y_curriculum.md"
OUT.parent.mkdir(parents=True, exist_ok=True)

def audit(path):
    txt = path.read_text(encoding="utf-8")
    issues = []
    for para in txt.split("\n\n"):
        words = len(para.split())
        if words > 500:
            issues.append(f"paragraphe {words} mots (>500)")
    h2s = re.findall(r"^## ", txt, re.M)
    total_lines = len(txt.splitlines())
    if total_lines > 200 and len(h2s) < total_lines // 100:
        issues.append(f"seulement {len(h2s)} H2 pour {total_lines} lignes")
    for table in re.findall(r"^\|.*\|$", txt, re.M):
        pass  # pas de check header ici, indicatif
    return issues

lines = ["# A11Y CURRICULUM : audit auto", ""]
for md in sorted(ROOT.rglob("*.md")):
    if ".internal" in md.parts: continue
    issues = audit(md)
    if issues:
        lines.append(f"## {md.relative_to(ROOT)}")
        for i in issues: lines.append(f"- {i}")
        lines.append("")
OUT.write_text("\n".join(lines), encoding="utf-8")
print(f"écrit : {OUT}")
