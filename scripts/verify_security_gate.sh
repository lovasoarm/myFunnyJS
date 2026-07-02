#!/usr/bin/env bash
# verify_security_gate.sh : Partie I - chaque cahierdescharges d'un mini-projet contient une section Securite.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BAD=0
for cdc in "$ROOT"/30_mini_projects/*/cahierdescharges.md; do
  [ -f "$cdc" ] || continue
  if ! grep -qiE "^#+.*(securite|security)" "$cdc"; then
    echo "MANQUE section Securite : $cdc"
    BAD=$((BAD+1))
  fi
done
if [ "$BAD" -gt 0 ]; then
  echo "TOTAL: $BAD cahier(s) des charges sans gate securite."
  exit 1
fi
echo "OK : chaque mini-projet a une section Securite."
