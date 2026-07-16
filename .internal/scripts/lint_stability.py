#!/usr/bin/env python3
"""Lint : chaque .md non exempté doit avoir un frontmatter stability:."""
import os, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
EXEMPT = {"README.md", "LICENSE", "COMMUNAUTE.md", "NE_PAS_OUVRIR.md"}
FM_RE = re.compile(r"\A---\n(.*?)\n---", re.S)
missing = []
for f in ROOT.rglob("*.md"):
    if any(part.startswith(".") for part in f.relative_to(ROOT).parts): continue
    if f.name in EXEMPT: continue
    fm = FM_RE.match(f.read_text(errors="ignore"))
    if not fm or "stability:" not in fm.group(1):
        missing.append(str(f.relative_to(ROOT)))
if missing:
    print("MANQUE frontmatter stability: sur :")
    for m in missing[:30]: print(f"  {m}")
    print(f"... total {len(missing)}")
    sys.exit(1)
print("OK lint_stability")
