#!/usr/bin/env bash
# check_forbidden_words.sh
# Fail-fast sur `login|panier` (jamais autorises) et sur `commande` UNIQUEMENT
# quand le contexte est manifestement e-commerce / tuto 2018 (commande de
# livraison, commande client, bon de commande, panier commande, etc.).
# Autorise implicitement : CLI shell/npm/git, verbe "commander", "ligne de
# commande", "12 commandes git", et toute analogie generique (restaurant qui
# prepare une requete, dispatcher, radio, etc.).

set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
REPO="$DIR/../.."

python3 - "$REPO" <<'PYEOF' || exit 1
import os, re, sys
root = sys.argv[1]

# HARD BANS : login / panier hors bloc code, toujours refuses.
# HARD BAN pur pour "panier" (aucun contexte technique legitime).
HARD_PANIER = re.compile(r"\bpaniers?\b", re.IGNORECASE)
# "login" : HARD ban uniquement dans les tournures tuto e-commerce ; toleree
# quand un marqueur d'auth technique est present dans la meme ligne.
HARD_LOGIN_TUTO = re.compile(
    r"formulaire\s+de\s+login|page\s+de\s+login|(?:cr[eé]e|fais|impl[eé]mente)\s+(?:un|le)\s+login\s+simple",
    re.IGNORECASE,
)
AUTH_CONTEXT = re.compile(
    r"\b(route|endpoint|POST|middleware|JWT|OAuth|OIDC|session|token|cookie|API|flow|cycle|SSO|MFA|Auth|handler)\b",
    re.IGNORECASE,
)
LOGIN_RE = re.compile(r"\blogins?\b", re.IGNORECASE)

# Contextes e-commerce / tuto 2018 pour "commande" (blackliste explicite).
# Toute occurrence en dehors de ces patterns est acceptee (CLI, verbe, generique).
ECOM = re.compile(
    r"\b(commande|commandes)\b\s+"
    r"(client|clients|de\s+livraison|d'?achat|d'?e[- ]?commerce|checkout|de\s+produit)"
    r"|bon\s+de\s+commande"
    r"|passer\s+(une|la)\s+commande"
    r"|ajout(?:er|e|ee)?\s+au\s+panier",
    re.IGNORECASE,
)

IGNORED_DIRS = {".git", "node_modules", ".audit"}
IGNORED_FILES = {"AUDIT_FINAL_MyFunnyJS.md"}

fail = 0
hits = []
for r, ds, fs in os.walk(root):
    ds[:] = [d for d in ds if d not in IGNORED_DIRS]
    for f in fs:
        if not f.endswith(".md"): continue
        if f in IGNORED_FILES: continue
        p = os.path.join(r, f)
        rel = os.path.relpath(p, root)
        try:
            lines = open(p, encoding="utf-8").read().split("\n")
        except Exception:
            continue
        in_code = False
        for ln, line in enumerate(lines, 1):
            if line.strip().startswith("```"):
                in_code = not in_code; continue
            if in_code: continue
            stripped = re.sub(r"`[^`]*`", "", line)
            if HARD_PANIER.search(stripped):
                hits.append(f"{rel}:{ln} HARD-BAN (panier)")
            if LOGIN_RE.search(stripped):
                if HARD_LOGIN_TUTO.search(stripped):
                    hits.append(f"{rel}:{ln} LOGIN-TUTO (reformule)")
                elif not AUTH_CONTEXT.search(stripped):
                    hits.append(f"{rel}:{ln} LOGIN-SUSPECT (verifie le contexte)")
                # sinon : usage technique legitime (RFC/OAuth), tolere.
            if ECOM.search(stripped):
                hits.append(f"{rel}:{ln} E-COMMERCE (reformule) | {stripped.strip()[:90]}")

for h in hits:
    print("  [FORBIDDEN] " + h)
if hits:
    print(f"[FAIL] check_forbidden_words : {len(hits)} violation(s).")
    sys.exit(1)
print("[OK] check_forbidden_words : aucun contexte e-commerce interdit detecte.")
PYEOF
