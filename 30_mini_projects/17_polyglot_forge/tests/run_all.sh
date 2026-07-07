#!/usr/bin/env bash
# tests/run_all.sh
# Compare les traces JS et Python (ou Rust) sur le meme scenario.
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
SCEN="$DIR/scenario.json"
EXP="$DIR/expected.txt"

OUT_JS="$DIR/output_js.txt"
OUT_ALT="$DIR/output_alt.txt"

if ! command -v node >/dev/null 2>&1; then
  echo "[FAIL] node introuvable"; exit 1
fi
node "$ROOT/src/loop.js" "$SCEN" > "$OUT_JS"

if command -v python3 >/dev/null 2>&1 && [ -f "$ROOT/src/loop.py" ]; then
  python3 "$ROOT/src/loop.py" "$SCEN" > "$OUT_ALT"
elif command -v cargo >/dev/null 2>&1 && [ -f "$ROOT/src/loop.rs" ]; then
  ( cd "$ROOT" && rustc src/loop.rs -O -o /tmp/loop_rs >/dev/null 2>&1 )
  /tmp/loop_rs "$SCEN" > "$OUT_ALT"
else
  echo "[FAIL] ni python3 ni cargo dispo pour le langage secondaire"; exit 1
fi

if diff -u "$EXP" "$OUT_JS" >/dev/null && diff -u "$EXP" "$OUT_ALT" >/dev/null; then
  echo "POLYGLOT PARITY OK"
  exit 0
fi
echo "[FAIL] divergence detectee"
echo "--- expected vs js ---"; diff -u "$EXP" "$OUT_JS" || true
echo "--- expected vs alt ---"; diff -u "$EXP" "$OUT_ALT" || true
exit 1
