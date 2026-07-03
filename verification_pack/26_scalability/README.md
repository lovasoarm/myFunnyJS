# Verification : 26_scalability

3 drills a sortie deterministe : **Scalabilité**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/26_scalability/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Sharding : lit N ids entiers, S shards (première ligne = S). Affiche `shard:count` triés.

**Input** (`inputs/drill_1.txt`) :
```
3
1
2
3
4
5
6
7
```

**Expected** (`expected/drill_1.txt`) :
```
0:3
1:2
2:2
```

## drill_2

**Consigne** : Load balance : lit N noeuds `node:load`. Affiche le noeud le moins chargé.

**Input** (`inputs/drill_2.txt`) :
```
a:80
b:20
c:50
```

**Expected** (`expected/drill_2.txt`) :
```
b
```

## drill_3

**Consigne** : Latence : lit N mesures ms. Affiche p50 et p95 (entiers tronqués), séparés par espace.

**Input** (`inputs/drill_3.txt`) :
```
10
20
30
40
50
60
70
80
90
100
```

**Expected** (`expected/drill_3.txt`) :
```
50 95
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
