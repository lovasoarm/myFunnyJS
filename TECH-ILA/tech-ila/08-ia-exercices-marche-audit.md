[← Sommaire TECH-ILA](../README.md)

# Angles morts de l'IA, exercices, marché, audit (sections 12 à 15 et dernier mot)

---

## 12 : Angles morts que l'IA ne résout pas

Ni aujourd'hui, ni sur le legacy, ni sur ce qui arrive.

### 12.1 : La liste, sans complaisance

| Angle mort                                     | Pourquoi l'IA ne le couvre pas                                      |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| Demande ambiguë                                | elle comble les trous par du plausible au lieu de poser la question |
| Spécification contradictoire                   | elle implémente la dernière phrase lue                              |
| Contexte métier absent du prompt               | il n'est écrit nulle part, il vit dans la tête de trois personnes   |
| Choix entre solutions valides                  | elle propose ; elle n'assume pas                                    |
| Compromis coût / perf / sécurité / maintenance | elle n'a ni ta facture, ni ton équipe, ni ton SLA                   |
| Legacy mal documenté                           | elle voit un fichier, pas quinze ans d'histoire                     |
| Symptôme vs cause racine                       | elle corrige ce qu'on lui montre                                    |
| Bug non déterministe                           | elle ne peut pas le reproduire chez toi                             |
| API inventée, dépendance inexistante           | c'est statistiquement plausible, donc généré                        |
| Faille dans du code plausible                  | l'autorisation métier n'a aucune signature détectable               |
| Effets de bord                                 | invisibles dans l'extrait fourni                                    |
| Décider de **ne pas** coder                    | elle produit toujours quelque chose                                 |
| Défendre la décision en réunion                | ce n'est pas elle qui sera là dans six mois                         |
| Responsabilité du système livré                | juridiquement et humainement, c'est toi                             |
| Reconnaître ce qu'on ne sait pas               | elle répond avec la même assurance dans les deux cas                |
| Doc, IA et exemples qui se contredisent        | il faut aller lire le code source, ou expérimenter                  |

### 12.2 : Legacy et futur

**Legacy.** Le code ancien contient des décisions dont le contexte a disparu. Un `if` bizarre est parfois un correctif de bug de 2019 pour un client qui existe encore. Supprimer ce que tu ne comprends pas est la façon la plus rapide de créer un incident (`13_refactoring/07_do_not_touch_before_explain.md`).

**Futur.** À mesure que la génération de code s'améliore, deux choses grossissent : le **volume** de code à maintenir, et le coût d'une mauvaise décision d'architecture prise vite. Les compétences qui prennent de la valeur sont donc : la spécification vérifiable, la revue, l'observabilité, la sécurité et la capacité à supprimer du code.

---

## 13 : Exercices et mini-projets

### 13.1 : Règles

Chaque exercice de ce document a un objectif professionnel, réutilise au moins un concept MyFunnyJS, exige une décision ou un diagnostic, contient un piège réaliste, demande une vérification observable, et propose une extension. Ils sont tous faisables seul.

**Tu écris toi-même ton critère de réussite binaire** : une commande, une sortie attendue. C'est la discipline des `EXO_JEUNE_IA` de MyFunnyJS, appliquée aux technologies.

### 13.2 : Les douze exercices transversaux

