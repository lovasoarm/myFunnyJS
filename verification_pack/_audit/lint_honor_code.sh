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

# Filet renforcé : en-dash / em-dash + tokens verrouillés anti-migration.
python3 - "$REPO" "$DIR/forbidden_transforms.txt" <<'PYEOF' || exit 1
import os, re, sys
root, forb = sys.argv[1], sys.argv[2]
fail = 0
dash_pat = re.compile('[\u2013\u2014]')
# Tokens verrouillés : listés dans forbidden_transforms.txt (un par ligne,
# lignes vides et # ignorées). Un token verrouillé NE DOIT PAS avoir été
# muté. On vérifie sa présence dans le repo (au moins une occurrence).
locked = []
if os.path.exists(forb):
    for l in open(forb, encoding='utf-8'):
        l = l.strip()
        if not l or l.startswith('#'): continue
        locked.append(l)
seen = {t: False for t in locked}
for r, _, fs in os.walk(root):
    if '/.git' in r or '/node_modules' in r: continue
    for f in fs:
        if not f.endswith('.md'): continue
        p = os.path.join(r, f)
        try: t = open(p, encoding='utf-8').read()
        except: continue
        if dash_pat.search(t):
            print(f'[HONOR CODE] em/en-dash: {p}')
            fail = 1
        for tok in locked:
            if tok in t: seen[tok] = True
for tok, ok in seen.items():
    if not ok:
        print(f'[HONOR CODE] token verrouillé absent (regression migration ?): {tok}')
        fail = 1
sys.exit(fail)
PYEOF

echo "[HONOR CODE] OK : zéro violation du code d'honneur."
