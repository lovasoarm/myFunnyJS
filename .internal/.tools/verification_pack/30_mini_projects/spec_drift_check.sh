#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
count=$(find "${ROOT}/30_mini_projects" -maxdepth 2 -name SPEC_DRIFT_TRIGGERS.md | wc -l | tr -d ' ')
if [ "$count" -ne 17 ]; then
  echo "SPEC_DRIFT_CHECK FAIL : $count / 17 SPEC_DRIFT_TRIGGERS.md"; exit 1
fi
echo "SPEC_DRIFT_CHECK OK : 17 / 17"
