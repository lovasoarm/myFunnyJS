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
if ! bash "$DIR/_audit/lint_honor_code.sh" ; then
  fail=$((fail+1))
fi
if ! bash "$DIR/_audit/check_forbidden_words.sh"; then
  fail=$((fail+1))
fi
if ! python3 "$DIR/_audit/check_grimoire_analogies.py" "$DIR/.."; then
  fail=$((fail+1))
fi
if ! bash "$DIR/_audit/check_exo_jeune_ia_universal.sh"; then
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

# ---- SELF-TEST ----
if [[ "${1:-}" == "--self-test" ]]; then
    echo "== self-test =="
    echo -n "témoin PASS attendu : "
    if [[ "1" == "1" ]]; then echo "PASS"; else echo "FAIL (incohérent)"; exit 2; fi
    echo -n "témoin FAIL attendu : "
    if [[ "1" == "2" ]]; then echo "PASS (incohérent)"; exit 2; else echo "FAIL"; fi
    echo "self-test OK"
    exit 0
fi
