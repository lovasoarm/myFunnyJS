---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LIGHTHOUSE : LIRE UN RAPPORT SANS SE NOYER DANS LES CHIFFRES
Temps de lecture ~10 min

Lighthouse te sort un score entre 0 et 100. Le dev moyen regarde le score, dit "meh, 67, je dois améliorer", et ferme l'onglet sans rien faire.

Le score est inutile sans savoir quoi fixer en premier. Un rapport Lighthouse contient 40 opportunités, 20 diagnostics, et 15 métriques. Si tu essaies de tout corriger en même temps, tu vas corriger les mauvaises choses et perdre une semaine pour gagner 3 points.

Ce fichier t'apprend à lire le rapport comme un outil, pas comme un bulletin de notes.

---

## 1) STRUCTURE DU RAPPORT

Lighthouse a 5 catégories. Elles ne se lisent pas de la même façon.

```
Performance   => métriques mesurées à l'exécution
           LCP, INP, CLS + FCP, TTFB, Speed Index

Accessibility  => règles WCAG vérifiées automatiquement
           contrast, aria, keyboard navigation

Best Practices  => sécurité, HTTPS, APIs dépréciées

SEO       => métadonnées, structure, mobile-friendliness

PWA       => Progressive Web App : manifest, service worker
```

Pour la performance : t'as un score global + les métriques individuelles + deux sections sous les métriques : **Opportunities** et **Diagnostics**.

```
Score global (0-100)
 |
 +-- Métriques (LCP, INP, CLS, FCP, TTFB, Speed Index)
 |
 +-- Opportunities  : corrections avec impact estimé en secondes
 |
 +-- Diagnostics   : problèmes sans estimation de gain
 |
 +-- Passed audits  : ce qui est déjà bon (souvent ignoré à tort)
```

---

## 2) LES MÉTRIQUES ET LEUR POIDS

Lighthouse pondère les métriques différemment pour calculer le score global :

```
LCP       => 25% du score
INP       => 10% du score
CLS       => 15% du score
FCP       => 10% du score  (First Contentful Paint)
Speed Index   => 10% du score
TTFB       => 30% du score  (Time to First Byte)
```

TTFB est le temps entre la requête et le premier octet reçu. C'est le serveur. Si TTFB est mauvais, aucune optimisation front ne va vraiment aider.

```js
// mesurer TTFB depuis le code
const [navEntry] = performance.getEntriesByType('navigation')
const ttfb = navEntry.responseStart - navEntry.requestStart
console.log(`TTFB: ${ttfb}ms`)

// seuils
// < 800ms : vert
// < 1800ms : orange
// >= 1800ms : rouge
```

---

## 3) OPPORTUNITIES VS DIAGNOSTICS

C'est la distinction la plus importante du rapport.

### Opportunities

Chaque opportunity a une **estimation de gain en secondes**. Lighthouse te dit : "si tu corriges ça, tu gagnes environ X secondes sur ton LCP".

Exemples d'opportunities :
```
Serve images in next-gen formats     => économie estimée : 2.3s
Eliminate render-blocking resources   => économie estimée : 1.1s
Remove unused JavaScript         => économie estimée : 0.8s
Properly size images           => économie estimée : 0.5s
```

**Règle** : commence par les opportunities avec le plus grand gain. Ignore les optimisations à 50ms si tu as une opportunity à 2 secondes.

### Diagnostics

Les diagnostics signalent des problèmes mais sans estimation de gain. Ce sont des pratiques à améliorer, pas des bottlenecks mesurés.

Exemples :
```
Avoid enormous network payloads     => informationnel
Serve static assets with efficient cache policy => informationnel
Avoid chaining critical requests     => informationnel
```

Les diagnostics comptent, mais ils passent après les opportunities quand tu dois prioriser.

---

## 4) LES PIÈGES CLASSIQUES DE LECTURE

### Le score global est trompeur

Un score de 85 peut cacher un LCP de 4.8s si toutes les autres métriques sont vertes.

Toujours regarder les métriques individuelles, pas seulement le score.

```
Score global : 85/100
 LCP : 4.8s (rouge)   <-- problème critique
 INP : 180ms (vert)
 CLS : 0.05 (vert)
 FCP : 1.2s (vert)
 TTFB: 210ms (vert)
```

Dans ce cas, le site est probablement bien perçu mais une image lourde gâche tout.

### Les scores varient entre les runs

Lighthouse tourne dans un environnement simulé avec une connexion et un CPU bridés. Les scores fluctuent entre les runs, parfois de 10 points.

Ne jamais comparer un run à un seul autre run. Lancer 3 fois et prendre la médiane.

```bash
# lighthouse CLI : 3 runs pour avoir une moyenne fiable
npx lighthouse https://monsite.com --runs=3 --output=json --output-path=./report.json
```

### "Passed audits" contient des infos utiles

La section verte en bas du rapport montre ce qui fonctionne déjà. Si tu cherches pourquoi ton score est bon sur certains points, c'est là que tu regardes. Ça sert aussi à documenter ce qu'il ne faut pas casser lors d'un refacto.

---

## 5) LANCER LIGHTHOUSE EN DEHORS DES DEVTOOLS

### CLI

```bash
# installer
npm install -g lighthouse

# lancer un audit basique
npx lighthouse https://tonsite.com --view

# simuler mobile (default) vs desktop
npx lighthouse https://tonsite.com --preset=desktop --view

# sortir en JSON pour parser les résultats
npx lighthouse https://tonsite.com --output=json --output-path=./report.json
```

### Programmatique

