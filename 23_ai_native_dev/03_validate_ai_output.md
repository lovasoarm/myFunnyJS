---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# CE QUE L'IA GÉNÈRE, TU NE LE CROIS PAS : TU LE VALIDES
Temps de lecture ~10 min

L'IA peut générer du code qui compile, qui passe les tests qu'elle a elle-même écrits, et qui explose quand un vrai utilisateur l'utilise. Ce n'est pas de la malveillance : c'est de l'optimisme statistique. Elle génère ce qui ressemble à la bonne réponse. Ton boulot : vérifier si c'est la vraie réponse.

Dans `09_oracle_glitch`, l'Oracle est le nom du pipeline LLM qu'on surveille. Pas parce qu'on lui fait confiance. Parce qu'on ne lui fait pas confiance, et qu'on a construit les outils pour le contrôler. Cette leçon, c'est la mécanique de ce contrôle.

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
 --> attrape : les interactions entre composants que l'IA n'a pas vues
```

Pour du code zone verte (utilitaires simples) : niveau 1 + 2 suffisent souvent.
Pour du code zone rouge (auth, logique métier, data) : les 4 niveaux sont obligatoires.

---

## 2) LECTURE CRITIQUE : LES RED FLAGS À REPÉRER

Quand tu lis du code généré par l'Oracle ou par n'importe quel LLM, ces patterns doivent déclencher une alarme :

```js
// RED FLAG 1 : catch vide ou trop générique
try {
 await analyserCodeNinja(jutsu)
} catch(e) {
 console.error(e) // l'erreur est avalée, pas propagée, l'appelant ne sait rien
}

// RED FLAG 2 : validation de type absente
function calculerPuissance(guerrier) {
 return guerrier.chakra * 1.5 // si guerrier est undefined ? si chakra est un string ?
}

// RED FLAG 3 : mutation silencieuse
function renforcerEquipe(equipe, newMember) {
 equipe.membres.push(newMember) // mutation directe de l'objet passé en paramètre
 return equipe          // l'appelant ne sait pas que son objet a changé
}

// RED FLAG 4 : async sans await
async function sauvegarderMission(mission) {
 db.insert(mission)       // pas d'await : la fonction retourne AVANT l'insertion
 return { success: true }    // succès menteur
}

// RED FLAG 5 : comparaison avec == au lieu de ===
if (chakraLevel == null) {    // vrai pour null ET undefined ET 0 ET ''
 // peut-être voulu, probablement pas
}
```

---

## 3) TYPAGE AVEC ZOD : LA GARDE DU CORPS DE L'ORACLE

Zod (schéma de validation runtime en JS/TS) : tu déclares la forme exacte que tu attends, et Zod vérifie à l'exécution. Si la sortie de l'Oracle ne matche pas, elle ne passe pas.

```js
import { z } from 'zod'

// Tu définis ce que tu attends de la sortie LLM
const AnalyseCodeSchema = z.object({
 bugs: z.array(z.object({
  ligne: z.number().int().positive(),
  severite: z.enum(['critique', 'majeur', 'mineur']),
  description: z.string().min(10),
  suggestion: z.string().optional(),
 })),
 scoreFiabilite: z.number().min(0).max(10),
 resume: z.string().max(500),
})

type AnalyseCode = z.infer<typeof AnalyseCodeSchema> // TypeScript type déduit du schema

// Validation à la frontière du module : l'Oracle ne passe pas sans contrôle
function traiterAnalyseOracle(rawData: unknown): AnalyseCode {
 const analyse = AnalyseCodeSchema.parse(rawData)
 // ici on sait que analyse est valide : le reste du code peut lui faire confiance
 return analyse
}

// safeParse() si tu veux gérer l'erreur proprement sans lancer d'exception
function tenterAnalyse(rawData: unknown): { ok: true; analyse: AnalyseCode } | { ok: false; erreur: string } {
 const result = AnalyseCodeSchema.safeParse(rawData)
 if (!result.success) {
  return { ok: false, erreur: result.error.message }
 }
 return { ok: true, analyse: result.data }
}
```

La règle : **tout ce qui vient de l'extérieur (API, LLM, utilisateur, DB) passe par un schema Zod**. Tout. Sans exception.

---

## 4) VALIDER LA SORTIE DE L'ORACLE : LE CAS SPÉCIFIQUE

L'IA génère du texte. Si tu lui demandes du JSON, elle génère du texte qui ressemble à du JSON. Parfois c'est du JSON valide. Parfois c'est du JSON cassé avec une virgule en trop. Parfois c'est du JSON valide mais avec des champs manquants.

```js
import { z } from 'zod'

const OracleCodeReviewSchema = z.object({
 problemes: z.array(z.object({
  ligne: z.number().int().positive(),
  severite: z.enum(['erreur', 'avertissement', 'info']),
  message: z.string().min(10),  // pas de messages vides ou de 2 caractères
  suggestion: z.string().optional(),
 })),
 resume: z.string().max(500),
 score: z.number().min(0).max(10),
})

