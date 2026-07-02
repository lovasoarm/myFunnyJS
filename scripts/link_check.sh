#!/usr/bin/env bash
# Verifie que tout lien Markdown local pointe vers un fichier existant.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
fail=0
while IFS= read -r file; do
  while IFS= read -r target; do
    [[ "$target" =~ ^https?:// ]] && continue
    [[ "$target" =~ ^mailto: ]] && continue
    [[ "$target" =~ ^# ]] && continue
    # ignorer les faux positifs (contenu inline sans slash ni extension fichier)
    if [[ "$target" != */* ]] && ! [[ "$target" =~ \.(md|sh|js|ts|svg|png|jpg|jpeg|txt|json|yml|yaml|css|html)$ ]]; then
      continue
    fi
    path="${target%%#*}"
    [ -z "$path" ] && continue
    dir="$(dirname "$file")"
    resolved="$dir/$path"
    if [ ! -e "$resolved" ]; then
      echo "BROKEN: $file -> $target"
      fail=1
    fi
  done < <(grep -oE '\]\(([^)]+)\)' "$file" | sed -E 's/^\]\(//; s/\)$//')
done < <(find . -name '*.md' -not -path './archive/*')
if [ "$fail" -ne 0 ]; then echo "link_check: KO"; exit 1; fi
echo "link_check: OK"
