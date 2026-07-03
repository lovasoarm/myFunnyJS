# Verification : 28_edge_cases

3 drills a sortie deterministe : **Cas limites**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/28_edge_cases/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N entiers. Affiche `OVERFLOW` si somme dépasse 2^31-1, sinon la somme.

**Input** (`inputs/drill_1.txt`) :
```
1000000000
1000000000
```

**Expected** (`expected/drill_1.txt`) :
```
2000000000
```

## drill_2

**Consigne** : Off-by-one : lit N. Affiche les indices 0..N-1 séparés par espace.

**Input** (`inputs/drill_2.txt`) :
```
5
```

**Expected** (`expected/drill_2.txt`) :
```
0 1 2 3 4
```

## drill_3

**Consigne** : Vide : si l'entrée est vide (aucune ligne non vide), affiche `EMPTY`. Sinon affiche le nombre de lignes.

**Input** (`inputs/drill_3.txt`) :
```

```

**Expected** (`expected/drill_3.txt`) :
```
EMPTY
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
