---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# BIT MANIPULATION : MANIPULER LES DONNÉES À L'OS
Temps de lecture ~9 min

La plupart des devs n'ont jamais écrit une seule ligne de manipulation de bits. Puis un jour ils tombent sur un bug de permissions, un système de flags, ou un algo de compression : et ils réalisent qu'ils ne comprennent pas ce qui se passe sous leur code.

Les bits ne sont pas une curiosité de bas niveau. Ils sont dans les permissions Unix, les masques réseau, les flags d'état, les couleurs RGBA, et les accélérateurs d'algo. Savoir les manipuler, c'est pouvoir lire et écrire le vrai langage de la machine.

---

## 1) LES BASES : CE QU'EST UN BIT

Un nombre entier en mémoire est une séquence de bits. En JS, les opérations bitwise travaillent sur des entiers 32 bits.

```
13 en binaire : 0000 0000 0000 0000 0000 0000 0000 1101
                         ^ ^ ^
                         8 4 1 = 13
```

**Convertir :**

```js
(13).toString(2); // "1101":décimal vers binaire
parseInt("1101", 2); // 13  :binaire vers décimal
```

---

## 2) LES 6 OPÉRATEURS BITWISE

### AND `&` : les deux bits doivent être 1

```js
// 1101 (13)
// 1010 (10)
// ----
// 1000 (8)

13 & 10; // 8

// Usage classique : masquage:garder seulement certains bits
const MASK_ROUGE = 0xff0000; // 1111 1111 0000 0000 0000 0000
const couleur = 0xff6b35; // une couleur RGBA quelconque
const rouge = (couleur & MASK_ROUGE) >> 16; // extraire le canal rouge
```

### OR `|` : au moins un bit est 1

```js
// 1010 (10)
// 0101 (5)
// ----
// 1111 (15)

10 | 5; // 15

// Usage : activer un flag
let permissions = 0b0000; // aucune permission
const LIRE = 0b0001;
const ECRIRE = 0b0010;

permissions = permissions | LIRE; // 0b0001:peut lire
permissions = permissions | ECRIRE; // 0b0011:peut lire et écrire
```

### XOR `^` : exactement un bit est 1

```js
// 1010 (10)
// 1100 (12)
// ----
// 0110 (6)

10 ^ 12; // 6

// XOR avec lui-même = 0:utilisé pour annuler
5 ^ 5; // 0

// XOR pour toggle : si le bit est 1, il passe à 0 et vice versa
let flag = 0b0101;
flag = flag ^ 0b0100; // toggle le bit 2 : 0b0101 ^ 0b0100 = 0b0001
```

### NOT `~` : inverse tous les bits

```js
~5; // -6 en JS (complément à deux)
~0; // -1

// usage courant : ~indexOf retourne 0 si non trouvé (falsy)
const liste = ["Rick", "Daryl", "Michonne"];
if (~liste.indexOf("Daryl")) {
 console.log("Daryl est dans le groupe");
}
// mais en pratique : utilise .includes():c'est plus lisible
```

### Left Shift `<<` : décale les bits vers la gauche

Chaque décalage d'un bit = multiplication par 2.

```js
1 << 0; // 1  = 1
1 << 1; // 2  = 1 * 2
1 << 2; // 4  = 1 * 4
1 << 3; // 8  = 1 * 8
1 << 10; // 1024 = 1 * 1024

// utile pour définir des flags proprement
const PERMISSIONS = {
 LIRE: 1 << 0, // 0001
 ECRIRE: 1 << 1, // 0010
 EXECUTER: 1 << 2, // 0100
 ADMIN: 1 << 3, // 1000
};
```

### Right Shift `>>` : décale vers la droite

Chaque décalage = division entière par 2.

```js
8 >> 1; // 4
8 >> 2; // 2
8 >> 3; // 1
```

---

## 3) SYSTÈME DE PERMISSIONS AVEC DES FLAGS

C'est l'usage le plus courant en prod. Un seul nombre entier encode plusieurs états indépendants.

```js
// chaque permission = un bit différent
const PERM = {
 LIRE: 0b0001, // 1
 ECRIRE: 0b0010, // 2
 SUPPRIMER: 0b0100, // 4
 ADMIN: 0b1000, // 8
};

// Activer une permission
const activer = (permissions, flag) => permissions | flag;

// Désactiver une permission
const desactiver = (permissions, flag) => permissions & ~flag;

// Vérifier si une permission est active
const aPermission = (permissions, flag) => (permissions & flag) !== 0;

// Toggle
const toggle = (permissions, flag) => permissions ^ flag;

// --- En action ---
let user = 0; // aucune permission

user = activer(user, PERM.LIRE); // 0001
user = activer(user, PERM.ECRIRE); // 0011

aPermission(user, PERM.LIRE); // true
aPermission(user, PERM.SUPPRIMER); // false:pas de permission suppression

user = desactiver(user, PERM.ECRIRE); // 0001:revient à lire seulement
```

