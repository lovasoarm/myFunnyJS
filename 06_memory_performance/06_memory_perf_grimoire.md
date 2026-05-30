# GRIMOIRE : MÉMOIRE ET PERFORMANCE

Le dictionnaire des concepts qui définissent un dev performant.
Chaque terme que tu croises en prod, en code review, ou en entretien senior.

---

## GESTION MÉMOIRE

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Garbage Collector (GC)** | Mécanisme du moteur JS qui libère automatiquement la mémoire des objets qui n'ont plus de référence vivante | `let x = { chakra: 100 }` `x = null` `// x est maintenant éligible au GC` | L'intendant d'un camp Walking Dead qui nettoie les cellules vides / le vestiaire d'un club qui récupère les casiers des joueurs partis |
| **Mark-and-Sweep** | Algorithme du GC : il "marque" tous les objets atteignables depuis les racines, puis "balaie" tout ce qui n'est pas marqué | `// phase mark : GC part de window/global` `// phase sweep : tout non-marqué = libéré` | Walter White qui liste les clients actifs avant de couper les inactifs / l'entraîneur qui raye les joueurs absents à l'appel |
| **Fuite mémoire** | Situation où des objets qui ne servent plus restent référencés : ils survivent au GC et consomment de la RAM indéfiniment | `const listeners = []` `btn.addEventListener('click', fn)` `// fn jamais retirée = fuite` | Un événement listener qui reste actif après que la page soit changée — comme une alerte Horrorqui continue de sonner après la mort du monstre / un joueur sous contrat qui ne joue plus mais que le club paie encore |
| **Référence forte** | Référence standard qui empêche le GC de libérer l'objet ciblé tant qu'elle existe | `const ninja = { name: 'Naruto' }` `// ninja est une référence forte` | Un contrat signé : tant qu'il existe, le joueur ne peut pas partir / le sceau du chakra qui maintient la bête à neuf queues en vie |
| **WeakRef** | Référence faible : le GC peut libérer l'objet ciblé même si la WeakRef existe encore | `const ref = new WeakRef(bigObject)` `const obj = ref.deref()` `// obj peut être undefined si GC est passé` | Une option d'achat sur un joueur : si le club ne lève pas l'option, le joueur part / le passage de Scofield dans une cellule — il y était, maintenant c'est vide |
| **WeakMap / WeakSet** | Collections dont les clés (WeakMap) ou valeurs (WeakSet) sont des références faibles : les entrées disparaissent avec leurs objets | `const cache = new WeakMap()` `cache.set(domNode, data)` `// si domNode est retiré du DOM, l'entrée disparaît` | Un vestiaire qui range les affaires par joueur : quand le joueur part, ses affaires partent avec / les archives d'un ninja — si le ninja meurt, son dossier s'autodétruit |

---

## COPIE ET MUTATION

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Valeur primitive** | Type dont la valeur est copiée directement à l'assignation : string, number, boolean, null, undefined, symbol, BigInt | `let a = 42` `let b = a` `b = 99` `// a reste 42` | Donner sa recette de Heisenberg par oral : l'autre a l'info, mais pas le labo / partager sa strat de combat à la voix — chacun a sa propre copie mentale |
| **Référence** | Les objets et tableaux ne sont pas copiés : seule l'adresse mémoire est copiée. Deux variables peuvent pointer vers le même objet | `const a = { hp: 100 }` `const b = a` `b.hp = 0` `// a.hp est aussi 0` | Deux joueurs qui partagent le même vestiaire : toucher aux affaires de l'un affecte l'autre / deux ninjas qui partagent le même scroll — modifier l'un modifie l'original |
| **Shallow copy** | Copie superficielle : les propriétés de premier niveau sont copiées par valeur, mais les objets imbriqués restent partagés | `const copy = { ...original }` `// copy.nested === original.nested` `// même référence` | Photocopier le sommaire d'un dossier sans les annexes — les titres sont copiés, mais les vrais docs pointent vers les originaux / copier la fiche d'un joueur sans copier son historique médical |
| **Deep copy** | Copie complète de toute la structure, récursivement. Aucune référence partagée avec l'original | `const copy = structuredClone(original)` `// aucun lien avec original` | Refaire tout le plan de Fox River de zéro — chaque couloir, chaque cellule, aucune dépendance à l'original / créer un jutsu de substitution complet : double parfait, aucun lien |
| **Mutation** | Modifier un objet en place plutôt que d'en créer un nouveau. Effet de bord garanti si partagé | `const stats = { goals: 10 }` `stats.goals++` `// l'original est modifié` | Corriger directement le tableau des stats au marqueur : tout le monde voit la modif / Walter qui réécrit ses formules sur le tableau blanc du labo sans faire de copie |
| **Immutabilité** | Pattern où on ne modifie jamais un objet existant : on crée un nouvel objet avec les changements | `const updated = { ...stats, goals: stats.goals + 1 }` `// stats est intact` | Créer un nouveau tableau de scores plutôt de corriger l'ancien / chaque état de combat de Naruto est un snapshot : jamais le précédent n'est écrasé |

