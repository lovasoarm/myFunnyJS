---
perennite: intemporel
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Encoding, timezone, floating point : bugs éternels.
---
> **Statut de pérennité :** **intemporel** | évolutif | périssable
> Statut effectif de ce module : **intemporel**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **TL;DR (4 lignes)**
> - Un dev junior code le cas passant. Un dev senior chasse les 12 cas limites AVANT qu'ils cassent la prod.
> - Ce module liste, par catégorie (I/O, temps, réseau, unicode, concurrence…), les pièges qui font tomber les apps sérieuses.
> - Lecture rapide : la checklist en fin de module. Lecture complète : les histoires de guerre associées à chaque cas.
> - Un dev qui ne pense pas edge case coûte plus cher en incidents qu'il ne rapporte en features.

> **CE MODULE RÉUTILISE** : tests (06_testing), debugging (04_debugging), erreurs (05_error_handling), math (07_math_basics). Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI EDGE CASES MÉRITE TON TEMPS

> **Durée de vie : intemporel.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Temps de lecture ~12 min

JS est un langage construit en 10 jours.
Brendan Eich l'a créé en mai 1995 avec des décisions rapides, des compatibilités forcées, et des comportements qu'on ne pouvait plus changer après sans casser la moitié d'internet.

Le résultat : un langage puissant, universel, et truffé de zones sombres.
Ces zones sombres ne sont pas des bugs. Ce sont des comportements spécifiés, documentés, et permanents.
Ils sont en prod. Dans ton code. Aujourd'hui.

---

## CE QUI CASSE SANS CE MODULE

```
SCÉNARIO 1 : le calcul de score du Ballon d'Or

const votes = [7.1, 8.2, 9.0, 6.8];
const total = votes.reduce((acc, v) => acc + v, 0);
console.log(total); // 31.100000000000005
          // pas 31.1
          // et maintenant le classement est faux
```

```
SCÉNARIO 2 : la vérification d'identité de T-Bag

function isAdmin(user) {
 return user.role == 'admin'; // == et pas ===
}

isAdmin({ role: 0 });  // false -- ok
isAdmin({ role: '' }); // false -- ok
isAdmin({ role: [] }); // false -- ok
isAdmin({ role: null }); // false -- ok... mais pour la mauvaise raison
isAdmin({ role: undefined }); // false -- ok... mais undefined == null == false en coercition
// au moins un de ces cas va te surprendre un jour
```

```
SCÉNARIO 3 : la pollution de prototype en prod

// un input utilisateur malveillant qui arrive dans ton API
const payload = JSON.parse('{"__proto__": {"isAdmin": true}}');
Object.assign({}, payload); // pollue Object.prototype

const req = {};
console.log(req.isAdmin); // true
             // n'importe quel objet est admin maintenant
             // l'app entière est compromise
```

Ces trois bugs sont réels. Ils arrivent en production dans des apps écrites par des devs qui "connaissent JavaScript".

---

## LE PROBLÈME RÉEL QUE CE MODULE RÉSOUT

Il y a deux types de devs JS :
- ceux qui savent que `NaN !== NaN` et qui comprennent pourquoi
- ceux qui tombent dessus à 2h du matin et qui ne comprennent pas ce qui se passe

Ce module transforme les comportements surprenants de JS en connaissances prévisibles.
Pas pour mémoriser des curiosités. Pour savoir exactement quand ton code peut trahir tes intentions.

```
SANS CE MODULE            AVEC CE MODULE
--------------------------      --------------------------
bug inexpliqué en prod        comportement anticipé et géré
"JS est bizarre"           "je sais exactement pourquoi ça fait ça"
correction à l'aveugle        correction ciblée avec la vraie cause
peur des types dynamiques      maîtrise des conversions implicites
```

---

## OÙ ÇA APPARAÎT EN PRODUCTION

**`NaN`, `null`, `undefined` :** dans toute opération sur des données externes (API, formulaire, DB). Une valeur absente peut prendre trois formes différentes en JS, et chacune se comporte différemment.

**Arithmétique flottante :** dans tout système financier, système de scoring, ou calcul de statistiques. `0.1 + 0.2` ne donne pas `0.3`. Dans un système de votes pondérés, ça crée des classements incorrects.

**Coercions implicites :** dans toutes les comparaisons avec `==`, les concaténations mixtes, les conditions qui utilisent des valeurs non-booléennes. Le compilateur TypeScript en attrape une partie : pas toutes.

**Prototype chain :** dans tout système qui utilise `Object.assign`, `JSON.parse` sur des données non fiables, ou des opérations sur des objets créés sans `Object.create(null)`. La pollution de prototype est une vraie vulnérabilité de sécurité (CVE répertoriés, apps en prod compromises).

---

