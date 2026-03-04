/*
===========================================================
CLOSURE TRAP — FERMETURES & PIÈGES
===========================================================

Bienvenue dans le monde des closures (fonction qui garde en mémoire les variables de son environnement même après que la fonction initiale soit terminée).

----------------------------------
1) CLOSURE BASIQUE
----------------------------------

function makeCounter() {
  let count = 0; // variable locale à la fonction makeCounter
  return function() {
    count += 1;
    return count;
  }
}

// Ici tu devras créer ton propre test et observer ce que retourne la fonction

---

----------------------------------
2) PIÈGE CLASSIQUE AVEC BOUCLE
----------------------------------

for (var i = 1; i <= 3; i++) {
  setTimeout(function() {
    // Que va afficher i ici ? (indice : var n’est pas block scoped, pense à la portée)
    console.log("i vaut :", i);
  }, 100);
}

// Réfléchis avant de lancer le code. Pourquoi toutes les fonctions pourraient voir la même valeur ?

---

----------------------------------
3) COMMENT RÉSOUDRE (TU DEVRAIS TESTER PAR TOI-MÊME)
----------------------------------

- Essaie avec let au lieu de var dans la boucle  
- Essaie avec une fonction immédiatement appelée (IIFE) pour capturer la valeur

---

----------------------------------
POURQUOI C’EST CRUCIAL ?
----------------------------------

- Les closures sont partout : callbacks (fonction passée pour être appelée plus tard), event listeners (fonction qui réagit à un événement), async (code qui s’exécute plus tard)  
- Comprendre le piège te permet d’éviter des bugs invisibles  
- Permet de créer des fonctions avec “mémoire” de manière fiable

===========================================================
MISSION CLOSURE TRAP
===========================================================

La Team Closure.

1) Crée une fonction makeTeam() qui initialise un tableau vide team
2) Retourne une fonction addPlayer(name) qui ajoute un joueur au tableau et affiche le tableau
3) Crée deux équipes distinctes avec makeTeam()
4) Ajoute deux joueurs dans chaque équipe
5) Observe comment chaque fonction garde sa propre mémoire (closure)
6) Ensuite, refais un mini-for loop avec var et let pour voir le piège classique
7) Réfléchis : qui voit quoi en mémoire ?

*/
