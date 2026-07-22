---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~14 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## ASYNC GRIMOIRE

async, await, generators, AbortController, et tout ce qui gravite autour.
Le dictionnaire complet des concepts du module `03_async_await` : fichiers 01, 02, 02b, 02c.

---

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| `async` | Mot-clé qui transforme une fonction en fonction qui retourne toujours une Promise. La valeur retournée est automatiquement wrappée dans une Promise résolue. | `async function get() { return 42 }` : retourne `Promise<42>` | Leon qui promet de ramener le rapport : qu'il réussisse ou qu'il échoue, il y aura toujours une réponse / le tampon de la poste qui garantit que ton colis aura un statut |
| `await` | Suspend l'exécution de la fonction `async` courante jusqu'à la résolution d'une Promise. Libère la call stack pendant l'attente : le reste de JS continue de tourner. | `const data = await fetch('/api')` : pause ici, reprend quand fetch résout | Walter White qui attend que la réaction chimique soit finie avant de passer à l'étape suivante : lui attend, mais le labo continue de tourner / le four qui cuit pendant que tu fais autre chose |
| `async function` | Déclaration ou expression de fonction préfixée par `async`. Peut contenir des `await`. Retourne toujours une Promise. | `const fn = async () => { ... }` : arrow async | Un Chevalier qui prend ses missions en promettant de répondre / un coursier qui s'engage à livrer, quoi qu'il arrive |
| `try/catch` async | Structure qui attrape les rejections de Promises dans un contexte `async/await`. Équivalent de `.catch()` en syntaxe synchrone. | `try { await risky() } catch (e) { /* gère */ }` | Le filet de sécurité sous l'acrobate : si la Promise tombe, le catch l'attrape / le contrat d'assurance qui s'active quand ça merde |
| `Promise.all` | Lance toutes les Promises en parallèle. Résout quand toutes sont résolues. Rejette immédiatement si l'une rejette. | `await Promise.all([p1, p2, p3])` | Tous les Chevaliers partent en mission en même temps : tu attends que le dernier rentre / une cuisine où tous les plats cuisent en parallèle |
| `Promise.allSettled` | Lance toutes les Promises en parallèle. Attend que toutes soient terminées, résolues ou rejetées. Retourne un tableau de résultats avec leur statut. | `await Promise.allSettled([p1, p2])` : retourne `[{status:'fulfilled',...}, {status:'rejected',...}]` | Le Conseil qui attend les rapports de tous les Chevaliers même si certains sont tombés en mission / l'appel à tous les passagers, même ceux qui n'ont pas répondu |
| `Promise.race` | Retourne une Promise qui résout ou rejette avec la première Promise qui se termine, dans les deux sens. | `await Promise.race([fetch(), timeout(3000)])` | Le premier Chevalier à arriver prend la mission, les autres rentrent bredouilles / le sprint : peu importe qui gagne, le match s'arrête |
| `Promise.any` | Résout avec la première Promise qui réussit. Rejette seulement si toutes rejettent. | `await Promise.any([p1, p2, p3])` : ignore les rejections individuelles | On cherche n'importe quel Chevalier disponible : le premier qui répond est le bon / le premier bus qui arrive, peu importe la ligne |
| Séquentiel | Exécution d'opérations async l'une après l'autre. Chaque `await` attend la fin du précédent. Utiliser quand chaque étape dépend du résultat de la précédente. | `const a = await step1(); const b = await step2(a)` | Le plan d'évasion de Scofield : chaque étape dépend de la précédente / une recette où chaque étape dépend du résultat de celle d'avant |
| Parallèle | Exécution simultanée de plusieurs Promises. Utiliser quand les opérations sont indépendantes. Gain de temps = temps du plus lent, pas somme des temps. | `const [a, b] = await Promise.all([step1(), step2()])` | Leon et Rei qui partent en mission en même temps plutôt que l'un après l'autre / deux téléchargements simultanés |
| `UnhandledPromiseRejection` | Erreur qui arrive quand une Promise rejette sans que personne ne la catchait. En Node.js : crash. En navigateur : avertissement dans la console. | `fetchData()` sans `await` ni `.catch()` : si ça rejette : `UnhandledPromiseRejection` | Un Chevalier qui échoue et dont personne ne traite le rapport d'échec : la mission disparaît dans le vide / une bombe sans démineur |
| `top-level await` | `await` utilisé directement à la racine d'un module ES (pas dans une fonction `async`). Disponible en ESM natif et dans certains environnements Node. Bloque l'import du module jusqu'à résolution. | `const config = await loadConfig()` : directement dans `config.mjs` | La config qui doit être chargée avant que le reste du programme puisse démarrer / le générateur de courant qui doit démarrer avant d'allumer les lumières |
| `async IIFE` | Pattern pour exécuter du code async immédiatement sans top-level await. Utilisé dans les contextes non-ESM. | `;(async () => { const data = await fetch(); console.log(data) })()` | Le technicien qui arrive, fait son travail, et repart sans attendre d'invitation / un script qui s'exécute seul à l'import |
| Retry | Pattern qui retente une opération async en cas d'échec, avec un délai progressif. Utile pour les erreurs temporaires (réseau, rate limit, 503). | `for (let i = 0; i < 3; i++) { try { return await fn() } catch(e) { await sleep(i*1000) } }` | Leon qui retente sa mission si la météo était mauvaise, pas s'il a perdu son armure / relancer sa demande de visa après un refus temporaire |
| Timeout | Wrapping d'une Promise avec `Promise.race` contre un timer. Si l'opération prend plus longtemps que le seuil : erreur de timeout. | `Promise.race([fetch(), new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), 3000))])` | L'armure de Garo : si le combat dépasse 99.9 secondes, elle se désintègre / la minuterie du four qui coupe même si la cuisson n'est pas finie |
| Fallback | Plan B exécuté si le plan A échoue. Permet de retourner un résultat dégradé plutôt que de propager l'erreur. | `try { return await primary() } catch { return await backup() }` | Si Leon est indispo, Rei prend la mission / si le serveur principal est down, le miroir prend le relais |
| `async/await` vs `.then()` | Même comportement, syntaxe différente. `async/await` : plus lisible pour les chaînes longues. `.then()` : parfois plus concis pour les transformations simples. Les deux peuvent être mélangés. | `const x = await fn()` == `fn().then(x => ...)` | Deux façons d'écrire la même lettre : à la main ou à la machine / deux routes qui mènent au même point |

