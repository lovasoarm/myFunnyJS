# Verification : 07_math_basics

3 drills a sortie deterministe : **Math pour dev**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/07_math_basics/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit deux entiers a,b (sur deux lignes). Affiche PGCD.

**Input** (`inputs/drill_1.txt`) :
```
48
36
```

**Expected** (`expected/drill_1.txt`) :
```
12
```

## drill_2

**Consigne** : Lit N nombres. Affiche la moyenne à 2 décimales.

**Input** (`inputs/drill_2.txt`) :
```
1
2
3
4
```

**Expected** (`expected/drill_2.txt`) :
```
2.50
```

## drill_3

**Consigne** : Lit N points `x,y`. Affiche la distance du dernier au premier, 2 décimales.

**Input** (`inputs/drill_3.txt`) :
```
0,0
3,4
```

**Expected** (`expected/drill_3.txt`) :
```
5.00
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
