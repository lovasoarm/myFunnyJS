---
stability: intemporel
---

# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~10 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## TOOLCHAIN GRIMOIRE

Le bestiaire complet de l'outillage qui entoure ton code. Chaque terme, chaque commande, chaque concept que tu dois avoir en tête sans avoir à les re-googler à chaque fois. Pas un résumé : la référence complète du module.

---

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Commit | Snapshot complet du projet à un instant T, pas juste un diff | `git commit -m "fix: rations mal calculées"` | photo polaroid d'un instant / sauvegarde dans un jeu vidéo |
| Branch | Pointeur mobile qui suit le dernier commit d'une lignée de travail | `git checkout -b feature/plan-fouille` | ligne temporelle parallèle / sentier qui se détache du chemin principal |
| Merge | Réunit deux branches en créant un commit avec deux parents, garde l'historique réel | `git merge feature/plan-fouille` | fusion de deux rivières / réunion de deux groupes de survivants |
| Rebase | Réécrit l'historique en rejouant des commits sur une nouvelle base, historique linéaire | `git rebase main` | réécrire un journal de bord proprement / refaire le trajet sur une carte à jour |
| Conflit | Git ne peut pas décider seul entre deux versions divergentes des mêmes lignes | `<<<<<<< HEAD ... =======` | deux survivants qui veulent la même ration / deux versions d'une même histoire |
| Bisect | Recherche dichotomique automatisée pour trouver le commit qui a introduit un bug | `git bisect start` puis `good`/`bad` | chercher un mot dans un dico en coupant en deux / piste de poker dichotomique |
| LSP | Protocole qui connecte un éditeur à un serveur d'analyse de langage (autocomplétion, erreurs) | (tourne en arrière-plan, pas de commande directe) | un interprète qui traduit en temps réel / un radio-opérateur qui transmet l'info |
| ESLint | Détecte les erreurs de logique et les mauvaises pratiques dans le code, avant exécution | `if (x = 5)` déclenche une alerte ESLint | un inspecteur qui repère le piège avant que tu marches dedans / un éclaireur |
| Prettier | Formate automatiquement le code selon des règles fixes, uniquement le style visuel | format à la sauvegarde via `editor.formatOnSave` | un uniforme imposé à tout le camp / un copiste qui recopie proprement |
| Breakpoint | Point d'arrêt qui suspend l'exécution pour inspecter l'état complet du programme | posé en cliquant à gauche d'une ligne dans VSCode | mettre le film en pause pour examiner une scène / un check-point d'arrêt obligatoire |
| Package manager | Outil qui résout, télécharge et organise les dépendances d'un projet | `npm install`, `pnpm install` | un magasin général qui gère le stock du camp / un intendant des fournitures |
| Lockfile | Fige les versions exactes de chaque dépendance pour garantir la reproductibilité | `package-lock.json`, `pnpm-lock.yaml` | un contrat signé qui figela commande précise / une recette avec quantités exactes, pas "un peu de" |
| Semver | Convention MAJOR.MINOR.PATCH qui communique l'impact d'un changement de version | `^4.18.0` accepte 4.x.x mais pas 5.0.0 | un code couleur de danger sur un colis / un système de feux tricolores pour les versions |
| pnpm store | Stockage centralisé unique sur la machine, partagé entre projets via liens symboliques | `~/.pnpm-store/` | un entrepôt central avec des raccourcis vers chaque camp / une bibliothèque municipale partagée |
| Bundler | Assemble plusieurs fichiers source en un livrable optimisé pour le navigateur | Vite, Webpack, esbuild, Rollup | empaqueter le matériel épars en un seul sac de raid / un chef qui assemble les ingrédients en un plat |
| Tree shaking | Élimine du bundle final le code exporté mais jamais réellement importé ailleurs | fonctionne seulement avec des imports/exports ESM statiques | secouer l'arbre pour faire tomber les feuilles mortes / trier les fournitures, jeter l'inutile |
| Graphe de dépendances | Structure que le bundler construit en partant d'un point d'entrée pour savoir quoi inclure | construit automatiquement à partir des `import` | une carte des routes entre les campements / un arbre généalogique du code |
| Container | Processus isolé qui partage le kernel de l'hôte, sans virtualiser un OS complet | `docker run mon-image` | une tente individuelle dans le même campement / un compartiment de train sur la même voie |
| Dockerfile | Recette qui décrit étape par étape comment construire une image Docker | `FROM node:20-alpine` puis `COPY`, `RUN`, `CMD` | une recette de cuisine écrite à suivre à la lettre / un plan de construction d'abri |
| Layer (couche) | Chaque instruction Dockerfile crée une couche mise en cache si rien n'a changé | l'ordre des `COPY`/`RUN` détermine ce qui reste en cache | des strates géologiques empilées / des étages d'un bâtiment construits un par un |
| Multi-stage build | Sépare l'environnement de construction de l'environnement d'exécution final | `FROM node:20-alpine AS builder` puis `COPY --from=builder` | partir en expédition léger après avoir tout préparé à l'atelier / ne garder que l'outil fini, pas l'établi |
| Docker Compose | Décrit et orchestre plusieurs containers liés (app, DB, cache) en un seul fichier déclaratif | `docker compose up` | le plan d'organisation de tout le campement en une fois / une partition pour plusieurs musiciens jouant ensemble |
| CI (intégration continue) | Vérifie automatiquement la santé du code (tests, lint, build) à chaque push | déclenché par `on: push` dans un workflow | la checklist avant chaque expédition, faite par un robot fiable / un contrôle qualité automatique |
| CD (déploiement continu) | Envoie automatiquement le code validé vers un environnement (staging, prod) | job `deploy` qui dépend du succès du job `test` | la livraison automatique une fois le colis inspecté / le convoi qui part seulement si tout est vérifié |
| Pipeline | Suite d'étapes automatisées (jobs, steps) qui s'exécutent à un déclencheur donné | fichier `.github/workflows/ci.yml` | une chaîne de montage qui valide chaque pièce avant assemblage / un parcours d'obstacles obligatoire |
| Matrix build | Fait tourner le même pipeline sur plusieurs configurations en parallèle (versions, OS) | `strategy: matrix: node-version: [18, 20, 22]` | tester un plan sur plusieurs terrains en même temps / un même exercice répété par plusieurs équipes |
| Secret (CI/CD) | Valeur sensible injectée à l'exécution, jamais stockée en clair dans le code | `${{ secrets.DEPLOY_TOKEN }}` | une clé planquée jamais affichée sur la porte / un mot de passe chuchoté, jamais écrit sur un mur |

