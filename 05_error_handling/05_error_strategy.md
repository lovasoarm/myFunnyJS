---
stability: intemporel
---

# ERROR STRATEGY : FAIL-FAST, FALLBACK, RETRY

Temps de lecture ~7 min


Catcher une erreur c'est la partie facile. Décider quoi faire ensuite : c'est là que tu montres si t'es un dev ou juste quelqu'un qui code.

Trois stratégies. Trois contextes. Choisir la mauvaise : l'app plante quand elle devrait survivre, ou continue de tourner quand elle devrait s'arrêter.

---

## 1) FAIL-FAST : ARRÊTER IMMÉDIATEMENT

Stratégie : dès qu'une erreur arrive, on stoppe tout. Pas de tentative. Pas de récupération.

Quand : état corrompu, données critiques invalides, conditions impossibles à compenser.

```js
function initialisationApp(config) {
 if (!config.dbUrl) {
  // pas de DB = pas d'app
  // continuer serait pire : on démarrerait un serveur inutilisable
  throw new Error("config.dbUrl manquant : démarrage impossible")
 }
 if (!config.jwtSecret) {
  throw new Error("config.jwtSecret manquant : auth impossible, démarrage bloqué")
 }
 // tout est là : on continue
 return demarrerServeur(config)
}

try {
 initialisationApp(process.env)
} catch (e) {
 console.error("FATAL :", e.message)
 process.exit(1) // crash propre et volontaire
}
```

Exemple Naruto : Naruto tente d'activer le mode Kurama avec des chakra points à 0. Fail-fast : on lève une erreur immédiatement. Continuer sans chakra produirait des dégâts incohérents dans tout le système de combat.

```js
function activerModeKurama(ninja) {
 if (ninja.chakra < ninja.chakraMax * 0.5) {
  throw new ChakraInsuffisantError(
   ninja.nom,
   "Mode Kurama",
   ninja.chakra,
   ninja.chakraMax * 0.5
  )
 }
 return { ...ninja, mode: "kurama", puissance: ninja.puissance * 10 }
}
```

**Fail-fast = préférer un crash explicite à une exécution silencieusement cassée.**

---

## 2) FALLBACK : CONTINUER AVEC UNE VALEUR DE SECOURS

Stratégie : si A échoue, utilise B. L'opération principale échoue, mais le système survit avec une dégradation acceptable.

Quand : la valeur principale est désirable mais pas critique. Une alternative moins bonne vaut mieux que rien.

```js
async function getStatsJoueur(joueurId) {
 try {
  // stats live depuis l'API externe
  return await fetchStatsLive(joueurId)
 } catch (e) {
  console.warn(`Stats live indisponibles pour ${joueurId}, fallback sur cache`)
  // fallback : stats en cache, peut-être pas à jour
  const cached = await cache.get(`stats:${joueurId}`)
  if (cached) return cached
  // fallback niveau 2 : stats vides mais structurées
  return { joueurId, buts: 0, passes: 0, statut: "données_indisponibles" }
 }
}
```

```
API live --> ok --> stats temps réel
     --> fail --> cache Redis
          --> fail --> données vides structurées
```

Exemple Breaking Bad : Walter ne peut pas obtenir le methylamine du fournisseur habituel. Fallback : autre fournisseur. Fallback niveau 2 : synthèse alternative. Il ne s'arrête pas. Il s'adapte.

