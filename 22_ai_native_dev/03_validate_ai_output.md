# Ce que l'IA génère, tu ne le crois pas : tu le valides

L'IA peut générer du code qui compile, qui passe les tests qu'elle a elle-même écrits, et qui explose quand un vrai utilisateur l'utilise. Ce n'est pas de la malveillance : c'est de l'optimisme statistique. Elle génère ce qui ressemble à la bonne réponse. Ton boulot : vérifier si c'est la vraie réponse.

---

## 1) LES 4 NIVEAUX DE VALIDATION

Il n'existe pas qu'une façon de valider. Il en existe 4, et elles se cumulent.

```
NIVEAU 1 : LECTURE CRITIQUE
  --> tu lis chaque ligne, tu comprends ce qu'elle fait
  --> coût : 2-10 minutes
  --> attrape : la logique cassée, les raccourcis dangereux

NIVEAU 2 : TYPAGE STATIQUE (TypeScript / Zod)
  --> les types vérifient la forme des données au compile-time et au runtime
  --> coût : quelques dizaines de lignes
  --> attrape : les données qui ne ressemblent pas à ce qu'on attend

NIVEAU 3 : TESTS UNITAIRES
  --> tu testes les cas que l'IA n'a pas pensé à couvrir
  --> coût : autant que les tests
  --> attrape : les edge cases, les cas limites, les comportements inattendus

NIVEAU 4 : TESTS D'INTÉGRATION
  --> tu testes le module dans son contexte réel
  --> coût : le plus élevé
  --> attrape : les interactions entre composants que l'IA a pas vues
```

Pour du code zone verte (utilitaires simples) : niveau 1 + 2 suffisent souvent.
Pour du code zone rouge (auth, logique métier, data) : les 4 niveaux sont obligatoires.

---

## 2) LECTURE CRITIQUE : LES RED FLAGS À REPÉRER

Quand tu lis du code généré, ces patterns doivent déclencher une alarme :

```js
// RED FLAG 1 : catch vide ou trop générique
try {
  await db.query(sql)
} catch(e) {
  console.error(e) // qu'est-ce qui se passe côté appelant ? Rien.
  // l'erreur est avalée, pas propagée
}

// RED FLAG 2 : validation de type absente
function processOrder(order) {
  return order.total * 1.2 // et si order est undefined ? si total est un string ?
}

// RED FLAG 3 : mutation silencieuse
function addItem(cart, item) {
  cart.items.push(item) // mutation directe de l'objet passé en param
  return cart           // l'appelant ne sait pas que son objet a changé
}

// RED FLAG 4 : async sans await
async function saveUser(user) {
  db.insert(user) // pas d'await : la fonction retourne avant l'insertion
  return { success: true } // succès menteur
}

// RED FLAG 5 : comparaison avec == au lieu de ===
if (userId == null) { // vrai pour null ET undefined ET 0 ET ''
  // peut-être voulu, probablement pas
}
```

---

## 3) TYPAGE AVEC ZOD : LA GARDE DU CORPS DE L'IA

Zod (schéma de validation runtime en JS/TS) : tu déclares la forme exacte que tu attends, et Zod vérifie à l'exécution. Si la sortie de l'IA ne matche pas, elle ne passe pas.

```js
import { z } from 'zod'

// Tu définis ce que tu attends de l'API ou de la sortie LLM
const UserSchema = z.object({
  id: z.string().uuid(),                         // UUID valide, pas juste un string
  email: z.string().email(),                     // email syntaxiquement valide
  age: z.number().int().min(0).max(150),         // nombre entier, range réaliste
  role: z.enum(['admin', 'user', 'moderator']),  // enum strict : pas d'autre valeur
  createdAt: z.string().datetime(),              // date ISO 8601 valide
})

type User = z.infer<typeof UserSchema> // TypeScript type déduit du schema

// Validation à la frontière (entrée de module, réponse API, sortie LLM)
function processUser(rawData: unknown): User {
  // parse() lève une ZodError détaillée si quelque chose cloche
  const user = UserSchema.parse(rawData)
  // ici on sait que user est valid : le reste du code peut lui faire confiance
  return user
}

// safeParse() si tu veux gérer l'erreur proprement
function tryProcessUser(rawData: unknown): { ok: true; user: User } | { ok: false; error: string } {
  const result = UserSchema.safeParse(rawData)
  if (!result.success) {
    return { ok: false, error: result.error.message }
  }
  return { ok: true, user: result.data }
}
```

La règle : **tout ce qui vient de l'extérieur (API, LLM, utilisateur, DB) passe par un schema Zod**. Tout. Sans exception.

---

## 4) VALIDER LA SORTIE D'UN LLM : LE CAS SPÉCIFIQUE

L'IA génère du texte. Si tu lui demandes du JSON, elle génère du texte qui ressemble à du JSON. Parfois c'est du JSON valide. Parfois c'est du JSON cassé avec une virgule en trop. Parfois c'est du JSON valide mais avec des champs manquants.

