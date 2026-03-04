console.log("10" + 5);
console.log("10" - 5); //forcing calcul
console.log(true + 1); //true s'évalue à 1
console.log(false + 1); //false s'évalue en 0

console.log(null == 0); // false ? null est seulement égal à undefined en comparaison lâche. Mais null ne devient PAS 0.
console.log(null == undefined);
console.log(null === undefined); //pas le meme type

let input = "0";
if (input) {
  console.log("quelquechose");
}
