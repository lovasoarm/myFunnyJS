# src/loop.py
# Event loop minimal : macrotask queue + microtask queue.
# Lit tests/scenario.json (chemin passe en argv[1]), imprime une trace ligne par ligne.

import json, sys
from collections import deque

path = sys.argv[1] if len(sys.argv) > 1 else None
if not path:
    print("usage: python3 loop.py <scenario.json>", file=sys.stderr); sys.exit(2)
with open(path, encoding="utf-8") as f:
    scenario = json.load(f)

macros = deque()
micros = deque()
out = []

def schedule(evt):
    if evt["kind"] == "macro":
        macros.append(evt)
    elif evt["kind"] == "micro":
        micros.append(evt)

for evt in scenario["initial"]:
    schedule(evt)

tick = 0
while macros or micros:
    while micros:
        m = micros.popleft()
        out.append(f"t={tick} micro {m['name']}")
        for c in m.get("enqueue", []):
            schedule(c)
    if macros:
        m = macros.popleft()
        out.append(f"t={tick} macro {m['name']}")
        for c in m.get("enqueue", []):
            schedule(c)
        tick += 1

sys.stdout.write("\n".join(out) + "\n")
