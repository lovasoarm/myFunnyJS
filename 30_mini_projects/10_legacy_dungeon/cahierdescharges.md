---
stability: intemporel
---

# CAHIER DES CHARGES : LEGACY DUNGEON

Temps de lecture ~15 min

## PRÉREQUIS

```
Node.js    : v20+
npm      : v10+ (pas obligatoire d'installer les deps du repo cloné)
Variables env : aucune
Outils externes: git

# tu ne construis rien depuis zéro ici : tu clones, tu lis, tu corriges un point précis
```

Pas de `npm install` obligatoire sur le dépôt cloné. Ce projet, c'est lire, pas exécuter en continu. Tu lances `npm test` une fois pour ton bugfix, pas pour faire tourner toute l'app.

---

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Les 9 projets précédents, t'as construit depuis zéro. Page blanche, tes décisions, ton architecture. Celui-là, c'est l'inverse total : tu débarques sur du code qui existe déjà, écrit par des inconnus, jamais pensé pour t'apprendre quoi que ce soit. Pas de README pédagogique. Pas d'ADR qui t'explique le pourquoi. Pas de garantie que la doc dise la vérité sur l'architecture réelle.

C'est ton premier jour dans une vraie équipe. Le code est déjà là. Personne te fait la visite guidée.

Ce que tu dois produire à la fin :

```
[CARTOGRAPHIE] 2h chrono, MAP.md produit
 - point d'entrée réel localisé
 - 6 fichiers où vit la vraie logique
 - diagramme ASCII du flux principal
 - liste honnête de ce qui reste flou

[BUGFIX] 1 bug imposé, corrigé
 - test qui échouait avant : ROUGE
 - test qui passe après : VERT
 - cause réelle expliquée, pas juste constatée

[ADR RÉTROSPECTIVE] 1 décision d'architecture du repo, déduite
 - indices : date des commits, contraintes visibles, absence de TS à l'époque
 - "la prendrais-tu pareil en 2026 ?"
```

Trois livrables, zéro ligne de feature à construire toi-même.

## POURQUOI CE PROJET EXISTE

`27_team_craft/04_navigate_codebase.md` t'a donné la méthode. Mais une méthode jamais appliquée sur du vrai terrain reste une théorie. Voilà ce que ce projet teste précisément :

- **lire du code que tu n'as pas écrit, sous contrainte de temps** : en entreprise, personne ne te donne deux semaines confortables pour "te mettre à niveau". Le chrono de 2h n'est pas une punition, c'est une simulation honnête.
- **distinguer ce que tu comprends de ce que tu crois comprendre** : un repo pédagogique te pardonne les approximations. Un repo réel, non. Si ton MAP.md affirme un truc faux, ton bugfix part sur de mauvaises bases.
- **déduire une décision d'architecture sans avoir accès à son auteur** : en vrai, le dev qui a pris cette décision a peut-être quitté l'entreprise depuis 3 ans. Tu dois reconstruire le contexte à partir d'indices, pas demander.
- **corriger sans tout casser** : la contrainte "aucune ligne touchée en dehors du strict nécessaire" t'entraîne à résister à l'envie de refactorer un code qui te débecte. Pas aujourd'hui. Pas ton rôle aujourd'hui.

## LE MODULE QUE CE PROJET COUVRE, ET OÙ ÇA SE VOIT

### `27_team_craft` : coder avec des humains, pas juste avec une machine

