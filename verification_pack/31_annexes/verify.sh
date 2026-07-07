#!/usr/bin/env bash
# Drills déterministes pour 31_annexes. Chaque drill compare une sortie
# réelle produite par Node à une sortie attendue exacte (byte-for-byte).
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$DIR/.."
source "$ROOT/_lib/node_gate.sh"
source "$ROOT/_lib/assert.sh"

echo "== [31_annexes] =="

fail=0
for script in "$DIR/scripts"/*.js; do
  name=$(basename "$script" .js)
  input="$DIR/inputs/${name}.txt"
  expected_file="$DIR/expected/${name}.txt"
  if [ ! -f "$expected_file" ]; then
    echo "  [SKIP] $name (pas d'attendu)"
    continue
  fi
  if [ -f "$input" ] && [ -s "$input" ]; then
    actual=$(node "$script" < "$input" 2>/dev/null || true)
  else
    actual=$(node "$script" 2>/dev/null || true)
  fi
  expected=$(cat "$expected_file")
  if [ "$expected" = "$actual" ]; then
    echo "  [OK]   $name"
  else
    echo "  [FAIL] $name"
    echo "         attendu : $expected" >&2
    echo "         obtenu  : $actual" >&2
    fail=$((fail+1))
  fi
done

if [ "$fail" -gt 0 ]; then
  echo "== [31_annexes] KO ($fail échec(s)) =="
  exit 1
fi
echo "== [31_annexes] OK =="
