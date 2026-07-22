---
stability: intemporel
---

# CAHIER DES CHARGES : RASENGAN ENGINE

Temps de lecture ~14 min

## PRÉREQUIS

```
Node.js    : v20+
npm      : v10+ (inclus avec Node.js)
Variables env : aucune
Outils externes: aucun

# Installation
$ npm install

# Lancer le moteur
$ node src/index.js

# Lancer les tests
$ npm test
```

Pas de build step, pas de transpilation. Du JS pur, Node en direct.

---

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Naruto veut un simulateur de combat textuel. Chaque ninja a des stats (chakra, vitesse, force), une liste de jutsus, et un style de combat. Le moteur calcule les dégâts, gère les cooldowns, résout les esquives, et produit un log de combat lisible. Naruto affronte Sasuke, Itachi affronte Pain, Gaara défend contre une attaque surprise : le moteur tourne, les dés roulent, le résultat s'affiche dans ta console.

Ce que tu dois voir tourner à la fin :

```
$ node src/index.js

[COMBAT] Naruto (Uzumaki) vs Sasuke (Uchiha)
[TOUR 1] Naruto utilise Rasengan : 87 dégâts | Sasuke esquive (prob: 32%)
[TOUR 2] Sasuke utilise Chidori : 112 dégâts | Naruto bloqué (chakra: 140/200)
[TOUR 3] Naruto utilise Rasengan Ōdama : CRITIQUE x1.8 => 156 dégâts
[FIN] Sasuke KO au tour 3. Chakra restant de Naruto : 68/200.

$ npm test
PASS tests/fighter.test.js (16 tests)
PASS tests/jutsu.test.js (14 tests)
PASS tests/combat.test.js (20 tests)
PASS tests/rng.test.js (8 tests)
```

Ce projet est le premier. Tu pars d'une page blanche. Tu construis tout de zéro, sans framework, sans bibliothèque externe, juste du JS pur et des décisions de conception.

## POURQUOI CE PROJET EXISTE

Ce projet force à utiliser la programmation fonctionnelle comme outil réel, pas comme exercice académique. Voilà ce qu'il teste précisément :

- **penser en fonctions pures (entrée → sortie, jamais de mutation cachée)** : un moteur de combat où chaque tour modifie directement un objet global est impossible à tester et impossible à débugger. Ici, chaque fonction reçoit un état, retourne un nouvel état. L'ancien état est toujours disponible.
- **composer des comportements plutôt qu'empiler des conditions** : un ninja n'a pas un `if` par jutsu. Il a une liste de fonctions. Le moteur les appelle dans l'ordre.
- **séparer ce qui change de ce qui reste stable** : les stats d'un ninja changent à chaque tour. La logique qui calcule les dégâts, elle, ne change pas. Ce sont deux choses différentes, dans deux fichiers différents.

## LES 4 MODULES QUE CE PROJET COUVRE, ET OÙ ILS SE VOIENT DANS LE CODE

### `01_fundamentals` : les bases qui tiennent

**Où ça se voit** : partout. Les données de chaque ninja sont des objets JS. Les jutsus sont des fonctions. Les HOF (`map`, `filter`, `reduce`) remplacent toutes les boucles manuelles.
**Pourquoi c'est nécessaire ici** : sans une vraie maîtrise des objets, des fonctions et des closures (une fonction qui mémorise une variable de son contexte parent, même après que ce contexte a disparu), le moteur devient un nid de bugs d'état.

### `07_math_basics` : les maths qui servent vraiment

**Où ça se voit** : `src/utils/rng.js` (RNG = Random Number Generator, générateur de nombres aléatoires), `src/utils/cooldownCycle.js`.
**Pourquoi c'est nécessaire ici** : les critiques, les esquives, les ratés sont pilotés par des probabilités. Les cooldowns des jutsus utilisent l'arithmétique modulaire (le modulo : reste de la division entière, utile pour créer des cycles). Sans ça, le combat est soit déterministe (ennuyeux), soit aléatoire sans logique (injuste).