| `function*` | Générateur (generator function) : fonction qui peut suspendre son exécution avec `yield` et reprendre exactement là où elle s'est arrêtée au prochain `.next()`. Retourne un objet iterator, pas une valeur. | `function* gen() { yield 1; yield 2; }` : chaque `yield` est une pause |un conteur qui s'arrête après chaque chapitre et attend qu'on tourne la page | Scofield qui exécute son plan d'évasion une étape à la fois, sans jamais avancer sans confirmation|
| `yield` | Suspend le générateur et retourne une valeur à l'appelant. La prochaine fois que `.next()` est appelé, l'exécution reprend juste après le `yield`. Peut aussi recevoir une valeur via `.next(valeur)`. | `yield valeur` : sort la valeur, gèle le générateur jusqu'au prochain appel |une pause chakra entre deux attaques : le ninja reprend exactement là où il en était | un musicien qui marque une pause mid-improvisation et reprend au même accord|
| `Generator.next()` | Reprend l'exécution du générateur jusqu'au prochain `yield` ou `return`. Retourne toujours `{ value, done }` : `value` = la valeur yielded ou retournée, `done` = `true` si le générateur est épuisé. | `const g = gen(); g.next()` : `{ value: 1, done: false }` |appuyer sur "lecture" après une pause | un Chevalier qui reçoit l'ordre d'avancer après avoir attendu la confirmation du Conseil|
| `{ value, done }` | Objet retourné par chaque appel à `.next()`. `value` contient ce que le `yield` ou le `return` a produit. `done: true` signifie que le générateur est terminé, épuisé : les appels suivants retournent `{ value: undefined, done: true }`. | `const { value, done } = gen.next()` |le rapport de mission : "voilà ce que j'ai trouvé" + "est-ce que la mission est finie ou pas" | un livreur qui annonce sa livraison partielle et indique s'il en a encore|
| `for...of` (generator) | Itère automatiquement sur tous les `yield` d'un générateur jusqu'à `done: true`. Appelle `.next()` en coulisse à chaque itération. Consomme proprement sans gérer `done` manuellement. | `for (const v of gen()) { console.log(v) }` |lire un carnet de bord page par page sans avoir à tourner soi-même | écouter un album trapsoul track par track sans skip et sans avoir à appuyer sur "suivant"|
| `async function*` | Async generator : combine `async` et `function*`. Chaque `yield` peut être précédé d'un `await`. Jutsu des valeurs de façon asynchrone, une à la fois. À consommer avec `for await...of`. | `async function* stream() { yield await fetch('/chunk/1'); yield await fetch('/chunk/2') }` |un coursier qui fait des pauses à chaque livraison et attend la signature avant de repartir | un stream vidéo qui charge chunk par chunk avant d'afficher|
| `for await...of` | Itère sur un async generator ou tout objet async iterable. Attend la résolution de chaque valeur avant de passer à la suivante. Doit être utilisé dans un contexte `async`. | `for await (const chunk of stream()) { process(chunk) }` |attendre chaque round d'un combat DBZ avant de passer au suivant | traiter chaque alerte Horror une à la fois à la réception, sans en louper une|
| `AbortController` | API web qui crée un mécanisme d'annulation. Possède un `.signal` (à passer aux opérations à contrôler) et un `.abort()` (pour déclencher l'annulation depuis n'importe où). Disponible en navigateur et Node 15+. | `const ctrl = new AbortController(); fetch(url, { signal: ctrl.signal })` |le chef de mission qui peut rappeler tous ses agents d'un coup | Levi qui ordonne la retraite : tout le monde s'arrête en même temps, sans exception|
| `AbortSignal` | L'objet signal attaché à un `AbortController`. Passé à `fetch`, `addEventListener`, ou tout code qui doit répondre à l'annulation. `signal.aborted` vaut `true` après l'appel à `.abort()`. | `ctrl.signal.aborted // true si abort() a été appelé` |le signal radio que tous les agents écoutent en permanence | le sifflet d'arbitre que les joueurs entendent sur tout le terrain|
| `controller.abort()` | Déclenche l'annulation : toutes les opérations liées au signal reçoivent un `AbortError`. Le signal ne peut pas être réutilisé après : créer un nouveau `AbortController` pour chaque opération annulable. | `controller.abort()` : déclenche `DOMException: AbortError` dans les listeners |l'ordre d'évacuation immédiate : tout s'arrête, pas de discussion | le carton rouge : la partie s'arrête, aucun recours|
| `AbortError` | Erreur lancée quand une opération est annulée via `AbortController`. Nom : `'AbortError'`. À traiter séparément des vraies erreurs réseau : une annulation est intentionnelle, pas un échec. | `catch (e) { if (e.name === 'AbortError') return; throw e; }` |la différence entre un abandon volontaire et une vraie catastrophe : Scofield qui annule lui-même une étape vs une étape qui merde indépendamment | sortir proprement vs être éjecté|

