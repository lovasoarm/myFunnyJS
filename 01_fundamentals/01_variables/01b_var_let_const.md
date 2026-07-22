---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# 01b : var / let / const : trois portes, trois pièges
Temps de lecture ~5 min

Trois mots-clés. Un seul survit en 2026 sur du code neuf : `const`. Les deux autres, faut les connaître pour lire le code des autres.

## Le tableau qui tue

| Mot-clé | Scope    | Réassignable | Hoisting        | Verdict     |
|---------|--------------|--------------|-------------------------|-----------------|
| `var`  | fonction   | oui     | hoisted, init `undefined` | legacy, évite |
| `let`  | bloc `{}`  | oui     | hoisted, TDZ      | quand ça bouge |
| `const` | bloc `{}`  | non     | hoisted, TDZ      | par défaut   |

TDZ = Temporal Dead Zone. Lire avant la déclaration → `ReferenceError`. C'est voulu.

## Piège classique

```js
for (var i = 0; i < 3; i++) {
 setTimeout(() => console.log(i), 0)
}
// Affiche 3, 3, 3
```

Avec `let`, tu obtiens 0, 1, 2. Pourquoi ? Chaque itération crée un nouveau binding.

## Ce que l'analogie cache

On dit souvent "const = valeur figée". Faux. `const` fige le **binding**, pas la valeur. `const arr = []; arr.push(1)` marche. Le tableau n'est pas gelé, seul le nom l'est.

## Mission

Retape la boucle `setTimeout` avec `var` puis avec `let`. Prédis avant de lancer.
