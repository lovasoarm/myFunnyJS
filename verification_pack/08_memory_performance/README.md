# Verification : 08_memory_performance

3 drills a sortie deterministe : **Mémoire & perf**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/08_memory_performance/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit lignes `ALLOC N` / `FREE N`. Affiche la mémoire résiduelle (somme signée).

**Input** (`inputs/drill_1.txt`) :
```
ALLOC 100
ALLOC 50
FREE 30
```

**Expected** (`expected/drill_1.txt`) :
```
120
```

## drill_2

**Consigne** : Détecte fuites : entrée = `HOLD id` ou `RELEASE id`. Affiche les ids jamais release, triés.

**Input** (`inputs/drill_2.txt`) :
```
HOLD a
HOLD b
RELEASE a
HOLD c
```

**Expected** (`expected/drill_2.txt`) :
```
b
c
```

## drill_3

**Consigne** : Lit N tailles. Affiche `PEAK=X` où X est la somme cumulée max.

**Input** (`inputs/drill_3.txt`) :
```
10
20
-5
30
```

**Expected** (`expected/drill_3.txt`) :
```
PEAK=55
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