```js
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

async function runAudit(url) {
 // ouvrir Chrome en mode headless
 const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })

 const result = await lighthouse(url, {
  port: chrome.port,
  // preset mobile par défaut, le plus important pour les CWV
  formFactor: 'mobile',
  screenEmulation: {
   mobile: true,
   width: 390,
   height: 844,
  },
 })

 await chrome.kill()

 // extraire les métriques clés
 const { lcp, inp, cls, fcp, ttfb } = result.lhr.audits

 return {
  score: result.lhr.categories.performance.score * 100,
  lcp: lcp.numericValue,
  inp: inp.numericValue,
  cls: cls.numericValue,
 }
}
```

---

## 6) LIRE LE RAPPORT SECTION PAR SECTION

### Étape 1 : regarder les métriques individuelles

LCP, INP, CLS d'abord. Si l'un d'eux est dans le rouge, c'est ta priorité.

### Étape 2 : chercher l'opportunity avec le plus grand gain

Trier par "Savings" décroissant. La première ligne, c'est là que tu vas.

### Étape 3 : comprendre la cause

Chaque opportunity a un "Learn more" et une liste d'éléments incriminés. Par exemple pour "Properly size images" :

```
Image served : 1200x800px
Image displayed : 300x200px
Potential savings : 340KB
```

Tu as servi 16x plus de pixels que nécessaire. Fix : générer une version 300x200 ou utiliser srcset.

### Étape 4 : estimer l'effort vs le gain

```
Opportunity : Serve images in next-gen formats => gain 2.1s, effort : moyen
Opportunity : Remove unused CSS        => gain 0.3s, effort : élevé

=> commence par les images
```

### Étape 5 : re-lancer après chaque fix

Pas un rapport pour tout corriger d'un coup. Un rapport, un fix, un nouveau rapport, validation, suivant.

---

## 7) INTERPRÉTER UN RAPPORT RÉEL

Voici un rapport fictif d'une page type dashboard de stats de foot :

```
Performance score : 58

LCP : 5.2s  (rouge)  poids : 25%
INP : 320ms (orange) poids : 10%
CLS : 0.12  (orange) poids : 15%
FCP : 1.8s  (vert)
TTFB : 420ms (vert)

Opportunities :
 Properly size images        => -2.1s  (image hero 4Mo)
 Eliminate render-blocking resources => -1.3s  (4 scripts en head)
 Remove unused JavaScript      => -0.6s  (bundle analytics)

Diagnostics :
 Avoid enormous network payloads  (total : 8.2MB)
 Serve static assets with efficient cache policy
```

### Lecture du rapport

TTFB vert : le serveur répond vite. Le problème est côté front.

LCP à 5.2s avec une opportunity d'image à 2.1s : corriger l'image est la priorité absolue. Ça fait passer LCP de 5.2s à ~3.1s, probablement de rouge à orange.

Scripts bloquants à 1.3s : ajouter `defer` ou `async` sur les scripts analytics, déplacer les CSS non critiques. Avec le fix image et le fix scripts, LCP passe probablement sous 2.5s.

INP à 320ms : chercher quel event handler est lourd. Pas une urgence tant que LCP est rouge.

CLS à 0.12 : proche du seuil vert (0.1). Regarder si une image sans dimensions est responsable. Fix rapide.

---

## EXERCICES

## EXO 1 : PRIORISATION DE RAPPORT

Tu reçois ce rapport Lighthouse pour le site du club de foot de tes rêves :

```
Score : 61

LCP : 4.1s (rouge)
INP : 440ms (orange)
CLS : 0.08 (vert)
TTFB : 1.9s (orange)

Opportunities :
 Serve images in next-gen formats  => -1.8s
 Reduce server response times    => ?
 Remove unused CSS          => -0.4s
 Eliminate render-blocking resources => -0.7s
```

1. Quel est le problème le plus critique dans ce rapport ?
2. Dans quel ordre tu corriges les opportunities, et pourquoi ?
3. TTFB à 1.9s : c'est un problème front ou back ? Qu'est-ce que ça implique pour ta stratégie de fix ?

---

## EXO 2 : AUDIT PROGRAMMATIQUE

Écris un script Node.js qui :
- lance Lighthouse en headless sur une URL passée en argument
- extrait LCP, INP, CLS et le score global
- affiche un résumé coloré dans le terminal (vert / orange / rouge selon les seuils)
- sort avec `process.exit(1)` si au moins une métrique est dans le rouge

(C'est ce genre de script qui va dans le CI/CD du projet suivant)

---

## EXO 3 : DIAGNOSTIC D'IMAGE

Lighthouse te dit : "Properly size images : potential savings: 1.4s" sur une page qui affiche des cartes de joueurs.

La page contient :
```html
<img src="player-mbappe.jpg" style="width: 80px; height: 80px" />
```

L'image originale fait 1200x1200px et 680KB.

1. Calcule combien de pixels sont gaspillés (sur un écran @2x)
2. Écris le HTML correct avec `srcset` pour servir la bonne taille selon la densité d'écran
3. Quel format tu utilises et pourquoi ?

---

## RÉSUMÉ

Le score global est un résumé, pas un objectif. LCP, INP, CLS sont les vrais indicateurs.

Les opportunities classées par gain sont ta feuille de route. Tu commences par le plus grand gain, tu mesures, tu continues.

Diagnostics et passed audits complètent le tableau mais ne guident pas ta priorité.

Lighthouse fluctue : toujours lancer plusieurs fois et travailler sur des médianes, pas sur un seul run.
