---
stability: intemporel
---

# NAVIGATION CLAVIER : QUAND LA SOURIS N'EST PAS UNE OPTION
Temps de lecture ~7 min

Tab. Entrée. Espace. Flèches. Échap. Pour des millions de gens (tremblements, paralysie, amputation, ou juste une préférence de power user), c'est TOUT ce qu'ils ont pour naviguer ton interface. Si ton code suppose toujours une souris, t'as construit une porte sans poignée pour eux.

## 1) TAB ORDER : L'ORDRE DE LECTURE INVISIBLE

Le tab order (ordre de tabulation) c'est la séquence dans laquelle Tab déplace le focus. Par défaut, le navigateur suit l'ordre du DOM (Document Object Model). Le piège : un design visuel qui ne suit pas l'ordre du code.

```js
// Le DOM dit : Bouton A, puis Champ B, puis Bouton C
// Mais le CSS a tout repositionné visuellement dans un autre ordre
// Résultat : Tab saute dans le désordre, l'utilisateur clavier est perdu

// Correct : aligner le DOM avec l'ordre visuel logique, pas l'inverse
```

```js
// tabindex : modifier l'ordre, MANUELLEMENT, avec prudence
<button tabindex="1">Nom</button>
<button tabindex="2">Email</button>
<button tabindex="3">Envoyer</button>
// (tabindex positif = ordre custom, mais ça devient vite un cauchemar à maintenir)
```

```
tabindex="0"  --> rend un élément focusable dans l'ordre naturel du DOM (le cas le plus sain)
tabindex="-1" --> focusable seulement par script (JS), jamais par Tab
tabindex="1+" --> ordre custom forcé : à éviter, ça casse vite quand le DOM change
```

## 2) FOCUS MANAGEMENT : SAVOIR OÙ EST LE FOCUS À TOUT MOMENT

Quand tu ouvres une modal, fermes un menu, ou changes de page en SPA (Single Page Application), le focus doit suivre l'action. Sinon l'utilisateur clavier reste coincé sur un élément invisible ou disparu.

```js
function ouvrirModalCombat() {
 const modal = document.querySelector('#modal-defi');
 modal.classList.remove('hidden');

 const premierElementFocusable = modal.querySelector('button, input, a');
 premierElementFocusable.focus(); // (déplace le focus DANS la modal dès l'ouverture)
}

function fermerModalCombat(elementDeclencheur) {
 const modal = document.querySelector('#modal-defi');
 modal.classList.add('hidden');

 elementDeclencheur.focus(); // (rend le focus à l'élément qui a ouvert la modal)
}
```

Sans ce deuxième `focus()`, fermer la modal laisse le focus "dans le vide" : le navigateur le replace souvent au tout début de la page (`<body>`), et l'utilisateur doit retraverser TOUTE la page au clavier pour revenir où il était.

## 3) FOCUS TRAP : EMPRISONNER LE FOCUS DANS UNE MODAL

Un focus trap (piège à focus) empêche Tab de sortir d'une modal ouverte tant qu'elle n'est pas fermée. Sans ça, Tab continue derrière la modal, sur des éléments invisibles à l'écran.

```js
function piegerFocus(modal) {
 const elementsFocusables = modal.querySelectorAll('button, input, a, select');
 const premier = elementsFocusables[0];
 const dernier = elementsFocusables[elementsFocusables.length - 1];

 modal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;

  if (e.shiftKey && document.activeElement === premier) {
   e.preventDefault();
   dernier.focus(); // (Shift+Tab sur le premier élément renvoie au dernier)
  } else if (!e.shiftKey && document.activeElement === dernier) {
   e.preventDefault();
   premier.focus(); // (Tab sur le dernier élément renvoie au premier)
  }
 });
}
```

```
Tab depuis dernier élément --> revient au premier (boucle fermée)
Shift+Tab depuis premier  --> revient au dernier (boucle fermée dans l'autre sens)
```

## 4) SKIP LINKS : SAUTER LE BLABLA RÉPÉTITIF

Un skip link (lien d'évitement) permet de sauter directement au contenu principal, sans traverser tout le header et le menu de navigation à chaque page.

```js
// Premier élément focusable de la page, souvent invisible jusqu'au focus
<a href="#contenu-principal" class="skip-link">Aller au contenu principal</a>
```

```css
.skip-link {
 position: absolute;
 top: -40px; /* (caché hors écran par défaut) */
}
.skip-link:focus {
 top: 0; /* (apparaît seulement quand on navigue jusqu'à lui au clavier) */
}
```

Sans skip link, un utilisateur clavier qui visite 50 pages d'un site doit retraverser le même menu de navigation 50 fois avant d'atteindre le contenu. Walking Dead, mais en version "traverser le même quartier zombie chaque jour pour rien".

## 5) ESCAPE : LA SORTIE DE SECOURS UNIVERSELLE

```js
document.addEventListener('keydown', (e) => {
 if (e.key === 'Escape') {
  fermerModalCombat(document.activeElement); // (Échap ferme toujours ce qui est ouvert)
 }
});
```

Risque réel : oublier Échap sur une modal, c'est piéger l'utilisateur dans un focus trap qu'il ne peut JAMAIS quitter au clavier. Un focus trap sans sortie, c'est une prison sans porte.

---

## EXERCICES

EXO 1 : Évade-toi sans souris :
Prends une page de ton projet (ou un site connu) et navigue-la entièrement au clavier (Tab, Entrée, Échap), souris débranchée. Note tout endroit où le focus disparaît, saute dans le désordre, ou se retrouve coincé.

EXO 2 : La prison de Fox River sans porte :
Construit une modal de confirmation ("Confirmer l'évasion ?") avec un focus trap complet : focus initial dedans, Tab qui boucle, Échap qui ferme et rend le focus au bouton déclencheur.

EXO 3 : Le menu de navigation qui fatigue :
Ajoute un skip link à une page avec un header de 10 liens de navigation. Vérifie qu'il reste invisible visuellement jusqu'à ce qu'on le focus au clavier (indice : `position: absolute` + changement au `:focus`).

## RÉSUMÉ

Le tab order doit suivre l'ordre visuel logique, pas un `tabindex` bricolé partout. Le focus management déplace activement le focus à chaque ouverture/fermeture de modal ou changement d'état important. Le focus trap empêche Tab de sortir d'une modal ouverte, mais doit toujours avoir une sortie via Échap. Les skip links évitent de retraverser le même menu à chaque page.
