[INTEMPOREL]

# HYPOTHESES_exemple.md : Error handling (erreur async avalée)

Exemple rempli. Voir `../04_debugging/_TEMPLATE_HYPOTHESES.md`.

## 1. Hypothèses envisagées

- A : un `await` manque devant `sendMail()`, l'erreur devient un `unhandledRejection` silencieux.
- B : un `try/catch` englobant renvoie `null` sans logger.
- C : la fonction est appelée dans un `.forEach()`, donc les rejets sont perdus.

## 2. Preuves d'écartement

- B écartée : `grep -rn "catch"` ne montre aucun `return null` ni swallow.

## 3. Hypothèse retenue

Hypothèse C : `list.forEach(async x => ...)` n'attend rien, les rejets partent dans le vide.

## 4. Preuve de confirmation

- Expérience : remplacer par `for (const x of list) await handle(x)` et déclencher un rejet.
- Résultat attendu : l'erreur remonte, le test échoue proprement.
- Résultat observé : conforme, l'erreur est catchée par le `try` externe.
- Verdict : confirmée.

## 5. Ce que je change

- Interdire `forEach(async)` via règle ESLint `no-async-in-foreach`.
- Ajouter un test `errors_bubble_up.test.js` qui force un rejet.
