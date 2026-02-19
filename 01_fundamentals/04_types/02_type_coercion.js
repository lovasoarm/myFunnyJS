/*
===========================================================
TYPE COERCION — CONVERSION IMPLICITE / EXPLICITE
===========================================================

JavaScript est un langage dynamique
(dynamique = les variables peuvent changer de type).

Donc JS convertit parfois les types automatiquement.

Ça s'appelle la coercion
(conversion automatique d’un type vers un autre).

Et c’est là que le chaos commence.

-----------------------------------------------------------
1) COERCION IMPLICITE (AUTOMATIQUE)
-----------------------------------------------------------

JS décide pour toi.

Exemple :

console.log("5" + 1);

Résultat ?
"51"

Pourquoi ?

Parce que + avec une string
force la conversion en string.

1 devient "1".

Donc :
"5" + "1" = "51"

---

Autre exemple :

console.log("5" - 1);

Résultat ?
4

Pourquoi ?

Le - force une conversion en number.

"5" devient 5.
5 - 1 = 4.

Donc :

+ = peut faire concaténation
- = force calcul numérique

Ça sent le piège.

-----------------------------------------------------------
2) == VS ===
-----------------------------------------------------------

==  → compare après coercion
=== → compare sans conversion

Exemple :

console.log(5 == "5");  // true
console.log(5 === "5"); // false

Pourquoi ?

Avec == :
JS convertit "5" en 5.

Avec === :
JS vérifie le type ET la valeur.

Règle simple :
Utilise toujours === sauf si tu sais EXACTEMENT ce que tu fais.

-----------------------------------------------------------
3) LES CAS TORDUS
-----------------------------------------------------------

console.log(false == 0);     // true
console.log("" == 0);        // true
console.log(null == undefined); // true

Pourquoi ?

Parce que JS applique des règles internes
de conversion compliquées.

Par exemple :

false → devient 0
"" → devient 0

Donc :
0 == 0

---

Mais :

console.log(null === undefined); // false

Types différents.

-----------------------------------------------------------
4) COERCION EXPLICITE (PROPRE)
-----------------------------------------------------------

Tu contrôles la conversion.

String vers Number :

Number("10") // 10
parseInt("10") // 10

Number vers String :

String(10) // "10"

Boolean :

Boolean(1) // true
Boolean(0) // false

C’est propre.
C’est prévisible.
Pas de magie cachée.

-----------------------------------------------------------
5) TRUTHY / FALSY
-----------------------------------------------------------

En JS, certaines valeurs sont considérées comme false.

Falsy :

false
0
""
null
undefined
NaN

Tout le reste est truthy.

Exemple :

if ("hello") {
  console.log("C'est vrai");
}

Ça s'exécute.
Parce que string non vide = truthy.

-----------------------------------------------------------
6) POURQUOI C’EST CRUCIAL ?
-----------------------------------------------------------

- Évite les bugs invisibles
- Comprend les conditions
- Maîtrise les comparaisons
- Comprend les APIs et formulaires

Si tu ne maîtrises pas la coercion,
tu subis JavaScript.

===========================================================
MISSION TYPE CHAOS
===========================================================

1) Teste :

console.log("10" + 5);
console.log("10" - 5);
console.log(true + 1);
console.log(false + 1);

2) Compare :

console.log(null == 0);
console.log(null == undefined);
console.log(null === undefined);

3) Crée une variable input = "0"
   et teste if(input) { ... }

Comprends pourquoi ça passe ou pas.

Ici tu ne dois pas juste voir le résultat.
Tu dois comprendre la conversion.

JS ne devine pas.
Il applique des règles.

Et ces règles, tu dois les dominer.
*/
