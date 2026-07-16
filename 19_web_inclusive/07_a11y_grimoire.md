# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~9 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## GRIMOIRE : ACCESSIBILITY (A11Y)

Coder pour tout le monde, pas juste pour ceux qui te ressemblent. Ce grimoire couvre les enjeux réels, ARIA, le clavier, le contraste, les lecteurs d'écran, et l'audit. Si un terme te paraît flou, retourne à la leçon correspondante.

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| A11y | Abréviation de "accessibility" (11 lettres entre le a et le y) : rendre une interface utilisable par tous | `<button aria-label="Fermer">×</button>` |Rick qui doit traverser le camp avec une seule main : le camp doit marcher pour lui aussi | un stade qui prévoit une entrée pour fauteuil roulant, pas juste des tribunes pour ceux qui marchent|
| WCAG | Standard international qui fixe les règles techniques d'accessibilité web | niveau AA, ratio 4.5:1 |le règlement officiel du Ballon d'Or : des critères précis, pas "à l'instinct du jury" | les règles d'évasion de Fox River écrites noir sur blanc, pas improvisées sur le moment|
| ARIA | Attributs HTML qui décrivent rôle, état et relation pour les lecteurs d'écran | `role="alert"` |le carnet de bord d'un Chevalier de Garo qui précise le rôle et l'état de chaque allié sur le terrain | l'étiquette sur chaque fiole de Walter qui dit exactement ce qu'elle contient|
| Role (rôle) | Dit ce qu'est un élément quand le HTML natif ne le précise pas | `<div role="progressbar">` |annoncer à la radio "ici un poste de garde", pas juste poser une caisse sans rien dire | présenter un nouveau venu comme "médecin de l'équipe", pas juste le laisser sur le banc sans titre|
| State (état ARIA) | Dit dans quel état dynamique se trouve un élément | `aria-expanded="true"` |la jauge de chakra de Naruto qui dit "plein" ou "vide" à l'instant présent, pas une valeur figée | le panneau de score qui dit si la mi-temps est en cours ou terminée|
| aria-live | Annonce un changement dynamique sans déplacer le focus | `aria-live="polite"` |le commentateur radio qui annonce un but sans interrompre la conversation que tu as en tribune | l'alerte de patrouille Garo qui informe sans forcer le Chevalier à tout arrêter|
| Tab order | Ordre dans lequel la touche Tab déplace le focus | `tabindex="0"` |l'ordre de passage des prisonniers à l'appel à Fox River : chacun son tour, dans un ordre logique | l'ordre des intervenants dans une réunion de crise des survivants : on ne parle pas tous en même temps ni dans le désordre|
| Focus trap | Piège qui empêche Tab de sortir d'une modal ouverte | boucle Tab dernier --> premier |l'enceinte scellée d'un combat de Garo : impossible de sortir tant que le combat n'est pas fini, mais une sortie existe quand on la termine | le bloc d'isolement de Fox River : enfermé temporairement, avec une porte qui s'ouvre vraiment à la fin|
| Skip link | Lien qui permet de sauter directement au contenu principal | `<a href="#main">Aller au contenu</a>` |un tunnel secret de Fox River qui évite de retraverser tous les couloirs surveillés à chaque évasion | un raccourci direct vers le terrain, sans repasser par tout le stade à chaque match|
| Ratio de contraste | Mesure précise de la différence de luminosité texte/fond | 4.5:1 minimum niveau AA |la différence de puissance mesurée au combat-mètre entre Naruto et son adversaire, pas juste "il a l'air plus fort" | le calcul précis d'écart de points au classement Ballon d'Or, pas une impression de classement|
| Daltonisme | Trouble de la vision des couleurs, le plus courant étant rouge-vert | icône + texte, pas que la couleur |deux maillots d'équipe trop proches en couleur sous certains éclairages : l'arbitre doit pouvoir les distinguer autrement | Walter qui ne se fie jamais qu'à la couleur d'un jutsu chimique pour l'identifier, il vérifie aussi l'étiquette|
| Arbre d'accessibilité | Structure parallèle au DOM que lit le lecteur d'écran | `<button>` génère un noeud riche |le rapport officiel de mission lu par le QG, différent de ce que voit le ninja sur le terrain, mais qui doit raconter la même histoire | la fiche de match lue par un commentateur radio, qui doit décrire fidèlement ce qui se passe sur le terrain qu'il ne voit pas|
| Nom accessible | Le texte que la voix de synthèse va prononcer pour un élément | `aria-label`, `alt`, texte visible |le nom annoncé au micro avant un combat de Garo, pas juste un numéro de combattant | le nom du joueur annoncé au haut-parleur du stade, pas juste son numéro de maillot|
| Screen reader (lecteur d'écran) | Logiciel qui lit l'arbre d'accessibilité à voix haute | VoiceOver, NVDA, TalkBack |le commentateur radio d'un match de foot pour quelqu'un qui ne voit pas le terrain : il décrit tout à voix haute | la voix qui décrit un combat de Garo à quelqu'un qui suit seulement par audio|
| axe | Outil de scan automatique des violations WCAG dans le DOM | `expect(await axe(container)).toHaveNoViolations()` |un détecteur automatique de pièges dans une mission Naruto : il trouve les pièges connus, pas les embuscades inédites | le contrôle technique d'une voiture : il vérifie une checklist connue, pas tout ce qui pourrait casser sur la route|
| Lighthouse | Audit Chrome qui donne un score et une liste priorisée de problèmes | onglet DevTools, Accessibility |le bilan de santé complet d'un ninja avant une mission : un score global, plus le détail de chaque point faible | le rapport médical d'avant-match d'un joueur, avec une liste de points à surveiller en priorité|
| prefers-reduced-motion | Préférence système qui demande de réduire les animations | `matchMedia('(prefers-reduced-motion: reduce)')` |un survivant de Walking Dead qui demande d'éviter les éclairages stroboscopiques qui lui rappellent une explosion | un joueur sujet au vertige qui demande d'éviter les écrans géants à effets trop rapides|

## CE QU'IL FAUT RETENIR AU-DELÀ DU TABLEAU

L'accessibilité n'est pas un module "bonus" qu'on traite après coup : environ 1 personne sur 6 dans le monde vit avec une forme de handicap, et plusieurs pays (US, UE) en font une obligation légale réelle avec des vrais procès derrière. La traiter dès le départ coûte peu, la rattraper après coup coûte cher, exactement comme la dette technique du module 13_refactoring.

ARIA ne remplace jamais le HTML natif : `<button>` gère déjà focus, rôle et clavier gratuitement. ARIA sert seulement quand le HTML natif ne suffit pas, et un ARIA qui ment sur le comportement réel (un `role="dialog"` sans focus trap fonctionnel) est souvent pire que pas d'ARIA du tout.

Le clavier reste le test le plus simple et le plus révélateur : débranche ta souris cinq minutes, et la moitié des bugs d'accessibilité d'une page sautent aux yeux tout seuls. Le contraste se calcule, ne se devine jamais : un gris "qui a l'air lisible" peut échouer largement au ratio 4.5:1 minimum.

Sur l'audit, retiens cette vérité qui dérange : axe et Lighthouse détectent le balisage cassé, pas l'expérience cassée. Un focus trap qui ne se ferme jamais, un `aria-live` qui spam, un ordre de lecture absurde : aucun scanner automatique ne les voit. Seul un test manuel au clavier et au lecteur d'écran les révèle. Un score "100/100" sur un outil automatique ne veut jamais dire "accessible à 100%" : ça veut juste dire "le balisage de base est propre".

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
