console.log("10" + 5); //105
console.log("10" - 5); //forcing calcul -> 5
console.log(true + 1); //true s'évalue à 1 donc 1+1 = 2
console.log(false + 1); //false s'évalue en 0 donc 1+0 = 1

console.log(null == 0); // false ? null est seulement égal à undefined en comparaison lâche. Mais null ne devient PAS 0.
console.log(null == undefined); //true
console.log(null === undefined); //pas le meme type -> false

let input = "0";
if (input) {
  console.log("quelquechose"); //true -> string non-vide
}
