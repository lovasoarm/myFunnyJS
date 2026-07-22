---
stability: intemporel
---

# EXO : Reproduction déterministe d'un bug flaky

-> ~45 min

## OBJECTIF

Prendre un bug qui apparaît "de temps en temps" et le transformer en test
qui échoue **à chaque exécution**. Tant que tu n'as pas ça, tu ne peux
pas fixer, tu peux juste espérer.

## ÉNONCÉ

Utilise le fichier `flaky.js` ci-dessous (ou tout bug intermittent de ta
propre codebase). Trouve la source de non-déterminisme (horloge, ordre
de promise, entropie, ordre de clés d'objet, cache, réseau) et écris
un test qui la reproduit à 100 %.

```js
// flaky.js : race condition intentionnelle
async function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
```

## LIVRABLES

1. `HYPOTHESES.md` (utilise `HYPOTHESES_TEMPLATE.md`).
2. `repro.test.js` qui échoue 10/10 fois avant le fix.
3. Un commit "fix" qui fait passer le test 10/10 fois.
4. Une note de 5 lignes : "d'où venait le non-déterminisme".

## CRITÈRE DE RÉUSSITE

`node --test repro.test.js` échoue 10/10 avant le fix, passe 10/10 après.
Zéro seed aléatoire caché, zéro `sleep(500)` qui prie.


## EXEMPLE DE LIVRABLE

Voir [`HYPOTHESES_EXEMPLE_REPRO_DETERMINISTE.md`](./15_HYPOTHESES_EXEMPLE_REPRO_DETERMINISTE.md) : un `HYPOTHESES.md` rempli sur ce même exercice. À ouvrir APRÈS ta propre tentative, pour calibrer.
