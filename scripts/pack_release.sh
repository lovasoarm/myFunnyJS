#!/usr/bin/env bash
set -euo pipefail
VERSION="${1:-v12}"
OUT_DIR="${OUT_DIR:-dist}"
NAME="myFunnyJS_corrected_${VERSION}"
STAGE="$(mktemp -d)"
TARGET="${STAGE}/${NAME}"
mkdir -p "${OUT_DIR}" "${TARGET}"

# tar-based copy avec exclusions strictes
tar -cf - \
  --exclude='./.*' \
  --exclude='./verification_pack/_audit' \
  --exclude='./node_modules' \
  --exclude='./dist' \
  --exclude='./tmp' \
  --exclude='./backup' \
  --exclude='*.log' \
  . | tar -xf - -C "${TARGET}"

LEAKS="$(find "${TARGET}" -maxdepth 2 -name '.*' -type d 2>/dev/null || true)"
if [ -n "${LEAKS}" ]; then
  echo "PACK FAIL : dossiers caches presents apres filtrage :" >&2
  echo "${LEAKS}" >&2; exit 1
fi
if [ -d "${TARGET}/verification_pack/_audit" ]; then
  echo "PACK FAIL : verification_pack/_audit present" >&2; exit 1
fi
(cd "${STAGE}" && zip -qr "${NAME}.zip" "${NAME}")
mv "${STAGE}/${NAME}.zip" "${OUT_DIR}/${NAME}.zip"
rm -rf "${STAGE}"
echo "OK : ${OUT_DIR}/${NAME}.zip"
