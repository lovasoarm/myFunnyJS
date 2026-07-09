#!/usr/bin/env bash
# verify.sh : sanity check environnement pour 00_getting_started/
# Vérifie ce qui est nécessaire pour commencer le curriculum.
set -u

pass=0
fail=0

check() {
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then
    printf "  [OK]   %s\n" "$label"
    pass=$((pass + 1))
  else
    printf "  [FAIL] %s\n" "$label"
    fail=$((fail + 1))
  fi
}

echo "== 00_getting_started : sanity checks =="

# Node >= 20
check "node installé" command -v node
if command -v node >/dev/null 2>&1; then
  node_major=$(node -p 'process.versions.node.split(".")[0]')
  if [ "$node_major" -ge 20 ]; then
    printf "  [OK]   Node version %s (>= 20)\n" "$(node -v)"
    pass=$((pass + 1))
  else
    printf "  [FAIL] Node %s < 20 requis (voir .nvmrc)\n" "$(node -v)"
    fail=$((fail + 1))
  fi
fi

# git
check "git installé" command -v git

# npm
check "npm installé" command -v npm

# shell POSIX de base
check "bash présent" command -v bash

# curl (utile pour plusieurs modules réseau)
check "curl présent" command -v curl

echo
echo "== Résultat : ${pass} OK, ${fail} FAIL =="
[ "$fail" -eq 0 ]
