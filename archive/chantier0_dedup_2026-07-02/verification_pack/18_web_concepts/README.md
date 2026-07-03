# Verification : 17_web_concepts

3 drills a sortie deterministe : **Concepts web**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/17_web_concepts/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N requêtes `METHOD /path`. Affiche le nombre par méthode, triées, format `METHOD:count`.

**Input** (`inputs/drill_1.txt`) :
```
GET /a
POST /b
GET /c
```

**Expected** (`expected/drill_1.txt`) :
```
GET:2
POST:1
```

## drill_2

**Consigne** : Lit N statuts HTTP. Affiche `2xx=A 3xx=B 4xx=C 5xx=D`.

**Input** (`inputs/drill_2.txt`) :
```
200
301
404
500
200
```

**Expected** (`expected/drill_2.txt`) :
```
2xx=2 3xx=1 4xx=1 5xx=1
```

## drill_3

**Consigne** : Lit N URLs. Affiche les hosts uniques triés.

**Input** (`inputs/drill_3.txt`) :
```
https://a.com/x
https://b.com/y
https://a.com/z
```

**Expected** (`expected/drill_3.txt`) :
```
a.com
b.com
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