### `11_functional_js` : coder sans effets de bord

**Où ça se voit** : `src/engine/combat.js`, `src/engine/turnResolver.js`. Chaque tour retourne un nouvel état de combat. Jamais de mutation directe sur les stats.
**Pourquoi c'est nécessaire ici** : si un ninja est muté directement à chaque tour, rejouer le combat depuis le tour 2 devient impossible. La testabilité exige l'immutabilité (le fait de ne jamais modifier un objet existant, de toujours en créer un nouveau).

### `13_design_patterns` : les recettes qui structurent

**Où ça se voit** : `src/fighters/fighterFactory.js` (Factory pattern), `src/jutsus/` (Strategy pattern).
**Pourquoi c'est nécessaire ici** : le Factory pattern (une fonction qui crée des objets sans exposer comment ils sont construits) permet de créer Naruto, Sasuke ou Gaara avec la même interface. Le Strategy pattern (échanger un algorithme à la volée) permet de brancher n'importe quel jutsu sur n'importe quel ninja sans modifier le moteur.

### Résumé visuel

```
01_fundamentals  --> structure des fighters, HOF dans combat.js
07_math_basics   --> rng.js (probabilités), cooldownCycle.js (modulo)
11_functional_js  --> turnResolver.js (immutabilité, pas de mutation d'état)
13_design_patterns --> fighterFactory.js (Factory), jutsus/ (Strategy)
```

## FLUX D'APPEL : QUI APPELLE QUI, DANS QUEL ORDRE

```
src/index.js
 --> fighterFactory.createFighter("naruto")  // crée un fighter Naruto
 --> fighterFactory.createFighter("sasuke")  // crée un fighter Sasuke
 --> combat.start(naruto, sasuke)       // lance le combat
    --> turnResolver.resolve(state)    // résout le tour courant
       --> jutsuRegistry.getJutsu(...) // récupère le jutsu actif
       --> rng.roll(probability)    // tire le dé (esquive, crit)
       --> damageCalc.compute(...)   // calcule les dégâts
       --> cooldownCycle.tick(...)   // met à jour les cooldowns
    --> combat.nextTurn(newState)     // passe au tour suivant
 --> combatLogger.printResult(finalState)  // affiche le résultat final
```

Chaque flèche est un appel de fonction. Chaque fonction reçoit ce dont elle a besoin en paramètre, retourne un résultat, ne modifie rien en dehors d'elle.

## L'ARCHITECTURE DU CODE, FICHIER PAR FICHIER

```
src/
├── fighters/
│  ├── fighterFactory.js
│  └── fighterStats.js
│
├── jutsus/
│  ├── jutsuRegistry.js
│  ├── narutoJutsus.js
│  └── sasukeJutsus.js
│
├── engine/
│  ├── combat.js
│  ├── turnResolver.js
│  └── damageCalc.js
│
├── utils/
│  ├── rng.js
│  └── cooldownCycle.js
│
├── logger/
│  └── combatLogger.js
│
└── index.js

tests/
├── fighter.test.js
├── jutsu.test.js
├── combat.test.js
└── rng.test.js
```

### `src/fighters/fighterFactory.js`

**Ce que ça fait** : crée un objet ninja valide à partir d'un nom ou d'une config.
**Entrée** : un identifiant (`"naruto"`, `"sasuke"`) ou un objet de config brut.
**Sortie** : un objet fighter complet avec stats initiales, liste de jutsus, et style de combat.

### `src/fighters/fighterStats.js`

**Ce que ça fait** : définit les stats de base de chaque ninja connu (chakra max, vitesse, force, seuils de critique).
**Entrée** : rien (données statiques).
**Sortie** : un objet de stats par ninja.

### `src/jutsus/jutsuRegistry.js`

