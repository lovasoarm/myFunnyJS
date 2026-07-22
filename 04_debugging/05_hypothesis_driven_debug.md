---
stability: intemporel
---

# 05 : Debug hypothèse-dirigé
Temps de lecture ~5 min

> **Principe universel** : méthode scientifique appliquée au code. Hypothèse → expérience → réfutation. Sherlock, pas devin.

## Le protocole

1. **Observation** : symptôme précis, pas "ça marche pas".
2. **Hypothèse** : phrase **réfutable**. "Le bug vient de X parce que Y."
3. **Expérience** : la plus petite modification qui **prouve ou réfute** l'hypothèse.
4. **Verdict** : si réfutée, nouvelle hypothèse. Jamais "je change et je vois".
5. **Explication** : tu dois pouvoir expliquer le bug **à voix haute** avant le fix.

## 5 bugs à traiter

Pour chacun, produis un fichier `HYPOTHESES.md` avec au minimum 3 hypothèses ordonnées par coût.

1. `list.map(async fn)` renvoie `[Promise, Promise, ...]` non résolues.
2. `setTimeout(fn, 100)` s'exécute après 3s en prod.
3. `fetch` renvoie `undefined` sous Safari uniquement.
4. Un test passe seul, échoue en suite.
5. Un compteur affiche `NaN` après 1h d'usage.

## (attention) Piège

Coder le fix pendant qu'on formule l'hypothèse. **Interdit.** Sépare pensée et action.
