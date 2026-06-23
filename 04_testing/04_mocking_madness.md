# MOCKING MADNESS : REMPLACER CE QU'ON NE CONTRÔLE PAS

Ton code appelle une API externe. Il envoie un email. Il lit un fichier sur le disque.
Tu ne peux pas laisser ça tourner dans tes tests : c'est lent, imprévisible, et ça coûte parfois de l'argent.

La solution : les mocks.
Un mock remplace une dépendance réelle par une version qu'on contrôle totalement.
Résultat : le test reste rapide, prévisible, isolé.

---

## 1) TROIS TYPES DE DOUBLURES : LA DISTINCTION QUI COMPTE

```
Stub   →  remplace une fonction par une valeur fixe
         "peu importe ce que tu lui passes, il retourne toujours ça"

Mock   →  remplace ET enregistre les appels
         "est-ce que cette fonction a été appelée ? avec quels args ?"

Spy    →  surveille une vraie fonction sans la remplacer
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
envoyerEmail('mikasa@mur.sc')

// vérifications
expect(envoyerEmail).toHaveBeenCalled()
expect(envoyerEmail).toHaveBeenCalledWith('mikasa@mur.sc')
expect(envoyerEmail).toHaveBeenCalledTimes(1)
```

Le mock enregistre tout : combien de fois il a été appelé, avec quels arguments, à chaque appel.

---

## 3) MOCKER UN MODULE ENTIER

Quand ton code importe un module externe (API, base de données, service tiers) :

```js
// notificationService.js
const emailClient = require('./emailClient') // dépendance externe

function notifierVictoire(joueur) {
  emailClient.envoyer({
    destinataire: joueur.email,
    sujet: 'Tu as gagné le Ballon d\'Or',
    corps: `Félicitations ${joueur.nom}`
  })
  return true
}

module.exports = { notifierVictoire }
```

```js
// notificationService.test.js

// Jest intercepte tous les require('./emailClient') dans ce fichier
jest.mock('./emailClient')

const emailClient = require('./emailClient')
const { notifierVictoire } = require('./notificationService')

describe('notifierVictoire', () => {
  beforeEach(() => {
    // reset les compteurs d'appels entre chaque test
    jest.clearAllMocks()
  })

  it('envoie un email au joueur', () => {
    const joueur = { nom: 'Messi', email: 'leo@fcb.es' }

    notifierVictoire(joueur)

    expect(emailClient.envoyer).toHaveBeenCalledWith({
      destinataire: 'leo@fcb.es',
      sujet: 'Tu as gagné le Ballon d\'Or',
      corps: 'Félicitations Messi'
    })
  })

  it('retourne true après notification', () => {
    const résultat = notifierVictoire({ nom: 'Messi', email: 'leo@fcb.es' })
    expect(résultat).toBe(true)
  })
})
```

`jest.mock('./emailClient')` : toutes les fonctions exportées deviennent automatiquement des `jest.fn()`.

---

## 4) MOCKER DES VALEURS DE RETOUR ASYNC

Ton code fait des appels API ? Pas question d'appeler la vraie API dans les tests.

```js
// joueurAPI.js
const fetch = require('node-fetch')

async function recupStats(joueurId) {
  const res = await fetch(`https://api.ballon-dor.com/joueurs/${joueurId}`)
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
  // on contrôle ce que fetch "retourne"
  fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      stats: { buts: 700, passes: 300 }
    })
  })

  const stats = await recupStats('messi-10')

  expect(stats.buts).toBe(700)
  expect(fetch).toHaveBeenCalledWith('https://api.ballon-dor.com/joueurs/messi-10')
})

it('gère une réponse d\'API en erreur', async () => {
  fetch.mockRejectedValue(new Error('API indisponible'))

  await expect(recupStats('messi-10')).rejects.toThrow('API indisponible')
})
```

`mockResolvedValue` : simule une Promise résolue.
`mockRejectedValue` : simule une Promise rejetée.

---

## 5) SPY : SURVEILLER SANS REMPLACER

Parfois tu veux que la vraie implémentation tourne, mais tu veux vérifier comment elle a été appelée.

```js
const logger = require('./logger')

it('log un avertissement si le joueur est blessé', () => {
  // espionne logger.warn sans le remplacer
  const spy = jest.spyOn(logger, 'warn')

  analyseJoueur({ nom: 'Neymar', blessure: true })

  expect(spy).toHaveBeenCalledWith(expect.stringContaining('blessé'))

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

# EXERCICES

## EXO 1 : le mock du système de récompenses

Tu as cette fonction :

```js
const paiementService = require('./paiementService')

function distribuerPrimeBallon(joueur) {
  if (joueur.rang === 1) {
    paiementService.virer({ montant: 500000, destinataire: joueur.id })
    return 'prime versée'
  }
  return 'pas de prime'
}
```

Écris les tests avec mock de `paiementService` pour :
- le vainqueur (rang 1) : vérifier que `virer` a été appelé avec les bons args
- un autre joueur (rang 2) : vérifier que `virer` n'a PAS été appelé

---

## EXO 2 : mock async d'API

Écris le test pour cette fonction avec un mock de `fetch` :

```js
async function estEligibleFIFA(joueurId) {
  const res = await fetch(`https://api.fifa.com/joueurs/${joueurId}`)
  const data = await res.json()
  return data.licenceActive === true
}
```

Teste :
- un joueur avec licence active → `true`
- un joueur sans licence → `false`
- une API qui explose → que se passe-t-il ?

---

# RÉSUMÉ

Mock = remplacer une dépendance externe par une version contrôlée.
`jest.fn()` pour les fonctions, `jest.mock('./module')` pour les modules entiers.
`mockResolvedValue` / `mockRejectedValue` pour les Promises.
`jest.spyOn` pour surveiller sans remplacer.
`jest.clearAllMocks()` dans `beforeEach` : pas négociable.
