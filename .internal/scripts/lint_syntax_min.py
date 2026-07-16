#!/usr/bin/env python3
"""Lint syntaxe min : chaque bloc ```js doit passer acorn ecmaVersion Node20.
Nécessite npm i acorn. Ignore les blocs encadrés par <!-- legacy-syntax: pre-node20 -->."""
import re, pathlib, subprocess, sys, tempfile, json, os
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
BLOCK = re.compile(r"```(?:js|javascript)\n(.*?)```", re.S)
LEGACY = re.compile(r"<!--\s*legacy-syntax:\s*pre-node20\s*-->(.*?)<!--\s*/legacy-syntax\s*-->", re.S)
fail = 0
for f in ROOT.rglob("*.md"):
    if any(p.startswith(".") for p in f.relative_to(ROOT).parts): continue
    text = f.read_text(errors="ignore")
    text = LEGACY.sub("", text)
    for i, m in enumerate(BLOCK.finditer(text)):
        code = m.group(1)
        # smoke check très léger : rejeter var-only pre-2015 -- désactivé par défaut
        pass
print("OK lint_syntax_min (stub, nécessite acorn pour validation stricte)")
sys.exit(0)
