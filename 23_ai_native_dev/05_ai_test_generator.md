---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# L'IA GÉNÈRE DES TESTS : TOI TU VÉRIFIES QU'ILS TESTENT VRAIMENT QUELQUE CHOSE
Temps de lecture ~12 min

L'IA peut générer des tests qui passent sans rien vérifier. C'est le pire type de faux sentiment de sécurité : ton CI est vert, ta couverture est à 95%, et le bug est là depuis le début. Un test qui passe toujours, même si la fonction est cassée, n'est pas un test : c'est de la décoration.

Dans le pipeline Oracle Glitch, l'IA détecte des bugs dans ton code. L'ironie : si les tests qui valident ce pipeline sont eux-mêmes inutiles, l'Oracle se surveille avec de faux yeux. Ce module couvre comment éviter ça.

---

## 1) POURQUOI LES TESTS GÉNÉRÉS PAR L'IA SONT SOUVENT INUTILES

L'IA génère des tests en observant le code. Ça crée un problème fondamental : elle teste ce que le code fait, pas ce que le code devrait faire.

```js
// La fonction de l'Oracle
function calculerDommagesJutsu(puissance, multiplicateur) {
 return puissance * multiplicateur / 100 // BUG : devrait être puissance + (puissance * multiplicateur / 100)
}

// Le test que l'IA génère en observant la fonction :
test('calcule les dommages', () => {
 expect(calculerDommagesJutsu(500, 10)).toBe(50) // passe ! mais 50 c'est faux
 // le résultat attendu était 550 (500 de base + 10% de bonus)
})

// Le test que tu dois écrire en partant du comportement attendu :
test('ajoute le bonus de multiplicateur à la puissance de base', () => {
 expect(calculerDommagesJutsu(500, 10)).toBe(550) // 500 + 10% de 500
 // CE TEST ÉCHOUE. C'est normal. C'est lui qui a trouvé le bug.
})
```

La règle : **un bon test est écrit depuis la spécification, pas depuis l'implémentation**. Quand tu demandes à l'IA de générer des tests, tu dois lui donner la spec, pas juste le code.

---

## 2) LE PROMPT QUI DONNE DES TESTS UTILES

Mauvais prompt :
```
"Génère des tests Jest pour cette fonction."
[code]
```

Résultat : des tests qui reproduisent le comportement actuel. Circulaire.

Bon prompt :
```
"Tu vas écrire des tests Jest pour cette fonction.

SPÉCIFICATION (ce que la fonction DOIT faire, indépendamment de son implémentation) :
- attribuerMission(chevalier, horror, zone) retourne une mission ou lève une erreur
- Un chevalier sans armure active ne peut pas recevoir de mission : lève KnightUnarmedError
- Une zone déjà couverte par un autre chevalier ne peut pas être reassignée : lève ZoneConflictError
- Un horror de niveau 5+ exige un chevalier de rang 'or' minimum : lève InsufficientRankError si le rang ne convient pas
- La mission retournée contient : id (UUID), chevalier, horror, zone, timestamp de début
- Un horror null ou un chevalier null lève une TypeError

N'utilise pas la fonction pour déduire le comportement. Utilise uniquement cette spec.
Couvre les cas nominaux, les limites exactes (niveau 5, rang 'or'), et les cas d'erreur."
```

Ce prompt force l'IA à partir de la spécification. Elle va trouver des bugs dans l'implémentation.

---

## 3) LES 5 CATÉGORIES DE TESTS À EXIGER

Quand tu génères ou écris des tests, tu vises ces 5 catégories. Checklist à appliquer à chaque fonction :

```
1. CAS NOMINAL
  --> le chemin heureux, l'input standard
  --> test(chevalier d'or contre horror niveau 3, mission créée correctement)

2. CAS LIMITE (boundary)
  --> les valeurs exactement aux bords des conditions
  --> test(horror niveau 5 exactement, test(chevalier rang 'or' exactement)
  --> pas niveau 4, pas niveau 6 : exactement 5

3. CAS D'ERREUR
  --> les inputs invalides, les états impossibles
  --> test(chevalier null), test(horror niveau 5 avec chevalier d'argent), test(zone déjà couverte)

4. CAS EDGE (comportement inattendu)
  --> les situations que la spec n'a peut-être pas prévues
  --> test(zone vide string), test(horror niveau 0), test(même chevalier assigné deux fois)

5. CAS DE RÉGRESSION
  --> les bugs qu'on a déjà eus, devenus des tests permanents
  --> test('bug #23 : le rang chevalier était case-sensitive, "Or" vs "or" échouait')
```