**Où ça se voit** : intégralement. La méthode de `04_navigate_codebase.md` (les 5 questions avant d'ouvrir un fichier, lire l'arborescence comme une carte, suivre le flux d'une requête, git log comme source d'info, trouver les points d'entrée) s'applique du début à la fin sur MAP.md. L'ADR rétrospective applique `02_adr_writing.md`, mais à l'envers : tu déduis au lieu d'écrire en connaissance de cause. POSTMORTEM.md et MAP.md mobilisent `03_technical_writing.md` : écrire clair, pour un autre dev qui n'a pas ton contexte en tête.

**Pourquoi c'est nécessaire ici** : ce mini-projet existe précisément parce que `04_navigate_codebase.md` se termine sur un avertissement : ses propres exercices (EXO 1, 2, 3) tournent sur des mini-projets de ce curriculum, donc sur du code pensé pour être compris. Ce n'est pas un vrai test. `10_legacy_dungeon` est la vraie épreuve.

### Modules mobilisés en lecture, sans être le cœur du projet

```
04_debugging --> lire une stack trace dans un contexte inconnu, sans le confort
                  d'un code que tu as toi-même écrit
05_error_handling       --> comprendre une stratégie de gestion d'erreur que tu n'as pas
                  choisie, parfois incohérente avec ce que t'as appris ici
13_refactoring/03_code_smells --> reconnaître un smell sans le corriger : la contrainte du
                  projet t'interdit explicitement le refactoring "pendant que t'y es"
06_testing          --> lire des tests existants comme documentation du comportement
                  attendu, surtout quand le code source seul ne suffit pas
```

## CRITÈRE DE CHOIX DU DÉPÔT : LES 4 RÈGLES

Le dépôt que tu choisis doit cocher les 4 critères. Si un seul critère manque, l'exercice perd sa valeur : trop petit, tu finis en 20 minutes sans vraie friction. Trop gros ou trop bien documenté, tu dépasses le chrono sans avoir produit un MAP.md honnête.

```
CRITÈRE 1 : TAILLE MESURABLE, NI MICRO NI MONSTRE
 --> entre 3 000 et 20 000 lignes de JS/TS hors node_modules
 --> mesure-le toi-même, ne fais confiance à personne :
   find . -name "*.js" -o -name "*.ts" | grep -v node_modules | xargs wc -l | tail -1
 --> en dessous de 3 000 lignes : pas assez de surface pour une vraie cartographie
 --> au-dessus de 20 000 lignes : tu ne couvres rien en 2h, tu papillonnes

CRITÈRE 2 : DOCUMENTATION VOLONTAIREMENT LÉGÈRE OU ABSENTE
 --> README minimal (installation basique, pas d'architecture expliquée), ou inexistant
 --> aucun fichier ADR/, aucun docs/architecture.md
 --> si le repo a une doc d'architecture complète : choisis-en un autre, ça fausse l'exercice

CRITÈRE 3 : ASSEZ ÂGÉ POUR QUE L'ADR RÉTROSPECTIVE AIT UN SENS
 --> premiers commits significatifs datant d'au moins 3-4 ans
 --> permet de chercher des indices temporels : absence de TS à l'époque, conventions
   pré-async/await, dépendances aujourd'hui dépréciées
 --> un repo créé il y a 6 mois ne donne aucun recul à déduire

CRITÈRE 4 : UN BUG TROUVABLE ET CORRIGEABLE EN PEU DE LIGNES
 --> soit une issue ouverte non résolue, simple à reproduire
 --> soit un bug que TU repères toi-même en lisant (un edge case mal géré, une
   condition `if (!value)` qui rate `"0"` ou `0`, une coercition douteuse)
 --> la correction doit tenir en 1 à 5 lignes : ce projet n'est pas un projet de
   refactoring, c'est un projet de précision chirurgicale
```

### 3 CANDIDATS DE DÉPART (pas une liste fermée : des points de départ)

Ces 3 suggestions cochent a priori les 4 critères au moment où ce cahier des charges est écrit. Un repo OSS évolue : sa doc peut s'étoffer, son code peut être refactoré, une dépendance peut casser. **Vérifie toi-même les 4 critères sur le repo que tu choisis avant de lancer le chrono**, que ce soit un de ces 3-là ou un autre que tu as trouvé toi-même.

```
CANDIDAT A : un petit parser ou un petit moteur de templating JS, abandonné ou
       peu maintenu, trouvé via GitHub en filtrant par taille et par date
       du dernier commit significatif > 3 ans
       --> profil recherché : utilitaire pur, pas de framework autour,
         logique métier concentrée dans peu de fichiers

CANDIDAT B : un petit serveur HTTP fait main ou une petite CLI Node, écrit par
       un seul auteur (pas une org avec process de contribution lourd),
       avec un README qui dit "ça marche, voilà comment lancer" et rien
       de plus
       --> profil recherché : assez de logique pour avoir un vrai flux
         de requête à tracer, comme dans `04_navigate_codebase.md`

CANDIDAT C : un plugin ou une extension pour un outil plus gros (un plugin
       ESLint, un plugin webpack ancienne génération, un middleware
       Express tiers peu connu), avec une API publique claire mais une
       implémentation interne non documentée
       --> profil recherché : structure imposée par l'écosystème hôte
         (donc moins chaotique qu'un repo perso), mais logique interne
         opaque
```

**Comment chercher concrètement** : GitHub, filtre par langage (JavaScript ou TypeScript), tri par "least recently updated" sur des repos avec un nombre d'étoiles modeste (ni 0 ni 50k). Un repo à 50k étoiles a une doc soignée par construction : ça casse le Critère 2. Un repo à 0 étoile et 2 commits n'a probablement pas assez de substance : ça casse le Critère 1.

Documente ton choix final dans POSTMORTEM.md, section "Décisions prises" : nom, URL, et pourquoi celui-là plutôt qu'un autre.

## LES 3 ÉTAPES, EN DÉTAIL

### ÉTAPE 0 : CHOISIR ET CLONER (hors chrono)

```bash
git clone <url-du-repo-choisi> dungeon/
cd dungeon
find . -name "*.js" -o -name "*.ts" | grep -v node_modules | xargs wc -l | tail -1
```

Tu mesures avant de juger. Pas d'estimation à l'œil. Cette étape n'est pas chronométrée : prends le temps qu'il faut pour valider les 4 critères avant de te lancer.

### ÉTAPE 1 : CARTOGRAPHIE (2H CHRONO, NON-NÉGOCIABLE)

Le chrono démarre quand tu ouvres le premier fichier. Applique la méthode de `04_navigate_codebase.md` dans l'ordre :

```
1. Les 5 questions avant d'ouvrir un fichier
  (ce que le projet fait, architecture haut niveau, dépendances qui comptent,
  comment le lancer, où sont les tests)

2. Lire l'arborescence comme une carte
  (identifier les couches, repérer un éventuel "cimetière" type utils/ à 40 fichiers)

3. Suivre le flux d'une opération de bout en bout
  (depuis le point d'entrée jusqu'à la logique métier réelle)

4. git log comme source d'info
  (git log --oneline -20, git blame sur les fichiers centraux, dater les
  décisions visibles)

5. Trouver les points d'entrée critiques
```

À 2h pile, tu t'arrêtes. Même si tu n'as pas fini. Le but n'est pas la complétude, c'est la simulation réaliste d'un vrai premier jour sous pression.

**Livrable** : `MAP.md`, à créer toi-même, contenant :

- le point d'entrée réel du projet
- les 6 fichiers où vit la vraie logique (pas 6 fichiers au hasard : les 6 qui comptent)
- un diagramme ASCII du flux principal
- une liste honnête de ce qui reste flou, sans honte

### ÉTAPE 2 : BUGFIX (PAS DE LIMITE DE TEMPS STRICTE, MAIS RESTE CHIRURGICAL)

Une fois la cartographie posée, identifie UN bug (issue existante ou repéré par toi) et corrige-le en suivant le TDD classique :

```
1. écrire un test qui REPRODUIT le bug : il doit échouer (ROUGE) sur le code actuel
2. corriger le code, minimalement
3. relancer le test : il doit passer (VERT)
4. vérifier qu'aucune autre ligne du repo n'a été touchée en dehors du nécessaire
```

**Livrable** : `BUGFIX.md`, à créer toi-même, contenant le diff avant/après, la preuve ROUGE puis VERT, et l'explication de la cause réelle (pas juste "j'ai changé ça et ça marche" : pourquoi ça plantait, précisément).

Trace aussi cette étape dans `TDD_JOURNAL.md` (partie 2), déjà fourni en gabarit dans ce dossier.

### ÉTAPE 3 : ADR RÉTROSPECTIVE

Choisis une décision d'architecture visible dans le code (pourquoi telle gestion d'erreur, pourquoi cette structure de dossiers, pourquoi cette dépendance plutôt qu'une autre) et déduis son contexte à partir d'indices, pas d'une explication trouvée toute faite.

**Livrable** : `ADR/ADR-001_pourquoi_ce_code_est_ce_quil_est.md`, gabarit déjà fourni dans ce dossier avec un exemple rempli (sur Express) pour calibrer le niveau attendu.

## ESTIMATION DE TEMPS ET ZONES DE RÉSISTANCE

**Durée totale estimée** : 5 à 8 heures de travail réel, réparties sur plusieurs sessions si besoin (sauf l'Étape 1, qui doit rester un bloc de 2h continu pour garder sa valeur de simulation).

| Étape                       | Durée estimée | Zone de résistance                                                                                     |
| --------------------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| Étape 0 : choisir le repo   | 30-45 min     | Moyenne : la tentation de prendre un repo trop confortable                                             |
| Étape 1 : cartographie      | 2h pile       | **Haute** : accepter de s'arrêter même incomplet                                                       |
| Étape 2 : bugfix            | 1h30-3h       | Haute : trouver un bug calibré, ni trivial ni ingérable                                                |
| Étape 3 : ADR rétrospective | 1h-1h30       | Moyenne : résister à l'envie d'inventer un contexte plausible plutôt que de le déduire d'indices réels |
| POSTMORTEM.md               | 30-45 min     | Faible, mais demande de l'honnêteté, pas de la performance                                             |

Le point de résistance majeur est l'Étape 1. La tentation la plus forte : continuer "encore 10 minutes" pour finir de comprendre un point précis. Résiste. Le respect du chrono fait partie de l'exercice autant que le contenu du MAP.md.

## CAS LIMITES À NE PAS IGNORER

1. **Si tu ne trouves aucun bug clair en 2h de cartographie** : ce n'est pas un échec. Documente-le dans POSTMORTEM.md, puis donne-toi 30 minutes supplémentaires hors chrono spécifiquement pour chercher un candidat de bug, en t'appuyant sur les issues GitHub ouvertes si le repo en a.
2. **Si le repo s'avère ne pas avoir de tests du tout** : ton ÉTAPE 2 doit alors créer le minimum de tooling nécessaire pour exécuter UN test (un `package.json` avec Jest ajouté si besoin), documenté comme tel dans BUGFIX.md. Ce n'est pas une ligne touchée "en dehors du nécessaire" : c'est un prérequis pour respecter le TDD de l'Étape 2.
3. **Si en cours de cartographie tu réalises que le repo ne coche en fait pas les 4 critères** (trop documenté, trop petit, trop récent) : note-le, change de repo, et documente ce changement dans POSTMORTEM.md section "Décisions tenues ou abandonnées". Ce n'est pas une perte de temps, c'est une compétence réelle : savoir abandonner une mauvaise piste tôt plutôt que de s'entêter.

## LES RÈGLES QUE TU NE DOIS JAMAIS CASSER

1. **L'ÉTAPE 1 est chronométrée à 2h, sans exception.** Dépasser casse l'objectif pédagogique : sentir la pression d'un vrai premier jour, pas explorer en confort.
2. **Un seul bug corrigé, avec preuve avant/après.** Trois bugs bâclés valent moins qu'un bug propre et bien expliqué.
3. **Aucune ligne du repo cloné touchée en dehors du strict nécessaire au bugfix.** Pas de refactoring "pendant que t'y es", même si tu repères 10 autres trucs qui te débectent.
4. **L'ADR reconstruit le pourquoi de quelqu'un d'autre, pas tes préférences.** "J'aurais fait autrement" sans contexte déduit d'indices réels (commits, dates, conventions) = exercice raté.
5. **Le POSTMORTEM documente au moins un vrai moment de confusion.** Zéro moment perdu = soit le repo choisi était trop simple, soit l'honnêteté du document est insuffisante.

## CE QUE TU NE FAIS PAS DANS CE PROJET

- Pas de refactoring du repo cloné, même partiel, même "juste pour rendre ça plus lisible".
- Pas de pull request réelle vers le repo OSS choisi (ce n'est pas l'objet ici, même si rien ne t'empêche de le faire après coup, de ton propre chef, en dehors du cadre de ce mini-projet).
- Pas de correction de plusieurs bugs : un seul, mais bien fait.
- Pas d'installation complète des dépendances du repo cloné si ce n'est pas strictement nécessaire pour faire tourner le test de ton bugfix.

## LES DOCUMENTS DE CE PROJET

```
cahierdescharges.md  --> ce fichier : spécification complète
README.md       --> pitch et structure de ce que tu produis
TDD_JOURNAL.md     --> gabarit fourni : journal d'investigation (partie 1)
              + TDD classique du bugfix (partie 2)
POSTMORTEM.md      --> gabarit fourni : ce qui a coincé, ce qui a été appris
ADR/          --> gabarit fourni avec exemple rempli (Express) :
              décision d'architecture du repo cloné, déduite après coup
MAP.md         --> À CRÉER TOI-MÊME (Étape 1)
BUGFIX.md        --> À CRÉER TOI-MÊME (Étape 2)
```

## QUAND EST-CE QUE LE PROJET EST VRAIMENT FINI

```
[ ] le repo choisi coche les 4 critères, vérifiés et documentés (pas supposés)
[ ] MAP.md existe : point d'entrée réel, 6 fichiers clés, diagramme ASCII, zones floues listées
[ ] l'Étape 1 a respecté le chrono de 2h (dépassement noté et justifié si applicable)
[ ] BUGFIX.md existe : preuve ROUGE puis VERT, cause réelle expliquée
[ ] aucune ligne du repo cloné modifiée en dehors du strict nécessaire au bugfix
[ ] ADR/ADR-001 rempli : décision déduite d'indices réels, pas inventée
[ ] ADR/ADR-001 répond à "la prendrais-tu pareil en 2026 ?" avec une vraie justification
[ ] TDD_JOURNAL.md trace l'ordre réel de l'investigation, hésitations comprises
[ ] POSTMORTEM.md documente au moins un vrai moment de confusion, avec résolution ou non
[ ] POSTMORTEM.md liste honnêtement ce qui reste flou même après le projet
```

## SÉCURITÉ (gate obligatoire)

Un projet qui marche mais qui est vulnérable n'est pas fini. Traite ces exigences OWASP contextuelles avant de livrer.

- Audit de dépendances (OWASP A06) : `npm audit` documenté et vulnérabilités traitées.
- Secrets (OWASP A07) : aucun secret committé dans le code repris.

Pour chaque exigence : documente dans `SECURITY.md` la menace, ta contre-mesure et le test qui la prouve. Le `verification_pack` de ce projet contient un test de sécurité qui doit passer.

---

## Securite (gate obligatoire, Partie I)

- **Exigence 1** : aucune donnee sensible (secret, token, cle) dans le code source ni dans les logs. Utiliser variables d'environnement + `.env.example` versionne (jamais `.env`).
- **Exigence 2** : toute entree externe (STDIN, fichier, HTTP, CLI) est validee AVANT usage (type, longueur, format). En cas d'invalidite : erreur explicite, jamais un crash silencieux.

Un test dans `node solution.js` (auto-verif ecrite par toi) doit prouver ces deux points (ex : lancer le programme avec une entree malformee et verifier qu'il refuse proprement).

## RÔLE DES DOSSIERS (ne skippe pas)

- `src/` : **tu remplis toi-même**. Le dossier est vide exprès : c'est ton livrable. Aucun code fourni.
- `tests/` : **TDD strict : tu écris le test AVANT le code de `src/`**. Rouge → vert → refactor. Si `tests/` est vide en fin de projet, ce projet ne compte pas dans ton portfolio.
- `ADR/` : **au moins 1 décision architecturale documentée** (choix de structure, trade-off, alternative rejetée + pourquoi). Format : Contexte / Décision / Conséquences.
- `POSTMORTEM.md` : **rédigé à la fin, honnête**. Ce qui a foiré, combien de temps t'a coûté chaque blocage, ce que tu referais autrement.
- `TDD_JOURNAL.md` : trace vivante du cycle rouge/vert/refactor.

**Un CTO qui feuillette ton portfolio regarde `src/` ET `tests/` ET `ADR/`. Un `src/` vide sans `tests/` associé = projet non fini, quelle que soit la qualité du reste.**
