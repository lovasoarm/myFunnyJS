---
perennite: evolutif
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Communication, revue de code, mentorat : intemporels.
---
> **Statut de pérennité :** **intemporel** | évolutif | périssable
> Statut effectif de ce module : **intemporel**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **TL;DR (4 lignes)**
> - Coder seul en 2028 = coder mal en 2029. Ce module te donne le vocabulaire et les réflexes pour survivre en équipe (revue de code, feedback, PR, désaccord technique).
> - Ce n'est pas du "soft skill" : c'est de l'ingénierie sociale codifiée, mesurable, testable en entretien.
> - Tu peux lire vite (30 min les gros titres) OU tout (2h avec exercices).
> - Si tu es solo tech lead en 2028, ce module est ta différence entre "projet vivant" et "projet zombie".

> **CE MODULE RÉUTILISE** : revue de code et lecture de diff (04_debugging, 13_refactoring), communication écrite (technical writing vu en amont dans le curriculum). Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI TEAM CRAFT MÉRITE TON TEMPS

> **Durée de vie : 5+ ans.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Temps de lecture ~11 min

Le code solo c'est rare.
En production, t'as un dépôt partagé, des collègues qui lisent ta PR à 11h du mat avant leur café, un junior qui essaie de comprendre ce que tu as écrit il y a six mois, et un nouveau qui doit onboarder sans te déranger toutes les cinq minutes.

Si tu sais coder mais que tu sais pas travailler avec des humains : tu es un problème.
Pas un dev senior. Un problème.

---

## CE QUI CASSE SANS CE MODULE

Un codebase sans pratiques d'équipe ressemble à ça après 18 mois :

```
src/
├── utils.js     <-- 1800 lignes, personne sait ce qui est encore utilisé
├── utils2.js     <-- "j'avais peur de casser utils.js"
├── utils_old.js   <-- "au cas où"
├── utils_FINAL.js  <-- commenté sur git le vendredi avant les vacances
└── helperfunctions/ <-- le dossier du désespoir
```

Sans code review : les bugs passent en prod parce que personne regarde vraiment.
Sans ADR : dans six mois, personne sait pourquoi cette décision a été prise. On la refait, deux fois.
Sans technical writing : le README dit `npm start` mais pas quelle version de Node, pas les variables d'env, pas le setup de la DB. Le nouveau met trois jours à installer le projet.
Sans savoir naviguer un codebase : chaque nouveau dev est inutile pendant deux semaines, puis il abandonne ou il casse quelque chose.
Sans pair programming : les séniors accumulent de la dette de contexte dans leur tête, et quand ils partent, le projet perd 40% de sa mémoire interne.

---

## OÙ ÇA APPARAÎT EN PRODUCTION

**Code review :** chaque PR dans chaque équipe qui fait du code sérieux.
Chez les équipes matures : la review est pédagogique, pas juste un garde-fou.

**ADR (Architecture Decision Record : document de décision architecturale) :** les équipes qui survivent à la rotation de personnel les utilisent. Les autres recommencent les mêmes débats en boucle.

**Technical writing :** README, runbooks, docs d'API, post-mortems, playbooks de déploiement. Tout ça s'écrit : et si personne le fait, quelqu'un souffre à 2h du matin lors d'un incident.

**Navigation de codebase :** compétence invisible mais différenciante. Un senior qui rejoint une équipe est productif en 48h. Un dev qui ne sait pas naviguer est un boulet pendant 3 semaines.

**Pair programming :** Google, Stripe, Shopify l'utilisent stratégiquement (pas tout le temps, sur les bons problèmes) pour réduire les bugs critiques et accélérer le transfert de connaissance.

---

## POURQUOI CES PRATIQUES ET PAS D'AUTRES

Ces cinq pratiques répondent à un problème précis : **le coût de la coordination humaine dans un système logiciel**.

Alternatives qu'on pourrait envisager :

**Documentation exhaustive centralisée (type Confluence, Notion)**
Avantage : tout au même endroit.
Limite : devient vite un cimetière de pages périmées. La doc qui vit loin du code diverge du code. Les ADR et les README vivent dans le dépôt git : ils vieillissent avec le code, pas à côté.

