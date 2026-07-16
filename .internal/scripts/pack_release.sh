#!/usr/bin/env bash
set -euo pipefail

# Hooks de lint (chantiers correctifs v14)
if [ -x .internal/scripts/lint_adr.py ]; then python3 .internal/scripts/lint_adr.py || { echo "PACK FAIL: lint_adr"; exit 1; }; fi
if [ -x .internal/scripts/lint_grimoire.py ]; then python3 .internal/scripts/lint_grimoire.py || { echo "PACK FAIL: lint_grimoire"; exit 1; }; fi
if [ -x .internal/scripts/lint_universes.sh ]; then bash .internal/scripts/lint_universes.sh || { echo "PACK FAIL: lint_universes"; exit 1; }; fi
if [ -x .internal/scripts/lint_forbidden_words.py ]; then python3 .internal/scripts/lint_forbidden_words.py || { echo "PACK FAIL: lint_forbidden_words"; exit 1; }; fi
if [ -x .internal/scripts/lint_stability.py ]; then python3 .internal/scripts/lint_stability.py || echo "WARN: lint_stability non bloquant"; fi


# Hooks de lint (chantiers correctifs v14)
if [ -x .internal/scripts/lint_adr.py ]; then python3 .internal/scripts/lint_adr.py || { echo "PACK FAIL: lint_adr"; exit 1; }; fi
if [ -x .internal/scripts/lint_grimoire.py ]; then python3 .internal/scripts/lint_grimoire.py || { echo "PACK FAIL: lint_grimoire"; exit 1; }; fi
if [ -x .internal/scripts/lint_universes.sh ]; then bash .internal/scripts/lint_universes.sh || { echo "PACK FAIL: lint_universes"; exit 1; }; fi
if [ -x .internal/scripts/lint_forbidden_words.py ]; then python3 .internal/scripts/lint_forbidden_words.py || { echo "PACK FAIL: lint_forbidden_words"; exit 1; }; fi
if [ -x .internal/scripts/lint_stability.py ]; then python3 .internal/scripts/lint_stability.py || echo "WARN: lint_stability non bloquant"; fi


# Hooks de lint (chantiers correctifs v14)
if [ -x .internal/scripts/lint_adr.py ]; then python3 .internal/scripts/lint_adr.py || { echo "PACK FAIL: lint_adr"; exit 1; }; fi
if [ -x .internal/scripts/lint_grimoire.py ]; then python3 .internal/scripts/lint_grimoire.py || { echo "PACK FAIL: lint_grimoire"; exit 1; }; fi
if [ -x .internal/scripts/lint_universes.sh ]; then bash .internal/scripts/lint_universes.sh || { echo "PACK FAIL: lint_universes"; exit 1; }; fi
if [ -x .internal/scripts/lint_forbidden_words.py ]; then python3 .internal/scripts/lint_forbidden_words.py || { echo "PACK FAIL: lint_forbidden_words"; exit 1; }; fi
if [ -x .internal/scripts/lint_stability.py ]; then python3 .internal/scripts/lint_stability.py || echo "WARN: lint_stability non bloquant"; fi

VERSION="${1:-v12}"
OUT_DIR="${OUT_DIR:-dist}"
NAME="myFunnyJS_corrected_${VERSION}"
STAGE="$(mktemp -d)"
TARGET="${STAGE}/${NAME}"
mkdir -p "${OUT_DIR}" "${TARGET}"

# tar-based copy avec exclusions strictes
tar -cf - \
  --exclude='./.git' --exclude='./.audit' \
  --exclude='./../.tools/verification_pack/_audit' \
  --exclude='./node_modules' \
  --exclude='./dist' \
  --exclude='./tmp' \
  --exclude='./backup' \
  --exclude='*.log' \
  . | tar -xf - -C "${TARGET}"

if [ -d "${TARGET}/../.tools/verification_pack/_audit" ]; then
  echo "PACK FAIL : verification_pack/_audit present" >&2; exit 1
fi
(cd "${STAGE}" && zip -qr "${NAME}.zip" "${NAME}")
mv "${STAGE}/${NAME}.zip" "${OUT_DIR}/${NAME}.zip"
rm -rf "${STAGE}"
echo "OK : ${OUT_DIR}/${NAME}.zip"
