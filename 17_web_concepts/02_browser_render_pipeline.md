---
stability: intemporel
---

# BROWSER RENDER PIPELINE : DE L'HTML BRUT AU PIXEL AFFICHÉ
Temps de lecture ~10 min

Tu envoies une requête. Le serveur répond avec de l'HTML.
Ce que le navigateur fait entre les deux ? La plupart des devs ne le savent pas.
Et pourtant, c'est là que les bugs de performance vivent.
CLS (Cumulative Layout Shift) qui décale ta page. LCP (Largest Contentful Paint) trop lent. INP (Interaction to Next Paint) qui lag.
Tous ces problèmes viennent du pipeline de rendu. Comprendre le pipeline, c'est comprendre pourquoi ta page est lente.

---

## 1) LA SÉQUENCE COMPLÈTE

```
HTML reçu
  |
  v
[Parsing HTML] --> DOM (Document Object Model : arbre des noeuds HTML)
  |
  v
[Parsing CSS]  --> CSSOM (CSS Object Model : arbre des règles CSS)
  |
  v
[Render Tree]  --> DOM + CSSOM fusionnés (seulement les noeuds visibles)
  |
  v
[Layout]    --> calcul de la position et taille de chaque élément
  |
  v
[Paint]     --> dessiner les pixels de chaque élément (couleurs, borders, texte)
  |
  v
[Composite]   --> assembler les layers (couches) et envoyer au GPU (carte graphique)
  |
  v
Pixel sur l'écran
```

Chaque étape a un coût. Déclencher les mauvaises étapes trop souvent = page qui lag.

---

## 2) PARSING HTML ET CONSTRUCTION DU DOM

Le navigateur lit l'HTML ligne par ligne et construit le DOM : une arborescence (tree structure) de noeuds.

```html
<div class="camp">
 <h1>Camp de Rick</h1>
 <ul>
  <li>Rick</li>
  <li>Daryl</li>
 </ul>
</div>
```

Le DOM résultant :

```
Document
 └── html
    └── body
       └── div.camp
          ├── h1 ("Camp de Rick")
          └── ul
             ├── li ("Rick")
             └── li ("Daryl")
```

**Attention : les scripts bloquent le parsing.**

```html
<!-- Le navigateur parse l'HTML... -->
<p>Début</p>
<script src="gros-script.js"></script>
<!-- STOP : attend le téléchargement et l'exécution -->
<p>Suite</p>
<!-- Ce paragraphe n'est pas rendu avant la fin du script -->
```

Solution : `defer` ou `async`.

```html
<script src="app.js" defer></script>
<!-- defer : téléchargé en parallèle, exécuté après le parsing complet. Ordre garanti. -->

<script src="analytics.js" async></script>
<!-- async : téléchargé et exécuté dès que possible, sans ordre garanti. -->
```

Règle : `defer` pour les scripts qui dépendent du DOM. `async` pour les scripts indépendants (analytics, pub).

---

## 3) PARSING CSS ET CONSTRUCTION DU CSSOM

Le CSS est aussi parsé en arbre : le CSSOM (CSS Object Model).
Le rendu est bloqué (render-blocking) jusqu'à ce que le CSSOM soit complet.

```css
/* Le navigateur lit ça et construit un arbre de règles */
.camp {
 background: #333;
}
.camp h1 {
 color: white;
 font-size: 2rem;
}
.camp ul li {
 padding: 8px;
}
```

Pourquoi le rendu est bloqué ? Parce que le navigateur ne peut pas savoir l'apparence d'un élément avant d'avoir toutes les règles CSS.

Optimisation :

```html
<!-- CSS critique (above-the-fold : ce qui est visible sans scroll) en inline -->
<style>
 /* seulement les styles essentiels pour afficher ce que l'user voit en premier */
 body {
  margin: 0;
  font-family: sans-serif;
 }
 .hero {
  height: 100vh;
  background: #000;
 }
</style>

<!-- Le reste chargé en async (non bloquant) -->
<link
 rel="preload"
 href="styles.css"
 as="style"
 onload="this.rel='stylesheet'"
/>
```

---

## 4) LAYOUT, PAINT, COMPOSITE

**Layout (Reflow) :** calcul des positions et tailles.
Le navigateur répond à : "où est cet élément ? Quelle est sa taille ?"

Ce qui déclenche un Layout :

```js
// Modifier les propriétés qui affectent la géométrie = Layout systématique
element.style.width = "300px"; // change la taille
element.style.margin = "20px"; // change la position
element.style.fontSize = "18px"; // change le flux du texte
document.body.appendChild(newNode); // ajoute un noeud dans le flux
```

Layout est coûteux. Il recalcule potentiellement tout l'arbre.

**Paint :** dessiner les pixels (couleurs, textes, ombres, borders).
Ce qui déclenche un Paint (mais pas forcément un Layout) :

```js
element.style.color = "red"; // change la couleur du texte
element.style.backgroundColor = "blue"; // change le fond
element.style.boxShadow = "0 2px 4px #000"; // ajoute une ombre
```

**Composite :** assembler les layers et envoyer au GPU.
Certaines propriétés ne déclenchent ni Layout ni Paint : seulement Composite.
Ce sont les propriétés à privilégier pour les animations.

