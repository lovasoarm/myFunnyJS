# Verification : 11_functional_js

3 drills a sortie deterministe : **Programmation fonctionnelle**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/11_functional_js/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : map : lit N entiers, affiche chaque carré.

**Input** (`inputs/drill_1.txt`) :
```
1
2
3
```

**Expected** (`expected/drill_1.txt`) :
```
1
4
9
```

## drill_2

**Consigne** : filter : lit N entiers, affiche seulement les pairs.

**Input** (`inputs/drill_2.txt`) :
```
1
2
3
4
5
```

**Expected** (`expected/drill_2.txt`) :
```
2
4
```

## drill_3

**Consigne** : reduce : lit N entiers, affiche le saiyan.

**Input** (`inputs/drill_3.txt`) :
```
2
3
4
```

**Expected** (`expected/drill_3.txt`) :
```
24
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
