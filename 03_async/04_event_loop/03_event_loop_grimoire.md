[INTEMPOREL]

#  Page verrouillée
Temps de lecture ~9 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

# EVENT LOOP GRIMOIRE

Le moteur JS expliqué terme par terme.
Chaque concept avec son code, son comportement runtime, et son équivalent dans la vraie vie.

---

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Call Stack** | Pile d'exécution des fonctions. Chaque appel empile une frame, chaque `return` dépile. Quand elle est vide, l'event loop peut agir. | `function a() { b() } function b() { console.log("ok") } a()` : stack : [a] --> [a, b] --> [a] --> [] | Une pile d'assiettes sales : on pose, on enlève, toujours par le haut / Le stack de missions actives de Naruto : une à la fois, on finit avant d'en prendre une autre |
| **Event Loop** | La boucle qui surveille la call stack et les queues. Règle : stack vide --> microtasks --> rendu --> une macrotask --> recommencer. | `while(true) { if (callStack.isEmpty()) { runMicrotasks(); runOneMacrotask() } }` | L'arbitre du tournoi de Chunin : il gère l'ordre des combats, personne ne saute son tour / Le dispatching des missions au Village : une mission à la fois, les urgences passent devant |
| **Heap** | Zone mémoire où les objets sont stockés. La call stack contient des références vers le heap, pas les objets eux-mêmes. | `const joueur = { nom: "Messi" }` : `joueur` est dans la stack, l'objet `{ nom: "Messi" }` est dans le heap | L'armurerie du camp : les cartes (stack) pointent vers les emplacements (heap), les armes restent là-bas / Le casier des Chevaliers de la Flamme : la référence est dans les papiers, l'armure est dans le casier |
| **Microtask Queue** | File haute priorité. Remplie par `Promise.then()`, `await`, `queueMicrotask()`. Vidée entièrement avant chaque macrotask. | `Promise.resolve().then(() => console.log("je passe avant setTimeout"))` | La file VIP du Conseil de Surveillance : tout le monde attend, mais les Chevaliers Dorés passent en premier / Le carton rouge en foot : traité immédiatement avant de reprendre le jeu |
| **Macrotask Queue** | File basse priorité. Remplie par `setTimeout`, `setInterval`, `requestAnimationFrame`, callbacks I/O. L'event loop en prend UNE par tour. | `setTimeout(() => console.log("macrotask"), 0)` | La salle d'attente normale chez le médecin : chacun son tour, un seul à la fois / Les zombies qui font la queue à la grille de la prison de Rick |
| **setTimeout** | Planifie une fonction dans la macrotask queue après un délai minimum. Le `0` ne veut pas dire "maintenant" : ça veut dire "après les microtasks". | `setTimeout(() => console.log("après"), 0); console.log("avant")` : affiche "avant" puis "après" | Titanr une pizza en 0 minute : la pizza arrive quand elle peut, pas instantanément / Sasuke qui dit "j'arrive tout de suite" : c'est après son jutsu en cours |
| **setInterval** | Planifie une macrotask répétée toutes les N ms. Ne garantit pas un timing exact si le callback est long. | `const id = setInterval(() => tick(), 1000); clearInterval(id)` | Le ticker de score pendant un match live : toutes les secondes, mais peut dériver si le réseau lag / Le système de garde du camp : toutes les heures, sauf si une attaque zombie dépasse l'heure |
| **requestAnimationFrame** | Macrotask synchronisée avec le cycle de rendu navigateur (~60fps). Suspendue quand l'onglet est en arrière-plan. | `function animer() { dessiner(); requestAnimationFrame(animer) }` | Le battement de coeur d'un personnage qui court dans Attack on Titan : régulier, synchronisé avec le mouvement / Le dribble de Mbappé : coordonné avec chaque foulée, pas lancé au hasard |
| **queueMicrotask** | Planifie explicitement une microtask. Alternative légère à `Promise.resolve().then()` quand on veut juste différer sans créer une Promise. | `queueMicrotask(() => console.log("microtask"))` | Glisser un mot au Hokage pendant une réunion : prioritaire, mais pas une urgence officielle / Un SMS urgent entre deux actions dans un match |
| **Starvation** | Situation où les macrotasks ne tournent jamais parce que les microtasks s'enchaînent infiniment. Le rendu et les setTimeout sont bloqués. | `function loop() { Promise.resolve().then(loop) } loop()` : setTimeout ne tourne jamais | La file VIP qui n'arrête pas d'arriver : les gens normaux attendent indéfiniment / Le Training Arc infini : Naruto s'entraîne, les missions s'accumulent, personne n'est dépêché |
| **Blocking Code** | Code synchrone qui prend du temps et bloque la call stack pendant son exécution. Toutes les queues attendent. | `while(i < 1e9) i++` : rien d'autre ne peut tourner pendant ce while | Une longue réunion qui bloque toute l'équipe : personne ne peut travailler / Rick qui fait une longue analyse solo : les autres attendent à la grille |
| **Concurrency** | La capacité de JS à gérer plusieurs opérations en alternant : pas en parallèle. Une chose à la fois, mais intelligemment ordonnée. | `fetch(url1); fetch(url2)` : les deux sont en vol, mais les callbacks s'exécutent l'un après l'autre | Deux missions lancées simultanément dans le Village : les ninjas partent en même temps, leurs rapports reviennent à tour de rôle / Deux chansons en streaming : les deux téléchargent, mais tu ne les entends pas en même temps |
| **Async Function** | Fonction qui retourne toujours une Promise. Le code après chaque `await` est traité comme une microtask. | `async function f() { await delay(); console.log("microtask") }` | Gajeel qui forge une armure : il lance la forge (sync), part chercher du métal (await), revient finir (microtask) / Un joueur qui attend le VAR : il s'arrête, le jeu continue, il reprend quand la décision arrive |
| **Promise** | Objet représentant une valeur future. Peut être `pending`, `fulfilled`, ou `rejected`. Ses callbacks (`.then`, `.catch`) sont des microtasks. | `const p = new Promise((resolve) => setTimeout(resolve, 1000))` | Une lettre de transfer envoyée : en attente (pending), acceptée (fulfilled), refusée (rejected) / La promesse de Naruto de ramener Sasuke : en cours, accomplie, ou échouée |

