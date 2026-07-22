---
stability: intemporel
---

# Page verrouillée

> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../31_annexes/18_GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~10 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## GRIMOIRE DU RUNTIME : LE VOCABULAIRE DU CODE QUI TOURNE

| Terme                  | Définition                                                                                                                | Code                                                                                                                                                   | Analogies                                                                                                                                                                             | Limite |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| **Runtime**            | L'environnement d'exécution : le moteur JS + les APIs disponibles selon où le code tourne                                 | `typeof window // 'object' (browser) ou 'undefined' (Node)` : (on teste ce qui existe pour savoir où on est)                                           | le terrain de foot vs le gymnase : mêmes joueurs, équipements différents / la cuisine d'un restaurant vs la cuisine d'une maison : mêmes gestes, outils différents                    | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **V8**                 | Le moteur JS de Google, utilisé par Node et Chrome : il lit le JS, le compile en JIT, et l'exécute                        | pas d'API directe : c'est la couche sous process.memoryUsage() (on voit son impact via les métriques mémoire)                                          | le moteur d'une voiture : tu conduis sans y penser, mais c'est lui qui fait tout / le moteur JIT d'un avion : il compile les instructions au décollage, pas avant                     | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **JIT (Just-In-Time)** | Compilation à la volée pendant l'exécution : V8 compile les fonctions chaudes en code machine optimisé                    | une fonction appelée 10000 fois sera compilée ; une appelée une fois restera interprétée                                                               | le cuisinier qui mémorise la recette qu'il fait tous les jours / un traducteur qui finit par savoir le texte par cœur à force de le traduire                                          | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **process.env**        | Objet contenant les variables d'environnement du système : toujours des strings, jamais des numbers                       | `const port = parseInt(process.env.PORT ?? '3000', 10)` : (conversion obligatoire : c'est toujours une string)                                         | les instructions secrètes qu'on donne avant le match, pas pendant / les paramètres de config d'une fusée : définis avant le lancement, pas modifiables en vol                         | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **process.argv**       | Tableau des arguments passés à Node : argv[0] = node, argv[1] = script, argv[2+] = tes args                               | `const args = process.argv.slice(2)` : (on coupe les deux premiers qui ne servent à rien)                                                              | les ordres criés depuis le banc de touche avant un coup franc / les instructions données à un agent avant sa mission : il les lit au départ                                           | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **Buffer**             | Bloc de mémoire brute en dehors du heap V8 : stocke des données binaires (octets, pas strings)                            | `const buf = Buffer.from('text', 'utf-8'); buf.toString('utf-8')` : (from crée, toString lit)                                                          | une clé USB : elle stocke des bits bruts, pas du texte / un paquet de données qu'on doit déballer avant de lire                                                                       | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **Stream**             | Canal qui envoie des données par morceaux : pas tout d'un coup, chunk après chunk                                         | `fs.createReadStream(file).pipe(process.stdout)` : (chaque chunk passe, pas le fichier entier)                                                         | un tuyau d'eau : l'eau coule en continu, tu n'attends pas que la source soit vide / un flux de nouvelles en direct : tu lis au fur et à mesure, pas en attente que tout soit écrit    | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **Backpressure**       | Le mécanisme qui ralentit le producteur quand le consommateur ne suit pas : évite les débordements mémoire                | `const ok = writable.write(chunk); if (!ok) readable.pause()` : (write() retourne false quand le buffer est plein)                                     | une file de caisse qui fait attendre les clients quand la caissière est débordée / un producteur de musique qui met le chanteur en pause quand le studio est saturé                   | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **pipe()**             | Branche un Readable sur un Writable et gère la backpressure automatiquement                                               | `readStream.pipe(transform).pipe(writeStream)` : (chaînable, backpressure gérée)                                                                       | brancher un tuyau sur un autre : l'eau coule tout seul, tu ne portes rien / un pipeline de transformation : chaque étape reçoit et transmet                                           | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **CommonJS (CJS)**     | Système de modules Node historique : require() synchrone, exports dynamiques, pas de tree shaking                         | `const { fn } = require('./module')` : (synchrone : l'exécution s'arrête jusqu'au chargement)                                                          | un livre qu'on charge en entier avant de pouvoir lire n'importe quelle page / une réunion où tout le monde attend que tout le monde soit là pour commencer                            | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **ESM (ES Modules)**   | Standard JS moderne : import/export statiques, asynchrone possible, tree shaking natif                                    | `import { fn } from './module.js'` : (extension .js obligatoire en Node ESM)                                                                           | une table des matières analysée avant d'ouvrir le livre : on sait ce dont on a besoin avant de charger / un film Netflix : tu télécharges ce que tu regardes, pas le catalogue entier | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **Tree shaking**       | Élimination du code mort : le bundler supprime ce qui n'est jamais importé : uniquement possible avec ESM                 | pas de code, c'est une étape de build (Vite, Rollup, esbuild font ça automatiquement)                                                                  | ne prendre que les joueurs qui jouent, pas tout l'effectif / préparer uniquement les plats commandés, pas tout le menu                                                                | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **import.meta.url**    | URL du fichier courant en ESM : remplace \_\_filename (qui n'existe pas en ESM natif)                                     | `const __dirname = dirname(fileURLToPath(import.meta.url))` : (le pattern standard pour retrouver \_\_dirname)                                         | une carte avec "vous êtes ici" : le fichier sait où il est dans le système / l'adresse retour sur une lettre : le fichier connaît son propre emplacement                              | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **Worker Thread**      | Thread JS séparé pour les calculs CPU intensifs : l'event loop reste libre pendant que le worker bosse                    | `new Worker('./worker.js', { workerData: data })` puis `worker.on('message', result => ...)`                                                           | un assistant à qui tu délègues un calcul long : toi tu continues à gérer les clients pendant qu'il bosse / un sous-traitant qui livre le résultat quand c'est prêt                    | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **workerData**         | Les données envoyées au Worker Thread au moment de sa création : copiées (pas partagées)                                  | `const worker = new Worker('./w.js', { workerData: { votes, config } })` : (disponible dans le worker via import { workerData } from 'worker_threads') | les documents remis à un expert avant qu'il commence : copies, pas les originaux / le briefing transmis à un agent avant la mission                                                   | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **SharedArrayBuffer**  | Zone mémoire partagée entre le thread principal et les workers : zéro copie, accès concurrent                             | `const shared = new SharedArrayBuffer(4); new Int32Array(shared)` : (utiliser Atomics pour éviter les race conditions)                                 | un tableau blanc dans une salle de réunion : tout le monde voit et modifie en temps réel / une feuille partagée Google Sheets : tout le monde écrit dessus en même temps              | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **Atomics**            | API pour les opérations atomiques thread-safe sur SharedArrayBuffer : évite les race conditions                           | `Atomics.add(int32Array, 0, 1)` : (incrément garanti thread-safe même avec plusieurs workers)                                                          | la règle "un seul à la fois" au tableau blanc : personne n'écrase ce que l'autre écrit / un arbitre qui gère les accès simultanés sur le même ballon                                  | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **process.exit()**     | Termine le processus Node avec un code de sortie : 0 = succès, 1 = erreur (convention universelle)                        | `process.exit(0)` pour succès, `process.exit(1)` pour erreur : (bash et CI/CD lisent ce code)                                                          | le coup de sifflet final de l'arbitre : 0 match normal, 1 arrêt pour incident / le rapport de mission : succès ou échec, le QG doit savoir                                            | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **isTTY**              | Propriété de process.stdout : true si le terminal est interactif (vrai terminal), false si pipe ou redirect               | `if (process.stdout.isTTY) { /* couleurs */ } else { /* texte brut */ }` : (évite les codes ANSI dans les logs ou fichiers)                            | vérifier si quelqu'un écoute en direct avant de faire du bruit / un speaker qui désactive les effets sonores quand il est enregistré                                                  | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **ENOENT**             | Code d'erreur Node pour "fichier ou dossier introuvable" (Error NO ENTry)                                                 | `catch (err) { if (err.code === 'ENOENT') return null }` : (toujours tester err.code, pas err.message)                                                 | le carton rouge pour joueur absent : le système te dit exactement pourquoi ça ne marche pas / le message "destinataire introuvable" sur une lettre : clair, pas ambigu                | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **Shebang**            | Première ligne d'un script exécutable : indique au shell quel interpréteur utiliser                                       | `#!/usr/bin/env node` : (obligatoire pour que le fichier soit exécutable sans taper 'node' devant)                                                     | la mention "utiliser ce stylo" sur un formulaire : le terminal sait comment ouvrir le fichier / l'en-tête d'un dossier médical : le médecin sait comment l'interpréter                | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| **npm link**           | Installe le package courant globalement sur ta machine en mode développement : la commande bin devient disponible partout | `npm link` dans le dossier projet, puis la commande définie dans bin est dispo globalement : (npm unlink pour défaire)                                 | un raccourci bureau vers l'application en développement : tu testes comme si c'était installé / un pass VIP qui te donne accès au concert même pendant les répétitions                | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---

