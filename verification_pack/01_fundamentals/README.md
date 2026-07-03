# Verification : 01_fundamentals

3 drills a sortie deterministe : **Fondamentaux JS**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/01_fundamentals/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N entiers (un par ligne), affiche la somme.

**Input** (`inputs/drill_1.txt`) :
```
3
7
10
```

**Expected** (`expected/drill_1.txt`) :
```
20
```

## drill_2

**Consigne** : Lit une ligne CSV `nom,age`. Affiche `NOM (age)` en MAJUSCULE.

**Input** (`inputs/drill_2.txt`) :
```
naruto,17
```

**Expected** (`expected/drill_2.txt`) :
```
NARUTO (17)
```

## drill_3

**Consigne** : Lit N mots (un par ligne). Affiche le nombre de mots distincts.

**Input** (`inputs/drill_3.txt`) :
```
kage
kage
bunshin
rasengan
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
