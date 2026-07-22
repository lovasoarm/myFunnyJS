---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# SCOPE : OÙ VIT TA VARIABLE ?
Temps de lecture ~7 min

> Chaque variable a une zone de vie. En dehors de cette zone, elle n'existe plus. Elle est morte. ReferenceError (erreur de référence : variable inexistante). Game over.

---

## 1) GLOBAL SCOPE : LA VARIABLE QUI TRAÎNE PARTOUT

Elle est déclarée dehors, elle vit partout. Toutes les fonctions peuvent la voir.

```js
let hero = "Naruto";

function adventure() {
 console.log(hero); // "Naruto" : accessible depuis la fonction
}

adventure();
console.log(hero); // "Naruto" : accessible dehors aussi
```

> Trop de globales = n'importe qui peut modifier n'importe quoi. C'est le chaos de la colocation où tout le monde touche à tout.

---

## 2) LOCAL SCOPE : CE QUI SE PASSE DANS LA FONCTION RESTE DANS LA FONCTION

Une variable déclarée dans une fonction meurt quand la fonction se termine.

```js
function adventure() {
 let weapon = "Sword"; // vit ici et nulle part ailleurs
 console.log(weapon); // OK
}

adventure();
console.log(weapon); // ReferenceError : weapon est morte
```

---

## 3) BLOCK SCOPE : `let` et `const` Respectent les `{}`

Un bloc c'est tout ce qui est entre `{}` : `if`, `for`, `while`.

```js
if (true) {
 let potion = "Health"; // vit dans ce bloc uniquement
 console.log(potion);  // OK
}

console.log(potion); // ReferenceError : le bloc est terminé
```

**Mais `var` s'en fout des blocs :**

```js
if (true) {
 var ghost = "Je fuis partout";
}

console.log(ghost); // "Je fuis partout" : var ignore le bloc
```

| Mot-clé | Scope | Safe ? |
| ------- | ----- | ------ |
| `var`  | function scope : ignore les `{}` | nope |
| `let`  | block scope : respecte les `{}` | ok  |
| `const` | block scope : respecte les `{}` | ok  |

> Règle d'or : `var` n'existe pas dans ton vocabulaire. `let` et `const` seulement.

---

## 4) POURQUOI C'EST CRUCIAL

Sans scope control :
- Une variable globale se fait écraser sans prévenir
- Un bug dans une boucle contamine tout le reste
- Les closures (fonctions qui capturent leur environnement lexical) et l'async (programmation asynchrone : exécution de code différée sans bloquer le thread principal) deviennent un enfer

Avec scope control : chaque variable vit exactement là où elle doit vivre. Pas plus loin.

---

## Comparaison multi-langages

| Concept | JavaScript | Python | Dart | PHP |
| ------- | ---------- | ------ | ---- | --- |
| Variable globale | `let x` hors fonction | `x = 42` hors fonction | `var x` hors classe | `$x` hors fonction |
| Variable locale | `let x` dans une fonction | `x = 42` dans une fonction | `var x` dans une fonction | `$x` dans une fonction |
| Block scope | `let` / `const` | pas natif | oui par défaut | oui avec `{}` |
| Mot-clé à éviter | `var` | . | . | . |
| Constante | `const` | . | `final` / `const` | `define()` / `const` |
| Erreur hors scope | `ReferenceError` | `NameError` | erreur de compilation | `Undefined variable` |
| Niveau de rigueur | flexible | permissif | strict | semi-strict |

---

## MISSION : La Zone Interdite

### Instructions

1. Déclare une variable globale `hero = "Naruto"`
2. Crée une fonction `adventure()` avec une variable locale `weapon = "Sword"`
3. Dans la fonction : affiche `hero` et `weapon`
4. Hors de la fonction : essaie d'afficher `weapon` → observe l'erreur
5. Crée un `if (true)` avec `let potion = "Health"` à l'intérieur
6. Hors du bloc : essaie d'afficher `potion` → observe l'erreur

### Code de départ

```js
let hero = "Naruto";

function adventure() {
 let weapon = "Sword";
 console.log("Dans la fonction :", hero, weapon);
}

adventure();
// Ton code ici
```

### Résultat attendu

```
Dans la fonction : Naruto Sword
ReferenceError: weapon is not defined  <-- hors fonction
ReferenceError: potion is not defined  <-- hors bloc
```

> **Scope = zone de vie de ta variable.** C'est la base de tout ce qui vient après : closures, async, architecture.

---

## RÉSUMÉ

Le scope (portée) définit où une variable est accessible. Une variable déclarée dans une fonction n'existe que dans cette fonction. Une variable déclarée dans un bloc `{}` avec `let` ou `const` n'existe que dans ce bloc.

`var` a une portée fonction, pas bloc : elle remonte à la fonction parente même si déclarée dans un `if` ou une boucle. C'est un piège classique.

Le scope global est la dernière chose à laquelle JS fait appel. Si une variable n'est pas trouvée dans le scope local, puis le scope parent, JS remonte jusqu'au global. Si elle n'est nulle part : `ReferenceError`.


---

## (attention) Ce que l'analogie "colocation" cache

L'analogie suggère un espace partagé où chacun touche à tout. En réalité, le scope JS suit des **règles lexicales strictes** : les variables sont accessibles là où elles sont **déclarées**, pas là où elles sont **appelées**. La colocation cache la notion de chaîne de portées imbriquées. Retiens le mécanisme : **résolution lexicale**, pas "on partage tout".
