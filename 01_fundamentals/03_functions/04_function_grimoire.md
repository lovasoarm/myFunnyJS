# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~9 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## FUNCTION GRIMOIRE : LES MOTS QUE TU DOIS MAÎTRISER

Une fonction en JS c'est pas juste du code qui s'exécute.
C'est un objet. Un citoyen de première classe. Un truc vivant en mémoire.
Si tu ne maîtrises pas ces termes, tu codes à l'aveugle.

---

| Termes | Définitions | Codes | Analogies |
|---|---|---|---|
| Function Declaration | Fonction déclarée avec le mot-clé `function` : hoistée, utilisable avant sa ligne dans le fichier | `function attack() { return "boom"; }` <br> `attack(); // boom` <br> `// fonctionne même si appelée avant dans le fichier` | Un soldat enregistré dans l'armée avant même de recevoir ses ordres : il existe dès le début | Un acteur au générique dès le début du film même s'il n'apparaît qu'au milieu |
| Function Expression | Fonction assignée à une variable : non hoistée, elle n'existe qu'après sa ligne | `const attack = function() { return "boom"; };` <br> `attack(); // boom` <br> `// ReferenceError si appelée avant cette ligne` | Un mercenaire recruté au moment précis où tu en as besoin : avant ça, il n'existe pas | Un prestataire externe : il n'arrive que quand on l'appelle vraiment |
| Arrow Function | Syntaxe courte pour une fonction : pas de `this` propre, retour implicite si pas d'accolades | `const attack = () => "boom";` <br> `const double = x => x * 2;` <br> `const add = (a, b) => a + b;` | Un couteau suisse compact : moins de pièces, plus rapide à sortir | Un SMS vs un email : même message, moins de cérémonie |
| First-Class Function | En JS, les fonctions sont des valeurs comme les autres : stockables, passables, retournables | `const fn = function() {};` <br> `const arr = [fn];` <br> `function exec(f) { return f(); }` <br> `exec(fn);` | Un citoyen avec tous ses droits : il peut vivre où il veut, voyager, travailler pour n'importe qui | Un couteau dans ta cuisine : tu peux le poser, le donner, le ranger, l'utiliser |
| Function Object | Ce que JS crée réellement en mémoire quand tu déclares une fonction : un objet avec des propriétés | `function attack() {}` <br> `attack.name;  // "attack"` <br> `attack.length; // 0` <br> `attack.custom = "oui";` | Une fiche employé : au-delà du nom, elle a un poste, un badge, un historique | Une voiture : au-delà du moteur, elle a une plaque, une couleur, un carnet d'entretien |
| Higher-Order Function (HOF) | Fonction qui prend une autre fonction (callback) en argument ou en retourne une | `function exec(fn) { return fn(); }` <br> `[1,2,3].map(x => x * 2);` <br> `[1,2,3].filter(x => x > 1);` | Un chef d'orchestre qui ne joue pas lui-même mais dirige ceux qui jouent | Un manager qui délègue : il décide qui fait quoi, mais ne fait pas lui-même |
| Callback | Fonction passée à une autre fonction pour être exécutée plus tard ou sous condition | `setTimeout(() => console.log("later"), 1000);` <br> `[1,2,3].forEach(function(x) { console.log(x); });` | Un livreur à qui tu confies un colis : tu ne livres pas toi-même, tu délègues et il exécute | Un répondeur automatique : tu enregistres le message, il s'exécute quand quelqu'un appelle |
| Function Factory | Fonction qui crée et retourne des fonctions sur mesure selon les paramètres reçus | `const multiplier = n => arr => arr.map(x => x * n);` <br> `const double = multiplier(2);` <br> `double([1,2,3]); // [2,4,6]` | Une usine qui produit des outils différents selon la demande : même chaîne, résultats différents | Un tailleur : même atelier, mais il coupe chaque vêtement à ta mesure |
| Parameters vs Arguments | Parameters : les noms dans la définition. Arguments : les valeurs réelles au moment de l'appel | `function greet(name) { ... }` <br> `// name → paramètre` <br> `greet("Naruto");` <br> `// "Naruto" → argument` | Parameter : la case vide sur le formulaire | Argument : ce que tu écris dedans quand tu le remplis |
| Default Parameter | Valeur utilisée si l'argument correspondant n'est pas fourni ou est `undefined` | `function greet(name = "étranger") {` <br> ` return "Salut " + name;` <br> `}` <br> `greet();    // Salut étranger` <br> `greet("Naruto"); // Salut Naruto` | Un formulaire avec une case pré-remplie : tu peux la garder ou l'écraser | Une inscription avec option par défaut : si tu ne précises rien, tu reçois le standard |
| Rest Parameters | Récupérer un nombre indéfini d'arguments sous forme de tableau avec `...` | `function sum(...nums) {` <br> ` return nums.reduce((a, b) => a + b, 0);` <br> `}` <br> `sum(1, 2, 3, 4); // 10` | Un sac à dos qui accepte autant d'affaires que tu veux jeter dedans | Un serveur qui prend toutes les demandes de la table en une seule fois |
| Return Value | Ce que la fonction renvoie à celui qui l'a appelée : sans `return` explicite, JS retourne `undefined` | `function add(a, b) { return a + b; }` <br> `const result = add(2, 3); // 5` <br> `function nothing() {}` <br> `nothing(); // undefined` | Une question posée à quelqu'un : sa réponse c'est le return | Si la personne ne répond pas, tu reçois le silence : l'équivalent de `undefined` |
| Recursion | Fonction qui s'appelle elle-même jusqu'à atteindre une condition d'arrêt | `function factorial(n) {` <br> ` if (n <= 1) return 1;` <br> ` return n * factorial(n - 1);` <br> `}` <br> `factorial(5); // 120` | Des poupées russes : tu ouvres, il y en a une autre dedans, jusqu'à la toute petite | Un miroir face à un miroir : ça se répète jusqu'à l'infini, sauf si tu mets une limite |
| `arguments` object | Objet disponible dans les fonctions classiques contenant tous les arguments reçus : absent dans les arrow functions | `function old() {` <br> ` console.log(arguments);` <br> `}` <br> `old(1, 2, 3); // Arguments [1, 2, 3]` <br> `const arr = () => console.log(arguments); // ReferenceError` | Un carnet de bord automatique dans les vieux avions : enregistre tout ce qui entre | Les nouveaux avions utilisent autre chose : `...rest` pour les arrows |
| `this` in function | Référence à l'objet d'exécution courant : change selon comment la fonction est appelée : voir `02_scope/04_this_context.md` pour le détail complet | `const obj = { name: "Naruto", greet() { return this.name; } };` <br> `obj.greet(); // "Naruto"` <br> `const fn = obj.greet;` <br> `fn(); // undefined` | L'identité du contexte : qui parle en ce moment ? / Un acteur qui joue différents rôles : selon la pièce, "je" ne désigne pas la même personne |
| `bind` / `call` / `apply` | Méthodes pour contrôler manuellement la valeur de `this` dans une fonction | `function greet() { return this.name; }` <br> `const hero = { name: "Naruto" };` <br> `greet.call(hero);    // "Naruto"` <br> `greet.bind(hero)();   // "Naruto"` <br> `greet.apply(hero, []); // "Naruto"` | Mettre un badge de quelqu'un d'autre sur toi : tu forces l'identité pendant l'exécution | Un ventriloque : il parle mais la voix vient d'ailleurs |

---

> **Pure Function, Currying, Partial Application, Composition, Memoization** : ces concepts ont leurs propres leçons dans `11_functional_js`. Ils seront là quand tu seras prêt pour eux.

---

## OÙ L'ANALOGIE CASSE

Les analogies (arbitre du tournoi, clé USB, cuisine du restaurant…) sont là
pour donner une prise mentale, pas pour décrire fidèlement le mécanisme.
Points où elles mentent :

- **Clé USB pour référence objet** : suggère un fichier physique partagé.
  En vrai, deux variables pointent la même adresse mémoire ; pas de copie,
  pas de "prêt", pas de "retour".
- **Arbitre du tournoi pour l'event loop** : suggère une décision au cas
  par cas. En vrai, c'est un ordre déterministe : microtasks vidées, une
  macrotask, on recommence.
- **Cuisine pour thread pool** : suggère des cuisiniers autonomes. En vrai,
  ils partagent la même mémoire, avec toutes les guerres de synchronisation
  que ça implique.

Règle : quand l'analogie te sert à décider, arrête-la, retourne au mécanisme.

---
stability: intemporel
