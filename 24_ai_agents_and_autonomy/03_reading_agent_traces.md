# 03 : LIRE UNE TRACE D'AGENT COMME UNE STACK TRACE
Temps de lecture ~25 min

40 actions enchaînées, chacune "raisonnable", et le résultat casse la prod. La cause
n'est jamais l'action 39. C'est presque toujours une décision précoce (action 3, 5, 8)
qui a orienté toutes les suivantes vers un chemin cohérent mais faux.

## Méthode : `bisect` humain

```
1. Skim la trace : combien d'actions, quels fichiers touchés ?
2. Identifie les DÉCISIONS (verbes : "j'ai choisi de", "puisque X, alors Y").
   Les actions mécaniques (edit, run test) ne comptent pas.
3. Pour chaque décision, note : "est-ce que je l'aurais prise ?"
4. La première décision où tu réponds NON = ta cause racine.
5. Toutes les actions suivantes sont contaminées, même si elles compilent.
```

## Anti-pattern

Lire la trace linéairement de 1 à 40. Tu vas te faire embarquer par la logique de
l'agent. Lis-la par sauts : lis les décisions, ignore les diffs, puis re-lis les
diffs uniquement à partir de la décision qui pue.

## Exercice (35 min)

Un dépôt d'exemple `traces_pool/` contient 3 traces réelles :
- `trace_A.md` : agent qui a "amélioré" une fonction en cassant l'API publique.
- `trace_B.md` : agent qui a corrigé le bug mais désactivé un test.
- `trace_C.md` : agent qui a fait exactement ce qu'on demandait : et c'était mauvais.

Pour chaque trace, identifie la décision-racine et écris 2 lignes de review.