stability: stable

---

## TROIS PUBLICS : GRILLE D'AUTO-EVALUATION

> Greffe P6 : un ingenieur qui ne sait pas expliquer a trois publics ne survit
> pas a un entretien senior. Voir `27_team_craft/12_three_audiences_intro.md`.

Prends le concept-cle du module. Explique-le **trois fois**, chronometre en main :

### 1. A un enfant de 10 ans (60 s)

Analogie seule, zero jargon. Si le mot "runtime" sort, tu as perdu.

### 2. A un dev junior (3 min)

Un exemple de code minimal executable, un piege classique, un cas d'usage reel.

### 3. A un CTO hostile (5 min)

Trade-off, cout, quand NE PAS l'utiliser, impact business, alternative.

### Grille (coche honnetement)

- [ ] Enfant : aucun mot technique.
- [ ] Junior : l'exemple tourne vraiment.
- [ ] CTO : le mot "cout" ou "risque" est sorti au moins une fois.
- [ ] Aucune version ne ment (pas de simplification qui devient fausse).

Si une case n'est pas cochee : tu ne maitrises pas encore ce concept, tu le
recites.

---

## OÙ LES ANALOGIES CASSENT (règle B.2)

Les analogies de ce grimoire simplifient : elles ne définissent pas. Une
closure **nest pas** un tiroir ; un event loop **nest pas** un carrousel ;
une pile **nest pas** une pile de crêpes. Chaque analogie sert à visualiser
un mécanisme ; elle cesse dès que tu veux raisonner sur la complexité, la
mémoire, la concurrence ou les cas limites. Reviens toujours à la définition
technique avant de coder, débugger ou expliquer à un pair. Une analogie
prise pour la réalité devient un obstacle épistémologique.
