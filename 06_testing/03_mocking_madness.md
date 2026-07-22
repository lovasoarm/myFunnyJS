---
stability: intemporel
---

# MOCKING MADNESS : REMPLACER CE QU'ON NE CONTRÔLE PAS
Temps de lecture ~8 min

Ton code appelle une API externe. Il envoie un email. Il lit un fichier sur le disque.
Tu ne peux pas laisser ça tourner dans tes tests : c'est lent, imprévisible, et ça coûte parfois de l'argent.

Le système de vote du Ballon d'Or envoie des emails de confirmation à chaque journaliste qui vote. Si les tests appellent le vrai service d'email, t'envoies 500 emails à chaque `npm test`. La FIFA va t'appeler.

La solution : les mocks. Un mock remplace une dépendance réelle par une version qu'on contrôle totalement. Résultat : le test reste rapide, prévisible, isolé.

---

## 1) TROIS TYPES DE DOUBLURES : LA DISTINCTION QUI COMPTE

```
Stub  → remplace une fonction par une valeur fixe
     "peu importe ce que tu lui passes, il retourne toujours ça"

Mock  → remplace ET enregistre les appels
     "est-ce que cette fonction a été appelée ? avec quels args ?"

Spy  → surveille une vraie fonction sans la remplacer
     "laisse-la tourner normalement, mais dis-moi comment elle a été appelée"
```

En pratique avec Jest, `jest.fn()` couvre les trois cas selon comment tu l'utilises.

---

## 2) `jest.fn()` : LE MOCK DE BASE

```js
// une fonction mock vide
const envoyerEmail = jest.fn()

// on peut lui donner une valeur de retour
const envoyerEmail = jest.fn().mockReturnValue(true)

// ou une implémentation complète
const envoyerEmail = jest.fn().mockImplementation((destinataire) => {
 return { envoyé: true, à: destinataire }
})

// utilisation dans un test
envoyerEmail('journaliste.fr@ballon-dor.com')

// vérifications
expect(envoyerEmail).toHaveBeenCalled()
expect(envoyerEmail).toHaveBeenCalledWith('journaliste.fr@ballon-dor.com')
expect(envoyerEmail).toHaveBeenCalledTimes(1)
```

Le mock enregistre tout : combien de fois il a été appelé, avec quels arguments, à chaque appel.

---

## 3) MOCKER UN MODULE ENTIER

Quand ton code importe un module externe (API, base de données, service tiers) :

```js
// notificationService.js
const emailClient = require('./emailClient') // dépendance externe : 500 emails en test sinon

function notifierVotant(journaliste) {
 emailClient.envoyer({
  destinataire: journaliste.email,
  sujet: 'Votre vote Ballon d\'Or a été enregistré',
  corps: `Merci ${journaliste.nom}, votre voix compte.`
 })
 return true
}

module.exports = { notifierVotant }
```

```js
// notificationService.test.js

// Jest intercepte tous les require('./emailClient') dans ce fichier
jest.mock('./emailClient')

const emailClient = require('./emailClient')
const { notifierVotant } = require('./notificationService')

describe('notifierVotant', () => {
 beforeEach(() => {
  // reset les compteurs d'appels entre chaque test
  jest.clearAllMocks()
 })

 it('envoie un email de confirmation au journaliste', () => {
  const journaliste = { nom: 'Jean Dupont', email: 'jean@lequipe.fr' }

  notifierVotant(journaliste)

  expect(emailClient.envoyer).toHaveBeenCalledWith({
   destinataire: 'jean@lequipe.fr',
   sujet: 'Votre vote Ballon d\'Or a été enregistré',
   corps: 'Merci Jean Dupont, votre voix compte.'
  })
 })

 it('retourne true après notification', () => {
  const résultat = notifierVotant({ nom: 'Jean', email: 'jean@lequipe.fr' })
  expect(résultat).toBe(true)
 })
})
```

`jest.mock('./emailClient')` : toutes les fonctions exportées deviennent automatiquement des `jest.fn()`.

---

## 4) MOCKER DES VALEURS DE RETOUR ASYNC

Le système de vote récupère les stats des joueurs via une API FIFA. Pas question d'appeler la vraie API dans les tests.

