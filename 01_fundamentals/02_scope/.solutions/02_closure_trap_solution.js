/* STOP.
   As-tu fini l'exercice sans regarder ?
   As-tu écrit ton propre exemple ?
   Peux-tu réexpliquer sans regarder ce fichier ?
   Si non, ferme ce fichier maintenant. */

/*
CORRECTION : CLOSURE TRAP
Objectif :
- Voir comment une fonction garde en mémoire ses variables locales même après son exécution (closure)
- Observer le piège classique de var dans les boucles
*/

function makeTeam() {
  // team = tableau qui va stocker les joueurs, local à makeTeam
  let team = [];

  // addPlayer = fonction qui peut accéder à team même après makeTeam
  return function addPlayer(name) {
    team.push(name);
    console.log("Équipe actuelle :", team);
  };
}

// Crée deux équipes distinctes
let alphaTeam = makeTeam();
let betaTeam = makeTeam();

// Ajoute des joueurs dans alphaTeam
alphaTeam("Link");
alphaTeam("Zelda");

// Ajoute des joueurs dans betaTeam
betaTeam("Mario");
betaTeam("Luigi");

// Chaque équipe garde son tableau propre grâce aux closures
// alphaTeam et betaTeam ont leur propre "team" en mémoire


// Mini-for loop pour observer le piège var vs let :
//VAR
console.log("Boucle avec var :");
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log("var loop i :", i);
    // var n’est pas limité au bloc, toutes les fonctions voient la même i après la boucle
  }, 100);
}
//Conclusion : var i → function scope (portée de la fonction, pas limitée au {} de la boucle)
//La boucle s’exécute vite, i passe de 1 à 4 avant que le setTimeout ne s’exécute

//LET
console.log("Boucle avec let :");
for (let j = 1; j <= 3; j++) {
  setTimeout(function () {
    console.log("let loop j :", j);
    // let est limité au bloc, chaque fonction garde la valeur correcte de j
  }, 100);
}

/*RESUME (Attention):
Phase 1 : la boucle s'exécute entièrement, sans attendre :
Tour 1 : crée j_1 = 1, enregistre le setTimeout → passe au suivant immédiatement
Tour 2 : crée j_2 = 2, enregistre le setTimeout → passe au suivant immédiatement
Tour 3 : crée j_3 = 3, enregistre le setTimeout → fin de boucle
Les trois setTimeout sont enregistrés quasi simultanément. JavaScript n'attend pas le délai pour continuer.

Phase 2 : 100ms plus tard, les trois callbacks s'exécutent :
Le callback du tour 1 se réveille, cherche son j → il a capturé j_1 qui vaut toujours 1 → affiche 1
Le callback du tour 2 se réveille, cherche son j → il a capturé j_2 qui vaut toujours 2 → affiche 2
Le callback du tour 3 se réveille, cherche son j → il a capturé j_3 qui vaut toujours 3 → affiche 3
*/

//Conclusion : let j → une nouvelle variable j est créée pour chaque tour de boucle, même si le nom est le même

/*
| Déclaration | Scope          | Boucle                          | Résultat `setTimeout`                       |
| ----------- | -------------- | ------------------------------- | ------------------------------------------- |
| `var i`     | function scope | 1 variable pour toute la boucle | toutes fonctions voient **le même i final** |
| `let j`     | block scope    | 1 variable **par itération**    | chaque fonction voit **son propre j**       |

*/
