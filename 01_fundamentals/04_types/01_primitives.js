/*
===========================================================
PRIMITIVES — LES TYPES FONDAMENTAUX EN JS
===========================================================

En JavaScript, il existe 2 grandes catégories de types :

1) Les types primitifs
2) Les types objets

Aujourd’hui on parle des primitifs.

Un type primitif = une valeur simple, immuable
(immuable = on ne peut pas modifier la valeur interne)

Quand tu changes une primitive,
tu crées une nouvelle valeur en mémoire.

-----------------------------------------------------------
LES 7 TYPES PRIMITIFS
-----------------------------------------------------------

1) string
2) number
3) boolean
4) undefined
5) null
6) bigint
7) symbol

Oui. 7. Pas 6.

-----------------------------------------------------------
1) STRING
-----------------------------------------------------------

let name = "Blob";

Une string = du texte.
Elle est immuable.

Exemple :

let text = "Hi";
text[0] = "B"; // ça ne marche pas

Les primitives ne se modifient pas directement.

-----------------------------------------------------------
2) NUMBER
-----------------------------------------------------------

let hp = 100;
let price = 19.99;

En JS il n’existe qu’un seul type number
(pas int, pas float séparé).

Attention :
NaN = Not a Number
Infinity existe aussi.

-----------------------------------------------------------
3) BOOLEAN
-----------------------------------------------------------

let isAlive = true;

Seulement true ou false.

-----------------------------------------------------------
4) UNDEFINED
-----------------------------------------------------------

let x;
console.log(x); // undefined

undefined = variable déclarée mais sans valeur.

-----------------------------------------------------------
5) NULL
-----------------------------------------------------------

let y = null;

null = absence volontaire de valeur.

Différence simple :

undefined = JS n’a rien mis
null = toi tu as mis "rien"

-----------------------------------------------------------
6) BIGINT
-----------------------------------------------------------

let big = 12345678901234567890n;

Pour les très grands nombres.
Ajoute un "n" à la fin.

-----------------------------------------------------------
7) SYMBOL
-----------------------------------------------------------

let id = Symbol("id");

Type unique utilisé pour créer des clés uniques dans les objets.

Avancé, mais important en architecture.

-----------------------------------------------------------
PRIMITIVE VS OBJET
-----------------------------------------------------------

Primitif :

let a = 10;
let b = a;

b = 20;

console.log(a); // 10

Pourquoi ?

Parce que les primitives sont copiées par valeur
(valeur copiée directement).

Objet :

let obj1 = { hp: 100 };
let obj2 = obj1;

obj2.hp = 50;

console.log(obj1.hp); // 50

Pourquoi ?

Parce que les objets sont copiés par référence
(adresse mémoire partagée).

-----------------------------------------------------------
POURQUOI C’EST CRUCIAL ?
-----------------------------------------------------------

- Comprendre les comparaisons (== vs ===)
- Comprendre la coercion (conversion automatique de type)
- Comprendre les bugs liés aux références
- Base pour maîtriser la mémoire en JS

===========================================================
MISSION PRIMITIVES
===========================================================

1) Crée une variable score = 50
2) Copie-la dans bestScore
3) Change bestScore à 100
4) Vérifie si score change

Ensuite :

5) Crée un objet player = { hp: 100 }
6) Copie-le dans clone
7) Modifie clone.hp
8) Observe la différence

Comprends : primitive = copie réelle
objet = copie référence

La mémoire décide tout.
*/
