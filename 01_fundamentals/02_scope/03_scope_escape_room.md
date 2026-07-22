---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# SCOPE ESCAPE ROOM : LA PORTE EST FERMÉE. LE CODE EST LA CLÉ.
Temps de lecture ~7 min

> Ici tu ne codes pas juste. Tu réfléchis.
> Qui garde quoi ? Quelle variable vit où ? Laquelle disparaît... ou fait semblant ?

---

## 1) NIVEAU 1 : LE COFFRE SECRET

### Instructions

1. Crée une fonction `createVault(secret)`
2. Stocke `secret` dans une variable locale
3. Retourne une fonction `guess(password)` qui compare `password` avec `secret`
4. Affiche `"Access granted"` ou `"Access denied"`
5. Crée deux coffres avec deux secrets différents et teste-les

### Code de départ

```js
// Résultat attendu :
const vault1 = createVault("dragon");
const vault2 = createVault("unicorn");

vault1("dragon"); // Access granted
vault1("unicorn"); // Access denied
vault2("unicorn"); // Access granted
vault2("dragon"); // Access denied
```

> **Question :** Pourquoi chaque coffre garde son propre secret après la mort de `createVault` ?
>
> `createVault` est morte, but `secret` survit dans la closure --> comme un fantôme utile. Chaque appel crée son propre environnement mémoire isolé.

---

## 2) NIVEAU 2 : LE PIÈGE DU COMPTEUR

### Instructions

1. Crée `createLimitedCounter(limit)` avec `count = 0` à l'intérieur
2. Retourne une fonction qui incrémente `count`
3. Si `count > limit` --> affiche `"Limit reached"`, sinon affiche la valeur
4. Crée deux compteurs avec deux limites différentes
5. Observe qu'ils ne se contaminent pas

### Résultat attendu

```js
const counter1 = createLimitedCounter(2);
const counter2 = createLimitedCounter(4);

counter1(); // 1
counter1(); // 2
counter1(); // Limit reached
counter2(); // 1 <-- pas de contamination
counter2(); // 2
```

> **Question :** Pourquoi `counter1` et `counter2` ont chacun leur propre `count` ?
>
> Chaque appel à `createLimitedCounter` crée un nouvel environnement en mémoire. Deux appels = deux boîtes séparées. Elles ne se voient pas.

---

## 3) NIVEAU 3 : LA BOUCLE MAUDITE

Lis ce code. **Ne le lance pas encore. Réfléchis d'abord.**

```js
for (var i = 1; i <= 3; i++) {
 setTimeout(function () {
  console.log("Door number:", i);
 }, 100);
}
```

> **Question :** Qu'est-ce qui s'affiche et pourquoi ?
>
> `var` n'est pas block-scoped. Toutes les fonctions partagent la **même** variable `i`. La boucle finit avant que les `setTimeout` s'exécutent --> `i` vaut déjà `4`. Toutes les portes s'ouvrent sur la même pièce vide.

**Résultat :**
```
Door number: 4
Door number: 4
Door number: 4
```

**Maintenant corrige avec `let` :**

```js
for (let i = 1; i <= 3; i++) {
 setTimeout(function () {
  console.log("Door number:", i);
 }, 100);
}
```

> `let` crée une nouvelle variable `i` à chaque itération. Chaque `setTimeout` capture sa propre copie. Chaque porte a enfin son propre numéro.

**Résultat :**
```
Door number: 1
Door number: 2
Door number: 3
```

---

## 4) MISSION FINALE : EXPLIQUE SANS REGARDER TES NOTES

Réponds à ces quatre questions avec tes propres mots. Si tu bloques sur une, relis le module avant de continuer.

1. C'est quoi une **closure** ?
2. C'est quoi le **function scope** ?
3. C'est quoi le **block scope** ?
4. Pourquoi `var` pose problème dans les boucles **async** ?

### Réponses minimales attendues

**Closure** : Une fonction qui se souvient des variables de son environnement extérieur, même après que la fonction parente soit terminée. Elle garde une référence mémoire, pas une copie.

**Function scope** : Une variable déclarée avec `var` vit dans toute la fonction. Pas dans le bloc, pas dans le `if`, pas dans la boucle --> toute la fonction. Elle n'est pas accessible en dehors.

**Block scope** : Une variable déclarée avec `let` ou `const` vit uniquement dans le bloc `{}` où elle est créée. Elle meurt à la fermeture du bloc.

**`var` en async** : `var` a une portée fonction : toutes les itérations partagent la même variable. Quand le code async s'exécute plus tard, la boucle est déjà finie et la variable a sa valeur finale. Résultat : toutes les callbacks lisent la même valeur. Avec `let`, chaque itération a sa propre variable --> chaque callback lit la bonne.

---

> Ne passe pas au module suivant si tu ne peux pas reformuler ces quatre réponses sans regarder. Le scope c'est la fondation. Rater ça, c'est construire une maison sur du sable... qui est aussi en feu.

---

## RÉSUMÉ

Le scope d'une variable définit sa zone de vie. `let` et `const` : portée bloc. `var` : portée fonction, ce qui casse les boucles async et les closures imbriquées.

Une closure est une fonction qui garde une référence vivante à ses variables parentes : pas une copie. Deux closures créées par deux appels séparés ont des environnements mémoire séparés.

`var` dans une boucle async partage une seule variable entre toutes les itérations. `let` crée une variable distincte par itération. C'est la différence entre un bug subtil et du code prévisible.
