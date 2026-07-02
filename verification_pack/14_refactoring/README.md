# Verification : 14_refactoring

3 drills a sortie deterministe : **Refactoring**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/14_refactoring/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Détecte duplications : lit N lignes. Affiche les lignes qui apparaissent >1 fois, triées, une occurrence chacune.

**Input** (`inputs/drill_1.txt`) :
```
a
b
a
c
b
```

**Expected** (`expected/drill_1.txt`) :
```
a
b
```

## drill_2

**Consigne** : Code mort : lit lignes `USED name` / `DEF name`. Affiche les DEF jamais USED, triés.

**Input** (`inputs/drill_2.txt`) :
```
DEF a
DEF b
USED a
DEF c
```

**Expected** (`expected/drill_2.txt`) :
```
b
c
```

## drill_3

**Consigne** : Complexité : lit N lignes `func:cyclomatic`. Affiche la fonction dont la complexité dépasse 10 (une par ligne, triées).

**Input** (`inputs/drill_3.txt`) :
```
login:5
parse:15
render:11
util:3
```

**Expected** (`expected/drill_3.txt`) :
```
parse
render
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
