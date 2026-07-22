---
perennite: evolutif
stability: moderne
duree_de_vie_estimee: 3-5 ans
raison: WCAG et normes RGPD bougent, la posture inclusive reste.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

# POURQUOI CE MODULE MÉRITE TON TEMPS : ACCESSIBILITY (A11Y)


> **Périmètre**. Ce fichier chapeau ouvre le module `19_web_inclusive` en entier : accessibilité (a11y) ET internationalisation (i18n). Le sous-module `i18n/` a son propre `00_why_i18n.md` pour son angle spécifique.


> **Durée de vie : 5+ ans.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

> Ce module reutilise : web concepts (17_web_concepts), tests (06_testing).
Temps de lecture ~8 min

Ferme les yeux. Essaie de naviguer sur ton propre site avec juste le clavier, sans souris. Si tu n'arrives même pas à atteindre le bouton principal, ton app exclut directement les shinobis qui n'ont pas le choix de naviguer autrement : les personnes malvoyantes, les personnes avec un handicap moteur, les personnes qui utilisent un lecteur d'écran tous les jours.

L'accessibilité (a11y : raccourci pour "accessibility", 9 lettres entre le "a" et le "y") n'est pas une feature optionnelle qu'on ajoute si on a le temps. C'est la condition pour que ton jutsu fonctionne réellement pour tout le monde, pas juste pour les shinobis qui te ressemblent.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Une grande partie des sites web ne sont tout simplement pas utilisables par les personnes en situation de handicap : contraste insuffisant pour les malvoyants, navigation impossible au clavier pour les personnes avec un handicap moteur, structure illisible pour les lecteurs d'écran utilisés par les personnes aveugles. Ce n'est pas un détail marginal : ça représente une part significative de la population mondiale, et dans plusieurs pays, c'est devenu une obligation légale, pas juste une bonne pratique.

