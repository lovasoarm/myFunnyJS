/*
===========================================================
SCOPE ESCAPE ROOM — EXERCICES DE CLOSURE
===========================================================

Bienvenue dans la salle verrouillée du scope.

Objectif :
Comprendre réellement comment une closure (fonction qui garde en mémoire
les variables de son environnement) fonctionne.

Ici tu ne dois pas juste coder.
Tu dois réfléchir à :
- Qui garde quoi ?
- Quelle variable vit où ?
- Quelle variable disparaît ?

-----------------------------------------------------------
NIVEAU 1 — LE COFFRE SECRET
-----------------------------------------------------------

1) Crée une fonction createVault(secret)
2) À l’intérieur, stocke secret dans une variable locale
3) Retourne une fonction guess(password)
4) guess(password) doit :
   - comparer password avec secret
   - afficher "Access granted" ou "Access denied"

5) Crée deux coffres différents avec deux secrets différents
6) Teste-les

Question :
Pourquoi chaque coffre garde son propre secret ?
Où est stocké ce secret après la fin de createVault ?

-----------------------------------------------------------
NIVEAU 2 — LE PIÈGE DU COMPTEUR
-----------------------------------------------------------

1) Crée une fonction createLimitedCounter(limit)
2) À l’intérieur, crée une variable count = 0
3) Retourne une fonction qui :
   - incrémente count
   - si count dépasse limit, affiche "Limit reached"
   - sinon affiche la valeur actuelle

4) Crée deux compteurs avec deux limites différentes
5) Observe leur comportement

Question :
Pourquoi les deux compteurs ne partagent pas la même variable count ?

-----------------------------------------------------------
NIVEAU 3 — LA BOUCLE MAUDITE
-----------------------------------------------------------

Lis ce code :

for (var i = 1; i <= 3; i++) {
  setTimeout(function() {
    console.log("Door number:", i);
  }, 100);
}

Question :
Pourquoi toutes les portes affichent le même numéro ?

Ensuite :
Refais exactement la même chose avec let.

Question :
Qu’est-ce qui change au niveau de la mémoire ?
Qu’est-ce qui est recréé à chaque itération ?

-----------------------------------------------------------
MISSION FINALE
-----------------------------------------------------------

Explique avec tes mots :

- C’est quoi une closure ?
- C’est quoi function scope (portée fonction) ?
- C’est quoi block scope (portée bloc) ?
- Pourquoi var pose problème dans les boucles async (code exécuté plus tard) ?

Ne passe pas au chapitre suivant si tu ne comprends pas
qui garde quoi en mémoire.

*/

// Ton code ici
