// Bug : ce "debounce" ne debounce rien. Il appelle fn a chaque frappe.
// Symptome cote appelant : la fonction se declenche 12 fois pour 12 touches
// tapees en 200 ms, alors qu'on attendait UN seul appel apres 300 ms de silence.

function debounce(fn, delay) {
  // Piege : le timer est local a chaque appel. Il n'y a rien a annuler entre deux
  // invocations, donc chaque frappe programme son propre setTimeout independant.
  return function (...args) {
    const timer = setTimeout(() => fn.apply(this, args), delay);
    return timer;
  };
}

// Fix attendu : sortir `timer` du closure retourne, et clearTimeout(timer)
// au debut de chaque appel avant de reprogrammer.

module.exports = { debounce };