async function demanderCodeReview(code: string) {
 const reponseOracle = await appellerLLM(`
  Analyse ce code JavaScript et retourne UNIQUEMENT un JSON valide avec cette structure :
  {
   "problemes": [{ "ligne": number, "severite": "erreur"|"avertissement"|"info", "message": string, "suggestion": string? }],
   "resume": string,
   "score": number entre 0 et 10
  }
  Code à analyser :
  ${code}
 `)

 // L'Oracle peut envoyer du markdown avec des backticks autour : on nettoie
 const nettoye = reponseOracle
  .replace(/```json\n?/g, '')  // retire les blocs markdown code
  .replace(/```\n?/g, '')    // retire la fermeture
  .trim()

 let parse: unknown
 try {
  parse = JSON.parse(nettoye)  // peut encore échouer sur du JSON mal formé
 } catch {
  throw new Error(`Oracle a retourné du JSON invalide : ${nettoye.slice(0, 100)}`)
 }

 // Validation du schema : si ça passe, on a un objet garanti correct
 const result = OracleCodeReviewSchema.safeParse(parse)
 if (!result.success) {
  throw new Error(`L'Oracle ne respecte pas le schema attendu : ${result.error.message}`)
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
4. Qu'est-ce qui se passe si l'Oracle répond avec un JSON tronqué à mi-chemin ?
5. Est-ce que la fonction est idempotente si elle doit l'être ?
6. Est-ce que les effets de bord (mutations, écriture DB) sont cohérents ?
```

```js
// L'Oracle génère cette fonction
function calculerScoreNinja(puissance: number, experienceAns: number): number {
 return puissance + (experienceAns * 10)
}

// L'Oracle écrit ce test :
test('calcule le score standard', () => {
 expect(calculerScoreNinja(500, 3)).toBe(530) // ça marche, tout va bien
})

// Toi tu écris LES VRAIS tests :
describe('calculerScoreNinja', () => {
 test('score standard : puissance + bonus expérience', () => {
  expect(calculerScoreNinja(500, 3)).toBe(530)
 })

 test('retourne la puissance brute si expérience est 0', () => {
  expect(calculerScoreNinja(500, 0)).toBe(500)
 })

 test('refuse une puissance négative', () => {
  expect(() => calculerScoreNinja(-100, 3)).toThrow()
 })

 test('refuse une expérience négative', () => {
  expect(() => calculerScoreNinja(500, -1)).toThrow()
 })

 test('gère les flottants de précision : le classique JS', () => {
  // 0.1 + 0.2 !== 0.3 : l'Oracle ne voit pas ce problème, toi tu le catches
  expect(calculerScoreNinja(0.1, 0.2)).toBeCloseTo(0.1 + 0.2 * 10, 5)
 })
})
```

---

## 6) TESTS AUTOMATIQUES SUR LES FRONTIÈRES DE MODULE

La validation ne concerne pas qu'une fonction. Elle concerne les points d'entrée de chaque module.

```js
// Pattern : validate-in, validate-out sur chaque frontière
import { z } from 'zod'

const InputAnalyseSchema = z.object({
 code: z.string().min(1),
 language: z.enum(['javascript', 'typescript']),
 contexte: z.string().max(500).optional(),
})

const OutputAnalyseSchema = z.object({
 scoreQualite: z.number().min(0).max(10),
 problemesDetectes: z.number().int().min(0),
 hallucinations: z.array(z.string()), // ce que l'Oracle a inventé
})

// La fonction exposée est un wrapper qui valide les deux bouts
async function analyserAvecOracle(rawInput: unknown) {
 // 1. Valide l'entrée avant de faire quoi que ce soit
 const input = InputAnalyseSchema.parse(rawInput)

 // 2. La logique (appel LLM + parsing)
 const reponse = await demanderCodeReview(input.code)

 // 3. Valide la sortie avant de la retourner
 return OutputAnalyseSchema.parse({
  scoreQualite: reponse.score,
  problemesDetectes: reponse.problemes.length,
  hallucinations: detecterHallucinations(reponse),
 })
 // si la sortie ne matche pas, ça casse ici, pas chez l'appelant
}
```

Ce pattern : **validate-in, validate-out**. Peu importe ce que l'Oracle a mis au milieu, les frontières sont propres.

---

## EXERCICES

**EXO 1 : La chasse aux red flags dans l'Oracle**
Demande à l'IA de générer une fonction `soumettreRapport(analyse, chevalier, zone)` qui enregistre en DB une analyse de terrain de Garo, sans aucune contrainte dans ton prompt. Lis le résultat. Identifie tous les red flags de la liste vue ici. Corrige chacun en expliquant pourquoi c'est un problème. (20 minutes)

**EXO 2 : Le schema Zod pour une réponse LLM de terrain**
L'Oracle analyse des missions de Garo et retourne pour chaque Horror : son nom, son niveau de menace (1-5), la zone d'apparition (string), le Chevalier recommandé, et une estimation de durée de combat en secondes. Écris le schema Zod complet avec les validations de range logiques. (15 minutes)

**EXO 3 : Les tests que l'Oracle oublie**
L'Oracle génère une fonction `repartirRecompenses(total, joueurs, bonusPercent)` qui calcule la part de chaque joueur avec bonus. Écris au moins 8 tests unitaires en ciblant les cas que l'IA n'a probablement pas couverts. Exécute-les. Combien de bugs tu trouves ? (20 minutes)

---

## RÉSUMÉ

Le code généré par l'Oracle est un premier jet, pas une vérité. La validation se fait en 4 niveaux : lecture critique, typage statique, tests unitaires, tests d'intégration. Zod est ton garde du corps : tout ce qui vient de l'extérieur passe par un schema. Les tests que tu dois écrire sont ceux que l'Oracle n'a pas imaginés : les cas vides, négatifs, limites, et les 0.1 + 0.2 de ce monde. Le pattern validate-in validate-out garantit des frontières propres peu importe ce que l'Oracle a mis au milieu.