**Réunions de synchronisation régulières à la place de la doc**
Avantage : rapide, humain, adaptatif.
Limite : la connaissance reste dans les têtes. Bus factor élevé. Chaque réunion refait le même travail.

**Revues uniquement via outils automatisés (linters, tests, CI)**
Avantage : scalable, rapide, objectif.
Limite : les outils automatisés ne captent pas les décisions d'architecture, les intentions, le contexte métier, et les edge cases non écrits.

Ce qu'on gagne avec ces pratiques :
- connaissance partagée, bus factor réduit
- décisions traçables et révisables
- onboarding rapide
- bugs détectés avant la prod

Ce qu'on sacrifie :
- vitesse à court terme (écrire un ADR ou une bonne review prend du temps)
- liberté de coder en mode solo sans rendre compte

Le compromis est assumé : investissement humain maintenant pour éviter la dette organisationnelle plus tard.

---

## MODERNE, LEGACY OU INTEMPOREL ?

**Code review :** intemporel. Elle existe depuis les années 70 dans les labs de recherche. L'outil change (diff papier → GitHub PR), le principe reste.

**ADR :** né dans les années 2000, popularisé dans les années 2010 par Michael Nygard. Format stabilisé, pratique éprouvée.

**Technical writing :** aussi vieux que le développement logiciel. Ce qui a changé : les formats (man pages → wikis → markdown dans le dépôt).

**Navigation de codebase :** pratique tacite qui existait avant d'avoir un nom. Les outils ont évolué (grep → LSP, Language Server Protocol → IA) mais la compétence reste.

**Pair programming :** popularisé par XP (eXtreme Programming) dans les années 90-2000. Moins systématique aujourd'hui, mais toujours utilisé sur les parties critiques. L'IA modifie légèrement la dynamique (dev + IA comme "copilote") mais ne remplace pas le pair humain sur les décisions complexes.

Ce qui a changé avec le temps :
- les outils de collaboration (GitHub, GitLab, Linear ont transformé la review)
- la montée du remote a forcé une meilleure documentation écrite
- l'IA génère du code plus vite, ce qui rend la review et la validation encore plus importantes

Ce qui ne bougera probablement pas :
- le besoin de tracer les décisions
- le besoin de partager la connaissance dans une équipe
- le coût humain des systèmes mal documentés

---

## NOYAU DUR OU PÉRIPHÉRIQUE ?

Team craft n'est pas dans le noyau dur technique du curriculum (données, algos, async, TypeScript).
Mais c'est dans le noyau dur **professionnel**.

Un dev qui maîtrise les structures de données mais qui produit des PRs illisibles, des codebases sans doc, et des décisions non tracées : il est junior à vie dans n'importe quelle équipe sérieuse.

Ce module est **indispensable avant d'entrer dans une équipe prod**, peu importe le niveau technique.

---

## À QUEL MOMENT LE MAÎTRISER

Ce module se place en fin de curriculum pour une raison : il présuppose que tu as déjà du code à reviewer, à documenter, et à naviguer.

```
modules précédents qui rendent ce module concret
-------------------------------------------------
13_refactoring    --> tu sais ce qui mérite une review sérieuse
02_problem_solving  --> tu sais pourquoi les décisions d'archi comptent
14_typescript     --> tu as des types à documenter et des ADR à écrire
15_runtime_env    --> tu as un environnement à configurer et à documenter
21_api_craft     --> tu as des endpoints à documenter dans un README
```

Si tu lis ce module au début du curriculum : tu comprends les concepts, mais ils restent abstraits. La douleur qu'ils résolvent, tu ne l'as pas encore vécue.

---

## PRÉREQUIS

Pas de prérequis technique bloquant.
Mais ce module est plus utile si tu as déjà :
- écrit du code que quelqu'un d'autre a dû lire
- rejoint un projet existant sans doc
- pris une décision technique que tu ne sais plus justifier six mois plus tard
- cassé quelque chose en pensant "comprendre" un codebase inconnu

---

## CE QUI DEVIENT PLUS SIMPLE APRÈS CE MODULE