L'accessibilité résout ce problème en donnant des règles concrètes :
- les rôles et propriétés ARIA (Accessible Rich Internet Applications : attributs qui décrivent le rôle et l'état d'un élément) pour communiquer avec les lecteurs d'écran
- l'ordre de tabulation et la gestion du focus pour permettre une navigation complète au clavier
- le ratio de contraste WCAG (Web Content Accessibility Guidelines : recommandations internationales d'accessibilité) pour garantir que le texte reste lisible pour les malvoyants

Ce module te donne les outils pour qu'un site fonctionne pour quelqu'un qui ne voit pas l'écran, qui ne peut pas utiliser de souris, ou qui perçoit les couleurs différemment de toi.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le shinobi qui utilise un lecteur d'écran et qui tombe sur un site sans rôles ARIA corrects entend une liste de "bouton, bouton, lien" sans aucun contexte sur ce que chaque élément fait réellement. Il abandonne la page, parce qu'elle est littéralement inutilisable pour lui, alors qu'elle "marche" parfaitement pour un shinobi voyant avec une souris.

Le shinobi qui navigue uniquement au clavier (parce qu'il ne peut pas utiliser de souris, ou parce qu'il préfère ce mode) se retrouve bloqué dans un menu sans pouvoir en sortir, parce qu'aucun focus trap (piège de focus contrôlé) n'a été pensé, ou parce que l'ordre de tabulation saute des éléments importants dans un ordre incohérent.

Ces deux shinobis payent le prix direct d'un jutsu mal pensé. Mais le coût ne s'arrête pas à eux : l'entreprise qui les exclut s'expose en plus à un risque légal dans plusieurs juridictions, et perd une part non négligeable de shinobis potentiels qui ne peuvent simplement pas utiliser le jutsu.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
élément interactif sans rôle clair            --> ARIA roles   --> communication explicite avec lecteur d'écran
navigation impossible sans souris            --> keyboard nav  --> tab order et focus management
texte illisible sur fond coloré             --> contraste WCAG --> ratio vérifié et corrigé
modal qui piège le focus n'importe où           --> focus trap   --> navigation contenue et logique
mise à jour dynamique non annoncée (chat, notification)  --> aria-live    --> annonce automatique pour lecteur d'écran
```

L'accessibilité n'est jamais un module "à part" qu'on ajoute à la fin : elle traverse chaque composant interactif d'une interface, du simple bouton au formulaire complexe.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Le besoin est intemporel : il y a toujours eu et il y aura toujours des shinobis avec des besoins d'accessibilité différents. Ce qui évolue, c'est la rigueur de l'industrie et les obligations légales : l'accessibilité est passée d'un sujet de niche, souvent ignoré, à une exigence de plus en plus standard et parfois obligatoire selon le secteur et le pays.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, l'accessibilité était souvent traitée comme un audit de fin de projet, ajouté en urgence avant une mise en conformité légale, avec des correctifs superficiels. Aujourd'hui, la tendance forte est le "accessibility by design" : penser l'accessibilité dès la conception du composant, pas comme une couche ajoutée après coup.

Les outils ont aussi beaucoup progressé : avant, tester l'accessibilité demandait une expertise pointue et des outils spécialisés peu accessibles. Aujourd'hui, des outils comme axe ou Lighthouse intègrent des audits automatiques directement dans le workflow de développement, ce qui rend la détection des problèmes basiques beaucoup plus rapide, même si l'audit manuel avec un vrai lecteur d'écran reste indispensable pour les cas complexes.

---

## 6) NOYAU DUR DU MÉTIER ?

Pas dans les 6 blocs prioritaires explicitement listés, mais c'est un module qui s'intègre directement dans des projets réels : le mini-projet `08_trapsoul_radio` combine `14_typescript`, `17_web_concepts`, `19_web_inclusive`, et `19_web_inclusive/i18n` pour construire une plateforme qui doit fonctionner "au clavier, à la souris, aux lecteurs d'écran, et en plusieurs langues" : l'accessibilité n'est pas optionnelle dans ce genre de projet, c'est une condition de livraison.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Les technologies d'assistance vont continuer d'évoluer, mais le principe fondamental reste : un jutsu qui exclut une partie de ses shinobis potentiels est un jutsu incomplet. À mesure que les obligations légales se renforcent dans de plus en plus de pays, et que la population mondiale vieillit (avec une augmentation naturelle des besoins d'accessibilité visuelle et motrice), cette compétence devient un avantage de carrière de plus en plus net, pas un sujet de niche.

---

---

## CE MODULE DANS LE CURRICULUM

**Prérequis directs :** `17_web_concepts/02_browser_render_pipeline.md` (tu dois comprendre comment le DOM est construit et rendu avant de toucher ARIA et le focus management), `01_fundamentals/05_web_basics/01_dom_manipulation.md`.

**Ce qui en dépend :** `30_mini_projects/08_trapsoul_radio` (l'interface de la radio doit passer l'audit a11y complet avant de sortir : ARIA roles, navigation clavier, contraste WCAG). Sans ce module, le mini-projet ne peut pas être livré.

**Position dans la roadmap :** Module 19 sur 32. Il arrive après les web concepts (17_web_concepts) parce que l'accessibilité s'applique à une interface déjà structurée, pas au vide. Il précède directement l'i18n (sous-dossier `19_web_inclusive/i18n/` de ce même module, pas un module séparé) parce que les deux partagent la même philosophie : un jutsu qui ne fonctionne que pour certains n'est pas fini.

**Lien avec les autres modules :** `14_typescript` si tu types tes composants : les types ARIA (`AriaAttributes`, `AriaRole`) existent dans les types DOM TypeScript. `06_testing` : les tests d'accessibilité automatisés (axe-core, jest-axe) font partie des tests d'intégration.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

Un site qui marche "pour toi" peut être totalement inutilisable pour quelqu'un avec un besoin différent, et ce n'est jamais un détail marginal. Ça casse de trois façons sans cette discipline : lecteur d'écran qui ne comprend rien, navigation clavier bloquée, contraste illisible. Cette exigence se renforce dans le temps, jamais l'inverse.

Maintenant, ouvre `01_a11y_why_it_matters.md`. Et regarde enfin ton interface du point de vue de quelqu'un qui ne la voit pas comme toi.

> Ce module réutilise : les concepts web du module 17 (`17_web_concepts`), la testabilité du module 06 (`06_testing`).
