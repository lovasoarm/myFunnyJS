#!/usr/bin/env bash
# verify.sh - filet deterministe (23bis)
set -e
# --- [3.12] Verification version Node (>=20) ---
NODE_MAJOR="$(node -p "process.versions.node.split(\".\")[0]" 2>/dev/null || echo 0)"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node >= 20 requis (detecte: $(node -v 2>/dev/null || echo absent)). Installe Node 20+ avant les drills."
  exit 1
fi
# --- fin check version ---
HERE="$(cd "$(dirname "$0")" && pwd)"
pass=0; fail=0
for in_file in "$HERE"/inputs/*.txt; do
  name=$(basename "$in_file" .txt)
  exp="$HERE/expected/$name.txt"
  [ -f "$exp" ] || { echo "missing expected for $name"; fail=$((fail+1)); continue; }
  got=$(sed -E 's/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9:.Z]+//g; s/id=[a-f0-9-]+/id=<ID>/g' "$in_file")
  want=$(cat "$exp")
  if [ "$got" = "$want" ]; then pass=$((pass+1)); else echo "DIFF: $name"; fail=$((fail+1)); fi
done
echo "PASS=$pass FAIL=$fail"
[ $fail -eq 0 ]
