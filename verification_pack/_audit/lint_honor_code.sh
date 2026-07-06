#!/usr/bin/env bash
# lint_honor_code.sh
# Wrapper explicite du code d'honneur MyFunnyJS.
# Rejette : emoji, em-dash, en-dash, mots interdits (login, panier, commande,
# produit, utilisateur), analogies != 2 dans les grimoires, absence de tag
# `stability:` dans une leçon numérotée.

set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
REPO="$DIR/../.."

echo "[HONOR CODE] Vérification du code d'honneur MyFunnyJS..."

# Filet principal (emoji, em-dash, analogies, stability, login/panier).
python3 "$DIR/style_lint.py" "$REPO" || exit 1

# Filet renforcé : mots interdits élargis + en-dash / em-dash (Unicode fiable).
python3 - "$REPO" <<'PYEOF' || exit 1
import os, re, sys
root = sys.argv[1]
fail = 0
dash_pat = re.compile('[\u2013\u2014]')
fw_pat = re.compile(r'\b(utilisateur|commande|produit)s?\b', re.I)
for r, _, fs in os.walk(root):
    if '/.git' in r or '/node_modules' in r or '/.audit' in r: continue
    for f in fs:
        if not f.endswith('.md'): continue
        p = os.path.join(r, f)
        try: t = open(p, encoding='utf-8').read()
        except: continue
        if dash_pat.search(t):
            print(f'[HONOR CODE] em/en-dash: {p}')
            fail = 1
        m = fw_pat.search(t)
        if m:
            print(f'[HONOR CODE] mot interdit "{m.group(0)}": {p}')
            fail = 1
sys.exit(fail)
PYEOF

echo "[HONOR CODE] OK : zéro violation du code d'honneur."
