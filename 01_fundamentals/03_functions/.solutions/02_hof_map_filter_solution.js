/* STOP.
   As-tu fini l'exercice sans regarder ?
   As-tu écrit ton propre exemple ?
   Peux-tu réexpliquer sans regarder ce fichier ?
   Si non, ferme ce fichier maintenant. */

let players = [
  { name: "boby", hp: 100 },
  { name: "elonmusk", hp: 200 },
  { name: "ronaldo", hp: 10 },
];
let hpSquared = players.map((player) => player.hp * 2);
let hpFiltered = players.filter((player) => player.hp > 100);
console.log(hpSquared);
console.log(hpFiltered);
