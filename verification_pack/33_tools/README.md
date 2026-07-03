# Verification : 33_tools

3 drills a sortie deterministe : **Outillage**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/33_tools/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N lignes `tool:used`. Affiche les tools jamais used (used=0), triés.

**Input** (`inputs/drill_1.txt`) :
```
vite:1
eslint:0
prettier:1
tsx:0
```

**Expected** (`expected/drill_1.txt`) :
```
eslint
tsx
```

## drill_2

**Consigne** : Version : lit `tool@X.Y.Z`. Affiche le tool avec la plus haute major.

**Input** (`inputs/drill_2.txt`) :
```
vite@5.0.1
esbuild@0.20.0
tsx@4.7.0
```

**Expected** (`expected/drill_2.txt`) :
```
vite
```

## drill_3

**Consigne** : Deps : lit N `dep:size_kb`. Affiche la somme totale.

**Input** (`inputs/drill_3.txt`) :
```
react:130
react-dom:100
zod:60
```

**Expected** (`expected/drill_3.txt`) :
```
290
```

## Squelette solution.js

```js
// solution.js - lit stdin, ecrit stdout, argv[2] = numero de drill
const drill = process.argv[2] || '1';
let data = '';
process.stdin.on('data', c => data += c);
process.stdin.on('end', () => {
  const lines = data.split(/\r?\n/).filter(l => l.length > 0);
  if (drill === '1') { /* ... */ }
  else if (drill === '2') { /* ... */ }
  else if (drill === '3') { /* ... */ }
});
```

> Regle : ecris ta solution SEULE, puis lance `verify.sh`. L'oracle deterministe ne pardonne pas la triche.
