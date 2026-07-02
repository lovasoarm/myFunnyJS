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
EXO 1 : Liste Scalable
Crée dynamiquement 1000 <li> et optimise l'insertion.
Indice : DocumentFragment.
*/
const liste = document.querySelector("ul"); // cible dans le DOM
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i + 1}`; // contenu lisible
  li.style.color = "white";
  fragment.append(li);
}
liste.append(fragment); // injection unique



/*
EXO 2 : Event Delegation
Crée une liste dynamique. Un seul event listener doit gérer le clic sur n'importe quel item pour le supprimer.
Pas un listener par item. Un seul. Sur le parent.
*/
const ul = document.createElement("ul");
document.body.append(ul);

const newfragment = document.createDocumentFragment();
for (let i = 0; i < 5; i++) {
  let l = document.createElement("li");
  l.textContent = `liste ${i}`;
  let b = document.createElement("button");
  b.textContent = `X`;
  l.append(b);
  newfragment.append(l);
}
ul.append(newfragment);
ul.addEventListener("click", function (e) { // 1 listener sur ul plutôt que N listeners sur les boutons.
  if (e.target.matches("button")) {
    e.target.closest("li").remove(); //"pars de moi (le bouton), remonte dans les ancêtres, et donne-moi le premier <li> que tu trouves."
  }
});
// => mais ici, c'est pas grave si on utilise pas "fragment", c'est juste une ptite liste



/*EXO 3 : Toggle Architecturé
Crée un bouton qui toggle la classe "dark" sur le body. Contrainte : pas de manipulation style directe : uniquement classList.
*/
const b = document.createElement("button");
document.body.append(b);

b.addEventListener("click", function () {
  document.body.classList.toggle("dark"); // change le background en dark dans css si present
});



/*
EXO 4 : Form Control
Crée un formulaire avec ces contraintes :
Empêcher le submit si l'input est vide
Afficher un message d'erreur via le DOM
Pas d'alert()
Gestion propre du flux. */
// Créer les éléments
const form = document.createElement("form");

const inputNom = document.createElement("input");
inputNom.placeholder = "Ton nom"; //  placeholder, pas textContent

const inputAge = document.createElement("input");
inputAge.placeholder = "Ton âge"; // appliqué sur inputAge, pas inputNom

const submit = document.createElement("button");
submit.textContent = "Envoyer";
submit.type = "submit";

const erreur = document.createElement("p");
erreur.style.color = "red"; // message d'erreur visible

// Injecter dans le DOM
form.append(inputNom, inputAge, submit, erreur);
document.body.append(form);

// Écouter le submit du formulaire
form.addEventListener("submit", function (e) {
  e.preventDefault(); // stoppe le rechargement

  if (inputNom.value === "" || inputAge.value === "") {
    erreur.textContent = "Tous les champs sont obligatoires.";
    return; //  stoppe l'exécution
  }

  erreur.textContent = ""; // reset l'erreur
  console.log("Nom :", inputNom.value, "| Age :", inputAge.value);
});
// ### Le flux propre
// ```
// Submit déclenché
//        ↓
// preventDefault() → page ne recharge pas
//        ↓
// Champs vides ? → affiche erreur dans le DOM (pas d'alert)
//        ↓
// Tout rempli ?  → traite les données, reset l'erreur
