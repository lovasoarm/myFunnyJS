---
perennite: evolutif
stability: moderne
duree_de_vie_estimee: 3-5 ans
raison: tsconfig et outils évoluent, la logique de migration reste.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

# POURQUOI CE MODULE MÉRITE TON TEMPS


> **Périmètre**. `04_typescript_tooling` couvre `tsconfig`, fichiers `.d.ts`, migration progressive et intégration build. Les types complexes (mapped, conditional, template literal) vivent dans `03_ts_advanced/`. Deux angles distincts, pas un doublon.


> **Durée de vie : 5+ ans.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.
Temps de lecture ~9 min

Michael Scofield passe des mois à préparer l'évasion de Fox River. Pas en improvisant. Chaque mur, chaque conduit, chaque garde a son plan documenté, tatoué sur son corps, prévu à l'avance. Le plan ne dit pas juste "on s'évade". Il dit précisément QUI fait QUOI, QUAND, et QUOI FAIRE SI ça part en vrille.

TypeScript de base, tu connais déjà : types, interfaces, generics. Ce module va plus loin. Il s'attaque à la question que personne pose en premier : comment typer du code que TU n'as PAS écrit, comment configurer le compilateur pour qu'il bosse pour toi au lieu de te freiner, et comment migrer un projet JS existant sans tout casser en une nuit. C'est le plan d'évasion. Pas l'envie de s'évader.

---

## CE QUE C'EST VRAIMENT

Trois problèmes concrets, trois solutions :

```
"j'utilise une lib JS sans types"   --> fichiers de déclaration (.d.ts)
"mon compilateur TS fait n'importe quoi" --> comprendre tsconfig.json en profondeur
"j'ai un vieux projet JS à migrer"   --> stratégie de migration progressive
```

```
         [PROJET RÉEL]
            |
    +--------------+--------------+
    |       |       |
 libs sans types  config TS   code JS legacy
    |       |       |
    v       v       v
  .d.ts files  tsconfig.json  migration .js --> .ts
```

Ces trois sujets, c'est ce qui sépare un dev qui "utilise TypeScript" d'un dev qui "maîtrise TypeScript dans un vrai projet".

---

## CE QUI PREND CHER QUAND ÇA MANQUE

Pas de fichiers de déclaration compris :
```
tu importes une lib JS sans types --> TS te hurle dessus à chaque ligne
--> tu mets `any` partout pour faire taire l'erreur
--> tu viens de désactiver TypeScript sans le savoir
```

Pas de config compilateur comprise :
```
tsconfig.json copié-collé d'un tuto --> options strictes désactivées sans le savoir
--> des bugs que TypeScript était censé attraper passent à travers
--> tu paies le coût de TS (la lourdeur syntaxique) sans en avoir les bénéfices
```

Pas de stratégie de migration :
```
"on va tout réécrire en TS ce weekend" --> 3 semaines plus tard, toujours pas fini
--> le projet est dans un état hybride cassé, ni JS propre ni TS propre
```

---

## OÙ ÇA VIT DANS UN VRAI SYSTÈME

```
          [TON CODE TYPESCRIPT]
              |
       +-------------+-------------+
       |              |
    [DÉPENDANCES NPM]      [COMPILATEUR TSC]
       |              |
   certaines ont des types   lit tsconfig.json
   certaines n'en ont pas    applique les règles strictes
       |              |
       v              v
    besoin de .d.ts     détermine ce qui compile
    pour les typer      et ce qui est rejeté
```

Un projet TypeScript en prod, c'est jamais 100% du code écrit par toi avec des types parfaits dès le départ. C'est un mélange : tes types, des types de libs externes, parfois du JS legacy pas encore migré. Ce module te donne les outils pour gérer ce mélange sans paniquer.

---

## QUAND ÇA DEVIENT IMPORTANT, QUAND ÇA DEVIENT INDISPENSABLE

```
tu écris du TS sur un projet greenfield (parti de zéro)   --> les bases (module 14) suffisent
tu utilises une lib sans types officiels           --> .d.ts devient nécessaire
ton équipe se dispute sur le niveau de strictness du projet --> tsconfig.json devient un sujet politique
tu hérites d'un projet JS de 50 000 lignes à migrer      --> stratégie de migration obligatoire
```

Comment tu sais que t'en as besoin : le jour où tu tapes `// @ts-ignore` ou `any` pour la troisième fois dans la même semaine juste pour avancer, t'as un problème de compréhension de la toolchain TS, pas un problème de syntaxe.

---

## POURQUOI CETTE APPROCHE PLUTÔT QU'UNE AUTRE

Alternative à comprendre les `.d.ts` : tout caster en `any` et avancer. Ça marche, sur le moment. Le prix : tu perds toute la valeur de TypeScript sur ce bout de code, et le bug que TS aurait attrapé à la compilation, tu le découvres en prod à la place.

