---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# L'IA EN SPARRING PARTNER : CHALLENGER, PAS REMPLAÇANT
Temps de lecture ~10 min

Le refactoring (restructuration du code sans changer son comportement) c'est l'exercice le plus risqué en dev. Tu touches du code qui fonctionne. Une erreur et tu régresses. Faire ça seul c'est dur : t'as des angles morts sur ton propre code.

L'IA est un très bon sparring partner pour le refactoring. Pas parce qu'elle refactore mieux que toi : parce qu'elle a zéro attachement émotionnel à ton code et qu'elle voit des patterns que tu ne vois plus car tu les regardes depuis trop longtemps.

C'est ce que fait Hershel dans Walking Dead avec Rick. Il ne prend pas les décisions à sa place. Mais il dit "Rick, tu n'as pas dormi depuis 3 jours et tu viens de décider de confier le camp à un inconnu". Un regard extérieur, sans les angles morts. C'est ça, l'IA en mode refactoring.

---

## 1) CE QUE L'IA PEUT FAIRE EN REFACTORING

```
BONNE UTILISATION :
- identifier les code smells sur du code que tu lui montres
- proposer des noms de variables / fonctions plus clairs
- suggérer des patterns alternatifs (factory au lieu d'un switch géant)
- détecter les duplications que t'as normalisées dans ta tête
- proposer une décomposition de fonction trop longue
- convertir du code impératif en version fonctionnelle
- identifier les violations SOLID dans une classe

MAUVAISE UTILISATION :
- lui demander de "refactorer tout le module" d'un coup
- accepter sa proposition sans comprendre pourquoi
- lui faire refactorer du code qu'elle ne peut pas exécuter ou tester
- ignorer que sa version peut changer le comportement silencieusement
```

La règle : **tu restes le juge**. Elle propose, tu décides, tu comprends, tu testes.

---

## 2) LE WORKFLOW DU REFACTORING AVEC L'IA

```
ÉTAPE 1 : Tests en place d'abord
 --> JAMAIS de refactoring sans filet de sécurité
 --> si t'as pas de tests, l'IA te génère les tests avant qu'on touche au code

ÉTAPE 2 : Montre le code à l'IA
 --> contexte : qu'est-ce que cette fonction est censée faire ?
 --> objectif : qu'est-ce qui te choque dans ce code ?

ÉTAPE 3 : Demande un diagnostic, pas une solution
 --> "Liste les problèmes que tu vois dans ce code. Ne réécris pas encore."

ÉTAPE 4 : Évalue le diagnostic
 --> est-ce que t'es d'accord ? qu'est-ce qu'elle a raté ? qu'est-ce qu'elle a vu que t'avais pas ?

ÉTAPE 5 : Refactore un problème à la fois
 --> "Résous seulement le problème X. Garde tout le reste identique."

ÉTAPE 6 : Tests passent toujours
 --> après chaque micro-refactoring : tes tests repassent. Si non : rollback immédiat.

ÉTAPE 7 : Comprends la différence
 --> "Explique exactement ce que tu as changé et pourquoi c'est mieux."
```

---

## 3) DIAGNOSTIC D'ABORD : LE PATTERN QUI CHANGE TOUT

La plupart des devs demandent à l'IA de refactorer directement. Erreur. Demande d'abord ce qui cloche.

```js
// Le code du camp de survie de Rick, version spaghetti
function gererSurvivant(survivant, camp, config, db) {
 if (survivant && survivant.competences && survivant.competences.length > 0) {
  let score = 0
  for (let i = 0; i < survivant.competences.length; i++) {
   if (survivant.competences[i].active) {
    score += survivant.competences[i].valeur * survivant.competences[i].niveau
    if (survivant.rang === 'veteran') {
     score = score * 1.3
    }
   }
  }
  if (score > 0) {
   db.survivants.insert({ campId: camp.id, score: score, date: new Date() })
   config.notifService.send(camp.responsable, 'Survivant intégré', `Score : ${score}`)
   return { succes: true, score: score }
  }
 }
 return { succes: false }
}
```

Prompt correct :
```
"Identifie tous les problèmes de design dans cette fonction.
Liste-les par ordre de gravité.
Ne propose pas de solution encore."
```

