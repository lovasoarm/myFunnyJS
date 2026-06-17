# L'IA génère des tests : toi tu vérifies qu'ils testent vraiment quelque chose

L'IA peut générer des tests qui passent sans rien vérifier. C'est le pire type de faux sentiment de sécurité : ton CI est vert, ta couverture est à 95%, et le bug est là depuis le début. Un test qui passe toujours, même si la fonction est cassée, n'est pas un test : c'est de la décoration.

Ce module couvre comment utiliser l'IA pour générer des tests utiles, et comment s'assurer qu'ils le sont vraiment.

---

## 1) POURQUOI LES TESTS GÉNÉRÉS PAR L'IA SONT SOUVENT INUTILES

L'IA génère des tests en observant le code. Ça crée un problème fondamental : elle teste ce que le code fait, pas ce que le code devrait faire.

```js
// La fonction
function applyDiscount(price, percent) {
  return price * percent / 100 // BUG : devrait être price - (price * percent / 100)
}

// Le test que l'IA génère en observant la fonction
test('applies discount', () => {
  expect(applyDiscount(100, 10)).toBe(10) // passe ! mais 10 c'est faux : le prix final devrait être 90
})

// Le test que tu dois écrire en partant du comportement attendu :
test('returns price after discount is removed', () => {
  expect(applyDiscount(100, 10)).toBe(90) // prix de 100 avec 10% de remise = 90
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
- calculateShipping(weight, destination) retourne le coût de livraison en euros
- Les colis <= 1kg coûtent 5€ quelle que soit la destination
- Les colis > 1kg et <= 5kg : 5€ + 2€ par kg supplémentaire au-delà du premier
- Les colis > 5kg : 5€ + 2€/kg pour les 4 premiers kg supplémentaires, puis 1.5€/kg au-delà
- Un poids négatif ou nul doit lever une InvalidWeightError
- Une destination non supportée doit lever une UnsupportedDestinationError

Les destinations supportées : 'france', 'europe', 'international'
Pour l'instant, le coût est identique quelle que soit la destination (sera modifié en v2).

N'utilise pas la fonction pour déduire le comportement. Utilise uniquement cette spec.
Couvre les cas nominaux, les limites exactes (1kg, 5kg), et les cas d'erreur."
```

Ce prompt force l'IA à partir de la spécification. Elle va trouver des bugs dans l'implémentation.

---

## 3) LES 5 CATÉGORIES DE TESTS À EXIGER

Quand tu génères ou écris des tests, tu vises ces 5 catégories. Checklist à appliquer à chaque fonction :

```
1. CAS NOMINAL
   --> le chemin heureux, l'input standard
   --> test(calcule 10% de discount sur 100€)

2. CAS LIMITE (boundary)
   --> les valeurs exactement aux bords des conditions
   --> test(colis exactement à 1kg), test(colis exactement à 5kg)
   --> pas 0.9kg, pas 1.1kg : exactement 1kg

3. CAS D'ERREUR
   --> les inputs invalides, les états impossibles
   --> test(poids négatif), test(destination inconnue), test(prix null)

4. CAS EDGE (comportement inattendu)
   --> les situations que la spec n'a peut-être pas prévues
   --> test(poids = 0), test(discount = 100%), test(tableau vide)

5. CAS DE RÉGRESSION
   --> les bugs qu'on a déjà eus, devenus des tests permanents
   --> test('bug #142 : le discount premium était appliqué deux fois')
```

```js
// Exemple complet sur calculateShipping :

describe('calculateShipping', () => {
  // 1. CAS NOMINAL
  test('returns base rate for packages under 1kg', () => {
    expect(calculateShipping(0.5, 'france')).toBe(5)
  })

  test('calculates surcharge for packages between 1kg and 5kg', () => {
    expect(calculateShipping(3, 'france')).toBe(9) // 5 + (2kg * 2€)
  })

  // 2. CAS LIMITE
  test('applies base rate at exactly 1kg (boundary)', () => {
    expect(calculateShipping(1, 'france')).toBe(5) // 1kg <= 1kg : pas de surcharge
  })

  test('applies first tier at exactly 1.001kg (just over boundary)', () => {
    expect(calculateShipping(1.001, 'france')).toBeCloseTo(5.002, 2)
  })

  test('applies correct rate at exactly 5kg (boundary)', () => {
    expect(calculateShipping(5, 'france')).toBe(13) // 5 + (4kg * 2€)
  })

  // 3. CAS D'ERREUR
  test('throws InvalidWeightError for negative weight', () => {
    expect(() => calculateShipping(-1, 'france')).toThrow(InvalidWeightError)
  })

  test('throws InvalidWeightError for zero weight', () => {
    expect(() => calculateShipping(0, 'france')).toThrow(InvalidWeightError)
  })

  test('throws UnsupportedDestinationError for unknown destination', () => {
    expect(() => calculateShipping(1, 'mars')).toThrow(UnsupportedDestinationError)
  })

  // 4. CAS EDGE
  test('handles very large packages with correct tier calculation', () => {
    // 10kg = 5€ + (4kg * 2€) + (5kg * 1.5€) = 5 + 8 + 7.5 = 20.5
    expect(calculateShipping(10, 'france')).toBeCloseTo(20.5, 2)
  })

  // 5. CAS DE RÉGRESSION (exemple fictif)
  test('regression: does not apply surcharge twice for international packages', () => {
    const france = calculateShipping(3, 'france')
    const international = calculateShipping(3, 'international')
    expect(international).toBe(france) // même prix pour l'instant (v1)
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

Ce que Stryker fait :

```js
// Ta fonction originale
function isAdult(age) {
  return age >= 18
}

