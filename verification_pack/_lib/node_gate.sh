#!/usr/bin/env bash
# Bloque tout module si Node < 20. Message pedagogique.
set -e
if ! command -v node >/dev/null 2>&1; then
  echo "[NODE_GATE] Node.js absent."
  echo "  Installe la LTS (>= 20) : https://nodejs.org"
  exit 1
fi
V=$(node -v | sed 's/^v//' | cut -d. -f1)
if [ "${V:-0}" -lt 20 ]; then
  echo "[NODE_GATE] Node $(node -v) detecte, MyFunnyJS exige >= 20."
  echo "  Voir 31_annexes/toolchain/NODE_VERSIONS.md + .nvmrc."
  echo "  Fix rapide (nvm) : nvm install 20 && nvm use 20"
  exit 1
fi
