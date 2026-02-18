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
//NIVEAU 1 — LE COFFRE SECRET
function createVault(secret) {
  // ça c'est du type closure
  let theSecret = secret;
  return function guess(password) {
    let access = theSecret === password;
    if (access) {
      console.log("Acces granted");
    } else {
      console.log("Access denied");
    }
  };
}
let coffre1 = createVault("blob");
coffre1("blob");
let coffre2 = createVault("grinch");
coffre2("blob");
//Conclusion :
/*1) À chaque appel :
Une nouvelle exécution de la fonction
Une nouvelle variable theSecret
Un nouvel environnement en mémoire (contexte d’exécution)

Donc :
coffre1 garde une référence vers SON theSecret
coffre2 garde une référence vers SON theSecret

Même si la fonction retournée s’appelle guess dans les deux cas,
elles ne partagent pas la même mémoire.

 2) Normalement, quand une fonction finit, ses variables locales sont supprimées.
MAIS.
Si une fonction interne utilise encore ces variables,
JavaScript ne les supprime pas.
Pourquoi ?
Parce que la fonction retournée (guess) en a encore besoin.

exemple avec globale : 
let theSecret;
function createVault(secret){
  theSecret = secret;
  return function guess(password){
    console.log(theSecret === password);
  }
}
=> Maintenant il n’y a qu’une seule variable theSecret. Si on fait :
let coffre1 = createVault("blob");
let coffre2 = createVault("grinch");
=> Boom. Coffre1 a perdu son secret. coffre1("blob");   // false
coffre1("grinch"); // true => coffre1 est ecrasé par "grinch"

RESUME: closure :
Appel 1 → nouvelle boîte
Appel 2 → nouvelle boîte
global :
Appel 1 → même boîte
Appel 2 → même boîte (écrase)
*/

// NIVEAU 2 — LE PIÈGE DU COMPTEUR
function createLimitedCounter(limit) {
  let count = 0;
  return function counter() {
    count++;
    if (count > limit) {
      console.log("Limit reached");
    } else {
      console.log(count);
    }
  };
}
let counter1 = createLimitedCounter(5);
let counter2 = createLimitedCounter(6);
counter1();
counter2();
/* conclusion : Les deux compteurs ne partagent pas count parce que chaque appel à createLimitedCounter crée un nouvel environnement en mémoire, et la fonction retournée garde une référence à son environnement spécifique grâce à la closure.
Appel 1 → nouvelle boîte
Appel 2 → nouvelle boîte
Chaque boîte a son propre count.
*/

//NIVEAU 3 — LA BOUCLE MAUDITE
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log("Door number:", i);
  }, 100);
}
/* Question :
Pourquoi toutes les portes affichent le même numéro ?
=> var a une function scope (portée limitée à la fonction, pas au bloc {})
*Il n’y a qu’une seule variable i
*La boucle finit son travail
*i devient 4
*Ensuite les callbacks (fonction exécutée plus tard) s’exécutent
*Ils lisent la valeur actuelle de i
*Donc → 4, 4, 4,(var ne crée pas une nouvelle variable par itération. Il réutilise la même. Avec let, chaque tour crée une nouvelle variable.)
GLOBAL ENVIRONMENT
│
├── i  ───────────────► 4
│
└── setTimeout callback (x3)
         │
         └── référence vers i (la même)


Ensuite : avec let.
Question :
Qu’est-ce qui change au niveau de la mémoire ?
=> Avec let, JavaScript crée un nouvel environnement de bloc (zone mémoire liée au {}) à chaque itération.
Qu’est-ce qui est recréé à chaque itération ?
=> *Une nouvelle variable i
*Un nouvel environnement de bloc
*Une nouvelle référence capturée par la closure 
Iteration 1:
BLOCK ENV #1
└── i ─────► 1
     ↑
   callback #1 capture CETTE référence

Iteration 2:
BLOCK ENV #2
└── i ─────► 2
     ↑
   callback #2 capture CETTE référence

Iteration 3:
BLOCK ENV #3
└── i ─────► 3
     ↑
   callback #3 capture CETTE référence

*/

//MISSION FINALE
/*
- C’est quoi une closure ?
=> Une fonction qui se souvient des variables autour d’elle. Même si la fonction qui les a créées est finie.Elle ne copie pas la valeur.
Elle garde la référence mémoire (l’adresse de la variable en RAM).

- C’est quoi function scope (portée fonction) ?
=> Une variable déclarée avec var vit dans toute la fonction.
Pas dans le bloc.
Pas dans le if.
Pas dans la boucle.
->Toute la fonction.
Mais elles ne sont pas accessibles en dehors de cette fonction.
function test(){
   if(true){
      var x = 10;
   }
}
x existe partout dans la fonction. Même si tu l’as déclarée dans un if.

- C’est quoi block scope (portée bloc) ?
=> Une variable déclarée avec let ou const existe seulement dans le bloc où elle est créée.
if(true){
   let x = 10;
}
Ici, x meurt à la fin des {}

- Pourquoi var pose problème dans les boucles async (code exécuté plus tard) ?
=> var pose problème dans les boucles async parce qu'il a une portée fonction, ce qui signifie que toutes les itérations de la boucle partagent la même variable. Lorsque le code asynchrone s'exécute plus tard, il accède à la valeur actuelle de cette variable, qui a été modifiée par la boucle. Cela conduit souvent à des résultats inattendus, comme dans l'exemple de la boucle maudite où toutes les portes affichent le même numéro.
 
RESUME:
*Closure → une fonction qui garde une boîte mémoire.
*Function scope → var vit dans toute la fonction.
*Block scope → let vit seulement dans {}.
*Var en async → une seule variable partagée → chaos.
*/

//BONUS : this:
/*
Function normale → this = l’objet qui appelle la fonction
Arrow function → this = le this de l’extérieur (hérité)
Global / simple appel → this = undefined (mode strict) ou window (non strict)

ex:
let user = {
  name: "Blob",
  sayName: function() {
    console.log("Normal function:", this.name);
  },
  sayNameArrow: () => {
    console.log("Arrow function:", this.name);
  }
};

user.sayName();        // Normal function: Blob
user.sayNameArrow();   // Arrow function: undefined (this hérité du global)

Conclusion: Ici, sayNameArrow est écrit dans l’objet user, mais… l’objet n’est pas un scope lexical, c’est juste une structure.
Donc le this de l’arrow function pointe en fait sur le contexte extérieur, qui est le global (ou undefined en mode strict).

*/
