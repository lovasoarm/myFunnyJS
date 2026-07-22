---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# BOOLEAN LOGIC : LA LOGIQUE QUI PILOTE TOUT
Temps de lecture ~9 min

Chaque `if`, chaque `while`, chaque condition que tu écris repose sur un calcul booléen. Ce n'est pas de la philosophie : c'est de l'électronique. Un transistor soit passe du courant, soit pas. `true` ou `false`. C'est sur cette binarité que tourne ton code.

Comprendre la logique booléenne, c'est comprendre pourquoi certaines conditions marchent et d'autres te pètent silencieusement à la figure.

---

## 1) LES QUATRE OPÉRATEURS DE BASE

### AND (`&&`) : les deux doivent être vrais

```js
// Naruto peut attaquer seulement s'il a de l'énergie ET qu'il est transformé
const peutAttaquer = aDeEnergie && estTransforme;

// si le premier est false : JS ne regarde même pas le second
// c'est le short-circuit:il stoppe dès que c'est perdu
false && quelqueChoseDeCoûteux(); // quelqueChoseDeCoûteux() n'est jamais appelé
```

**Table de vérité AND :**

```
true && true => true
true && false => false
false && true => false  // stoppe ici, ne va pas plus loin
false && false => false
```

### OR (`||`) : au moins un doit être vrai

```js
// le joueur marque si c'est un tir cadré OU une déviation malheureuse
const butValide = tirCadre || deviationAdverse;

// short-circuit inverse : stoppe dès que c'est gagné
true || quelqueChoseDeCoûteux(); // idem, jamais évalué
```

**Table de vérité OR :**

```
true || true => true  // stoppe ici
true || false => true  // stoppe ici
false || true => true
false || false => false
```

### NOT (`!`) : inverse la valeur

```js
const estConnecte = true;
const estDeconnecte = !estConnecte; // false

// double négation : utile pour forcer un booléen
const valeurDouteuse = "Naruto";
!!valeurDouteuse; // true:convertit en vrai booléen
```

### XOR : l'un ou l'autre, mais pas les deux

JS n'a pas d'opérateur XOR logique natif, mais le bitwise `^` existe. Pour les booléens :

```js
// XOR maison : exactement un des deux doit être vrai
const xor = (a, b) => (a || b) && !(a && b);

xor(true, false); // true:un seul est vrai
xor(true, true); // false:les deux sont vrais, c'est trop
xor(false, false); // false:aucun n'est vrai

// cas d'usage réel : un interrupteur qui toggle
// on veut que la lumière soit allumée si UN seul interrupteur est ON
const lumiere = xor(interrupteur1, interrupteur2);
```

---

## 2) LE SHORT-CIRCUIT : PAS QUE DE L'OPTIMISATION

Le short-circuit est utilisé partout comme raccourci d'écriture. C'est pratique. C'est aussi une source de bugs si tu ne sais pas ce qui se passe.

```js
// valeur par défaut avec ||
const pseudo = joueur.pseudo || "Anonyme";
// si joueur.pseudo est falsy (null, undefined, "", 0, false) => "Anonyme"

// PIÈGE : 0 est falsy
const score = joueur.score || 100;
// si score vaut 0 (joueur n'a pas encore marqué), il devient 100
// c'est faux:le joueur a un score, il vaut juste 0
```

**La solution : nullish coalescing `??`**

```js
// ?? ne remplace que null et undefined, pas les autres falsy
const score = joueur.score ?? 100;
// 0 reste 0:only null et undefined déclenchent le fallback
```

**Optional chaining `?.` + short-circuit**

```js
// accéder à une propriété qui peut ne pas exister
const ville = joueur?.profil?.adresse?.ville;
// si n'importe quel maillon est null/undefined => undefined, pas d'erreur

// combiné avec ??
const ville = joueur?.profil?.adresse?.ville ?? "Inconnue";
```

---

## 3) LES VALEURS FALSY ET TRUTHY : LE VRAI PIÈGE

JS ne travaille pas qu'avec des vrais booléens. N'importe quelle valeur peut être évaluée comme vraie ou fausse.

**Falsy : ces 7 valeurs sont considérées comme false**

```js
false;
0 - 0;
0n; // BigInt zéro
(""); // chaîne vide
null;
undefined;
NaN;
```

**Tout le reste est truthy**, y compris :

