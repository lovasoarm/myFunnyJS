/* STOP.
   As-tu fini l'exercice sans regarder ?
   As-tu écrit ton propre exemple ?
   Peux-tu réexpliquer sans regarder ce fichier ?
   Si non, ferme ce fichier maintenant. */
<!-- ====================================================== -->
<!-- STOP. AVERTISSEMENT FORT. NE LIS PAS SANS AVOIR ESSAYÉ. -->
<!-- CHECKLIST AVANT DE LIRE -->
<!-- As-tu terminé l'exercice sans regarder ? -->
<!-- As-tu écrit un exemple personnel ? -->
<!-- Peux-tu réexpliquer le concept sans le code ? -->
<!-- Si non, referme ce fichier et essaie encore. -->
<!-- ====================================================== -->

//EXO 1
let price = "199";
let validatePrice = Number(price);
console.log(validatePrice + 1);

//EXO 2
function validateSize(value) {
  const parsed = parseInt(value);
  if (Number.isNaN(parsed)) return -1;
  return parsed;
}
console.log(validateSize("300px")); // 300
console.log(validateSize("abc"));   // -1

//EXO 3
Boolean("false"); // true, ya un truc dedans
Boolean(" "); // true, ya un truc (espace)
Boolean([]); //true, ya un tableau
Boolean(0); //false, 0 consideré comme falsy

//EXO 4
function inspect(value) {
  console.log("--- inspect(" + value + ") ---");
  console.log("Type réel       :", typeof value);
  console.log("estArray        :", Array.isArray(value));
  console.log("estNumberValide :", typeof value === "number" && !Number.isNaN(value),
  );
  console.log("estFalsy        :", !value);
}

//Résultat

inspect(0);
// Type réel       : number
// estArray        : false
// estNumberValide : true
// estFalsy        : true   ← 0 est falsy !

inspect("0");
// Type réel       : string
// estArray        : false
// estNumberValide : false
// estFalsy        : false  ← "0" est truthy !

inspect([]);
// Type réel       : object
// estArray        : true
// estNumberValide : false
// estFalsy        : false  ← [] est truthy !

inspect(null);
// Type réel       : object  ← le fameux bug JS
// estArray        : false
// estNumberValide : false
// estFalsy        : true

inspect(NaN);
// Type réel       : number  ← autre piège JS
// estArray        : false
// estNumberValide : false
// estFalsy        : true

//EXO 5
function parseCurrency(value) {
  if (typeof value !== "string") return null;

  // Supprime espaces et symboles comme $, €, £...
  let cleaned = value.trim().replace(/[^0-9.]/g, ""); //replace() : Remplace une occurrence (ou plusieurs) dans une chaîne et retourne une nouvelle chaîne; l'originale n'est pas modifiée.
  //NB :
  //.trim() → supprime les espaces autour
  //.replace(/[^0-9.]/g, "") → garde uniquement les chiffres et le point, supprime tout le reste ($, lettres, etc.)

  let number = parseFloat(cleaned); //parsFloat est plus précis ici

  if (!isValidNumber(number)) return null;

  return number;
}

function isValidNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

console.log(parseCurrency("100$")); // 100
console.log(parseCurrency(" 250 ")); // 250
console.log(parseCurrency("abc")); // null
console.log(parseCurrency(2)); // null ← c'est pas une string