---

## PIÈGES COURANTS

```js
// PIÈGE 1 : oublier await
async function bad() {
 const data = fetch('/api') // pas de await : data = Promise<Response>, pas les données
 console.log(data)     // affiche [object Promise], pas les données
}

// PIÈGE 2 : await dans forEach
[1,2,3].forEach(async (n) => {
 await delay(n * 1000) // ces awaits tournent, mais forEach n'attend rien
})
// le code après forEach s'exécute immédiatement

// CORRECT : for...of ou Promise.all
for (const n of [1,2,3]) {
 await delay(n * 1000) // séquentiel, chaque itération attend la précédente
}

await Promise.all([1,2,3].map(n => delay(n * 1000))) // parallèle

// PIÈGE 3 : séquentiel involontaire
async function slow() {
 const a = await fetchA() // attend A
 const b = await fetchB() // attend B -- mais A et B sont indépendants !
 return [a, b]       // 2s + 2s = 4s alors que 2s suffisaient
}

// CORRECT
async function fast() {
 const [a, b] = await Promise.all([fetchA(), fetchB()])
 return [a, b] // max(2s, 2s) = 2s
}
```

---

## DIAGRAMME : PARALLÈLE VS SÉQUENTIEL

```
SÉQUENTIEL (for...of ou await chainés)

 t=0s   t=2s   t=4s   t=6s
 |---------|---------|---------|
 [ fetch A ][ fetch B ][ fetch C ]
                ^
                résultat disponible ici

PARALLÈLE (Promise.all)

 t=0s        t=2s
 |-------------------|
 [ fetch A      ]
 [ fetch B   ]
 [ fetch C      ]
       ^
       résultat disponible ici (le plus lent)
```

Le gain = (somme des temps) - (temps du plus lent).
Sur 3 fetches de 2s chacun : 6s en séquentiel, 2s en parallèle.

---

## PIÈGES GENERATORS ET ABORT

```js
// PIÈGE 4 : appeler une function* sans .next() : rien ne s'exécute
function* compterChakra() {
 console.log('début') // jamais affiché si on ne fait pas .next()
 yield 1
}

const gen = compterChakra() // crée le generator : zéro exécution
// sans gen.next() : rien ne se passe
gen.next() // là seulement : affiche 'début', retourne { value: 1, done: false }

// PIÈGE 5 : oublier AbortError dans le catch : traiter l'annulation comme une erreur
async function rechercherJoueur(nom, signal) {
 try {
  const res = await fetch(`/api/joueurs?q=${nom}`, { signal })
  return await res.json()
 } catch (e) {
  // MAUVAIS : on traite l'annulation comme une erreur réseau
  console.error('Erreur réseau:', e) // AbortError n'est pas une erreur réseau
  afficherMessageErreur()       // le shinobi voit un message d'erreur pour rien
 }
}

// CORRECT : distinguer annulation et vrai échec
async function rechercherJoueurV2(nom, signal) {
 try {
  const res = await fetch(`/api/joueurs?q=${nom}`, { signal })
  return await res.json()
 } catch (e) {
  if (e.name === 'AbortError') return null // annulation intentionnelle : on ignore
  throw e                  // vrai échec : on propage
 }
}

// PIÈGE 6 : réutiliser un AbortController après abort()
const ctrl = new AbortController()
ctrl.abort()

// signal.aborted est déjà true : ce fetch est annulé immédiatement
await fetch('/api/data', { signal: ctrl.signal }) // AbortError immédiat

// CORRECT : nouveau controller pour chaque opération
function creerRequeteAnnulable(url) {
 const ctrl = new AbortController()
 const promesse = fetch(url, { signal: ctrl.signal })
 return { promesse, annuler: () => ctrl.abort() }
}
```

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.
