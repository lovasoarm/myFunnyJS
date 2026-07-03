# Verification : 19_web_inclusive

3 drills a sortie deterministe : **Web inclusif / i18n / a11y**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/19_web_inclusive/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N lignes `lang:key=val`. Affiche les clés manquantes en `en` (présentes en `fr` mais pas en `en`), triées.

**Input** (`inputs/drill_1.txt`) :
```
fr:hello=bonjour
fr:bye=au revoir
en:hello=hello
```

**Expected** (`expected/drill_1.txt`) :
```
bye
```

## drill_2

**Consigne** : Lit `role=X` par ligne. Affiche `INVALID` si un role non standard apparaît (autorisés : button,link,heading,main,nav). Sinon `OK`.

**Input** (`inputs/drill_2.txt`) :
```
role=button
role=heading
role=widget
```

**Expected** (`expected/drill_2.txt`) :
```
INVALID
```

## drill_3

**Consigne** : Lit N images `src alt`. Affiche les src sans alt (alt vide), triées.

**Input** (`inputs/drill_3.txt`) :
```
a.png hello
b.png 
c.png 
```

**Expected** (`expected/drill_3.txt`) :
```
b.png
c.png
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
