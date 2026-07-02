# Verification : 16_architecture_patterns

3 drills a sortie deterministe : **Architecture**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/16_architecture_patterns/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Couches : lit lignes `layer:module`. Affiche par layer (ordre : domain,application,infrastructure) les modules triés, format `layer:mod`.

**Input** (`inputs/drill_1.txt`) :
```
infrastructure:db
domain:user
application:usecase
domain:order
```

**Expected** (`expected/drill_1.txt`) :
```
domain:order
domain:user
application:usecase
infrastructure:db
```

## drill_2

**Consigne** : Détecte cycles : lit `a->b`. Affiche `CYCLE` si un cycle existe, sinon `OK`.

**Input** (`inputs/drill_2.txt`) :
```
a->b
b->c
c->a
```

**Expected** (`expected/drill_2.txt`) :
```
CYCLE
```

## drill_3

**Consigne** : Compte les responsabilités d'un module : lit `mod:resp`. Affiche `mod:count` triés par mod.

**Input** (`inputs/drill_3.txt`) :
```
auth:mercenaire
auth:logout
cart:add
cart:remove
cart:total
```

**Expected** (`expected/drill_3.txt`) :
```
auth:2
cart:3
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
