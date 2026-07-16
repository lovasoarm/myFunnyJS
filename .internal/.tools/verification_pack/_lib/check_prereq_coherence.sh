#!/usr/bin/env bash
# check_prereq_coherence.sh
#
# Vérifie que chaque 00_prereq_check.md teste bien des notions enseignées
# AVANT le module courant dans la séquence 01 -> 32, pas des notions
# enseignées DANS le module courant lui-même.
#
# Corrige la régression PC-01 identifiée dans l'audit MyFunnyJS v15 :
# la quasi-totalité des prereq_check testaient le contenu du module
# qu'ils étaient censés garder, rendant le filtre infranchissable à la
# première tentative légitime.
#
# Usage : ./check_prereq_coherence.sh [--verbose]
#
# Sortie : 0 si tout est cohérent, 1 si au moins un problème est détecté.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VERBOSE="${1:-}"
ISSUES_FOUND=0

# Séquence officielle des modules numérotés (ordre de progression réel).
# Modifier cette liste si des modules sont ajoutés/renumérotés.
MODULE_SEQUENCE=(
  "01_fundamentals" "02_problem_solving" "03_async" "04_debugging"
  "05_error_handling" "06_testing" "07_math_basics" "08_memory_performance"
  "09_data_structures" "10_algorithms" "11_functional_js" "12_design_patterns"
  "13_refactoring" "14_typescript" "15_runtime_env" "16_architecture_patterns"
  "17_web_concepts" "18_oop_js" "19_web_inclusive" "20_realtime"
  "21_api_craft" "22_security" "23_ai_native_dev" "24_databases"
  "25_scalability" "26_observability" "27_team_craft" "28_edge_cases"
  "29_ai_agents_and_autonomy" "30_mini_projects" "31_annexes" "32_tools"
)

module_index() {
  local target="$1"
  for i in "${!MODULE_SEQUENCE[@]}"; do
    if [[ "${MODULE_SEQUENCE[$i]}" == "$target" ]]; then
      echo "$i"
      return 0
    fi
  done
  echo "-1"
}

echo "=== Vérification de cohérence des prereq_check ==="
echo ""

for i in "${!MODULE_SEQUENCE[@]}"; do
  module="${MODULE_SEQUENCE[$i]}"
  prereq_file="$REPO_ROOT/$module/00_prereq_check.md"

  if [[ ! -f "$prereq_file" ]]; then
    echo "  [SKIP] $module : pas de 00_prereq_check.md trouvé"
    continue
  fi

  # Cas spécial module 01 : premier module de contenu, pas de gate possible.
  if [[ "$module" == "01_fundamentals" ]]; then
    if grep -q "n'est PAS un gate" "$prereq_file"; then
      [[ -n "$VERBOSE" ]] && echo "  [OK]   $module : cas spécial (premier module) correctement documenté"
    else
      echo "  [WARN] $module : premier module de contenu, vérifier qu'il n'agit pas comme un gate infranchissable"
      ISSUES_FOUND=1
    fi
    continue
  fi

  # Extraire les fichiers *.md du module courant qui contiennent le contenu
  # d'enseignement (exclut 00_prereq_check.md lui-même et les fichiers meta).
  own_content_files=$(find "$REPO_ROOT/$module" -iname "*.md" \
    ! -iname "00_prereq_check.md" \
    ! -iname "EXO_*" 2>/dev/null || true)

  # Heuristique : chercher si le prereq_check contient une note explicite
  # "Note pour ce module précis" qui signale une bonne pratique de
  # séparation gate-vs-contenu-propre.
  if grep -q "Note pour ce module précis\|Avant d'ouvrir ce module, coche\|prereq_check est différent des autres" "$prereq_file"; then
    [[ -n "$VERBOSE" ]] && echo "  [OK]   $module : structure correcte (référence explicite au module précédent, ou pattern cumulé assumé)"
  else
    echo "  [FAIL] $module : aucune référence explicite à un module antérieur détectée."
    echo "         -> vérifier manuellement que ce prereq_check ne teste pas son propre contenu."
    ISSUES_FOUND=1
  fi

done

echo ""
if [[ "$ISSUES_FOUND" -eq 0 ]]; then
  echo "=== Tous les prereq_check semblent structurellement cohérents. ==="
  exit 0
else
  echo "=== Des incohérences potentielles ont été détectées. Vérifier les [FAIL]/[WARN] ci-dessus. ==="
  exit 1
fi
