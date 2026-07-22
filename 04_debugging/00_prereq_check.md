---
stability: intemporel
---

# 00 : Prereq check : Debugging
Temps de lecture ~5 min

> Tu ne dois **pas** entrer dans ce module si tu ne peux pas répondre à ces questions
> **sans regarder**. Ce n'est pas un test noté, c'est un filtre anti-illusion.
> Ces questions portent sur `03_async`, le module que tu viens de finir.

## Questions

1. Différence microtask / macrotask ?
2. Que fait `await` sous le capot ?
3. Callback hell : c'est quoi le vrai problème ?
4. Pourquoi une Promise `.then()` est asynchrone même si résolue tout de suite ?

## Verdict

- **3+ réponses solides** → tu peux entrer.
- **2 ou moins** → retour à `03_async/`, ou à ses grimoires internes
  (`01_callbacks/`, `02_promises/`, `03_async_await/`, `04_event_loop/`).

> Se sentir "prêt" ≠ être prêt. Les questions ci-dessus tranchent.

> **Note pour ce module précis** : lire une stack trace, savoir pourquoi
> reproduire avant de corriger, formuler une hypothèse falsifiable, et
> utiliser un breakpoint conditionnel sont le contenu que ce module va
> t'enseigner (notamment `03_devtools_debugger.md`) : normal de ne pas
> encore les maîtriser. Ta compréhension est testée en fin de module.
