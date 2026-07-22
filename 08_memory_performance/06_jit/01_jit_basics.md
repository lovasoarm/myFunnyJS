---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# JIT BASICS : LE MOTEUR QUI APPREND TON CODE EN LE LISANT
Temps de lecture ~9 min

Ton code JS n'est jamais "juste exécuté". Il est observé, mesuré, puis réécrit en interne par V8 (le moteur JS de Chrome et Node) pendant qu'il tourne. Le JIT (Just-In-Time : compilation à la volée) regarde tes fonctions, repère celles qui tournent souvent, et les transforme en code machine optimisé.

Le piège : cette optimisation peut sauter à tout moment, sans erreur, sans log, juste un ralentissement brutal que personne ne comprend.

---

## 1) DEUX MOTEURS DANS V8 : IGNITION ET TURBOFAN

V8 ne compile pas ton code une seule fois. Il le fait en deux passes, avec deux moteurs différents.

```
ton code source
   |
   v
 Ignition (interpréteur : exécute ligne par ligne, rapide à démarrer)
   |
   v  (si une fonction tourne souvent : "hot function")
   |
   v
 TurboFan (compilateur optimisant : transforme en code machine ultra rapide)
```

**Ignition** démarre vite. Il transforme ton code en bytecode (instructions intermédiaires, plus rapides à lire qu'une string de code source) et l'exécute direct. Pas d'optimisation, juste de la rapidité de démarrage.

**TurboFan** entre en jeu quand Ignition repère qu'une fonction est appelée des milliers de fois (un "hot path" : chemin d'exécution chaud). Il prend cette fonction, fait des paris sur la forme de ses données, et génère du code machine optimisé spécifiquement pour ces paris.

Le mot clé : **paris**. TurboFan optimise pour le cas qu'il a observé, pas pour tous les cas possibles. Et un pari qui se révèle faux, ça se paie cash. On y revient en section 3.

---

## 2) HIDDEN CLASSES : POURQUOI LA FORME DE TON OBJET COMPTE

JS n'a pas de classes fixes comme Java ou C++. Mais V8 en crée quand même en interne, pour pouvoir optimiser l'accès aux propriétés.

```js
// le moteur de combat de rasengan_engine
function creerNinja(nom, chakra) {
 const ninja = {}
 ninja.nom = nom    // V8 crée une hidden class C0 (juste {})
 ninja.chakra = chakra // V8 transitionne vers C1 ({nom})
             // puis vers C2 ({nom, chakra})
 return ninja
}

const naruto = creerNinja('Naruto', 100)
const sasuke = creerNinja('Sasuke', 90)
// naruto et sasuke partagent la MÊME hidden class C2
// V8 peut donc accéder à .chakra avec un offset mémoire fixe, sans chercher
```

Tant que tous tes objets passent par le même chemin de création, dans le même ordre, V8 les range sous la même hidden class et accède à leurs propriétés quasi instantanément.

Le piège arrive quand deux objets censés être "pareils" ne le sont pas vraiment :

```js
const sakura = creerNinja('Sakura', 80)
sakura.element = 'terre' // ajouté APRÈS coup, hors du chemin habituel
// sakura bascule sur une hidden class différente de naruto et sasuke
// V8 ne peut plus traiter ces trois objets de façon uniforme
// résultat : accès plus lent, optimisations perdues sur ce groupe d'objets
```

Règle pratique : initialise toutes les propriétés d'un objet dans le même ordre, dès la construction. Ne les ajoute pas au compte-gouttes plus tard.

---

## 3) INLINE CACHES : LA MÉMOIRE COURTE DE V8

Pour aller encore plus vite, V8 retient "la dernière fois où j'ai accédé à cette propriété, c'était quelle hidden class". C'est l'inline cache (cache en ligne, attaché directement au point d'appel dans le code).

```js
function getChakra(ninja) {
 return ninja.chakra
}

// si getChakra() est toujours appelée avec des objets de la même hidden class :
// V8 mémorise "ninja.chakra est toujours à l'offset 8" et saute la recherche
// → c'est un monomorphic inline cache (une seule forme observée, rapide)

// si getChakra() reçoit parfois un ninja {nom, chakra}, parfois {chakra, nom, element} :
// V8 doit gérer plusieurs formes
// → polymorphic (2-4 formes : encore correct) ou megamorphic (5+ formes : optimisation abandonnée)
```

Une fonction appelée avec des objets de formes différentes perd tout l'avantage de l'inline cache. Elle redevient lente, même si elle tourne des milliers de fois.

---

## 4) DEOPTIMIZATION : QUAND LE PARI DE TURBOFAN ÉCHOUE

TurboFan optimise sur la base d'hypothèses ("cette variable est toujours un number", "ce tableau ne contient que des objets de telle forme"). Si une de ces hypothèses devient fausse en cours de route, V8 doit jeter le code optimisé et revenir à Ignition. C'est une déoptimisation (deopt).

```js
function additionner(a, b) {
 return a + b
}

// phase 1 : appelée 50 000 fois avec des numbers
for (let i = 0; i < 50000; i++) additionner(i, i + 1)
// TurboFan observe "toujours des numbers", optimise pour ça

// phase 2 : un appel surprise
additionner('5', '3') // string concat, pas addition numérique
// le pari "a et b sont des numbers" vient de mourir
// V8 déoptimise additionner(), repasse par Ignition, perd l'optimisation
```

Une deopt isolée ne tue pas ton app. Le vrai problème, c'est une fonction hot path qui alterne sans cesse entre plusieurs types : elle optimise, déoptimise, réoptimise, en boucle. Ce phénomène a un nom : bailout loop (boucle d'échec). Le coût CPU de cette danse peut dépasser le coût d'une fonction jamais optimisée du tout.