```js
// joueurAPI.js
const fetch = require('node-fetch')

async function recupStats(joueurId) {
 const res = await fetch(`https://api.fifa.com/joueurs/${joueurId}`)
 const data = await res.json()
 return data.stats
}
```

```js
// joueurAPI.test.js
jest.mock('node-fetch')
const fetch = require('node-fetch')
const { recupStats } = require('./joueurAPI')

it('retourne les stats du joueur', async () => {
 // on contrôle ce que fetch "retourne" : pas d'appel réseau réel
 fetch.mockResolvedValue({
  json: jest.fn().mockResolvedValue({
   stats: { buts: 45, passes: 18, matchs: 52 }
  })
 })

 const stats = await recupStats('mbappe-7')

 expect(stats.buts).toBe(45)
 expect(fetch).toHaveBeenCalledWith('https://api.fifa.com/joueurs/mbappe-7')
})

it('gère une réponse d\'API en erreur', async () => {
 fetch.mockRejectedValue(new Error('API FIFA indisponible'))

 await expect(recupStats('mbappe-7')).rejects.toThrow('API FIFA indisponible')
})
```

`mockResolvedValue` : simule une Promise résolue.
`mockRejectedValue` : simule une Promise rejetée.

---

## 5) SPY : SURVEILLER SANS REMPLACER

Le logger de la cérémonie doit enregistrer chaque vote important. On veut vérifier qu'il a bien été appelé, sans couper le vrai logging.

```js
const logger = require('./logger')

it('log un avertissement si un vote arrive hors délai', () => {
 // espionne logger.warn sans le remplacer
 const spy = jest.spyOn(logger, 'warn')

 enregistrerVote({ journaliste: 'marc', horodatage: Date.now() + 99999 })

 expect(spy).toHaveBeenCalledWith(expect.stringContaining('hors délai'))

 // important : remettre l'original après le test
 spy.mockRestore()
})
```

Le spy est utile quand tu veux vérifier un effet de bord (log, event, compteur) sans bloquer l'exécution réelle.

---

## 6) LES ERREURS CLASSIQUES DES MOCKS

```
Piège 1 : oublier jest.clearAllMocks() entre les tests
     → un mock conserve son état d'un test à l'autre
     → les vérifications de nombre d'appels deviennent fausses

Piège 2 : mocker trop
     → si tu mocks tout, tu testes plus rien de réel
     → règle : mock uniquement ce qui est externe à la logique testée

Piège 3 : ne pas vérifier les arguments
     → expect(envoyerEmail).toHaveBeenCalled() ne dit pas COMMENT il a été appelé
     → toujours vérifier les args si ils comptent pour la logique
```

---

## EXERCICES

## EXO 1 : le mock du virement FIFA

La fonction distribue le prix au vainqueur du Ballon d'Or :

```js
const tributService = require('./tributService')

function distribuerPrixBallon(joueur) {
 if (joueur.rang === 1) {
  tributService.virer({ montant: 500000, destinataire: joueur.id })
  return 'prix versé'
 }
 return 'pas de prix'
}
```

Écris les tests avec mock de `tributService` pour :
- le vainqueur (rang 1) : vérifier que `virer` a été appelé avec les bons args
- un autre joueur (rang 2) : vérifier que `virer` n'a PAS été appelé

---

## EXO 2 : mock async de l'API FIFA

Écris le test pour cette fonction avec un mock de `fetch` :

```js
async function estEligibleCeremonie(joueurId) {
 const res = await fetch(`https://api.fifa.com/joueurs/${joueurId}`)
 const data = await res.json()
 return data.licenceActive === true && data.matchsJoues >= 15
}
```

Teste :
- un joueur éligible (licence active + assez de matchs) → `true`
- un joueur inéligible (licence inactive) → `false`
- une API qui explose → que se passe-t-il ?

---

## RÉSUMÉ

Mock = remplacer une dépendance externe par une version contrôlée.
`jest.fn()` pour les fonctions, `jest.mock('./module')` pour les modules entiers.
`mockResolvedValue` / `mockRejectedValue` pour les Promises.
`jest.spyOn` pour surveiller sans remplacer.
`jest.clearAllMocks()` dans `beforeEach` : pas négociable.
