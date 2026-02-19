/*
===========================================================
FUNCTION FACTORY — USINE À FONCTIONS
===========================================================

Ici, on va créer des fonctions **qui fabriquent d'autres fonctions**.
C’est comme une machine à clones de zombies mais version JS.

----------------------------------
1) Qu’est-ce qu’une function factory ?
----------------------------------

Une function factory est une **fonction qui retourne une autre fonction**.
Ça permet de créer plein de fonctions similaires sans réécrire le code.

Exemple :

function makePlayer(name, hp) {
  return function attack() {
    console.log(`${name} attaque avec ${hp} hp!`);
  }
}

let bobyAttack = makePlayer("Boby", 100);
let elonAttack = makePlayer("Elon", 200);

bobyAttack();  // Boby attaque avec 100 hp!
elonAttack();  // Elon attaque avec 200 hp!

----------------------------------
2) Pourquoi c’est puissant ?
----------------------------------

- Chaque fonction garde **sa propre mémoire** (closure)
- Tu peux créer des fonctions **sur mesure** pour chaque objet
- Tu évites de polluer ton scope global avec plein de fonctions redondantes
- Très utile pour les patterns comme factories, builders, listeners, etc.

----------------------------------
3) Termes techniques (facile)
----------------------------------

- **Closure** : fonction qui “se souvient” des variables de son parent même après sa fin.
- **Factory** : fonction qui produit des fonctions (ou objets) à la demande.

===========================================================
MISSION FACTORY
===========================================================

La Team Factory.

1) Crée une fonction `makeWeapon(name, damage)` qui retourne une fonction `useWeapon()` 
   qui affiche : "NomDeLArme attaque avec X points de dégâts".
2) Crée 2 armes avec `makeWeapon` et teste les attaques.
3) Ensuite, fais une mini usine : crée un tableau de noms d’armes et utilise `map` pour générer un tableau de fonctions armes.
4) Teste toutes les armes en boucle et observe comment chaque fonction garde son propre nom et damage.

Astuce : **chaque fonction créée est un clone indépendant**. Même si tu modifies un clone, les autres restent intacts.  
*/
