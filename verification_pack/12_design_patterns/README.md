# Verification : 12_design_patterns

3 drills a sortie deterministe : **Design patterns**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/12_design_patterns/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Singleton : lit N `GET`. Affiche `same` si toutes retournent la même instance (toujours vrai), suivi du count.

**Input** (`inputs/drill_1.txt`) :
```
GET
GET
GET
```

**Expected** (`expected/drill_1.txt`) :
```
same 3
```

## drill_2

**Consigne** : Observer : lit `SUB name` / `EMIT event`. Pour chaque EMIT, affiche les abonnés notifiés, séparés par virgule.

**Input** (`inputs/drill_2.txt`) :
```
SUB alice
SUB bob
EMIT ping
```

**Expected** (`expected/drill_2.txt`) :
```
alice,bob
```

## drill_3

**Consigne** : Strategy : lit `MODE add|mul` puis N entiers. Applique la stratégie.

**Input** (`inputs/drill_3.txt`) :
```
MODE mul
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
