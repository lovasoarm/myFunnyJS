---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LCP, INP, CLS : LES TROIS CHIFFRES QUE GOOGLE REGARDE SUR TON SITE
Temps de lecture ~11 min

Google mesure la qualité de ton UI avec trois métriques. Si elles passent dans le rouge, ton site descend dans les résultats de recherche. Et les utilisateurs partent avant que la page finisse de charger.

Ces métriques ne sont pas des opinions. Ce sont des mesures du ressenti réel de l'utilisateur : est-ce que ça charge vite ? est-ce que ça réagit quand je clique ? est-ce que le contenu saute partout ?

---

## 1) LCP : LARGEST CONTENTFUL PAINT

### Ce que ça mesure

Le temps entre le premier octet reçu et le moment où le plus grand élément visible est rendu à l'écran.

Cet élément, c'est généralement une image hero, un bloc de texte principal, ou une vidéo.

```
Navigation start
   |
   |-----> réseau --> parser HTML --> style --> layout --> paint
                               |
                             LCP event
```

### Les seuils

```
LCP < 2.5s  => vert  : bien
LCP < 4s   => orange : à améliorer
LCP >= 4s   => rouge : mauvais
```

### Ce qui fait exploser le LCP

**Images non optimisées :**
```html
<!-- mauvais : image de 4Mo chargée sans compression -->
<img src="hero-naruto-4k.png" />

<!-- correct : format WebP + taille adaptée -->
<img src="hero-naruto.webp" width="800" height="450" fetchpriority="high" />
```

**CSS qui bloque le rendu :**
```html
<!-- mauvais : CSS bloquant en tête de page -->
<link rel="stylesheet" href="all-styles-5000-lines.css" />

<!-- correct : CSS critique inline, le reste différé -->
<style>/* styles critiques only */</style>
<link rel="stylesheet" href="rest.css" media="print" onload="this.media='all'" />
```

**JavaScript qui retarde le premier rendu :**
```html
<!-- mauvais : script synchrone avant le contenu -->
<script src="analytics.js"></script>
<body>...</body>

<!-- correct : defer ou async -->
<script src="analytics.js" defer></script>
```

### Comment mesurer le LCP depuis le code

```js
// PerformanceObserver : observe les événements de rendu
const observer = new PerformanceObserver((list) => {
 const entries = list.getEntries()
 // le dernier entry LCP est le plus récent (l'élément le plus grand)
 const lcp = entries[entries.length - 1]

 console.log('LCP element:', lcp.element)
 console.log('LCP time:', lcp.startTime, 'ms')

 // alerte si on passe dans l'orange
 if (lcp.startTime > 2500) {
  console.warn('LCP trop lent : utilisateur qui attend')
 }
})

// "largest-contentful-paint" : le type d'entrée qu'on observe
observer.observe({ type: 'largest-contentful-paint', buffered: true })
```

---

## 2) INP : INTERACTION TO NEXT PAINT

### Ce que ça mesure

Le temps entre un clic / tap / frappe clavier et le moment où le navigateur affiche la réponse visuelle.

INP remplace FID (First Input Delay) depuis 2024. La différence : FID mesurait seulement la première interaction. INP mesure **toutes** les interactions et prend le pire cas.

```
User clique sur un bouton
     |
     |---> event handler JS s'exécute
     |---> navigateur calcule le nouveau layout
     |---> navigateur peint le résultat
          |
         INP = ce délai total
```

### Les seuils

```
INP < 200ms  => vert  : réactif
INP < 500ms  => orange : lent
INP >= 500ms  => rouge : l'utilisateur sent que le site est cassé
```

### Ce qui fait exploser l'INP

**Event handler qui bloque le thread principal :**
```js
// mauvais : calcul lourd directement dans le click handler
button.addEventListener('click', () => {
 // ce calcul bloque le thread pendant 600ms
 // l'utilisateur clique, rien ne se passe visuellement
 const result = computePlayerRankings(10000) // O(n²)
 displayResult(result)
})

// correct : couper le travail pour laisser le rendu passer
button.addEventListener('click', async () => {
 // scheduler.yield() cède le thread au navigateur entre deux tâches
 // le bouton visuellement réagit d'abord, puis le calcul suit
 showLoadingState()
 await scheduler.yield()
 const result = computePlayerRankings(10000)
 displayResult(result)
})
```

