---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# COMMAND PATTERN
Temps de lecture ~9 min

Dans Walking Dead, le groupe de Rick fait des actions : déplacer une sentinelle, ouvrir une porte, distribuer des rations. Et parfois : annuler une action, ou la refaire identique.

Si chaque action est juste un appel de fonction direct (`moveGuard(rick, "porte_nord")`), tu ne peux ni l'annuler, ni la rejouer, ni la mettre en file d'attente, ni logger ce qui s'est passé.

Command règle ça : chaque action devient un OBJET. Un objet qu'on peut stocker, empiler, annuler, rejouer.

Avantage : undo/redo, historique, file d'attente d'actions, replay : tout devient possible.
Inconvénient : pour une action simple à usage unique, transformer ça en objet c'est de la sur-ingénierie pure.

---

## 1) LE PROBLÈME : L'ACTION DIRECTE QU'ON NE PEUT PAS DÉFAIRE

```js
let camp = {
 rations: 100,
 gardes: ["Rick", "Daryl"],
}

// on distribue 20 rations directement
function distribuerRations(camp, quantite) {
 camp.rations -= quantite
 console.log(`${quantite} rations distribuées, reste : ${camp.rations}`)
}

distribuerRations(camp, 20)
// camp.rations === 80

// maintenant... Negan attaque, fausse alerte, on veut ANNULER
// comment on fait ? on ne sait même plus QUI a fait QUOI ni COMBIEN
```

Le problème : l'action a été EXÉCUTÉE et OUBLIÉE dans le même geste. Aucune trace, aucun moyen de revenir en arrière sans recoder la logique inverse à la main, en croisant les doigts pour pas se tromper de chiffre.

```
distribuerRations(20) --> camp.rations -= 20 --> fini, oublié
```

---

## 2) LA SOLUTION : CHAQUE ACTION DEVIENT UN OBJET AVEC execute() ET undo()

```js
// une Command, c'est un objet avec deux méthodes : execute et undo
// chacune sait comment FAIRE l'action, et comment la DÉFAIRE
function createDistribuerRationsCommand(camp, quantite) {
 return {
  execute: () => {
   camp.rations -= quantite
  },
  undo: () => {
   camp.rations += quantite
  },
  description: `distribuer ${quantite} rations`,
 }
}

let camp = { rations: 100 }

const cmd = createDistribuerRationsCommand(camp, 20)

cmd.execute()
console.log(camp.rations) // 80

// fausse alerte, on annule
cmd.undo()
console.log(camp.rations) // 100, retour exact à l'état initial
```

```
créer la Command --> execute() --> état modifié
         --> undo()  --> état restauré
```

La différence clé avec Strategy : Strategy encapsule un ALGORITHME interchangeable. Command encapsule une ACTION avec son inverse, prête à être stockée et rejouée plus tard.

**Risque réel** : `undo` doit faire EXACTEMENT l'inverse d'`execute`, sinon tu crées un état fantôme. Si `execute` distribue 20 rations mais qu'entre temps un autre process en a consommé 5, `undo` qui fait `+= 20` remet le compteur à un état qui n'a JAMAIS existé. Command sans gestion de la concurrence, c'est un undo qui ment.

---

## 3) L'HISTORIQUE : EMPILER LES COMMANDS POUR UN VRAI UNDO/REDO

```js
// une pile (stack) pour stocker les commandes exécutées
// pourquoi une stack et pas une queue ? parce qu'on annule TOUJOURS
// la dernière action en premier : LIFO, comme dans 03_stack
const historique = []

function executer(command) {
 command.execute()
 historique.push(command)
 console.log(`fait : ${command.description}`)
}

function annulerDernier() {
 const command = historique.pop()
 if (!command) {
  console.log("rien à annuler")
  return
 }
 command.undo()
 console.log(`annulé : ${command.description}`)
}

let camp = { rations: 100, sentinelles: ["porte_nord"] }

function createAjouterSentinelleCommand(camp, poste) {
 return {
  execute: () => camp.sentinelles.push(poste),
  undo: () => camp.sentinelles.pop(),
  description: `ajouter sentinelle à ${poste}`,
 }
}

executer(createDistribuerRationsCommand(camp, 20))   // fait : distribuer 20 rations
executer(createAjouterSentinelleCommand(camp, "porte_sud")) // fait : ajouter sentinelle à porte_sud

console.log(camp)
// { rations: 80, sentinelles: ["porte_nord", "porte_sud"] }

annulerDernier()
// annulé : ajouter sentinelle à porte_sud
console.log(camp.sentinelles) // ["porte_nord"]

annulerDernier()
// annulé : distribuer 20 rations
console.log(camp.rations) // 100
```

```
executer(cmdA) --> historique: [cmdA]
executer(cmdB) --> historique: [cmdA, cmdB]
annulerDernier() --> pop cmdB, undo() --> historique: [cmdA]
annulerDernier() --> pop cmdA, undo() --> historique: []
```

C'est littéralement Ctrl+Z. Tous les éditeurs de texte, Photoshop, VSCode : même principe. Une pile de commandes, chacune sachant se défaire.

---

## 4) REDO : LA PILE QU'ON OUBLIE TOUJOURS

Un undo/redo correct a DEUX piles, pas une.

