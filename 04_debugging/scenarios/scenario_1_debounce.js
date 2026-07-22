// scenario_1_debounce.js : le "debounce" ne debounce pas.
// Symptome cote debugger aveugle : "chaque frappe declenche l'appel, comme si
// le delai etait ignore". Le tenant du code voit le fichier, le debugger non.

'use strict';

function debounce(fn, delay) {
  // Bug : le timer est declare LOCAL a chaque appel, jamais partage.
  // Resultat : rien n'est jamais annule, chaque appel programme son propre timeout.
  return function (...args) {
    let timer = null;
    timer = setTimeout(() => fn.apply(this, args), delay);
    return timer;
  };
}

// Repro : appelle log 5 fois de suite en < 200ms, log s'affichera 5 fois.
const log = debounce((x) => console.log('call', x), 200);
if (require.main === module) {
  for (let i = 0; i < 5; i++) log(i);
}

module.exports = { debounce };
