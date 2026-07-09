#!/usr/bin/env bash
set -uo pipefail
if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:4318/v1/traces      -X POST -H "content-type: application/json" -d "{}" | grep -qE "^(200|202|400)$"; then
  echo "OTEL_RUNNING FAIL : endpoint OTLP inaccessible sur :4318"; exit 1
fi
echo "OTEL_RUNNING OK"
