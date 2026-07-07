// src/loop.js
// Event loop minimal : macrotask queue + microtask queue.
// Lit tests/scenario.json (chemin passe en argv[2]), imprime une trace ligne par ligne.

const fs = require('fs')
const path = process.argv[2]
if (!path) { console.error('usage: node loop.js <scenario.json>'); process.exit(2) }
const scenario = JSON.parse(fs.readFileSync(path, 'utf8'))

const macros = []
const micros = []
const out = []

function schedule(evt) {
  if (evt.kind === 'macro') macros.push(evt)
  else if (evt.kind === 'micro') micros.push(evt)
}

for (const evt of scenario.initial) schedule(evt)

let tick = 0
while (macros.length || micros.length) {
  while (micros.length) {
    const m = micros.shift()
    out.push(`t=${tick} micro ${m.name}`)
    for (const c of (m.enqueue || [])) schedule(c)
  }
  if (macros.length) {
    const m = macros.shift()
    out.push(`t=${tick} macro ${m.name}`)
    for (const c of (m.enqueue || [])) schedule(c)
    tick += 1
  }
}

process.stdout.write(out.join('\n') + '\n')
