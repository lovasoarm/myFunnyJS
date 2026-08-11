---
statut: revu
last_reviewed: 2026-08
last_counted: 2026-08
proprietaire: mainteneur TECH-ILA
revue: trimestrielle
companion: MyFunnyJS
---

# TECH-ILA

> **MyFunnyJS enseigne le cerveau. TECH-ILA montre où ce cerveau s'utilise.**
> Les exercices vérifient la compréhension. Les mini-projets prouvent la capacité d'action. Le portfolio montre les décisions prises.

> **Attention : lu seul, ce document ment sur ta compétence.**
> Lu sans MyFunnyJS, ce document produit un faux sentiment de compétence. Tu reconnaîtrais des gestes, des noms d'outils, des tableaux de comparaison : sans jamais avoir touché le mécanisme qu'ils supposent acquis. Avant d'ouvrir le niveau 1, fais au minimum ces trois modules :
>
> - [00_getting_started/00_why_getting_started.md](../00_getting_started/00_why_getting_started.md) : installation, terminal, premier jour.
> - [00_referentiel/00_why_referentiel.md](../00_referentiel/00_why_referentiel.md) : le référentiel de compétences et la grille intemporel/périssable.
> - [01_fundamentals/00_why_fundamentals.md](../01_fundamentals/00_why_fundamentals.md) : variables, scope, fonctions : le socle sur lequel toute fiche de ce document s'appuie.

> **Un seul document, dix fichiers.** Le cahier des charges demandait un unique `TECH-ILA.md`. Le corpus complet couvre les 32 modules de MyFunnyJS et pèse 4 343 lignes réparties sur 10 fichiers (compté au 2026-08) : largement au-dessus du seuil de confort de lecture continue dans un éditeur Markdown ou sur GitHub, et contraire à deux autres règles du même cahier (« agréable à lire », « pas une encyclopédie »). Choix assumé : **un seul document logique, découpé en dix fichiers pour la lisibilité.** Lis-les dans l'ordre du sommaire ; chaque fichier renvoie ici.

TECH-ILA n'est pas un second curriculum. C'est le **parcours technologique parallèle** de MyFunnyJS.

MyFunnyJS te donne le runtime, la mémoire, l'asynchrone, le debugging, l'architecture. Excellent. Mais un diplômé qui comprend l'event loop et n'a jamais lu un `docker-compose.yml`, jamais ouvert une migration SQL, jamais vu un `guard` NestJS, reste bloqué au premier jour de mission.

Ce document répond à une seule question, répétée des dizaines de fois :

**"Ce que j'ai appris dans ce fichier MyFunnyJS, où est-ce que je vais le retrouver dans la vraie vie technologique ?"**

---

## Sommaire

Le contenu est découpé par niveau, un fichier par étape du parcours. Lis dans l'ordre ; chaque fichier est autonome et renvoie ici. En incident, ne lis rien dans l'ordre : ouvre directement le fichier 09.

| #     | Fichier                                                                     | Section                            | Taille indicative | Ce que tu y gagnes                                  |
| ----- | --------------------------------------------------------------------------- | ---------------------------------- | ----------------- | --------------------------------------------------- |
| 0-3   | [00-orientation.md](tech-ila/00-orientation.md)                             | Lire, classer, ordonner            | 221 lignes       | La méthode, la classification, la carte des niveaux |
| 4     | [01-niveau-1-socle.md](tech-ila/01-niveau-1-socle.md)                       | Niveau 1 : Socle professionnel     | 866 lignes       | Terminal, Git, Node, TS, HTTP, SQL, Docker          |
| 5     | [02-niveau-2-frontend.md](tech-ila/02-niveau-2-frontend.md)                 | Niveau 2 : Frontend                | 562 lignes       | React, état, stratégies de rendu, perf, a11y        |
| 6     | [03-niveau-3-backend.md](tech-ila/03-niveau-3-backend.md)                   | Niveau 3 : Backend                 | 676 lignes       | Express, NestJS, auth, Redis, files, temps réel     |
| 7     | [04-niveau-4-systemes.md](tech-ila/04-niveau-4-systemes.md)                 | Niveau 4 : Systèmes professionnels | 608 lignes       | CI/CD, cloud, observabilité, résilience             |
| 8     | [05-niveau-5-transfert.md](tech-ila/05-niveau-5-transfert.md)               | Niveau 5 : Transfert               | 485 lignes       | Python, Java/Spring, .NET                           |
| 9     | [06-niveau-6-ia.md](tech-ila/06-niveau-6-ia.md)                             | Niveau 6 : IA                      | 317 lignes       | Diriger, vérifier, refuser                          |
| 10-11 | [07-cartes-myfunnyjs.md](tech-ila/07-cartes-myfunnyjs.md)                   | Cartes MyFunnyJS ↔ technologies    | 311 lignes       | Le mapping module par module, et l'inverse          |
| 12-14 | [08-ia-exercices-marche-audit.md](tech-ila/08-ia-exercices-marche-audit.md) | Exercices, marché, audit           | 216 lignes       | Ce qui reste ton travail, la preuve, l'honnêteté    |
| :     | [09-mode-urgence.md](tech-ila/09-mode-urgence.md)                           | Mode urgence                       | 81 lignes        | Trouver la bonne page en incident en moins de 30 s  |

Ces chiffres sont recomptés à chaque revue trimestrielle. S'ils sont faux, c'est un bug : signale-le.

Le niveau 6 (fichier 06) intègre désormais l'ancienne section « angles morts de l'IA » : une seule doctrine de vérification, un seul endroit où la lire.

---

## Sections à surveiller

Ce document ne date rien par principe (aucune version épinglée), mais il vieillit quand même. Les zones suivantes bougent plus vite que le reste du corpus. À chaque revue trimestrielle, ouvre-les en premier et pose-toi la question associée.

| Section périssable              | Fichier                                                       | Question à se reposer chaque trimestre                                                                             |
| ------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Next.js et stratégies de rendu  | [02-niveau-2-frontend.md](tech-ila/02-niveau-2-frontend.md)   | App Router / Pages Router / RSC ont-ils encore la même forme, ou une nouvelle stratégie de rendu a-t-elle émergé ? |
| Défaillances IA par technologie | [06-niveau-6-ia.md](tech-ila/06-niveau-6-ia.md)               | Les modèles produisent-ils encore les mêmes erreurs types sur ces technos, ou la liste est-elle obsolète ?         |
| Économie du serverless          | [04-niveau-4-systemes.md](tech-ila/04-niveau-4-systemes.md)   | Les ordres de grandeur de coût donnés sont-ils encore réalistes chez les fournisseurs actuels ?                    |
| Threads virtuels Java           | [05-niveau-5-transfert.md](tech-ila/05-niveau-5-transfert.md) | Le statut (preview, stable, par défaut) a-t-il changé depuis la dernière revue ?                                   |
| Express 4 vs 5                  | [03-niveau-3-backend.md](tech-ila/03-niveau-3-backend.md)     | La version majeure recommandée par défaut a-t-elle changé ?                                                        |

Ce tableau est aussi l'index des conditions de péremption : les fiches concernées portent un champ « Se périme si : » qui dit ce qui déclencherait leur révision.

Chaque revue met à jour `last_reviewed` dans le front-matter du ou des fichiers concernés, et `last_counted` quand le rituel de recomptage a été exécuté en entier.
