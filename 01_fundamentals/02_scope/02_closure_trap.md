# CLOSURE TRAP — FERMETURES & PIÈGES

Bienvenue dans le monde des **closures** : une fonction qui garde en mémoire les variables de son environnement, même après que la fonction parente soit terminée.

---

## 1) CLOSURE BASIQUE

```javascript
function makeCounter() {
  let count = 0; // variable locale à makeCounter
  return function () {
    count += 1;
    return count;
  };
}
```

Crée ton propre test et observe ce que retourne la fonction à chaque appel.

> À chaque appel de la fonction retournée, `count` persiste. Elle n'est pas réinitialisée : c'est la closure en action.

---

## 2) PIÈGE CLASSIQUE AVEC BOUCLE

```javascript
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log("i vaut :", i);
  }, 100);
}
```

Réfléchis avant de lancer. Que va afficher `i` ?

> `var` n'est pas block-scoped : toutes les fonctions dans la boucle partagent la **même** variable `i`. Au moment où les `setTimeout` s'exécutent, la boucle est déjà terminée : `i` vaut `4`.

---

## 3) COMMENT RÉSOUDRE

**Solution 1 : `let` à la place de `var` :**

```javascript
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log("i vaut :", i); // 1, 2, 3
  }, 100);
}
```

`let` est block-scoped : chaque itération crée sa propre variable `i`.

**Solution 2 : IIFE (fonction immédiatement appelée) pour capturer la valeur :**

```javascript
for (var i = 1; i <= 3; i++) {
  (function (j) {
    setTimeout(function () {
      console.log("j vaut :", j); // 1, 2, 3
    }, 100);
  })(i);
}
```

L'IIFE crée un nouveau scope à chaque itération et capture la valeur courante de `i` dans `j`.

> Teste les deux solutions et compare les résultats.

---

## POURQUOI C'EST CRUCIAL ?

- **Callbacks** : fonction passée pour être appelée plus tard
- **Event listeners** : fonction qui réagit à un événement
- **Async** : code qui s'exécute après un délai ou une promesse

Comprendre le piège te permet d'éviter des **bugs invisibles**. Les closures permettent aussi de créer des fonctions avec une "mémoire" privée et fiable.

---

# MISSION CLOSURE TRAP

## La Team Closure

1. Crée une fonction `makeTeam()` qui initialise un tableau vide `team`
2. Retourne une fonction `addPlayer(name)` qui ajoute un joueur au tableau et l'affiche
3. Crée **deux équipes distinctes** avec `makeTeam()`
4. Ajoute deux joueurs dans chaque équipe
5. Observe comment chaque fonction garde sa **propre mémoire** — c'est la closure
6. Refais un mini `for` loop avec `var` puis avec `let` pour voir le piège classique
7. Réfléchis : qui voit quoi en mémoire ?

> Comprends. Ne regarde pas juste le résultat. Réfléchis au scope.
