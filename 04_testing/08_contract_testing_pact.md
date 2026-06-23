# CONTRACT TESTING : LA PAIX ENTRE LES ÉQUIPES

Deux équipes. Deux services. L'équipe A construit l'API. L'équipe B la consomme.
L'équipe A refactorise un endpoint. Elle ne prévient pas. L'équipe B déploie. Ça explose en prod.

C'est le problème classique des architectures multi-services.
Le contract testing le résout avant que le problème arrive.

---

## 1) LE PROBLÈME : POURQUOI L'INTÉGRATION CLASSIQUE NE SUFFIT PAS

Dans une architecture avec plusieurs services, chaque service a ses propres tests.
Mais qui vérifie que le format que le service A retourne est bien celui que le service B attend ?

```
Service A (API joueurs) :
  GET /joueurs/:id → { id, name, stats }
  ← "j'ai changé 'name' en 'fullName' parce que c'est plus clair"

Service B (dashboard) :
  attend { id, name, stats }
  ← tous ses tests passent, ils utilisent des mocks
  ← en prod : name est undefined partout
```

Les tests unitaires et d'intégration de chaque service passent. Le bug n'est visible qu'en prod.

---

## 2) QU'EST-CE QU'UN CONTRAT

Un contrat c'est un accord formel entre deux services : "voici ce que je fournis, voici ce que j'attends".

```
Consumer (B) → définit ce dont il a besoin
Provider (A) → s'engage à le fournir

Consumer-driven contract : B écrit le contrat, A le vérifie
```

C'est une inversion de responsabilité importante : **c'est le consommateur qui définit le contrat**, pas le fournisseur. Parce que c'est le consommateur qui casse si le contrat change.

---

## 3) CONCEPT SANS PACT : COMPRENDRE LA MÉCANIQUE

Avant d'installer un framework, comprendre ce qu'on fait.

Un contrat basique, à la main :

```js
// contract.json — le contrat défini par le Consumer (service B)
{
  "consumer": "dashboard",
  "provider": "joueurs-api",
  "interactions": [
    {
      "description": "récupérer un joueur par ID",
      "request": {
        "method": "GET",
        "path": "/joueurs/10"
      },
      "response": {
        "status": 200,
        "body": {
          "id": 10,
          "name": "Lionel Messi",   // le consumer attend 'name'
          "stats": {
            "buts": 700
          }
        }
      }
    }
  ]
}
```

Le provider (service A) tourne ce contrat contre sa vraie implémentation.
Si la réponse ne matche pas : le provider sait qu'il a cassé quelque chose pour le consumer, avant de déployer.

---

## 4) IMPLÉMENTER LE CONTRACT TESTING AVEC JEST : SANS FRAMEWORK EXTERNE

Pour des projets JS simples, on peut valider des contrats sans Pact.

```js
// contractValidator.js — validateur de contrat maison
function validContrat(réponseRéelle, schémaAttendu) {
  for (const [clé, typeAttendu] of Object.entries(schémaAttendu)) {
    if (!(clé in réponseRéelle)) {
      throw new Error(`Contrat cassé : champ '${clé}' absent de la réponse`)
    }
    if (typeof réponseRéelle[clé] !== typeAttendu) {
      throw new Error(
        `Contrat cassé : '${clé}' doit être ${typeAttendu}, reçu ${typeof réponseRéelle[clé]}`
      )
    }
  }
  return true
}

module.exports = { validContrat }
```

```js
// joueurAPI.contract.test.js
const { validContrat } = require('./contractValidator')
const { getJoueur } = require('./joueurAPI') // la vraie implémentation

// Le contrat : ce que le consumer dashboard attend
const contratJoueur = {
  id: 'number',
  name: 'string',    // si l'API retourne 'fullName', ce test casse
  buts: 'number'
}

describe('Contrat : joueurs-api → dashboard', () => {
  it('GET /joueurs/:id respecte le contrat du consumer', async () => {
    const réponse = await getJoueur(10)
    expect(() => validContrat(réponse, contratJoueur)).not.toThrow()
  })
})
```

Si l'équipe A renomme `name` en `fullName` : ce test casse immédiatement, avant le déploiement.

---

## 5) PACT : LE FRAMEWORK POUR LES ÉQUIPES SÉRIEUSES

Pour des architectures complexes avec plusieurs consumers par provider, [Pact](https://pact.io) automatise tout ça.

Concept clé de Pact :

```
1. Consumer écrit ses tests → génère un fichier pact (le contrat)
2. Ce fichier est partagé avec le Provider (via Pact Broker ou dépôt Git)
3. Provider tourne ses "provider verification tests" contre le fichier pact
4. Si les tests provider passent : le contrat est respecté, déploiement safe
```

```js
// Côté Consumer (avec @pact-foundation/pact)
const { PactV3, MatchersV3 } = require('@pact-foundation/pact')

const provider = new PactV3({
  consumer: 'dashboard',
  provider: 'joueurs-api',
})

describe('consumer contract', () => {
  it('peut récupérer un joueur', async () => {
    await provider
      .addInteraction({
        uponReceiving: 'une requête pour un joueur par ID',
        withRequest: { method: 'GET', path: '/joueurs/10' },
        willRespondWith: {
          status: 200,
          body: {
            id: MatchersV3.integer(10),
            name: MatchersV3.string('Lionel Messi'),
            buts: MatchersV3.integer(700)
          }
        }
      })
      .executeTest(async (mockProvider) => {
        const joueur = await getJoueur(mockProvider.url, 10)
        expect(joueur.name).toBe('Lionel Messi')
      })
  })
})
// → génère un fichier pact que le provider vérifie
```

Pour ce curriculum, la mécanique manuelle suffit pour comprendre le concept. Pact est mentionné pour le contexte prod.

---

## 6) QUAND EST-CE QUE ÇA VAUT LE COUP

```
Ça vaut le coup si :
  - deux équipes différentes gèrent les deux services
  - les services déploient indépendamment
  - l'API est consommée par plusieurs clients

Ça ne vaut pas le coup si :
  - un seul dev gère les deux services
  - déploiements toujours synchronisés
  - l'API est interne et jamais consommée par l'extérieur
```

Le contract testing est un outil d'équipe, pas un outil solo.

---

# EXERCICES

## EXO 1 : écrire le contrat du consumer

Tu es le dashboard qui consomme l'API Prison Break.
L'API retourne les profils des prisonniers.

Définis le contrat en JSON : quels champs tu attends, de quel type.
Puis écris le `contractValidator` qui vérifie ce contrat contre une réponse mockée.

---

## EXO 2 : casser et détecter

Tu as un contrat qui attend `{ nom: string, kills: number }`.

Écris la fonction provider qui retourne `{ nom: 'Levi', killCount: 200 }` (mauvais nom de champ).
Puis le test de contrat qui le détecte avant prod.

---

# RÉSUMÉ

Le contract testing protège l'interface entre deux services : si le provider change sans prévenir, le test casse immédiatement.
C'est le consumer qui définit le contrat : il sait ce dont il a besoin.
Pour des projets simples : validateur maison. Pour des équipes distribuées : Pact.
Ça ne remplace pas les unit tests ni les tests d'intégration : c'est une couche supplémentaire aux frontières entre services.
