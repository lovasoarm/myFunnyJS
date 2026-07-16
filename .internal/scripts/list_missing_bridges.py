#!/usr/bin/env python3
"""Vérifie qu'entre chaque paire N -> N+1 un pont 99_PONT_ existe ou est absent volontairement."""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
mods = sorted(p for p in ROOT.iterdir() if p.is_dir() and re.match(r"\d\d_", p.name))
JUSTIFIED_ABSENT = set()  # à peupler si un pont est explicitement inutile
missing = []
for a, b in zip(mods, mods[1:]):
    na = int(a.name.split("_")[0]); nb = int(b.name.split("_")[0])
    if nb - na != 1: continue
    expected = list(a.glob(f"99_PONT_{na}_{nb}.md"))
    if not expected and (na, nb) not in JUSTIFIED_ABSENT:
        missing.append(f"{a.name} -> {b.name}")
for m in missing: print(f"MANQUE PONT : {m}")
print(f"Total ponts manquants : {len(missing)}")
