---
statut: revu
last_reviewed: 2026-08
proprietaire: mainteneur TECH-ILA
revue: trimestrielle
companion: MyFunnyJS
---

[← Sommaire TECH-ILA](../README.md)

> **Tu viens de** : [07-cartes-myfunnyjs.md](./07-cartes-myfunnyjs.md) : le mapping module par module.
> **Tu dois déjà savoir** : la grille intemporel/périssable ([00](./00-orientation.md)), écrire un ADR ([04](./04-niveau-4-systemes.md)), la doctrine de vérification de l'IA ([06](./06-niveau-6-ia.md)).
> **Ensuite** : [09-mode-urgence.md](./09-mode-urgence.md) : à ouvrir seulement quand quelque chose brûle.

# Exercices, marché, audit (sections 12 à 14 et dernier mot)

Les angles morts de l'IA ne sont plus ici : ils ont rejoint le [niveau 6](./06-niveau-6-ia.md), avec la doctrine de vérification. Une seule page, un seul endroit.

---

## 12 : Exercices et mini-projets

### 12.1 : Règles

Chaque exercice de ce document a un objectif professionnel, réutilise au moins un concept MyFunnyJS, exige une décision ou un diagnostic, contient un piège réaliste, demande une vérification observable, et propose une extension. Ils sont tous faisables seul.

**Tu écris toi-même ton critère de réussite binaire** : une commande, une sortie attendue. C'est la discipline des `EXO_JEUNE_IA` de MyFunnyJS, appliquée aux technologies.

### 12.2 : Les douze exercices transversaux

| #   | Exercice                                                                                                                           | Ce qu'il prouve                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | Cartographier une codebase inconnue avec les 9 questions de [8.0](./05-niveau-5-transfert.md#80--la-grille-de-lecture-universelle) | tu peux arriver dans une équipe et être utile en trois jours |
| 2   | Trouver le point d'entrée réel d'un projet sans README                                                                             | tu ne dépends pas de la documentation                        |
| 3   | Suivre une requête de bout en bout avec une trace                                                                                  | tu comprends ton système, pas seulement ton fichier          |
| 4   | Reproduire un bug avant de le corriger                                                                                             | tu ne corriges pas au hasard                                 |
| 5   | Corriger une mauvaise abstraction (pas un bug)                                                                                     | tu vois la dette, pas seulement l'erreur                     |
| 6   | Comparer deux technos sur des contraintes réelles                                                                                  | tu décides au lieu de suivre la mode                         |
| 7   | Choisir un outil sous contrainte (budget, équipe, délai)                                                                           | tu raisonnes en ingénieur                                    |
| 8   | Analyser une réponse IA et prouver une faille                                                                                      | tu es dirigeant, pas passager                                |
| 9   | Rédiger un ADR complet                                                                                                             | tu sais défendre un choix six mois plus tard                 |
| 10  | Produire un postmortem sans accuser personne                                                                                       | tu es employable en environnement d'astreinte                |
| 11  | Mesurer avant et après une optimisation                                                                                            | tu prouves au lieu d'affirmer                                |
| 12  | Supprimer du code sans rien casser                                                                                                 | compétence rare, très respectée                              |

### 12.3 : Trois mini-projets d'intégration (pas un par techno)

**A. Pipeline d'ingestion et de métriques.** Endpoint → validation → file → worker → PostgreSQL → tableau de bord. Contraintes : idempotence, arrêt gracieux, dead-letter, mémoire constante, trace complète. _Mobilise :_ modules 03, 05, 15, 21, 24, 25, 26.

**B. Front temps réel d'observation.** Interface qui affiche le pipeline A en direct via SSE, avec filtres dans l'URL, reprise après coupure réseau, accessible au clavier, budget de bundle tenu. _Mobilise :_ modules 01, 17, 19, 20 + React.

**C. Reprise de legacy.** Prends un projet open source abandonné. Cartographie, tests caractérisants, une correction, un refactoring, un ADR, un README de reprise. _Mobilise :_ modules 04, 06, 13, 27.

Trois projets, cohérents entre eux, valent mieux que douze démos jetables. Un recruteur peut réellement les lire.

### 12.4 : Les trois exercices de clôture