---

## 5) CE QUI DÉCLENCHE UNE DEOPT EN PRATIQUE

```
type qui change sur un paramètre    --> deopt potentielle
forme d'objet qui varie (hidden class) --> inline cache dégradé
tableau qui mélange types        --> array devient "dictionary mode"
try/catch mal placé (cas datés)     --> empêchait l'optimisation sur vieux V8
arguments en nombre variable      --> empêche certaines optimisations
delete sur une propriété d'objet    --> casse la hidden class
```

Le cas du tableau mérite un mot. V8 optimise différemment un tableau de numbers purs (`[1, 2, 3]`, stocké de façon compacte) et un tableau mixte (`[1, 'deux', {trois: 3}]`, stocké en mode dictionnaire, beaucoup plus lent à parcourir). Mélanger les types dans un tableau qui tourne dans une boucle chaude, c'est annuler une partie de l'optimisation par construction.

---

## 6) CE QUE ÇA CHANGE CONCRÈTEMENT

Tu n'as pas besoin de penser au JIT en permanence. La majorité du code applicatif ne tourne jamais assez souvent pour que TurboFan s'en mêle vraiment. Là où ça compte : les boucles chaudes (parsing de gros volumes, calculs répétés des milliers de fois, hot paths identifiés par profiling). Sur ce code précis, la forme de tes objets et la stabilité de tes types deviennent un vrai levier de performance, pas un détail théorique.

---

## EXERCICES

## EXO 1 : LA HIDDEN CLASS CASSÉE

Ce code crée 10 000 ninjas pour une simulation de bataille. Identifie pourquoi certains d'entre eux vont casser l'optimisation de V8, et corrige.

```js
function creerNinjaBataille(nom, chakra, estBoss) {
 const ninja = { nom, chakra }
 if (estBoss) {
  ninja.titre = 'Boss' // ajouté seulement pour certains
 }
 return ninja
}

const armee = []
for (let i = 0; i < 10000; i++) {
 armee.push(creerNinjaBataille(`ninja${i}`, 100, i % 100 === 0))
}
```

(indice : toutes les hidden classes doivent être identiques dès la construction, même pour les propriétés "optionnelles")

## EXO 2 : LE TABLEAU QUI RALENTIT TOUT SEUL

Un calcul de score tourne sur un tableau de stats de joueurs. Le tableau commence propre, mais une ligne plus loin dans le code le pollue silencieusement. Trouve la ligne fautive et explique l'impact sur le mode de stockage du tableau.

```js
const scores = [42, 87, 15, 93, 28, 71]

function calculerMoyenne(arr) {
 return arr.reduce((acc, val) => acc + val, 0) / arr.length
}

console.log(calculerMoyenne(scores))

scores.push('forfait') // une ligne plus loin dans le vrai fichier
console.log(calculerMoyenne(scores))
```

---

## RÉSUMÉ

V8 exécute ton code en deux temps : Ignition démarre vite sans optimiser, TurboFan optimise les fonctions qui tournent souvent en pariant sur la forme de leurs données. Les hidden classes déterminent si V8 peut traiter tes objets de façon uniforme : initialise toujours les propriétés dans le même ordre. Les inline caches mémorisent la dernière forme observée à un point d'appel : un seul type stable, c'est rapide, plusieurs types qui changent sans cesse, c'est l'optimisation perdue. Une deopt n'est pas une erreur, c'est V8 qui retire un pari devenu faux : une deopt isolée ne change rien, une bailout loop sur un hot path coûte cher.

---

## Ou l'analogie casse (JIT)

Garde-fou epistemologique : l'analogie seduisante est utile a l'entree, dangereuse a la sortie.
Ce tableau liste les endroits **precis** ou l'analogie courante trompe.

| Analogie courante | Ou elle casse |
|-------------------|---------------|
| "JIT = toujours plus rapide" | Faux : warmup, deoptimisation sur type qui change, code monomorphique/polymorphique/megamorphique. Un JIT confus est plus lent qu un interpret pur. |
| "Le JIT devine mon intention" | Il devine des **types** et des **formes d objet** (hidden classes). Si tu changes la forme, tu deoptimises. |
| "Micro-benchmarks reflet ent la prod" | Non : le JIT optimise agressivement du code trop simple ; en prod le comportement diverge. |

Regle : si tu ne peux pas nommer *une* case ou ton analogie casse, tu ne l'as
pas encore comprise ; tu l'as juste memorisee.
