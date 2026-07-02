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

/*
EXO 1 : le module de camp
Walking Dead. Tu construis camp.js : le module de gestion du camp de Rick.

State interne : liste de survivants, niveau de munitions, niveau de nourriture.

Interface publique :

ajouterSurvivant(nom) : ajoute si pas déjà présent
consommerRessources(type, quantite) : "munitions" ou "nourriture", ne descend pas sous 0
getStatsCamp() : retourne une copie de l'état (pas la référence directe)
estEnDanger() : retourne true si munitions < 10 OU nourriture < 5
Contrainte : les tableaux et valeurs internes ne sont jamais exposés directement.
*/
// dans camp.js:
const _survivors = [];
let _munition = 10; // valeur par défaut
let _food = 20; // niveau de nourriture (nombre, pas tableau)

export const getSurvivors = () => [..._survivors]; // copie pour ne pas exposer
export const addSurvivor = (nom) => {
  if (!_survivors.includes(nom)) _survivors.push(nom);
};
export const getMunition = () => _munition;
export const consumeMunition = (qte) => {
  _munition = Math.max(0, _munition - qte); // avec Math.max (ex: _munition = Math.max(0, -5) = 0   //bloque à 0)
};
export const getFood = () => _food;
export const consumeFood = (qte) => {
  _food = Math.max(0, _food - qte);
};

export default {
  getSurvivors,
  addSurvivor,
  getMunition,
  consumeMunition,
  getFood,
  consumeFood,
};

//dans interface.js
import camp from "./camp.js";

export const ajouterSurvivant = (nom) => {
  const survivants = camp.getSurvivors();
  if (!survivants.includes(nom)) {
    camp.addSurvivor(nom);
  }
};

export const consommerRessources = (type, quantite) => {
  if (type === "munitions") {
    const munitionsActuelles = camp.getMunition();
    if (quantite <= munitionsActuelles) {
      camp.consumeMunition(quantite);
    }
  } else if (type === "nourriture") {
    const nourritureActuelle = camp.getFood();
    if (quantite <= nourritureActuelle) {
      camp.consumeFood(quantite);
    }
  }
};
