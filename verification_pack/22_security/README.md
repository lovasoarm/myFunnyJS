# Verification : 22_security

3 drills a sortie deterministe : **Sécurité**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et saiyan stdout.

```bash
bash verification_pack/22_security/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N lignes de logs `IP action`. Affiche les IPs avec >=3 `FAIL`, triées.

**Input** (`inputs/drill_1.txt`) :
```
1.1.1.1 FAIL
1.1.1.1 FAIL
2.2.2.2 OK
1.1.1.1 FAIL
2.2.2.2 FAIL
```

**Expected** (`expected/drill_1.txt`) :
```
1.1.1.1
```

## drill_2

**Consigne** : Détecte injection : lit N strings. Affiche `UNSAFE` si une contient `';` ou `--`, sinon `SAFE`.

**Input** (`inputs/drill_2.txt`) :
```
hello
name='alice'
bye
```

**Expected** (`expected/drill_2.txt`) :
```
SAFE
```

## drill_3

**Consigne** : Hash prefix : lit N lignes `id:hash`. Affiche les id dont le hash commence par `00`, triés.

**Input** (`inputs/drill_3.txt`) :
```
a:00abc
b:11def
c:00ff0
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
