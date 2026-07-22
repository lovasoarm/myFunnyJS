// scenario_2_double_post.js : le POST part deux fois.
// Symptome cote debugger aveugle : "une commande cree deux entrees en base,
// mais uniquement quand l'utilisateur clique sur le bouton, pas via l'API directe".

'use strict';

function attachSubmit(button, sendRequest) {
  // Bug : on abonne le handler A CHAQUE render sans jamais retirer l'ancien.
  // Apres deux renders, le clic declenche 2 POST. Apres N renders : N POST.
  function onClick(event) {
    event.preventDefault();
    sendRequest();
  }
  button.addEventListener('click', onClick);
  // Pas de cleanup : les listeners s'accumulent.
  return function render() {
    button.addEventListener('click', onClick);
  };
}

module.exports = { attachSubmit };
