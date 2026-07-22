---
stability: perissable_2027
---

# LIRE UNE STACK TRACE DE PROD QUAND LE CODE SOURCE N'EXISTE PLUS
Temps de lecture ~8 min

En local, une stack trace pointe directement sur ta ligne de code. En prod, elle pointe sur `main.a8f3c2.js:1:48291`. Une seule ligne. Minifiée. Sans le moindre nom de variable lisible. C'est le moment où la majorité des devs se sentent perdus, alors que c'est un exercice de lecture, pas de magie.

Pourquoi ça compte : Sentry, Datadog, ou n'importe quel outil de tracking d'erreurs te montre cette version dégradée par défaut. Si tu ne sais pas la retraverser jusqu'au vrai code, chaque incident en prod commence par 20 minutes perdues à essayer de comprendre où chercher.

---

## 1) POURQUOI LA STACK TRACE DE PROD NE RESSEMBLE À RIEN

Trois transformations s'accumulent entre ton code et ce que tu vois en prod :

```
ton code source      (lisible, noms explicites)
   |
   v  bundling (webpack/vite assemblent tout en un ou quelques fichiers)
   |
   v  minification (noms raccourcis, espaces supprimés, tout compacté)
   |
   v  transpilation (TS -> JS, syntaxe moderne -> compatible)
   |
   v
ton code en prod      (main.a8f3c2.js, illisible)
```

Une fonction `calculerScoreFinal(historiqueMatchs)` peut devenir `function f(t){...}` après minification. Une stack trace pointant sur `f` à la ligne 1, colonne 48291, ne te dit rien tant que tu n'as pas de moyen de remonter vers l'original.

---

## 2) LA SOURCE MAP : LE PONT ENTRE LES DEUX MONDES

Une source map (`.map`) est un fichier qui contient la correspondance exacte entre chaque position du code minifié et la position d'origine dans le fichier source.

```json
// extrait simplifié d'un fichier .map
{
 "version": 3,
 "sources": ["src/combat/calculerScoreFinal.js"],
 "names": ["calculerScoreFinal", "historiqueMatchs", "total"],
 "mappings": "AAAA,SAASA,oBAAoBC,EAAkB..."
}
```

Le champ `mappings` est encodé (VLQ : variable-length quantity, un encodage compact de positions), illisible à l'œil nu. Tu ne le lis jamais directement : tu donnes le fichier `.map` à un outil qui fait la traduction pour toi.

```
DevTools > Sources > clic droit sur le fichier minifié > "Add source map" (si pas déjà chargée)
```

Si la source map est correctement déployée et accessible, DevTools bascule automatiquement vers le code source d'origine, breakpoints inclus, comme si tu débuguais en local.

---

## 3) QUAND LA SOURCE MAP EST CASSÉE OU ABSENTE

C'est le cas réel le plus fréquent. Beaucoup d'équipes désactivent volontairement les source maps en prod publique pour ne pas exposer le code source à n'importe qui. Résultat : tu as l'erreur, mais pas le pont vers le code lisible.

Stratégie de repli, étape par étape :

**Étape 1 : isoler le bon build**

```
main.a8f3c2.js
    ^^^^^^^
    ce hash identifie EXACTEMENT quelle version a généré l'erreur
```

Ce hash n'est pas décoratif. Il garantit que tu regardes le bon code, même si 10 déploiements ont eu lieu depuis. Sans lui, tu pourrais analyser une version du code qui n'existe déjà plus.

**Étape 2 : récupérer la source map en interne, hors prod publique**

La plupart des pipelines CI/CD uploadent la source map vers l'outil de tracking d'erreurs (Sentry, par exemple) au moment du build, sans jamais l'exposer publiquement. Le fichier `.map` existe quelque part, même s'il n'est pas accessible depuis le navigateur de l'utilisateur final.

```bash
# exemple de ce qu'une pipeline CI fait généralement après le build
sentry-cli releases files VERSION upload-sourcemaps ./dist --url-prefix '~/static/js'
```

**Étape 3 : si vraiment aucune source map n'existe nulle part**

Tu dois alors lire la trace minifiée directement. Trois indices exploitables même sans source map :

