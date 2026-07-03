#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
fail=0
for v in "$DIR"/*/verify.sh; do
  bash "$v" || fail=$((fail+1))
done
if [ "$fail" -gt 0 ]; then
  echo ""
  echo "[FAIL] $fail module(s) ont échoué."
  exit 1
fi
echo ""
echo "[OK] Tous les modules ont passé le filet déterministe."
