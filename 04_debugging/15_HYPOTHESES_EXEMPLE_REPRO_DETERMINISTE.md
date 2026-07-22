---
stability: intemporel
---

# HYPOTHESES.md : exemple rempli

Temps de lecture ~3 min

## Contexte : exercice `09_exo_repro_deterministe.md`, bug `flaky.js`

> Livrable de référence. À ouvrir APRÈS avoir tenté l'exercice tout seul.
> Sert de calibrage : voilà à quoi ressemble un `HYPOTHESES.md` correct,
> pas juste le template vide. La longueur (60 lignes environ) est la
> cible ; en-dessous c'est trop vague, au-dessus tu digresses.

## 1. Hypothèses envisagées

Bug observé : parfois la fonction retournée par `debounce(fn, 100)` déclenche
`fn` deux fois pour un même burst d'appels, parfois zéro fois, parfois une
fois correctement. Aucun ordre reproductible en l'état.

Ordre de probabilité au moment T :

- Hypothèse A : le `timer` est partagé entre plusieurs closures et son
  identifiant est écrasé par un appel concurrent avant le `clearTimeout`.
- Hypothèse B : `setTimeout(..., ms)` n'est pas garanti "au moins ms" quand
  l'event loop est saturé, donc l'ordre entre deux timers proches est
  non-déterministe.
- Hypothèse C : `debounce` est appelée plusieurs fois -> plusieurs closures
  indépendantes, chacune avec son propre `timer`, et le test global les
  observe empilées.
- Hypothèse D : bug dans le runner de test (Node --test), pas dans le code.

## 2. Preuves d'écartement

- Hypothèse D écartée car : le bug se reproduit aussi avec `node -e` sans
  runner de test. Le runner n'est pas en cause.
- Hypothèse B écartée car : en réduisant `ms` à `0` et en isolant deux
  appels séparés par un `await new Promise(r => setImmediate(r))`, le
  résultat reste non-déterministe. La saturation de l'event loop n'est
  pas la cause principale.
- Hypothèse A écartée car : en instrumentant `debounce` pour logger l'id
  du `timer`, on voit bien un `clearTimeout` correct à chaque appel dans
  la même closure. Pas de course intra-closure.

## 3. Hypothèse retenue

Hypothèse C reformulée en une phrase falsifiable :
"Chaque appel à `debounce(fn, ms)` crée une NOUVELLE closure avec son propre
`timer`, donc N appels à `debounce` produisent N débounceurs indépendants ;
le test qui appelle plusieurs fois `debounce(...)` au lieu de réutiliser
une seule instance observe des déclenchements superposés, à un rythme
dicté par l'ordre de résolution des `setTimeout`."

Test de falsifiabilité : si on APPELLE `debounce(fn, 100)` UNE seule fois,
qu'on garde la fonction retournée dans une variable, et qu'on l'appelle 10
fois de suite -> on doit voir exactement 1 appel à `fn`, systématiquement,
sur 10/10 exécutions. Si l'hypothèse est fausse, on verra encore du flaky.

## 4. Preuve de confirmation

Expérience minimale :
```js
const debounced = debounce(() => console.log('fired'), 100);
for (let i = 0; i < 10; i++) debounced();
setTimeout(() => process.exit(0), 300);
```
Résultat attendu : "fired" apparaît exactement 1 fois, systématiquement.
Résultat observé sur 10/10 lancements : "fired" apparaît 1 fois. Confirmé.

## 5. Correction et vérification

- Correction : documenter dans la JSDoc que `debounce` doit être appelée
  UNE fois pour créer un débounceur, et NE PAS être rappelée pour chaque
  event. Ajouter un exemple dans le README. Le code de `debounce` est
  correct ; c'est son usage qui était bogué.
- Test de non-régression : `repro.test.js` qui construit UN débounceur,
  l'appelle 10 fois dans un burst, attend 200 ms, assert que `fn` a été
  appelée 1 fois exactement. Passe 10/10 fois.

## 6. Ce que j'ai appris

Le non-déterminisme n'était pas dans le CODE de `debounce` mais dans son
USAGE dans la codebase appelante. Prochaine fois : quand un module utilitaire
est incriminé, vérifier d'abord ses call-sites avant de le réécrire.