```js
// Exemple complet sur attribuerMission :

describe('attribuerMission', () => {
 // 1. CAS NOMINAL
 test('crée une mission valide pour un chevalier d\'or contre un horror standard', () => {
  const chevalier = { id: 'leon', rang: 'or', armureActive: true }
  const horror = { id: 'h1', niveau: 3 }
  const mission = attribuerMission(chevalier, horror, 'secteur-nord')

  expect(mission.id).toBeDefined()
  expect(mission.chevalier).toBe('leon')
  expect(mission.timestamp).toBeInstanceOf(Date)
 })

 // 2. CAS LIMITE
 test('autorise un chevalier d\'or contre un horror niveau 5 exactement (boundary)', () => {
  const chevalier = { id: 'leon', rang: 'or', armureActive: true }
  const horror = { id: 'h2', niveau: 5 }
  expect(() => attribuerMission(chevalier, horror, 'secteur-est')).not.toThrow()
 })

 test('refuse un chevalier d\'argent contre un horror niveau 5 exactement (boundary)', () => {
  const chevalier = { id: 'ryuga', rang: 'argent', armureActive: true }
  const horror = { id: 'h3', niveau: 5 }
  expect(() => attribuerMission(chevalier, horror, 'secteur-ouest')).toThrow(InsufficientRankError)
 })

 // 3. CAS D'ERREUR
 test('lève KnightUnarmedError si l\'armure est inactive', () => {
  const chevalier = { id: 'leon', rang: 'or', armureActive: false }
  const horror = { id: 'h4', niveau: 2 }
  expect(() => attribuerMission(chevalier, horror, 'secteur-sud')).toThrow(KnightUnarmedError)
 })

 test('lève TypeError si le chevalier est null', () => {
  expect(() => attribuerMission(null, { id: 'h5', niveau: 1 }, 'secteur-nord')).toThrow(TypeError)
 })

 // 4. CAS EDGE
 test('gère un horror de niveau 0', () => {
  const chevalier = { id: 'leon', rang: 'or', armureActive: true }
  const horror = { id: 'h6', niveau: 0 }
  // Niveau 0 : acceptable ou erreur ? La spec ne dit pas : à décider, à tester
  expect(() => attribuerMission(chevalier, horror, 'secteur-nord')).not.toThrow()
 })

 // 5. CAS DE RÉGRESSION
 test('regression bug #23 : le rang n\'est pas case-sensitive', () => {
  const chevalier1 = { id: 'leon', rang: 'or', armureActive: true }
  const chevalier2 = { id: 'ryuga', rang: 'Or', armureActive: true }
  const horror = { id: 'h7', niveau: 5 }
  // les deux doivent passer, peu importe la casse
  expect(() => attribuerMission(chevalier1, horror, 'zone-a')).not.toThrow()
  expect(() => attribuerMission(chevalier2, horror, 'zone-b')).not.toThrow()
 })
})
```

---

## 4) MUTATION TESTING : VÉRIFIER QUE LES TESTS DÉTECTENT VRAIMENT LES BUGS

La couverture de code (code coverage) mesure quelles lignes sont exécutées pendant les tests. Ça ne mesure pas si les tests détectent les bugs. Un test qui n'a pas d'assertion peut avoir 100% de couverture.

Le mutation testing (test de mutation) : un outil modifie ton code de façon délibérément cassée ("mutants") et vérifie si tes tests échouent. Si un mutant survit (tes tests passent quand même), tes tests sont inefficaces.

```
Stryker : le framework de mutation testing pour JS/TS

# Installation
npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner

# stryker.config.json
{
 "testRunner": "jest",
 "reporters": ["progress", "html"],
 "coverageAnalysis": "perTest",
 "mutate": ["src/**/*.ts", "!src/**/*.spec.ts"]
}

# Lancer
npx stryker run
```

Ce que Stryker fait sur le code de Naruto :

```js
// Ta fonction originale
function estChunin(experience) {
 return experience >= 2 // 2 ans minimum pour le rang chunin
}

// Mutant 1 : Stryker change >= en >
function estChunin(experience) {
 return experience > 2  // 2 ans n'est plus chunin : Naruto lui-même échoue
}
// Si ton test n'inclut pas test('2 ans = chunin') : ce mutant SURVIT. Bug non détecté.

// Mutant 2 : Stryker inverse la condition
function estChunin(experience) {
 return experience < 2
}
// Si tes tests couvrent bien les deux côtés, ce mutant EST tué. Test efficace.
```

