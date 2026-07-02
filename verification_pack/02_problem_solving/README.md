# Verification : 02_problem_solving

3 drills a sortie deterministe : **Découpage de problèmes**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/02_problem_solving/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit une liste d'entiers, retourne min et max séparés par espace.

**Input** (`inputs/drill_1.txt`) :
```
4
1
9
3
```

**Expected** (`expected/drill_1.txt`) :
```
1 9
```

## drill_2

**Consigne** : Lit des lignes `poids:valeur`, retourne la valeur moyenne (entier tronqué).

**Input** (`inputs/drill_2.txt`) :
```
1:10
2:20
3:30
```

**Expected** (`expected/drill_2.txt`) :
```
20
```

## drill_3

**Consigne** : Lit un entier N puis N noms. Affiche le plus long nom.

**Input** (`inputs/drill_3.txt`) :
```
3
kakashi
gaara
itachi
```

**Expected** (`expected/drill_3.txt`) :
```
kakashi
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
