#!/usr/bin/env bash
# security_check.sh : [2.9] gate sécurité pour les mini-projets
# Usage: bash security_check.sh <chemin_vers_ton_projet>
# Vérifie que les exigences OWASP contextuelles du cahier des charges sont traitées.
set -e

# --- [3.12] Vérification version Node (>=20) ---
NODE_MAJOR="$(node -p "process.versions.node.split(\".\")[0]" 2>/dev/null || echo 0)"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node >= 20 requis (détecté: $(node -v 2>/dev/null || echo absent))."
  exit 1
fi
# --- fin check version ---

PROJ="${1:-.}"
PASS=0; FAIL=0

check() { # msg  condition(0=ok)
  if [ "$2" -eq 0 ]; then echo "OK   $1"; PASS=$((PASS+1)); else echo "FAIL $1"; FAIL=$((FAIL+1)); fi
}

# 1. Le projet doit documenter sa sécurité
[ -f "$PROJ/SECURITY.md" ]; check "SECURITY.md présent (menace + contre-mesure + test documentés)" $?

# 2. Anti-injection : aucune concaténation SQL avec des variables d'entrée
if grep -rInE "query\(.*(\+|\\\$\{).*(req\.|input|param)" "$PROJ/src" 2>/dev/null | grep -q .; then
  INJ=1; else INJ=0; fi
check "Aucune concaténation SQL suspecte dans src/ (requêtes paramétrées attendues)" $INJ

# 3. Anti-secret : aucun secret en dur évident
if grep -rInE "(password|secret|api[_-]?key|token)\s*[:=]\s*[\"'][A-Za-z0-9]{8,}" "$PROJ/src" 2>/dev/null | grep -qvi "process.env"; then
  SEC=1; else SEC=0; fi
check "Aucun secret en dur dans src/ (utilise process.env)" $SEC

echo "---"
echo "SÉCURITÉ : PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
