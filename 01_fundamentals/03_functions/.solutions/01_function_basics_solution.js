// AVERTISSEMENT : solution de référence. Tu as coché les 4 cases du .solutions/README.md
// avant d'ouvrir ce fichier ? Sinon → ferme, retourne à l'exercice.

/* STOP.
   As-tu fini l'exercice sans regarder ?
   As-tu écrit ton propre exemple ?
   Peux-tu réexpliquer sans regarder ce fichier ?
   Si non, ferme ce fichier maintenant. */

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