## POURQUOI CES COMPORTEMENTS EXISTENT

Ils ne sont pas des erreurs de conception au sens strict. Ils sont les conséquences de trois décisions historiques :

**1. Typage dynamique avec coercition automatique**
JS devait être accessible aux non-programmeurs de 1995. Convertir automatiquement `"5" + 3` en `"53"` plutôt que de crasher semblait user-friendly. Résultat : des règles de coercition complexes qu'on ne peut plus changer.

**2. IEEE 754 pour les nombres flottants**
Même décision que Python, Ruby, C, Java. `0.1 + 0.2 !== 0.3` dans tous ces langages. JS n'a pas de type entier séparé : tout est flottant. Ce qui amplifie les surprises.

**3. Héritage prototypal et `Object.prototype` accessible**
Le modèle objet de JS est prototypal, pas classique. `__proto__` expose la chaîne de prototype à tout code qui tourne dans le même environnement. C'était une décision de flexibilité. Ça devient une surface d'attaque.

---

## POURQUOI CETTE APPROCHE PLUTÔT QU'UNE AUTRE

Alternative : ignorer ces comportements et s'appuyer sur TypeScript pour tout attraper.

Limites de cette approche :
- TypeScript type-check à la compilation, pas à l'exécution (runtime). Les données qui arrivent d'une API externe ne sont pas typées à l'exécution.
- `NaN` est de type `number` en TypeScript. `NaN + 1 = NaN` passe les types sans erreur.
- La pollution de prototype est un comportement runtime : TypeScript ne la voit pas.
- Un dev qui ne comprend pas ces mécanismes va écrire des guards TypeScript (gardes de type) incorrects.

TypeScript réduit la surface des edge cases. Il ne l'élimine pas.
Comprendre les mécanismes sous-jacents reste nécessaire même avec TypeScript.

Ce qu'on gagne en apprenant ces mécanismes :
- capacité à déboguer des comportements inattendus sans chercher au hasard
- écriture de guards et de validations corrects
- compréhension des vulnérabilités de sécurité liées au prototype
- code plus défensif par réflexe

Ce qu'on sacrifie :
- rien. Ce sont des connaissances pures, pas des tradeoffs.

---

## MODERNE, LEGACY OU INTEMPOREL ?

**`NaN`, `null`, `undefined` :** permanent. Ces trois valeurs existent depuis ES1 et ne changeront pas. Les règles de coercition sont figées par la rétrocompatibilité du web.

**Arithmétique flottante :** universel et permanent. IEEE 754 est un standard de 1985 adopté par tous les langages modernes. La connaissance est transférable à Python, Java, C, Rust.

**Coercions implicites :** les règles de `==` sont figées. L'usage de `===` est la norme depuis ES5. Mais les coercions implicites dans les contextes non-booléens (conditions, concaténation) restent actives.

**Prototype chain :** le modèle prototypal est permanent. ES6 a ajouté la syntaxe `class` mais elle compile vers du prototype en dessous. La pollution de prototype reste une vulnérabilité active en 2026.

Ce qui a changé avec le temps :
- la montée de TypeScript a réduit les erreurs de coercition à la compilation
- `Object.hasOwn()` (ES2022) remplace `hasOwnProperty` avec une syntaxe plus sûre
- les JSON parsers modernes ont des options pour bloquer `__proto__` dans les payloads

Ce qui ne bougera pas :
- les règles fondamentales de coercition
- IEEE 754
- le modèle prototypal de JS

---

## NOYAU DUR OU PÉRIPHÉRIQUE ?

Périphérique dans la progression (module 28 sur 32).
Mais les comportements couverts ici sont présents depuis le module 01.

La différence : au début du curriculum, on les évite. Ici, on les comprend.

Ce module est la couche de sécurité intellectuelle qui fait qu'un dev JS peut affirmer "je sais ce que fait mon code" plutôt que "j'espère que ça marche".

---

## À QUEL MOMENT LE MAÎTRISER

Module 27 pour une raison : ces comportements ont plus de sens quand on a déjà manipulé des objets, des types, des prototypes, et des données réelles.

```
modules qui rendent ce module concret
--------------------------------------
01_fundamentals/04_types  --> les types primitifs et leur comportement de base
01_fundamentals/01_variables --> références vs valeurs : base pour comprendre la mutation
11_functional_js/02_immutability --> pourquoi la mutation implicite est dangereuse
14_typescript        --> ce que TS attrape et ce qu'il laisse passer
22_security         --> prototype pollution comme vecteur d'attaque réel
```

Lire ce module avant d'avoir écrit du vrai code : c'est théorique et peu mémorable.
Lire ce module après avoir rencontré un `NaN` inexpliqué en prod : c'est une révélation.

---

## PRÉREQUIS