**Ce que ça fait** : stocke tous les jutsus disponibles, indexés par nom. Chaque jutsu est une fonction (Strategy pattern).
**Entrée** : un nom de jutsu.
**Sortie** : la fonction correspondante, prête à être appelée.

### `src/jutsus/narutoJutsus.js` et `sasukeJutsus.js`

**Ce que ça fait** : définit les jutsus spécifiques à chaque ninja. Chaque jutsu est une fonction pure : elle reçoit l'état du combat, retourne les dégâts calculés et les effets secondaires (stun, buff, cooldown).
**Entrée** : l'état du combat au moment du tour.
**Sortie** : `{ damages: number, effects: [], cooldown: number }`.

### `src/engine/combat.js`

**Ce que ça fait** : orchestre la boucle de combat. Appelle `turnResolver` en boucle jusqu'à ce qu'un fighter soit KO. Ne calcule rien lui-même.
**Entrée** : deux fighters, les options de combat (nombre de tours max, etc.).
**Sortie** : l'état final du combat (`{ winner, loser, turns: [...], finalChakra: {...} }`).

### `src/engine/turnResolver.js`

**Ce que ça fait** : résout un seul tour. Détermine qui attaque, quel jutsu est utilisé, si l'esquive se produit, et retourne le nouvel état.
**Entrée** : l'état actuel du combat.
**Sortie** : le nouvel état après le tour (objet différent, pas muté).

### `src/engine/damageCalc.js`

**Ce que ça fait** : calcule les dégâts finaux d'une attaque selon la force de l'attaquant, la vitesse du défenseur, et si c'est un coup critique.
**Entrée** : stats de l'attaquant, stats du défenseur, résultat du jet de dé.
**Sortie** : un nombre de dégâts.

### `src/utils/rng.js`

