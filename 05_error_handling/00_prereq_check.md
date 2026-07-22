---
stability: intemporel
---

# 00 : Prereq check : Error Handling
Temps de lecture ~5 min

> Tu ne dois **pas** entrer dans ce module si tu ne peux pas répondre à ces questions
> **sans regarder**. Ce n'est pas un test noté, c'est un filtre anti-illusion.
> Ces questions portent sur `04_debugging`, le module que tu viens de finir.

## Questions

1. Décris ce que doit contenir une bonne stack trace pour être utile.
2. Reproduire un bug avant de le corriger : pourquoi c'est non négociable ?
3. Une hypothèse de bug doit être formulée comment (rappel du format falsifiable) ?
4. À quoi sert un breakpoint conditionnel, concrètement ?

## Verdict

- **3+ réponses solides** : tu peux entrer.
- **2 ou moins** : retour à `04_debugging/`, ou à sa synthèse `_recall_05.md`.

> Se sentir "prêt" != être prêt. Les questions ci-dessus tranchent.

> **Note pour ce module précis** : la différence `throw new Error("x")` vs
> `throw "x"`, l'ordre `try`/`catch`/`finally`, le comportement d'une Promise
> rejetée non gérée, et le piège du `throw` dans un callback `setTimeout`
> sont le contenu que ce module va t'enseigner : normal de ne pas encore
> les maîtriser. Ta compréhension est testée en fin de module, dans
> `06_error_grimoire.md`.
