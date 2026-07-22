---
perennite: evolutif
stability: moderne
duree_de_vie_estimee: 3-5 ans
raison: Formats d'i18n bougent, la posture (ne jamais concaténer) reste.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

# POURQUOI CE MODULE MÉRITE TON TEMPS : I18N

> **Durée de vie : 5+ ans.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.
Temps de lecture ~9 min

Ton app marche super bien, jusqu'à ce qu'un shinobi japonais voit une date affichée au format américain et la lise complètement à l'envers. Jusqu'à ce qu'un shinobi allemand voie un prix avec une virgule à la place d'un point et pense que ton jutsu coûte 1000 fois moins cher qu'en réalité. Jusqu'à ce qu'un shinobi arabe découvre que ta pluralisation codée pour le français explose dès qu'il y a plus de deux résultats, parce que sa langue a six formes plurales et que ton code n'en gère qu'une.

i18n (internationalisation : "i" + 18 lettres + "n", le nombre de lettres entre le i et le n dans "internationalization") n'est pas juste "traduire les textes". C'est une architecture entière qui doit être pensée dès le départ, ou qui coûte une réécriture complète plus tard.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Coder une app uniquement pour une langue et une région semble plus simple au début. Mais le jour où il faut ajouter une deuxième langue, le dev découvre que les textes sont hardcodés (écrits en dur) partout dans le code, que les dates et les nombres sont formatés à la main avec des suppositions qui ne marchent que pour une seule région, et que chaque ajout de langue devient une chasse au texte en dur dans tout le codebase.

L'i18n résout ce problème en posant une architecture claire dès le départ : des clés de traduction organisées par namespaces (espaces de noms qui regroupent les traductions par contexte), des fallbacks (langue de repli si une traduction manque), et l'usage des APIs natives de formatage (`Intl.DateTimeFormat`, `Intl.NumberFormat`) qui gèrent automatiquement les conventions régionales sans que tu aies à les coder à la main.

Ce module règle aussi un piège sournois : la pluralisation. "1 résultat" vs "2 résultats" semble trivial en français, mais certaines langues ont 3, 4, voire 6 formes plurales différentes selon le nombre exact. Une app qui code la pluralisation en dur pour le français plante complètement dès qu'elle doit gérer une langue avec des règles de pluriel différentes.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui hardcode ses textes directement dans le JSX ou le HTML découvre, le jour où le jutsu doit s'internationaliser, qu'il doit fouiller tout le codebase pour extraire chaque texte, sans garantie d'en avoir trouvé 100%. C'est un chantier qui aurait coûté zéro effort supplémentaire s'il avait été pensé dès le départ, et qui coûte des semaines une fois le jutsu déjà construit.

Le shinobi final souffre directement d'une mauvaise gestion i18n : un prix mal formaté selon sa région peut littéralement lui faire croire à une erreur de prix. Une date au format `MM/DD/YYYY` lue par quelqu'un habitué au format `DD/MM/YYYY` peut être interprétée à l'envers, avec des conséquences concrètes si cette date concerne une échéance ou un rendez-vous.