**Trop de travail synchrone dans une interaction :**
```js
// mauvais : 50 composants re-render en même temps sur un seul clic
function handleFilterChange(value) {
 setFilter(value)    // trigger re-render global
 updateURL(value)    // manipulation DOM
 trackAnalytics(value)  // requête réseau synchrone
 rebuildIndex(items)   // recalcul de 5000 items
}

// correct : prioriser le feedback visuel, différer le reste
function handleFilterChange(value) {
 setFilter(value)    // feedback immédiat au utilisateur

 // le reste peut attendre 16ms
 requestAnimationFrame(() => {
  updateURL(value)
  trackAnalytics(value)
  rebuildIndex(items)
 })
}
```

### Mesurer l'INP

```js
const observer = new PerformanceObserver((list) => {
 for (const entry of list.getEntries()) {
  // inputDelay : temps entre l'interaction et le début de l'event handler
  // processingTime : temps passé dans l'event handler
  // presentationDelay : temps entre la fin du handler et l'affichage
  const total = entry.duration

  console.log(`Interaction: ${entry.name}`)
  console.log(`Total INP: ${total}ms`)
  console.log(`Input delay: ${entry.processingStart - entry.startTime}ms`)

  if (total > 200) {
   console.warn(`Interaction lente détectée : ${total}ms`)
  }
 }
})

observer.observe({ type: 'event', durationThreshold: 16, buffered: true })
```

---

## 3) CLS : CUMULATIVE LAYOUT SHIFT

### Ce que ça mesure

La somme de tous les décalages visuels inattendus pendant le cycle de vie de la page.

C'est le score qui explose quand une pub se charge et pousse tout le contenu vers le bas. Ou quand une image apparaît sans dimensions et déplace le texte. Le utilisateur clique sur un lien, la page bouge, il clique sur autre chose. Frustrant.

```
Score CLS = somme de (impact fraction * distance fraction)
               |         |
          % de la viewport     déplacement
          affectée par le shift  relatif à la viewport
```

### Les seuils

```
CLS < 0.1   => vert  : stable
CLS < 0.25  => orange : instable
CLS >= 0.25  => rouge : la page saute dans tous les sens
```

### Ce qui fait exploser le CLS

**Images sans dimensions :**
```html
<!-- mauvais : le navigateur ne réserve aucun espace avant le chargement -->
<img src="messi-goal.jpg" />

<!-- correct : réserve l'espace avant même que l'image charge -->
<img src="messi-goal.jpg" width="800" height="600" />

<!-- ou avec CSS : même effet -->
<style>
 .hero-img {
  aspect-ratio: 4/3; /* réserve l'espace proportionnellement */
 }
</style>
```

**Contenu injecté dynamiquement au-dessus du fold :**
```js
// mauvais : bannière publicitaire insérée en haut après chargement
setTimeout(() => {
 const banner = document.createElement('div')
 banner.className = 'promo-banner'
 document.body.insertBefore(banner, document.body.firstChild)
 // tout le contenu se décale vers le bas : CLS +0.3
}, 2000)

// correct : réserver l'espace à l'avance
// même si la bannière n'est pas encore chargée, l'espace existe
```

```css
/* réserver l'espace pour une bannière qui chargera plus tard */
.promo-banner-placeholder {
 min-height: 90px; /* hauteur max anticipée */
 width: 100%;
}
```

**Polices qui causent un flash :**
```css
/* mauvais : pas de fallback dimensionné = layout shift quand la font charge */
font-family: 'CustomFont', sans-serif;

/* correct : size-adjust pour que le fallback ait les mêmes dimensions */
@font-face {
 font-family: 'CustomFont';
 src: url('custom-font.woff2');
 font-display: swap; /* affiche le fallback pendant le chargement */
 size-adjust: 105%; /* ajuste la taille du fallback pour limiter le shift */
}
```

### Mesurer le CLS

