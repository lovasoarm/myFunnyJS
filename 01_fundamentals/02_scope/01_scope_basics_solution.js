let hero = "Link";

function adventure() {
  let weapon = "Sword";
  console.log("Dans la fonction:", hero, weapon);
}

adventure();

console.log(weapon); // indispo

if (true) {
  let potion = "health";
}

console.log(potion); // indispo

// A retenir, var → fonction ou global, ignore les {}
/*
var :
*Pas de block scope
*Hoisting confus((mécanisme où la déclaration est déplacée en haut du scope par le moteur JS).)
*Partage la même variable en boucle
*Permet redéclaration : 
var x = 1;
var x = 2; // autorisé
*Facilite la pollution globale
*/
