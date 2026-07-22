---
stability: intemporel
---

# RÉFÉRENTIEL DE COMPÉTENCES : OÙ T'EN ES VRAIMENT

-> ~12 min

> Pas un quiz. Pas une note sur 20. Une carte.
> Tu l'ouvres quand tu veux savoir ce que tu maîtrises et ce qui te manque encore.

Tu viens de lire `../START_HERE.md` et `../31_annexes/career/00_guide.md`. Avant d'attaquer `01_fundamentals`,
un dernier arrêt : ce fichier te donne les 4 axes sur lesquels tu vas progresser. Pas pour
le lire en entier maintenant, juste pour savoir qu'il existe. Premier vrai coup d'oeil utile :
après ton bloc 01-04, pas avant. Pour l'instant, retiens juste qu'il est là.

Connaître `Array.prototype.map` par coeur, c'est de la syntaxe.
Savoir pourquoi un objet partagé entre deux modules vient de niquer ton état global à 3h du mat, c'est autre chose.

MyFunnyJS construit quatre capacités. Pas quatre listes de méthodes. Quatre façons de penser.

```
Axe 1  RUNTIME     comprendre ce que la machine fait vraiment
Axe 2  LECTURE     lire un code inconnu sans avoir besoin de le réécrire
Axe 3  DEBUG      formuler une hypothèse, la prouver, corriger juste
Axe 4  ARCHITECTURE  choisir une structure adaptée au problème, pas à la mode
```

> **Lien avec les "six pierres" du README** : les deux cadres parlent de
> la même chose, à deux granularités différentes. Le README vend le
> projet en 6 pierres (Runtime, Mémoire, Asynchrone, Architecture,
> Debugging, Pensée Transférable) parce que c'est plus vendeur à
> l'accroche. Ici, pour te situer concrètement, on regroupe Mémoire et
> Asynchrone dans l'Axe 1 (Runtime au sens large : "ce que la machine
> fait vraiment" couvre les deux), et la Pensée Transférable n'est pas un
> axe séparé : elle se construit en filigrane à travers les 4 axes
> ci-dessous, pas comme une compétence isolée qu'on coche à part.

Chaque axe a 4 niveaux. Pas pour te flatter. Pour te situer.

---

## 1) AXE RUNTIME : COMPRENDRE LA MACHINE

