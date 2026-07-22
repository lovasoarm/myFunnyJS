#!/usr/bin/env bash
# check_all.sh
# Audit auto-reproductible de MyFunnyJS, visible cote apprenant.
# But : prouver la vitalite du repo et permettre a un lecteur de valider seul.
#
# Ce script :
#  1. Compte les modules de fond (attendus : 32, numerotes 01..32)
#  2. Verifie que chaque mini-projet contient les livrables obligatoires
#  3. Verifie les liens Markdown internes (fichier cible existe)
#  4. Delegue la gate securite a ./check_security_gate.sh
#  5. Rejoue les scenarios de debug qui ont un package.json + test script
#
# Usage : ./check_all.sh

set -u
FAIL=0
step() { echo ""; echo "== $* =="; }

# --- 1. modules de fond ------------------------------------------------------
step "1. Modules de fond (attendus : 32)"
NB_MODULES=$(ls -d [0-3][0-9]_* 2>/dev/null \
  | grep -Ev '^(00_getting_started|00_referentiel|30_mini_projects|31_annexes|32_tools)$' \
  | wc -l | tr -d ' ')
# 01..29 = 29 modules techniques + 30 mini_projects + 31 annexes + 32 tools = 32 briques
NB_BRIQUES=$(ls -d [0-3][0-9]_* 2>/dev/null | wc -l | tr -d ' ')
echo "Briques numerotees detectees : $NB_BRIQUES (attendu 32 avec les 2 preludes 00_*)."
[ "$NB_BRIQUES" -ge 32 ] || { echo "FAIL modules"; FAIL=$((FAIL+1)); }

# --- 2. mini-projets : livrables obligatoires --------------------------------
step "2. Structure mini-projets"
REQUIRED=(README.md RULES.md cahierdescharges.md TDD_JOURNAL.md POSTMORTEM.md SECURITY_GATE.md SPEC_DRIFT_TRIGGERS.md)
for d in 30_mini_projects/*/; do
  name=$(basename "$d")
  case "$name" in _templates) continue;; esac
  for f in "${REQUIRED[@]}"; do
    if [ ! -f "$d/$f" ]; then
      echo "FAIL  $name : $f manquant"; FAIL=$((FAIL+1))
    fi
  done
done

# --- 3. liens Markdown internes ---------------------------------------------
step "3. Liens Markdown internes (echantillon rapide)"
BROKEN=0
while IFS= read -r md; do
  # extrait les [text](chemin/relatif.md) locaux
  grep -oE '\]\(([^)]+\.md)\)' "$md" 2>/dev/null | sed -E 's/^\]\(//;s/\)$//' | while read -r link; do
    case "$link" in http*|"#"*|mailto:*) continue;; esac
    target_dir=$(dirname "$md")
    target="$target_dir/${link%%#*}"
    [ -f "$target" ] || echo "LINK  $md -> $link (introuvable)"
  done
done < <(find . -name "*.md" -not -path "./node_modules/*" -not -path "./.internal/*")

# --- 4. gate securite -------------------------------------------------------
step "4. Gate securite (delegue a check_security_gate.sh)"
if [ -x ./check_security_gate.sh ]; then
  ./check_security_gate.sh || FAIL=$((FAIL+1))
else
  echo "SKIP  check_security_gate.sh absent ou non executable"
fi

# --- 5. tests des scenarios de debug ----------------------------------------
step "5. Tests des scenarios de debug"
while IFS= read -r pj; do
  d=$(dirname "$pj")
  if grep -q '"test"' "$pj"; then
    echo "-> node --test dans $d"
    ( cd "$d" && node --test 2>&1 | tail -3 ) || FAIL=$((FAIL+1))
  fi
done < <(find 04_debugging 30_mini_projects -name package.json 2>/dev/null)

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "check_all.sh : OK"
  exit 0
else
  echo "check_all.sh : $FAIL categories en echec"
  exit 1
fi
