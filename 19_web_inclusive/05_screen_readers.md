---
stability: intemporel
---

# LECTEURS D'ÉCRAN : COMMENT ILS LISENT VRAIMENT TON CODE
Temps de lecture ~7 min

VoiceOver (Apple), NVDA (Windows, gratuit), TalkBack (Android) : trois lecteurs d'écran (screen readers), trois moteurs différents, mais une logique commune. Ils ne "voient" pas ta page, ils la traversent élément par élément, en lisant ce que le DOM (Document Object Model) leur raconte. Si ton HTML est du `<div>` empilé sans structure, ils n'ont littéralement rien à raconter au shinobi.

## 1) L'ARBRE D'ACCESSIBILITÉ : LA VRAIE SOURCE DE VÉRITÉ

Le navigateur construit, en parallèle du DOM visuel, un arbre d'accessibilité (accessibility tree). C'est CET arbre que le lecteur d'écran lit, pas le rendu visuel.

```js
// Ce HTML produit un noeud d'accessibilité riche
<button aria-label="Fermer la modal">×</button>
// Arbre d'accessibilité : { role: "button", name: "Fermer la modal" }
// Le lecteur d'écran annonce : "Fermer la modal, bouton"
```

```js
// Ce HTML produit un noeud presque vide
<div onclick="fermer()">×</div>
// Arbre d'accessibilité : { role: "generic", name: "×" }
// Le lecteur d'écran annonce juste : "×" (le symbole, sans aucun contexte)
```

Diagramme :

```
HTML + ARIA --> Navigateur construit l'arbre d'accessibilité --> Lecteur d'écran lit l'arbre --> Voix de synthèse
```

L'élément visuel est identique (un "×" cliquable), mais l'expérience pour un shinobi non-voyant est radicalement différente.

## 2) LA NAVIGATION PAR ÉLÉMENTS, PAS PAR PIXELS

Un shinobi voyant scanne une page visuellement en une fraction de seconde. Un shinobi de lecteur d'écran traverse la page élément par élément, ou par catégorie (tous les titres, tous les liens, tous les formulaires).

```js
// Une page bien structurée se traverse facilement PAR TITRES
<h1>Le combat contre Pain</h1>
<h2>Phase 1 : Reconnaissance</h2>
<h2>Phase 2 : Mode Sage</h2>
<h2>Phase 3 : Le dialogue final</h2>
// NVDA permet de sauter de h2 à h2 directement avec une touche : navigation rapide
```

```js
// Une page sans hiérarchie de titres force une lecture linéaire complète
<div class="titre-style-h1">Le combat contre Pain</div>
<div class="titre-style-h2">Phase 1 : Reconnaissance</div>
// Visuellement identique. Pour le lecteur d'écran : juste du texte plat, aucun raccourci de navigation
```

Risque réel : styler une `<div>` pour qu'elle "ressemble" à un titre, c'est tromper visuellement les humains voyants ET techniquement le lecteur d'écran en même temps. Utilise `<h1>` à `<h6>` pour ce qui EST un titre, point.

## 3) LE NOM ACCESSIBLE : CE QUE LA VOIX VA PRONONCER

Chaque élément interactif a un "accessible name" (nom accessible), calculé selon une priorité précise.

```
Priorité de calcul du nom accessible :
1. aria-labelledby (référence un autre élément)
2. aria-label (texte direct)
3. Le contenu textuel visible de l'élément
4. L'attribut alt (pour les images)
5. L'attribut title (en dernier recours, peu fiable)
```

```js
// Une image sans alt : le lecteur d'écran annonce juste "image", zéro info
<img src="rasengan.png" />

// Une image avec alt vide : volontaire pour les images purement décoratives
<img src="fond-decoratif.png" alt="" /> // (le lecteur d'écran l'ignore complètement, c'est voulu)

// Une image avec alt informatif : décrit la FONCTION, pas juste l'apparence
<img src="rasengan.png" alt="Naruto lance un Rasengan à pleine puissance" />
```

```js
// Piège classique : un bouton icône SANS texte alternatif
<button><svg>...</svg></button>
// Le lecteur d'écran annonce : "bouton" (et rien d'autre, le shinobi ne sait pas ce que ça fait)

// Correct
<button aria-label="Supprimer le ninja de la liste"><svg>...</svg></button>
// Annonce : "Supprimer le ninja de la liste, bouton"
```

## 4) LES DIFFÉRENCES ENTRE LECTEURS D'ÉCRAN

```
VoiceOver (macOS/iOS) --> intégré nativement, raccourci VO+flèches, très utilisé sur mobile
NVDA (Windows)     --> gratuit et open source, le plus testé par la communauté dev
TalkBack (Android)   --> intégré nativement, gestes tactiles spécifiques
JAWS (Windows)     --> payant, encore très présent en entreprise et administration
```

Risque réel : tester UNIQUEMENT avec un lecteur d'écran (souvent VoiceOver parce que tu es sur Mac) et assumer que ça marche pareil partout. Les implémentations ARIA varient légèrement entre eux. Un `aria-live` qui fonctionne nickel sur NVDA peut avoir un comportement différent sur VoiceOver.

## 5) LE TEST QUI CASSE (MAIS FUN)

```js
// Ça casse : un formulaire avec des labels visuels mais pas liés au champ
<label>Nom du ninja</label>
<input type="text" /> // (aucun attribut "for", aucune relation technique)
// Le lecteur d'écran annonce juste : "champ de texte vide", le label flotte sans lien réel

// Ça marche : lien explicite entre label et champ
<label for="nom-ninja">Nom du ninja</label>
<input type="text" id="nom-ninja" />
// Annonce : "Nom du ninja, champ de texte"
```

---

## EXERCICES

EXO 1 : Active un vrai lecteur d'écran :
Active VoiceOver (Cmd+F5 sur Mac) ou NVDA (gratuit sur Windows), ferme les yeux, et navigue 5 minutes sur ton projet en cours. Note tout ce qui est annoncé de façon incompréhensible ou silencieuse.

EXO 2 : Traque les boutons muets :
Cherche dans ton code tous les boutons qui contiennent uniquement une icône SVG sans texte. Ajoute un `aria-label` pertinent à chacun.

EXO 3 : Le formulaire de recrutement Akatsuki :
Construit un petit formulaire (nom, email, spécialité) où chaque `<label>` est correctement lié à son `<input>` via `for`/`id`, testable au lecteur d'écran.

## RÉSUMÉ

Le lecteur d'écran lit l'arbre d'accessibilité, pas le rendu visuel : un `<div onclick>` et un `<button>` peuvent se ressembler à l'écran et être totalement différents pour cet arbre. La navigation se fait par catégorie d'éléments (titres, liens, formulaires), donc une vraie hiérarchie de `<h1>` à `<h6>` change tout. Le nom accessible suit une priorité précise (aria-label, contenu textuel, alt), et un bouton icône sans nom est juste annoncé "bouton" sans aucune info utile.
