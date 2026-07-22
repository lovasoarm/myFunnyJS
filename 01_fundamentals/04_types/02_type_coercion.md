---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# TYPE COERCION : CONVERSION IMPLICITE / EXPLICITE
Temps de lecture ~6 min

JavaScript est un langage **dynamique** (dynamique = les variables peuvent changer de type).

Donc JS convertit parfois les types automatiquement. Ça s'appelle la **coercion** → conversion automatique d'un type vers un autre.

Et c'est là que le chaos commence.

---

## 1) COERCION IMPLICITE (AUTOMATIQUE)

JS décide pour toi. Sans te demander. Comme un ami qui "aide" à ranger ta chambre.

```javascript
console.log("5" + 1); // "51"
```

Pourquoi ? Parce que `+` avec une string force la conversion en string. `1` devient `"1"`, donc `"5" + "1" = "51"`.

```javascript
console.log("5" - 1); // 4
```

Pourquoi ? Le `-` force une conversion en number. `"5"` devient `5`, donc `5 - 1 = 4`.

Résumé :
- `+` peut faire de la **concaténation** si une string est présente
- `-`, `*`, `/` forcent toujours un calcul **numérique**

Ça sent le piège. Parce que c'en est un.

---

## 2) `==` VS `===`

```javascript
console.log(5 == "5"); // true
console.log(5 === "5"); // false
```

- `==` compare **après coercion** : JS convertit `"5"` en `5` avant de comparer
- `===` compare le **type ET la valeur** : aucune conversion, aucune surprise

> Règle simple : utilise toujours `===` sauf si tu sais **exactement** ce que tu fais. Et même là, utilise `===`.

---

## 3) LES CAS TORDUS

```javascript
console.log(false == 0);    // true
console.log("" == 0);     // true
console.log(null == undefined); // true
```

Pourquoi ? JS applique des règles internes de conversion :
- `false` → devient `0`
- `""` → devient `0`
- `null` et `undefined` sont considérés égaux entre eux avec `==`

```javascript
console.log(null === undefined); // false
```

Types différents. `===` ne ment pas.

---

## 4) COERCION EXPLICITE (PROPRE)

Tu contrôles la conversion. Pas de magie cachée.

```javascript
// String vers Number
Number("10");  // 10
parseInt("10"); // 10

// Number vers String
String(10); // "10"

// Boolean
Boolean(1); // true
Boolean(0); // false
```

C'est propre. C'est prévisible. Fais-le toi-même plutôt que de laisser JS improviser.

---

## 5) TRUTHY / FALSY

En JS, certaines valeurs sont considérées comme `false` dans un contexte booléen.

**Falsy** : les 6 seules valeurs qui valent `false` :

```
false, 0, "", null, undefined, NaN
```

**Tout le reste est truthy** : y compris `"0"`, `[]`, `{}`.

```javascript
if ("hello") {
 console.log("C'est vrai"); // s'exécute : string non vide = truthy
}
if ("0") {
 console.log("Aussi vrai"); // s'exécute : "0" est une string non vide
}
if (0) {
 console.log("Jamais"); // ne s'exécute pas : 0 est falsy
}
```

> `"0"` est truthy. `0` est falsy. Deux caractères de différence, comportement opposé. Bienvenue en JS.

---

## 6) POURQUOI C'EST CRUCIAL ?

- Éviter les bugs invisibles
- Comprendre les conditions
- Maîtriser les comparaisons
- Comprendre les APIs et formulaires

Si tu ne maîtrises pas la coercion, tu **subis** JavaScript.

---

## MISSION TYPE CHAOS

**Étape 1 : observe et comprends chaque résultat :**

```javascript
console.log("10" + 5);  // "105" ← string, pas number
console.log("10" - 5);  // 5
console.log(true + 1);  // 2
console.log(false + 1); // 1
```

**Étape 2 : compare :**

```javascript
console.log(null == 0);     // false
console.log(null == undefined); // true
console.log(null === undefined); // false
```

**Étape 3 : crée une variable et teste la condition :**

```javascript
let input = "0";
if (input) {
 console.log("truthy");
} else {
 console.log("falsy");
}
```

Comprends pourquoi ça passe ou pas. `"0"` n'est pas `0`.

```javascript
// Ton code ici
```

> Ici tu ne dois pas juste voir le résultat. Tu dois comprendre la conversion. JS ne devine pas : il applique des règles. Et ces règles, tu dois les dominer.

---

## RÉSUMÉ

La coercition implicite (conversion automatique) : JS convertit les types selon des règles précises quand les opérandes ne correspondent pas. Ces règles ne sont pas aléatoires, elles sont spécifiées, mais elles surprennent si tu ne les connais pas.

`==` applique la coercition. `===` ne convertit rien : compare type ET valeur. En prod, `===` partout sauf cas exceptionnels.

Falsy values : `0`, `""`, `null`, `undefined`, `NaN`, `false`. Tout le reste est truthy : y compris `"0"`, `[]`, `{}`.
