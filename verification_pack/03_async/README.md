# Verification : 03_async

3 drills a sortie deterministe : **Async & event loop**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/03_async/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Ordonnance une trace de tâches : lignes `sync|micro|macro:label`. Affiche l'ordre d'exécution (sync -> micro -> macro), un label par ligne.

**Input** (`inputs/drill_1.txt`) :
```
macro:A
sync:B
micro:C
sync:D
```

**Expected** (`expected/drill_1.txt`) :
```
B
D
C
A
```

## drill_2

**Consigne** : Lit N promesses `id:delay_ms`. Trie par delay croissant, casse d'égalité par id.

**Input** (`inputs/drill_2.txt`) :
```
p1:100
p2:50
p3:100
```

**Expected** (`expected/drill_2.txt`) :
```
p2:50
p1:100
p3:100
```

## drill_3

**Consigne** : Lit `START` puis N `TICK`. Affiche le nombre total de TICK reçus après START.

**Input** (`inputs/drill_3.txt`) :
```
TICK
START
TICK
TICK
```

**Expected** (`expected/drill_3.txt`) :
```
2
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