**Ce que ça fait** : tire un nombre aléatoire et décide si un événement probabiliste se produit (esquive, critique, raté).
**Entrée** : une probabilité (entre 0 et 1).
**Sortie** : `true` (l'événement se produit) ou `false`.

### `src/utils/cooldownCycle.js`

**Ce que ça fait** : gère les cooldowns des jutsus. Un jutsu avec cooldown 3 ne peut être réutilisé qu'après 3 tours.
**Entrée** : l'état des cooldowns actuels, le numéro du tour.
**Sortie** : l'état des cooldowns mis à jour.

### `src/logger/combatLogger.js`

**Ce que ça fait** : formate et affiche les événements du combat (chaque tour, l'issue, les dégâts) dans un format lisible.
**Entrée** : l'état final du combat ou un événement de tour.
**Sortie** : rien de retourné, affichage dans le terminal.

### `src/index.js`

**Ce que ça fait** : point d'entrée. Crée deux fighters, lance le combat, affiche le résultat.

## L'ORDRE DE CONSTRUCTION (PAR OÙ COMMENCER)

```
1. src/utils/rng.js     --> zéro dépendance, testable immédiatement
2. src/utils/cooldownCycle.js --> idem, zéro dépendance
3. src/fighters/fighterStats.js --> données statiques, pas de logique
4. src/jutsus/narutoJutsus.js + sasukeJutsus.js --> fonctions pures, testables seules
5. src/fighters/fighterFactory.js --> dépend de fighterStats + jutsus
6. src/jutsus/jutsuRegistry.js  --> dépend des jutsus
7. src/engine/damageCalc.js    --> dépend de rng.js
8. src/engine/turnResolver.js   --> dépend de tout ce qui précède
9. src/engine/combat.js      --> orchestre turnResolver
10. src/logger/combatLogger.js  --> formate le résultat final
11. src/index.js         --> branche tout ensemble
```

Règle : chaque fichier est testé avant de passer au suivant. Tu ne construis pas l'étage au-dessus si le sol n'est pas solide.

## ESTIMATION DE TEMPS ET ZONES DE RÉSISTANCE

**Durée totale estimée** : 12 à 18 heures de travail réel.

| Étape                     | Durée estimée | Zone de résistance                                  |
| ------------------------- | ------------- | --------------------------------------------------- |
| rng.js + cooldownCycle.js | 1h            | Faible                                              |
| fighterStats + jutsus     | 2h            | Faible                                              |
| fighterFactory.js         | 1h30          | Moyenne : penser l'interface sans la sur-compliquer |
| damageCalc.js             | 1h            | Faible                                              |
| turnResolver.js           | 3-4h          | **Haute** : garder l'immutabilité sous pression     |
| combat.js                 | 2h            | Moyenne : la boucle de jeu et sa condition d'arrêt  |
| logger + index            | 1h            | Faible                                              |
| Tests complets            | 2-3h          | Moyenne : tester le RNG sans le rendre déterministe |

Le point de résistance majeur est `turnResolver.js`. C'est là que la tentation de muter l'état directement est la plus forte. Si tu sens que tu écris `fighter.chakra -= damages`, arrête-toi et relis le module `11_functional_js`.

## EXEMPLE DE TEST REMPLI

```js
// tests/fighter.test.js
import { createFighter } from "../src/fighters/fighterFactory.js";

describe("fighterFactory", () => {
  test("crée un fighter Naruto avec les bonnes stats de base", () => {
    const naruto = createFighter("naruto");

    expect(naruto.name).toBe("Naruto Uzumaki");
    expect(naruto.chakra).toBe(200); // chakra initial = chakra max
    expect(naruto.chakraMax).toBe(200);
    expect(naruto.speed).toBeGreaterThan(0);
    expect(Array.isArray(naruto.jutsus)).toBe(true);
    expect(naruto.jutsus.length).toBeGreaterThan(0);
  });

  test("retourne un nouvel objet à chaque appel (pas de référence partagée)", () => {
    const n1 = createFighter("naruto");
    const n2 = createFighter("naruto");

    n1.chakra = 0; // on mute n1 directement
    expect(n2.chakra).toBe(200); // n2 ne doit pas être affecté
  });
});

// tests/combat.test.js
import { startCombat } from "../src/engine/combat.js";
import { createFighter } from "../src/fighters/fighterFactory.js";

describe("combat", () => {
  test("retourne toujours un gagnant et un perdant", () => {
    const naruto = createFighter("naruto");
    const sasuke = createFighter("sasuke");
    const result = startCombat(naruto, sasuke);

    expect(result.winner).toBeDefined();
    expect(result.loser).toBeDefined();
    expect(result.winner).not.toEqual(result.loser);
  });

  test("ne modifie pas les fighters passés en entrée (immutabilité)", () => {
    const naruto = createFighter("naruto");
    const sasuke = createFighter("sasuke");
    const chakraAvant = naruto.chakra;

    startCombat(naruto, sasuke);

    expect(naruto.chakra).toBe(chakraAvant); // l'original n'est pas touché
  });
});
```

## CAS LIMITES À TESTER OBLIGATOIREMENT

Ces cas doivent avoir un test chacun. Sans eux, le moteur a des angles morts :

1. **Combat avec deux fighters identiques** : `startCombat(naruto, naruto)` : le moteur ne doit pas boucler infiniment ni planter.
2. **Jutsu avec cooldown actif** : un jutsu demandé alors que son cooldown n'est pas terminé doit être remplacé par l'attaque de base, pas ignoré.
3. **Chakra à 0 avant la fin** : si un fighter tombe à 0 chakra, le combat s'arrête immédiatement, même si le tour n'est pas terminé.
4. **RNG en mode déterministe pour les tests** : `rng.js` doit accepter une seed (valeur initiale fixe) ou un mode "test" qui retourne des valeurs prédéfinies, pour que les tests de combat ne soient pas aléatoires.

## LES RÈGLES QUE TU NE DOIS JAMAIS CASSER

1. **Zéro mutation directe sur un fighter ou sur l'état du combat.** `fighter.chakra -= x` est interdit. Tu crées un nouvel objet à chaque modification.
2. **Zéro `if` par jutsu dans le moteur.** Le moteur ne connaît pas les noms des jutsus. Il appelle une fonction. C'est la fonction qui sait ce qu'elle fait.
3. **Zéro bibliothèque externe.** Pas de lodash, pas de ramda. Tu construis `pipe` et `compose` toi-même si tu en as besoin.
4. **`rng.js` doit supporter un mode déterministe pour les tests.** Sans ça, les tests de combat sont flaky : parfois verts, parfois rouges selon le résultat aléatoire. Implémente une seed ou un mock injectable (`rng.setMode('test', [0.1, 0.9, 0.5, ...])`) avant d'écrire le premier test de combat. C'est non-négociable.

## CE QUE TU NE FAIS PAS DANS CE PROJET

- Pas d'interface graphique, pas d'animation, pas de Canvas.
- Pas de persistance (sauvegarde entre deux sessions).
- Pas de multijoueur réseau.
- Pas de TypeScript (ce module arrive plus tard dans le curriculum).

## LES ADR

```
ADR/001-pourquoi-strategy-pattern-pour-les-jutsus.md
ADR/002-pourquoi-immutabilite-totale-sur-letat-de-combat.md
ADR/003-pourquoi-rng-injectable-pour-les-tests.md
```

Exemple rempli :

```markdown
# ADR 001 : Strategy pattern pour les jutsus

## Contexte

Chaque ninja a des jutsus différents. Une approche naïve mettrait un `switch`
ou une série de `if` dans le moteur pour traiter chaque jutsu spécifiquement.

## Décision

Chaque jutsu est une fonction avec la même signature :
`(combatState) => { damages, effects, cooldown }`.
Le moteur appelle la fonction sans savoir ce qu'elle fait.

## Alternatives considérées

- Un `switch` centralisé dans turnResolver.js : rejeté, parce qu'ajouter un nouveau
  jutsu obligerait à modifier le moteur. Violation de l'OCP (Open/Closed Principle).
- Une classe Jutsu avec héritage : rejeté, sur-ingénierie pour ce cas. Une fonction
  suffit.

## Conséquences

- Ajouter un nouveau jutsu = créer une fonction dans le bon fichier + l'enregistrer
  dans jutsuRegistry.js. Le moteur n'est jamais touché.
- Les jutsus sont testables individuellement, sans lancer le moteur entier.
```

## QUAND EST-CE QUE LE PROJET EST VRAIMENT FINI

```
[ ] un combat complet s'affiche dans la console avec le format exact montré en intro
[ ] les 4 fichiers de tests passent avec au moins 50 tests au total
[ ] aucune mutation directe d'état nulle part dans src/
[ ] rng.js supporte un mode déterministe (seed ou mock injectable) : vérifié dans rng.test.js
[ ] les tests de combat sont stables (relancer npm test 3 fois : toujours le même résultat)
[ ] les 4 cas limites listés ont chacun un test
[ ] fighterFactory crée des fighters indépendants (pas de référence partagée)
[ ] les 3 ADR sont remplis avec contexte, décision, alternatives, conséquences
[ ] POSTMORTEM.md documente au moins une décision difficile prise pendant le dev
[ ] TDD_JOURNAL.md trace l'ordre dans lequel les tests ont été écrits
```

## SÉCURITÉ (gate obligatoire)

Un projet qui marche mais qui est vulnérable n'est pas fini. Traite ces exigences OWASP contextuelles avant de livrer.

- Validation d'entrée (OWASP A03 - Injection) : le moteur doit rejeter proprement une commande/config malformée sans exposer sa stack interne.
- Déni de service (OWASP A05) : borner toute boucle/récursion pilotée par l'entrée pour éviter un blocage du process.

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