```js
import { z } from 'zod'

// Schema pour ce qu'on attend du LLM
const LLMCodeReviewSchema = z.object({
  issues: z.array(z.object({
    line: z.number().int().positive(),
    severity: z.enum(['error', 'warning', 'info']),
    message: z.string().min(10),  // pas de messages vides ou de 2 caractères
    suggestion: z.string().optional(),
  })),
  summary: z.string().max(500),
  score: z.number().min(0).max(10),
})

async function getCodeReview(code: string) {
  const response = await callLLM(`
    Analyse ce code JavaScript et retourne UNIQUEMENT un JSON valide avec cette structure :
    {
      "issues": [{ "line": number, "severity": "error"|"warning"|"info", "message": string, "suggestion": string? }],
      "summary": string,
      "score": number entre 0 et 10
    }
    Code à analyser :
    ${code}
  `)

  // L'IA peut envoyer du markdown avec des backticks autour : on nettoie
  const cleaned = response
    .replace(/```json\n?/g, '')  // retire les blocs markdown code
    .replace(/```\n?/g, '')       // retire la fermeture
    .trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)  // peut encore échouer sur du JSON mal formé
  } catch {
    throw new Error(`LLM returned invalid JSON: ${cleaned.slice(0, 100)}`)
  }

  // Validation du schema : si ça passe, on a un objet garanti correct
  const result = LLMCodeReviewSchema.safeParse(parsed)
  if (!result.success) {
    throw new Error(`LLM response doesn't match expected schema: ${result.error.message}`)
  }

  return result.data // TypeScript sait maintenant exactement le type de cet objet
}
```

---

## 5) TESTS POUR VALIDER LA LOGIQUE

L'IA génère souvent du code qui passe ses propres tests. Ton travail : trouver les tests qu'elle n'a pas écrits.

Méthode : après avoir généré une fonction, demande-toi :

```
1. Qu'est-ce qui se passe si l'input est vide ?
2. Qu'est-ce qui se passe si l'input est null ou undefined ?
3. Qu'est-ce qui se passe avec des valeurs limites (0, -1, très grand nombre, string vide) ?
4. Qu'est-ce qui se passe en cas d'erreur réseau / DB ?
5. Est-ce que la fonction est idempotente (même résultat si appelée deux fois) si elle doit l'être ?
6. Est-ce que les effets de bord (mutations, écriture DB) sont cohérents ?
```

```js
// L'IA génère cette fonction
function calculateDiscount(price: number, discountPercent: number): number {
  return price - (price * discountPercent / 100)
}

// L'IA écrit ce test :
test('applies 10% discount', () => {
  expect(calculateDiscount(100, 10)).toBe(90) // ça marche, tout va bien
})

// Toi tu écris LES VRAIS tests :
describe('calculateDiscount', () => {
  test('applies 10% discount on standard price', () => {
    expect(calculateDiscount(100, 10)).toBe(90)
  })

  test('returns original price when discount is 0', () => {
    expect(calculateDiscount(100, 0)).toBe(100)
  })

  test('returns 0 when discount is 100%', () => {
    expect(calculateDiscount(100, 100)).toBe(0)
  })

  test('handles negative price', () => {
    // Comportement attendu ? Exception ? Ou valeur négative ?
    expect(() => calculateDiscount(-100, 10)).toThrow() // ou pas : à décider
  })

  test('rejects discount above 100%', () => {
    expect(() => calculateDiscount(100, 150)).toThrow()
    // l'IA n'a pas géré ce cas : -50 pour un prix, c'est pas un discount
  })

  test('handles floating point precision', () => {
    // 0.1 + 0.2 !== 0.3 : le classique
    expect(calculateDiscount(10, 33.33)).toBeCloseTo(6.667, 2)
    // toBeCloseTo plutôt que toBe : les floats ne s'égalisent pas exactement
  })
})
```

---

## 6) TESTS AUTOMATIQUES SUR LES FRONTIÈRES DE MODULE

La validation ne concerne pas qu'une fonction. Elle concerne les points d'entrée de chaque module.

```js
// Pattern : wrapping de module avec validation à l'entrée et à la sortie

import { z } from 'zod'

const CreateUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
})

const CreatedUserOutputSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string().datetime(),
  // JAMAIS le password ou son hash dans la sortie
})

// La fonction exposée est un wrapper qui valide les deux bouts
async function createUser(rawInput: unknown) {
  // 1. Valide l'entrée avant de faire quoi que ce soit
  const input = CreateUserInputSchema.parse(rawInput)

  // 2. La logique métier (générée par l'IA ou écrite à la main)
  const user = await userRepository.create({
    ...input,
    password: await bcrypt.hash(input.password, 12),
  })

  // 3. Valide la sortie avant de la retourner
  return CreatedUserOutputSchema.parse(user)
  // si la DB retourne quelque chose d'inattendu, ça casse ici, pas chez l'appelant
}
```

Ce pattern : **validate-in, validate-out**. Peu importe ce que l'IA a mis au milieu, les frontières sont propres.

---

## EXERCICES

**EXO 1 : La chasse aux red flags**
Demande à l'IA de générer une fonction `registerUser(email, password, name)` sans aucune contrainte dans ton prompt. Lis le résultat. Identifie tous les red flags de la liste vue ici. Corrige chacun en expliquant pourquoi c'est un problème. (20 minutes)

**EXO 2 : Le schema Zod d'une API externe**
Imagine que tu consommes une API météo qui retourne : température, condition (sunny/rainy/cloudy), humidité, prévisions sur 5 jours. Écris le schema Zod complet pour cette réponse. Inclus les validations de range logiques (température entre -100 et 100, humidité entre 0 et 100, etc.). (15 minutes)

**EXO 3 : Les tests que l'IA oublie**
Génère une fonction `splitBill(total, people, tipPercent)` qui calcule le montant par personne avec pourboire. Écris au moins 8 tests unitaires en ciblant les cas que l'IA n'a probablement pas couverts. Exécute-les. Combien de bugs tu trouves ? (20 minutes)

---

## RÉSUMÉ

Le code généré par l'IA est un premier jet, pas une vérité. La validation se fait en 4 niveaux : lecture critique, typage statique, tests unitaires, tests d'intégration. Zod est ton garde du corps : tout ce qui vient de l'extérieur passe par un schema. Les tests que tu dois écrire sont ceux que l'IA n'a pas imaginés : les cas vides, négatifs, limites, et ceux qui cassent. Le pattern validate-in validate-out garantit des frontières propres peu importe ce que l'IA a mis au milieu.
