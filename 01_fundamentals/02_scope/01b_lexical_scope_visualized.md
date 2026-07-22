---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# 01b : Scope lexical, en images
Temps de lecture ~5 min

Avant les closures, faut voir. Trois niveaux, trois schémas.

## Niveau 1 : Scope global

```
+-----------------------------+
| GLOBAL           |
|  name = "Kakashi"     |
+-----------------------------+
```

Une variable, un scope, zéro drama.

## Niveau 2 : Scope de fonction

```
+-----------------------------+
| GLOBAL           |
|  village = "Konoha"    |
|               |
|  function jutsu() {    |
|  +----------------------+ |
|  | LOCAL jutsu     | |
|  |  power = 9000    | |
|  |  (voit village)   | |
|  +----------------------+ |
|  }             |
+-----------------------------+
```

`jutsu` voit `village` (parent). L'inverse est faux : `village` ne voit pas `power`.

## Niveau 3 : Scope imbriqué

```
GLOBAL     : hokage
 outer()   : squad
  inner()  : chakra  -> voit chakra, squad, hokage
```

La règle : on cherche du plus proche au plus loin. Trouvé = arrêt. Pas trouvé = `ReferenceError`.

## Ce que l'analogie cache

"Lexical" veut dire : décidé à l'écriture du code, pas à l'exécution. Où la fonction est **définie** compte, pas où elle est **appelée**. C'est ce qui rend les closures puissantes (et piégeuses).

## Mission

Dessine sur papier le scope chain de ce code, avant de lancer :

```js
const a = 1
function f() {
 const b = 2
 function g() {
  const c = 3
  return a + b + c
 }
 return g
}
```
