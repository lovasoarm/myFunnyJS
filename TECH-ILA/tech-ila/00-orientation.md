---
statut: revu
last_reviewed: 2026-08
proprietaire: mainteneur TECH-ILA
revue: trimestrielle
companion: MyFunnyJS
---

[← Sommaire TECH-ILA](../README.md)

> **Tu viens de** : l'introduction du [README](../README.md).
> **Tu dois déjà savoir** : rien de technique : cette section pose la méthode de lecture.
> **Ensuite** : [Niveau 1 : Socle professionnel](./01-niveau-1-socle.md)

# Orientation : lire, classer, ordonner (sections 0 à 3)

---

## 0 : Comment lire ce document

Trois usages. Choisis le tien.

**Usage 1 : parcours.** Tu avances dans MyFunnyJS. Après chaque module, tu ouvres la section TECH-ILA correspondante ([section 10](./07-cartes-myfunnyjs.md#10--carte-myfunnyjs--technologies-module-par-module)) et tu appliques le concept dans une techno réelle.

**Usage 2 : dépannage.** Tu es en galère sur React ou NestJS. Tu ouvres la [carte inverse](./07-cartes-myfunnyjs.md#11--carte-inverse--technologie--fichiers-myfunnyjs), tu retrouves le fichier MyFunnyJS qui explique le mécanisme sous-jacent, tu relis, tu reviens. En situation d'incident réel (prod qui casse), tu n'ouvres pas ce document : tu ouvres le [mode urgence](./09-mode-urgence.md).

**Usage 3 : décision.** Tu dois choisir un outil. Tu ouvres la fiche techno, tu lis "Quand ne pas la choisir" et "Alternatives", tu écris un ADR (`27_team_craft/02_adr_writing.md`).

Le pipeline obligatoire, valable pour chaque techno de ce document :

```text
Fondamentaux MyFunnyJS
        ↓
Compréhension du mécanisme
        ↓
Technologie ou framework
        ↓
Exercice ciblé
        ↓
Mini-projet si nécessaire
        ↓
Décision technique justifiée
```

**La règle de rattachement.** Toute techno à laquelle une section est consacrée est reliée à un mécanisme MyFunnyJS nommé, avec un lien relatif vers le fichier exact.

Un chemin MyFunnyJS s'écrit de deux façons, jamais au hasard :

- **ANCRAGE** (lien cliquable obligatoire) : la première fois qu'une fiche techno relie son mécanisme. Une fiche = au moins un ancrage cliquable.
- **RAPPEL** (backticks, non cliquable) : toute mention ultérieure du même chemin dans la même fiche, ou une mention de dossier générique (`22_security/`).

Un backtick est donc un rappel volontaire, jamais un oubli. Et un chemin d'annexe s'écrit TOUJOURS préfixé de `31_annexes/` : les sous-dossiers d'annexes ont leur propre numérotation, indépendante de celle des 32 modules.
 Les technos seulement citées : dans un tableau d'alternatives ou en passant (Fastify, Hono, Koa, Deno, Bun, Go, Terraform, Jaeger, Grafana, Datadog, Sentry, Renovate, clinic.js, autocannon…) : ne portent pas cet ancrage complet : elles portent au minimum leur tag entre parenthèses et une colonne « ce que ça change côté mécanisme » dans le tableau où elles apparaissent. Si une fiche complète n'a ni l'un ni l'autre, c'est un bug du document, pas de toi.

**Jargon.** Chaque terme technique est expliqué à sa première apparition, entre parenthèses ou en une ligne. Si un mot te bloque, il manque une explication : signale-le.

### Lire une doc officielle en 6 réflexes

Ce document te dit de garder « la doc ouverte, jamais par cœur ». Encore faut-il savoir la lire vite et sans te faire avoir.

1. **Vérifie la version en premier.** Chaque doc a un sélecteur de version ou une mention en tête de page. Une doc sans version visible est suspecte.
2. **Cherche le changelog** avant de lire le guide. Il te dit ce qui a bougé récemment : donc ce qui est probablement périssable.
3. **Lis les notes de migration** si tu passes d'une version à l'autre. C'est là que sont les ruptures, pas dans le guide de démarrage.
4. **Distingue guide marketing et référence.** La page d'accueil vend l'outil ; la référence API décrit son comportement réel. Va toujours vérifier dans la seconde.
5. **Regarde la date de la page.** Une doc communautaire (blog, Stack Overflow, tutoriel) sans date est à traiter comme périmée par défaut.
6. **Cherche un exemple exécutable**, pas un extrait tronqué. Si tu ne peux pas le coller et le lancer tel quel, tu n'as pas encore compris ce qu'il fait.

---

## 1 : Philosophie : le geste d'ingénieur

Les outils changent. Les frameworks tournent. Les modes passent. Le geste reste :

```text
Comprendre le contexte
        ↓
Clarifier le problème
        ↓
Planifier
        ↓
Choisir une stratégie
        ↓
Choisir les bons outils
        ↓
Construire la solution
        ↓
Tester et observer
        ↓
Résoudre le problème réel
        ↓
Expliquer et défendre la décision
```

TECH-ILA ne forme pas quelqu'un qui récite React, Next.js, NestJS, Spring Boot, Python ou .NET.

Il forme quelqu'un capable de : comprendre un problème, le découper, poser les bonnes questions, choisir une stratégie, sélectionner les bons outils, construire, tester, observer, diagnostiquer, sécuriser, expliquer, remplacer une techno, et transférer son raisonnement vers un autre écosystème.

**La technologie est le terrain d'entraînement. La compétence finale, c'est la résolution de problèmes.**

### Le piège du CV-liste

Quinze frameworks connus en surface valent moins qu'un écosystème cohérent maîtrisé en profondeur. Pourquoi ? Parce qu'un recruteur technique ne teste pas ta mémoire, il teste ta capacité à :

- lire du code que tu n'as pas écrit ;
- expliquer pourquoi tu as choisi X plutôt que Y ;
- décrire comment ton système casse ;
- montrer une trace, un test, une métrique.

Aucune de ces quatre choses ne s'apprend en collectionnant des noms.

### Le contrat de ce document

- On ne te promet pas un job.
- On ne te dit pas qu'une techno est "la meilleure".
- On te dit ce qu'elle coûte, ce qu'elle masque, et quand la refuser.

---

## 2 : Système de classification

Chaque techno de ce document porte un tag. Le tag décide de ton investissement.

| Tag                 | Définition                                                            | Investissement                          | Exemple                                                        |
| ------------------- | --------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| **NOYAU DURABLE**   | Concept dont les principes survivront à tout produit qui l'implémente | Profond, mémorisé, pratiqué             | HTTP, SQL, Git, modèle relationnel, Linux, stratégies de rendu |
| **PROFESSIONNELLE** | Largement utilisée aujourd'hui, dans plusieurs contextes              | Sérieux, jusqu'à l'autonomie            | React, Node.js, TypeScript, Docker, PostgreSQL                 |
| **CONTEXTUELLE**    | Utile selon secteur, équipe, architecture                             | À la demande, quand le contexte l'exige | GraphQL, Next.js, Spring Boot, .NET, MongoDB, Kafka            |
| **PÉRISSABLE**      | Syntaxe, API, config susceptible de changer sous 2-3 ans              | Jamais par cœur, doc ouverte            | API d'un routeur, flags CLI, config d'un bundler               |

**Ce que le tag ne dit pas.** PROFESSIONNELLE qualifie l'usage sur le marché, pas la longévité. Certaines technos PROFESSIONNELLES (PostgreSQL, Docker en tant que format d'image OCI) ont une longévité de NOYAU DURABLE. C'est la ligne « Durée de vie » de chaque fiche qui fait foi, pas le tag. Le tag oriente ton investissement d'aujourd'hui ; le chiffre engage la techno sur la durée.

**Les tags qualifient des TECHNOLOGIES.** Les sections de méthode (ADR, grille de lecture d'écosystème, postmortem, audit d'une réponse d'IA) n'en portent pas : une méthode ne se périme pas de la même façon qu'un outil, et sa durée de vie est celle de ta carrière. Elles sont repérables à leur absence de ligne « Coût / Durée de vie ». Ce n'est pas un oubli, c'est une exception assumée et déclarée ici. Une section de méthode le DÉCLARE en une ligne sous son titre (« **Section de méthode** … », ou « **Section de synthèse** … » pour une section de clôture de niveau). L'absence de déclaration ET de Coût/Durée est un bug du document.

**Deux horizons, à ne pas confondre.** L'horizon du DOCUMENT est 2028 : au-delà, la sélection des technos et les alternatives citées ne sont plus garanties, il faut une révision. L'horizon des TECHNOLOGIES, ce sont les durées de vie chiffrées de chaque fiche : elles engagent la techno, pas le document. SQL sera encore là quand ce texte ne le sera plus. Règle de lecture : un tag NOYAU DURABLE est un pari sur dix ans et plus, un tag PÉRISSABLE est un pari sur trois ans, et le document, lui, se révise tous les trois mois.

Règle brutale : **on n'apprend jamais une syntaxe par cœur, on apprend le problème qu'elle résout.**

**NOYAU DURABLE est plafonné aux concepts, jamais aux produits.** Un produit peut disparaître ; un concept qu'il implémente reste. Next.js n'est pas NOYAU DURABLE : c'est le framework le plus mouvant du corpus (App Router / Pages Router, RSC en évolution constante) : il est CONTEXTUELLE. Ce qui est NOYAU DURABLE derrière lui, c'est « stratégies de rendu » (SSR, SSG, hydratation, cache) : un concept qui survivra à Next.js lui-même. Même logique pour Spring Boot (CONTEXTUELLE) vs injection de dépendances (NOYAU DURABLE), ou pour un ORM (CONTEXTUELLE/PROFESSIONNELLE selon le cas) vs modèle relationnel (NOYAU DURABLE).

**Gabarit d'exercice.** Chaque exercice porte ses huit champs, dont la ligne « Repli 100 % local et gratuit ». Cette ligne est OBLIGATOIRE, y compris quand l'exercice est déjà 100 % local : elle dit alors explicitement qu'il n'y a rien à payer et aucun compte à ouvrir. Une ligne toujours présente se vérifie par grep ; une ligne conditionnelle dérive à chaque ajout d'exercice.

Pour que le tag soit déductible et défendable, chaque fiche porte deux champs chiffrés obligatoires, en tête :

```text
Coût : ~N h avant utilité · Durée de vie : ~N ans
```

Un tag sans ces deux chiffres n'est pas une classification, c'est une opinion. Un titre de fiche porte les trois champs sur la même ligne : Tag, Coût, Durée de vie. Un champ en prose ne compte pas. « Combien d'heures avant d'être utile ? » et « combien d'années avant que ce soit obsolète ou remplacé ? » sont les deux questions qui rendent le tag vérifiable : et contestable, ce qui est le but.

MyFunnyJS a déjà posé ce cadre dans `00_referentiel/06_intemporel_vs_perissable.md` et `31_annexes/20_PERISSABILITE.md`. TECH-ILA applique la même grille aux technologies.

### Grille d'admission d'une techno dans ce document

Une techno n'entre ici que si elle passe ce filtre :

```text
Valeur pédagogique ?   → apprend-elle un mécanisme, ou juste une API ?
Usage professionnel ?  → combien d'offres réelles, dans combien de secteurs ?
Durée de vie ?         → l'écosystème est-il stable depuis 5+ ans ?
Transférabilité ?      → le concept se retrouve-t-il ailleurs ?
Coût d'apprentissage ? → combien d'heures pour être opérationnel ?
Alternatives ?         → existe-t-il plus simple pour le même problème ?
Lien MyFunnyJS ?       → quel module la prépare ?
```

Si une techno échoue sur "durée de vie" mais réussit sur "usage professionnel", elle est mentionnée brièvement et classée **PÉRISSABLE**. Elle ne prend pas dix pages.

### Le test du zéro outil

La grille d'admission ci-dessus décide si une techno _peut_ entrer dans le document. Elle ne dit pas si _toi_, sur ton projet, tu dois l'ajouter. Avant d'introduire une dépendance, réponds à ces cinq questions :

1. **Pourrais-je remplacer ça par 20 à 50 lignes maison ?** Si oui, et que tu n'as pas de raison précise de ne pas le faire, ne l'ajoute pas.
2. **Quel est le coût d'exploitation à 3 ans ?** Pas le coût d'installation : le coût cumulé de mises à jour, de failles de sécurité à suivre, de breaking changes à absorber.
3. **Qui saura le retirer ?** Si la réponse est "seulement moi, et seulement aujourd'hui", tu es en train de créer une dette que personne d'autre ne pourra rembourser.
4. **Est-ce que j'ajoute cet outil pour résoudre un problème que j'ai, ou un problème que je pourrais avoir ?** Le second cas est un YAGNI déguisé.
5. **Si je supprime cette dépendance dans six mois, qu'est-ce qui casse : et est-ce que je le sais déjà, ou est-ce que je le découvrirai ?**

L'absence d'outil est une option à part entière, pas un renoncement. Sur un document qui présente plus de 30 technologies, il est facile de conclure que la bonne réponse est toujours d'en ajouter une. Ce n'est pas le cas : la compétence la plus rare en mission n'est pas de connaître un outil de plus, c'est de savoir dire non à un outil qu'on ne saura pas maintenir.

---

## 3 : Carte globale des 6 niveaux

```text
NIVEAU 1  SOCLE          terminal · Git · Node · TS · HTTP · SQL · Docker
    ↓                    (aucun métier n'existe sans ça : aucun prérequis)
NIVEAU 2  FRONTEND       React · état · routing · Next.js · perf · a11y
    ↓                    (prérequis : niveau 1 complet : HTTP et Node en particulier)
NIVEAU 3  BACKEND        Express/NestJS · auth · validation · Redis · files
    ↓                    (prérequis : niveau 1 complet, SQL et Docker en particulier)
NIVEAU 4  SYSTÈMES       CI/CD · cloud · observabilité · messaging · résilience
    ↓                    (prérequis : niveau 3 complet : tu exploites ce que tu as construit)
NIVEAU 5  TRANSFERT      Python/FastAPI · Java/Spring · .NET
    ↓                    (prérequis : niveau 3 complet : tu transposes un raisonnement acquis)
NIVEAU 6  IA             diriger · vérifier · refuser
                         (prérequis : avoir livré au moins un projet de niveau 3 sans IA,
                         pour savoir reconnaître une réponse fausse quand l'IA en produit une)
```

À côté de ces six niveaux, un fichier n'est pas un niveau : le [mode urgence](./09-mode-urgence.md) est une page de consultation en incident, pas de lecture linéaire : index par message d'erreur, index par symptôme, procédure d'incident en une page.

Tu n'as pas besoin de finir un niveau pour toucher le suivant. Mais tu ne sautes pas le niveau 1. Jamais.

### Ordre conseillé en parallèle de MyFunnyJS

| Modules MyFunnyJS en cours                               | Section TECH-ILA à ouvrir en parallèle       |
| -------------------------------------------------------- | -------------------------------------------- |
| 00 → 02 (getting started, fondamentaux, problem solving) | Terminal, Git, Node, npm/pnpm                |
| 03 → 08 (async, debugging, erreurs, testing, perf)       | Node runtime, Vitest, DevTools, HTTP         |
| 09 → 13 (structures, algos, FP, patterns, refacto)       | rien de nouveau : consolide, code            |
| 14 → 15 (TypeScript, runtime)                            | TypeScript pro, Vite, packaging              |
| 16 → 17 (architecture, web)                              | React, routing, Next.js                      |
| 18 → 22 (OOP, a11y, temps réel, API, sécurité)           | NestJS, PostgreSQL, auth, WebSocket/SSE      |
| 24 → 26 (bases de données, scalabilité, observabilité)   | Redis, files, Docker, OpenTelemetry, CI/CD   |
| 27 → 31 (team craft, edge cases, agents, projets)        | Cloud, transfert Python/Java/.NET, portfolio |

**Seuil franchi.** Tu viens de comprendre que l'ordre n'est pas décoratif : chaque techno arrive au moment où tu as déjà le mécanisme en tête. Apprendre React avant les closures, c'est apprendre à conduire en regardant la radio.

---

[← Sommaire](../README.md) · [Niveau 1 →](./01-niveau-1-socle.md)
