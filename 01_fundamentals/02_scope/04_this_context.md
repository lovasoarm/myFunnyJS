---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# THIS : UN AVANT-GOÛT AVANT LE VRAI COURS
Temps de lecture ~5 min

> `this` est l'un des mots-clés les plus piégeux de JS. Il change de valeur selon comment et où tu appelles la fonction. Pas selon où elle est écrite : selon comment elle est appelée.

Ce fichier est intentionnellement court. Pourquoi ? Parce que `this` est inséparable du système de prototype et des classes ES6 : tout ça est traité en profondeur dans `18_oop_js/04_this_keyword_rules.md`, au moment où tu auras tous les outils pour vraiment comprendre.

Ici : juste les deux réflexes de survie pour la suite du curriculum.

---

## 1) LA RÈGLE DE BASE À RETENIR

`this` = l'objet qui a **appelé** la fonction. Pas celui où elle est écrite.

```js
const ninja = {
 name: "Naruto",
 cri() {
  console.log(this.name) // this = ninja, parce que ninja.cri()
 }
}

ninja.cri() // "Naruto"

const fn = ninja.cri
fn() // undefined : plus personne n'appelle via ninja, this est perdu
```

---

## 2) LE SEUL PIÈGE QUE TU VAS CROISER MAINTENANT

Une arrow function ne crée pas son propre `this`. Elle hérite du contexte où elle est **écrite**.

```js
const timer = {
 name: "Bombe",
 start() {
  setTimeout(function () {
   console.log(this.name) // undefined : this perdu dans le callback classique
  }, 100)

  setTimeout(() => {
   console.log(this.name) // "Bombe" : arrow hérite du this de start()
  }, 100)
 }
}

timer.start()
```

Règle : dans un callback passé à `setTimeout`, `addEventListener`, `map`, etc. : utilise une arrow function si tu as besoin de garder le `this` de l'appelant.

---

> Pour la suite complète : `bind`, `call`, `apply`, le fonctionnement interne du `this` dans les classes, les pièges avec le prototype : tout ça est dans **`18_oop_js/04_this_keyword_rules.md`**. Tu reviendras ici après ce module et tout fera sens.

---

## RÉSUMÉ

`this` ne dépend pas de l'endroit où la fonction est définie. Il dépend de l'endroit où elle est appelée. C'est la règle numéro un.

Dans un callback standard (pas arrow), `this` change selon l'appelant. Dans une arrow function, `this` est capturé à la création : il garde le `this` de la fonction englobante.

Ce fichier couvre l'essentiel pour démarrer. Le comportement complet de `this` avec `bind`, `call`, `apply`, les classes et le prototype est dans `18_oop_js`.
