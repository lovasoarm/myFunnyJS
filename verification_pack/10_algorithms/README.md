# Verification : 10_algorithms

3 drills a sortie deterministe : **Algorithmes**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/10_algorithms/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Tri : lit N entiers, affiche triés croissants, un par ligne.

**Input** (`inputs/drill_1.txt`) :
```
5
2
8
1
```

**Expected** (`expected/drill_1.txt`) :
```
1
2
5
8
```

## drill_2

**Consigne** : Recherche : lit `TARGET n` puis N entiers. Affiche l'index (0-indexé) ou -1.

**Input** (`inputs/drill_2.txt`) :
```
TARGET 7
3
1
7
9
```

**Expected** (`expected/drill_2.txt`) :
```
2
```

## drill_3

**Consigne** : Fibonacci : lit N. Affiche fib(N).

**Input** (`inputs/drill_3.txt`) :
```
10
```

**Expected** (`expected/drill_3.txt`) :
```
55
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