```js
const historique = [] // commandes faites
const annulees = []  // commandes défaites, prêtes à être refaites

function executer(command) {
 command.execute()
 historique.push(command)
 annulees.length = 0 // CRUCIAL : une nouvelle action casse le futur "redo"
}

function annuler() {
 const command = historique.pop()
 if (!command) return
 command.undo()
 annulees.push(command)
}

function refaire() {
 const command = annulees.pop()
 if (!command) return
 command.execute()
 historique.push(command)
}
```

Le point piégeux : `annulees.length = 0` dans `executer`. Si tu annules 3 actions puis tu en fais une NOUVELLE, les 3 actions annulées ne peuvent plus être "redo" : elles appartiennent à un futur qui n'existe plus. Oublier cette ligne, c'est le bug classique du undo/redo qui permet de "redo" une action qui n'a plus de sens dans le nouvel état.

```
historique: [A, B, C] --> annuler x2 --> historique: [A], annulees: [C, B]
            --> nouvelle action D --> historique: [A, D], annulees: [] (vidé !)
```

---

## 5) COMMAND COMME FILE D'ATTENTE : LE PROTOCOLE GARO

Dans Garo, chaque mission arrive de façon asynchrone. Tu ne peux pas toutes les exécuter en même temps : il faut les FILE-r (queue) et les traiter dans l'ordre.

```js
// chaque mission est une Command : on sait l'exécuter, on sait la décrire
function createMissionCommand(chevalier, horror) {
 return {
  execute: async () => {
   console.log(`${chevalier} engage ${horror}`)
   // simulate combat async
   await new Promise((resolve) => setTimeout(resolve, 100))
   return { chevalier, horror, resultat: "vaincu" }
  },
  description: `mission : ${chevalier} vs ${horror}`,
 }
}

// la queue traite les missions une par une, dans l'ordre d'arrivée
async function traiterQueue(queue) {
 const resultats = []
 for (const command of queue) {
  console.log(`traitement : ${command.description}`)
  const resultat = await command.execute()
  resultats.push(resultat)
 }
 return resultats
}

const queue = [
 createMissionCommand("Kouga", "Horror_Garde"),
 createMissionCommand("Rian", "Horror_Sombre"),
]

traiterQueue(queue).then(console.log)
```

```
queue: [missionA, missionB]
traiterQueue --> execute(missionA) --> attendre --> execute(missionB) --> attendre --> [resultatA, resultatB]
```

Ici Command ne sert plus à faire un undo : il sert à DÉCOUPLER la création d'une action de son exécution. La mission est créée maintenant, mais exécutée plus tard, dans un ordre contrôlé par la queue. C'est la base de plein de systèmes réels : job queues, task schedulers, message brokers (vu en `25_scalability`).

---

## EXERCICES

## EXO 1 : undo sur l'inventaire de Rick

Le camp a un inventaire : `{ armes: 5, medicaments: 3, nourriture: 50 }`.

Crée une fonction `createUtiliserCommand(inventaire, item, quantite)` qui retourne une Command avec `execute` (retire `quantite` de `inventaire[item]`) et `undo` (remet la quantité).

Contrainte : `execute` doit lever une erreur `"stock insuffisant"` si `inventaire[item] < quantite`, et dans ce cas la Command ne doit PAS être ajoutée à l'historique.

Teste avec une utilisation valide suivie d'un `undo`, puis avec une utilisation invalide (vérifie que l'inventaire n'a pas changé).

---

## EXO 2 : le bouton "rejouer le combat" de Rasengan Engine

Tu reprends le moteur de combat de Naruto (`01_rasengan_engine`). Chaque tour de combat (attaque d'un ninja) doit devenir une Command.

Construis :
- `createAttaqueCommand(attaquant, defenseur, jutsu)` : `execute()` retourne le nouvel état du défenseur (rappel : immutabilité, pas de mutation directe)
- une fonction `rejouerCombat(commands)` qui exécute une liste de Commands dans l'ordre et retourne la LISTE de tous les états intermédiaires du défenseur (un état par tour)

Le but : pouvoir "rejouer" un combat tour par tour pour debug, comme un replay vidéo.

---

## EXO 3 : trouve le bug du redo

Voici un système undo/redo :

```js
const historique = []
const annulees = []

function executer(command) {
 command.execute()
 historique.push(command)
}

function annuler() {
 const command = historique.pop()
 if (!command) return
 command.undo()
 annulees.push(command)
}

function refaire() {
 const command = annulees.pop()
 if (!command) return
 command.execute()
 historique.push(command)
}
```

Scénario : `executer(A)`, `executer(B)`, `annuler()` (annule B), `executer(C)`, `refaire()`.

Trace l'état de `historique` et `annulees` à CHAQUE étape. Que se passe-t-il au `refaire()` final ? Quel est le bug exact, et qu'est-ce que `executer` aurait dû faire pour l'éviter ?

---

## RÉSUMÉ

Command transforme une action en objet autonome : elle sait s'exécuter, et souvent s'annuler. Empilée dans un historique, elle donne le undo/redo. Mise dans une queue, elle découple le moment où l'action est DÉCIDÉE du moment où elle est EXÉCUTÉE. Le piège numéro un : un `undo` qui ne reflète pas exactement l'inverse d'`execute`, ou une pile `redo` jamais vidée après une nouvelle action.
