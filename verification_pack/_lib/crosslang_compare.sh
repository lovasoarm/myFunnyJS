#!/usr/bin/env bash
# crosslang_compare.sh : compare la sortie d'une implémentation cross-language à sa référence JS.
#
# Usage :
#   crosslang_compare.sh <js_ref_cmd> <alt_lang_cmd> <cases_dir>
#
# - <js_ref_cmd>    : commande shell qui lit stdin et écrit la sortie de référence (JS) sur stdout.
#                     Exemple : "node algo_sort/js/src/index.js"
# - <alt_lang_cmd>  : commande shell qui fait la même chose dans le langage alternatif.
#                     Exemple : "python3 algo_sort/python/src/main.py"
# - <cases_dir>     : dossier contenant des paires <name>.in et <name>.out (optionnel).
#                     Chaque .in est envoyé sur stdin des deux commandes.
#
# Contrat : renvoie 0 si TOUTES les sorties correspondent exactement (diff strict).
#           Sinon renvoie 1 et affiche les diffs.
#
# Ce script est un filet de securite. Il ne remplace pas les tests unitaires
# de chaque langage ; il verifie l'equivalence observable "boite noire".

set -u

if [ $# -lt 3 ]; then
  cat <<'USAGE'
Usage: crosslang_compare.sh "<js_ref_cmd>" "<alt_lang_cmd>" <cases_dir>

Exemple :
  ./crosslang_compare.sh \
    "node algo_bfs/js/src/index.js" \
    "python3 algo_bfs/python/src/main.py" \
    algo_bfs/cases
USAGE
  exit 2
fi

JS_CMD="$1"
ALT_CMD="$2"
CASES_DIR="$3"

if [ ! -d "$CASES_DIR" ]; then
  echo "[FAIL] cases dir introuvable : $CASES_DIR"
  exit 2
fi

shopt -s nullglob 2>/dev/null || true

fail=0
pass=0
for infile in "$CASES_DIR"/*.in; do
  name="$(basename "$infile" .in)"
  js_out="$(bash -c "$JS_CMD" < "$infile")"
  alt_out="$(bash -c "$ALT_CMD" < "$infile")"
  if [ "$js_out" = "$alt_out" ]; then
    pass=$((pass + 1))
    echo "[OK]   $name"
  else
    fail=$((fail + 1))
    echo "[FAIL] $name"
    diff <(echo "$js_out") <(echo "$alt_out") | sed 's/^/    /'
  fi
done

total=$((pass + fail))
echo "----"
echo "Resultat : $pass/$total passes."
if [ "$fail" -gt 0 ]; then
  exit 1
fi
exit 0
