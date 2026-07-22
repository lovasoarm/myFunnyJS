---
stability: intemporel
---

# 00 : Prereq check : Testing
Temps de lecture ~5 min

> Tu ne dois **pas** entrer dans ce module si tu ne peux pas répondre à ces questions
> **sans regarder**. Ce n'est pas un test noté, c'est un filtre anti-illusion.
> Ces questions portent sur `05_error_handling`, le module que tu viens de finir.

## Questions

1. Différence entre `throw new Error("x")` et `throw "x"` : quel est le vrai avantage du premier ?
2. Dans quel ordre s'exécutent `try` / `catch` / `finally` si l'erreur est levée dans `try` ?
3. Une `Promise` rejetée qui n'est jamais `await`-ée ni `.catch()`-ée : que se passe-t-il en Node 20+ ?
4. Cite un cas où `catch(e)` **doit** re-`throw` plutôt qu'avaler l'erreur.

## Verdict

- **3+ réponses solides** → tu peux entrer.
- **2 ou moins** → retour à `05_error_handling/`, ou à sa synthèse `_recall_05.md`.

> Se sentir "prêt" ≠ être prêt. Les questions ci-dessus tranchent.

> **Note pour ce module précis** : la différence unit/intégration/e2e, ce
> qu'un test qui passe toujours prouve réellement (rien : c'est un piège),
> et le format AAA (Arrange/Act/Assert) sont le contenu que ce module va
> t'enseigner (notamment `01_unit_sniper.md`) : normal de ne pas encore
> les maîtriser. Ta compréhension est testée en fin de module, dans
> `10_testing_grimoire.md`.