Et sur le plan business, une mauvaise i18n donne une impression d'amateurisme immédiate à un shinobi international : un texte mal pluralisé, une devise mal formatée, ça signale que le jutsu n'a jamais vraiment été pensé pour lui, même s'il a techniquement été "traduit" (traduire les mots sans adapter les formats, c'est de la décoration, pas de l'internationalisation).

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
texte affiché au shinobi             --> clé de traduction   --> jamais de texte en dur
date d'expiration, d'événement, de rendez-vous     --> Intl.DateTimeFormat  --> format selon la locale
prix, statistique, quantité affichée          --> Intl.NumberFormat   --> séparateurs corrects par région
compteur de résultats, de notifications, d'éléments   --> pluralisation     --> règles spécifiques par langue
traduction manquante pour une nouvelle langue      --> fallback        --> langue de repli sans erreur visible
```

L'i18n touche absolument tout ce qui s'affiche au shinobi : pas juste les textes de bouton, mais chaque date, chaque nombre, chaque message qui dépend du contexte de quantité.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Le besoin est intemporel dès qu'un jutsu vise plusieurs marchés. Ce qui a beaucoup évolué, c'est la maturité des outils natifs : les APIs `Intl` du JS moderne couvrent aujourd'hui une grande partie des besoins qui demandaient autrefois des bibliothèques externes lourdes.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, gérer les dates et les nombres selon la locale demandait presque toujours une bibliothèque externe, parce que JS natif n'offrait pas grand-chose de fiable pour ça. Aujourd'hui, l'API `Intl` (intégrée nativement au langage) gère le formatage des dates, des nombres, et même la pluralisation correcte selon la langue, sans dépendance externe, ce qui réduit le poids du bundle (le fichier JS final envoyé au navigateur) tout en gagnant en fiabilité.

La gestion des clés de traduction a aussi évolué : avec TypeScript, il devient possible de typer les clés de traduction elles-mêmes, ce qui veut dire qu'utiliser une clé qui n'existe pas devient une erreur de compilation détectée immédiatement, plutôt qu'un texte manquant découvert seulement en prod.

---

## 6) NOYAU DUR DU MÉTIER ?

Pas dans les 6 blocs prioritaires explicitement listés, mais directement intégré dans le mini-projet `08_trapsoul_radio`, qui combine `14_typescript`, `17_web_concepts`, `19_web_inclusive`, et `19_web_inclusive/i18n` pour une plateforme qui doit gérer plusieurs langues avec pluralisation et formats corrects par locale, en plus d'être accessible.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Tant qu'il existera des jutsus qui visent plus d'un marché linguistique (et ça ne va clairement pas s'arrêter), le besoin d'i18n restera entier. Les outils continueront de se simplifier, mais le principe architectural (jamais de texte en dur, jamais de format codé à la main pour une seule région) reste une décision de conception qui doit être prise dès le début d'un projet, pas ajoutée en urgence après coup.

---

---

## CE MODULE DANS LE CURRICULUM

**Prérequis directs :** `01_fundamentals/04_types` (Intl.DateTimeFormat et Intl.NumberFormat manipulent des types JS natifs), `17_web_concepts/06_serialization.md` (les clés de traduction sont souvent en JSON : tu dois savoir les parser proprement).

**Ce qui en dépend :** `30_mini_projects/08_trapsoul_radio` (4 locales à gérer : français, anglais, japonais, malgache : pluralisation, dates, formats numériques). Sans ce module, le mini-projet se limite à une seule langue.

**Position dans la roadmap :** Sous-dossier du module 19_web_inclusive (sur 32 modules au total) : l'i18n n'est pas un module séparé, c'est le prolongement immédiat du chapitre accessibilité de ce même module 19. Placé juste après l'accessibilité parce que les deux répondent à la même question : "est-ce que ce jutsu fonctionne pour tous les shinobis ?". Avant le realtime (module 20) parce que les deux nécessitent une architecture définie tôt dans le projet ; ajouter l'i18n après coup sur une app en prod, c'est refactorer entièrement les couches d'affichage.

**Lien avec les autres modules :** `14_typescript` : les clés de traduction typées en TypeScript (si une clé n'existe pas en traduction, erreur de compilation). `24_databases` : les préférences de langue des shinobis sont souvent persistées en base.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

L'i18n n'est pas juste de la traduction, c'est une architecture entière qui doit être pensée dès le départ. Ça casse de trois façons sans elle : textes en dur impossibles à extraire, dates et prix mal interprétés selon la région, pluralisation qui explose dès qu'une langue a des règles différentes. Ce besoin ne disparaît pas tant qu'un jutsu vise plusieurs marchés.

Maintenant, ouvre `01_i18n_basics.md`. Et arrête de coder comme si tout le monde vivait dans ton fuseau horaire et parlait ta langue.
