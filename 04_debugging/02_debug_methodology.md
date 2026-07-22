---
stability: intemporel
---

# DEBUG METHODOLOGY : QUATRE ÉTAPES, ZÉRO HASARD

Temps de lecture ~8 min


Tu as un bug. Tu ne sais pas où. Tu ne sais pas pourquoi.
Premier réflexe : changer des trucs au hasard et voir si ça passe.
Mauvais réflexe. Tu vas en créer trois autres.

Debugger sans méthode, c'est chercher un Horror dans Vaemélia à minuit sans carte.
Tu avances. Tu ne sais pas vers quoi.

Ce fichier te donne la carte.

---

## 1) LE PROCESS EN QUATRE ÉTAPES

```
ÉTAPE 1 : REPRODUIRE
 Le bug doit se produire à volonté.
 Si tu ne peux pas le déclencher toi-même : tu ne peux pas le corriger.

ÉTAPE 2 : ISOLER
 Réduire le problème au minimum.
 Supprimer tout ce qui n'est pas lié au bug jusqu'à avoir le cas minimal.

ÉTAPE 3 : CORRIGER
 Changer une seule chose à la fois.
 Tester après chaque changement.

ÉTAPE 4 : VÉRIFIER
 S'assurer que le fix ne casse rien d'autre.
 Rejouer le scénario de reproduction pour confirmer.
```

Ces étapes ne sont pas optionnelles. Elles ne changent pas d'ordre.
Corriger sans reproduire = jouer à pile ou face.

---

## 2) ÉTAPE 1 : REPRODUIRE

Un bug qu'on ne peut pas reproduire est un bug qu'on ne peut pas corriger.
Si quelqu'un dit "j'ai un bug mais je sais pas comment le déclencher" : c'est la première chose à résoudre, pas le bug lui-même.

Questions à se poser pour reproduire :

```
- Quand est-ce que ça arrive ? À chaque fois ou parfois ?
- Avec quelles données d'entrée ?
- Dans quel ordre ?
- En prod mais pas en dev ? Suspect : variable d'environnement, données réelles, timing.
- Seulement chez certains utilisateurs ? Suspect : état persistant, rôle, locale, navigateur.
```

Exemple : le camp de Rick Grimes a un système d'inventaire. Le stock de munitions affiche un nombre négatif. Mais seulement le matin.

```js
// camp.js : gestion du stock
function consommerMunitions(stock, quantite) {
 stock.munitions -= quantite  // mutation directe sur l'objet stock
 return stock
}

// simulation.js : tick nocturne
async function rondeNocturne(camp) {
 const gardes = await getGardes()
 gardes.forEach(async garde => {
  const tirsEffectues = await simulerTir(garde)
  consommerMunitions(camp.stock, tirsEffectues) // stock muté en parallèle
 })
}
```

Reproduction : lancer `rondeNocturne()` avec deux gardes en parallèle et vérifier le stock après.
C'est reproductible. On peut passer à l'étape 2.

---

## 3) ÉTAPE 2 : ISOLER

Réduire, pas chercher. L'objectif est d'arriver au plus petit code possible qui produit encore le bug.

Règle : enlève des choses jusqu'à ce que le bug disparaisse. La dernière chose que tu as enlevée avant qu'il disparaisse : c'est là que le bug vit.

```
Ton code a 300 lignes et plante sur la ligne 247.
Tu commentes la moitié basse (150 lignes) : le bug disparaît ?
 OUI --> le bug est dans les 150 lignes commentées.
 NON --> le bug est dans les 150 lignes restantes.
Bisect mental : divise par deux à chaque fois.
```

Ce pattern s'appelle une réduction par bisect (division binaire du problème). `git bisect` fait ça automatiquement pour trouver le commit qui a introduit un bug.

Exemple camp Walking Dead isolé :

```js
// Version isolée : juste le minimum pour reproduire
const stock = { munitions: 100 }

function consommer(stock, n) {
 stock.munitions -= n // mutation directe
}

// Deux appels simultanés sur le même objet
Promise.all([
 Promise.resolve().then(() => consommer(stock, 30)),
 Promise.resolve().then(() => consommer(stock, 30))
]).then(() => {
 console.log(stock.munitions) // attendu : 40, mais parfois 70 (une des deux mutations perdue)
})
```

Ici, le bug est visible sans le système entier. C'est un problème de référence partagée plus accès concurrent. Pas besoin du reste du camp pour le voir.

---

## 4) ÉTAPE 3 : CORRIGER

Une seule chose à la fois. Toujours.

Si tu changes deux choses et que le bug disparaît : tu ne sais pas laquelle l'a corrigé.
Si tu changes deux choses et que le bug reste : tu ne sais pas si l'une des deux était sur la bonne piste.

```js
// Correction : ne pas muter l'objet reçu, retourner un nouvel état
function consommer(stock, n) {
 return { ...stock, munitions: stock.munitions - n } // nouvel objet, pas de mutation
}
```

Teste la correction sur le cas reproductible de l'étape 1. Pas sur un autre cas. Sur celui-là exactement.

---

## 5) ÉTAPE 4 : VÉRIFIER

La correction a résolu le bug. Elle n'a pas créé d'autres problèmes ?

Vérifications :

```
- Rejouer le scénario de reproduction : le bug est bien parti.
- Tester les cas aux limites (limite inférieure, supérieure, valeur nulle).
- Vérifier que les autres fonctions qui utilisaient le même code fonctionnent encore.
- Si des tests automatiques existent : les lancer.
- Si des tests automatiques n'existent pas : écrire au moins un test sur ce cas.
```

