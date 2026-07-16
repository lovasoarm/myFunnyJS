#!/usr/bin/env python3
"""Applique frontmatter stability: en masse selon un mapping."""
import os, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent

MAPPING = {
    "intemporel": [
        "01_fundamentals", "03_async", "07_math_basics", "08_memory_performance",
        "09_data_structures", "10_algorithms", "11_functional_js",
        "12_design_patterns", "18_oop_js", "28_edge_cases",
    ],
    "periss-2028": [
        "05_error_handling/05_sentry_in_prod.md",
        "06_testing/08_e2e_playwright_beast.md",
        "32_tools", "23_ai_native_dev", "29_ai_agents_and_autonomy",
    ],
}
FM_RE = re.compile(r"\A---\n(.*?)\n---\n", re.S)

def apply(path, stability):
    txt = path.read_text()
    fm = FM_RE.match(txt)
    body = txt[fm.end():] if fm else txt
    old = fm.group(1) if fm else ""
    if "stability:" in old:
        new_fm = re.sub(r"stability:\s*\S+", f"stability: {stability}", old)
    else:
        new_fm = f"stability: {stability}\nlast_reviewed: 2026-07\ndepends_on_vendor: false"
        if old: new_fm = old + "\n" + new_fm
    path.write_text(f"---\n{new_fm}\n---\n{body}")

def iter_targets(spec):
    p = ROOT / spec
    if p.is_file(): yield p
    elif p.is_dir():
        for f in p.rglob("*.md"): yield f

for stability, specs in MAPPING.items():
    for spec in specs:
        for f in iter_targets(spec):
            apply(f, stability)
print("OK apply_stability")