Ce pattern est partout :

- permissions Unix (rwx = 3 bits)
- flags CSS (`font-style: bold | italic | underline`)
- états de composants React
- options de configuration

---

## 4) MANIPULATION DE COULEURS RGBA

Les couleurs en HTML sont souvent stockées comme un seul entier 32 bits.

```js
// couleur #FF6B35 = rouge:255, vert:107, bleu:53
const rgb = (r, g, b) => (r << 16) | (g << 8) | b;

const orange = rgb(255, 107, 53); // 16LE3535... peu importe la valeur
// 255 << 16 = FF0000
// 107 << 8 = 006B00
// 53     = 000035
// OR ensemble => FF6B35

// Extraire les composantes
const rouge = (couleur) => (couleur >> 16) & 0xff;
const vert = (couleur) => (couleur >> 8) & 0xff;
const bleu = (couleur) => couleur & 0xff;

rouge(orange); // 255
vert(orange); // 107
bleu(orange); // 53
```

---

## 5) TRICKS D'ALGO AVEC LES BITS

### Vérifier si un nombre est une puissance de 2

```js
// une puissance de 2 a exactement un seul bit à 1
// n & (n-1) enlève le bit le plus bas
// si le résultat est 0, il n'y avait qu'un seul bit => puissance de 2

const estPuissanceDe2 = (n) => n > 0 && (n & (n - 1)) === 0;

estPuissanceDe2(4); // true : 0100 & 0011 = 0
estPuissanceDe2(8); // true : 1000 & 0111 = 0
estPuissanceDe2(6); // false : 0110 & 0101 = 0100 ≠ 0
```

### Compter les bits à 1 (popcount)

```js
// utile pour les systèmes de votes, les distances de Hamming
const compterBits = (n) => {
 let count = 0;
 while (n > 0) {
  count += n & 1; // vérifie le bit de droite
  n >>= 1; // décale vers la droite
 }
 return count;
};

compterBits(7); // 3 : 0111 => 3 bits à 1
compterBits(13); // 3 : 1101 => 3 bits à 1
```

### Swap sans variable temporaire

```js
// XOR swap : classique des entretiens
let a = 5,
 b = 9;
a = a ^ b; // a = 5^9 = 12
b = a ^ b; // b = 12^9 = 5 (b récupère l'ancienne valeur de a)
a = a ^ b; // a = 12^5 = 9 (a récupère l'ancienne valeur de b)
// résultat : a=9, b=5
```

---

## EXERCICES

## EXO 1 : Le système de jutsu de Naruto

Chaque ninja a des capacités encodées dans un seul entier :

```js
const CAPACITES = {
 NINJUTSU: 1 << 0,
 TAIJUTSU: 1 << 1,
 GENJUTSU: 1 << 2,
 SENJUTSU: 1 << 3,
 KURAMA: 1 << 4,
};
```

Implémenter :

- `creerNinja(capacites)` : prend un tableau de flags, retourne l'entier encodé
- `peutUtiliser(ninja, capacite)` : retourne `true/false`
- `apprendreCapacite(ninja, capacite)` : retourne le nouveau ninja
- `perdCapacite(ninja, capacite)` : retourne le ninja sans cette capacité

---

## EXO 2 : Parser une couleur hex

Écrire `parseHex(hex)` qui prend une couleur au format `"#FF6B35"` et retourne `{ r, g, b }`. Écrire `toHex(r, g, b)` qui fait l'inverse. Utiliser uniquement des opérations bitwise.

---

## EXO 3 : Détecteur de configuration réseau

Un masque réseau est un entier 32 bits. Écrire `compterBitsReseau(masque)` qui compte le nombre de bits à 1 dans le masque (ex: `255.255.255.0` = 24 bits réseau).

---

## RÉSUMÉ

Les bits permettent d'encoder plusieurs états dans un seul entier. Le pattern flags + masques (`|` pour activer, `&` pour vérifier, `^` pour toggle, `& ~flag` pour désactiver) se retrouve dans les permissions, les couleurs, les options de config. Le shift `<<` construit des flags propres. Et XOR a des propriétés uniques : `a ^ a = 0`, `a ^ 0 = a` : ce sont les bases des algos de swap et de toggle. C'est du bas niveau, mais c'est du bas niveau qui s'utilise en prod.
