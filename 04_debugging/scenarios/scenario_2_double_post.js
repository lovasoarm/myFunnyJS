// Bug : le POST part deux fois. Le serveur cree deux ressources identiques,
// l'utilisateur voit une ligne en double dans sa liste.
// Symptome : reseau montre deux requetes POST identiques a 40 ms d'ecart.

let submitting = false;

async function onSubmit(payload) {
  // Piege 1 : `submitting` est set APRES le await, donc le double-clic passe.
  // Piege 2 : le handler est branche deux fois (form.addEventListener x2 ailleurs).
  const res = await fetch('/api/things', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  submitting = true;
  return res.json();
}

// Fix attendu : verrou pose AVANT le await, libere dans un finally,
// et handler branche une seule fois (verifier avec grep addEventListener).

module.exports = { onSubmit };
