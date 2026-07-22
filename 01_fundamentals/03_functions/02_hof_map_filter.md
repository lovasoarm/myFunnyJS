---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# HIGH ORDER FUNCTIONS : MAP & FILTER
Temps de lecture ~6 min

Bienvenue dans le labo des fonctions qui manipulent des fonctions. _(Fonctionception.)_

---

## 1) HIGH ORDER FUNCTION (HOF)

Une HOF, c'est **une fonction qui prend une autre fonction en argument, ou qui en retourne une**.

En gros : les fonctions sont des jouets que tu peux donner à d'autres fonctions.

```javascript
function greet(name) {
 return "Hello " + name;
}

function processUser(user, fn) {
 console.log(fn(user));
}

processUser("Naruto", greet); // Hello Naruto
```

Ici :

- `processUser` est la **HOF**
- `greet` est la fonction passée en argument
- Résultat : du code modulaire, réutilisable, et beaucoup moins répétitif

> Les HOF sont partout en JS : `setTimeout`, `addEventListener`, `map`, `filter`, `reduce`... Tu les utilisais déjà sans le savoir.

---

## 2) MAP

`map` **transforme chaque élément** d'un tableau et retourne un **nouveau tableau**.

```javascript
let numbers = [1, 2, 3];
let squared = numbers.map((x) => x * x);

console.log(squared); // [1, 4, 9]
console.log(numbers); // [1, 2, 3] ← intact
```

Points clés :

- `map` ne **jamais** modifie le tableau original
- prend une fonction en argument : c'est elle qui décide la transformation
- retourne toujours un tableau de **même longueur**

> Pense à `map` comme une chaîne de montage : chaque élément passe par ta fonction et ressort transformé de l'autre côté.

---

## 3) FILTER

`filter` **garde uniquement les éléments** qui passent un test et retourne un nouveau tableau.

```javascript
let points = [10, 5, 8, 3];
let highScores = points.filter((p) => p >= 8);

console.log(highScores); // [10, 8]
console.log(points); // [10, 5, 8, 3] ← intact
```

Points clés :

- `filter` = un videur à l'entrée du club : il ne laisse passer que ceux qui passent la condition
- retourne un tableau potentiellement **plus court** que l'original
- tableau original **toujours intact**

| Méthode | Ce qu'elle fait       | Taille du résultat   |
| -------- | ---------------------------- | ---------------------- |
| `map`  | transforme chaque élément  | identique à l'original |
| `filter` | garde selon une condition  | inférieure ou égale  |
| `reduce` | accumule en une seule valeur | n'importe quoi     |

---

## 4) REDUCE

`reduce` **accumule tous les éléments** en une seule valeur de sortie. Cette valeur peut être un nombre, une string, un objet, un tableau : n'importe quoi.

```javascript
let scores = [10, 5, 8, 3];
let total = scores.reduce((acc, score) => acc + score, 0);

console.log(total); // 26
```

Anatomie :
- `acc` = l'accumulateur : la valeur en cours de construction
- `score` = l'élément courant du tableau
- `0` = la valeur de départ de l'accumulateur

```
tour 1 : acc=0, score=10 → acc devient 10
tour 2 : acc=10, score=5 → acc devient 15
tour 3 : acc=15, score=8 → acc devient 23
tour 4 : acc=23, score=3 → acc devient 26
résultat : 26
```

> `reduce` c'est un entonnoir : tout rentre, une seule chose sort. C'est le couteau suisse des trois : ce que `map` et `filter` ne peuvent pas faire seuls, `reduce` s'en charge.

---

## 5) POURQUOI C'EST CRUCIAL

- Code **plus court, plus lisible**, moins de boucles `for` manuelles
- Parfait pour manipuler des collections : joueurs, scores, jutsus, utilisateurs...
- C'est la base du style **fonctionnel** en JS : et de tout ce que tu feras en React

> Maîtriser ces trois HOF, c'est passer de "je subis les tableaux" à "je les plie à ma volonté".

---

## MISSION MAP / FILTER / REDUCE

## La Team HOF

1. Crée un tableau `players` avec 4 objets `{ name, hp }`
2. Utilise `map` pour créer un tableau avec le **double** des hp de chaque joueur
3. Utilise `filter` pour ne garder que les joueurs avec `hp > 100`
4. Utilise `reduce` pour calculer le **total de hp** de toute la team
5. Affiche les résultats à chaque étape

```javascript
// Ton code ici
```

> Les trois retournent toujours de **nouvelles valeurs** : l'original ne bouge pas. Si tu modifies l'original, tu fais quelque chose de travers.

---

## RÉSUMÉ

`map` transforme chaque élément et retourne un nouveau tableau de même taille. `filter` garde les éléments qui passent le test et retourne un tableau plus petit ou égal. `reduce` accumule tout en une seule valeur.

Les trois ne mutent jamais l'original. Si tu touches l'original à l'intérieur d'un `map`, tu fais quelque chose de travers.

`map + filter` enchaînés créent deux tableaux intermédiaires. Si la perf compte, `reduce` peut tout faire en un seul passage.