| #   | Exercice                                                                                                 | Ce qu'il prouve                                              |
| --- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | Cartographier une codebase inconnue avec les 9 questions de [8.0](./05-niveau-5-transfert.md#80--la-grille-de-lecture-universelle) | tu peux arriver dans une équipe et être utile en trois jours |
| 2   | Trouver le point d'entrée réel d'un projet sans README                                                   | tu ne dépends pas de la documentation                        |
| 3   | Suivre une requête de bout en bout avec une trace                                                        | tu comprends ton système, pas seulement ton fichier          |
| 4   | Reproduire un bug avant de le corriger                                                                   | tu ne corriges pas au hasard                                 |
| 5   | Corriger une mauvaise abstraction (pas un bug)                                                           | tu vois la dette, pas seulement l'erreur                     |
| 6   | Comparer deux technos sur des contraintes réelles                                                        | tu décides au lieu de suivre la mode                         |
| 7   | Choisir un outil sous contrainte (budget, équipe, délai)                                                 | tu raisonnes en ingénieur                                    |
| 8   | Analyser une réponse IA et prouver une faille                                                            | tu es dirigeant, pas passager                                |
| 9   | Rédiger un ADR complet                                                                                   | tu sais défendre un choix six mois plus tard                 |
| 10  | Produire un postmortem sans accuser personne                                                             | tu es employable en environnement d'astreinte                |
| 11  | Mesurer avant et après une optimisation                                                                  | tu prouves au lieu d'affirmer                                |
| 12  | Supprimer du code sans rien casser                                                                       | compétence rare, très respectée                              |

### 13.3 : Trois mini-projets d'intégration (pas un par techno)

**A. Pipeline d'ingestion et de métriques.** Endpoint → validation → file → worker → PostgreSQL → tableau de bord. Contraintes : idempotence, arrêt gracieux, dead-letter, mémoire constante, trace complète. _Mobilise :_ modules 03, 05, 15, 21, 24, 25, 26.

**B. Front temps réel d'observation.** Interface qui affiche le pipeline A en direct via SSE, avec filtres dans l'URL, reprise après coupure réseau, accessible au clavier, budget de bundle tenu. _Mobilise :_ modules 01, 17, 19, 20 + React.

**C. Reprise de legacy.** Prends un projet open source abandonné. Cartographie, tests caractérisants, une correction, un refactoring, un ADR, un README de reprise. _Mobilise :_ modules 04, 06, 13, 27.

Trois projets, cohérents entre eux, valent mieux que douze démos jetables. Un recruteur peut réellement les lire.

---

## 14 : Réalité du marché

### 14.1 : Ce qui est honnête

Aucune formation ne garantit une embauche. Ni MyFunnyJS, ni TECH-ILA, ni un diplôme, ni une certification. Ce que ce parcours peut faire :

- **augmenter tes chances** ;
- **te préparer à des entretiens** techniques réels ;
- **te donner un portfolio défendable** ;
- **réduire tes angles morts** techniques ;
- **te rendre plus autonome** ;
- **te permettre de comprendre un nouvel écosystème plus vite**.

C'est déjà énorme. Ce n'est pas une promesse d'emploi.

### 14.2 : Ce qu'un recruteur peut réellement vérifier

Il ne peut pas vérifier que tu "connais React". Il peut vérifier que tu sais lire du code inconnu, expliquer une décision, décrire comment ton système casse, montrer une trace ou une mesure, écrire un test qui prouve un correctif, et dire "je ne sais pas" au bon moment.

### 14.3 : Combinaisons cohérentes

Les technos apparaissent en grappes. Vise **une** grappe complète, pas quinze noms.

| Profil               | Grappe cohérente                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Frontend produit     | TypeScript · React · Next.js · état serveur · tests · a11y · CI                              |
| Fullstack JS         | TypeScript · React · NestJS ou Fastify · PostgreSQL · Redis · Docker · CI/CD · observabilité |
| Backend / plateforme | TypeScript ou Java · PostgreSQL · files · Docker · CI/CD · OpenTelemetry · cloud             |
| Entreprise           | Java/Spring ou .NET · SQL · tests · sécurité · architecture                                  |
| Data-adjacent        | Python · FastAPI · SQL · orchestration · Docker                                              |

**Pourquoi JavaScript et TypeScript seuls peuvent ne pas suffire.** Pour un poste frontend, ça peut suffire. Pour un poste backend ou plateforme, on attend en plus SQL, conteneurs, CI/CD et observabilité : parce que ces postes consistent autant à **exploiter** qu'à écrire.

### 14.4 : Ce que ton portfolio doit démontrer

Pas des fonctionnalités : des **décisions**. Pour chaque projet, un README qui répond à : quel problème, quelles contraintes, quelles options envisagées, quel choix et pourquoi, comment c'est testé, comment c'est observé, ce que tu ferais différemment. Un projet moyen bien documenté bat trois projets brillants sans explication.

### 14.5 : Le résultat attendu

Pas :

> "Je connais beaucoup de noms de frameworks."

Mais :

> "Je comprends les fondamentaux. Je sais choisir et utiliser un écosystème. Je peux lire une codebase, construire une fonctionnalité, diagnostiquer un problème, sécuriser un système, tester mon travail, observer son comportement, défendre mes choix et apprendre une nouvelle technologie sans repartir de zéro."

**Moment Thor.** Cette phrase n'est pas un slogan. Chaque proposition y est vérifiable, et tu sais maintenant par quel exercice la prouver.

---

## 15 : Audit anti-bullshit

Les règles que ce document s'impose, et que tu peux lui opposer.

| Règle                                        | Application                                                                                                                                         |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aucune techno par effet de mode              | chacune passe la grille de [2](./00-orientation.md#2--syst%C3%A8me-de-classification) ; celles à durée de vie courte sont marquées PÉRISSABLE et traitées brièvement   |
| Aucune promesse d'embauche                   | voir [14.1](#141--ce-qui-est-honn%C3%AAte)                                                                                                          |
| Aucune techno "universellement meilleure"    | chaque fiche a un "Quand ne pas la choisir"                                                                                                         |
| Aucun framework ne remplace les fondamentaux | chaque fiche cite les modules MyFunnyJS mobilisés                                                                                                   |
| Aucun exemple artificiel                     | pipelines, caches, files, migrations, incidents, legacy : jamais panier ni login                                                                    |
| Pas de redite des 32 modules                 | quand MyFunnyJS l'explique déjà, on renvoie au fichier                                                                                              |
| Aucun jargon non expliqué                    | I/O-bound, backpressure, idempotence, N+1, p99, DLQ, SBOM sont définis à l'usage                                                                    |
| Compromis systématiques                      | chaque choix expose son coût                                                                                                                        |
| Durable séparé du changeant                  | "Ce qui restera" vs "Ce qu'il ne faut pas mémoriser"                                                                                                |
| Angles morts de l'IA traités                 | section [12](#12--angles-morts-que-lia-ne-r%C3%A9sout-pas) et défaillances par techno en [9.3](./06-niveau-6-ia.md#93--les-d%C3%A9faillances-typiques-par-technologie) |
| Liens jamais inventés                        | modules 07, 09 bonus, 10 avancé : "aucune application directe identifiée" assumé                                                                    |
| Récompenses rares et méritées                | une dizaine dans tout le document, après une notion dense ou un transfert réussi : jamais après un paragraphe                                       |
| Volume compatible avec un apprentissage réel | sélectif sur les technos, exhaustif sur les mécanismes                                                                                              |

---

## Dernier mot

```text
Tu ne savais pas encore voir le problème
        ↓
Tu observes le mécanisme
        ↓
Tu formules une hypothèse
        ↓
Tu vérifies avec une preuve
        ↓
Tu prends une décision
        ↓
Tu peux réutiliser le geste ailleurs
```

MyFunnyJS t'a donné le cerveau. TECH-ILA t'a montré les terrains. Les frameworks cités ici auront changé de version, certains auront disparu. Le geste, lui, sera exactement le même.

Reste juste une chose à faire : construire, casser, mesurer, expliquer. Dans cet ordre.