**26_observability :** un runbook bien écrit s'appuie sur les mêmes réflexes que le technical writing. Les structured logs sont de la documentation machine.

**29_mini_projets :** chaque mini-projet a un `README.md`, un `ADR/`, un `POSTMORTEM.md`, un `TDD_JOURNAL.md`. Ce module t'apprend à remplir ces fichiers avec du sens, pas avec du remplissage.

**Tout travail en équipe :** la capacité à communiquer sur le code accélère tout le reste.

---

## ERREURS CLASSIQUES DES DÉBUTANTS

**"Je commenterai le code plus tard"**
Plus tard n'arrive jamais. Et quand il arrive, t'as oublié pourquoi tu as fait ce choix.

**"Mon code est auto-documenté"**
Le code dit ce qu'il fait. Il ne dit jamais pourquoi. Et c'est le pourquoi qui manque toujours.

**"Les ADR c'est pour les grandes équipes"**
Une équipe de deux personnes peut avoir un bus factor à 1. Les ADR s'écrivent en 20 minutes. La réunion pour reconstruire le contexte perdu prend deux heures.

**"LGTM, j'ai pas le temps de vraiment lire"**
Ce "pas le temps" produit exactement le type de bug qui prend trois jours à déboguer en prod.

**"Le pair programming c'est deux fois moins productif"**
C'est deux fois moins de code écrit par heure. C'est aussi cinq fois moins de bugs critiques en prod et deux fois moins de temps de review. Le calcul n'est pas celui qu'on croit.

**"Je vais lire tout le code avant de poser une question"**
Lire tout le code d'un projet de 80 000 lignes avant de poser une question : c'est une semaine perdue. La bonne approche : lire le terrain, suivre un flux, poser une question précise.

---

## IDÉES REÇUES

**"Team craft c'est des soft skills, pas de la vraie ingénierie"**
Faux. Une review qui détecte une injection SQL, un ADR qui évite de refaire un débat architectural perdu, un runbook qui réduit un incident de 2h à 20 minutes : c'est de l'ingénierie avec un ROI mesurable.

**"La doc c'est pour ceux qui codent pas vite"**
Les équipes qui documentent le mieux sont souvent les plus rapides à itérer, pas les plus lentes. La doc réduit la friction de coordination.

**"Le pair programming c'est pour les débutants"**
Les équipes de trading algorithmique, les équipes de sécurité, et les équipes qui buildent des compilateurs l'utilisent sur leurs problèmes les plus critiques. Pas parce que les devs sont débutants.

**"Git blame c'est pour trouver qui punir"**
Git blame c'est pour trouver qui a le contexte. La personne qui a écrit ce code sait pourquoi. Elle est ta meilleure ressource, pas ta cible.

---

## CE QUI VA ÉVOLUER, CE QUI VA RESTER

**Ce qui va évoluer :**
- les outils de review (GitHub Copilot dans les PR, review assistée par IA)
- les formats de documentation (markdown vers des formats plus interactifs)
- la dynamique du pair (dev + IA de plus en plus comme pattern de travail)

**Ce qui ne bougera pas :**
- le besoin de tracer les décisions pour les équipes qui durent
- le coût des systèmes mal documentés
- la valeur du regard extérieur sur du code (qu'il vienne d'un humain ou d'un outil)
- le fait que la connaissance dans une seule tête est un risque

---

## RÉSUMÉ : POURQUOI UN DEV SÉRIEUX INVESTIT SON TEMPS ICI

Parce que les compétences techniques te permettent de construire quelque chose.
Les compétences de team craft te permettent de construire quelque chose **qui dure**, **avec d'autres**, **sans t'effondrer quand quelqu'un part**.

En 2026 : coder vite n'est plus le différenciateur.
Ce qui différencie : travailler dans un système complexe, avec des humains, sur la durée.

Team craft n'est pas un module de soft skills.
C'est un module d'ingénierie collaborative avec un ROI direct sur la qualité du code produit.

> Ce module réutilise : le refactoring du module 13 (`13_refactoring`), les tests du module 06 (`06_testing`).
