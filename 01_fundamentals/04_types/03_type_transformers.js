/*
===========================================================
TYPE TRANSFORMERS
Transformer. Vérifier. Survivre.
===========================================================

JavaScript est dynamique.
(dynamique = une variable peut changer de type quand elle veut)

Donc ton code peut penser avoir un nombre…
et en réalité c’est une string déguisée.

Bienvenue dans le monde où "100" + 20 = "10020".

Si tu ne contrôles pas les types,
les types te trollent.

On va régler ça.

-----------------------------------------------------------
1) STRING — FORCER LE MODE TEXTE
-----------------------------------------------------------

Pourquoi convertir en string ?

Parce que le monde extérieur parle texte :
- HTML
- API
- stockage
- logs

Méthodes :

String(value)
value.toString()

MAIS :

String(null)      // "null"
String(undefined) // "undefined"

null.toString()      // BOOM erreur
undefined.toString() // BOOM erreur

Conclusion sauvage :
Si tu n’es pas sûr → utilise String()

Exemple réel :

let score = 99;
let display = String(score);

Maintenant display est du texte.
Il peut être affiché sans surprise.

-----------------------------------------------------------
2) NUMBER — LÀ OÙ LES BUGS NAISSENT
-----------------------------------------------------------

Tu récupères un input :

let price = "200";

Si tu fais :

price + 50
→ "20050"

Catastrophe silencieuse.

Donc :

Number(price) + 50
→ 250

---

Les outils :

Number("42")       // 42
Number("42px")     // NaN 

parseInt("42px")   // 42
parseFloat("3.14px") // 3.14

Logique :

Number = strict (100% propre sinon rien)
parseInt = lit jusqu’à ce que ça sente mauvais

---

NaN maintenant.

NaN = Not a Number
(ça veut dire conversion foirée)

Et le pire :

NaN === NaN // false

Oui.
Même lui ne s’aime pas.

Donc on teste avec :

Number.isNaN(value)
NB: isNaN("hello")        // true  ← convertit d'abord en nombre, puis teste
Number.isNaN("hello") // false ← teste strictement sans conversion
=>Number.isNaN() est plus fiable car il retourne true uniquement si la valeur est réellement NaN, sans conversion de type implicite.

-----------------------------------------------------------
3) BOOLEAN — LA PSYCHOLOGIE DE JS
-----------------------------------------------------------

JS décide si une valeur est "vraie" ou "fausse".

Boolean(value)
ou
!!value

Pourquoi !! marche ?

!value → inverse
!!value → remet droit
Résultat = boolean pur

---

Les SEULS falsy :

false
0
""
null
undefined
NaN

Tout le reste = truthy.

Donc :

Boolean("0")  // true
Boolean("false") // true
Boolean([])   // true
Boolean({})   // true

Oui.
Même un tableau vide est true.

Pourquoi ?
Parce qu’il existe.
Et pour JS, exister = vrai.

-----------------------------------------------------------
4) typeof — LE DÉTECTIVE PAS PARFAIT
-----------------------------------------------------------

typeof 10        // "number"
typeof "yo"      // "string"
typeof true      // "boolean"

Mais :

typeof null // "object"

Bug vieux de 1995.
On vit avec.

---

Tableaux ?

typeof [] // "object"

Donc :

Array.isArray([]) // true

Toujours utiliser ça pour vérifier un array.

---

NaN ?

typeof NaN // "number"

Encore un piège.

Donc si tu veux vérifier un nombre valide :

function isValidNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

Sinon tu acceptes NaN comme nombre.
Et ça c’est dangereux.

-----------------------------------------------------------
5) LE PARSER SAFE (ANTI-CHAOS)
-----------------------------------------------------------

Un vrai dev ne fait jamais confiance à l’input.

Jamais.

function toSafeNumber(value, defaultValue = 0) {
  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return defaultValue;
  }

  return parsed;
}

Exemples :

toSafeNumber("50")      // 50
toSafeNumber("hello")   // 0
toSafeNumber(null)      // 0

C’est propre.
Prévisible.
Solide.

-----------------------------------------------------------
6) CAS RÉEL — FORMULAIRE DU MONDE SAUVAGE
-----------------------------------------------------------

let ageInput = "18years";

parseInt(ageInput) → 18

Mais :

Number(ageInput) → NaN

Donc selon ton besoin :
- Donnée propre attendue → Number
- Donnée sale utilisateur → parseInt + validation

Toujours comprendre le contexte.
Toujours.

-----------------------------------------------------------
EXERCICES 
-----------------------------------------------------------

EXO 1 — Le Faux Prix

let price = "199";

Corrige le bug pour que :
price + 1 donne 200.

---

EXO 2 — Nettoyeur de CSS

let size = "300px";

Transforme en 300.
Si invalide → retourne -1.

---

EXO 3 — Mindfuck Boolean

Explique pourquoi :

Boolean("false")
Boolean(" ")
Boolean([])
Boolean(0)

---

EXO 4 — Inspecteur Ultime

Crée :

function inspect(value)

Elle doit afficher :

- type réel
- estArray ?
- estNumberValide ?
- estFalsy ?

Test avec :

inspect(0)
inspect("0")
inspect([])
inspect(null)
inspect(NaN)

---

EXO 5 — Currency Boss

Crée :

function parseCurrency(value)

Elle doit :

- accepter "100$"
- accepter " 250 "
- refuser "abc"
- retourner un nombre valide
- sinon retourner null

---

===========================================================
RÉSUMÉ FINAL (VERSION SANS POÉSIE)
===========================================================

- Transformer AVANT d’utiliser
- Vérifier AVANT de faire confiance
- Utiliser ===
- Tester NaN correctement
- Ne jamais croire un input

Les types sont neutres.
C’est ton ignorance qui crée les bugs.

Si tu maîtrises ça,
tu écris du code propre.
Sinon tu écris du code fragile.

À toi de choisir ton camp.
*/