```js
async function obtenirSupplies(ingredient) {
 const fournisseurs = ["gus_fring", "combo", "saul_contact"]

 for (const fournisseur of fournisseurs) {
  try {
   const stock = await commander(fournisseur, ingredient)
   console.log(`Stock obtenu via ${fournisseur}`)
   return stock
  } catch (e) {
   console.warn(`${fournisseur} indisponible : ${e.message}, tentative suivante`)
  }
 }

 throw new Error(`Impossible d'obtenir ${ingredient} : tous les fournisseurs KO`)
}
```

**Fallback = définir explicitement la dégradation acceptable. Si pas de fallback acceptable : fail-fast.**

---

## 3) RETRY : RÉESSAYER AVEC STRATÉGIE

Stratégie : l'erreur est transitoire. Attendre et réessayer a une chance de réussir.

Quand : erreurs réseau, API temporairement surchargée, rate limiting.

Quand PAS : erreurs de validation (réessayer avec les mêmes données invalides : ça échouera à chaque fois), erreurs d'auth (réessayer sans corriger le token : pareil).

```js
async function retryAsync(fn, options = {}) {
 const {
  maxTentatives = 3,
  delai = 1000,     // ms entre les tentatives
  backoff = 2,      // multiplicateur exponentiel
  shouldRetry = () => true
 } = options

 let tentative = 0
 let delaiCourant = delai

 while (tentative < maxTentatives) {
  try {
   return await fn()
  } catch (e) {
   tentative++

   if (tentative >= maxTentatives || !shouldRetry(e)) {
    throw e // plus de tentatives ou erreur non retryable
   }

   console.warn(`Tentative ${tentative}/${maxTentatives} échouée : ${e.message}`)
   console.warn(`Prochain essai dans ${delaiCourant}ms`)

   await sleep(delaiCourant)
   delaiCourant *= backoff // backoff exponentiel : 1s, 2s, 4s
  }
 }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
```

Utilisation :

```js
const stats = await retryAsync(
 () => fetchStatsLive(joueurId),
 {
  maxTentatives: 3,
  delai: 500,
  backoff: 2,
  shouldRetry: (e) => e.name === "NetworkError" || e.code === 429
  // retry seulement sur erreurs réseau ou rate limit
  // pas sur ValidationError ou NotFoundError
 }
)
```

```
tentative 1 --> fail --> attendre 500ms
tentative 2 --> fail --> attendre 1000ms
tentative 3 --> fail --> throw (propagé à l'appelant)
```

**Backoff exponentiel** : ne pas bombarder une API déjà surchargée. Espacer les tentatives.

---

## 4) COMBINER LES STRATÉGIES

En prod, les stratégies se combinent. Retry d'abord, fallback si retry épuisé, fail-fast sur les erreurs non récupérables.

```js
async function chargerDonneesMatch(matchId) {
 // fail-fast sur entrée invalide
 if (!Number.isInteger(matchId) || matchId <= 0) {
  throw new ValidationError("matchId", matchId, "doit être un entier positif")
 }

 let donneesLive

 // retry sur l'API live (erreurs réseau transitoires)
 try {
  donneesLive = await retryAsync(
   () => fetchMatchLive(matchId),
   { maxTentatives: 3, delai: 1000, shouldRetry: (e) => e.name === "NetworkError" }
  )
  return donneesLive
 } catch (e) {
  if (e instanceof ValidationError || e instanceof NotFoundError) {
   throw e // fail-fast : ces erreurs ne bénéficient pas du fallback
  }
  console.warn(`API live KO après 3 tentatives, fallback cache`)
 }

 // fallback sur le cache
 const cached = await cache.get(`match:${matchId}`)
 if (cached) {
  return { ...cached, source: "cache", potentiellementObsolete: true }
 }

 // plus de fallback possible
 throw new ServiceError(`Match ${matchId} complètement indisponible`, null)
}
```

```
input invalide    --> fail-fast immédiat
API ok        --> données live
API fail (réseau)   --> retry x3
retry épuisé     --> fallback cache
cache vide      --> throw (propagé)
NotFoundError     --> fail-fast (pas de retry, pas de fallback)
```

---

## 5) CIRCUIT BREAKER : NE PAS FRAPPER UN MORT

Pattern avancé : si un service externe échoue trop souvent, arrête de l'appeler. Donne-lui le temps de se rétablir.

```js
class CircuitBreaker {
 constructor(options = {}) {
  this.seuil = options.seuil || 5     // nb d'échecs avant ouverture
  this.timeout = options.timeout || 30000  // ms avant retentative
  this.echecs = 0
  this.etat = "FERMÉ" // FERMÉ = normal, OUVERT = bloqué, SEMI-OUVERT = test
  this.prochainTest = null
 }

 async executer(fn) {
  if (this.etat === "OUVERT") {
   if (Date.now() < this.prochainTest) {
    throw new Error("Circuit ouvert : service indisponible, pas de tentative")
   }
   this.etat = "SEMI-OUVERT"
  }

  try {
   const result = await fn()
   this.onSucces()
   return result
  } catch (e) {
   this.onEchec()
   throw e
  }
 }

 onSucces() {
  this.echecs = 0
  this.etat = "FERMÉ"
 }

 onEchec() {
  this.echecs++
  if (this.echecs >= this.seuil) {
   this.etat = "OUVERT"
   this.prochainTest = Date.now() + this.timeout
   console.error(`Circuit OUVERT après ${this.echecs} échecs : pause de ${this.timeout}ms`)
  }
 }
}

const breaker = new CircuitBreaker({ seuil: 3, timeout: 15000 })

async function getStats(matchId) {
 return breaker.executer(() => fetchStatsLive(matchId))
}
```

```
FERMÉ : normal, les appels passent
 --> 3 échecs consécutifs --> OUVERT
OUVERT : bloqué, on throw immédiatement sans appeler
 --> après 15s --> SEMI-OUVERT
SEMI-OUVERT : une tentative test
 --> succès --> FERMÉ
 --> échec --> OUVERT (reset timer)
```

Exemple Walking Dead : le camp a un système radio pour communiquer avec les autres survivants. Si la radio tombe 3 fois de suite, on arrête d'essayer et on économise les piles (ressource critique). Après 30 minutes, on retente.

---

## 6) CHOISIR LA BONNE STRATÉGIE

```
Type d'erreur              Stratégie recommandée
--------------------------------------------------------------
Données d'entrée invalides        fail-fast
Config manquante au démarrage      fail-fast
État incohérent (bug)          fail-fast
Erreur réseau transitoire        retry avec backoff
Rate limiting API            retry avec backoff exponentiel
Service external temporairement KO   retry + circuit breaker
Fonctionnalité secondaire indisponible  fallback
Données fraîches indisponibles      fallback sur cache
```

---

## EXERCICES

## EXO 1 : LE PIPELINE DE GARO

Le Conseil de Surveillance de Garo doit récupérer les données d'un Chevalier avant de l'envoyer en mission.

Implémente `getProfil(chevalierId)` avec :
- fail-fast si `chevalierId` n'est pas un entier positif
- retry x3 avec 500ms de délai sur les erreurs réseau
- fallback sur un profil de base `{ id, statut: "données_limitées" }` si l'API est KO

---

## EXO 2 : LE RETRY INTELLIGENT

Modifie `retryAsync` pour accepter un paramètre `onRetry(tentative, erreur, prochainDelai)` : un callback appelé avant chaque nouvelle tentative.

Utilise-le pour logger proprement chaque retry avec le contexte.

---

## EXO 3 : LE CIRCUIT BREAKER DU CAMP

Rick Grimes a un système de communication radio. Implémente un `CircuitBreaker` simplifié :
- seuil : 3 échecs
- timeout : 10 secondes

Simule 5 appels qui échouent, puis attends le timeout, puis réessaie. Affiche l'état du circuit à chaque étape.

---

## RÉSUMÉ

Fail-fast : préférer un crash explicite à une exécution silencieusement cassée. Sur les erreurs irrécupérables et les états invalides.

Fallback : définir la dégradation acceptable. Si la valeur principale est indisponible, quelle valeur secondaire est acceptable ?

Retry : uniquement sur les erreurs transitoires. Toujours avec backoff exponentiel. Jamais sur les erreurs de validation ou d'auth.

Circuit breaker : arrêter de frapper un service mort. Le laisser respirer. Retenter quand c'est raisonnable.

Ces stratégies ne s'excluent pas : elles se combinent selon le type d'erreur et le contexte.
