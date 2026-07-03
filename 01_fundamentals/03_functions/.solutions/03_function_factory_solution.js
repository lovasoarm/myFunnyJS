// AVERTISSEMENT : solution de référence. Tu as coché les 4 cases du .solutions/README.md
// avant d'ouvrir ce fichier ? Sinon → ferme, retourne à l'exercice.

/* STOP.
   As-tu fini l'exercice sans regarder ?
   As-tu écrit ton propre exemple ?
   Peux-tu réexpliquer sans regarder ce fichier ?
   Si non, ferme ce fichier maintenant. */

function makeWeapon(name, damage) {
  return function useWeapon() {
    console.log(name + " attaque avec " + damage + " de degats");
  };
}
let arme1 = makeWeapon("dragonov", 200);
let arme2 = makeWeapon("magnum", 400);
arme1();
arme2();

let armes = [
  { name: "katana", damage: 100 },
  { name: "AKA", damage: 400 },
  { name: "bazooka", damage: 999 },
];
let armeFunctions = armes.map((arme) => makeWeapon(arme.name, arme.damage));
console.log(armeFunctions);

armeFunctions.forEach((fn) => fn());
