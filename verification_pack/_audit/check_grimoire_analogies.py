#!/usr/bin/env python3
"""
check_grimoire_analogies.py
Fail-fast sur toute cellule de la colonne "Analogies" d'un grimoire dont
le split ' / ' n'est pas exactement 2. Renforce le lint existant.

Usage : python3 check_grimoire_analogies.py [racine]
"""
import os, re, sys, glob

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()

def cells_of(line):
    s = line.strip().replace("\\|", "\x00")
    out, inb, cur = [], False, ""
    for ch in s:
        if ch == "`":
            inb = not inb; cur += ch
        elif ch == "|" and not inb:
            out.append(cur); cur = ""
        else:
            cur += ch
    out.append(cur)
    out = [c.replace("\x00", "\\|") for c in out]
    if out and out[0].strip() == "": out = out[1:]
    if out and out[-1].strip() == "": out = out[:-1]
    return out

violations = []
for f in sorted(glob.glob(os.path.join(ROOT, "**", "*grimoire*.md"), recursive=True)):
    rel = os.path.relpath(f, ROOT).replace("\\", "/")
    lines = open(f, encoding="utf-8").read().split("\n")
    col = ncol = None
    for ln, line in enumerate(lines, 1):
        st = line.strip()
        if not st.startswith("|"):
            if st == "": col = None
            continue
        # separator row
        if set(st.replace("|", "").replace("-", "").replace(":", "").replace(" ", "")) == set():
            continue
        low = line.lower()
        if col is None:
            if "analog" in low:
                cs = [c.strip().lower() for c in cells_of(line)]
                for i, c in enumerate(cs):
                    if "analog" in c:
                        col, ncol = i, len(cs); break
            continue
        cs = cells_of(line)
        if len(cs) < ncol: continue
        cell = cs[col].strip()
        if not cell: continue
        parts = [p for p in cell.split(" / ") if p.strip()]
        if len(parts) != 2:
            violations.append(f"{rel}:{ln} ANALOGIES={len(parts)} (attendu 2) | {cell[:80]}")

for v in violations:
    print("  [ANALOG] " + v)
if violations:
    print(f"[FAIL] check_grimoire_analogies : {len(violations)} violation(s).")
    sys.exit(1)
print("[OK] check_grimoire_analogies : chaque cellule Analogies contient exactement 2 analogies.")
