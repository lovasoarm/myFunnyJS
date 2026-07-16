#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
fail=0
for d in "${ROOT}/30_mini_projects"/[0-9]*/; do
  if [ ! -f "${d}SECURITY.md" ]; then
    echo "FAIL $(basename "$d"): SECURITY.md manquant"; fail=1
  fi
done
[ "$fail" = 0 ] && echo "SECURITY_GATE OK" || exit 1
