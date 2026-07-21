#!/usr/bin/env python3
"""Genere 31_annexes/PERISSABILITE_INDEX.md a partir des front-matter stability:.

Sortie : tableau markdown trie par urgence (perissable_2027 -> perissable_2028
-> perissable -> intemporel), avec chemin + stability + duree de vie estimee
+ raison courte extraite du front-matter (champ `reason:` optionnel).
"""
import re, pathlib, sys, datetime
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
OUT = ROOT / "31_annexes" / "PERISSABILITE_INDEX.md"
FM_RE = re.compile(r"\A---\n(.*?)\n---", re.S)
KV_RE = re.compile(r"^\s*([a-zA-Z_]+)\s*:\s*(.+?)\s*$", re.M)

ORDER = {"perissable_2027": 0, "perissable_2028": 1, "perissable": 2, "intemporel": 3}
LIFE = {
    "perissable_2027": "~1 an",
    "perissable_2028": "~2 ans",
    "perissable": "~3 ans",
    "intemporel": "5 ans et +",
}

rows = []
for f in sorted(ROOT.rglob("*.md")):
    rel = f.relative_to(ROOT)
    if any(p.startswith(".") for p in rel.parts): continue
    if rel.name == "PERISSABILITE_INDEX.md": continue
    m = FM_RE.match(f.read_text(errors="ignore"))
    if not m: continue
    kv = dict(KV_RE.findall(m.group(1)))
    stab = kv.get("stability")
    if not stab: continue
    reason = kv.get("reason", "-")
    rows.append((ORDER.get(stab, 99), stab, str(rel), LIFE.get(stab, "?"), reason))

rows.sort()

lines = [
    "---",
    "stability: intemporel",
    "---",
    "",
    "# PERISSABILITE INDEX (auto-genere)",
    "",
    f"> Genere par `.internal/scripts/build_perissabilite_index.py` le {datetime.date.today().isoformat()}.",
    "> Ne pas editer a la main : rejouer le script apres chaque commit majeur.",
    "> Tri : ce qui va vieillir en premier est en haut.",
    "",
    "## Comment lire",
    "",
    "- **intemporel** : noyau dur, durable > 5 ans.",
    "- **perissable** : concepts qui vieillissent en 3 ans environ.",
    "- **perissable_2028** : a rouvrir en 2028.",
    "- **perissable_2027** : a rouvrir avant tout autre.",
    "",
    "| Fichier | Stability | Duree de vie | Raison |",
    "|---------|-----------|--------------|--------|",
]
for _, stab, path, life, reason in rows:
    lines.append(f"| `{path}` | {stab} | {life} | {reason} |")

lines += [
    "",
    f"Total scanne : **{len(rows)}** fichiers avec front-matter `stability:`.",
    "",
]
OUT.write_text("\n".join(lines))
print(f"OK build_perissabilite_index -> {OUT.relative_to(ROOT)} ({len(rows)} entrees)")