Le runtime (moteur d'exécution), c'est ce qui tourne sous ton code pendant que tu regardes ailleurs.
Tant que tu le vois pas, tu codes à l'aveugle : ton code marche par chance, pas par compréhension.

```
N1  Tu sais que JS exécute ligne par ligne, mais l'event loop c'est encore flou
N2  Tu sais expliquer pourquoi un setTimeout(fn, 0) passe après le code synchrone
N3  Tu sais tracer microtasks vs macrotasks sans te planter sur l'ordre
N4  Tu sais lire un flamegraph et dire où le CPU part en fumée
```

**Modules qui construisent cet axe :** `03_async` (event loop, callbacks, promises), `08_memory_performance` (GC, profiling), `15_runtime_env` (Node vs navigateur).

**Test rapide pour savoir où tu te situes :**
Tu donnes ce code à un pote, il doit dire l'ordre d'affichage sans l'exécuter :

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

Si tu hésites entre B et C : t'es encore en N1-N2. Si tu réponds A, D, C, B direct : t'es en N3 minimum.

---

## 2) AXE LECTURE : LIRE SANS RÉÉCRIRE

Écrire du code, c'est facile à mesurer : ça compile ou ça compile pas.
Lire du code, c'est invisible. Personne te demande "t'as bien lu ?". Et pourtant 80% du métier, c'est lire du code que t'as pas écrit.

```
N1  Tu lis un fichier isolé et tu comprends ce qu'il fait
N2  Tu suis une donnée à travers 3-4 fichiers sans te perdre
N3  Tu repères la zone à risque dans un module avant de le toucher
N4  Tu rentres dans un dépôt inconnu de 50k lignes et tu trouves le point d'entrée en moins de 10 minutes
```

**Modules qui construisent cet axe :** `02_problem_solving` (décomposition, modélisation), `27_team_craft` (navigation de codebase).

**Test rapide :**
Ouvre un dépôt open-source que tu connais pas. Donne-toi 10 minutes pour répondre à : "ce projet fait quoi, et par où ça commence ?" sans lire le README.
Si tu trouves : N2 minimum. Si en plus tu repères une zone qui pue (god class, fonction de 300 lignes) : N3.

---

## 3) AXE DEBUG : L'HYPOTHÈSE AVANT LE CLIC

Le mauvais réflexe : ajouter des `console.log` partout et espérer voir le bug passer.
Le bon réflexe : formuler ce que tu penses qui se passe, vérifier un seul point, confirmer ou rejeter.

```
N1  Tu trouves le bug en mettant des console.log un peu partout, par tâtonnement
N2  Tu formules une hypothèse avant de toucher au debugger
N3  Tu sais isoler la cause avec un seul test ciblé, pas une fouille générale
N4  Tu débuggue en prod sans reproduire localement (logs, snapshots, feature flags)
```

**Modules qui construisent cet axe :** `05_error_handling` (propagation, stratégies), `06_testing` (TDD, isolation), `26_observability` (debug en prod).

**Test rapide :**
Prochaine fois qu'un bug apparaît, avant de toucher au code : écris en une phrase ce que tu penses qui se passe.
Si t'arrives à l'écrire avant de chercher : N2. Si ton hypothèse était juste du premier coup : N3.

---

## 4) AXE ARCHITECTURE : CHOISIR, PAS COPIER

N'importe qui peut copier un pattern vu sur un blog. La vraie compétence, c'est savoir pourquoi celui-là et pas un autre, ici, maintenant.

```
N1  Tu connais les patterns par leur nom (Factory, Observer, Singleton)
N2  Tu sais dire pourquoi un pattern précis résout un problème précis
N3  Tu sais refuser un pattern parce qu'il complique plus qu'il résout
N4  Tu conçois une architecture from scratch et tu anticipes ce qui va casser dans 6 mois
```

**Modules qui construisent cet axe :** `12_design_patterns`, `13_refactoring`, `16_architecture_patterns`.

**Test rapide :**
On te propose d'ajouter un Singleton à ton projet. Tu sais lister 2 raisons de dire non avant de regarder le code ?
Si oui : N3 minimum.

---

## 5) COMMENT LIRE TA PROGRESSION

Pas de moyenne. Pas de score global. T'es pas un bulletin scolaire.

Un dev solide est rarement N4 partout. Un dev qui code l'archi d'un système distribué peut être N2 en lecture parce qu'il a jamais eu besoin de plonger dans un dépôt étranger.
Ce qui compte : savoir où sont tes trous, pas viser le 4/4/4/4.

```
PROFIL TYPIQUE D'UN JUNIOR    Runtime N1  Lecture N1  Debug N1  Architecture N1
PROFIL TYPIQUE APRÈS 01-08    Runtime N2  Lecture N2  Debug N2  Architecture N1
PROFIL TYPIQUE APRÈS 09-15    Runtime N2  Lecture N2  Debug N2  Architecture N3
PROFIL TYPIQUE APRÈS 22-29    Runtime N3  Lecture N3  Debug N3  Architecture N3
```

Ces profils sont des repères, pas des objectifs à cocher. Si t'es Runtime N3 dès le module 04 parce que t'as déjà fait du Node avant : tant mieux, avance.

---

## 6) CE QUE CE FICHIER N'EST PAS

Pas un système de notation automatique. Pas un quiz à remplir. Pas une certification.
C'est une carte que tu consultes seul, pour toi, quand tu veux savoir si tu stagnes sur un axe précis pendant que les autres avancent.

Si après 15 modules ton axe Lecture est resté en N1 pendant que ton axe Runtime est en N3 : c'est pas grave, mais c'est un signal. Va lire du code inconnu un peu plus souvent.

---

## COMMENT ABORDER LE PARCOURS

Tu connais maintenant les 4 axes. Voilà comment t'organiser concrètement une fois dans
le curriculum.

### Lis le 00_why avant le 01

Chaque module commence par un `00_why_<module>.md`. C'est pas une intro qu'on saute pour
aller au code. C'est le fichier qui te dit pourquoi ce module existe et ce qui pue dans
un projet qui l'ignore. Si tu sautes direct au `01_`, tu vas apprendre la technique sans
savoir pourquoi elle compte. Et un truc appris sans raison s'oublie vite.

### Comment gérer la charge mentale

T'as 32 modules devant toi. Si tu regardes la montagne entière, tu vas paniquer. Donc :

- **Un module à la fois, jusqu'au bout.** Pas trois modules en parallèle "pour varier".
 Le cerveau qui jongle entre plusieurs sujets non finis retient moins bien que celui qui
 en termine un avant d'ouvrir le suivant.
- **Le grimoire en fin de module, c'est ton check de compréhension.** Si tu le lis et que
 des termes te paraissent flous, retourne dans le module. Pas grave de revenir en arrière.
 Grave de continuer en faisant semblant d'avoir compris.
- **Les mini-projets (`30_mini_projects`) ne sont pas un bonus.** C'est là que les concepts
 isolés deviennent un seul geste. Si tu sautes les mini-projets, tu sors avec des bouts de
 savoir qui ne se connectent pas entre eux.
- **Stagner sur un concept, c'est normal.** Closures, event loop, prototype chain : tout le
 monde galère dessus la première fois. Le `02_scope/03_scope_escape_room.md` et compagnie
 sont là exactement pour ça. Refais l'exercice avant de passer à la suite, même si ça prend
 deux essais.
- **`where_you_stand.md` n'est pas un quiz à remplir.** C'est
 une carte que tu consultes seul, quand tu veux savoir si tu stagnes sur un axe précis
 (Runtime, Lecture, Debug, Architecture) pendant que les autres avancent. Personne te demande
 ton score. T'es le seul à le lire. Premier coup d'oeil utile : après le bloc 01-04, pas avant,
 sinon les 4 axes te parlent encore de rien de concret.
- **L'event loop, le call stack, le cycle HTTP : tu vas les croiser dans plusieurs modules.**
 `31_annexes/01_ascii_charte.md` regroupe les 8 schémas canoniques. Même schéma partout, pas
 une version différente à chaque module. Si un dessin te paraît familier, c'est normal,
 c'est voulu.
- **Tu cherches un fichier précis et tu sais pas dans quel module il est ?**
 `31_annexes/ARBORESCENCE.md` liste tout, dossier par dossier, fichier par
 fichier, avec son rôle en une ligne. Pas à lire d'une traite : à consulter au besoin.

### Repérer les modules denses (ralentis volontairement ici)

Tous les modules ne se valent pas en charge cognitive. Ceux-là méritent plus de temps, pas
une lecture en diagonale :

```
03_async       => l'event loop tord le cerveau la première fois, c'est normal
08_memory_performance => beaucoup de mécanique invisible (GC, profiling) à visualiser sans la voir tourner
09_data_structures  => 10_algorithms en dépend direct, bâcler l'un casse l'autre
14_typescript     => le système de types a son propre raisonnement, différent de JS
16_architecture_patterns => abstrait par nature, les exemples concrets sont indispensables ici
22_security      => chaque sous-thème (XSS, CSRF, auth) est dense seul, ne pas les fusionner
18_oop_js       => la chaîne de prototype clarifie tout, mais seulement si tu ne la survoles pas
```

Sur ces modules-là : ralentis. Fais les trois niveaux d'exemple (minimal, réaliste, qui casse)
sans en sauter un. C'est exactement là que se joue la différence entre "j'ai lu" et "j'ai compris".

### Temps estimé (ordre de grandeur, pas un chronomètre)

```
01-06  Fondamentaux       => le socle, prends ton temps, tout le reste s'appuie dessus
07-13  Structures et pratiques  => bloc dense, data structures + algos + TS demandent de la pratique répétée
14-21  Système web complet    => large mais plus horizontal, beaucoup de modules courts et ciblés
22-27  Ingénierie senior     => plus rapide à lire, mais demande déjà les blocs précédents pour faire sens
29   Mini-projets        => le vrai test : ça prend autant de temps que tu acceptes d'y mettre
```

Pas de nombre d'heures donné ici : ça dépend trop de ton rythme, de ton niveau de départ, et
du temps que tu mets vraiment à coder (pas juste à lire). Le seul vrai indicateur : si tu finis
un module et que t'arrives pas à expliquer le concept à quelqu'un d'autre avec tes propres mots,
t'as lu trop vite.

### Si tu bloques

Relis le `00_why` du module. Souvent le blocage vient pas de la technique, mais du fait que tu
as perdu le pourquoi en cours de route. Et si après ça tu bloques encore : c'est probablement
un module en amont mal digéré. Remonte d'un cran avant d'insister sur celui qui résiste.

---

## Et maintenant ?

Tu sais où te situer, tu sais comment t'organiser. Reste plus qu'à voir l'ordre exact.

Ouvre `README.md` à la racine, lis la ROADMAP, et lance-toi.
