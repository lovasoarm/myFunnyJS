# HIGH ORDER FUNCTIONS : MAP & FILTER

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

processUser("Link", greet); // Hello Link
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

| Méthode  | Ce qu'elle fait           | Taille du résultat     |
| -------- | ------------------------- | ---------------------- |
| `map`    | transforme chaque élément | identique à l'original |
| `filter` | garde selon une condition | inférieure ou égale    |

---

## 4) POURQUOI C'EST CRUCIAL

- Code **plus court, plus lisible**, moins de boucles `for` manuelles
- Parfait pour manipuler des collections : joueurs, scores, produits, utilisateurs...
- C'est la base du style **fonctionnel** en JS : et de tout ce que tu feras en React

> Maîtriser `map` et `filter`, c'est passer de "je subis les tableaux" à "je les plie à ma volonté".

---

# MISSION MAP / FILTER

## La Team MapFilter

1. Crée un tableau `players` avec 3 objets `{ name, hp }`
2. Utilise `map` pour créer un nouveau tableau avec le **double** des hp de chaque joueur
3. Utilise `filter` pour ne garder que les joueurs avec `hp > 100`
4. Affiche les résultats à chaque étape

```javascript
// Ton code ici
```

> `map` et `filter` retournent toujours de **nouveaux tableaux** : l'original ne bouge pas. Si tu modifies l'original, tu fais quelque chose de travers.