```js
[]; // tableau vide : TRUTHY:attention
{
} // objet vide : TRUTHY:attention
"0" - // la chaîne "0" : TRUTHY
 1; // n'importe quel nombre non-zéro
```

```js
// le piège classique
if ([]) {
 console.log("tableau vide = truthy"); // s'exécute
}

if ([] == false) {
 console.log("mais == false aussi"); // s'exécute aussi
}
// JS fait de la coercition avec ==
// avec === ça ne passerait pas:utilise toujours ===
```

---

## 4) DE MORGAN : SIMPLIFIER LES CONDITIONS COMPLEXES

Deux règles qui permettent de réécrire n'importe quelle condition négative :

```
!(A && B) <=> !A || !B
!(A || B) <=> !A && !B
```

```js
// version illisible
if (!(estAdmin && estActif)) {
 refuserAcces();
}

// version De Morgan:même logique, plus lisible
if (!estAdmin || !estActif) {
 refuserAcces();
}

// autre exemple : bloquer si pas ninja ET pas Hokage
if (!(estNinja || estHokage)) {
 bloquerEntree();
}
// devient :
if (!estNinja && !estHokage) {
 bloquerEntree();
}
```

C'est utile en code review. Si quelqu'un écrit `!(a && b)`, tu proposes `!a || !b`. Plus clair pour tout le monde.

---

## 5) PRIORITÉ DES OPÉRATEURS

```
!  (NOT)    : priorité la plus haute
&& (AND)
|| (OR)    : priorité la plus basse
??       : même niveau que ||
```

```js
// sans parenthèses : peut surprendre
true ||
 (false &&
  false(
   // => true || (false && false) => true || false => true
   // && est évalué avant ||

   // avec parenthèses : explicite
   true || false,
  ) &&
  false);
// => true && false => false

// règle : si tu mixes && et || sans parenthèses, tu joues avec le feu
// ajoute des parenthèses:le compilateur te remercie pas mais tes collègues oui
```

---

## EXERCICES

## EXO 1 : Le système d'accès de Fox River

La prison Fox River a un système d'accès électronique. Un garde peut ouvrir une porte si :

- il a un badge valide ET son shift est actif
- OU s'il est superviseur (bypass total)
- MAIS jamais si une alerte de sécurité est active (override de tout)

Implémenter la fonction `peutOuvrirPorte(garde)` qui retourne `true` ou `false`.

```js
const garde1 = {
 badge: true,
 shiftActif: true,
 superviseur: false,
 alerteActive: false,
};
const garde2 = {
 badge: false,
 shiftActif: true,
 superviseur: true,
 alerteActive: false,
};
const garde3 = {
 badge: true,
 shiftActif: true,
 superviseur: true,
 alerteActive: true,
};
// garde1 => true, garde2 => true, garde3 => false
```

(indice : commence par l'alerte : si elle est active, tout s'arrête là)

---

## EXO 2 : Détecteur de valeurs suspectes

Walter White reçoit des données de ses distributeurs. Certaines valeurs sont invalides et doivent être rejetées. Une valeur est rejetée si elle est falsy OU si c'est un tableau vide OU si c'est un objet sans clés.

Écrire `estValide(valeur)` sans utiliser de library externe.

```js
estValide(0); // false:falsy
estValide(""); // false:falsy
estValide([]); // false:tableau vide
estValide({}); // false:objet vide
estValide([1, 2]); // true
estValide({ q: 5 }); // true
estValide("heisenberg"); // true
```

---

## EXO 3 : Toggle de features

Trapsoul Radio a un système de feature flags. Chaque feature est active si son flag est `true` ET que la région du shinobi est supportée. Sauf si le shinobi est premium (bypass des restrictions région). Mais les features dépréciées sont toujours désactivées.

Écrire `featureActive(feature, user)` en utilisant De Morgan là où c'est applicable.

---

## RÉSUMÉ

`&&`, `||`, `!`, et `??` : c'est avec ça que chaque condition de ton code est calculée. Le short-circuit n'est pas qu'une optimisation, c'est un comportement que tu dois anticiper. Les valeurs falsy sont un piège classique, surtout `0`, `[]`, et `{}` qui se comportent différemment selon le contexte. De Morgan te donne un outil pour rendre les conditions négatives lisibles. Ajoute des parenthèses dès que tu mixes `&&` et `||`.
