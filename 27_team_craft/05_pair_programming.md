---
stability: intemporel
---

# PAIR PROGRAMMING : DEUX CERVEAUX, UN CLAVIER
Temps de lecture ~9 min

Le pair programming (programmation en binôme) mal pratiqué : un dev code, l'autre regarde et s'ennuie.
Le pair programming bien pratiqué : un dev code, l'autre pense : et ils switchent.

Ce n'est pas une technique pour aller deux fois plus lentement. C'est une technique pour éviter les bugs qui coûtent cinq fois plus cher à corriger en prod qu'à la source.

Google, Stripe, et la plupart des équipes de trading algorithmique le font sur les parties critiques du code. Pas tout le temps. Sur les bons problèmes.

---

## 1) LES DEUX RÔLES

```
DRIVER (pilote)          NAVIGATOR (copilote)
----------------------------    ----------------------------
il tape le code          il pense à l'algorithme
il parle à voix haute       il repère les bugs avant qu'ils arrivent
il suit les instructions      il vérifie que la direction est bonne
il ne prend pas de décisions    il ne touche pas au clavier
 majeures seul
il pose des questions si      il pose des questions sur le why,
 quelque chose n'est pas clair   pas sur le how
```

**Ce n'est pas une hiérarchie.** Le driver n'est pas subordonné au navigator.
Le navigator n'est pas le "chef". C'est une division temporaire du travail cognitif.

---

## 2) POURQUOI ÇA MARCHE (QUAND C'EST BIEN FAIT)

Le cerveau en mode "écriture de code" et le cerveau en mode "lecture critique de code" ne font pas la même chose.

```
DRIVER : focus étroit
     --> syntaxe, logique locale, ce que la fonction fait maintenant

NAVIGATOR : focus large
      --> "est-ce qu'on est en train de résoudre le bon problème ?"
      --> "ce cas null sera jamais géré avec cette approche"
      --> "on a fait quelque chose de similaire dans le module auth,
         on pourrait réutiliser"
```

En solo, t'essaies de faire les deux en même temps. Et t'es moins bon dans les deux.