> **Exercice : L'ADR de fin de parcours**
> **Temps réaliste** : 90 min · **Prérequis matériel / compte** : aucun · **Coût max** : 0 € ·
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : choisis une décision technique réelle prise dans l'un de tes trois mini-projets. Rédige l'ADR : contexte, contraintes, options écartées et pourquoi, décision, conséquences acceptées, signal qui déclencherait une révision. Puis **réécris la même décision en 5 lignes pour un responsable produit, sans un seul nom de techno**.
> **Réutilise** : [27_team_craft](../../27_team_craft/) : la trace écrite d'une décision.
> **Piège** : écrire « on a choisi X parce que c'est mieux ». Une option écartée sans raison chiffrée n'est pas une option écartée.
> **À observer** : le moment où tu ne sais plus justifier un choix. C'est là que la décision était une habitude, pas une décision.
> **Vérification** (observable, chiffrée) : la version produit tient en 5 lignes, contient zéro nom de technologie, et une personne non technique peut redire la contrainte principale après une seule lecture.
> **Repli 100 % local et gratuit** : tout se fait hors ligne, avec un éditeur de texte. Aucun compte, aucun outil.
> **Extension** : six mois plus tard, relis-le et écris l'ADR de révision, même s'il conclut « on garde ».

> **Exercice : Fais relire une de tes décisions**
> **Temps réaliste** : 1 h + le délai de réponse du relecteur · **Prérequis matériel / compte** : aucun · **Coût max** : 0 € ·
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : reprends l'ADR produit ci-dessus et soumets-le à un tiers (un pair, une communauté, le mainteneur d'un projet que tu utilises). Reçois les objections, puis classe chaque retour dans une des trois catégories : « je change », « je ne change pas et voici pourquoi », « je ne sais pas trancher, il me manque telle information ».
> **Réutilise** : [27_team_craft/01_code_review.md](../../27_team_craft/01_code_review.md) : recevoir une critique sans la subir ni la balayer.
> **Piège** : traiter toute objection comme une correction à appliquer. L'inverse aussi : défendre par principe.
> **À observer** : combien d'objections tombent dans la troisième catégorie. C'est la mesure honnête de ce qu'il te manque.
> **Vérification** (observable, chiffrée) : le classement existe, écrit, une raison par ligne, zéro retour non classé.
> **Repli 100 % local et gratuit** : tout se fait hors ligne, avec un éditeur de texte. Aucun compte, aucun outil. Pas de relecteur disponible ? Relis-toi à 15 jours d'intervalle : le décalage temporel joue le rôle du regard extérieur.
> **Extension** : refais l'exercice dans l'autre sens : relis la décision de quelqu'un d'autre et classe tes propres objections avant de les envoyer.

> **Exercice : Auditer ce document contre toi-même**
> **Temps réaliste** : 60 min · **Prérequis matériel / compte** : aucun · **Coût max** : 0 € ·
> **Mode** : assistant autorisé
> **Contraintes** : prends la grille de la section 14 et applique-la à trois fiches techno au hasard dans les niveaux 1 à 5. Pour chacune, vérifie qu'il existe un « Quand ne pas la choisir », un message d'erreur littéral, et un ancrage MyFunnyJS cliquable.
> **Réutilise** : [00-orientation.md](./00-orientation.md) : la grille intemporel/périssable.
> **Piège** : accepter une fiche parce qu'elle « a l'air complète ». Coche élément par élément.
> **À observer** : les fiches où le coût annoncé ne correspond pas à ton vécu. C'est ton signal de revue.
> **Vérification** (observable, chiffrée) : trois fiches auditées, chaque manquement listé avec numéro de ligne, et au moins une correction proposée en une phrase.
> **Repli 100 % local et gratuit** : tout se fait hors ligne, avec un éditeur de texte. Aucun compte, aucun outil.
> **Extension** : ouvre la correction. Ce document accepte les contradictions chiffrées, pas les avis.

---

## 13 : Réalité du marché

### 13.1 : Ce qui est honnête

Aucune formation ne garantit une embauche. Ni MyFunnyJS, ni TECH-ILA, ni un diplôme, ni une certification. Ce que ce parcours peut faire :

