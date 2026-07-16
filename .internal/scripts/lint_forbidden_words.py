#!/usr/bin/env python3
"""Lint mots interdits (charte B) : login, panier, commande, utilisateur, produit, paiement."""
import re, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
FORBIDDEN = ["login", "panier", "commande", "utilisateur", "produit", "paiement"]
EXEMPT_NAMES = {"POSTMORTEM.md", "TDD_JOURNAL.md", "CHANGELOG.md", "CHANGELOG_v14.md"}
# Scope initial : 21_api_craft (extensible ensuite module par module).
SCOPE = ["21_api_craft"]

CODE_BLOCK = re.compile(r"```.*?```", re.S)
fail = 0
for scope in SCOPE:
    for f in (ROOT / scope).rglob("*.md"):
        if any(p.startswith(".") for p in f.relative_to(ROOT).parts): continue
        if f.name in EXEMPT_NAMES: continue
        text = f.read_text(errors="ignore")
        text_no_code = CODE_BLOCK.sub("", text)
        for word in FORBIDDEN:
            for m in re.finditer(rf"\b{word}\b", text_no_code, re.I):
                line = text_no_code[:m.start()].count("\n") + 1
                print(f"FAIL {f.relative_to(ROOT)}:{line}: mot interdit '{word}'")
                fail += 1
sys.exit(1 if fail else 0)

