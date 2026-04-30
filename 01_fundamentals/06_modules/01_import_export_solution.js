// Dans listes.js : 
const listes = [
  { nom: "Kakashi", rang: "Jonin", clan: "Hatake" },
  { nom: "Sasuke", rang: "Chunin", clan: "Uchiha" },
  { nom: "Itachi", rang: "Jonin", clan: "Uchiha" }
]
export default listes //toujours à la fin
// dans filtres.js
//faut comparer avec la valeur que tu veux
export const filteredByRange = (ninjas, rangCible) => ninjas.filter((n) => n.rang === rangCible)
export const filteredByClan = (ninjas, clanCible) => ninjas.filter((n) => n.clan === clanCible)
//Dans main.js
import listes from "./ninjas.js"
import { filteredByRange, filteredByClan } from "./filtres.js"
const joninUchiha = filteredByClan(filteredByRange(listes, "Jonin"), "Uchiha")
console.log(joninUchiha)