Règle d'or : quand tu corriges un bug, tu écris un test qui aurait détecté ce bug plus tôt. Sinon, le bug reviendra et tu ne le verras pas venir.

---

## 6) `console.log` VS LE DEBUGGER

Les deux servent. Ils ne servent pas au même moment.

```
console.log  --> rapide, jetable, bon pour trouver OU ça casse
debugger   --> puissant, lent à démarrer, bon pour comprendre POURQUOI ça casse
```

### Utiliser `console.log` intelligemment

Ne pas logger une variable : logger un label + une variable.

```js
// Mauvais : tu ne sais pas ce que tu regardes
console.log(stock)

// Correct : le label te dit immédiatement le contexte
console.log('[consommer] stock avant:', JSON.parse(JSON.stringify(stock)))
console.log('[consommer] n:', n)
console.log('[consommer] stock après:', { ...stock, munitions: stock.munitions - n })
```

`JSON.parse(JSON.stringify(x))` : force une copie profonde de l'objet au moment du log.
Sans ça, Chrome/Node affiche une référence live : quand tu regardes, l'objet a déjà muté.

```js
// Piège classique
const obj = { count: 0 }
console.log(obj)    // affiche {count: 0}... ou peut-être {count: 3}
obj.count++
obj.count++
obj.count++
// Chrome loggue la référence, pas la snapshot. Tu vois l'état final, pas l'état au moment du log.

// Correct
console.log(JSON.parse(JSON.stringify(obj))) // snapshot immutable au moment de l'appel
```

Nettoyer les logs après : un `console.log('[DEBUG]')` qui reste en prod, ça pue.

### Utiliser le debugger

Voir `03_devtools_debugger.md` pour le détail complet.
Utilise le debugger quand :

```
- tu veux voir l'état de plusieurs variables simultanément
- tu veux avancer instruction par instruction
- tu veux comprendre le flux d'exécution sans polluer le code de logs
- tu dois inspecter des objets complexes ou des closures
```

---

## 7) LE CAS QUI CASSE

Scénario classique : tu corriges sans reproduire. Le bug "disparaît". Deux heures plus tard, il est revenu dans un autre composant.

```js
// Bug rapporté : le score d'un match Ballon d'Or s'affiche en négatif
// Diagnostic rapide (mauvais) : "ah, c'est sûrement parseInt qui manque"
function afficherScore(joueur) {
 joueur.score = parseInt(joueur.score) // ajout rapide sans comprendre la source
 return joueur.score
}

// Résultat : le score s'affiche correctement.
// Mais le vrai bug est ailleurs : quelqu'un passe un score en string depuis l'API.
// Ce parseInt patch le symptôme, pas la cause.
// Deux jours plus tard : le même bug dans les stats de saison, où il n'y a pas de parseInt.
```

Reproduire force à comprendre la vraie cause. Sans ça, tu patches des symptômes indéfiniment.

---

## EXERCICES

EXO 1 : Reproduire avant tout (~10 min)

Le système de camp de Rick Grimes remonte un bug : "parfois, les rations distribuées dépassent le stock disponible."

```js
// rations.js
let stockNourriture = 200

async function distribuerRation(survivant) {
 const besoin = await calculerBesoin(survivant) // retourne un nombre entre 1 et 5
 if (stockNourriture >= besoin) {
  stockNourriture -= besoin
  return { survivant: survivant.nom, recu: besoin }
 }
 return { survivant: survivant.nom, recu: 0 }
}

const survivants = ['Rick', 'Daryl', 'Michonne', 'Glenn', 'Maggie',
          'Carl', 'Carol', 'Abraham', 'Rosita', 'Sasha']

survivants.forEach(nom => distribuerRation({ nom }))
console.log('Stock restant:', stockNourriture) // peut afficher un négatif
```

Étapes :
1. Reproduis le bug de façon fiable (indice : le problème vient du moment où plusieurs Promises accèdent au même `stockNourriture`)
2. Isole le code minimal qui produit encore le bug
3. Explique pourquoi le stock peut devenir négatif malgré la vérification `if (stockNourriture >= besoin)`

EXO 2 : Bisect sur un pipeline async (~15 min)

Ce pipeline de scoring Ballon d'Or retourne parfois `NaN` comme score final. Pas toujours.

```js
async function calculerScoreFinal(joueur) {
 const votesPresse  = await getVotesPresse(joueur.id)  // retourne [] si aucun vote
 const votesCoaches = await getVotesCoaches(joueur.id)
 const votesCapitaine = await getVotesCapitaine(joueur.id)

 const scorePresse  = votesPresse.reduce((acc, v) => acc + v.points, 0)
 const scoreCoaches  = votesCoaches.reduce((acc, v) => acc + v.points, 0)
 const scoreCapitaine = votesCapitaine.reduce((acc, v) => acc + v.points, 0)

 const total = scorePresse + scoreCoaches + scoreCapitaine
 return total / 3 // moyenne
}
```

Exercice :
1. Identifie toutes les causes possibles d'un `NaN` dans ce pipeline
2. Construis un cas de test minimal pour chaque cause
3. Propose une correction pour chacune

---

## RÉSUMÉ

Tu sais maintenant debugger sans jouer à la loterie.
Reproduis d'abord : si tu ne peux pas déclencher le bug à volonté, tu ne peux pas le corriger.
Isole ensuite : le plus petit code possible qui produit encore le bug.
Corrige une chose à la fois. Vérifie que rien d'autre ne casse.
`console.log` pour localiser, debugger pour comprendre. Les deux ont leur moment.
Un bug corrigé sans test : un bug qui reviendra sans prévenir.
