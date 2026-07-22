---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PROTOTYPE CHAIN RAW : LA CHAÎNE BRUTE, SANS SUCRE
Temps de lecture ~10 min

Un objet JS qui ne trouve pas une propriété ne renvoie pas direct `undefined`. Il va chercher chez son parent. Puis chez le parent du parent. Jusqu'à la racine. Cette chaîne, c'est le moteur entier de l'OOP en JS. `class` n'existe pas sans elle. Si tu comprends ça, tout le reste du module 18 devient de la syntaxe au-dessus d'un mécanisme que tu connais déjà.

---

## 1) [[PROTOTYPE]] : LE LIEN CACHÉ

Chaque objet JS a un lien interne vers un autre objet : son prototype (modèle dont il hérite des propriétés). Ce lien s'appelle `[[Prototype]]` (avec doubles crochets : c'est une propriété interne, invisible directement, gérée par le moteur JS lui-même).

```js
const ninja = {
 esquiver() {
  return "Ninja esquive dans un nuage de fumée"
 }
}

const naruto = Object.create(ninja)
// Object.create : crée un objet dont [[Prototype]] pointe vers l'argument donné
naruto.nom = "Naruto"

console.log(naruto.nom)    // "Naruto" (propriété propre, posée directement sur naruto)
console.log(naruto.esquiver()) // trouvé chez ninja, pas chez naruto
```

`naruto` n'a pas de méthode `esquiver`. Il a un lien vers `ninja`, qui en a une. Le moteur grimpe la chaîne jusqu'à la trouver.

```
naruto.esquiver()
  |
  v
naruto a "esquiver" ? NON
  |
  v
naruto.[[Prototype]] (= ninja) a "esquiver" ? OUI --> exécution
```

Chaîne complète dans le cas d'une classe :

```
instance (ex : monNinja)
    |
    | [[Prototype]] (accès via __proto__ ou Object.getPrototypeOf)
    v
MaClasse.prototype
  (méthodes partagées par toutes les instances : attack(), defend()...)
    |
    | [[Prototype]]
    v
Object.prototype
  (toString, hasOwnProperty, valueOf, isPrototypeOf...)
    |
    | [[Prototype]]
    v
   null
  (fin de chaîne : le moteur s'arrête ici)

JS remonte la chaîne à chaque accès de propriété ou méthode.
Si c'est introuvable jusqu'à null : retourne undefined. Pas d'erreur, juste silence.
C'est pourquoi accéder à une propriété inexistante ne plante pas, mais utiliser son résultat plante.
```

---

## 2) LA CHAÎNE EXISTE VRAIMENT, ELLE A UNE FIN

La chaîne n'est pas infinie. Elle se termine à `Object.prototype`, puis à `null`.

```js
console.log(Object.getPrototypeOf(naruto) === ninja)      // true
console.log(Object.getPrototypeOf(ninja) === Object.prototype) // true
console.log(Object.getPrototypeOf(Object.prototype))      // null : fin de la chaîne
```

```
naruto --> ninja --> Object.prototype --> null
```

Quand tu accèdes à `naruto.toString()`, tu remontes toute la chaîne jusqu'à `Object.prototype`, qui le possède. C'est pour ça qu'absolument tout objet JS a accès à `toString`, `hasOwnProperty`, `valueOf`, etc. sans que tu les écrives.

```js
// preuve :
console.log(naruto.hasOwnProperty)    // [Function: hasOwnProperty]
console.log(naruto.toString)       // [Function: toString]
// ni l'un ni l'autre n'est sur naruto ni sur ninja : ils viennent de Object.prototype
```

---

## 3) PROPRIÉTÉ PROPRE VS PROPRIÉTÉ HÉRITÉE

```js
naruto.hasOwnProperty("nom")   // true (propre à naruto, posé directement)
naruto.hasOwnProperty("esquiver") // false (vient de ninja, pas propre)

"esquiver" in naruto       // true (in regarde toute la chaîne)
"nom" in naruto          // true (in regarde toute la chaîne aussi)
```

`hasOwnProperty` regarde uniquement l'objet lui-même.
`in` regarde toute la chaîne.

Confondre les deux, c'est le genre d'erreur qui te fait dire "mais elle existe pourtant !" en debug, alors que la question n'était pas la bonne. Un `for...in` itère sur toutes les propriétés trouvées dans la chaîne (propres + héritées), ce qui surprend souvent.