---

## COMPLEXITÉ ALGORITHMIQUE

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Big O** | Notation qui décrit comment le temps d'exécution ou l'espace mémoire croît en fonction de la taille de l'entrée | `// O(n) : une boucle sur n éléments` `for (let i = 0; i < n; i++) { }` | Le temps pour trouver un joueur dans une liste : si la liste double, le temps double aussi / le temps pour vérifier chaque cellule de Fox River une par une |
| **O(1) — constant** | L'opération prend le même temps quelle que soit la taille de l'entrée | `const val = arr[42]` `// accès direct, toujours pareil` | Récupérer le numéro de maillot d'un joueur depuis un hash : instantané / Gojo qui sait exactement où est l'ennemi sans chercher |
| **O(n) — linéaire** | Le temps croît proportionnellement à la taille de l'entrée | `arr.find(x => x.id === target)` `// dans le pire cas, on parcourt tout` | Chercher Scofield dans toute la prison cellule par cellule / demander à tous les joueurs leur nom pour trouver Messi |
| **O(n²) — quadratique** | Double boucle imbriquée : si n double, le temps est multiplié par 4 | `for (let i of arr)` `  for (let j of arr)` `    compare(i, j)` | Faire jouer chaque ninja contre chaque autre ninja dans un tournoi : 10 ninjas = 100 combats, 100 ninjas = 10 000 combats / vérifier chaque paire de joueurs sur le terrain |
| **O(log n) — logarithmique** | À chaque étape on divise le problème en deux. La taille a peu d'impact | `// binary search : coupe le tableau en deux à chaque fois` `let mid = Math.floor((lo + hi) / 2)` | Chercher un mot dans un dictionnaire en ouvrant au milieu à chaque fois / la stratégie de Shikamaru : chaque décision élimine la moitié des possibilités |
| **O(n log n)** | Meilleur cas pour les algorithmes de tri par comparaison. Merge sort, quick sort | `arr.sort((a, b) => a - b)` `// .sort() natif est O(n log n)` | Trier tous les votes du Ballon d'Or en les divisant en groupes puis en fusionnant / le classement final d'un tournoi en phases |
| **Complexité spatiale** | Quantité de mémoire supplémentaire utilisée par un algorithme, indépendamment du temps | `// O(n) spatiale : on crée un tableau de même taille` `const result = arr.map(x => x * 2)` | La mémoire d'un algorithme c'est le nombre de carnets de notes dont Walter a besoin pour calculer sa formule |

---

## PROFILAGE ET MESURE

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Flamegraph** | Représentation visuelle de la call stack dans le temps. Chaque barre = une fonction. La largeur = le temps passé dedans | `// visible dans DevTools > Performance tab` `// les fonctions larges sont les bottlenecks` | Le replay vidéo d'un match : chaque phase est visible, les phases longues ressortent / le storyboard d'un combat Garo — chaque frame montre qui prend du temps |
| **Long Task** | Tâche JS qui dure plus de 50ms sur le thread principal. Bloque le rendu et augmente le TBT | `// detecter avec PerformanceObserver` `new PerformanceObserver(list => {` `  list.getEntries() // long tasks` `}).observe({ type: 'longtask' })` | Un monologue de 10 minutes de Walter White pendant lequel personne d't peut rien faire / un jutsu de préparation si long que Naruto reste figé |
| **performance.now()** | Retourne le temps écoulé depuis le chargement de la page en millisecondes, avec une précision sous-milliseconde | `const t0 = performance.now()` `doWork()` `console.log(performance.now() - t0)` | Le chrono du coach pendant un sprint — précis à la fraction de seconde / le timer du combat Garo : 99.9 secondes max |
| **Memory heap snapshot** | Capture de l'état de la mémoire à un instant T. Permet de voir quels objets occupent de l'espace et lesquels ne sont pas libérés | `// DevTools > Memory > Take snapshot` `// Filtrer par "Detached" pour voir les fuites` | Faire l'inventaire du camp de Rick à un instant T — tout lister, trouver ce qui aurait dû partir / l'audit des ressources de l'équipage de l'Thousand Sunny |

