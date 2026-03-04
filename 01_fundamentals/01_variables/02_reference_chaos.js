/*
===========================================================
LE CHAOS DES RÉFÉRENCES
===========================================================

On va aller plus profond.

Quand tu fais :

let arr1 = [1, 2, 3];
let arr2 = arr1;

Tu ne copies PAS le tableau.

Tu copies l'adresse mémoire.

Donc :

arr2.push(4);

Va aussi modifier arr1.

Pourquoi ?

Parce que arr1 et arr2 pointent vers
le MÊME tableau en mémoire.

----------------------------------
MÉMOIRE SIMPLIFIÉE
----------------------------------

Variable → adresse → objet

Ce n’est pas :
Variable → objet

C’est :
Variable → pointeur → objet

Si deux variables pointent au même endroit,
elles contrôlent la même chose.

----------------------------------
COMMENT COPIER VRAIMENT ?
----------------------------------

Pour un tableau :

let newArr = [...arr1];

Pour un objet :

let newObj = { ...obj1 };

Mais attention :
ça fait une copie superficielle (shallow copy).

Si l’objet contient un objet à l’intérieur,
la référence interne reste partagée.

Et là… chaos total.

----------------------------------
POURQUOI C’EST CRUCIAL ?
----------------------------------

En React.
En Node.
En backend.
En architecture.
En performance.

Si tu ne maîtrises pas ça,
tu vas créer des bugs invisibles.

===========================================================
MISSION CHAOS
===========================================================

La Team Mutante.

1) Crée un tableau "team" avec 3 joueurs {name, hp}
2) Crée une variable "shadowTeam" qui copie team DIRECTEMENT
3) Enlève 50 hp au premier joueur via shadowTeam
4) Affiche team et shadowTeam

Ensuite :

5) Crée une vraie copie avec spread operator
6) Modifie le deuxième joueur
7) Observe la différence

Comprends.
Ne regarde pas juste le résultat.
Réfléchis à la mémoire.
*/

let team = [
  { name: "Alpha", hp: 100 },
  { name: "Beta", hp: 100 },
  { name: "Gamma", hp: 100 },
];
