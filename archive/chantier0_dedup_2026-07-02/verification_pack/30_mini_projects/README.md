# Verification : 30_mini_projects

3 drills a sortie deterministe : **Mini-projets (sanity check)**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/30_mini_projects/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N lignes `project:status`. Affiche `DONE/TOTAL`.

**Input** (`inputs/drill_1.txt`) :
```
p1:DONE
p2:TODO
p3:DONE
```

**Expected** (`expected/drill_1.txt`) :
```
2/3
```

## drill_2

**Consigne** : Livrables : lit `project:file`. Affiche les projets ayant `README`, `ADR`, `POSTMORTEM` (les 3 requis), triés.

**Input** (`inputs/drill_2.txt`) :
```
p1:README
p1:ADR
p1:POSTMORTEM
p2:README
```

**Expected** (`expected/drill_2.txt`) :
```
p1
```

## drill_3

**Consigne** : TDD journal : lit N `RED|GREEN|REFACTOR`. Affiche `RED:x GREEN:y REFACTOR:z`.

**Input** (`inputs/drill_3.txt`) :
```
RED
GREEN
RED
GREEN
REFACTOR
```

**Expected** (`expected/drill_3.txt`) :
```
RED:2 GREEN:2 REFACTOR:1
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
