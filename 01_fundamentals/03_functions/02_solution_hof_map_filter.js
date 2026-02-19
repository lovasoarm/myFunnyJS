/*
===========================================================
HIGH ORDER FUNCTIONS — MAP & FILTER
===========================================================

Bienvenue dans le labo des fonctions qui manipulent des fonctions.

----------------------------------
1) HIGH ORDER FUNCTION (HOF)
----------------------------------

Une HOF c’est **une fonction qui prend une autre fonction en argument ou retourne une fonction**.  

En gros : fonctions = jouets que tu peux donner à d’autres fonctions.

Exemple simple :

function greet(name) {
  return "Hello " + name;
}

function processUser(user, fn) {
  console.log(fn(user));
}

processUser("Link", greet); 
// Affiche "Hello Link"

Ici :
- `processUser` = HOF
- `greet` = fonction que tu passes
- HOF = super-pouvoir pour manipuler du code facilement

----------------------------------
2) MAP
----------------------------------

`map` transforme **chaque élément** d’un tableau et retourne un **nouveau tableau**.  

Exemple :

let numbers = [1, 2, 3];
let squared = numbers.map(x => x * x);
console.log(squared); // [1, 4, 9]

Points clés :
- **map ne change pas le tableau original** (créé un nouveau tableau)
- prend une fonction en argument
- transforme chaque élément selon ta fonction

----------------------------------
3) FILTER
----------------------------------

`filter` garde uniquement les éléments qui passent un test et retourne un nouveau tableau.

Exemple :

let points = [10, 5, 8, 3];
let highScores = points.filter(p => p >= 8);
console.log(highScores); // [10, 8]

Points clés :
- filter = tri selon condition
- crée un **nouveau tableau**
- tableau original = intact

----------------------------------
4) POURQUOI C’EST CRUCIAL
----------------------------------

- Te permet de coder plus **proprement et court**
- Idéal pour manipuler des collections de données (tableaux d’objets, scores, joueurs…)
- C’est le **truc de base pour devenir un dev moderne**  

----------------------------------
MISSION MAP/FILTER
----------------------------------

La Team MapFilter :

1) Crée un tableau `players` avec des objets `{name, hp}` pour 3 joueurs.
2) Utilise `map` pour créer un nouveau tableau avec le double de leurs hp.
3) Utilise `filter` pour ne garder que les joueurs avec hp > 100.
4) Affiche les résultats à chaque étape.

Comprends bien : **map et filter = nouveaux tableaux, original intact.**
*/
let players = [
  { name: "boby", hp: 100 },
  { name: "elonmusk", hp: 200 },
  { name: "ronaldo", hp: 10 },
];
let hpSquared = players.map((player) => player.hp * 2);
let hpFiltered = players.filter((player) => player.hp > 100);
console.log(hpSquared);
console.log(hpFiltered);
