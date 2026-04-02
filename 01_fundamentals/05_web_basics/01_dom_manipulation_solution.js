//EXO 1 — Liste scalable
const liste = document.querySelector("ul"); // cible dans le DOM
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i + 1}`; // contenu lisible
  li.style.color = "white";
  fragment.append(li);
}
liste.append(fragment); // injection unique

//EXO 2 — Event Delegation
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
ul.addEventListener("click", function (e) {
  if (e.target.matches("button")) {
    e.target.closest("li").remove();
  }
});
// => mais ici, c'est pas grave si on utilise pas "fragment", c'est juste une ptite liste

// EXO 3 — Toggle Architecturé
const b = document.createElement("button");
document.body.append(b);

b.addEventListener("click", function () {
  document.body.classList.toggle("dark"); // change le background en dark dans css si present
});

// EXO 4 — Form Control
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
