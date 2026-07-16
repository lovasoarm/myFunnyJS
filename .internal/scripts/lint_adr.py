#!/usr/bin/env python3
"""Lint ADR : chaque projet doit avoir >= ADR_MINIMUM ADR dans ADR/."""
import os, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
mini = ROOT / "30_mini_projects"
fail = 0
for proj_dir in sorted(p for p in mini.iterdir() if p.is_dir() and re.match(r"\d\d_", p.name)):
    rules = proj_dir / "RULES.md"
    if not rules.exists():
        print(f"FAIL {proj_dir.name}: RULES.md manquant"); fail += 1; continue
    m = re.search(r"ADR_MINIMUM.*?\*\*(\d+)\*\*", rules.read_text(), re.S)
    if not m:
        print(f"FAIL {proj_dir.name}: ADR_MINIMUM absent de RULES.md"); fail += 1; continue
    minimum = int(m.group(1))
    adr_dir = proj_dir / "ADR"
    n = len(list(adr_dir.glob("ADR-*.md"))) if adr_dir.exists() else 0
    if n < minimum:
        print(f"FAIL {proj_dir.name}: {n} ADR < ADR_MINIMUM ({minimum})"); fail += 1
    else:
        print(f"OK   {proj_dir.name}: {n} ADR (min {minimum})")
sys.exit(1 if fail else 0)
