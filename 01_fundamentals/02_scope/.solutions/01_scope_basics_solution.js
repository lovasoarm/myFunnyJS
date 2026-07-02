/* STOP.
   As-tu fini l'exercice sans regarder ?
   As-tu écrit ton propre exemple ?
   Peux-tu réexpliquer sans regarder ce fichier ?
   Si non, ferme ce fichier maintenant. */
<!-- ====================================================== -->
<!-- STOP. AVERTISSEMENT FORT. NE LIS PAS SANS AVOIR ESSAYÉ. -->
<!-- CHECKLIST AVANT DE LIRE -->
<!-- As-tu terminé l'exercice sans regarder ? -->
<!-- As-tu écrit un exemple personnel ? -->
<!-- Peux-tu réexpliquer le concept sans le code ? -->
<!-- Si non, referme ce fichier et essaie encore. -->
<!-- ====================================================== -->

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
