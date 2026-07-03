[INTEMPOREL]

# EXO [IA MENTEUSE] : oop_js (arrow function comme méthode)

> Tag `[IA MENTEUSE]` : une IA a généré ce code. Il tourne. Il a l'air propre. Il ment.
> Durée : 20 min chrono. Zéro exécution avant d'avoir écrit ta réponse.

## Contexte

Tu montres à une IA générique un objet `ninja` (voir `04_this_keyword_rules.md`) où `this` se perd quand une méthode est passée en callback. Tu demandes de corriger le bug une bonne fois pour toutes. Voici ce qu'elle génère :

```js
const ninja = {
  nom: "Kakashi",
  rang: "Jonin",
  presenter: () => {
    console.log(`Je suis ${this.nom}, rang ${this.rang}`);
  }
};

ninja.presenter();
setTimeout(ninja.presenter, 1000);
```

L'IA t'assure : "j'ai remplacé la fonction classique par une arrow function. Les arrow functions n'ont pas leur propre `this`, donc ce problème de contexte perdu ne peut plus jamais arriver, peu importe comment tu appelles `presenter`."

## Consigne

Avant de lancer une seule ligne :

1. Prédis exactement ce qu'affichent `ninja.presenter()` et le `setTimeout`.
2. Identifie la phrase de l'IA qui est fausse. "Les arrow functions n'ont pas leur propre this" : est-ce que ça règle vraiment le problème ici ?
3. Corrige le code pour que `this.nom` et `this.rang` fonctionnent, en appel direct ET en callback.

Ensuite seulement, lance le code et compare à ta prédiction.

## Piège caché

L'IA a raison sur un point technique isolé (les arrow functions n'ont pas leur propre `this`) et fausse sur la conclusion. Une arrow function définie directement comme méthode d'un objet littéral ne capture jamais l'objet : elle capture le `this` du scope englobant au moment où le fichier est écrit, qui n'est pas `ninja` (voir la section 3 de `04_this_keyword_rules.md`). L'IA a échangé un bug contre un autre bug, en gardant la même erreur affichée : `undefined`. Ça donne l'impression d'un fix parce que le code "a changé", pas parce que le problème est réglé.

## Preuve à livrer

- ta prédiction écrite AVANT exécution (`prediction.txt`)
- le diff entre ta prédiction et le résultat réel
- ta version corrigée (`fix.js`), qui doit marcher en appel direct ET en `setTimeout`, avec en commentaire pourquoi ta solution capture le bon `this` là où celle de l'IA échoue

## Pourquoi c'est vital

"Utilise une arrow function" est un des conseils les plus mal appliqués par les IA de code, parce que la règle est vraie en général mais fausse dans ce cas précis. Une demi-vérité technique est plus dangereuse qu'une erreur grossière : elle passe la relecture rapide.
