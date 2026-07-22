---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# CLOSURE TRAP : LA FONCTION QUI N'OUBLIE JAMAIS
Temps de lecture ~8 min

> Une closure c'est une fonction qui garde en mémoire les variables de son environnement, même après que la fonction parente soit morte et enterrée. Comme un fantôme utile.

> **Où l'analogie casse** : un fantôme narratif reste "vivant" par principe, indéfiniment. Une closure, non : elle vit tant que quelque chose la référence encore (une variable, un handler, un timer). Dès que plus rien ne pointe dessus, le garbage collector la balaye : plus de closure, plus de variables capturées, terminé. On reverra ça froidement dans `08_memory_performance/` avec le GC. Retenir : la closure est un mécanisme précis du moteur (référence vers l'environnement lexical), pas une entité magique.

---

## 1) CLOSURE BASIQUE : LE COMPTEUR IMMORTEL

```js
function makeCounter() {
 let count = 0; // variable locale : normalement elle mourrait ici
 return function () {
  count += 1;
  return count;
 };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

`makeCounter` est terminée. Mais `count` survit --> la fonction retournée la garde en mémoire. C'est ça une closure : une fonction avec une boîte mémoire privée.

> Crée un deuxième compteur `counter2 = makeCounter()` et observe qu'il repart de 0. Deux appels = deux boîtes séparées.

---

## 2) LE PIÈGE CLASSIQUE : `var` DANS UNE BOUCLE ASYNC

```js
for (var i = 1; i <= 3; i++) {
 setTimeout(function () {
  console.log("i vaut :", i);
 }, 100);
}
```

**Réfléchis avant de lancer. Que va afficher `i` ?**

```
i vaut : 4
i vaut : 4
i vaut : 4
```

`var` n'est pas block-scoped. Toutes les fonctions partagent la **même** variable `i`. La boucle finit avant que les `setTimeout` s'exécutent -> `i` vaut déjà `4`. Toutes les callbacks lisent la même valeur.

```
GLOBAL ENV
|-- i ------------> 4
     ^
  callback #1 -------|
  callback #2 -------| <-- toutes pointent sur le même i
  callback #3 -------|
```

---

## 3) COMMENT RÉSOUDRE

**Solution 1 : `let` à la place de `var` :**

```js
for (let i = 1; i <= 3; i++) {
 setTimeout(function () {
  console.log("i vaut :", i); // 1, 2, 3
 }, 100);
}
```

`let` crée une nouvelle variable `i` à chaque itération. Chaque callback capture sa propre copie.

```
BLOCK ENV #1 --> i = 1 <-- callback #1 capture ça
BLOCK ENV #2 --> i = 2 <-- callback #2 capture ça
BLOCK ENV #3 --> i = 3 <-- callback #3 capture ça
```

**Solution 2 : IIFE pour capturer la valeur :**

```js
for (var i = 1; i <= 3; i++) {
 (function (j) {
  setTimeout(function () {
   console.log("j vaut :", j); // 1, 2, 3
  }, 100);
 })(i);
}
```

L'IIFE crée un nouveau scope à chaque itération et capture la valeur courante de `i` dans `j`. Vieux pattern, mais utile à comprendre.

---

## 4) POURQUOI LES CLOSURES C'EST PUISSANT ?

Les closures c'est pas juste un concept à connaître pour les entretiens. C'est ce qui fait fonctionner :

- Les **callbacks** : la fonction se souvient du contexte où elle a été créée
- Les **event listeners** : chaque listener garde accès à ses variables locales
- Les **modules** : mémoire privée sans classes, sans global
- Tout l'**async** de JS : promises, setTimeout, fetch

Si tu rates les closures, tu rates la moitié de comment JS fonctionne réellement.

---

## Comparaison multi-langages

| Concept | JavaScript | Python | Dart | PHP |
|---|---|---|---|---|
| Closure native | `function` retourne une `function` | `def` imbriqué | fonctions imbriquées | depuis PHP 5.3 avec `use` |
| Capture de variable | automatique | automatique | automatique | manuelle avec `use ($var)` |
| Piège boucle + async | `var` partage la même référence | pas de `var`, moins de piège | `let` block-scoped par défaut | peu pertinent, pas d'event loop natif |
| Solution recommandée | `let` ou IIFE | `default arg` dans la lambda | `let` par défaut | `use` explicite |
| Niveau de piège | élevé : `var` est silencieux | faible | faible | moyen : `use` oublié = bug |

---

## MISSION : La Team Closure

### Instructions

1. Crée `makeTeam()` qui initialise un tableau vide `team`
2. Retourne une fonction `addPlayer(name)` qui ajoute un joueur et affiche le tableau
3. Crée **deux équipes distinctes** avec `makeTeam()`
4. Ajoute deux joueurs dans chaque équipe
5. Observe que chaque équipe garde sa propre mémoire
6. Refais un mini `for` with `var` puis `let` --> observe la différence

### Code de départ

```js
function makeTeam() {
 // ton code ici
}

