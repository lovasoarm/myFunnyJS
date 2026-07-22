---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# STACK MISSIONS : PARENTHÈSES, HISTORIQUE, UNDO/REDO
Temps de lecture ~9 min

La stack n'est pas juste une structure académique. Elle résout trois catégories de problèmes réels que tu croises en prod ou en entretien.

Mission 1 : valider que des symboles ouvrants/fermants sont équilibrés.
Mission 2 : simuler l'historique de navigation d'un navigateur.
Mission 3 : implémenter undo/redo dans un éditeur.

Ces trois problèmes ont un point commun : ils ont besoin de "se souvenir de l'état précédent" pour revenir en arrière. Et c'est exactement ce pour quoi la stack est faite.

---

## 1) PARENTHÈSES BALANCÉES

**Le problème** : un string peut contenir des parenthèses, crochets, accolades. Est-ce qu'ils sont bien fermés dans le bon ordre ?

```
"(())"     → valide
"([{}])"    → valide
"([)]"     → invalide (ordre de fermeture incorrect)
"((("     → invalide (non fermé)
"{[]}"     → valide
```

**L'algorithme** :
- ouvrant `(`, `[`, `{` → `push` sur la stack
- fermant `)`, `]`, `}` → `pop` la stack et vérifier que ça correspond
- à la fin : la stack doit être vide

```js
function isBalanced(str) {
 const stack = []

 // table de correspondance : fermant --> ouvrant attendu
 const pairs = { ")": "(", "]": "[", "}": "{" }
 const closers = new Set([")", "]", "}"])
 const openers = new Set(["(", "[", "{"])

 for (const char of str) {
  if (openers.has(char)) {
   // ouvrant : on empile
   stack.push(char)
  } else if (closers.has(char)) {
   // fermant : on vérifie que le sommet correspond
   if (stack.length === 0 || stack[stack.length - 1] !== pairs[char]) {
    return false // fermant sans ouvrant, ou mauvaise paire
   }
   stack.pop() // la paire est valide, on retire l'ouvrant
  }
  // les autres caractères sont ignorés
 }

 return stack.length === 0 // tout fermé = stack vide
}

// tests
console.log(isBalanced("({[]})"))  // true
console.log(isBalanced("([)]"))   // false
console.log(isBalanced("{[}"))    // false
console.log(isBalanced(""))     // true (vide = valide)

// cas réel : vérifier du code JS
const code = `
function fight(ninja) {
 if (ninja.chakra > 0) {
  return activate(ninja)
 }
}
`
console.log(isBalanced(code)) // true
```

**Pourquoi une stack ?** Parce que le dernier ouvrant doit être fermé en premier. LIFO. Exactement ce qu'on veut.

---

## 2) HISTORIQUE DE NAVIGATION

**Le problème** : simuler le comportement de back/forward d'un navigateur. Chaque visite push dans l'historique. Back dépile la page courante et la met dans une stack "forward". Forward fait l'inverse.

```
visit("google.com")
visit("youtube.com")
visit("twitch.tv")
back()      → retourne sur youtube.com
back()      → retourne sur google.com
forward()    → retourne sur youtube.com
visit("reddit.com") → efface le forward history (comme un vrai navigateur)
```

```js
class Browser {
 constructor() {
  this.backStack = []  // pages visitées
  this.forwardStack = [] // pages pour aller en avant
  this.current = null
 }

 visit(url) {
  if (this.current) {
   this.backStack.push(this.current) // page courante devient "précédente"
  }
  this.current = url
  this.forwardStack = [] // visiter une nouvelle page efface le forward
 }

 back() {
  if (this.backStack.length === 0) return // déjà au début
  this.forwardStack.push(this.current)  // page courante va dans forward
  this.current = this.backStack.pop()   // on dépile la précédente
  return this.current
 }

 forward() {
  if (this.forwardStack.length === 0) return // rien à avancer
  this.backStack.push(this.current)      // page courante va dans back
  this.current = this.forwardStack.pop()    // on dépile la suivante
  return this.current
 }

 status() {
  return {
   current: this.current,
   canGoBack: this.backStack.length > 0,
   canGoForward: this.forwardStack.length > 0
  }
 }
}

// simulation
const browser = new Browser()
browser.visit("sakura.cook")
browser.visit("sasuke.dojo")
browser.visit("naruto.captain")

console.log(browser.status())
// { current: "naruto.captain", canGoBack: true, canGoForward: false }

browser.back()
console.log(browser.status())
// { current: "sasuke.dojo", canGoBack: true, canGoForward: true }

browser.back()
console.log(browser.status())
// { current: "sakura.cook", canGoBack: false, canGoForward: true }

browser.visit("kakashi.navigator") // nouvelle visite : forward effacé
console.log(browser.status())
// { current: "kakashi.navigator", canGoBack: true, canGoForward: false }
```