```js
let clsScore = 0

const observer = new PerformanceObserver((list) => {
 for (const entry of list.getEntries()) {
  // hadRecentInput : exclut les shifts causés par une interaction utilisateur
  // (un scroll ou un clic qui cause un shift ne compte pas)
  if (!entry.hadRecentInput) {
   clsScore += entry.value
   console.log(`Layout shift détecté : +${entry.value}`)
   console.log(`CLS cumulé : ${clsScore}`)
  }
 }
})

observer.observe({ type: 'layout-shift', buffered: true })

// afficher le score final quand l'utilisateur quitte la page
document.addEventListener('visibilitychange', () => {
 if (document.visibilityState === 'hidden') {
  console.log(`CLS final : ${clsScore}`)
 }
})
```

---

## 4) LIRE LES TROIS MÉTRIQUES ENSEMBLE

LCP, INP, CLS ne s'analysent pas séparément. Ils racontent une histoire :

```
LCP élevé + INP ok + CLS ok
 => le contenu charge lentement mais l'app est réactive une fois chargée
 => problème réseau / ressources lourdes

LCP ok + INP élevé + CLS ok
 => la page affiche vite mais réagit lentement aux interactions
 => JS trop lourd sur le thread principal

LCP ok + INP ok + CLS élevé
 => la page charge et réagit bien mais le contenu saute partout
 => images sans dimensions, contenu injecté dynamiquement
```

### Mesurer les trois en une passe

```js
// web-vitals est la lib officielle Google pour mesurer depuis le code
// npm install web-vitals
import { onLCP, onINP, onCLS } from 'web-vitals'

function sendToAnalytics({ name, value, rating }) {
 // rating : "good" | "needs-improvement" | "poor"
 console.log(`${name}: ${Math.round(value)}ms : ${rating}`)
}

onLCP(sendToAnalytics)
onINP(sendToAnalytics)
onCLS(({ name, value, rating }) => {
 // CLS est un score sans unité, pas une durée
 console.log(`${name}: ${value.toFixed(3)} : ${rating}`)
})
```

---

## EXERCICES

## EXO 1 : DIAGNOSTIC LCP

Tu es le lead dev de la fansite officielle de la Champions League. Le patron te sort que le LCP est à 6.2 secondes. Les images hero font 3Mo. Le CSS est un seul fichier de 8000 lignes. Il y a 4 scripts analytics en tête de page.

Liste les 3 changements prioritaires. Implémente le fix sur les images (attributs HTML) et les scripts (attributs de chargement).

---

## EXO 2 : INTERACTION LENTE

Un dashboard de stats de Ballon d'Or a un bouton "Calculer le classement" qui prend 800ms à répondre visuellement. Le handler fait un tri O(n²) sur 15000 joueurs, met à jour le DOM, et envoie un event analytics.

Refactore le handler pour que l'INP passe sous 200ms. Le utilisateur doit voir une réponse visuelle immédiate, même si le calcul n'est pas terminé.

---

## EXO 3 : LAYOUT SHIFT HUNTING

Une page blog a un CLS de 0.41. La page contient :
- 3 images sans dimensions
- Une bannière publicitaire chargée 3 secondes après le premier rendu
- Une police custom sans `font-display`
- Un bloc "commentaires récents" injecté en haut de page via JS

Identifie les 4 sources de CLS. Corrige-les une par une. Mesure le CLS avant et après avec le code d'observation.

---

## EXO 4 : PIPELINE DE MESURE

Écris une fonction `measureVitals()` qui :
- observe LCP, INP, et CLS simultanément
- stocke les valeurs dans un objet `{ lcp, inp, cls }`
- affiche un résumé avec le rating de chaque métrique (`good` / `needs-improvement` / `poor`)
- loggue une alerte si au moins une métrique est dans le rouge

(Sans utiliser la lib `web-vitals` : uniquement `PerformanceObserver` natif)

---

## RÉSUMÉ

LCP : le temps jusqu'au plus grand élément visible. Le réseau, les images lourdes, et le CSS bloquant le font sauter.

INP : la réactivité à chaque interaction. Le thread principal bloqué par du JS lourd est le principal coupable.

CLS : la stabilité visuelle. Images sans dimensions et contenu injecté dynamiquement sont les causes les plus fréquentes.

Les trois métriques se lisent ensemble : chacune révèle une couche différente du problème de performance. Un site avec LCP bon mais INP mauvais n'est pas performant : il charge vite et réagit comme un escargot.
