#!/usr/bin/env bash
set -euo pipefail
FILE="${1:-REPONSES.md}"
if [ ! -f "$FILE" ]; then echo "FAIL: $FILE introuvable"; exit 1; fi
python3 - "$FILE" <<'PY'
import re, sys
from datetime import datetime
p = sys.argv[1]
txt = open(p).read()
blocks = re.split(r"\n## Salve", txt)[1:]
if len(blocks) < 25:
    print(f"FAIL: {len(blocks)}/25 réponses"); sys.exit(1)
timestamps, valid = [], 0
for i, b in enumerate(blocks[:25]):
    m = re.search(r"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)", b)
    if not m:
        print(f"FAIL bloc {i+1}: timestamp ISO8601 absent"); continue
    ts = datetime.strptime(m.group(1), "%Y-%m-%dT%H:%M:%SZ")
    timestamps.append(ts)
    body = b[m.end():]
    words = len(re.findall(r"\S+", body))
    if words >= 40: valid += 1
for a, b in zip(timestamps, timestamps[1:]):
    if (b - a).total_seconds() > 90:
        print(f"FAIL: écart > 90s ({a} -> {b})"); sys.exit(1)
print(f"SCORE: {valid}/25")
sys.exit(0 if valid >= 20 else 1)
PY
