# 00 : Prereq check : Error Handling
Temps de lecture ~5 min

> Tu ne dois **pas** entrer dans ce module si tu ne peux pas répondre à ces questions
> **sans regarder**. Ce n'est pas un test noté, c'est un filtre anti-illusion.

## Questions

1. Qu'est-ce qu'une fonction retourne quand elle `throw` ?
2. Différence entre `throw new Error("x")` et `throw "x"` (au moins un vrai avantage
   du premier) ?
3. Dans quel ordre s'exécutent `try` / `catch` / `finally` si l'erreur est levée
   dans `try` ? Et si aucune erreur n'est levée ?
4. Une `Promise` rejetée qui n'est jamais `await`-ée ni `.catch()`-ée : que se
   passe-t-il en Node 20+ ?
5. Un `throw` à l'intérieur d'un callback synchrone passé à `setTimeout` : où
   ressort l'erreur, pourquoi le `try` autour de `setTimeout(...)` ne l'attrape
   pas ?
6. Cite au moins un cas où `catch(e)` **doit** re-`throw` plutôt qu'avaler.

## Verdict

- **5+ réponses solides** : tu peux entrer.
- **3 à 4** : relis `01_fundamentals/03_functions.md`, `03_async/03_async_await/`,
  puis reviens.
- **2 ou moins** : retour à `01_fundamentals/` + `03_async/`, ou à leur
  synthèse `_recall_*.md`.

> Se sentir "prêt" != être prêt. Les questions ci-dessus tranchent.

---
stability: intemporel
