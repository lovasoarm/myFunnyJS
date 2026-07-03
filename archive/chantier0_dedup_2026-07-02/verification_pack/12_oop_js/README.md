# Verification : 12_oop_js

3 drills a sortie deterministe : **OOP / prototype**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/12_oop_js/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Compte les instances : lit `NEW ClassName`. Affiche `ClassName:count` triées.

**Input** (`inputs/drill_1.txt`) :
```
NEW Shinobi
NEW Kage
NEW Shinobi
```

**Expected** (`expected/drill_1.txt`) :
```
Kage:1
Shinobi:2
```

## drill_2

**Consigne** : Héritage : lit `parent>enfant`. Affiche la chaîne complète depuis `root`.

**Input** (`inputs/drill_2.txt`) :
```
root>ninja
ninja>jonin
jonin>hokage
```

**Expected** (`expected/drill_2.txt`) :
```
root>ninja>jonin>hokage
```

## drill_3

**Consigne** : Encapsulation : lit `SET k v` / `GET k`. Affiche la valeur pour chaque GET (ou `undefined`).

**Input** (`inputs/drill_3.txt`) :
```
SET hp 100
GET hp
GET mp
```

**Expected** (`expected/drill_3.txt`) :
```
100
undefined
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
