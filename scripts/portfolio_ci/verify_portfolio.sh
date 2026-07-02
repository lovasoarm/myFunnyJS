#!/usr/bin/env bash
# verify_portfolio.sh — vérifie qu'un dépôt d'apprenant MyFunnyJS a les livrables
# clefs. Sortie : JSON avec le score et les items manquants.
#
# Usage : ./verify_portfolio.sh <chemin-dépôt> > score.json
# Code de sortie : 0 si score >= 80, 1 sinon.

set -u
ROOT="${1:-.}"
cd "$ROOT" || { echo "invalid path" >&2; exit 2; }

pass=0
total=0
missing=()

check() {
  total=$((total + 1))
  if eval "$2" >/dev/null 2>&1; then
    pass=$((pass + 1))
  else
    missing+=("$1")
  fi
}

# 1. Structure minimale
check "README.md racine"           "[ -f README.md ]"
check "DEPENDENCY_LEDGER.md"       "[ -f DEPENDENCY_LEDGER.md ]"
check "CHANGELOG.md"               "[ -f CHANGELOG.md ]"

# 2. ADR (au moins 3 mini-projets avec ADR)
adr_count=$(find . -type d -name 'ADR' 2>/dev/null | wc -l | tr -d ' ')
check "ADR dans 3+ projets (trouvés: $adr_count)"  "[ $adr_count -ge 3 ]"

# 3. POSTMORTEM (au moins 3)
pm_count=$(find . -type f -name 'POSTMORTEM*.md' 2>/dev/null | wc -l | tr -d ' ')
check "POSTMORTEM 3+ (trouvés: $pm_count)"          "[ $pm_count -ge 3 ]"

# 4. TDD_JOURNAL
tdd_count=$(find . -type f -name 'TDD_JOURNAL*.md' 2>/dev/null | wc -l | tr -d ' ')
check "TDD_JOURNAL présents (trouvés: $tdd_count)"  "[ $tdd_count -ge 5 ]"

# 5. Transferts cross-language (au moins 3 fichiers dans transferts/)
trans_count=$(find . -type d -name 'transferts' 2>/dev/null -exec find {} -type f -name '*.md' \; | wc -l | tr -d ' ')
check "Transferts cross-lang 3+"    "[ $trans_count -ge 3 ]"

# 6. LEAK_REPORT (Pierre de Mémoire prouvée)
leak_count=$(find . -type f -name 'LEAK_REPORT*.md' 2>/dev/null | wc -l | tr -d ' ')
check "LEAK_REPORT présent"         "[ $leak_count -ge 1 ]"

# 7. Verification pack utilisé (au moins 5 drills validés)
verify_count=$(find . -type f -name 'verify.sh' 2>/dev/null | wc -l | tr -d ' ')
check "Verify_pack utilisés 5+"     "[ $verify_count -ge 5 ]"

# 8. Distributed arena (mini-projet 16)
check "Mini-projet 16 fait"         "[ -f 30_mini_projects/16_distributed_arena/verify.js ] || [ -f 16_distributed_arena/verify.js ]"

# 9. Solo vs Copilot drill journal
drill_count=$(find . -type f -name 'DRILL*.md' -o -name 'solo_vs_copilot*.md' 2>/dev/null | wc -l | tr -d ' ')
check "Drills IA journalisés 2+"    "[ $drill_count -ge 2 ]"

# 10. Épreuve cross-language finale
check "Rapport cross-lang final"    "[ -f RAPPORT_FINAL.md ] || [ -f ADR-CROSS-LANG.md ]"

score=$((pass * 10))

# JSON output
{
  echo "{"
  echo "  \"score\": $score,"
  echo "  \"pass\": $pass,"
  echo "  \"total\": $total,"
  echo "  \"missing\": ["
  first=1
  for m in "${missing[@]}"; do
    if [ $first -eq 1 ]; then first=0; else echo ","; fi
    printf "    \"%s\"" "$m"
  done
  echo ""
  echo "  ],"
  echo "  \"badge\": \"$( [ $score -ge 80 ] && echo passing || echo failing )\""
  echo "}"
}

[ $score -ge 80 ]
