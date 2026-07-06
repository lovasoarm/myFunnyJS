#!/usr/bin/env python3
"""
style_lint.py : filet de style déterministe du curriculum MyFunnyJS.

Rejette, sur tout le repo :
  1. tout emoji (le curriculum s'interdit les emojis) ;
  2. tout em-dash "—" utilisé comme séparateur stylistique dans un .md ;
  3. toute cellule de la colonne "Analogies" d'un grimoire qui ne contient
     pas EXACTEMENT 2 analogies séparées par " / ".

Sortie : liste des violations + code de retour non-zéro si au moins une.
Aucune dépendance externe. Usage : python3 style_lint.py [racine]
"""
import re, sys, glob, os

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()

EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF\U00002600-\U000026FF\U00002700-\U000027BF"
    "\U0001F1E6-\U0001F1FF\uFE0F\u2705\u274C\u2699\u2b50\u2764]"
)

def cells_of(line):
    """Découpe une ligne de table en cellules en ignorant les | échappés
    (\\|) et les | à l'intérieur de spans code (`...`)."""
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

def lint():
    violations = []
    md_files = sorted(glob.glob(os.path.join(ROOT, "**", "*.md"), recursive=True))
    for f in md_files:
        rel = os.path.relpath(f, ROOT)
        for ln, line in enumerate(open(f, encoding="utf-8"), 1):
            if EMOJI.search(line):
                violations.append(f"{rel}:{ln} EMOJI interdit")
            if "—" in line:
                violations.append(f"{rel}:{ln} EM-DASH interdit (utilise ' - ' ou ' : ')")
    # grimoires : colonne Analogies == exactement 2
    for f in sorted(glob.glob(os.path.join(ROOT, "**", "*grimoire*.md"), recursive=True)):
        rel = os.path.relpath(f, ROOT)
        lines = open(f, encoding="utf-8").read().split("\n")
        col = ncol = None
        for ln, line in enumerate(lines, 1):
            st = line.strip()
            if not st.startswith("|"):
                if st == "": col = None
                continue
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
            if len(cs) < ncol:
                continue
            cell = cs[col].strip()
            if not cell:
                continue
            parts = [p for p in cell.split(" / ") if p.strip()]
            if len(parts) != 2:
                violations.append(f"{rel}:{ln} ANALOGIES={len(parts)} (attendu 2 séparées par ' / ') | {cell[:70]}")
    return violations

if __name__ == "__main__":
    v = lint()
    for item in v:
        print("  [STYLE] " + item)
    if v:
        print(f"[FAIL] style_lint : {len(v)} violation(s).")
        sys.exit(1)
    print("[OK] style_lint : zéro emoji, zéro em-dash, toutes les analogies = 2.")
