---
stability: intemporel
---

# ARIA : PARLER LA LANGUE DES LECTEURS D'ÉCRAN
Temps de lecture ~7 min

Un lecteur d'écran (screen reader) ne "voit" pas ta page comme toi. Il lit le DOM (Document Object Model : la structure de ta page en mémoire) et essaie de deviner ce que chaque élément fait. ARIA (Accessible Rich Internet Applications : applications internet riches accessibles) c'est un set d'attributs HTML qui dit explicitement au lecteur d'écran : "ça, c'est un bouton", "ça, c'est en train de charger", "ça, c'est ouvert". Sans ARIA sur les éléments custom, le lecteur d'écran navigue à l'aveugle dans ton propre code.

## 1) LA RÈGLE D'OR : LE HTML NATIF GAGNE TOUJOURS

Avant de parler ARIA, une vérité qui dérange : la première règle d'ARIA, c'est de ne pas en avoir besoin.

```js
// Mauvais : réinventer un bouton avec une div
const fauxBouton = document.createElement('div');
fauxBouton.textContent = 'Lancer Rasengan';
fauxBouton.onclick = lancerJutsu; // (pas de focus clavier, pas de rôle, rien)

// Correct : utiliser l'élément natif qui fait déjà tout ça
const vraiBouton = document.createElement('button');
vraiBouton.textContent = 'Lancer Rasengan';
vraiBouton.onclick = lancerJutsu; // (focus, clavier, rôle "button" : gratuit, inclus)
```

`<button>` a déjà un rôle "button" intégré, gère le focus, et réagit à Entrée/Espace. ARIA existe pour les cas où le HTML natif ne suffit pas : composants custom (tabs, modals, carrousels) qui n'ont pas d'équivalent natif riche.

## 2) ROLES : DIRE CE QU'EST L'ÉLÉMENT

Le `role` annonce au lecteur d'écran la nature de l'élément quand le HTML natif ne le dit pas déjà.

```js
// Une notification de combat custom (pas un élément natif)
const alerte = document.createElement('div');
alerte.setAttribute('role', 'alert'); // (le lecteur d'écran l'annonce IMMÉDIATEMENT, sans navigation)
alerte.textContent = 'Sasuke a activé le Sharingan !';
document.body.appendChild(alerte);
```

```js
// Une barre de progression custom (chakra qui se recharge)
const barreChakra = document.createElement('div');
barreChakra.setAttribute('role', 'progressbar'); // (annonce : "c'est une jauge")
barreChakra.setAttribute('aria-valuenow', '60');
barreChakra.setAttribute('aria-valuemin', '0');
barreChakra.setAttribute('aria-valuemax', '100');
```

## 3) STATES : DIRE DANS QUEL ÉTAT L'ÉLÉMENT EST

Les states (états) ARIA changent dynamiquement, contrairement aux roles qui restent fixes.

```js
// Menu déroulant : ouvert ou fermé ?
const menuButton = document.querySelector('#menu-toggle');
menuButton.setAttribute('aria-expanded', 'false'); // (état initial : fermé)

function toggleMenu() {
 const estOuvert = menuButton.getAttribute('aria-expanded') === 'true';
 menuButton.setAttribute('aria-expanded', String(!estOuvert)); // (bascule l'état)
}
```

Sans `aria-expanded`, un utilisateur de lecteur d'écran clique sur ton bouton "Menu" et n'a AUCUNE idée si quelque chose s'est ouvert ou pas. Il entend juste... le silence.

```js
// Champ de formulaire invalide
const champEmail = document.querySelector('#email');
champEmail.setAttribute('aria-invalid', 'true'); // (signale l'erreur sans dépendre de la couleur rouge)
```

## 4) PROPERTIES : DIRE COMMENT DEUX ÉLÉMENTS SE RELIENT

Les properties (propriétés) ARIA créent des liens entre éléments que le DOM seul ne montre pas.

```js
// Lier un message d'erreur à son champ
const champ = document.querySelector('#password');
const erreur = document.querySelector('#password-error');
erreur.id = 'password-error';
champ.setAttribute('aria-describedby', 'password-error');
// (le lecteur d'écran lit le champ PUIS lit automatiquement le message d'erreur lié)
```

```js
// aria-live : annoncer un changement dynamique sans déplacer le focus
const scoreLive = document.querySelector('#score-match');
scoreLive.setAttribute('aria-live', 'polite');
// (quand le score change, le lecteur d'écran l'annonce sans interrompre ce que l'utilisateur fait)

function majScore(nouveauScore) {
 scoreLive.textContent = `Score : ${nouveauScore}`; // (déclenche l'annonce automatiquement)
}
```

`aria-live="polite"` attend une pause naturelle pour annoncer. `aria-live="assertive"` interrompt tout de suite, réservé aux urgences réelles (alerte de sécurité, erreur critique).

## 5) LE PIÈGE CLASSIQUE : ARIA QUI MENT

```js
// Ça casse (mais fun) : un rôle qui ne correspond à RIEN de réel
const fauxModal = document.createElement('div');
fauxModal.setAttribute('role', 'dialog'); // (annonce "c'est une boîte de dialogue")
// ... mais aucune gestion du focus trap, aucune fermeture à Échap, rien
// Résultat : le lecteur d'écran annonce "dialogue" puis l'utilisateur est PERDU dedans
```

ARIA, c'est une promesse. Si tu dis "c'est un dialogue" sans implémenter le comportement réel d'un dialogue (focus piégé dedans, fermeture à Échap, retour au focus précédent), tu mens à l'utilisateur. Et un mauvais ARIA est souvent pire que pas d'ARIA du tout : ça donne de fausses attentes.

---

## EXERCICES

EXO 1 : La notification de combat silencieuse :
Construit un système d'alerte pour Garo Honoo no Kokuin qui annonce "Un Horror est apparu !" dès qu'il s'affiche, sans que le Chevalier ait besoin de naviguer jusqu'à lui (indice : `role="alert"` annonce automatiquement, sans `aria-live` en plus, ça suffit).

EXO 2 : Le menu de jutsus accessible :
Construit un menu déroulant de sélection de jutsu (Rasengan, Chidori, Kamehameha) qui annonce correctement son état ouvert/fermé à chaque clic ou pression de touche.

EXO 3 : Trouve le mensonge ARIA :
Cherche un site avec `role="button"` posé sur une `<div>` sans gestion du clavier. Explique ce que le lecteur d'écran promet, et ce que le code livre vraiment.

## RÉSUMÉ

ARIA sert quand le HTML natif ne suffit pas : roles pour dire ce qu'est l'élément, states pour dire dans quel état il est, properties pour relier les éléments entre eux. La règle d'or reste d'utiliser le HTML natif (`<button>`, `<nav>`) chaque fois que possible, car il vient avec le comportement déjà intégré. Un mauvais ARIA qui ment sur le comportement réel est souvent pire que l'absence d'ARIA.
