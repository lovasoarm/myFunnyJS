---
stability: intemporel
---

# TDD JOURNAL : LEGACY DUNGEON
Temps de lecture ~7 min

Dans les 9 autres mini-projets, ce journal trace l'ordre dans lequel les tests ont été écrits AVANT le code. Ici, c'est différent : tu n'écris pas de feature depuis zéro, tu explores du code existant puis tu corriges un bug précis. Le principe reste le même malgré tout : **le test avant la certitude**. Tu n'affirmes jamais "j'ai compris cette fonction" sans avoir un test qui le prouve, et tu n'affirmes jamais "j'ai corrigé le bug" sans un test qui passait au rouge avant et passe au vert après.

Ce journal a deux parties : le journal d'investigation (ÉTAPE 1, cartographie) et le TDD classique du bugfix (ÉTAPE 2).

---

## PARTIE 1 : JOURNAL D'INVESTIGATION (LES 2H DE CARTOGRAPHIE)

Trace ici, dans l'ordre réel, ce que tu as regardé et ce que tu as compris ou pas. Pas de réécriture a posteriori pour donner l'impression d'avoir été méthodique du premier coup : ce journal sert à montrer le vrai chemin, hésitations comprises.

### Exemple de structure attendue (remplace par ton repo, ton ordre réel)

```
[00:00] package.json ouvert. Scripts : "start", "test", "lint". Point d'entrée
    déclaré : index.js
[00:05] index.js ouvert. 12 lignes. Juste un require vers lib/main.js. Le vrai
    code commence ailleurs.
[00:08] lib/main.js ouvert. 340 lignes. Trop dense pour tout lire d'un coup.
    Je repère les noms de fonctions exportées en haut : 4 fonctions publiques.
[00:15] Recherche grep du mot "handle" dans tout le repo (mot-clé du domaine
    choisi à vue de nez). 23 fichiers contiennent ce mot. Trop large.
[00:20] Nouvelle recherche, plus précise : "handleRequest". 4 fichiers.
    Ça commence à ressembler à une colonne vertébrale.
[00:35] Je suis le premier appel de handleRequest depuis main.js jusqu'à
    son implémentation réelle dans lib/core/dispatcher.js
[00:50] Bloqué : dispatcher.js appelle une fonction "resolve" dont je ne
    trouve pas la définition par recherche de texte simple. Je soupçonne
    un export dynamique ou un require conditionnel.
[01:05] Trouvé : "resolve" est injecté via un système de plugin chargé au
    runtime depuis un dossier /lib/plugins. Je ne comprends pas encore
    COMMENT le plugin par défaut est sélectionné, mais je sais OÙ chercher.
[01:20] Je laisse ce point de côté (noté dans "ce qui reste flou") et je
    regarde les tests de dispatcher.js pour comprendre le comportement
    attendu sans creuser plus l'implémentation du plugin.
[01:35] Les tests confirment mon hypothèse sur le flux principal. Je commence
    à esquisser le diagramme ASCII.
[01:55] Stop. Diagramme terminé, approximatif sur la partie plugin. MAP.md
    rédigé avec la liste honnête de ce qui reste flou.
```

### Ce que ce genre de journal RÉVÈLE (et c'est le but)

```
- les fausses pistes (la recherche "handle" trop large avant "handleRequest")
 sont normales et utiles à documenter : elles montrent comment affiner une
 recherche, pas un échec
- le moment où tu choisis de NE PAS creuser plus loin (le système de plugin)
 est une compétence en soi : savoir où s'arrêter pour respecter le temps
 imparti, plutôt que de tout vouloir comprendre à 100%
- les tests comme bouée de sauvetage quand le code source seul ne suffit pas
 à comprendre un comportement
```

---

## PARTIE 2 : TDD CLASSIQUE SUR LE BUGFIX (ÉTAPE 2)

Ici, retour au format TDD habituel des autres mini-projets : le test qui prouve que le bug existe, écrit AVANT la correction.

### Exemple (remplace par ton vrai bug, ton vrai repo)

```js
// reproduction.test.js : ce test prouve que le bug existe, AVANT toute correction
// (basé sur un type de bug réel et courant dans du code legacy : comparaison
// de type laxiste qui casse sur une entrée inattendue)

test('parseOptionValue retourne la mauvaise valeur quand l\'input est la string "0"', () => {
 // le code source original fait : if (!value) return defaultValue
 // "0" est une string non-vide donc techniquement truthy... mais certains
 // chemins de code legacy testent la valeur APRÈS une coercition numérique
 // implicite, ce qui transforme "0" en 0, qui lui est falsy
 const result = parseOptionValue("0", "valeur-par-defaut");

 // CE TEST DOIT ÉCHOUER avant la correction : c'est la preuve du bug
 expect(result).toBe("0"); // attendu : la string "0" telle quelle
 // obtenu avant correction : "valeur-par-defaut" (le bug)
});
```

```
RÉSULTAT AVANT CORRECTION : test ROUGE
 Expected: "0"
 Received: "valeur-par-defaut"

 Confirmation que le bug existe vraiment, pas une supposition.
```

### La correction (diff avant/après, dans BUGFIX.md, résumé ici)

```js
// AVANT (code original du repo, simplifié)
function parseOptionValue(value, defaultValue) {
 if (!value) return defaultValue;
 return value;
}

// APRÈS (correction minimale, un seul changement)
function parseOptionValue(value, defaultValue) {
 if (value === undefined || value === null || value === '') return defaultValue;
 return value;
}
```

```
RÉSULTAT APRÈS CORRECTION : test VERT
 Expected: "0"
 Received: "0"

 Le test ne change pas. Seul le code source change. C'est la preuve
 que la correction règle exactement le problème identifié, ni plus ni moins.
```

### Pourquoi ce test précis et pas un autre

Le choix du cas de test n'est jamais arbitraire. Ici : `"0"` est un edge case classique (cf. `28_edge_cases`) parce qu'une vérification `if (!value)` traite `"0"` comme une string normale (truthy), mais un développeur qui ajoute plus tard une coercition numérique quelque part dans le pipeline peut transformer cette même valeur en `0` (falsy), créant un bug qui n'apparaît que dans certains chemins d'exécution. Documenter LE POURQUOI du choix du test fait partie du livrable, pas juste le test lui-même.

---

## RÉCAPITULATIF DE L'ORDRE RÉEL (à remplir avec TON vrai déroulé)

```
1. (à remplir) package.json + point d'entrée
2. (à remplir) recherche du mot-clé du domaine
3. (à remplir) ...
...
N. test de reproduction du bug écrit (rouge)
N+1. correction appliquée
N+2. test de reproduction repassé (vert)
```

Total : (à remplir) heures d'investigation, (à remplir) test(s) écrit(s) pour le bugfix.

## Ce qui aurait été impossible à tester si j'avais gardé la version précédente

Section obligatoire (chantier v14 #15.5). À remplir avec au moins un exemple
concret par refactoring notable du projet :

- Version pré-refacto : ...
- Ce qui bloquait : ...
- Refacto appliqué : ...
- Test devenu possible : ...