- `01_fundamentals` complet : types primitifs, références, coercions de base
- `04_types/02_type_coercion.md` en particulier : base directe de ce module
- Avoir déjà débogué un bug lié à une valeur inattendue : pas technique, mais ça aide

---

## CE QUI DEVIENT PLUS SIMPLE APRÈS CE MODULE

**Debugging en général :** quand un comportement est bizarre, tu sais où chercher en premier.

**`22_security` (si pas encore fait) :** la pollution de prototype comme vecteur d'attaque est plus claire après avoir compris la chaîne prototype en profondeur.

**`09_oracle_glitch` (mini-projet) :** ce projet injecte des edge cases comme des pièges réels (`0.1 + 0.2` dans des métriques de scoring, `NaN` dans des tableaux, `undefined` au milieu d'une réponse LLM). Ce module t'arme pour les attraper.

---

## ERREURS CLASSIQUES DES DÉBUTANTS

**Utiliser `== null` pour vérifier null ET undefined**
Ça fonctionne, mais la majorité des devs ne savent pas pourquoi. Et ils finissent par appliquer la même logique à d'autres coercions qui ne se comportent pas pareil.

**Ne jamais vérifier `Number.isNaN` et utiliser `isNaN` à la place**
`isNaN("hello")` retourne `true`. `Number.isNaN("hello")` retourne `false`. Deux comportements radicalement différents. La plupart des devs utilisent le mauvais.

**Faire confiance à `typeof` pour tout**
`typeof null === 'object'` : le bug le plus connu de JS, présent depuis 1995, jamais corrigé pour ne pas casser le web. `typeof` ne détecte pas `null` correctement.

**Itérer sur un objet avec `for...in` sans `hasOwnProperty`**
Si le prototype a été pollué, `for...in` itère aussi sur les propriétés héritées. Comportement inattendu, difficile à déboguer.

**Assumer que les calculs flottants sont exacts**
`(0.1 + 0.2) === 0.3` est `false`. Mais `Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON` est `true`. La comparaison de flottants demande une epsilon (tolérance).

---

## IDÉES REÇUES

**"Ces comportements n'arrivent qu'aux débutants"**
La pollution de prototype a touché des apps Express en production écrites par des équipes senior. `NaN` dans un calcul de scoring a faussé des classements dans des systèmes de recommandation. Ce n'est pas une question de niveau.

**"TypeScript règle tout ça"**
TypeScript est un outil de compilation. Ces comportements sont des phénomènes runtime. `NaN` est `number` en TypeScript. La pollution de prototype est invisible au type checker.

**"On peut juste éviter ces cas avec du bon code"**
On ne contrôle pas toutes les données. Les API externes, les inputs utilisateurs, les réponses LLM : toutes ces sources peuvent injecter des valeurs inattendues. Le code défensif commence par connaître ce qui peut mal tourner.

**"JS va corriger ça dans une prochaine version"**
Non. Ces comportements sont figés par la rétrocompatibilité du web. Changer `typeof null` casserait des millions de sites. Ces règles sont permanentes.

---

## CE QUI VA ÉVOLUER, CE QUI VA RESTER

**Ce qui va évoluer :**
- les outils de détection (linters plus intelligents, TypeScript plus strict sur les cas edge)
- les API de protection contre la pollution de prototype (`structuredClone`, JSON parsers sécurisés)
- la syntaxe pour certains cas (`Object.hasOwn` remplace `hasOwnProperty`)

**Ce qui ne bougera pas :**
- `NaN !== NaN`
- `typeof null === 'object'`
- `0.1 + 0.2 !== 0.3`
- les règles de coercition de `==`
- le modèle prototypal

Ces comportements font partie du contrat de rétrocompatibilité de JS. Ils seront là dans 20 ans.

---

## RÉSUMÉ : POURQUOI UN DEV SÉRIEUX INVESTIT SON TEMPS ICI

Parce que "ça marche" et "je comprends pourquoi ça marche" sont deux états différents.

Un dev qui ne connaît pas ces edge cases : il code en espérant. Il débogue en cherchant au hasard. Il ne sait pas ce que son code fait vraiment avec des données inattendues.

Un dev qui les connaît : il écrit des guards précis, il débogue vite, et il sait exactement où son code peut trahir ses intentions.

Ce n'est pas du trivia JavaScript.
C'est la différence entre subir le langage et le maîtriser.

> Ce module réutilise : le debugging du module 04 (`04_debugging`) et l'asynchrone du module 03 (`03_async`).
>
> **Référence heisenbug** : le fichier `06_heisenbug_arena.md` de ce module est LE point de référence complet sur les heisenbugs (5 scénarios, méthode, cas qui casse). Le stub `04_debugging/heisenbug_arena.md` renvoie ici : ne le duplique pas, approfondis-le.
