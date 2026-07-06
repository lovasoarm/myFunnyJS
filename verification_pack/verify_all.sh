#!/usr/bin/env bash
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"

# Gate node : bloque avant tout si Node < 20 (message pedagogique).
if ! bash "$DIR/_lib/node_gate.sh"; then
  echo "[STOP] Corrige ta version de Node avant de relancer verify_all.sh."
  exit 2
fi

fail=0
pass=0
for v in "$DIR"/*/verify.sh; do
  if bash "$v"; then
    pass=$((pass+1))
  else
    fail=$((fail+1))
  fi
done

# Filet de style (emoji / em-dash / analogies / mots interdits / stability).
if ! python3 "$DIR/_audit/style_lint.py" "$DIR/.." ; then
  fail=$((fail+1))
fi
echo ""
echo "=================================================="
echo "  Resume : $pass module(s) OK, $fail module(s) KO"
echo "=================================================="
if [ "$fail" -gt 0 ]; then
  echo "[FAIL] Le filet deterministe a detecte $fail regression(s)."
  exit 1
fi
echo "[OK] Tous les modules ont passe le filet deterministe."