```
TypeError: Cannot read properties of undefined (reading 'cd')
  at f (main.a8f3c2.js:1:48291)
  at Array.map (<anonymous>)
  at h (main.a8f3c2.js:1:51022)
  at main.a8f3c2.js:1:2104
```

1. **Le type d'erreur** (`Cannot read properties of undefined`) te dit déjà quelle catégorie de bug chercher, peu importe le nommage.
2. **Le contexte d'appel** (`at Array.map`) indique qu'une fonction passée à `.map()` plante : cherche dans ton code chaque `.map()` qui pourrait correspondre.
3. **La position colonne/ligne**, comparée entre deux erreurs similaires reçues à des moments différents, permet de voir si c'est toujours exactement le même point qui casse ou si ça bouge.

---

## 4) LA TRACE QUI TRAVERSE PLUSIEURS SERVICES

En architecture microservices, l'erreur que tu vois côté frontend n'est parfois que le symptôme d'un crash survenu trois services plus loin. Une stack trace seule ne le montre pas : il faut la croiser avec le `traceId` (module `26_observability/02_distributed_tracing`).

```
Frontend reçoit : "500 Internal Server Error"
  |
  v  chercher le traceId dans la requête réseau (header response)
  |
  v  rechercher ce traceId dans l'outil de tracing distribué
  |
Service API   [span: 45ms, status: OK]
Service Auth  [span: 12ms, status: OK]
Service Stock  [span: 890ms, status: ERROR] <-- la vraie stack trace est ICI
```

La stack trace utile n'est pas toujours celle que tu as sous les yeux en premier. Le réflexe correct : remonter au `traceId`, retrouver le service qui a réellement planté, et lire SA stack trace à lui, pas celle du service qui a juste relayé l'échec.

---

## 5) CE QU'IL FAUT PRÉPARER AVANT QUE ÇA ARRIVE

Tout ce drill suppose une chose : que les bonnes pratiques ont été posées en amont. Sans elles, même un dev qui sait lire une stack trace est bloqué.

```
source maps uploadées en privé à chaque build --> permet la traduction même après coup
release/version taguée dans l'outil d'erreurs --> sait quel commit a généré le crash
traceId propagé entre tous les services    --> permet de remonter jusqu'au vrai coupable
breadcrumbs activés (actions avant le crash)  --> donne le contexte sans avoir à reproduire
```

Si aucune de ces quatre choses n'existe, debugger une stack trace de prod devient de la divination plutôt que de l'investigation.

---

## EXERCICES

## EXO 1 : LA TRACE SANS SOURCE MAP

Voici une stack trace reçue dans Sentry, sans source map disponible (build trop ancien, fichier `.map` jamais retrouvé). Identifie les trois indices exploitables et écris l'hypothèse de bug la plus probable que tu vérifierais en premier.

```
TypeError: t.find is not a function
  at e (vendor.bf821a.js:1:9442)
  at r (main.bf821a.js:1:2891)
  at HTMLButtonElement.onclick (main.bf821a.js:1:3017)
```

(indice : `.find` n'existe que sur les tableaux, jamais sur les objets simples)

## EXO 2 : SUIVRE LE TRACEID À TRAVERS LES SERVICES

Le dashboard live de `ultras_dashboard` reçoit une erreur 500 côté frontend. Tu as accès à ce résumé de trace distribuée. Désigne le vrai service fautif et explique pourquoi la stack trace côté frontend, à elle seule, t'aurait induit en erreur.

```
traceId: a8f2-91c4-...

Frontend Gateway  [span: 1840ms, status: ERROR, message: "upstream timeout"]
 └── Service Events  [span: 1820ms, status: ERROR, message: "Redis connection refused"]
    └── Redis    [span: -, status: DOWN]
```

---

## RÉSUMÉ

Une stack trace de prod traverse bundling, minification, et transpilation avant d'arriver devant toi : c'est pour ça qu'elle ne ressemble à rien sans aide. La source map est le pont vers le code lisible, uploadée en privé au build, jamais exposée publiquement par sécurité. Sans elle, le type d'erreur, le contexte d'appel, et la position comparée entre plusieurs occurrences restent exploitables. En microservices, la vraie stack trace n'est pas toujours celle reçue en premier : le traceId mène jusqu'au service qui a réellement planté.
