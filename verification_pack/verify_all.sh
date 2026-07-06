#!/usr/bin/env bash
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
fail=0
pass=0
for v in "$DIR"/*/verify.sh; do
  if bash "$v"; then
    pass=$((pass+1))
  else
    fail=$((fail+1))
  fi
done

# Filet de style (emoji / em-dash / analogies)
if ! python3 "$DIR/_audit/style_lint.py" "$DIR/.." ; then
  fail=$((fail+1))
fi
echo ""
echo "=================================================="
echo "  Résumé : $pass module(s) OK, $fail module(s) KO"
echo "=================================================="
if [ "$fail" -gt 0 ]; then
  echo "[FAIL] Le filet déterministe a détecté $fail régression(s)."
  exit 1
fi
echo "[OK] Tous les modules ont passé le filet déterministe."
