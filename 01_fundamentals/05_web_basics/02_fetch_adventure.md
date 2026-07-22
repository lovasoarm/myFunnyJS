---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# FETCH : QUAND TON CODE PARLE À INTERNET
Temps de lecture ~8 min

Les vrais programmes ne vivent pas en isolation. Ils parlent à des serveurs, récupèrent des données en direct, envoient des résultats ailleurs. C'est ce que fait `fetch` : ton code envoie une requête HTTP (le protocole de communication du web) vers un serveur, et le serveur répond.

Pourquoi ça compte dès maintenant : sans `fetch`, ton app ne lit que ce qu'elle a déjà en mémoire. Avec, elle peut accéder à n'importe quelle donnée du monde.

---

> **Note importante** : cette leçon utilise `async/await` et les Promises. Ces concepts sont introduits ici de façon minimale pour que tu puisses faire quelque chose d'utile maintenant. Le fonctionnement complet (event loop, microtasks, Promise.all, gestion fine des erreurs async) est traité en profondeur dans `03_async`. Si quelque chose semble mystérieux ici : c'est normal, et prévu.

---

## 1) CE QUE FETCH FAIT

```js
fetch("https://jsonplaceholder.typicode.com/users")
```

Cette ligne envoie une requête GET (GET = demander des données) au serveur. Mais `fetch` ne retourne pas directement les données : il retourne une **Promise** (promesse que la valeur arrivera bientôt).

Pourquoi ? Le réseau prend du temps. Pendant que la réponse voyage, JS continue à exécuter autre chose. Quand la réponse arrive, il reprend. C'est le coeur de l'asynchronicité de JS, vu en détail dans `03_async`.

---

## 2) LIRE LA RÉPONSE : DEUX ÉTAPES

```js
fetch("https://jsonplaceholder.typicode.com/users")
 .then((response) => response.json())  // étape 1 : décoder la réponse en objet JS
 .then((data) => {
  console.log(data)          // étape 2 : utiliser les données
 })
```

`.then()` = "quand la réponse est prête, fais ça". Les APIs retournent du JSON (format texte standard pour transporter des objets), `response.json()` le transforme en vrai objet JS.

---

## 3) ASYNC / AWAIT : LA VERSION LISIBLE

`async/await` est du sucre syntaxique (syntactic sugar : syntaxe plus lisible qui fait la même chose) au-dessus des Promises. Tu n'as pas besoin de tout comprendre maintenant, mais tu vas le voir partout :

```js
async function chargerJoueurs() {     // async = cette fonction peut attendre
 const response = await fetch(      // await = attendre que fetch réponde
  "https://jsonplaceholder.typicode.com/users"
 )
 const data = await response.json()    // await encore : décoder le JSON prend aussi du temps
 console.log(data)
}

chargerJoueurs()
```

`await` = "attends ce résultat avant de continuer". Uniquement utilisable dans une fonction marquée `async`. Le reste de JS continue de tourner pendant l'attente, il ne bloque pas.

---

## 4) VÉRIFIER QUE ÇA S'EST BIEN PASSÉ

Le réseau peut répondre avec une erreur (serveur down, URL incorrecte, etc.). L'objet `Response` expose ce qu'on a besoin de savoir :

```js
async function chargerJoueurs() {
 const response = await fetch("https://jsonplaceholder.typicode.com/users")

 if (!response.ok) {           // ok = true si code HTTP entre 200 et 299
  console.log("Erreur serveur :", response.status) // 404, 500, etc.
  return
 }

 const joueurs = await response.json()
 console.log(joueurs)
}
```

```
response.ok   --> true si le serveur a bien répondu (200-299), false sinon
response.status --> le code HTTP exact : 200, 201, 404, 500...
response.json() --> transforme le texte JSON reçu en objet JS utilisable
```

---

## 5) QUAND QUELQUE CHOSE PLANTE : TRY / CATCH

Le réseau peut totalement échouer (pas de connexion, serveur injoignable). `try/catch` attrape ces pannes :

```js
async function chargerAvecProtection() {
 try {
  const response = await fetch("https://jsonplaceholder.typicode.com/users")

  if (!response.ok) {
   throw new Error("Serveur en galère : " + response.status)
   //        ^ crée une erreur et la lance vers le catch
  }

  const data = await response.json()
  console.log("Données :", data.length, "entrées")
 } catch (erreur) {
  console.log("Panne réseau ou serveur :", erreur.message)
 } finally {
  console.log("Requête terminée (succès ou pas)")
  // finally s'exécute TOUJOURS : utile pour cacher un spinner, fermer une connexion
 }
}
```

```
try   --> ce qui peut planter
catch  --> si ça plante : on arrive ici avec l'erreur
finally --> s'exécute dans tous les cas, erreur ou pas
throw  --> lance une erreur manuellement vers le catch
```

---

## 6) ENVOYER DES DONNÉES : POST

`fetch` peut aussi envoyer, pas seulement recevoir :

```js
async function signalerMenace(data) {
 const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: {
   "Content-Type": "application/json",  // on dit au serveur ce qu'on envoie
  },
  body: JSON.stringify(data),       // objet JS -> texte JSON pour le transport
 })

 const resultat = await response.json()
 console.log("Enregistré :", resultat)
}

signalerMenace({ menace: "Akatsuki", niveau: "CRITIQUE", secteur: "Frontière Sud" })
```

`JSON.stringify` = transformer un objet JS en texte JSON. L'inverse de `response.json()`.

---

## 7) LA CARTE MENTALE

```
FETCH :\

1) envoyer requête --> fetch(url, options)
2) attendre réponse --> await ou .then()
3) vérifier status --> response.ok
4) décoder JSON   --> await response.json()
5) utiliser données --> le reste de ta fonction
6) gérer les pannes --> try/catch autour de tout ça
```

---

## MISSIONS

### MISSION 1 : LE RADAR DE RECONNAISSANCE

Endpoint disponible : `https://jsonplaceholder.typicode.com/users`

L'équipe de reconnaissance a besoin d'un rapport. Récupère les données, affiche les noms de chaque entrée, et indique le total en fin de rapport.

---

### MISSION 2 : FILTRAGE D'ALERTE

Même endpoint. Certaines cibles ont un `id > 5` : elles sont prioritaires. Filtre-les avec `filter()` et affiche seulement leurs noms. Les autres n'existent pas pour toi.

---

### MISSION 3 : TRANSFORMATION DE DOSSIER

Transforme chaque entrée en dossier structuré avec `map` :

```js
{
 codenom: name,   // le nom devient le nom de code
 zone: address.city // la ville devient la zone d'opération
}
```

Affiche le tableau transformé.

---

### MISSION 4 : RAPPORT D'INCIDENT

Envoie un POST avec ce payload :

```js
{ incident: "Infiltration Akatsuki à Konoha", niveau: 9000, secteur: "Nord" }
```

Affiche la réponse du serveur.

---

### MISSION 5 : TEST DE RÉSISTANCE

Lance `fetch` sur une URL intentionnellement cassée :

```js
fetch("https://jsonplaceholder.typicode.com/INEXISTANT")
```

Observe `response.ok` et `response.status`. Écris le code qui détecte l'échec et affiche un message d'erreur clair, sans faire planter le programme.

---

## RÉSUMÉ

`fetch` est la porte entre ton code et le monde extérieur. Tu envoies une requête, tu attends la réponse, tu la décode, tu la protèges avec try/catch. `async/await` rend tout ça lisible. La mécanique complète derrière (pourquoi `await` ne bloque pas, comment JS jongle plusieurs opérations en même temps) : c'est le sujet entier de `03_async`, et ça vaut le détour.
