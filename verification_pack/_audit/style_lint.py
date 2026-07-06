#!/usr/bin/env python3
"""
style_lint.py : filet de style deterministe du curriculum MyFunnyJS.

Rejette :
  1. tout emoji (le curriculum s'interdit les emojis) ;
  2. tout em-dash "-" utilise comme separateur stylistique dans un .md ;
  3. toute cellule "Analogies" d'un grimoire hors format "2 analogies separees par ' / '" ;
  4. tout mot tutoriel interdit hors contexte (login, panier) et
     detection contextuelle sur `produit`, `commande` (nom d'e-commerce
     vs verbe / CLI legitimes) ;
  5. toute lecon d'un module numerote sans marqueur `stability:` en fin de fichier
     (intemporel | stable | perissable). Certains fichiers (README, templates,
     trackers) sont exemptes.

Sortie : liste des violations + code retour != 0 si au moins une.
Aucune dependance externe. Usage : python3 style_lint.py [racine]
"""
import re, sys, glob, os

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()

EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF\U00002600-\U000026FF\U00002700-\U000027BF"
    "\U0001F1E6-\U0001F1FF\uFE0F\u2705\u274C\u2699\u2b50\u2764]"
)

FORBIDDEN_HARD = re.compile(r"\b(login|panier)\b", re.IGNORECASE)
# "produit" et "commande" : detection contextuelle -- flag seulement si
# usage tutoriel e-commerce evident (jamais atteint car deja audite).
ECOM_CONTEXT = re.compile(
    r"\b(produit|commande)s?\b\s+"
    r"(pour|dans le catalogue|ajout(?:e|er)?\s+au|"
    r"passer une|passer la|paiement|checkout|shopping|panier)",
    re.IGNORECASE,
)

# stability : chemins ignores.
SKIP_STABILITY_BASENAMES = {
    "README.md", "CHANGELOG.md", "LICENSE", "COMMUNAUTE.md",
    "DEPENDENCY_LEDGER.md", "POSTMORTEM_TEMPLATE.md", "NODE_VERSIONS.md",
    "AUDIT_FINAL_MyFunnyJS.md", "CORRECTIONS_APPLIQUEES.md",
    "HYPOTHESES_TEMPLATE.md", "HYPOTHESES_EXEMPLE.md",
    "HYPOTHESES_EXEMPLE_REPRO_DETERMINISTE.md",
    "CONSIGNE_HYPOTHESES_OBLIGATOIRE.md",
    "TDD_JOURNAL.md", "POSTMORTEM.md", "HYPOTHESES.md",
}
SKIP_STABILITY_PATTERNS = [
    re.compile(r"_recall_.*\.md$"),
    re.compile(r"_spaced_repetition\.md$"),
    re.compile(r"^ADR/"), re.compile(r"/ADR/"),
    re.compile(r"cahierdescharges\.md$"),
    re.compile(r"^verification_pack/"),
    re.compile(r"^assets/"),
    re.compile(r"^\.[^/]"),  # dotfiles at root
]
STAB_RE = re.compile(r"^stability:\s*(intemporel|stable|perissable)\s*$", re.M)

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

def is_lesson_file(rel):
    parts = rel.replace("\\", "/").split("/")
    base = parts[-1]
    if base in SKIP_STABILITY_BASENAMES: return False
    for p in SKIP_STABILITY_PATTERNS:
        if p.search(rel.replace("\\", "/")): return False
    # only files inside a numbered module folder are lessons
    if not parts[0][:2].isdigit(): return False
    return True

def lint():
    v = []
    md = sorted(glob.glob(os.path.join(ROOT, "**", "*.md"), recursive=True))
    for f in md:
        rel = os.path.relpath(f, ROOT).replace("\\", "/")
        content = open(f, encoding="utf-8").read()
        for ln, line in enumerate(content.splitlines(), 1):
            if EMOJI.search(line):
                v.append(f"{rel}:{ln} EMOJI interdit")
            if "\u2014" in line:  # em-dash
                v.append(f"{rel}:{ln} EM-DASH interdit (utilise ' - ' ou ' : ')")
            if FORBIDDEN_HARD.search(line):
                v.append(f"{rel}:{ln} MOT INTERDIT (login/panier)")
            if ECOM_CONTEXT.search(line):
                v.append(f"{rel}:{ln} CONTEXTE E-COMMERCE interdit (reformule)")
        if is_lesson_file(rel) and not STAB_RE.search(content):
            v.append(f"{rel} STABILITY MANQUANTE (attendu 'stability: intemporel|stable|perissable')")
    # grimoires
    for f in sorted(glob.glob(os.path.join(ROOT, "**", "*grimoire*.md"), recursive=True)):
        rel = os.path.relpath(f, ROOT).replace("\\", "/")
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
            if len(cs) < ncol: continue
            cell = cs[col].strip()
            if not cell: continue
            parts = [p for p in cell.split(" / ") if p.strip()]
            if len(parts) != 2:
                v.append(f"{rel}:{ln} ANALOGIES={len(parts)} (attendu 2 par ' / ') | {cell[:70]}")
    return v

if __name__ == "__main__":
    v = lint()
    for item in v:
        print("  [STYLE] " + item)
    if v:
        print(f"[FAIL] style_lint : {len(v)} violation(s).")
        sys.exit(1)
    print("[OK] style_lint : zero emoji, zero em-dash, analogies OK, stability OK, aucun mot interdit.")
