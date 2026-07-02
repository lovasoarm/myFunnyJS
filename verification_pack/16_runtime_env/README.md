# Verification : 16_runtime_env

3 drills a sortie deterministe : **Runtime & env**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/16_runtime_env/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit lignes `KEY=VAL`. Affiche uniquement les KEY commençant par `APP_`, triées, format `KEY=VAL`.

**Input** (`inputs/drill_1.txt`) :
```
APP_PORT=3000
HOME=/root
APP_NAME=mf
```

**Expected** (`expected/drill_1.txt`) :
```
APP_NAME=mf
APP_PORT=3000
```

## drill_2

**Consigne** : Détecte le node major : lit une ligne `vX.Y.Z`. Affiche X.

**Input** (`inputs/drill_2.txt`) :
```
v20.11.1
```

**Expected** (`expected/drill_2.txt`) :
```
20
```

## drill_3

**Consigne** : Lit N lignes `pid time_ms`. Affiche le pid le plus lent.

**Input** (`inputs/drill_3.txt`) :
```
101 30
102 90
103 45
```

**Expected** (`expected/drill_3.txt`) :
```
102
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
