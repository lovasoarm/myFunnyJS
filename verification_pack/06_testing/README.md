# Verification : 06_testing

3 drills a sortie deterministe : **Stratégie de tests**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/06_testing/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit des lignes `test:PASS|FAIL`. Affiche `PASS=X FAIL=Y`.

**Input** (`inputs/drill_1.txt`) :
```
a:PASS
b:FAIL
c:PASS
```

**Expected** (`expected/drill_1.txt`) :
```
PASS=2 FAIL=1
```

## drill_2

**Consigne** : Lit `given|when|then` sur 3 lignes. Affiche le then en MAJUSCULE.

**Input** (`inputs/drill_2.txt`) :
```
compteur=0
incr()
compteur==1
```

**Expected** (`expected/drill_2.txt`) :
```
COMPTEUR==1
```

## drill_3

**Consigne** : Lit N lignes `nom durée_ms`. Affiche le nom du test le plus lent.

**Input** (`inputs/drill_3.txt`) :
```
unit_a 12
unit_b 45
unit_c 30
```

**Expected** (`expected/drill_3.txt`) :
```
unit_b
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
