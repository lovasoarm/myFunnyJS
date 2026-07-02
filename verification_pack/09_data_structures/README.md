# Verification : 09_data_structures

3 drills a sortie deterministe : **Structures de données**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/09_data_structures/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N entiers. Affiche la pile après opérations : chaque `+x` push, chaque `-` pop. Affiche la pile finale espace-séparée.

**Input** (`inputs/drill_1.txt`) :
```
+1
+2
+3
-
```

**Expected** (`expected/drill_1.txt`) :
```
1 2
```

## drill_2

**Consigne** : Lit lignes `key=val`. Affiche les paires triées par clé, format `key:val`.

**Input** (`inputs/drill_2.txt`) :
```
b=2
a=1
c=3
```

**Expected** (`expected/drill_2.txt`) :
```
a:1
b:2
c:3
```

## drill_3

**Consigne** : Détecte doublons dans une liste d'ids. Affiche les doublons triés (une occurrence chacun).

**Input** (`inputs/drill_3.txt`) :
```
x
y
x
z
y
```

**Expected** (`expected/drill_3.txt`) :
```
x
y
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
