/*
===========================================================
SCOPE BASICS — GLOBAL, LOCAL, BLOCK
===========================================================

Bienvenue dans le royaume des portées.

En JS, **la portée** (scope) définit **où une variable existe et peut être vue**.

----------------------------------
1) GLOBAL SCOPE
----------------------------------

Une variable globale vit **partout dans ton code**.

Exemple :

let globalVar = "Je suis partout";

function printGlobal() {
  console.log(globalVar); // accessible 
}

printGlobal();
console.log(globalVar); // accessible aussi 

Mais attention : trop de global = chaos assuré

---

----------------------------------
2) LOCAL SCOPE (FUNCTION)
----------------------------------

Une variable locale n’existe **que dans la fonction** où elle a été déclarée.

Exemple :

function myFunc() {
  let localVar = "Je suis local";
  console.log(localVar); // OK
}

myFunc();
console.log(localVar); //  ReferenceError, introuvable

---

----------------------------------
3) BLOCK SCOPE (if, for, while)
----------------------------------

`let` et `const` respectent le **scope du bloc** :

if (true) {
  let blockVar = "Je vis ici";
  console.log(blockVar); //  OK
}
console.log(blockVar); //  ReferenceError, fini le bloc

- `var` ignore le block, se comporte comme **function scope**
- `let` et `const` = safe, suivent le bloc

---

----------------------------------
4) POURQUOI C’EST CRUCIAL ?
----------------------------------

- Évite de polluer le global
- Préviens les bugs où une variable change sans prévenir
- Permet de gérer correctement les closures et async
- Base pour comprendre les patterns avancés et l’architecture JS

===========================================================
MISSION SCOPE BASICS
===========================================================

La Team Scope.

1) Crée une variable globale `hero` = "Link"
2) Crée une fonction `adventure()` qui crée une variable locale `weapon` = "Sword"
3) Dans la fonction, affiche `hero` et `weapon`
4) Hors de la fonction, essaie d’afficher `weapon` → Observe l’erreur
5) Crée un `if (true)` et à l’intérieur déclare `let potion = "Health"`
6) Essaie d’afficher `potion` hors du bloc → Observe l’erreur

Comprends bien : **scope = zone de vie de ta variable**.  
C’est la base avant de te lancer dans les closures, context et event loop.
*/

let hero = "Link";

function adventure() {
  let weapon = "Sword";
  console.log("Dans la fonction:", hero, weapon);
}

adventure();

console.log(weapon); // indispo

if (true) {
  let potion = "health";
}

console.log(potion); // indispo

// A retenir, var → fonction ou global, ignore les {}
