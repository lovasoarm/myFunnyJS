# Verification : 27_observability

3 drills a sortie deterministe : **Observabilité**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/27_observability/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N lignes `LEVEL msg`. Affiche `LEVEL:count` triés.

**Input** (`inputs/drill_1.txt`) :
```
INFO a
ERROR b
INFO c
WARN d
ERROR e
```

**Expected** (`expected/drill_1.txt`) :
```
ERROR:2
INFO:2
WARN:1
```

## drill_2

**Consigne** : Trace : lit `traceId span`. Affiche le traceId avec le plus de spans.

**Input** (`inputs/drill_2.txt`) :
```
t1 s1
t2 s1
t1 s2
t1 s3
```

**Expected** (`expected/drill_2.txt`) :
```
t1
```

## drill_3

**Consigne** : SLO : lit N latences ms puis dernière ligne `SLO=X`. Affiche `MET` si p95 <= X, sinon `BREACH`.

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
SLO=100
```

**Expected** (`expected/drill_3.txt`) :
```
MET
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
