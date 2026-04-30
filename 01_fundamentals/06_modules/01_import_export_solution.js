/*
EXO 1 : le village de Konoha
Tu as trois fichiers à créer :
ninjas.js : exporte une liste de ninjas (objets avec nom, rang, clan)
filtres.js : exporte deux fonctions : une pour filtrer par rang, une pour filtrer par clan
main.js : importe tout, affiche les Jonin du clan Uchiha
Contrainte : main.js ne contient aucune logique de filtrage. Tout ça vit dans filtres.js.
*/

// Dans listes.js : 
const listes = [
  { nom: "Kakashi", rang: "Jonin", clan: "Hatake" },
  { nom: "Sasuke", rang: "Chunin", clan: "Uchiha" },
  { nom: "Itachi", rang: "Jonin", clan: "Uchiha" }
]
export default listes //toujours à la fin

// Dans filtres.js
//faut comparer avec la valeur que tu veux
export const filteredByRange = (ninjas, rangCible) => ninjas.filter((n) => n.rang === rangCible)
export const filteredByClan = (ninjas, clanCible) => ninjas.filter((n) => n.clan === clanCible)

//Dans main.js
import listes from "./ninjas.js"
import { filteredByRange, filteredByClan } from "./filtres.js"
const joninUchiha = filteredByClan(filteredByRange(listes, "Jonin"), "Uchiha")
console.log(joninUchiha)
