#!/usr/bin/env bash
# Fail si un fichier de contenu (hors nav autorisé) contient un emoji pictographique.
set -e
ALLOWED_REGEX='(README\.md|01_START_HERE\.md|03_WHERE_YOU_STAND\.md|02_DAY_ONE_.*\.md|CHANGELOG.*\.md)$'
fail=0
while IFS= read -r f; do
  [[ "$f" =~ $ALLOWED_REGEX ]] && continue
  [[ "$f" == */archive/* ]] && continue
  if LC_ALL=C grep -P "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" "$f" >/dev/null 2>&1; then
    echo "EMOJI FOUND: $f"; fail=1
  fi
done < <(find . -type f -name "*.md")
[ $fail -eq 1 ] && { echo "verify_no_emojis: FAILED"; exit 1; }
echo "verify_no_emojis: OK"
