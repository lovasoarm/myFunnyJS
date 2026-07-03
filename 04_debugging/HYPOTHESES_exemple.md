# HYPOTHESES_exemple.md : Debugging (fuite mémoire par closure)

Exemple rempli, à imiter dans tes propres bugs. Voir `_TEMPLATE_HYPOTHESES.md` pour la structure.

## 1. Hypothèses envisagées

- A : chaque appel à `createHandler(item)` capture `item` dans une closure jamais libérée.
- B : le tableau `handlers` grossit sans borne parce que rien ne le vide.
- C : le GC ne tourne pas parce que le process est saturé de micro-tâches.

## 2. Preuves d'écartement

- C écartée : `--trace-gc` montre des cycles GC réguliers, le heap reste plein après.
- B écartée seule : `handlers.length` reste stable à 10, mais le heap grimpe quand même.

## 3. Hypothèse retenue

Hypothèse A : chaque `createHandler` retourne une fonction qui garde une référence forte sur `item` (payload lourd), et cette fonction est enregistrée en listener global jamais retiré.

## 4. Preuve de confirmation

- Expérience : remplacer `createHandler(item)` par une fonction qui ne capture pas `item` (passer l'id seul) et vérifier le heap.
- Résultat attendu : heap stable après 10 000 appels.
- Résultat observé : heap stable (+2 Mo au lieu de +180 Mo).
- Verdict : confirmée.

## 5. Ce que je change dans mon code

- Passer un identifiant, pas le shinobi complet.
- `off()` systématique dans `beforeDestroy`.
- Test de non-régression : snapshot mémoire dans `tests/memory_leak.test.js`.
