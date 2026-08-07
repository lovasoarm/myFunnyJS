[← Sommaire TECH-ILA](../TECH-ILA.md)

# Orientation : lire, classer, ordonner (sections 0 à 3)

---

## 0 : Comment lire ce document

Trois usages. Choisis le tien.

**Usage 1 : parcours.** Tu avances dans MyFunnyJS. Après chaque module, tu ouvres la section TECH-ILA correspondante ([section 10](./07-cartes-myfunnyjs.md#10--carte-myfunnyjs--technologies)) et tu appliques le concept dans une techno réelle.

**Usage 2 : dépannage.** Tu es en galère sur React ou NestJS. Tu ouvres la [carte inverse](./07-cartes-myfunnyjs.md#11--carte-inverse-technologie--fichiers-myfunnyjs), tu retrouves le fichier MyFunnyJS qui explique le mécanisme sous-jacent, tu relis, tu reviens.

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

Une techno n'apparaît **jamais seule** ici. Si tu ne vois pas à quel concept MyFunnyJS elle se rattache, c'est un bug du document, pas de toi.

**Jargon.** Chaque terme technique est expliqué à sa première apparition, entre parenthèses ou en une ligne. Si un mot te bloque, il manque une explication : signale-le.

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

| Tag                 | Définition                                                | Investissement                          | Exemple                                          |
| ------------------- | --------------------------------------------------------- | --------------------------------------- | ------------------------------------------------ |
| **NOYAU DURABLE**   | Concept ou techno dont les principes survivront à l'outil | Profond, mémorisé, pratiqué             | HTTP, SQL, Git, modèle relationnel, Linux        |
| **PROFESSIONNELLE** | Largement utilisée aujourd'hui, dans plusieurs contextes  | Sérieux, jusqu'à l'autonomie            | React, Node.js, TypeScript, Docker, PostgreSQL   |
| **CONTEXTUELLE**    | Utile selon secteur, équipe, architecture                 | À la demande, quand le contexte l'exige | GraphQL, Spring Boot, .NET, MongoDB, Kafka       |
| **PÉRISSABLE**      | Syntaxe, API, config susceptible de changer sous 2-3 ans  | Jamais par cœur, doc ouverte            | API d'un routeur, flags CLI, config d'un bundler |

Règle brutale : **on n'apprend jamais une syntaxe par cœur, on apprend le problème qu'elle résout.**

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

---

## 3 : Carte globale des 6 niveaux

```text
NIVEAU 1  SOCLE          terminal · Git · Node · TS · HTTP · SQL · Docker
    ↓                    (aucun métier n'existe sans ça)
NIVEAU 2  FRONTEND       React · état · routing · Next.js · perf · a11y
    ↓
NIVEAU 3  BACKEND        Express/NestJS · auth · validation · Redis · files
    ↓
NIVEAU 4  SYSTÈMES       CI/CD · cloud · observabilité · messaging · résilience
    ↓
NIVEAU 5  TRANSFERT      Python/FastAPI · Java/Spring · .NET
    ↓
NIVEAU 6  IA             diriger · vérifier · refuser
```

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
