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
MISSION PRIMITIVES
Crée une variable score = 50
Copie-la dans bestScore
Change bestScore à 100
Vérifie si score change
Ensuite :
Crée un objet player = { hp: 100 }
Copie-le dans clone
Modifie clone.hp
Observe la différence
*/
let score = 50;
let bestScore = score;
bestScore = 100;
console.log(score); // 50 ← inchangé : copie par valeur

let player = { hp: 100 };
let clone = player;
clone.hp = 50;
console.log(player); // { hp: 50 } ← modifié aussi : même objet en mémoire
console.log(clone);  // { hp: 50 } ← deux noms, une seule boîte