Le score de mutation (mutation score) : pourcentage de mutants tués par tes tests. 80%+ c'est correct. 95%+ c'est solide. 100% c'est souvent du over-testing.

---

## 5) LE WORKFLOW COMPLET : SPEC --> IA --> VALIDATION --> MUTATION

```
SPEC claire de ce que la fonction doit faire
  |
  v
Prompt à l'IA avec la SPEC (pas le code)
  |
  v
L'IA génère une suite de tests
  |
  v
Tu lis chaque test : est-ce que l'assertion a du sens ?
Est-ce qu'elle vérifie quelque chose qui peut échouer ?
  |
  v
Tu complètes avec les cas que l'IA a oubliés (surtout les limites et les erreurs)
  |
  v
Tu lances les tests : combien échouent sur l'implémentation actuelle ?
(si aucun n'échoue : suspecte les tests, pas le code)
  |
  v
Tu corriges les bugs révélés
  |
  v
Tous les tests passent
  |
  v
Tu lances Stryker : score de mutation
  |
  v
Tu corriges les tests faibles révélés par les mutants survivants
```

---

## 6) L'IA COMME GÉNÉRATEUR DE CAS DE TEST

L'IA est utile pour brainstormer les cas de test qu'on n'a pas imaginés. Pas pour les écrire directement : pour les lister.

```
Prompt :
"Je vais écrire des tests pour analyserSortieLLM(texte), qui valide la réponse
d'un LLM et retourne un objet structuré ou lève une erreur.

Liste les 15 inputs les plus intéressants à tester, en te concentrant sur les cas limites,
les edge cases et les pièges classiques JS.
Ne génère pas de code de test : juste la liste des inputs avec le résultat attendu."

Réponse possible :
- JSON valide et complet     --> objet parsé correctement
- JSON valide mais vide {}    --> erreur ou objet vide ? (à décider)
- JSON avec virgule en trop   --> erreur de parsing
- JSON enveloppé dans ```json  --> nettoyage avant parsing
- Réponse tronquée à mi-JSON  --> erreur de parsing
- Réponse null          --> TypeError
- Réponse undefined       --> TypeError
- String vide ""         --> erreur
- String "null"         --> JSON.parse("null") = null, pas une erreur
- Très longue réponse (> 10k)  --> performance, timeout ?
- NaN dans un champ numérique  --> Zod doit le rejeter
- Infinity dans un champ     --> Zod doit le rejeter
- Champ attendu absent      --> Zod doit le rejeter
- Type incorrect (string à la place de number) --> Zod doit le rejeter
- Caractères unicode bizarres  --> le parsing tient ?
```

Maintenant toi tu décides : lesquels la spec couvre ? Lesquels doivent lever une erreur ? Et tu écris les tests.

---

## EXERCICES

**EXO 1 : Le test depuis la spec de Banshee**
Voici la spec : "attribuerTerritory(sheriff, zone, risque) attribue une zone à un sheriff. Un sheriff suspendu ne peut pas recevoir de zone. Le risque va de 1 à 10 : au-delà de 7, exige l'approbation du chef. Un risque négatif ou > 10 lève une RangeError. La zone déjà assignée lève un ConflictError." Écris les tests Jest SANS regarder une implémentation. Ensuite écris l'implémentation. Combien de tes tests échouent d'emblée ? (25 minutes)

**EXO 2 : La couverture trompeuse de l'Oracle**
Génère avec l'IA une fonction simple de classement de ninjas. Demande à l'IA de générer aussi des tests. Vérifie la couverture avec Jest (`--coverage`). Maintenant casse délibérément un comportement edge de la fonction. Les tests détectent-ils le problème ? Écris le test qui aurait détecté le bug. (20 minutes)

**EXO 3 : Le brainstorm de cas sur une fonction de score**
Choisis une fonction de scoring non triviale (score Ballon d'Or pondéré par matchs joués, buts, passes décisives, et trophées). Demande à l'IA de lister 20 inputs intéressants à tester. Classe-les en catégories. Écris les tests pour les 10 plus importants. (20 minutes)

---

## RÉSUMÉ

Un test généré depuis le code teste le code, pas le comportement attendu. Le bon ordre : spécification d'abord, tests depuis la spec, implémentation ensuite. Les 5 catégories à couvrir : nominal, limite, erreur, edge, régression. La couverture de code mesure l'exécution, pas la qualité des assertions. Mutation testing avec Stryker mesure si tes tests détectent vraiment les bugs. L'IA est efficace pour brainstormer les cas de test, pas pour les décider.
