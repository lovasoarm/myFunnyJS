# Verification : 04_debugging

3 drills a sortie deterministe : **Debugging scientifique**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/04_debugging/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Repère la première ligne contenant `ERROR`. Affiche son numéro (1-indexé) ou `-1`.

**Input** (`inputs/drill_1.txt`) :
```
INFO ok
DEBUG start
ERROR boom
INFO end
```

**Expected** (`expected/drill_1.txt`) :
```
3
```

## drill_2

**Consigne** : Compte le nombre d'ERROR distinctes (message après `ERROR `).

**Input** (`inputs/drill_2.txt`) :
```
ERROR null pointer
ERROR timeout
ERROR null pointer
```

**Expected** (`expected/drill_2.txt`) :
```
2
```

## drill_3

**Consigne** : Filtre les lignes `ERROR ...` et affiche uniquement leurs messages, triés.

**Input** (`inputs/drill_3.txt`) :
```
INFO x
ERROR beta
ERROR alpha
```

**Expected** (`expected/drill_3.txt`) :
```
alpha
beta
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