L'IA va identifier :
- violation du SRP (Single Responsibility Principle) : cette fonction fait tout
- le bonus vétéran appliqué par compétence (bug logique possible : devrait s'appliquer sur le total)
- mutation de `score` dans une boucle conditionnelle
- couplage fort avec `db` et `config` (difficile à tester)
- pas de gestion d'erreur si `db.insert` échoue
- retour `{ succes: false }` sans raison (impossible à debugger)

Maintenant tu décides quoi corriger en premier. L'IA ne décide pas.

---

## 4) LE REFACTORING PAR ÉTAPES

Une fois le diagnostic fait, on refactore en tranches. Chaque tranche change une chose.

```js
// ÉTAPE 1 : Extraire le calcul du score (SRP)
function calculerScoreSurvivant(
 competences: Competence[],
 estVeteran: boolean
): number {
 const competencesActives = competences.filter(c => c.active)

 const sousTotal = competencesActives.reduce(
  (sum, c) => sum + c.valeur * c.niveau,
  0
 )

 // le bonus vétéran s'applique sur le total, pas sur chaque compétence
 // c'est un bug fix ET un refactoring en même temps : à noter dans le commit
 return estVeteran ? sousTotal * 1.3 : sousTotal
}

// Test de ÉTAPE 1 avant de continuer
test('calcule le score sans bonus', () => {
 const competences = [{ valeur: 10, niveau: 2, active: true }]
 expect(calculerScoreSurvivant(competences, false)).toBe(20)
})

test('applique le bonus vétéran sur le total', () => {
 const competences = [{ valeur: 10, niveau: 2, active: true }]
 expect(calculerScoreSurvivant(competences, true)).toBeCloseTo(26, 1) // 20 * 1.3
})

// Les tests passent. On continue.
```

```js
// ÉTAPE 2 : Extraire la persistance (SRP + injectabilité)
async function enregistrerSurvivant(
 repository: SurvivantRepository, // interface, pas l'objet db directement
 campId: string,
 score: number
): Promise<void> {
 await repository.insert({ campId, score, date: new Date() })
}
```

```js
// ÉTAPE 3 : La fonction principale devient un orchestrateur propre
async function integrerSurvivant(
 survivant: Survivant,
 camp: Camp,
 deps: { repository: SurvivantRepository; notifService: NotifService }
): Promise<ResultatIntegration> {
 if (!survivant.competences?.length) {
  return { succes: false, raison: 'Aucune compétence déclarée' }
  // maintenant l'appelant sait pourquoi ça a raté
 }

 const score = calculerScoreSurvivant(survivant.competences, survivant.rang === 'veteran')

 if (score === 0) {
  return { succes: false, raison: 'Toutes les compétences sont inactives' }
 }

 await enregistrerSurvivant(deps.repository, camp.id, score)

 await deps.notifService.send(
  camp.responsable,
  'Survivant intégré',
  `Score : ${score}`
 )

 return { succes: true, score }
}
```

À chaque étape : les tests repassent, le comportement est inchangé, la structure est meilleure.

---

## 5) L'IA POUR DÉTECTER LES DUPLICATIONS

Le code dupliqué (DRY : Don't Repeat Yourself) est difficile à voir quand t'es dedans depuis longtemps.

```js
// Tu montres ces deux fonctions à l'IA :
function validerChimisteCuisinier(chimiste) {
 if (!chimiste.nom || chimiste.nom.length < 2) {
  throw new Error('Nom invalide')
 }
 if (!chimiste.specialite || chimiste.specialite.length < 3) {
  throw new Error('Spécialité invalide')
 }
 if (chimiste.role !== 'cuisinier') {
  throw new Error('Pas un cuisinier')
 }
}

function validerChimisteAssistant(chimiste) {
 if (!chimiste.nom || chimiste.nom.length < 2) {
  throw new Error('Nom invalide')
 }
 if (!chimiste.specialite || chimiste.specialite.length < 3) {
  throw new Error('Spécialité invalide')
 }
 if (!['assistant', 'stagiaire'].includes(chimiste.role)) {
  throw new Error('Rôle invalide')
 }
}

// Prompt :
// "Ces deux fonctions ont des duplications. Propose une abstraction qui les élimine
// sans casser le comportement. Explique ta logique."
```

L'IA va proposer quelque chose. Toi tu évalues : est-ce que cette abstraction est plus claire ou plus obscure ? Est-ce qu'elle sacrifie la lisibilité pour l'élégance ?

Parfois la bonne réponse c'est : "la duplication est acceptable ici parce que les deux validations vont diverger dans le futur". L'IA ne sait pas ça. Walter White aurait des règles très différentes pour chacun. Toi tu décides.

---

## 6) LES LIMITES DU PARTENARIAT

L'IA ne peut pas :

```
VOIR TON CONTEXTE BUSINESS
 --> Elle ne sait pas que ce champ "status" peut avoir 12 valeurs dans ta logique métier
 --> Elle va simplifier et casser quelque chose qui semblait évident

COMPRENDRE TES CONTRAINTES HISTORIQUES
 --> "On garde ce format bizarre pour compatibilité avec le système legacy"
 --> L'IA va le "corriger" : c'est une régression déguisée en amélioration

SAVOIR CE QUI VA CHANGER DEMAIN
 --> "Ce module va intégrer 3 autres services dans 2 sprints"
 --> Elle va refactorer pour aujourd'hui. Toi tu penses à demain.

GARANTIR QUE SON REFACTORING EST ÉQUIVALENT
 --> Surtout sur du code avec des effets de bord complexes
 --> Les tests sont le seul filet réel
```

---

## EXERCICES

**EXO 1 : Le diagnostic avant la chirurgie sur le camp**
Écris (ou copie) une fonction du système de gestion du camp de Walking Dead : 30 à 50 lignes qui mélangent calcul de rations, alerte de sécurité et log d'événement. Montre-la à l'IA avec le prompt "diagnostique uniquement, ne réécris pas". Liste les problèmes qu'elle identifie. Classe-les : lesquels t'avais vus, lesquels t'avais pas vus ? (15 minutes)

**EXO 2 : Le refactoring en 3 commits dans la cuisine**
Prends une fonction de calcul de la production de Breaking Bad (rendement, quantité de précurseur, purification). 3 problèmes, 3 commits, tests qui passent entre chaque. Un message de commit distinct par étape. (25 minutes)

**EXO 3 : L'abstraction à évaluer**
Génère deux fonctions de validation similaires (ninja de village de la feuille, ninja de village de la brume) avec de la duplication. Demande à l'IA de proposer une abstraction. Évalue sa proposition : est-elle plus lisible ? Plus testable ? Est-ce qu'elle introduit du couplage inutile ? Écris ton verdict en 5 phrases. (15 minutes)

---

## RÉSUMÉ

L'IA ne remplace pas le refactoring : elle t'aide à ne plus être aveugle à ton propre code. Le bon ordre c'est : tests d'abord, diagnostic ensuite, refactoring par étapes, tests qui repassent à chaque étape. Tu demandes un diagnostic avant une solution. Tu évalues ce qu'elle propose plutôt que l'accepter. Et sur tout ce qui touche le contexte business, les contraintes historiques, et l'évolution future : c'est toi qui décides.
