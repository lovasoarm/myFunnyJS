# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~7 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## GRIMOIRE DES PROMISES

---

| Terme | Définition | Code | Analogies |
|-------|-----------|------|-----------|
| Promise | Objet qui représente une valeur qui n'est pas encore disponible. Trois états : pending, fulfilled, rejected. | `const p = new Promise((resolve, reject) => { ... })` |Un ticket de livraison Amazon | une promesse de paie en fin de mois|
| pending | État initial d'une Promise. L'opération async tourne encore. Ni resolve ni reject n'a été appelé. | `const p = new Promise(() => {}) // reste pending pour toujours` |Une requête en cours de traitement | un match pas encore sifflé|
| fulfilled | La Promise a résolu avec succès. `resolve(valeur)` a été appelé. Le `.then()` reçoit la valeur. | `resolve("Naruto a gagné")` |Le colis livré | le but marqué|
| rejected | La Promise a échoué. `reject(erreur)` a été appelé ou une exception a été throwée. Le `.catch()` reçoit l'erreur. | `reject(new Error("mission échouée"))` |Le colis perdu | le carton rouge|
| resolve | Fonction qui termine une Promise avec succès. Appelée une seule fois. Si appelée plusieurs fois, les appels suivants sont ignorés. | `new Promise((resolve) => resolve(42))` |Valider une mission | signer le bon de livraison|
| reject | Fonction qui termine une Promise avec une erreur. Appelée une seule fois. | `new Promise((_, reject) => reject(new Error("fail")))` |Annuler la mission | retourner le colis|
| .then() | Méthode chaînable. Reçoit la valeur résolue, retourne une nouvelle Promise. Ce qu'on `return` devient le résultat du prochain `.then()`. | `fetch(url).then(res => res.json()).then(data => data.items)` |Chaque maillon d'une chaîne de montage | chaque étape d'un plan d'évasion|
| .catch() | Attrape les erreurs dans la chaîne. Si il retourne une valeur, la chaîne reprend (resolved). Si il re-throw, l'erreur continue. | `.catch(err => { console.log(err); return [] })` |Le filet de sécurité sous le trapéziste | le plan B de Michael Scofield|
| .finally() | S'exécute toujours, resolved ou rejected. Ne reçoit pas de valeur. N'influence pas le résultat. | `.finally(() => db.close())` |Nettoyer le labo quoi qu'il arrive | fermer le dossier mission|
| Promise.resolve() | Crée une Promise déjà résolue avec la valeur donnée. Utile pour normaliser une valeur en Promise. | `Promise.resolve(42).then(n => console.log(n))` |Démarrer une chaîne avec une valeur connue | un joueur déjà qualifié|
| Promise.reject() | Crée une Promise déjà rejetée. Utile pour forcer une erreur dans une chaîne. | `Promise.reject(new Error("interdit"))` |Déclencher une alerte immédiatement | souffler le penalty dès le départ|
| Promise.all() | Attend que toutes les Promises réussissent. Une seule rejection coupe tout. Retourne un tableau dans le même ordre. | `Promise.all([fetchA(), fetchB()]).then(([a, b]) => ...)` |La formation complète ou la mission est annulée | tous les ninjas ou on ne part pas|
| Promise.race() | La première Promise qui se résout ou rejette gagne. Les autres continuent de tourner mais sont ignorées. | `Promise.race([fetch(url), timeout(3000)])` |Le premier coup décide du combat | le premier arrivé à la ligne|
| Promise.allSettled() | Attend que toutes finissent, succès ou échec. Retourne un tableau de `{ status, value \| reason }`. Ne rejette jamais. |`Promise.allSettled([...]).then(res => res.filter(r => r.status === "fulfilled"))` | Le rapport complet après la bataille | le bilan de toutes les missions|
| Promise.any() | La première qui réussit suffit. Si toutes échouent, rejette avec un `AggregateError`. | `Promise.any([mirror1(), mirror2()]).then(data => ...)` |Un seul fragment suffit pour activer le cristal | un seul but pour gagner|
| AggregateError | Erreur throwée par `Promise.any()` quand toutes les Promises rejettent. Contient `.errors` : le tableau de toutes les erreurs. | `err.errors.forEach(e => console.log(e.message))` |Le rapport d'échec total | tous les équipiers tombés|
| thenable | Tout objet avec une méthode `.then()`. JS le traite comme une Promise dans les chaînes. | `const t = { then: (resolve) => resolve(42) }` |Un contrat non officiel mais respecté | une parole sans papier mais valable|
| microtask | Une Promise résolue ne déclenche pas `.then()` immédiatement. Elle s'inscrit dans la microtask queue, après le code synchrone courant. | `Promise.resolve().then(() => console.log("après")) // log après le code sync` |La livraison express mais pas instantanée | le message envoyé mais lu entre deux tâches|

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
