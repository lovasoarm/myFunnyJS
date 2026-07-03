# Verification : 05_error_handling

3 drills a sortie deterministe : **Gestion d'erreurs**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/05_error_handling/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit lignes `code:message`. Ignore les `WARN`, affiche les `FATAL` en priorité, puis `ERROR`, un par ligne, ordre stable.

**Input** (`inputs/drill_1.txt`) :
```
WARN cache miss
ERROR db
FATAL disk
ERROR net
```

**Expected** (`expected/drill_1.txt`) :
```
FATAL disk
ERROR db
ERROR net
```

## drill_2

**Consigne** : Compte le nombre de `retry=N`. Affiche la somme des retries.

**Input** (`inputs/drill_2.txt`) :
```
op=a retry=1
op=b retry=3
op=c retry=2
```

**Expected** (`expected/drill_2.txt`) :
```
6
```

## drill_3

**Consigne** : Lit lignes `try:...` et `catch:...`. Affiche `MATCHED` si chaque try a un catch juste après, sinon `UNBALANCED`.

**Input** (`inputs/drill_3.txt`) :
```
try:1
catch:1
try:2
catch:2
```

**Expected** (`expected/drill_3.txt`) :
```
MATCHED
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
