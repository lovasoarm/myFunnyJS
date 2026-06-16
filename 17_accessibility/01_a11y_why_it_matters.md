# L'ACCESSIBILITÉ N'EST PAS UNE OPTION

Tu codes une interface. Elle marche nickel sur ton écran, avec ta souris, tes yeux qui voient bien. Sauf que des millions de gens n'utilisent ni souris, ni vue normale, ni les deux mains. Si ton code les ignore, tu n'as pas codé "le web" : tu as codé une version pour toi-même. L'accessibilité (a11y, abréviation de "accessibility" avec 11 lettres entre le a et le y), c'est s'assurer que ton appli marche pour tout le monde, pas juste pour ceux qui te ressemblent.

## 1) LES CHIFFRES QUI FONT RÉFLÉCHIR

Environ 1 personne sur 6 dans le monde vit avec une forme de handicap, selon l'OMS (Organisation Mondiale de la Santé). Ça inclut la vue (daltonisme, basse vision, cécité), l'audition, la motricité (tremblements, paralysie, amputation), et le cognitif (dyslexie, TDAH, troubles de l'attention).

```js
// Ce code marche "bien"... pour qui exactement ?
function afficherAlerte() {
  document.getElementById('alert').style.color = 'red'; // (rouge = danger, mais pour un daltonique ?)
}
```

Un daltonique sur 12 hommes ne voit pas la différence entre rouge et vert clairement. Si ton seul signal d'erreur c'est la couleur rouge, une partie de tes utilisateurs voit juste... du texte normal. Pas d'alerte du tout.

## 2) LES LOIS : CE N'EST PAS QU'UNE QUESTION DE GENTILLESSE

```
WCAG (Web Content Accessibility Guidelines) --> le standard technique international
ADA (Americans with Disabilities Act)        --> loi US, des sites ont été poursuivis en justice
EAA (European Accessibility Act)             --> loi UE, obligatoire pour le secteur privé depuis 2025
```

Des entreprises comme Domino's Pizza ou Target ont été traînées en justice aux US pour des sites web inaccessibles. Pas une légende urbaine : un vrai procès, une vraie amende. L'accessibilité, c'est un risque légal réel, pas juste une "bonne pratique" qu'on coche si on a le temps.

## 3) LES GENS RÉELS DERRIÈRE LES CHIFFRES

Imagine Rick Grimes après avoir perdu sa main : il navigue au clavier, pas à la souris. Si ton menu déroulant ne réagit qu'au survol de souris (`:hover`), Rick reste bloqué devant un menu qu'il ne peut jamais ouvrir.

```js
// Piège classique : interaction qui ignore le clavier
menu.addEventListener('mouseenter', ouvrirMenu); // (et si t'as pas de souris ?)
// Pas de gestion du focus, pas de touche Entrée, pas de Tab : Rick est coincé
```

```js
// Version qui inclut tout le monde
menu.addEventListener('mouseenter', ouvrirMenu);
menu.addEventListener('focus', ouvrirMenu); // (le clavier déclenche pareil)
menu.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') ouvrirMenu(); // (Entrée ou Espace, comme un clic)
});
```

## 4) CE QUE ÇA COÛTE DE L'IGNORER

```
Coder accessible dès le départ  --> coût faible, intégré au design
Réparer après coup               --> coût x10, refonte complète parfois
Ignorer complètement              --> procès, perte d'utilisateurs, mauvaise réputation
```

L'accessibilité ressemble à la dette technique du module 11_refactoring : plus tu attends pour la traiter, plus la facture grossit. Sauf qu'ici, la "dette" exclut des humains réels de ton produit.

## 5) CE QUE LE RESTE DU MODULE COUVRE

```
02_aria_basics            --> parler aux lecteurs d'écran
03_keyboard_navigation    --> naviguer sans souris
04_contrast_and_colors    --> les couleurs qui ne trahissent personne
05_screen_readers         --> comment VoiceOver, NVDA lisent vraiment ton code
06_a11y_audit             --> auditer une vraie page avec de vrais outils
```

Risque réel : penser que l'accessibilité, c'est un module à part qu'on traite "à la fin". Non. Si tu apprends le HTML sémantique et le focus management depuis le début, t'as zéro travail en plus à la fin. Si tu l'ignores, tu refais tout le projet.

---

## EXERCICES

EXO 1 : Le bouton qui ment :
Trouve dans un site que tu utilises souvent (le tien ou un site connu) un élément cliquable qui n'est PAS un vrai `<button>` ou `<a>` (souvent un `<div onclick="">`). Explique en une phrase pourquoi un lecteur d'écran ne le détecte pas comme interactif.

EXO 2 : Daltonien d'un jour :
Prends une capture d'écran de ton interface en cours et passe-la dans un simulateur de daltonisme (cherche "color blindness simulator" en ligne). Note ce qui devient illisible ou ambigu (indice : les boutons "valider" en vert et "annuler" en rouge sont souvent le premier piège).

EXO 3 : Rick sans souris :
Débranche ta souris (ou désactive-la) et essaie de naviguer sur ton interface uniquement au clavier (Tab, Entrée, Espace, flèches). Liste tout ce qui devient impossible à atteindre.

## RÉSUMÉ

L'accessibilité concerne environ 1 personne sur 6 dans le monde, pas une minorité négligeable. C'est aussi une obligation légale dans plusieurs pays, avec des vrais procès derrière. Ignorer l'a11y dès le départ, c'est repousser une dette qui coûtera 10 fois plus cher à corriger après coup. Le reste du module te donne les outils concrets : ARIA, clavier, contraste, lecteurs d'écran, audit.