const alphaTeam = makeTeam();
const betaTeam = makeTeam();

// Ajoute des joueurs ici
```

### Résultat attendu

```
// alphaTeam
Équipe : ["Naruto"]
Équipe : ["Naruto", "Sakura"]

// betaTeam
Équipe : ["Sasuke"]
Équipe : ["Sasuke", "Kakashi"]

// alphaTeam non contaminée
alphaTeam toujours : ["Naruto", "Sakura"]

// boucle var
i vaut : 4
i vaut : 4
i vaut : 4

// boucle let
i vaut : 1
i vaut : 2
i vaut : 3
```

> Deux appels à `makeTeam()` = deux boîtes mémoire séparées. C'est exactement ça une closure.

---

## RÉSUMÉ

Une closure est une fonction qui garde accès aux variables de son environnement parent, même après que la fonction parente soit terminée. Elle ne copie pas les valeurs : elle garde une référence vivante.

Le piège classique avec `var` dans les boucles async : toutes les closures partagent la même variable `i` qui vaut sa valeur finale au moment de l'exécution. Avec `let`, chaque itération crée sa propre variable.

Deux appels à la même factory = deux closures séparées = deux environnements mémoire distincts. Jamais partagés.


## Schéma : chaîne de portée en action

```
+-----------------------------------------------+
| GLOBAL env                  |
|  makeCounter (fn)              |
|  +---------------------------------------+  |
|  | makeCounter() env           |  |
|  |  count = 0              |  |
|  |  +-------------------------------+  |  |
|  |  | inner() env (returned)    |  |  |
|  |  |  [[Scope]] -> makeCounter env|  |  |
|  |  |       -> GLOBAL env   |  |  |
|  |  +-------------------------------+  |  |
|  +---------------------------------------+  |
+-----------------------------------------------+
```

Quand `inner` est appelée plus tard, sa `[[Scope]]` maintient vivant l'environnement `makeCounter()`. C'est **ça**, la closure. Pas de la magie, juste des références qui refusent de mourir.

### Ce que l'analogie cache

On dit "closure = fonction qui se souvient". Faux. La closure, c'est le **couple** (fonction, environnement). Sans l'environnement, ce n'est qu'une fonction.


> ATTENTION - ou cette analogie casse :
> les analogies mecaniquement sensibles (prototype, closure, event loop, reference vs copie)
> creent de faux modeles si on les prend trop loin. Consulte ce court aide-memoire :
>
> - **prototype != clone** : `Object.create(p)` ne COPIE pas p, il LIE dessus. Modifier p impacte l'enfant.
> - **closure != variable capturee** : la closure capture la REFERENCE au binding, pas la valeur au moment de la creation.
> - **event loop != file simple** : microtasks drainent COMPLETEMENT entre chaque macrotask - pas un round-robin.
> - **reference != alias** : `let b = a; b = {...}` ne mute pas a. `b.x = 1` mute a si a est objet.

---

## Ou l'analogie casse (closure)

Garde-fou epistemologique : l'analogie seduisante est utile a l'entree, dangereuse a la sortie.
Ce tableau liste les endroits **precis** ou l'analogie courante trompe.

| Analogie courante | Ou elle casse |
|-------------------|---------------|
| "Une closure = une fonction" | Non : c est **la paire (fonction, environnement lexical)**. Deux fonctions peuvent partager le meme environnement. |
| "La closure copie les valeurs" | Elle **capture les references** aux bindings. `var` dans une boucle sans `let` = piege classique. |
| "Closure = fuite memoire" | Faux en general ; la fuite vient d une **reference qui traine**, pas de la closure en soi. |

Regle : si tu ne peux pas nommer *une* case ou ton analogie casse, tu ne l'as
pas encore comprise ; tu l'as juste memorisee.
