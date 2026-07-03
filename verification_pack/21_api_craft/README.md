# Verification : 21_api_craft

3 drills a sortie deterministe : **API craft**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/21_api_craft/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N lignes `METHOD /path status`. Affiche les endpoints `4xx`, format `METHOD /path`, triés.

**Input** (`inputs/drill_1.txt`) :
```
GET /a 200
POST /b 400
GET /c 404
```

**Expected** (`expected/drill_1.txt`) :
```
GET /c
POST /b
```

## drill_2

**Consigne** : Idempotence : lit `METHOD`. Affiche `IDEMPOTENT` si toutes les méthodes sont GET/PUT/DELETE, sinon `NON`.

**Input** (`inputs/drill_2.txt`) :
```
GET
PUT
DELETE
```

**Expected** (`expected/drill_2.txt`) :
```
IDEMPOTENT
```

## drill_3

**Consigne** : Versionning : lit `/v1/x`, `/v2/y`... Affiche `vN:count` triés par version.

**Input** (`inputs/drill_3.txt`) :
```
/v1/a
/v2/b
/v1/c
/v3/d
```

**Expected** (`expected/drill_3.txt`) :
```
v1:2
v2:1
v3:1
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
