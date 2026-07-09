# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~9 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## GRIMOIRE : I18N

Parler toutes les langues sans tout réécrire. Ce grimoire couvre les clés de traduction, les dates et fuseaux, les formats numériques, la pluralisation, et l'organisation en vrai projet. Si un terme te paraît flou, retourne à la leçon correspondante : ce tableau résume, il ne remplace pas.

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| i18n | Internationalisation (le i, 18 lettres, puis n) : construire l'app pour parler n'importe quelle langue sans toucher au code | `t('bienvenue')` | un parchemin de jutsu écrit dans une langue codée, traduisible sans réécrire le jutsu lui-même | une chanson de Trapsoul Radio dont on change juste les sous-titres, jamais la mélodie |
| Clé de traduction | Identifiant fixe dans le code qui pointe vers un texte traduit, jamais le texte lui-même | `t('deconnexion')` | le numéro de dossier d'un prisonnier à Fox River : le numéro ne change jamais, le contenu du dossier peut être réécrit dans une autre langue | le numéro de maillot d'un joueur, fixe, même si le nom écrit dessus change selon le club |
| Namespace (i18n) | Regroupement des clés de traduction par contexte, pour éviter le fourre-tout | `t('auth.bienvenue')` | les quartiers de la prison de Fox River : bloc A, bloc B, chacun avec ses propres registres | les dossiers d'un classeur de mission Naruto : un dossier par type de jutsu, pas tout mélangé |
| Fallback (i18n) | Langue ou catégorie de repli utilisée quand la traduction demandée n'existe pas | `traductions[locale] ?? traductions['en']` | le plan B de Michael Scofield quand le tunnel prévu est bloqué : une route de secours déjà prête | le remplaçant qui rentre quand le titulaire est blessé : le match continue, personne ne reste sur le carreau |
| Locale | Combinaison langue + région qui détermine les règles de formatage (fr-FR, en-US, ja-JP) | `new Intl.NumberFormat('fr-FR')` | le carnet de mission de Naruto rédigé selon les conventions exactes de Konoha, pas juste "en japonais" en général | la réglementation du foot adaptée à chaque championnat national, pas une règle unique mondiale |
| UTC | Temps Universel Coordonné : l'heure de référence sans fuseau, sans changement été/hiver | `date.toISOString()` | l'heure du QG de l'Akatsuki, fixe, à partir de laquelle chaque membre calcule sa propre heure locale | l'heure de référence du calendrier officiel du Ballon d'Or, identique pour tous les votants peu importe leur pays |
| Timezone (fuseau horaire) | Décalage horaire local par rapport à UTC, qui peut varier selon les saisons | `Intl.DateTimeFormat(locale, { timeZone: 'Asia/Tokyo' })` | le décalage entre l'heure du QG de Garo et celle de chaque Chevalier en patrouille dans une autre ville | le décalage entre l'heure d'un match retransmis et l'heure locale du téléspectateur à l'étranger |
| Intl.DateTimeFormat | API native qui formate une date selon les règles d'une locale donnée | `formatteur.format(dateUTC)` | le traducteur officiel qui annonce l'heure du combat à chaque Chevalier dans sa propre convention locale | le commentateur qui annonce l'heure du match selon le fuseau de chaque pays qui regarde |
| Séparateur décimal | Le caractère qui sépare la partie entière et décimale d'un nombre, variable selon le pays | `1234,56` (FR) vs `1234.56` (US) | la virgule de Walter qui dose une formule au gramme près, mais écrite différemment selon le labo où on la lit | le point ou la virgule sur un tableau de score, qui désigne la même précision mais s'écrit différemment selon le pays organisateur |
| Intl.NumberFormat | API native qui formate nombres, devises et pourcentages selon une locale | `new Intl.NumberFormat('de-DE').format(1234.56)` | le bureau de change qui affiche le même montant sous la convention propre à chaque pays | la traduction automatique d'un score de match selon les habitudes d'écriture du pays qui le diffuse |
| Pluralisation | Choisir la bonne forme grammaticale d'un mot selon la quantité, variable par langue | `Intl.PluralRules('ru-RU').select(5)` | le titre exact donné à un ninja selon son nombre de victoires : pas la même formule pour 1 victoire que pour 100 / le nombre de buts annoncé au micro avec la bonne grammaire, pas juste un chiffre suivi d'un mot collé au hasard |
| Intl.PluralRules | API native qui détermine la catégorie grammaticale plurielle ("one", "few", "many", "other") | `regle.select(21)` | l'arbitre qui détermine la bonne catégorie de faute selon des règles précises, pas selon son intuition du moment | le greffier de Fox River qui classe chaque dossier dans la bonne catégorie légale selon des critères fixes, pas au feeling |
| Lazy loading (i18n) | Charger uniquement la langue ou le namespace utile, pas tout le dictionnaire d'un coup | `await import('./locales/fr.json')` | n'emporter en mission que le parchemin du jutsu dont on a besoin, pas toute la bibliothèque du village | ne sortir de l'armurerie que l'arme utile au combat du jour, pas tout le stock |
| Clé manquante | Une traduction absente dans une langue cible, qui doit être détectée avant la prod | `throw new Error('clé manquante: x')` | un Chevalier de Garo qui part en mission sans son équipement complet : ça doit être détecté à l'inspection, pas pendant le combat | un joueur convoqué sans son maillot prêt : ça se vérifie au vestiaire, pas une fois sur le terrain |

## CE QU'IL FAUT RETENIR AU-DELÀ DU TABLEAU

L'i18n repose sur un seul principe qui structure tout le reste : le code ne contient jamais de texte direct, jamais de format de date codé en dur, jamais de séparateur numérique écrit à la main. Tout passe par une clé, une locale, ou une API `Intl` native. Le jour où une nouvelle langue arrive, ça doit être un nouveau fichier ajouté, pas une chasse aux strings dans tout le codebase.

Les dates et fuseaux horaires sont la zone la plus dangereuse du module : une arithmétique de date écrite à la main ("+1 jour = +86400000 ms") fonctionne presque toujours, sauf pile le jour du changement d'heure, ce qui en fait un bug rarissime et donc jamais repéré avant la prod. Stocke toujours en UTC, formate toujours à l'affichage, jamais l'inverse.

Sur les nombres et la pluralisation, le piège commun c'est de croire que les règles du français (un point, une virgule, un "s" final) sont universelles. Elles ne le sont pas : le russe a 4 catégories plurielles, l'arabe en a 6, et `Intl.NumberFormat` / `Intl.PluralRules` existent justement pour ne jamais avoir à mémoriser ces règles toi-même.

Enfin, l'i18n en vrai projet n'est pas qu'une question de traduction : c'est aussi une question de performance (ne charger que la langue active, jamais tout le dictionnaire) et de fiabilité (détecter automatiquement les clés manquantes avant que le shinobi ne tombe sur un `undefined` en pleine interface). Une bonne i18n est invisible quand elle marche, et immédiatement visible (en pire) quand elle est bricolée.

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
