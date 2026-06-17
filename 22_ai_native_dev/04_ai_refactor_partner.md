# L'IA en sparring partner : challenger, pas remplaçant

Le refactoring (restructuration du code sans changer son comportement) c'est l'exercice le plus risqué en dev. Tu touches du code qui fonctionne. Une erreur et tu régresses. Faire ça seul c'est dur : t'as des angles morts sur ton propre code.

L'IA est un très bon sparring partner pour le refactoring. Pas parce qu'elle refactore mieux que toi : parce qu'elle a zéro attachement émotionnel à ton code et qu'elle voit des patterns que tu nes plus car tu les regardes depuis trop longtemps.

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
// Code à analyser
function handleOrder(order, user, config, db) {
  if (order && order.items && order.items.length > 0) {
    let total = 0
    for (let i = 0; i < order.items.length; i++) {
      if (order.items[i].inStock) {
        total += order.items[i].price * order.items[i].quantity
        if (user.membership === 'premium') {
          total = total * 0.9
        }
      }
    }
    if (total > 0) {
      db.orders.insert({ userId: user.id, total: total, date: new Date() })
      config.emailService.send(user.email, 'Order confirmed', `Total: ${total}`)
      return { success: true, total: total }
    }
  }
  return { success: false }
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
- discount premium appliqué par item (bug logique possible)
- mutation de `total` dans une boucle qui dépend de conditions
- couplage fort avec `db` et `config` (difficile à tester)
- pas de gestion d'erreur si db.insert échoue
- retour `{ success: false }` sans raison (debug impossible)

Maintenant tu décides quoi corriger en premier. L'IA ne décide pas.

---

## 4) LE REFACTORING PAR ÉTAPES

Une fois le diagnostic fait, on refactore en tranches. Chaque tranche change une chose.

```js
// ÉTAPE 1 : Extraire le calcul du total (SRP)
function calculateOrderTotal(items: OrderItem[], isMembershipPremium: boolean): number {
  const itemsInStock = items.filter(item => item.inStock)

  const subtotal = itemsInStock.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return isMembershipPremium ? subtotal * 0.9 : subtotal
  // le discount s'applique sur le total, pas sur chaque item
  // c'est un bug fix ET un refactoring en même temps : à noter dans le commit
}

// Test de ÉTAPE 1 avant de continuer
test('calculates total without discount', () => {
  const items = [{ price: 10, quantity: 2, inStock: true }]
  expect(calculateOrderTotal(items, false)).toBe(20)
})

test('applies 10% premium discount on total', () => {
  const items = [{ price: 10, quantity: 2, inStock: true }]
  expect(calculateOrderTotal(items, true)).toBe(18) // 20 * 0.9
})

// Les tests passent. On continue.
```

```js
// ÉTAPE 2 : Extraire la persistance (SRP + injectabilité)
async function saveOrder(
  repository: OrderRepository,  // interface, pas l'objet db directement
  userId: string,
  total: number
): Promise<Order> {
  return repository.insert({
    userId,
    total,
    date: new Date(),
    status: 'confirmed',
  })
}
```

```js
// ÉTAPE 3 : La fonction principale devient un orchestrateur propre
async function processOrder(
  order: Order,
  user: User,
  deps: { repository: OrderRepository; emailService: EmailService }
): Promise<ProcessOrderResult> {
  if (!order.items?.length) {
    return { success: false, reason: 'Order has no items' }
    // maintenant l'appelant sait pourquoi ça a raté
  }

  const total = calculateOrderTotal(order.items, user.membership === 'premium')

  if (total === 0) {
    return { success: false, reason: 'No items in stock' }
  }

  const savedOrder = await saveOrder(deps.repository, user.id, total)

  await deps.emailService.send(
    user.email,
    'Order confirmed',
    `Total: ${total}`
  )

  return { success: true, orderId: savedOrder.id, total }
}
```

À chaque étape : les tests repassent, le comportement est inchangé, la structure est meilleure.

---

## 5) L'IA POUR DÉTECTER LES DUPLICATIONS

Le code dupliqué (DRY : Don't Repeat Yourself) est difficile à voir quand t'es dedans depuis longtemps.

```js
// Tu montres ces deux fonctions à l'IA :
function validateAdminUser(user) {
  if (!user.email || !user.email.includes('@')) {
    throw new Error('Invalid email')
  }
  if (!user.password || user.password.length < 8) {
    throw new Error('Password too short')
  }
  if (user.role !== 'admin') {
    throw new Error('Not an admin')
  }
}

function validateRegularUser(user) {
  if (!user.email || !user.email.includes('@')) {
    throw new Error('Invalid email')
  }
  if (!user.password || user.password.length < 8) {
    throw new Error('Password too short')
  }
  if (!['user', 'moderator'].includes(user.role)) {
    throw new Error('Invalid role')
  }
}

// Prompt :
// "Ces deux fonctions ont des duplications. Propose une abstraction qui les élimine
// sans casser le comportement. Explique ta logique."
```

L'IA va proposer quelque chose. Toi tu évalues : est-ce que cette abstraction est plus claire ou plus obscure ? Est-ce qu'elle sacrifie la lisibilité pour l'élégance ?

Parfois la bonne réponse c'est : "la duplication est acceptable ici parce que les deux validations vont diverger dans le futur". L'IA ne sait pas ça. Toi tu décides.

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

**EXO 1 : Le diagnostic avant la chirurgie**
Écris (ou copie) une fonction de 30 à 50 lignes qui mélange logique métier, accès DB et formatage de réponse. Montre-la à l'IA avec le prompt "diagnostique uniquement, ne réécris pas". Liste les problèmes qu'elle identifie. Classe-les : lesquels t'avais vus, lesquels t'avais pas vus ? (15 minutes)

**EXO 2 : Le refactoring en 3 commits**
Prends le diagnostic de l'EXO 1. Choisis 3 problèmes. Résous-les avec l'IA, un par un, avec les tests qui passent entre chaque étape. Écris un message de commit distinct pour chaque étape. (25 minutes)

**EXO 3 : L'abstraction à évaluer**
Génère deux fonctions similaires avec de la duplication. Demande à l'IA de proposer une abstraction. Évalue sa proposition : est-elle plus lisible ? Plus testable ? Est-ce qu'elle introduit du couplage inutile ? Écris ton verdict en 5 phrases. (15 minutes)

---

## RÉSUMÉ

L'IA ne remplace pas le refactoring : elle t'aide à ne plus être aveugle à ton propre code. Le bon ordre c'est : tests d'abord, diagnostic ensuite, refactoring par étapes, tests qui repassent à chaque étape. Tu demandes un diagnostic avant une solution. Tu évalues ce qu'elle propose plutôt que l'accepter. Et sur tout ce qui touche le contexte business, les contraintes historiques, et l'évolution future : c'est toi qui décides.
