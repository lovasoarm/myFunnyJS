# Verification : 25_databases

3 drills a sortie deterministe : **Bases de données**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/25_databases/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N lignes `id,name,age`. Affiche les name où age >= 18, triés.

**Input** (`inputs/drill_1.txt`) :
```
1,alice,17
2,bob,25
3,carol,30
```

**Expected** (`expected/drill_1.txt`) :
```
bob
carol
```

## drill_2

**Consigne** : Group by : lit `cat:val`. Affiche `cat:sum` triés par cat.

**Input** (`inputs/drill_2.txt`) :
```
a:1
b:2
a:3
b:4
```

**Expected** (`expected/drill_2.txt`) :
```
a:4
b:6
```

## drill_3

**Consigne** : Join : lit N lignes `LEFT id name` puis M `RIGHT id score`. Affiche `name score` triés par name pour les id présents des deux côtés.

**Input** (`inputs/drill_3.txt`) :
```
LEFT 1 alice
LEFT 2 bob
RIGHT 1 90
RIGHT 3 80
```

**Expected** (`expected/drill_3.txt`) :
```
alice 90
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
