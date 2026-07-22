---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PONT BITS ET MÉMOIRE

-> ~10 min

Avant d'attaquer `08_memory_performance/` (heap snapshots, GC, closures qui gardent la mémoire vivante), il te faut une image nette de **comment un nombre, une chaîne, un objet vivent réellement en RAM**. Sans cette image, "fuite mémoire" reste un mot. Avec, tu vois les octets partir.

## POURQUOI CE PONT EXISTE

Le module 07 t'a donné les mathématiques (arithmétique, modulo, virgule flottante). Le module 08 va te demander de raisonner en **octets, références, allocations**. Le saut est réel : passer de "5 + 3" à "cette closure garde vivante une variable de 5 Mo pendant 20 minutes" perd tout le monde s'il n'y a pas de palier.

Ce fichier est ce palier. 3 pages. Rien de plus.

## 1. UN NOMBRE, C'EST QUOI EN MÉMOIRE

En JavaScript, tout nombre non-BigInt est un **IEEE 754 double**, 64 bits, toujours.

- 1 bit de signe.
- 11 bits d'exposant.
- 52 bits de mantisse.

Conséquence directe : `0.1 + 0.2 !== 0.3`. Ce n'est pas un bug, c'est le format. Le module 07 l'a montré ; le module 08 t'expliquera comment ces 8 octets s'empilent quand tu crées un million de `Number`.

Drill mental : quand tu écris `const n = 3.14`, tu réserves **8 octets** en mémoire. Fois un million, c'est ~8 Mo. Retiens ce chiffre.

## 2. UNE RÉFÉRENCE VS UNE VALEUR

```
let a = 5          // a pointe vers une case qui contient la valeur 5
let b = a          // b pointe vers une AUTRE case qui contient 5 (copie)

let x = { v: 5 }   // x pointe vers un OBJET quelque part dans le heap
let y = x          // y pointe vers LE MÊME objet (pas de copie)
y.v = 42
console.log(x.v)   // 42
```

Schéma en tête :

```
Stack (rapide, petit)                Heap (lent, grand)
------------------                   ----------------
a = 5
b = 5
x -----> ------------------------->  { v: 42 }
y -------^
```

Les primitives (number, string, boolean, null, undefined, symbol, bigint) vivent conceptuellement "à côté" du code (stack). Les objets, tableaux, fonctions vivent dans le **heap**, et tu manipules des pointeurs.

Cette distinction est **la** clé pour comprendre les fuites mémoire du module 08 : une closure qui garde une référence maintient l'objet vivant dans le heap, même si le code qui l'a créé est terminé.

## 3. UN OBJET, C'EST COMBIEN D'OCTETS

Ordre de grandeur (V8, très approximatif) :

- Un objet vide `{}` : ~40-80 octets d'entête + slots.
- Un tableau `[]` vide : ~40 octets + longueur.
- Chaque propriété ajoutée : ~8-24 octets selon la classe cachée.
- Une closure : la taille du code + les variables capturées, même si elles semblent "hors scope".

Tu n'as pas besoin des chiffres exacts. Tu as besoin du **réflexe** : "un objet a un coût non nul, une closure garde ses variables vivantes, un tableau croît en réallouant".

## 4. GARBAGE COLLECTOR : LE CONTRAT

Le GC libère la mémoire des objets **inaccessibles** depuis les racines (variables globales, stack actif, closures encore référencées). Règle unique : **si rien ne pointe vers un objet, il est mort**. Si quelque chose pointe encore, il vit : même si tu penses que "c'est fini".

C'est pour ça qu'une closure qui capture une grosse variable est un piège : tant que la closure vit, la variable vit.

## 5. DRILL DE VÉRIFICATION AVANT DE PASSER À 08

Trois questions. Réponds en 30 secondes chacune, sans regarder :

1. Combien d'octets prend une variable `const n = 42` ?
2. Quand tu écris `let a = { x: 1 }; let b = a; b.x = 2`, que vaut `a.x` ? Pourquoi ?
3. Une closure qui capture un tableau de 10 000 entrées vit tant que quoi vit ?

Si les 3 réponses coulent (8 octets ; 2 car même référence ; tant que la closure elle-même est référencée), tu peux ouvrir `08_memory_performance/`. Sinon, relis ce fichier.

---

## OÙ CE PONT S'INSÈRE

- Vient après : `07_math_basics/` complet (représentation numérique).
- Prépare : `08_memory_performance/00_why_memory_performance.md`, puis `08_memory_performance/01_gc/01_gc_basics.md`.
- N'introduit pas d'API nouvelle. Uniquement le **modèle mental** que le reste du module 08 utilisera.
