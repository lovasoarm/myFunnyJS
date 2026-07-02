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

let team = [
  { name: "Alpha", hp: 100 },
  { name: "Beta", hp: 100 },
  { name: "Gamma", hp: 100 },
];
let shadowTeam = team; //meme adresse memoire que team
shadowTeam[0].hp -= 50;
console.log(team);
console.log(shadowTeam);

let shadowTeam2 = [...team]; // meme adresse mémoire que team
shadowTeam2[1].hp -= 12;
console.log(shadowTeam2);

//Si on veut modifier uniquement un truc sans affectation (Deep copie)
let something = team.map((player) => ({ ...player }));
something[2].hp -= 12;
console.log(something);
