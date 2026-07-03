/* STOP.
   As-tu fini l'exercice sans regarder ?
   As-tu écrit ton propre exemple ?
   Peux-tu réexpliquer sans regarder ce fichier ?
   Si non, ferme ce fichier maintenant. */

console.log("10" + 5);  // "105" ← string : + avec une string = concaténation
console.log("10" - 5);  // 5    ← number : - force le calcul numérique
console.log(true + 1);  // 2    ← true s'évalue à 1 donc 1 + 1 = 2
console.log(false + 1); // 1    ← false s'évalue à 0 donc 0 + 1 = 1

console.log(null == 0);          // false ← null n'est égal qu'à undefined en comparaison lâche
console.log(null == undefined);  // true
console.log(null === undefined); // false ← pas le même type

let input = "0";
if (input) {
  console.log("truthy"); // s'exécute : "0" est une string non vide → truthy
}