- **augmenter tes chances** ;
- **te préparer à des entretiens** techniques réels ;
- **te donner un portfolio défendable** ;
- **réduire tes angles morts** techniques ;
- **te rendre plus autonome** ;
- **te permettre de comprendre un nouvel écosystème plus vite**.

C'est déjà énorme. Ce n'est pas une promesse d'emploi.

### 13.2 : Ce qu'un recruteur peut réellement vérifier

Il ne peut pas vérifier que tu "connais React". Il peut vérifier que tu sais lire du code inconnu, expliquer une décision, décrire comment ton système casse, montrer une trace ou une mesure, écrire un test qui prouve un correctif, et dire "je ne sais pas" au bon moment.

Il peut aussi vérifier la dimension collective, et c'est la question qui départage deux candidats de niveau technique égal : « montre-moi une décision que tu as changée après une revue, et une que tu as maintenue. » Les deux réponses comptent autant l'une que l'autre : la première prouve que tu écoutes, la seconde que tu décides. C'est la doctrine de 13.4 appliquée à toi, pas à ton code.

### 13.3 : Combinaisons cohérentes

Les technos apparaissent en grappes. Vise **une** grappe complète, pas quinze noms.

| Profil               | Grappe cohérente                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Frontend produit     | TypeScript · React · Next.js · état serveur · tests · a11y · CI                              |
| Fullstack JS         | TypeScript · React · NestJS ou Fastify · PostgreSQL · Redis · Docker · CI/CD · observabilité |
| Backend / plateforme | TypeScript ou Java · PostgreSQL · files · Docker · CI/CD · OpenTelemetry · cloud             |
| Entreprise           | Java/Spring ou .NET · SQL · tests · sécurité · architecture                                  |
| Data-adjacent        | Python · FastAPI · SQL · orchestration · Docker                                              |

**Les grappes qui n'existent pas.** Le tableau dit vers quoi aller ; celui-ci dit ce qu'il faut refuser de viser, et pour une raison économique, jamais morale.

- « fullstack + data + DevOps » : ce n'est pas un profil, ce sont trois postes non financés. Hors très petite structure, personne ne recrute quelqu'un qui exploite, développe et traite la donnée sur le même poste.
- « frontend + mobile natif + design » : trois métiers dont deux ont leurs propres écoles et leurs propres outils.
- « junior + architecte » : l'architecture se paie en cicatrices, pas en lectures.
- « toutes les technos de ce document » : le document couvre une trentaine de technos justement pour que tu en choisisses six.

Le document pratique déjà cette règle : les trois mini-projets de 12.3 matérialisent une grappe unique, pas un catalogue.

### 13.4 : Choisir un deuxième langage

L'ADR « rester en JS ou porter en Python » du [niveau 5](./05-niveau-5-transfert.md) porte sur un PROJET. Choisir son deuxième langage est une autre décision : un investissement personnel sur dix ans. Cinq critères, dans cet ordre.

1. Quelle grappe de 13.3 vises-tu ? Le langage se déduit de la grappe, jamais l'inverse.
2. Quel est le coût d'entretien de deux écosystèmes en parallèle ? Il est réel et permanent : outillage, versions, réflexes. Il est presque toujours sous-estimé.
3. Le deuxième langage ouvre-t-il un domaine, ou seulement un synonyme ? Python ouvre data, IA et scripting : c'est un domaine. Aller de TypeScript à Go pour écrire les mêmes API, c'est un synonyme mieux déployé.
4. Que devient ton premier langage si tu arrêtes de l'entretenir dix-huit mois ?
5. Y a-t-il des postes à moins d'une heure de chez toi, ou en remote accessible depuis ton fuseau, qui demandent la grappe visée ? Si non, le meilleur langage du monde ne se convertit pas en emploi.

Réponse explicite pour le cas le plus fréquent : Python + SQL + PostgreSQL est une grappe complète et durable, le langage de la donnée, le modèle qui ne bouge pas, le moteur qui l'implémente le mieux. Ce qui lui manque n'est pas de la longévité, c'est une surface : sans une compétence d'exploitation (niveau 4) ou une compétence produit, elle te place en exécutant d'un pipeline que quelqu'un d'autre a conçu. Cette décision-là aussi s'écrit en ADR.

