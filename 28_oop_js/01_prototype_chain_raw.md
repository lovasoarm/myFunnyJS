# PROTOTYPE CHAIN RAW : LA CHAÎNE BRUTE, SANS SUCRE

Un objet JS qui ne trouve pas une propriété ne renvoie pas direct `undefined`. Il va chercher chez son parent. Puis chez le parent du parent. Jusqu'à la racine. Cette chaîne, c'est le moteur entier de l'OOP en JS. `class` n'existe pas sans elle.

## 1) [[PROTOTYPE]] : LE LIEN CACHÉ

Chaque objet JS a un lien interne vers un autre objet : son prototype (modèle dont il hérite des propriétés). Ce lien s'appelle `[[Prototype]]` (avec doubles crochets : c'est une propriété interne, invisible directement, gérée par le moteur JS lui-même).

```js
const ninja = {
  esquiver() {
    return "Ninja esquive dans un nuage de fumée";
  }
};

const naruto = Object.create(ninja); // (Object.create : crée un objet dont [[Prototype]] pointe vers l'argument donné)
naruto.nom = "Naruto";

console.log(naruto.nom);       // "Naruto" (propriété propre, posée directement sur naruto)
console.log(naruto.esquiver()); // trouvé chez ninja, pas chez naruto
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

## 2) LA CHAÎNE EXISTE VRAIMENT, ELLE A UNE FIN

La chaîne n'est pas infinie. Elle se termine à `Object.prototype`, puis à `null`.

```js
console.log(Object.getPrototypeOf(naruto) === ninja);              // true
console.log(Object.getPrototypeOf(ninja) === Object.prototype);    // true
console.log(Object.getPrototypeOf(Object.prototype));               // null, fin de la chaîne
```

```
naruto --> ninja --> Object.prototype --> null
```

Quand tu accèdes à `naruto.toString()`, tu remontes toute la chaîne jusqu'à `Object.prototype`, qui le possède. C'est pour ça qu'absolument tout objet JS a accès à `toString`, `hasOwnProperty`, etc. sans que tu les écrives.

## 3) PROPRIÉTÉ PROPRE VS PROPRIÉTÉ HÉRITÉE

```js
naruto.hasOwnProperty("nom");       // true  (propre à naruto)
naruto.hasOwnProperty("esquiver");  // false (vient de ninja, pas propre)

"esquiver" in naruto;               // true  (in regarde toute la chaîne)
```

`hasOwnProperty` regarde uniquement l'objet lui-même. `in` regarde toute la chaîne. Confondre les deux, c'est le genre d'erreur qui te fait dire "mais elle existe pourtant !" en debug, alors que la question n'était pas la bonne.

## 4) ÉCRITURE VS LECTURE : LA CHAÎNE NE SERT QU'EN LECTURE

Quand tu lis une propriété, le moteur grimpe la chaîne. Quand tu écris une propriété, il n'y a pas de "grimpe" : ça pose direct la propriété sur l'objet lui-même.

```js
naruto.esquiver = function() {
  return "Naruto esquive en mode brute force";
};

naruto.esquiver(); // "Naruto esquive en mode brute force"
ninja.esquiver();  // toujours "Ninja esquive dans un nuage de fumée" : ninja n'a pas changé
```

`naruto` a maintenant sa propre méthode `esquiver`, qui masque celle du prototype. Le prototype `ninja` n'a jamais été touché. C'est le shadowing (masquage : une propriété propre cache la version héritée portant le même nom).

## 5) L'EXEMPLE QUI CASSE : MUTER LE PROTOTYPE PARTAGÉ

```js
const sasuke = Object.create(ninja);
const sakura = Object.create(ninja);

ninja.esquiver = function() {
  return "Esquive modifiée pour tout le monde";
};

sasuke.esquiver(); // "Esquive modifiée pour tout le monde"
sakura.esquiver(); // "Esquive modifiée pour tout le monde"
```

Tu modifies `ninja` une fois, et toutes les instances qui pointent vers lui changent de comportement instantanément, même celles créées avant la modification. Ce n'est pas un bug : c'est exactement ce que fait un prototype partagé. Le risque réel : une lib tierce ou un autre module qui modifie un prototype partagé (le sien ou, pire, un natif comme `Array.prototype`) fait muter silencieusement tout le programme.

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

## TIPS D'ÉVOLUTION

Avant, on manipulait `__proto__` directement pour lire ou écrire le prototype d'un objet. C'est toujours possible, mais déconseillé : c'est lent et c'était à l'origine pensé pour le debug navigateur, pas pour du code de prod. Aujourd'hui on utilise `Object.create`, `Object.getPrototypeOf`, `Object.setPrototypeOf`. Plus explicite, plus stable, sans dépendre d'un détail d'implémentation qui a fini standardisé après coup.

## EXERCICES

EXO 1 : le clan partagé :
Crée un objet `clanUchiha` avec une méthode `technique()` qui renvoie une chaîne. Crée deux objets `sasuke` et `itachi` via `Object.create(clanUchiha)`, chacun avec un `nom` propre. Vérifie avec `hasOwnProperty` que `nom` est propre à chacun mais que `technique` ne l'est pas. (indice : `Object.create` prend le prototype en argument, pas les propriétés propres)

EXO 2 : la chasse au shadowing :
Donne à une instance sa propre version de `technique()`, différente de celle du prototype. Appelle la méthode sur l'instance, puis directement sur le prototype. Explique en commentaire pourquoi les deux résultats diffèrent alors que c'est "la même méthode".

EXO 3 : la chaîne complète :
Écris une fonction `chainOf(obj)` qui retourne un tableau de tous les prototypes d'un objet jusqu'à `null`, dans l'ordre. Teste-la sur un objet créé avec deux niveaux de `Object.create` imbriqués.

## RÉSUMÉ

Un objet JS ne possède pas forcément ce qu'il semble avoir : il y a souvent un lien invisible vers un autre objet qui porte la propriété réelle. Cette chaîne se lit toujours en lecture, jamais en écriture. Écrire sur un objet pose une propriété propre, qui masque celle du prototype sans jamais la modifier. Muter un prototype partagé impacte instantanément toutes les instances liées, ce qui est une arme à double tranchant.
