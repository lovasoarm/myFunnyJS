# Verification : 20_realtime

3 drills a sortie deterministe : **Temps réel**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/20_realtime/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N events `t label`. Affiche les labels dans l'ordre croissant de t.

**Input** (`inputs/drill_1.txt`) :
```
100 b
50 a
200 c
```

**Expected** (`expected/drill_1.txt`) :
```
a
b
c
```

## drill_2

**Consigne** : Backpressure : lit `IN` (+1) / `OUT` (-1). Affiche la queue max atteinte.

**Input** (`inputs/drill_2.txt`) :
```
IN
IN
IN
OUT
IN
```

**Expected** (`expected/drill_2.txt`) :
```
3
```

## drill_3

**Consigne** : Débit : lit N lignes `timestamp_ms`. Affiche le nombre d'events dans la première seconde (t <= 1000).

**Input** (`inputs/drill_3.txt`) :
```
0
500
900
1500
```

**Expected** (`expected/drill_3.txt`) :
```
3
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