```js
// piège classique avec for...in
const sasuke = Object.create(ninja)
sasuke.chakra = 9000

for (const key in sasuke) {
 console.log(key)
 // affiche : "chakra", puis "esquiver" (venue de ninja)
 // solution : filtrer avec hasOwnProperty si tu veux seulement les propres
}

for (const key in sasuke) {
 if (sasuke.hasOwnProperty(key)) {
  console.log(key) // affiche seulement : "chakra"
 }
}
```

---

## 4) ÉCRITURE VS LECTURE : LA CHAÎNE NE SERT QU'EN LECTURE

Quand tu lis une propriété, le moteur grimpe la chaîne.
Quand tu écris une propriété, il n'y a pas de "grimpe" : ça pose direct la propriété sur l'objet lui-même.

```js
naruto.esquiver = function() {
 return "Naruto esquive en mode brute force"
}

naruto.esquiver() // "Naruto esquive en mode brute force"
ninja.esquiver() // toujours "Ninja esquive dans un nuage de fumée" : ninja n'a pas changé
```

`naruto` a maintenant sa propre méthode `esquiver`, qui masque celle du prototype. C'est le **shadowing** (masquage : une propriété propre cache la version héritée portant le même nom). Le prototype `ninja` n'a jamais été touché.

```
avant le shadowing :
naruto.esquiver() → monte vers ninja → trouve "esquiver" chez ninja

après le shadowing :
naruto.esquiver() → trouve "esquiver" chez naruto → s'arrête là
          ninja.esquiver() reste intact
```

---

## 5) LIRE LE PROTOTYPE À TRAVERS LA CHAÎNE : OUTILS LÉGITIMES

```js
// lire le prototype d'un objet
Object.getPrototypeOf(naruto) === ninja // true

// vérifier si un objet est le prototype d'un autre
ninja.isPrototypeOf(naruto)        // true
ninja.isPrototypeOf(sasuke)        // true (si sasuke a été créé avec Object.create(ninja))
Object.prototype.isPrototypeOf(naruto)  // true : Object.prototype est dans la chaîne de tout objet

// voir TOUTES les propriétés propres d'un objet (pas les héritées)
Object.keys(naruto)    // ["nom", "esquiver"] : propres et énumérables
Object.getOwnPropertyNames(naruto) // pareil mais inclut les non-énumérables
```

Note sur `__proto__` : cette propriété existe sur presque tous les objets et permet de lire/écrire le prototype. Mais c'est un vestige de dev navigateur, standardisé à contrecoeur. Ne l'utilise pas dans du code de prod : utilise `Object.getPrototypeOf` / `Object.create` / `Object.setPrototypeOf` à la place. Plus explicite, plus stable.

---

## 6) L'EXEMPLE QUI CASSE : MUTER LE PROTOTYPE PARTAGÉ

```js
const sasuke = Object.create(ninja)
const sakura = Object.create(ninja)

// jusque là, normal
sasuke.esquiver() // "Ninja esquive dans un nuage de fumée"
sakura.esquiver() // "Ninja esquive dans un nuage de fumée"

// maintenant on mutant le prototype partagé
ninja.esquiver = function() {
 return "Esquive modifiée : nouvelle technique"
}

// ça change pour TOUT le monde instantanément
sasuke.esquiver() // "Esquive modifiée : nouvelle technique"
sakura.esquiver() // "Esquive modifiée : nouvelle technique"
```

Tu modifies `ninja` une fois, et toutes les instances qui pointent vers lui changent de comportement instantanément, même celles créées avant la modification.

```
ninja.esquiver change
  |
  v
sasuke --> ninja (lien vivant, pas une copie)
sakura --> ninja (lien vivant, pas une copie)
  |
  v
les deux changent ensemble, sans qu'on touche sasuke ou sakura directement
```

Ce n'est pas un bug : c'est exactement ce que fait un prototype partagé. Le risque réel : une lib tierce ou un autre module qui modifie un prototype partagé (le sien ou, pire, un natif comme `Array.prototype`) fait muter silencieusement tout le programme.

```js
// exemple catastrophique : monkey-patching (modification d'un prototype natif à l'exécution)
Array.prototype.dernierElement = function() {
 return this[this.length - 1]
}

// maintenant TOUS les tableaux du programme ont cette méthode
// y compris ceux de tes dépendances qui ne s'y attendent pas
[1, 2, 3].dernierElement() // 3 : ça marche
// mais tu viens de modifier un objet partagé par tout le runtime
```

