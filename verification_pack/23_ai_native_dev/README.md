# Verification : 23_ai_native_dev

3 drills a sortie deterministe : **Dev IA-native**.

Ecris un unique `solution.js` qui, selon le premier argument (`1|2|3`), lit stdin et produit stdout.

```bash
bash verification_pack/23_ai_native_dev/verify.sh path/to/solution.js
```

Chaque drill est **auto-verifiable** : la sortie doit etre EXACTEMENT egale au fichier `expected/`.

## drill_1

**Consigne** : Lit N lignes `prompt:score` (score 0-10). Affiche les prompts avec score >= 8, triés par score décroissant puis prompt.

**Input** (`inputs/drill_1.txt`) :
```
p1:5
p2:9
p3:8
p4:9
```

**Expected** (`expected/drill_1.txt`) :
```
p2:9
p4:9
p3:8
```

## drill_2

**Consigne** : Détecte hallucination : lit `claim:true|false`. Affiche le nombre de `false`.

**Input** (`inputs/drill_2.txt`) :
```
a:true
b:false
c:false
d:true
```

**Expected** (`expected/drill_2.txt`) :
```
2
```

## drill_3

**Consigne** : Coût tokens : lit N lignes `model tokens`. Affiche le modèle le plus coûteux (somme tokens).

**Input** (`inputs/drill_3.txt`) :
```
gpt 100
claude 200
gpt 300
```

**Expected** (`expected/drill_3.txt`) :
```
gpt
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