// Mutant 1 : Stryker change >= en >
function isAdult(age) {
  return age > 18 // 18 ans n'est plus adulte
}
// Si ton test n'inclut pas test('18 ans est adulte') : ce mutant SURVIT. Bug non détecté.

// Mutant 2 : Stryker inverse la condition
function isAdult(age) {
  return age < 18
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
Tu lances Stryker (ou équivalent) : score de mutation
    |
    v
Tu corriges les tests faibles révélés par les mutants survivants
```

---

## 6) L'IA COMME GÉNÉRATEUR DE CAS DE TEST

L'IA est utile pour brainstormer les cas de test qu'on n'a pas imaginés. Pas pour les écrire directement : pour les lister.

```
Prompt :
"Je vais écrire des tests pour parseAmount(input), qui convertit une entrée utilisateur
en nombre valide ou lève une erreur.

Liste les 15 inputs les plus intéressants à tester, en te concentrant sur les cas limites,
les edge cases et les pièges classiques JS.
Ne génère pas de code de test : juste la liste des inputs avec le résultat attendu."

Réponse possible :
- "100"         --> 100
- "100.50"      --> 100.5
- "1 000"       --> 1000 (espace comme séparateur de milliers) ou erreur ?
- "1,000"       --> 1000 ou erreur ? (virgule comme séparateur ?)
- "-100"        --> -100 ou erreur ?
- "0"           --> 0
- ""            --> erreur
- " "           --> erreur
- "NaN"         --> erreur
- "Infinity"    --> erreur ou Infinity ?
- "1e3"         --> 1000 ou erreur ?
- "0x1A"        --> erreur (notation hexadécimale)
- null          --> erreur
- undefined     --> erreur
- "100abc"      --> erreur
```

Maintenant toi tu décides : lesquels la spec couvre ? Lesquels doivent lever une erreur ? Et tu écris les tests.

---

## EXERCICES

**EXO 1 : Le test depuis la spec**
Voici la spec : "formatCurrency(amount, locale, currency) retourne un string formaté selon la locale (fr-FR, en-US, ja-JP). Un montant négatif doit être affiché avec un signe moins. Un montant null ou non-numérique doit lever une TypeError. Le symbole de la devise doit apparaître selon les conventions de la locale."
Écris les tests Jest SANS regarder une implémentation. Ensuite écris l'implémentation. Combien de tes tests échouent d'emblée ? (25 minutes)

**EXO 2 : La couverture trompeuse**
Génère avec l'IA une fonction simple (tri, recherche ou transformation de tableau). Demande à l'IA de générer aussi des tests pour cette fonction. Vérifie la couverture avec Jest (`--coverage`). Maintenant brise délibérément un comportement edge de la fonction. Les tests détectent-ils le problème ? Écris le test qui aurait détecté le bug. (20 minutes)

**EXO 3 : Le brainstorm de cas**
Choisis une fonction non triviale (validation de numéro de téléphone international, calcul de date d'expiration, parsing de CSV). Demande à l'IA de lister 20 inputs intéressants à tester. Classe-les en catégories (nominal, limite, erreur, edge). Écris les tests pour les 10 plus importants. (20 minutes)

---

## RÉSUMÉ

Un test généré depuis le code teste le code, pas le comportement attendu. Le bon ordre : spécification d'abord, tests depuis la spec, implémentation ensuite. Les 5 catégories à couvrir : nominal, limite, erreur, edge, régression. La couverture de code mesure l'exécution, pas la qualité des assertions. Mutation testing avec Stryker mesure si tes tests détectent vraiment les bugs. L'IA est efficace pour brainstormer les cas de test, pas pour les décider.
