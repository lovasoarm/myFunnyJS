# OOP JS GRIMOIRE

Le résumé de tout ce que tu dois retenir du module. Pas un résumé scolaire : tout ce qu'un dev doit savoir sur l'OOP en JS pour ne plus jamais se faire surprendre.

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| `[[Prototype]]` | Lien interne d'un objet vers un autre objet, utilisé pour chercher une propriété absente. | `Object.getPrototypeOf(obj)` | le clan ninja qu'un genin peut consulter / le manuel d'armure que chaque Chevalier Garo partage |
| Prototype chain | Suite de liens `[[Prototype]]` remontée jusqu'à `null` lors d'une lecture de propriété. | `obj --> proto --> Object.prototype --> null` | une chaîne de commandement militaire / l'arbre généalogique d'un clan |
| `Object.create` | Crée un objet dont le `[[Prototype]]` pointe vers l'objet passé en argument. | `const n = Object.create(ninja);` | adopter le style de combat d'un sensei / recevoir l'armure d'un aîné |
| Shadowing | Une propriété propre à l'objet masque une propriété du même nom héritée du prototype. | `obj.x = "nouveau";` | un disciple qui dépasse son maître sur une seule technique / un remplaçant qui prend la place du titulaire sur un poste |
| `new` | Crée un objet, lie son prototype, exécute le constructeur avec `this`, retourne l'objet. | `new Ninja("Naruto")` | l'invocation d'un Kage Bunshin / le rituel d'armement d'un Chevalier |
| Fonction constructeur | Fonction normale destinée à être appelée avec `new` pour fabriquer des instances. | `function Ninja(n){this.nom=n;}` | la forge avant l'usine moderne / le brouillon avant le plan final |
| `class` | Sucre syntaxique sur les fonctions constructeurs et le prototype, avec des garde-fous en plus. | `class Ninja { constructor(n){} }` | l'armure standardisée d'une académie ninja / le plan d'évasion officiel remplaçant le bricolage de Fox River |
| `this` | Valeur déterminée au call-site (point d'appel), pas à l'écriture de la fonction. | `obj.methode()` | l'identité que tu portes selon qui t'appelle / le rôle que prend un joueur selon le poste où il est aligné |
| Call-site | L'endroit exact où une fonction est réellement invoquée, qui détermine `this`. | `presenter.call(naruto)` | le terrain précis où un joueur reçoit le ballon / la scène exacte où un personnage entre en jeu |
| Arrow function (`this`) | Ne définit jamais son propre `this` : elle capture celui du scope englobant à l'écriture. | `() => this.nom` | un soldat qui garde toujours les ordres de son unité d'origine / un ninja fidèle au village où il a été formé, peu importe la mission |
| `call` | Exécute une fonction immédiatement avec un `this` imposé, arguments listés un par un. | `fn.call(obj, a, b)` | emprunter la technique d'un autre ninja pour une attaque / utiliser le brassard d'un coéquipier pour une passe précise |
| `apply` | Comme `call`, mais les arguments arrivent regroupés dans un tableau. | `fn.apply(obj, [a, b])` | lancer un combo entier d'un coup / faire la passe décisive avec tout l'effectif déjà aligné |
| `bind` | Retourne une nouvelle fonction avec `this` figé pour de bon, sans l'exécuter tout de suite. | `const f = fn.bind(obj);` | sceller un pacte de loyauté permanent / signer un contrat à vie avec un club |
| `extends` | Chaîne deux prototypes de classe : l'enfant hérite des méthodes du parent. | `class A extends B {}` | un disciple qui hérite du style de combat de son maître / un junior qui hérite du système tactique de son club formateur |
| `super()` | Appelle le constructeur du parent ; obligatoire avant tout accès à `this` dans l'enfant. | `super(nom);` | recevoir l'aval du clan avant d'agir en son nom / passer par le coach principal avant toute décision tactique |
| Hiérarchie profonde | Empilement de plusieurs niveaux `extends`, qui rend le couplage et le debug plus risqués. | `A extends B extends C extends D` | une chaîne de commandement à 5 généraux où l'ordre se perd en route / un système de passes à 5 relais où un mauvais geste casse tout |
| Champ privé `#` | Propriété inaccessible depuis l'extérieur de la classe, vérifiée par le moteur JS. | `#solde; this.#solde` | le coffre-fort scellé de Fox River / le sceau secret d'un Chevalier que personne d'autre ne peut lire |
| Closure (privacy) | Variable capturée par une fonction interne, invisible depuis l'extérieur du scope. | `function f(){let x; return {...}}` | un plan d'évasion connu uniquement des complices dans la cellule / une stratégie connue seulement du vestiaire |
| `static` | Propriété ou méthode posée sur la classe elle-même, jamais sur les instances. | `Ninja.villageOrigine` | le règlement de l'académie, pas celui d'un élève en particulier / le règlement de la fédération, pas celui d'un seul club |
| `get` / `set` | Méthodes qui se lisent ou s'écrivent comme une simple propriété, avec de la logique cachée derrière. | `get chakra(){ return this._c; }` | le tableau de bord d'une armure qui calcule en direct / le panneau de score qui recalcule à chaque action du match |
| Composition ("has-a") | Un objet possède une capacité indépendante, sans lien de hiérarchie de classe. | `Object.assign(this, peutVoler)` | un Chevalier qui équipe une armure sans en être prisonnier / un joueur polyvalent qui ajoute un poste à son profil sans changer de club |
| Mixin | Fonction qui prend une classe et retourne une version étendue, pour composer plusieurs comportements. | `const M = (Base) => class extends Base {}` | un Horror qui absorbe une capacité d'un autre Horror sans fusionner son identité / un joueur qui ajoute une compétence d'un autre poste à son jeu |

## CE QUE CE MODULE EXIGE DE NE JAMAIS OUBLIER

L'OOP en JS n'est pas un système de classes au sens classique : c'est un système d'objets liés entre eux par des prototypes, et `class` n'en est que l'habillage. `this` n'appartient jamais à une fonction : il appartient à la façon dont elle est appelée, sauf pour les arrow functions qui trichent en empruntant le `this` du scope où elles sont écrites. L'héritage `extends` ne doit jamais devenir un réflexe : il répond à une question précise ("is-a"), et la composition répond à une question différente ("has-a"). Confondre les deux est la source numéro un des hiérarchies qui finissent par piéger tout le monde, y compris celui qui les a écrites.

La vraie compétence de ce module n'est pas de savoir écrire une `class`. C'est de savoir, face à un bug de `this`, un comportement de prototype inattendu, ou une hiérarchie qui devient ingérable, dire précisément ce qui se passe sous le capot et pourquoi.
