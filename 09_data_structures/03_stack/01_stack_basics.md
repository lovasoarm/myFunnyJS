---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# STACK : LIFO : LE DERNIER ENTRÉ EST LE PREMIER SORTI
Temps de lecture ~8 min

Tu as déjà utilisé une stack sans le savoir. La call stack de JS en est une. L'historique de navigation dans ton navigateur en est une. Le Ctrl+Z de ton éditeur en est une.

Le principe est brutal : on peut seulement interagir avec le **sommet**. Ajouter en haut. Retirer du haut. Voir ce qu'il y a en haut. C'est tout.

Cette contrainte est sa force : elle garantit un ordre d'accès prévisible.

---

## 1) LA STRUCTURE LIFO

LIFO : Last In, First Out. Le dernier élément ajouté est le premier retiré.

```
push("Naruto")   push("Sakura")  push("Sasuke")
   ↓         ↓        ↓
 ┌────────┐    ┌────────┐    ┌────────┐
 │ Naruto  │    │Sakura │    │ Sasuke │ <-- sommet (top)
 └────────┘    ├────────┤    ├────────┤
          │ Naruto  │    │Sakura │
          └────────┘    ├────────┤
                  │ Naruto  │
                  └────────┘

pop() retourne "Sasuke"
pop() retourne "Sakura"
pop() retourne "Naruto"
```

L'ordre de sortie est exactement l'inverse de l'ordre d'entrée.

---

## 2) IMPLÉMENTATION : STACK SUR TABLEAU

La façon la plus simple en JS : utiliser un tableau et traiter uniquement sa fin.

```js
class Stack {
 constructor() {
  this.items = [] // le stockage interne
 }

 // ajouter au sommet : O(1) amorti
 push(value) {
  this.items.push(value)
 }

 // retirer du sommet : O(1)
 pop() {
  if (this.isEmpty()) return null // pas d'erreur silencieuse : on retourne null
  return this.items.pop()
 }

 // regarder le sommet sans retirer : O(1)
 peek() {
  if (this.isEmpty()) return null
  return this.items[this.items.length - 1]
 }

 // vérifier si la stack est vide
 isEmpty() {
  return this.items.length === 0
 }

 // taille actuelle
 get size() {
  return this.items.length
 }

 // affichage : sommet en premier
 print() {
  return [...this.items].reverse().join(" | ")
 }
}
```

---

## 3) LA CALL STACK DE JS : UNE VRAIE STACK

Quand JS exécute du code, il empile les appels de fonctions sur la call stack. Chaque fonction poussée est retirée quand elle se termine.

```js
function third() {
 console.log("je suis en haut") // troisième à s'exécuter
}

function second() {
 third() // on pousse third() sur la stack
}

function first() {
 second() // on pousse second() sur la stack
}

first() // on pousse first() sur la stack
```

```
Évolution de la call stack :

push first()  push second()  push third()  pop third()  pop second()  pop first()
┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  vide
│ first() │  │ second() │  │ third() │  │ second() │  │ first() │
└─────────┘  ├──────────┤  ├──────────┤  ├──────────┤  └──────────┘
        │ first() │  │ second() │  │ first() │
        └──────────┘  ├──────────┤  └──────────┘
                │ first() │
                └──────────┘
```

Le "Maximum call stack size exceeded" ? C'est quand la stack déborde parce qu'une récursion n'a pas de cas de base.

---

## 4) IMPLÉMENTATION AVEC LINKED LIST : O(1) GARANTI

La version tableau utilise `push/pop` sur la fin du tableau : O(1) amorti. Mais "amorti" veut dire qu'occasionnellement JS doit réallouer le tableau : un spike de latence.

Avec une linked list, c'est toujours O(1) strict : on manipule juste le head.

```js
class Node {
 constructor(value) {
  this.value = value
  this.next = null
 }
}

class Stack {
 constructor() {
  this.top = null  // le sommet : le head de la liste
  this.size = 0
 }

 push(value) {
  const node = new Node(value)
  node.next = this.top // le nouveau node pointe vers l'ancien sommet
  this.top = node    // le nouveau node devient le sommet
  this.size++
 }

 pop() {
  if (!this.top) return null
  const value = this.top.value
  this.top = this.top.next // le sommet descend d'un cran
  this.size--
  return value
 }

 peek() {
  return this.top ? this.top.value : null
 }

 isEmpty() {
  return this.top === null
 }
}
```

```
push("A") : [A] --> null    top = A
push("B") : [B] --> [A] --> null  top = B
push("C") : [C] --> [B] --> [A] --> null  top = C
pop() :  [B] --> [A] --> null  retourne "C", top = B
```

---

## 5) LES TROIS OPÉRATIONS EN PRATIQUE

```js
const history = new Stack()

// simuler des appels d'API
history.push({ url: "/api/players", status: 200 })
history.push({ url: "/api/match/42", status: 200 })
history.push({ url: "/api/goals", status: 404 })

// voir la dernière requête sans la retirer
console.log(history.peek())
// { url: "/api/goals", status: 404 }

// retirer les requêtes en ordre inverse (LIFO)
console.log(history.pop()) // { url: "/api/goals", status: 404 }
console.log(history.pop()) // { url: "/api/match/42", status: 200 }
console.log(history.size)  // 1

// vérifier si la stack est vide
console.log(history.isEmpty()) // false
history.pop()
console.log(history.isEmpty()) // true
```

---

## EXERCICES

## EXO 1 : Stack basique, cas limites
_~10 min_

Implémente la Stack (version tableau ou linked list, au choix). Teste ces cas :
- `pop()` sur une stack vide : doit retourner `null`, pas crasher
- `peek()` sur une stack vide : même chose
- Push 1000 éléments puis pop les 1000 : vérifie que l'ordre est bien inversé
- `size` après chaque opération

## EXO 2 : La call stack à la main
_~15 min_

Donne la séquence exacte d'état de la call stack pour ce code. Note chaque push et chaque pop, dans l'ordre.

```js
function countdown(n) {
 if (n === 0) {
  console.log("Fini")
  return
 }
 console.log(n)
 countdown(n - 1)
}

countdown(3)
```

Qu'est-ce qui se passe si tu appelles `countdown` sans condition d'arrêt ?

## EXO 3 : Inverser un string avec une stack
_~10 min_

Sans utiliser `split().reverse().join()`, inverse un string en utilisant uniquement une Stack. Contrainte : chaque caractère est poussé un par un, puis retiré un par un dans un nouveau string.

---

## RÉSUMÉ

La stack c'est LIFO : le dernier entré ressort en premier. Trois opérations : `push` (ajouter au sommet), `pop` (retirer du sommet), `peek` (voir sans retirer). Tout est O(1). La call stack de JS est une vraie stack : les fonctions s'empilent et se dépilent. Implémenter avec un tableau c'est simple et suffisant. Implémenter avec une linked list garantit un O(1) strict sans pic de réallocation. La valeur d'une stack vient de sa contrainte : on ne peut accéder qu'au sommet. C'est cette limite qui rend l'ordre prévisible.