---

## CORE WEB VITALS

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **LCP — Largest Contentful Paint** | Temps avant que le plus grand élément visible (image, bloc texte) soit rendu. Seuil "Good" : <= 2.5s | `new PerformanceObserver(list => {` `  list.getEntries() // lcp entries` `}).observe({ type: 'largest-contentful-paint' })` | Le temps avant que l'affiche du Ballon d'Or soit visible dans le stade / le moment où Naruto apparaît enfin après tout le suspense |
| **INP — Interaction to Next Paint** | Délai entre une interaction (clic, toucher, frappe) et le prochain rendu. Remplace FID. Seuil "Good" : <= 200ms | `// mesuré automatiquement par le navigateur` `// chaque interaction est trackée` | Le délai entre "tire le corner" et le moment où le joueur bouge vraiment / le temps de réaction entre "Rasengan !" et l'exécution |
| **CLS — Cumulative Layout Shift** | Score d'instabilité visuelle : somme des décalages de layout inattendus pendant le chargement. Seuil "Good" : <= 0.1 | `// img sans dimensions = cause classique de CLS` `<img width="800" height="600" src="...">` `// dimensions fixes = zéro shift` | La page qui bouge quand une pub se charge et fait rater ton clic / le terrain qui tremble pendant un combat et fait rater l'estocade |
| **TBT — Total Blocking Time** | Somme du temps de blocage du thread principal entre FCP et TTI. Proxy pour INP dans les audits Lighthouse | `// réduire TBT : code-splitting, lazy loading` `// éviter les Long Tasks` | Le total de temps où un joueur est tétanisé pendant un match — il voit mais ne peut pas bouger / le temps total pendant lequel Scofield est immobilisé dans son plan |
| **Budget de performance** | Ensemble de seuils définis contractuellement : si une métrique dépasse le seuil, le build échoue en CI | `// lighthouserc.js` `'largest-contentful-paint': ['error', { maxNumericValue: 2500 }]` | La liste de règles de la prison de Fox River : si t'enfreins une règle, tu passes en isolement / le règlement d'un club de foot : une stat sous le seuil, le joueur ne joue pas |
| **Lighthouse CI** | Outil qui automatise les audits Lighthouse dans une pipeline CI/CD et bloque si les assertions échouent | `npx lhci autorun` `// audit automatique à chaque PR` | L'arbitre qui mesure chaque performance avant de valider le match / le Conseil de Surveillance de Garo qui vérifie chaque combat avant de valider la mission |
| **Code splitting** | Découper le bundle JS en plusieurs morceaux chargés à la demande. Réduit le JS initial et le TBT | `const Module = React.lazy(() => import('./Module'))` `// le bundle de Module n'est chargé que si nécessaire` | Ne sortir les troupes que quand elles servent — pas envoyer toute l'armée au premier round / Itachi ne déploie ses techniques que quand la situation l'exige |
| **Tree shaking** | Le bundler analyse les imports et élimine le code importé mais jamais utilisé. Réduit la taille du bundle | `// si tu importes seulement { debounce }` `// lodash-es n'envoie que debounce, pas les 300 autres fonctions` | L'équipe qui ne prend que les joueurs qui jouent vraiment — les autres restent en tribune / Walter qui ne prend au labo que les produits qu'il utilise |
| **Lazy loading** | Chargement différé d'une ressource (image, script, module) jusqu'au moment où elle est nécessaire | `<img loading="lazy" src="stadium.jpg">` `// l'image ne charge que quand elle approche du viewport` | Les renforts qui n'arrivent que quand le combat en a besoin — pas tous au premier coup / Might Guy qui réserve les 8 portes pour la situation vraiment critique |