---

## DIAGRAMME COMPLET DE L'EVENT LOOP

```
                    CODE SOURCE
                        |
                        v
              +-----------------+
              |   CALL STACK    |
              |  (exécution     |
              |   synchrone)    |
              +-----------------+
                        |
              stack vide |
                        v
              +-----------------+       +-----------------+
              | MICROTASK QUEUE |       |      HEAP       |
              |                 |       |  (objets en     |
              | Promise.then()  |       |   mémoire)      |
              | await résolution|       +-----------------+
              | queueMicrotask()|
              +-----------------+
                        |
            queue vide  |
                        v
              +-----------------+
              |   RENDU         |
              | (navigateur)    |
              +-----------------+
                        |
                        v
              +-----------------+
              | MACROTASK QUEUE |
              |                 |
              | setTimeout()    |
              | setInterval()   |
              | rAF()           |
              | I/O callbacks   |
              +-----------------+
                        |
              UNE tâche |
                        v
                retour au début
```

---

## LES 3 RÈGLES QUI EXPLIQUENT TOUT

```
1. call stack se vide          --> microtask queue se vide entièrement
2. microtask queue vide        --> rendu navigateur (si nécessaire) --> UNE macrotask
3. après la macrotask          --> retour à la règle 1
```

Tout le reste est une conséquence de ces trois règles.


> ATTENTION - ou cette analogie casse :
> les analogies mecaniquement sensibles (prototype, closure, event loop, reference vs copie)
> creent de faux modeles si on les prend trop loin. Consulte ce court aide-memoire :
>
> - **prototype != clone** : `Object.create(p)` ne COPIE pas p, il LIE dessus. Modifier p impacte l'enfant.
> - **closure != variable capturee** : la closure capture la REFERENCE au binding, pas la valeur au moment de la creation.
> - **event loop != file simple** : microtasks drainent COMPLETEMENT entre chaque macrotask - pas un round-robin.
> - **reference != alias** : `let b = a; b = {...}` ne mute pas a. `b.x = 1` mute a si a est objet.