Alternative à une vraie config tsconfig : copier-coller la config d'un projet trouvé sur GitHub. Ça marche, jusqu'au jour où une option mal comprise désactive silencieusement une protection dont tu avais besoin.

Alternative à une stratégie de migration : tout réécrire d'un coup. Ça marche sur un petit projet. Sur un gros projet en prod, c'est le meilleur moyen de paralyser l'équipe pendant des semaines et d'introduire une masse de régressions d'un coup.

```
gain de cette approche --> contrôle total sur ce qui est typé, comment, et à quel rythme
perte de cette approche --> ça demande de comprendre des mécanismes qu'un simple "any" permettrait d'ignorer
```

---

## MODERNE, LEGACY, OU INTEMPOREL

```
.d.ts          --> intemporel tant que JS et TS coexistent. Le besoin ne disparaît pas.
tsconfig.json (concept)  --> intemporel. Les options précises évoluent, le besoin de configurer reste.
migration JS vers TS   --> sujet permanent. Il y aura toujours du JS legacy à migrer quelque part.
```

TypeScript lui-même évolue chaque année (nouvelles features de type, nouvelles options de compilateur). Mais les TROIS problèmes que ce module traite (typer l'externe, configurer le compilateur, migrer du legacy) sont structurels. Ils existeront tant que TypeScript existera, parce qu'ils découlent de la nature même du langage : une surcouche optionnelle au-dessus de JS.

---

## NOYAU DUR OU PÉRIPHÉRIQUE

```
.d.ts        --> noyau dur dès que tu touches à une lib sans types officiels (fréquent).
tsconfig.json     --> noyau dur. Chaque projet TS en a un, le comprendre n'est pas optionnel.
migration JS vers TS --> périphérique si tu démarres toujours en greenfield, noyau dur sinon.
```

---

## QUAND L'APPRENDRE DANS TA PROGRESSION

```
prérequis avant ce module :
14_typescript complet --> types, interfaces, generics, utility types : la base doit être solide
06_modules       --> import/export, ESM vs CJS : indispensable pour comprendre la résolution de modules en TS
15_runtime_env      --> comprendre Node et CommonJS aide à comprendre pourquoi certaines libs n'ont pas de types ESM propres
```

Ce qui devient plus simple après ce module :
```
22_security       --> tu lis et comprends les types stricts des libs de sécurité sans paniquer
n'importe quel projet en équipe --> tu négocies un tsconfig.json en connaissance de cause, pas à l'aveugle
contribution open source --> tu sais écrire un .d.ts pour proposer des types à une lib qui n'en a pas
```

---

## ERREURS CLASSIQUES DE DÉBUTANT

```
- mettre `any` dès qu'une erreur de type apparaît, sans comprendre pourquoi elle apparaît
- copier un tsconfig.json trouvé en ligne sans lire une seule option
- vouloir migrer un projet JS entier en TS en un seul gros commit
- confondre `type` et `interface` au moment d'écrire un .d.ts (vu dans le module 14, mais l'erreur revient ici)
- désactiver `strict: true` parce que "ça génère trop d'erreurs", au lieu de les corriger une par une
```

## IDÉES REÇUES

```
"si une lib n'a pas de types, je peux pas l'utiliser proprement en TS"
--> faux. Tu peux écrire ses types toi-même dans un .d.ts, ou en trouver via DefinitelyTyped (@types/...)

"tsconfig.json c'est juste de la config qu'on touche une fois et qu'on oublie"
--> faux. C'est un document vivant qui doit évoluer avec la maturité du projet et de l'équipe

"migrer vers TS, c'est tout ou rien"
--> faux. TS permet une migration fichier par fichier, grâce à `allowJs` et `checkJs`
```

---

## POURQUOI ÇA TIENDRA ENCORE DANS 5 ANS

L'écosystème npm continuera d'avoir des libs sans types parfaits, donc le besoin de `.d.ts` reste. Le compilateur TS continuera d'avoir des dizaines d'options qui changent le comportement du typage, donc comprendre `tsconfig.json` reste indispensable pour ne pas subir sa config. Et tant qu'il existe du JS écrit avant l'adoption de TS dans une équipe, la question de la migration progressive restera posée.

Ce qui changera : les options précises de tsconfig (certaines apparaissent, d'autres deviennent obsolètes), les méthodes recommandées pour écrire des `.d.ts` (les outils s'améliorent).
Ce qui ne changera pas : le besoin de typer l'externe, de contrôler la rigueur du compilateur, et de faire cohabiter du code typé avec du code qui ne l'est pas encore.

Michael Scofield avait un plan B pour chaque étape. Ce module, c'est ton plan B pour tout ce que TypeScript ne couvre pas tout seul, par défaut, sans configuration réfléchie.