```js
// Ces propriétés passent directement au Composite (GPU) : ultra rapides
element.style.transform = "translateX(100px)"; // déplacer sans Layout ni Paint
element.style.opacity = "0.5"; // transparence sans Layout ni Paint

// Ces propriétés déclenchent Layout + Paint + Composite : lentes en animation
element.style.left = "100px"; // Layout : recalcule le flux
element.style.width = "200px"; // Layout : change la géométrie
```

---

## 5) LE PIÈGE DU LAYOUT THRASHING

Layout thrashing (contention de layout) : lire et écrire des propriétés géométriques en alternance dans une boucle.
Chaque lecture force le navigateur à recalculer le Layout avant de répondre.

```js
// MAUVAIS : lecture + écriture alternées = Layout forcé à chaque tour
const boxes = document.querySelectorAll(".box");

for (const box of boxes) {
 const width = box.offsetWidth; // LECTURE : force un Layout
 box.style.width = width * 2 + "px"; // ÉCRITURE : invalide le Layout
 // => sur la prochaine lecture, Layout recalculé depuis zéro
}
// Sur 100 boîtes : 100 Layouts forcés = page qui freeze

// CORRECT : batch (regrouper) les lectures, puis les écritures séparément
const widths = [...boxes].map((box) => box.offsetWidth); // TOUTES les lectures d'abord

widths.forEach((width, i) => {
 boxes[i].style.width = width * 2 + "px"; // TOUTES les écritures ensuite
});
// => 1 seul Layout au moment des lectures, 1 seul Paint après toutes les écritures
```

---

## 6) REPAINT VS REFLOW

```
Modification          Déclenche      Coût
------------------------------ ------------------ -------
Ajout d'un noeud dans le DOM  Reflow + Repaint  élevé
Changement de width/height   Reflow + Repaint  élevé
Changement de margin/padding  Reflow + Repaint  élevé
Changement de color/background Repaint seulement  moyen
opacity/transform        Composite seulement faible (GPU)
```

Pour les animations : toujours `transform` et `opacity`. Jamais `left/top/width`.

```js
// Animation CORRECTE : transform passe par le GPU
element.style.transition = "transform 0.3s ease";
element.style.transform = "translateX(200px)"; // smooth, sans reflow

// Animation INCORRECTE : left force un reflow à chaque frame
element.style.transition = "left 0.3s ease";
element.style.left = "200px"; // reflow à chaque frame de l'animation
```

---

## 7) LES CORE WEB VITALS EN PRATIQUE

Google mesure trois métriques (module 08 pour le détail, résumé rapide ici) :

**LCP (Largest Contentful Paint) :** temps pour afficher le plus grand élément visible.
Objectif : < 2.5s.

```html
<!-- Précharger (preload) l'image hero pour accélérer le LCP -->
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high" />
<img src="/hero.webp" alt="Hero" loading="eager" />
<!-- ne pas lazy-loader le LCP -->
```

**INP (Interaction to Next Paint) :** délai entre l'action de l'utilisateur et la mise à jour visuelle.
Objectif : < 200ms.

```js
// Éviter le travail long dans les event handlers (gestionnaires d'événements)
button.addEventListener("click", async () => {
 // Mise à jour visuelle immédiate d'abord
 button.disabled = true;
 button.textContent = "Chargement...";

 // Travail lourd ensuite (ou délégué à un Worker)
 const data = await fetchHeavyData();
 renderResults(data);
});
```

**CLS (Cumulative Layout Shift) :** décalage cumulé de la mise en page pendant le chargement.
Objectif : < 0.1.

```css
/* Réserver l'espace pour les images avant qu'elles chargent */
img {
 width: 100%;
 aspect-ratio: 16 / 9; /* réserve la hauteur proportionnelle */
}

/* Réserver l'espace pour les fonts (polices) */
@font-face {
 font-display: optional; /* ne pas attendre la font si elle n'est pas prête */
}
```

---

## EXERCICES

**EXO 1 : Auditer le camp de Rick**
Tu reçois ce code :

```js
const survivors = document.querySelectorAll(".survivor");
for (const s of survivors) {
 const h = s.offsetHeight;
 s.style.height = h + 20 + "px";
 s.style.backgroundColor = s.classList.contains("guard") ? "green" : "red";
}
```

Identifie tous les problèmes de performance du pipeline de rendu.
Réécris le code sans layout thrashing et sans repaint inutile.

**EXO 2 : Animation de Naruto sans lag**
Tu dois animer Naruto qui court de gauche à droite (un div qui se déplace de 0 à 300px).
Version 1 : avec `left`. Version 2 : avec `transform: translateX`.
Explique pourquoi la version 2 ne déclenche pas de Reflow.

**EXO 3 : Diagnostiquer un CLS**
Une page affiche des cartes de survivants. Chaque carte a une image qui charge lentement.
Avant que l'image charge, la carte fait 50px de haut. Après, 250px. Ça décale tout le reste.
Identifie la cause du CLS et propose deux solutions CSS.

---

## RÉSUMÉ

Le pipeline de rendu : HTML --> DOM, CSS --> CSSOM, fusion --> Layout --> Paint --> Composite.
Layout (Reflow) est coûteux : il recalcule les positions. Évite de le déclencher inutilement.
Pour les animations : `transform` et `opacity` passent par le GPU. `left` et `width` non.
Le layout thrashing : lire et écrire des propriétés géométriques alternativement en boucle. Toujours batcher.
LCP, INP, CLS : les trois métriques de Google. Comprendre le pipeline explique pourquoi chacune dégrade.
