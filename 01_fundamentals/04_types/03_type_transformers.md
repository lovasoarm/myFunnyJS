---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# TYPE TRANSFORMERS
Temps de lecture ~7 min

_Transformer. Vérifier. Survivre._

JavaScript est **dynamique** : une variable peut changer de type quand elle veut.

Donc ton code peut penser avoir un nombre… et en réalité c'est une string déguisée.

Bienvenue dans le monde où `"100" + 20 = "10020"`.

Si tu ne contrôles pas les types, les types te trollent. On va régler ça.

---

## 1) STRING : FORCER LE MODE TEXTE

Pourquoi convertir en string ? Parce que le monde extérieur parle texte : HTML, API, stockage, logs.

```javascript
String(value);
value.toString();
```

Mais attention :

```javascript
String(null);    // "null"   ← ok
String(undefined); // "undefined" ← ok
null.toString();  // BOOM erreur
undefined.toString(); // BOOM erreur
```

**Conclusion sauvage :** si tu n'es pas sûr de ce que tu as → utilise `String()`.

```javascript
let score = 99;
let display = String(score); // "99" : prêt à être affiché sans surprise
```

---

## 2) NUMBER : LÀ OÙ LES BUGS NAISSENT

Tu récupères un input :

```javascript
let price = "200";
price + 50;     // "20050" → catastrophe silencieuse
Number(price) + 50; // 250  → correct
```

Les outils :

```javascript
Number("42");    // 42
Number("42px");   // NaN → trop strict, abandonne au moindre caractère bizarre
parseInt("42px");  // 42 → lit jusqu'à ce que ça sente mauvais
parseFloat("3.14px"); // 3.14
```

| Méthode    | Comportement                    |
| -------------- | --------------------------------------------------- |
| `Number()`   | strict : 100% propre sinon `NaN`          |
| `parseInt()`  | tolérant : lit jusqu'au premier caractère invalide |

---

### NaN : le type qui ne s'aime pas lui-même

`NaN` = Not a Number = conversion foirée.

Et le pire :

```javascript
NaN === NaN; // false
```

Oui. Même `NaN` refuse d'être égal à lui-même. On le teste donc avec :

```javascript
isNaN("hello");     // true ← convertit d'abord, puis teste
Number.isNaN("hello"); // false ← teste strictement, sans conversion
Number.isNaN(NaN);   // true ← le seul vrai positif
```

> `Number.isNaN()` est plus fiable : il retourne `true` **uniquement** si la valeur est réellement `NaN`, sans conversion implicite.

---

## 3) BOOLEAN : UN MOT SUR LA CONVERSION

```javascript
Boolean(value);
// ou
!!value;
```

Pourquoi `!!` marche ? `!value` inverse, `!!value` remet droit. Résultat = boolean pur.

> Les valeurs falsy et truthy sont expliquées en détail dans `02_type_coercion.md` -> mémorise-les si ce n'est pas fait, tout ce qui suit en dépend.

---

## 4) `typeof` : LE DÉTECTIVE PAS PARFAIT

```javascript
typeof 10;  // "number"
typeof "yo"; // "string"
typeof true; // "boolean"
```

Mais :

```javascript
typeof null; // "object"
```

Bug vieux de 1995. On vit avec. On ne comprend plus vraiment pourquoi. On continue.

```javascript
typeof []; // "object" : pas très utile
typeof NaN; // "number" : scandaleux
```

Pour les tableaux, utilise toujours :

```javascript
Array.isArray([]); // true
```

Et pour un nombre vraiment valide :

```javascript
function isValidNumber(value) {
 return typeof value === "number" && !Number.isNaN(value);
}
```

Sans ça, tu acceptes `NaN` comme nombre. Et ça, c'est dangereux.

---

## 5) LE PARSER SAFE (ANTI-CHAOS)

Un vrai dev ne fait jamais confiance à l'input. Jamais.

```javascript
function toSafeNumber(value, defaultValue = 0) {
 const parsed = Number(value);
 if (Number.isNaN(parsed)) {
  return defaultValue;
 }
 return parsed;
}

toSafeNumber("50");  // 50
toSafeNumber("hello"); // 0
toSafeNumber(null);  // 0
```

Propre. Prévisible. Solide.

---

## 6) CAS RÉEL : FORMULAIRE DU MONDE SAUVAGE

```javascript
let ageInput = "18years";
parseInt(ageInput); // 18 ← extrait ce qu'il peut
Number(ageInput);  // NaN ← refuse car ce n'est pas propre
```

Selon le contexte :
- **Donnée propre attendue** → `Number()`
- **Donnée sale utilisateur** → `parseInt()` + validation

Toujours comprendre le contexte. Toujours.

---

## EXERCICES

## EXO 1 : Le Faux Prix

```javascript
let price = "199";
```

Corrige le bug pour que `price + 1` donne `200`.

---

## EXO 2 : Nettoyeur de CSS

```javascript
let size = "300px";
```

Transforme en `300`. Si invalide → retourne `-1`.

---

## EXO 3 : Mindfuck Boolean

Explique pourquoi chacun de ces résultats est ce qu'il est :

```javascript
Boolean("false"); // ?
Boolean(" ");   // ?
Boolean([]);   // ?
Boolean(0);    // ?
```

---

## EXO 4 : Inspecteur Ultime

Crée une fonction `inspect(value)` qui affiche :
- type réel
- `estArray` ?
- `estNumberValide` ?
- `estFalsy` ?

Teste avec :

```javascript
inspect(0);
inspect("0");
inspect([]);
inspect(null);
inspect(NaN);
```

---

## EXO 5 : Currency Boss

Crée une fonction `parseCurrency(value)` qui :
- accepte `"100$"`
- accepte `" 250 "`
- refuse `"abc"`
- retourne un nombre valide
- sinon retourne `null`

---

## RÉSUMÉ FINAL

- Transformer **avant** d'utiliser
- Vérifier **avant** de faire confiance
- Utiliser `===`
- Tester `NaN` avec `Number.isNaN()`
- Ne jamais croire un input à l'aveugle

Les types sont neutres. C'est la méconnaissance des règles qui crée les bugs : et maintenant tu les connais.
