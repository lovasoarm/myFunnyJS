/*
===========================================================
FUNCTION BASICS — UNE FONCTION EST UN OBJET VIVANT
===========================================================

Arrête de croire qu’une fonction = juste du code.

En JavaScript, une fonction est un OBJET spécial.

Objet = une structure en mémoire qui peut contenir des données
et des comportements.

Donc une fonction c’est :

- Du code exécutable
- + un objet en mémoire
- + une référence (adresse mémoire)
- + des propriétés possibles

Oui. Une fonction peut avoir des propriétés.
Oui. Une fonction peut être stockée.
Oui. Une fonction peut être manipulée comme une variable.

C’est pour ça qu’on dit :
Les fonctions sont des "first-class citizens"
(valeurs traitées comme n’importe quelle autre valeur).

-----------------------------------------------------------
1) UNE FONCTION EST UNE VALEUR
-----------------------------------------------------------

function greet() {
  console.log("Hello");
}

Ce que tu crois :
greet = du code

Ce que JS fait vraiment :
greet → référence → objet fonction en mémoire

Donc si tu fais :

let copy = greet;

Tu ne copies pas le code.
Tu copies la référence (adresse mémoire).

Donc :

copy(); // Hello

Pourquoi ça marche ?

Parce que copy et greet pointent vers
le même objet fonction.

Même logique que les objets.

-----------------------------------------------------------
2) UNE FONCTION PEUT ÊTRE STOCKÉE
-----------------------------------------------------------

let actions = [];

actions.push(function() {
  console.log("Attack");
});

actions[0]();

Pourquoi ça marche ?

Parce qu’une fonction est une valeur.
Comme un nombre.
Comme une string.
Comme un objet.

-----------------------------------------------------------
3) UNE FONCTION PEUT ÊTRE PASSÉE EN ARGUMENT
-----------------------------------------------------------

function execute(fn) {
  fn();
}

execute(function() {
  console.log("Boom");
});

Ici, on passe une fonction à une autre fonction.

Ça s’appelle un callback
(fonction donnée à une autre fonction pour être exécutée plus tard).

C’est la base de :
- setTimeout
- événements
- promesses
- React
- middleware

-----------------------------------------------------------
4) UNE FONCTION PEUT RETOURNER UNE FONCTION
-----------------------------------------------------------

function outer() {
  return function() {
    console.log("Inside");
  };
}

let fn = outer();
fn();

Ici :

outer crée une nouvelle fonction
et la retourne.

Chaque appel peut créer une nouvelle fonction.
Chaque fonction peut capturer un environnement
(environnement lexical = zone mémoire autour d’elle).

Et là tu entres dans le monde des closures.

-----------------------------------------------------------
5) UNE FONCTION PEUT AVOIR DES PROPRIÉTÉS
-----------------------------------------------------------

function power() {}

power.level = 9000;

console.log(power.level); // 9000

Pourquoi ?

Parce qu’une fonction est un objet.

Et les objets peuvent avoir des propriétés.

Donc techniquement :

function test() {}

est presque équivalent à :

let test = new Function();

(simplifié mentalement)

-----------------------------------------------------------
6) CE QUI SE PASSE EN MÉMOIRE
-----------------------------------------------------------

Quand tu écris :

function attack() {}

JS fait :

1) Crée un objet fonction en mémoire
2) Crée une variable attack
3) Met la référence de l’objet dedans

Donc :

attack → adresse → objet fonction

Si tu fais :

let a = attack;

Tu obtiens :

a → même adresse → même objet

Ce n’est pas une copie.
C’est un pointeur (référence mémoire).

-----------------------------------------------------------
7) POURQUOI C’EST CRUCIAL ?
-----------------------------------------------------------

Parce que :

- Les callbacks reposent dessus
- Les closures reposent dessus
- Les hooks React reposent dessus
- Les middlewares reposent dessus
- L’architecture JS moderne repose dessus

Si tu comprends que les fonctions sont des objets,
tu comprends pourquoi JS est flexible.

Si tu ne comprends pas ça,
tu subis le langage.

===========================================================
MISSION FUNCTION BASICS
===========================================================

La Team Functions.

1) Crée une fonction attack() qui affiche "Slash"
2) Copie-la dans une variable move
3) Exécute move()
4) Ajoute une propriété damage = 50 à attack
5) Affiche attack.damage
6) Crée un tableau skills et mets attack dedans
7) Exécute la fonction depuis le tableau
8) Copie attack dans une autre variable et vérifie si
   attack === move (réfléchis à la référence)

Objectif :
Comprendre qu’une fonction est un objet
qui vit en mémoire.

Ne regarde pas juste le résultat.
Réfléchis à la référence.
*/
function attack() {
  console.log("Slash");
}
let move = attack;
move();
attack.damage = 50;
console.log(attack.damage);
let skills = [];
skills.push(attack);
skills[0]();
let otherVariable = attack;
if (attack === move && move === otherVariable) {
  console.log("yes");
}