**Les bugs que le pair programming attrape en avance :**
- les cas limites oubliés (le navigator les voit parce qu'il n'est pas en train de coder)
- les mauvaises abstractions (le navigator les repère quand le driver galère à expliquer ce qu'il fait)
- les décisions d'architecture prises trop vite (le navigator demande "pourquoi pas X ?")

---

## 3) QUAND SWITCHER

Le switch entre driver et navigator doit être régulier. Deux formats principaux :

**Pomodoro (minuteur) :**
```
25 min : A est driver, B est navigator
pause : 5 minutes de débrief
25 min : B est driver, A est navigator
```

**Ping-pong (TDD) :**
```
A écrit un test qui échoue
B écrit le code minimal pour que le test passe
B écrit le prochain test
A écrit le code pour faire passer ce test
--> continue
```

Le ping-pong est particulièrement puissant pour le TDD parce qu'il force chacun à
penser à la fois au test et à l'implémentation, alternativement.

---

## 4) LES ERREURS QUI TUENT UNE SESSION DE PAIR

```
ERREUR               CE QUI SE PASSE
---------------------------    ----------------------------------
le navigator "backseat drives"   le driver perd confiance et tape
(corrige chaque typo, chaque    plus vite pour "en finir"
micro-décision)

le driver code en silence     le navigator s'ennuie et décroche
sans expliquer           mentalement au bout de 10 minutes

pas de switch pendant 2 heures   le navigator finit par coder dans
                  sa tête en parallèle, l'énergie tombe

le pair devient une validation   "tu peux regarder ce que j'ai fait ?"
 passive             ce n'est pas du pair, c'est une review
                  asynchrone habillée en pair

un dev plus senior qui "sait"   le junior code sous pression, le
et qui corrige tout le temps    senior pense enseigner, les deux
                  sont frustrés
```

---

## 5) PAIR PROGRAMMING À DISTANCE

La plupart des équipes sont maintenant distribuées. Le pair à distance fonctionne, mais il demande plus de discipline.

**Outils :**
```
VS Code Live Share   -- partage de curseur en temps réel, le mieux en 2026
tmux + ssh       -- vieux mais fiable, bonne option pour les setups CLI
Screen dans Zoom/Meet -- facile mais le lag casse le rythme
Tuple         -- outil dédié au pair, qualité vidéo et latence optimisées
```

**Règles supplémentaires pour le remote :**
- vidéo obligatoire : sans la vidéo, le navigator perd les signaux non-verbaux qui montrent que le driver est bloqué
- parler encore plus à voix haute qu'en présentiel : ce qui est évident sur un écran partagé physiquement ne l'est pas en remote
- switch plus fréquent : la fatigue de la concentration monte plus vite à distance

---

## 6) QUAND NE PAS FAIRE DU PAIR

Le pair n'est pas adapté à tout. Utiliser le pair sur les mauvais problèmes : perte de temps et frustration.

```
BON POUR LE PAIR          MAUVAIS POUR LE PAIR
--------------------------     --------------------------
code critique (auth, tribut)   tâches répétitives (migrations de données)
débogage d'un bug complexe     lecture de documentation
onboarding d'un nouveau dev    recherche exploratoire solo
décisions d'architecture      écriture de tests unitaires simples
implémentation d'algo complexe   configuration de projet (npm init, etc.)
code qui va faire l'objet
d'une revue importante
```

**Règle :** si un problème peut être résolu efficacement en solo en moins d'une heure, le pair n'apporte probablement pas assez de valeur pour justifier deux personnes dessus.

---

## 7) LE DÉBRIEF : LA PARTIE OUBLIÉE

Après chaque session de pair, 5 minutes de débrief :

```
QUESTIONS DU DÉBRIEF
--------------------------
Qu'est-ce qu'on a accompli ?
Qu'est-ce qu'on ferait différemment la prochaine fois ?
Qu'est-ce que chacun a appris ?
Le problème suivant mérite-t-il une session de pair ?
```

Sans débrief : la session s'arrête, chacun repart dans son coin, et les apprentissages ne se capitalisent pas. Le débrief prend 5 minutes. Il multiplie la valeur de la session par 2.

---

## EXERCICES

**EXO 1 : le driver qui explique**

À faire en binôme (ou simulé avec une personne imaginaire).
Prends un algorithme de tri (bubble sort, merge sort, peu importe).
Règle : le driver doit expliquer à voix haute chaque ligne qu'il écrit, avant de la taper.
Pas après : avant.

Si tu ne peux pas expliquer une ligne avant de la taper : tu ne comprends pas encore assez ce que tu fais.

Objective : après la session, le navigator doit pouvoir réimplémenter l'algo sans regarder le code.

---

**EXO 2 : ping-pong TDD**

À faire en binôme sur le module de gestion des votes du `07_ballon_dor_cli`.

Règles :
- A écrit un test qui échoue pour `registerVote(journalist, player)`
- B écrit le code minimal pour le faire passer (pas plus)
- B écrit un test qui échoue pour le cas suivant
- A écrit le code minimal
- Continue pendant 6 cycles

Après : les deux regardent le code produit et discutent de ce qui peut être refactoré.

---

**EXO 3 : navigator challenge**

A code une fonction seul pendant 15 minutes sans l'expliquer.
B observe en silence total.
Après 15 minutes : B liste tout ce qu'il n'a pas compris, les edge cases non couverts, et les décisions d'architecture qui lui semblent discutables.

L'objectif : simuler ce que ressent le navigator quand le driver code en silence.
La discussion après révèle en général deux ou trois problèmes que A n'avait pas vus.

---

## RÉSUMÉ

Le driver code et parle, le navigator pense et observe : la division du travail cognitif est la valeur du pair.
Le switch régulier (pomodoro ou ping-pong) maintient les deux cerveaux actifs.
Les erreurs qui tuent une session : backseat driving, silence du driver, pas de switch, pas de débrief.
Le pair à distance fonctionne avec vidéo, parole active, et switch plus fréquent.
Le pair n'est pas adapté à tout : l'utiliser sur les problèmes complexes et critiques, pas sur les tâches répétitives.
Le débrief de 5 minutes multiplie la valeur de la session.
