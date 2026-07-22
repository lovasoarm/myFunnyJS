---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# SCOPE GLOSSARY : Les Mots Que Tu Dois Maîtriser
Temps de lecture ~7 min

> Si tu ne comprends pas ces mots, tu ne comprends pas vraiment comment JavaScript exécute ton code.

Le scope détermine **qui** peut accéder à une variable et **où** elle existe dans le programme.

---

| Terme | Définition | Code | Analogies |
|---|---|---|---|
| **Scope** | Zone dans laquelle une variable est accessible | `let x = 10;` `function fn() { console.log(x); }` `fn(); // 10` | Une maison avec des pièces : une variable dans une pièce n'existe pas dans une autre / Un badge d'accès : tu entres seulement là où ton badge fonctionne |
| **Global Scope** | Environnement principal : variables accessibles partout dans le programme | `let hero = "Naruto";` `function show() { console.log(hero); }` `show(); // Naruto` | Le couloir principal de l'immeuble : tout le monde y passe / La salle commune d'une auberge : accessible à tous |
| **Local Scope** | Scope limité à une fonction : la variable meurt à la fin de la fonction | `function fn() { let secret = "hidden"; }` `console.log(secret); // ReferenceError` | Ta chambre d'hôtel : personne d'autre n'y entre / Le bureau d'un employé : ses affaires restent dans son bureau |
| **Block Scope** | Scope créé par un bloc `{}` avec `let` ou `const` : `var` l'ignore | `if (true) { let potion = "Health"; }` `console.log(potion); // ReferenceError` | Un casier de vestiaire : ce qui est dedans reste dedans / Une salle de réunion réservée : ce qui s'y dit ne sort pas |
| **Lexical Scope** | Le scope dépend de l'endroit où la fonction est **écrite**, pas où elle est **appelée** | `function outer() { let x = "O"; function inner() { console.log(x); } inner(); }` `outer(); // "O"` | Un enfant garde l'accent de la ville où il a grandi, peu importe où il vit maintenant / Un document garde le tampon du bureau où il a été signé |
| **Closure** | Fonction qui se souvient des variables de son environnement extérieur même après la mort de la fonction parente | `function makeCounter() { let count = 0; return function() { count++; return count; }; }` `const c = makeCounter(); c(); // 1` | Un cuisinier qui quitte un restaurant mais garde toutes ses recettes / Un enfant qui part de chez ses parents mais garde les habitudes de la maison |
| **Scope Chain** | Chaîne de scopes remontée par JS pour trouver une variable : actuel --> parent --> global | `let g = "G"; function outer() { let o = "O"; function inner() { console.log(g, o); } inner(); }` `outer(); // G O` | Un employé qui cherche un document : bureau perso --> bureau du manager --> archives / Un enfant qui demande à sa mère, qui demande à la grand-mère |
| **Variable Shadowing** | Variable locale qui masque une variable du scope parent avec le même nom | `let name = "Global"; function fn() { let name = "Local"; console.log(name); }` `fn(); // Local` `console.log(name); // Global` | Un homonyme dans la même entreprise : le local prend le dessus / Un panneau de rue local qui recouvre l'ancienne indication |
| **Hoisting** | Déclarations de variables et fonctions déplacées en haut du scope avant exécution | `console.log(x); // undefined` `var x = 5;` `sayHi(); // fonctionne` `function sayHi() { console.log("Hi"); }` | Un maître d'hôtel qui prépare ta table avant que tu arrives / Un réalisateur qui installe les décors avant le tournage |
| **Temporal Dead Zone (TDZ)** | Zone où `let` ou `const` existe mais ne peut pas être utilisée avant sa déclaration | `console.log(x); // ReferenceError` `let x = 10;` `console.log(x); // 10` | Une chambre d'hôtel réservée mais pas encore prête : elle existe, tu ne peux pas entrer / Un colis expédié mais pas encore livré |
| **IIFE** | Fonction exécutée immédiatement après sa création pour créer un scope isolé | `(function() { let secret = "isolé"; console.log(secret); })();` `console.log(secret); // ReferenceError` | Un feu d'artifice allumé et explosé aussitôt : vit et meurt sur place / Un post-it écrit, lu et jeté dans la seconde |
| **Execution Context** | Environnement créé à chaque exécution de fonction : contient les variables, `this` et la scope chain | `function fn() { let x = 1; }` `fn(); // nouveau contexte` `fn(); // nouveau contexte recréé` | Une scène de théâtre qui se reconstruit à chaque acte / Un nouveau chantier ouvert avec ses propres ouvriers à chaque fois |
| **Callback Scope** | Fonction passée dans une autre qui garde accès à son scope d'origine | `function outer() { let msg = "Hello"; setTimeout(function() { console.log(msg); }, 100); }` `outer(); // Hello` | Un ambassadeur envoyé à l'étranger qui garde ses lois nationales / Un étudiant en échange qui garde les règles de son université |
| **Closure Memory Trap** | Une closure garde des variables en mémoire et peut bloquer le garbage collector | `function trap() { let big = new Array(1000000); return function() { return big.length; }; }` `const fn = trap(); // big reste en mémoire` | Un entrepôt qui stocke des caisses dont personne ne veut mais que personne n'ose jeter / Un ex qui garde toutes tes affaires : la place est occupée, rien n'est libéré |
