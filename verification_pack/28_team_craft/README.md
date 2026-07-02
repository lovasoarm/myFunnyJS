# Verification : 28_team_craft

3 drills a sortie deterministe : **Team craft**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/28_team_craft/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Compte-rendu : lit N `TASK owner status`. Affiche `owner:done/total` triés par owner.

**Input** (`inputs/drill_1.txt`) :
```
TASK alice DONE
TASK bob TODO
TASK alice TODO
TASK bob DONE
```

**Expected** (`expected/drill_1.txt`) :
```
alice:1/2
bob:1/2
```

## drill_2

**Consigne** : Code review : lit N lignes `PR:LGTM|CHANGES`. Affiche le nombre approuvé.

**Input** (`inputs/drill_2.txt`) :
```
1:LGTM
2:CHANGES
3:LGTM
```

**Expected** (`expected/drill_2.txt`) :
```
2
```

## drill_3

**Consigne** : Bus factor : lit N `file:owner`. Affiche les fichiers avec un seul owner (bus=1), triés.

**Input** (`inputs/drill_3.txt`) :
```
a:alice
b:alice
b:bob
c:alice
```

**Expected** (`expected/drill_3.txt`) :
```
a
c
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