---

## CE QUE LE GRIMOIRE NE TE DIT PAS EN UNE LIGNE

**Sur Git :** rebase jamais une branche que quelqu'un d'autre a déjà récupérée. C'est la règle qui évite le plus de chaos en équipe. Le reste (merge vs rebase en solo, bisect, résolution de conflits) c'est de la technique pure, mais cette règle-là c'est une question de respect du travail collectif.

**Sur l'éditeur :** le LSP fait le vrai travail, l'éditeur est juste l'interface. Si t'as l'autocomplétion qui rame, le problème vient presque toujours d'une config qui analyse trop de fichiers (genre `node_modules` inclus par erreur dans `tsconfig.json`), pas de l'éditeur lui-même.

**Sur les package managers :** le lockfile se committe, toujours, sans exception, même si "ça prend de la place" ou "ça pollue les diffs". C'est la seule garantie réelle de reproductibilité entre les machines de l'équipe et la prod.

**Sur les bundlers :** y a pas de meilleur bundler dans l'absolu. Vite pour une app moderne, Rollup pour une lib, esbuild quand tu veux juste de la vitesse brute en script, Webpack si t'es déjà dessus et que migrer coûte plus cher que ça rapporte.

**Sur Docker :** l'ordre des instructions dans un Dockerfile, c'est pas un détail stylistique, c'est ce qui détermine si ton build prend 30 secondes ou 10 minutes. Copie les fichiers de dépendances avant le code source, toujours.

**Sur CI/CD :** un pipeline vert qui n'est jamais regardé par personne, c'est un pipeline inutile. L'automatisation remplace pas la vigilance, elle la rend juste plus fiable et plus rapide à exercer.

---

## CE QUI BOUGERA, CE QUI RESTERA

```
BOUGERA (probablement) :
- le bundler dominant (Vite peut être détrôné comme Webpack l'a été)
- la syntaxe exacte des fichiers de config
- le nom de l'outil CI dominant (GitHub Actions aujourd'hui, autre chose un jour)

RESTERA :
- Git comme système de versionnage (aucun remplaçant sérieux à l'horizon)
- le besoin d'isoler un environnement d'exécution (le concept derrière Docker)
- le besoin d'automatiser la vérification avant mise en prod (le concept derrière CI/CD)
- semver comme convention de communication de version
```

Retiens les concepts, pas les commandes par coeur. Les commandes, tu les re-googles en 5 secondes. Comprendre POURQUOI chaque outil existe, ça, ça se re-google pas.

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.
