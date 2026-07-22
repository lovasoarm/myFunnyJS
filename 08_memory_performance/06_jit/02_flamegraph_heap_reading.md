---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LIRE UN FLAMEGRAPH ET UN HEAP SNAPSHOT : VOIR CE QUE LE JIT FAIT VRAIMENT
Temps de lecture ~8 min

Comprendre Ignition, TurboFan, les hidden classes : c'est la théorie. Mais sur du vrai code, en vraie prod, tu ne devines jamais où le CPU part ni où la mémoire fuit. Tu le lis. Et ça se lit dans deux outils précis : le flamegraph (graphique en flammes) pour le CPU, le heap snapshot pour la mémoire.

Le piège classique : ouvrir ces outils, voir un mur de couleurs, et refermer l'onglet en pensant "c'est trop technique". C'est l'inverse. Une fois que tu sais quoi chercher, ça se lit en 30 secondes.

---

## 1) LE FLAMEGRAPH : ANATOMIE D'UN GRAPHIQUE EN FLAMMES

```
DevTools > Performance > Record > (utiliser l'app) > Stop
```

Un flamegraph empile des barres horizontales. Chaque barre = une fonction appelée. La largeur = le temps passé dedans (pas le nombre d'appels). La hauteur = la profondeur de la pile d'appels (call stack).

```
|------------------ main() -------------------|
|---- chargerStats() ----||--- afficherUI() ---|
|-- fetch() --|--parse()--|   |-- render() --|
```

Lecture de base :
- une barre **large** : cette fonction (ou ses enfants) mange beaucoup de temps
- une barre **étroite mais très haute** : récursion profonde ou chaîne d'appels longue, peu de temps individuel
- une couleur qui se répète horizontalement à des endroits différents : la même fonction est appelée depuis plusieurs chemins

La règle d'or : tu ne cherches jamais "la fonction la plus lente en absolu", tu cherches **la barre la plus large au niveau le plus haut possible**. C'est elle qui domine le temps total, peu importe combien de sous-fonctions division.

---

## 2) SELF TIME VS TOTAL TIME : LE PIÈGE DE LECTURE NUMÉRO 1

DevTools donne deux chiffres par fonction, et les confondre fait perdre un temps fou en debug.

```
Total time : temps passé dans la fonction ET tout ce qu'elle appelle
Self time  : temps passé UNIQUEMENT dans le corps de la fonction elle-même
```

```js
// dashboard live des ultras_dashboard
function traiterEventsMatch(events) {
 const parsed = events.map(parseEvent)   // appelle parseEvent() x N
 const stats = calculerStatsLourdes(parsed) // calcul CPU intensif
 return stats
}
```

Si `traiterEventsMatch` affiche un total time énorme mais un self time proche de zéro : le coupable n'est PAS cette fonction, c'est une de ses enfants (`parseEvent` ou `calculerStatsLourdes`). Il faut descendre dans la pile pour trouver qui a un self time élevé. C'est lui, le vrai responsable.

---

## 3) LECTURE GUIDÉE : UN FLAMEGRAPH AVEC UN VRAI PROBLÈME

```
main()                     [total: 4200ms | self: 5ms]
└── traiterCombat()               [total: 4180ms | self: 12ms]
  ├── calculerDegats()            [total: 80ms | self: 75ms]
  ├── verifierEsquive()            [total: 45ms | self: 40ms]
  └── synchroniserEtatGlobal()        [total: 4050ms| self: 4040ms]
```

Lecture, étape par étape :
1. `main()` a un total énorme mais un self quasi nul → on descend.
2. `traiterCombat()` pareil → on descend encore.
3. `calculerDegats()` et `verifierEsquive()` ont des chiffres raisonnables → pas le problème.
4. `synchroniserEtatGlobal()` a un self time de 4040ms sur un total de 4050ms → **c'est elle**. Le problème vit dans son corps directement, pas dans ce qu'elle appelle.

Ce pattern (descendre jusqu'à trouver la première fonction avec un self time qui explose) marche sur n'importe quel flamegraph, peu importe la taille de l'app.

---

## 4) LE HEAP SNAPSHOT : PHOTOGRAPHIER LA MÉMOIRE

```
DevTools > Memory > Heap snapshot > Take snapshot
```

Un heap snapshot liste tous les objets vivants en mémoire à l'instant T, organisés par "qui retient quoi".

Le protocole de détection en 3 photos :

```
Snapshot 1 (état initial)
   |
   v  (faire une action qui DEVRAIT être neutre, genre ouvrir/fermer un panneau)
   |
Snapshot 2
   |
   v  (refaire la MÊME action plusieurs fois)
   |
Snapshot 3
```

Dans le panneau "Comparison" de DevTools, compare Snapshot 2 et Snapshot 3. Une action neutre répétée ne devrait laisser AUCUNE trace nette. Si une catégorie d'objets (genre `(closure)`, ou un nom de classe précis) grossit à chaque répétition : tu tiens ta fuite.

---

## 5) LIRE LA COLONNE "RETAINERS" : QUI GARDE QUI EN OTAGE

C'est la colonne la plus utile et la moins regardée. Pour un objet suspect, "Retainers" montre la chaîne de références qui l'empêche d'être collecté.

```
EventEmitter (camp de Rick)
 └── _events
    └── 'alerte-zombie'
      └── (closure) handleAlerte
         └── [[Scopes]]
           └── campData (12.4 MB) ← le vrai poids
```

Cette chaîne se lit comme une enquête : `campData` ne devrait probablement pas être retenu par un listener d'event toujours actif. Le suspect n'est pas `campData` lui-même, c'est le listener `handleAlerte` jamais retiré qui le garde en otage. La correction n'est pas "alléger campData", c'est "retirer le listener au bon moment" (le sujet du module `04_profiling/02_memory_leak_hunter.md`, mais vu cette fois depuis l'outil plutôt que depuis le code).

---

## 6) NODE.JS : `--prof` SANS DEVTOOLS

En environnement serveur, pas de DevTools graphique. Node a son propre profiler intégré.

```bash
node --prof script.js
# génère un fichier isolate-0x.....-v8.log

node --prof-process isolate-0x*.log > profile.txt
# transforme le log brut en rapport texte lisible
```

Le rapport texte donne un classement par "ticks" (échantillons CPU pris à intervalle régulier). Une fonction qui concentre un gros pourcentage des ticks totaux, c'est l'équivalent texte d'une barre large dans un flamegraph.

```
[Summary]:
  ticks total nonlib  name
  8421  42.1%  45.3% JavaScript
  6203  31.0%  33.4% C++
  ...

[Bottom up (heavy) profile]:
 ticks parent name
 4102  20.5% LazyCompile *calculerStatsLourdes script.js:142
```

`calculerStatsLourdes` qui concentre 20% des ticks à elle seule : c'est ta cible de profiling, exactement comme une barre large dans un flamegraph DevTools.

---

## EXERCICES

## EXO 1 : DÉSIGNER LE COUPABLE

Voici un flamegraph simplifié issu d'une simulation de la cuisine de Walter (breaking_cache). Désigne la fonction réellement responsable de la lenteur, en justifiant ta lecture self time vs total time.

```
genererRapportStock()    [total: 3800ms | self: 8ms]
├── chargerInventaire()   [total: 120ms | self: 110ms]
├── calculerPrix()      [total: 90ms  | self: 85ms]
└── trierParRisque()     [total: 3580ms | self: 3570ms]
```

## EXO 2 : LA FUITE DANS LES RETAINERS

Un dashboard live affiche les retainers suivants pour un objet `MatchState` de 8 MB qui ne devrait plus exister après la fin d'un match :

```
MatchState (8 MB)
 └── intervalCallback
    └── (closure) updateScoreboard
      └── [[Scopes]]
         └── currentMatch
```

Explique ce que cette chaîne révèle, et écris la correction (pas besoin de code complet, juste l'idée précise de ce qu'il faut appeler et quand).

---

## RÉSUMÉ

Un flamegraph se lit en cherchant la barre la plus large possible au niveau le plus haut possible, puis en descendant jusqu'à trouver un self time qui explose : c'est elle, la coupable, pas ses parents au total time gonflé. Un heap snapshot se compare entre deux photos après une action répétée : ce qui grossit sans redescendre est suspect. La colonne Retainers raconte qui garde quoi en otage, et la racine du problème est souvent le listener ou le timer en haut de la chaîne, pas l'objet lourd en bas. En Node sans interface graphique, `node --prof` puis `--prof-process` donnent le même type de classement en version texte.
