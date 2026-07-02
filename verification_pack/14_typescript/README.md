# Verification : 14_typescript

3 drills a sortie deterministe : **TypeScript**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/14_typescript/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N lignes `name:type`. Affiche les noms des `string`, triés.

**Input** (`inputs/drill_1.txt`) :
```
a:string
b:number
c:string
```

**Expected** (`expected/drill_1.txt`) :
```
a
c
```

## drill_2

**Consigne** : Compte les `any` : affiche le nombre.

**Input** (`inputs/drill_2.txt`) :
```
x:any
y:number
z:any
```

**Expected** (`expected/drill_2.txt`) :
```
2
```

## drill_3

**Consigne** : Lit `union: t1|t2|...`. Affiche les types uniques triés, séparés par `|`.

**Input** (`inputs/drill_3.txt`) :
```
union: string|number|string|boolean
```

**Expected** (`expected/drill_3.txt`) :
```
boolean|number|string
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
