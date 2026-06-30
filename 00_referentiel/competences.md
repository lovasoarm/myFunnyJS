# RÉFÉRENTIEL DE COMPÉTENCES : OÙ T'EN ES VRAIMENT

> Pas un quiz. Pas une note sur 20. Une carte.
> Tu l'ouvres quand tu veux savoir ce que tu maîtrises et ce qui te manque encore.

Connaître `Array.prototype.map` par coeur, c'est de la syntaxe.
Savoir pourquoi un objet partagé entre deux modules vient de niquer ton état global à 3h du mat, c'est autre chose.

MyFunnyJS construit quatre capacités. Pas quatre listes de méthodes. Quatre façons de penser.

```
Axe 1   RUNTIME         comprendre ce que la machine fait vraiment
Axe 2   LECTURE         lire un code inconnu sans avoir besoin de le réécrire
Axe 3   DEBUG           formuler une hypothèse, la prouver, corriger juste
Axe 4   ARCHITECTURE    choisir une structure adaptée au problème, pas à la mode
```

Chaque axe a 4 niveaux. Pas pour te flatter. Pour te situer.

---

## 1) AXE RUNTIME : COMPRENDRE LA MACHINE

Le runtime (moteur d'exécution), c'est ce qui tourne sous ton code pendant que tu regardes ailleurs.
Tant que tu le vois pas, tu codes à l'aveugle : ton code marche par chance, pas par compréhension.

```
N1   Tu sais que JS exécute ligne par ligne, mais l'event loop c'est encore flou
N2   Tu sais expliquer pourquoi un setTimeout(fn, 0) passe après le code synchrone
N3   Tu sais tracer microtasks vs macrotasks sans te planter sur l'ordre
N4   Tu sais lire un flamegraph et dire où le CPU part en fumée
```

**Modules qui construisent cet axe :** `02_async` (event loop, callbacks, promises), `06_memory_performance` (GC, profiling), `14_runtime_env` (Node vs navigateur).

**Test rapide pour savoir où tu te situes :**
Tu donnes ce code à un pote, il doit dire l'ordre d'affichage sans l'exécuter :
```js
console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
console.log('D')
```
Si tu hésites entre B et C : t'es encore en N1-N2. Si tu réponds A, D, C, B direct : t'es en N3 minimum.

---

## 2) AXE LECTURE : LIRE SANS RÉÉCRIRE

Écrire du code, c'est facile à mesurer : ça compile ou ça compile pas.
Lire du code, c'est invisible. Personne te demande "t'as bien lu ?". Et pourtant 80% du métier, c'est lire du code que t'as pas écrit.

```
N1   Tu lis un fichier isolé et tu comprends ce qu'il fait
N2   Tu suis une donnée à travers 3-4 fichiers sans te perdre
N3   Tu repères la zone à risque dans un module avant de le toucher
N4   Tu rentres dans un dépôt inconnu de 50k lignes et tu trouves le point d'entrée en moins de 10 minutes
```

**Modules qui construisent cet axe :** `12_problem_solving` (décomposition, modélisation), `26_team_craft` (navigation de codebase).

**Test rapide :**
Ouvre un dépôt open-source que tu connais pas. Donne-toi 10 minutes pour répondre à : "ce projet fait quoi, et par où ça commence ?" sans lire le README.
Si tu trouves : N2 minimum. Si en plus tu repères une zone qui pue (god class, fonction de 300 lignes) : N3.

---

## 3) AXE DEBUG : L'HYPOTHÈSE AVANT LE CLIC

Le mauvais réflexe : ajouter des `console.log` partout et espérer voir le bug passer.
Le bon réflexe : formuler ce que tu penses qui se passe, vérifier un seul point, confirmer ou rejeter.

```
N1   Tu trouves le bug en mettant des console.log un peu partout, par tâtonnement
N2   Tu formules une hypothèse avant de toucher au debugger
N3   Tu sais isoler la cause avec un seul test ciblé, pas une fouille générale
N4   Tu débuggue en prod sans reproduire localement (logs, snapshots, feature flags)
```

**Modules qui construisent cet axe :** `03_error_handling` (propagation, stratégies), `04_testing` (TDD, isolation), `25_observability` (debug en prod).

**Test rapide :**
Prochaine fois qu'un bug apparaît, avant de toucher au code : écris en une phrase ce que tu penses qui se passe.
Si t'arrives à l'écrire avant de chercher : N2. Si ton hypothèse était juste du premier coup : N3.

---

## 4) AXE ARCHITECTURE : CHOISIR, PAS COPIER

N'importe qui peut copier un pattern vu sur un blog. La vraie compétence, c'est savoir pourquoi celui-là et pas un autre, ici, maintenant.

```
N1   Tu connais les patterns par leur nom (Factory, Observer, Singleton)
N2   Tu sais dire pourquoi un pattern précis résout un problème précis
N3   Tu sais refuser un pattern parce qu'il complique plus qu'il résout
N4   Tu conçois une architecture from scratch et tu anticipes ce qui va casser dans 6 mois
```

**Modules qui construisent cet axe :** `10_design_patterns`, `11_refactoring`, `15_architecture_patterns`.

**Test rapide :**
On te propose d'ajouter un Singleton à ton projet. Tu sais lister 2 raisons de dire non avant de regarder le code ?
Si oui : N3 minimum.

---

## 5) COMMENT LIRE TA PROGRESSION

Pas de moyenne. Pas de score global. T'es pas un bulletin scolaire.

Un dev solide est rarement N4 partout. Un dev qui code l'archi d'un système distribué peut être N2 en lecture parce qu'il a jamais eu besoin de plonger dans un dépôt étranger.
Ce qui compte : savoir où sont tes trous, pas viser le 4/4/4/4.

```
PROFIL TYPIQUE D'UN JUNIOR        Runtime N1   Lecture N1   Debug N1   Architecture N1
PROFIL TYPIQUE APRÈS 01-08        Runtime N2   Lecture N2   Debug N2   Architecture N1
PROFIL TYPIQUE APRÈS 09-15        Runtime N2   Lecture N2   Debug N2   Architecture N3
PROFIL TYPIQUE APRÈS 22-28        Runtime N3   Lecture N3   Debug N3   Architecture N3
```

Ces profils sont des repères, pas des objectifs à cocher. Si t'es Runtime N3 dès le module 04 parce que t'as déjà fait du Node avant : tant mieux, avance.

---

## 6) CE QUE CE FICHIER N'EST PAS

Pas un système de notation automatique. Pas un quiz à remplir. Pas une certification.
C'est une carte que tu consultes seul, pour toi, quand tu veux savoir si tu stagnes sur un axe précis pendant que les autres avancent.

Si après 15 modules ton axe Lecture est resté en N1 pendant que ton axe Runtime est en N3 : c'est pas grave, mais c'est un signal. Va lire du code inconnu un peu plus souvent.