C'est pour ça que la pollution de prototype (voir `28_edge_cases/04`) est traitée comme une vulnérabilité de sécurité, pas juste une mauvaise pratique.

---

## 7) NULL PROTOTYPE : L'OBJET SANS ANCÊTRE

```js
// créer un objet qui n'a pas de prototype du tout
const dictionnaire = Object.create(null)
dictionnaire.clé = "valeur"

console.log(dictionnaire.toString)   // undefined : pas d'Object.prototype dans la chaîne
console.log(dictionnaire.hasOwnProperty) // undefined : même chose

// mais "clé" in dictionnaire marche toujours
"clé" in dictionnaire // true
```

Les objets à prototype `null` sont utiles comme dictionnaires purs, sans le risque de collision avec les méthodes héritées d'`Object.prototype`. Si tu stockes des données dont les clés pourraient s'appeler `constructor`, `toString` ou `hasOwnProperty`, un objet à prototype `null` évite les surprises.

---

## EXERCICES

### EXO 1 : le clan partagé

Crée un objet `clanUchiha` avec une méthode `technique()` qui renvoie une chaîne. Crée deux objets `sasuke` et `itachi` via `Object.create(clanUchiha)`, chacun avec un `nom` propre. Vérifie avec `hasOwnProperty` que `nom` est propre à chacun mais que `technique` ne l'est pas. Ensuite, itère sur les propriétés de `sasuke` avec `for...in` et affiche seulement les propriétés propres.

(Indice : `Object.create` prend le prototype en argument, pas les propriétés propres)

---

### EXO 2 : la chasse au shadowing

Donne à `sasuke` sa propre version de `technique()`, différente de celle du clan. Appelle la méthode sur `sasuke`, puis directement sur `clanUchiha`. Explique en commentaire pourquoi les deux résultats diffèrent alors que c'est "la même méthode", et comment `Object.getPrototypeOf(sasuke).technique()` te permet de retrouver la version du clan depuis `sasuke`.

---

### EXO 3 : la chaîne complète

Écris une fonction `chainOf(obj)` qui retourne un tableau de tous les prototypes d'un objet jusqu'à `null`, dans l'ordre. Le tableau doit inclure `obj` lui-même en premier. Teste-la sur :
- un objet créé avec `Object.create(Object.create(ninja))`
- un tableau `[1, 2, 3]` (la chaîne est plus longue qu'on croit)
- un objet créé avec `Object.create(null)` (chaîne très courte)

---

## RÉSUMÉ

Un objet JS ne possède pas forcément ce qu'il semble avoir : il y a souvent un lien invisible vers un autre objet qui porte la propriété réelle.
La chaîne se lit en remontant, se termine à `null`, et passe toujours par `Object.prototype`.
`hasOwnProperty` regarde l'objet seul. `in` regarde toute la chaîne.
L'écriture ne grimpe jamais la chaîne : elle pose toujours une propriété propre, qui masque sans modifier.
Muter un prototype partagé impacte instantanément toutes les instances liées : arme à double tranchant, vulnérabilité de sécurité si c'est un prototype natif.


---

## SCHÉMA ASCII : CHAÎNE DE PROTOTYPES

```
 monChien ─┬─► { nom: "Kuro" }
      │
      │ __proto__
      ▼
    Chien.prototype ─┬─► { aboyer: fn }
             │
             │ __proto__
             ▼
         Animal.prototype ─┬─► { manger: fn }
                  │
                  │ __proto__
                  ▼
             Object.prototype ─► { toString, hasOwnProperty }
                  │
                  │ __proto__
                  ▼
                  null  (fin de la chaîne)
```

Recherche d'une propriété = remonter les flèches. Retourne à `null` sans trouver ⇒ `undefined`.


> ATTENTION - ou cette analogie casse :
> les analogies mecaniquement sensibles (prototype, closure, event loop, reference vs copie)
> creent de faux modeles si on les prend trop loin. Consulte ce court aide-memoire :
>
> - **prototype != clone** : `Object.create(p)` ne COPIE pas p, il LIE dessus. Modifier p impacte l'enfant.
> - **closure != variable capturee** : la closure capture la REFERENCE au binding, pas la valeur au moment de la creation.
> - **event loop != file simple** : microtasks drainent COMPLETEMENT entre chaque macrotask - pas un round-robin.
> - **reference != alias** : `let b = a; b = {...}` ne mute pas a. `b.x = 1` mute a si a est objet.
