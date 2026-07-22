#!/usr/bin/env bash
# 32_tools/audit_security_gate.sh
# Verifie que chaque mini-projet sous 30_mini_projects/<NN>_*/
# possede un SECURITY_GATE.md (le template 19_templates/ est exclu).
# Spec : .internal/README.md, section "Regle SECURITY_GATE".
set -euo pipefail

ROOT="${1:-.}"
fail=0

echo "# Rapport audit SECURITY_GATE"
echo

for d in "$ROOT"/30_mini_projects/*/; do
  name=$(basename "$d")
  # ignorer le dossier de templates
  case "$name" in
    19_templates) continue ;;
  esac
  # ne prendre que les dossiers de mini-projets (commencent par un chiffre)
  case "$name" in
    [0-9]*)
      if [ -f "$d/SECURITY_GATE.md" ]; then
        echo "- [OK]   $name"
      else
        echo "- [FAIL] $name : SECURITY_GATE.md manquant"
        fail=$((fail+1))
      fi
      ;;
  esac
done

echo
if [ "$fail" -gt 0 ]; then
  echo "Total en derive : $fail mini-projet(s)."
  exit 1
fi
echo "Tous les mini-projets ont un SECURITY_GATE.md."
