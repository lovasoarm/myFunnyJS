# VERIFICATION PACK

Filet de sécurité optionnel. Pour chaque module, 3 drills à sortie déterministe (input → output attendu). AUCUN code solution fourni : uniquement des entrées et le résultat attendu.

## USAGE

```bash
bash verification_pack/<module>/verify.sh path/to/your/solution.js
```

Le script compare la sortie de TON code aux `expected/*.txt`. Vert = OK. Rouge = revois la leçon.

Les drills sont **optionnels** : tu peux valider un module sans, à condition d'avoir peer-review + POSTMORTEM.
