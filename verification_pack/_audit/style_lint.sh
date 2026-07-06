#!/usr/bin/env bash
# Wrapper CI du filet de style. Rejette emoji, em-dash et analogies != 2.
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
REPO="$DIR/../.."
python3 "$DIR/style_lint.py" "$REPO"
