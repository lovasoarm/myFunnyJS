#!/usr/bin/env bash
# Gate : bloque si Node < 20
if ! command -v node >/dev/null; then
  echo "[FAIL] node introuvable. Installe Node >= 20." >&2
  exit 2
fi
MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$MAJOR" -lt 20 ]; then
  echo "[FAIL] Node $MAJOR détecté. Requis: Node >= 20." >&2
  exit 2
fi
