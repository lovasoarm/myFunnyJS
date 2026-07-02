# Verification : 32_annexes

3 drills a sortie deterministe : **Annexes**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/32_annexes/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Portfolio : lit N `item:score` (0-10). Affiche la moyenne à 2 décimales.

**Input** (`inputs/drill_1.txt`) :
```
a:8
b:6
c:10
```

**Expected** (`expected/drill_1.txt`) :
```
8.00
```

## drill_2

**Consigne** : Trade-off : lit `option:pros:cons` (nombres). Affiche l'option avec meilleur ratio pros/cons.

**Input** (`inputs/drill_2.txt`) :
```
a:3:1
b:6:3
c:4:2
```

**Expected** (`expected/drill_2.txt`) :
```
a
```

## drill_3

**Consigne** : Interview : lit N questions `Q:answered`. Affiche `answered/total`.

**Input** (`inputs/drill_3.txt`) :
```
Q1:1
Q2:0
Q3:1
Q4:1
```

**Expected** (`expected/drill_3.txt`) :
```
3/4
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