Deux stacks pour un problème. C'est souvent comme ça que les structures se combinent.

---

## 3) UNDO / REDO

**Le problème** : un éditeur de texte (ou un système de modifications) doit pouvoir annuler et réappliquer des actions.

```
type("Naruto")   → state: "Naruto"
type(" Uzumaki")  → state: "Naruto Uzumaki"
undo()       → state: "Naruto"
undo()       → state: ""
redo()       → state: "Naruto"
type(" Shippuden") → state: "Naruto Shippuden" (redo history effacé)
```

Le principe : chaque action est poussée dans une `undoStack`. Undo dépile la dernière action et la push dans `redoStack`. Redo fait l'inverse.

```js
class Editor {
 constructor() {
  this.content = ""
  this.undoStack = [] // historique des états précédents
  this.redoStack = [] // états annulés (disponibles pour redo)
 }

 // sauvegarder l'état avant modification
 _saveState() {
  this.undoStack.push(this.content)
  this.redoStack = [] // toute nouvelle action efface le redo
 }

 type(text) {
  this._saveState()
  this.content += text
 }

 delete(count) {
  this._saveState()
  this.content = this.content.slice(0, -count)
 }

 undo() {
  if (this.undoStack.length === 0) return
  this.redoStack.push(this.content)   // état courant → redo
  this.content = this.undoStack.pop()  // état précédent → courant
 }

 redo() {
  if (this.redoStack.length === 0) return
  this.undoStack.push(this.content)   // état courant → undo
  this.content = this.redoStack.pop()  // état annulé → courant
 }

 get state() {
  return this.content
 }
}

// simulation
const editor = new Editor()
editor.type("Breaking ")
editor.type("Bad")
console.log(editor.state) // "Breaking Bad"

editor.undo()
console.log(editor.state) // "Breaking "

editor.undo()
console.log(editor.state) // ""

editor.redo()
console.log(editor.state) // "Breaking "

editor.type("Good")  // nouvelle action : redo effacé
console.log(editor.state) // "Breaking Good"

editor.redo() // rien à redo
console.log(editor.state) // "Breaking Good"
```

**Note** : cet exemple stocke les **états complets**. En prod, on stockerait les **actions** (avec un apply et un reverse), pas les états : pour économiser la mémoire sur des documents volumineux.

---

## 4) LE PATTERN COMMUN

Ces trois missions utilisent la même logique fondamentale :

```
Parenthèses : empiler les ouvrants, vérifier en dépilant les fermants
Navigation  : empiler les pages visitées, dépiler pour revenir
Undo/Redo  : empiler les états, dépiler pour annuler
```

La stack c'est la mémoire du passé récent. Elle garde l'ordre chronologique inversé : le plus récent en haut.

---

## EXERCICES

## EXO 1 : HTML validator
_~15 min_

Étends `isBalanced` pour valider du HTML simplifié. Les balises `<div>`, `<p>`, `<span>` doivent être ouvertes et fermées dans le bon ordre. Parse le string pour extraire les balises (commence par `<`, se ferme avec `>`). Gère les balises auto-fermantes comme `<br>` et `<img>`.

```
"<div><p>Hello</p></div>" → valide
"<div><p>Hello</div></p>" → invalide
"<p><br>Texte</p>"     → valide
```

## EXO 2 : Historique limité
_~20 min_

Le navigateur de Sakura a une mémoire limitée : il ne peut stocker que 10 pages dans l'historique back. Si on dépasse 10 visites, la plus ancienne est effacée. Modifie la classe `Browser` pour supporter cette contrainte.

(indice : vérifie la taille de `backStack` avant de push)

## EXO 3 : Undo avec snapshots optimisés
_~25 min_

L'éditeur actuel stocke l'état complet du texte à chaque modification. Pour un texte de 100 000 caractères, c'est problématique. Réimplémente l'undo/redo en stockant des **actions** plutôt que des états : chaque action a un `apply()` et un `revert()`.

Structure suggérée :
```js
const typeAction = (text) => ({
 apply: (content) => content + text,
 revert: (content) => content.slice(0, -text.length)
})
```

---

## RÉSUMÉ

La stack résout naturellement les problèmes où l'ordre inverse compte : le dernier ouvrant doit être fermé en premier, la dernière page visitée est la première à retrouver en arrière, la dernière action est la première annulée. Deux stacks ensemble (back + forward, undo + redo) permettent une navigation bidirectionnelle. Le pattern est toujours le même : push avant d'agir, pop pour revenir. La vraie question n'est pas comment utiliser une stack : c'est de reconnaître quand un problème en a besoin.