**Pourquoi JavaScript et TypeScript seuls peuvent ne pas suffire.** Pour un poste frontend, ça peut suffire. Pour un poste backend ou plateforme, on attend en plus SQL, conteneurs, CI/CD et observabilité : parce que ces postes consistent autant à **exploiter** qu'à écrire.

### 13.5 : Ce que ton portfolio doit démontrer

Pas des fonctionnalités : des **décisions**. Pour chaque projet, un README qui répond à : quel problème, quelles contraintes, quelles options envisagées, quel choix et pourquoi, comment c'est testé, comment c'est observé, ce que tu ferais différemment. Un projet moyen bien documenté bat trois projets brillants sans explication.

### 13.6 : Le résultat attendu

Pas :

> "Je connais beaucoup de noms de frameworks."

Mais :

> "Je comprends les fondamentaux. Je sais choisir et utiliser un écosystème. Je peux lire une codebase, construire une fonctionnalité, diagnostiquer un problème, sécuriser un système, tester mon travail, observer son comportement, défendre mes choix et apprendre une nouvelle technologie sans repartir de zéro."

**Moment Thor.** Cette phrase n'est pas un slogan. Chaque proposition y est vérifiable, et tu sais maintenant par quel exercice la prouver.

---

## 14 : Audit anti-bullshit

Les règles que ce document s'impose, et que tu peux lui opposer.

| Règle                                        | Application                                                                                                                                                          |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aucune techno par effet de mode              | chacune passe la grille de [2](./00-orientation.md#2--syst%C3%A8me-de-classification) ; celles à durée de vie courte sont marquées PÉRISSABLE et traitées brièvement |
| Aucune promesse d'embauche                   | voir [13.1](#131--ce-qui-est-honn%C3%AAte)                                                                                                                           |
| Aucune techno "universellement meilleure"    | chaque fiche a un "Quand ne pas la choisir"                                                                                                                          |
| Aucun framework ne remplace les fondamentaux | chaque fiche cite les modules MyFunnyJS mobilisés                                                                                                                    |
| Aucun exemple artificiel                     | pipelines, caches, files, migrations, incidents, legacy : jamais panier ni login                                                                                     |
| Pas de redite des 32 modules                 | quand MyFunnyJS l'explique déjà, on renvoie au fichier                                                                                                               |
| Aucun jargon non expliqué                    | I/O-bound, backpressure, idempotence, N+1, p99, DLQ, SBOM sont définis à l'usage                                                                                     |
| Compromis systématiques                      | chaque choix expose son coût                                                                                                                                         |
| Durable séparé du changeant                  | "Ce qui restera" vs "Ce qu'il ne faut pas mémoriser"                                                                                                                 |
| Angles morts de l'IA traités                 | traités intégralement au [niveau 6](./06-niveau-6-ia.md) et défaillances par techno en [9.3](./06-niveau-6-ia.md#93--les-d%C3%A9faillances-typiques-par-technologie) |
| Liens jamais inventés                        | modules 07, 09 bonus, 10 avancé : "aucune application directe identifiée" assumé                                                                                     |
| Récompenses rares et méritées                | une dizaine dans tout le document, après une notion dense ou un transfert réussi : jamais après un paragraphe                                                        |
| Volume compatible avec un apprentissage réel | sélectif sur les technos, exhaustif sur les mécanismes                                                                                                               |
| Chiffres recomptés, jamais estimés           | lignes, liens, exercices : recomptés à chaque revue, commandes et valeurs dans le [rituel du README](../README.md#rituel-de-revue-trimestrielle)                      |
| Alternatives systématiques                   | chaque fiche techno porte un tableau Alternatives avec l'échange consenti, jamais une liste de noms                                                                   |
| Le document s'applique ses propres règles    | les sections de méthode (2, 3, 7.7, 12, 13, 14) ne portent pas de tag : ce ne sont pas des technos, et c'est déclaré en [0](./00-orientation.md)                       |

Deux lignes de cette grille étaient fausses avant la dernière revue : les chiffres du README étaient estimés, et une partie des fiches n'avait pas d'alternatives. Elles ont été rendues vraies plutôt que retirées. Opposer une ligne fausse à ce document est un usage prévu.

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

---

[← Cartes MyFunnyJS](./07-cartes-myfunnyjs.md) · [Sommaire](../README.md) · [Mode urgence →](./09-mode-urgence.md)
