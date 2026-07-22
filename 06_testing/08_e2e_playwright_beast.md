---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# E2E PLAYWRIGHT BEAST : SIMULER UN VRAI UTILISATEUR
Temps de lecture ~8 min

Un unit test vérifie une fonction.
Un test d'intégration vérifie plusieurs modules.
Un test E2E vérifie ce que l'utilisateur voit et fait : du clic jusqu'à la base de données.

Le soir de la cérémonie du Ballon d'Or, des milliers de journalistes accèdent à la plateforme de vote en même temps. Chacun clique, sélectionne, confirme. Si le bouton "Voter" plante pour 5% d'entre eux à cause d'un bug de timing, personne ne l'a vu venir en unit test. Playwright l'aurait vu.

Playwright lance un vrai navigateur (Chromium, Firefox, WebKit), clique, tape, attend, et vérifie. Si un humain peut le faire sur ton app, Playwright peut le tester.

---

## 1) INSTALLER PLAYWRIGHT

```bash
npm install --save-dev @playwright/test
npx playwright install  # télécharge les navigateurs
```

Configuration minimale dans `playwright.config.js` :
```js
const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
 testDir: './tests/e2e',
 use: {
  baseURL: 'http://localhost:3000',
  headless: true,  // true en CI, false pour voir ce qui se passe en debug
 },
})
```

---

## 2) PREMIER TEST E2E : LE VOTE DU BALLON D'OR

```js
// tests/e2e/vote.spec.js
const { test, expect } = require('@playwright/test')

test('un journaliste peut voter pour le Ballon d\'Or', async ({ page }) => {
 // naviguer vers la page de vote
 await page.goto('/vote')

 // vérifier que la page est chargée
 await expect(page).toHaveTitle(/Ballon d'Or/)

 // remplir le formulaire de vote
 await page.fill('[data-testid="journaliste-nom"]', 'Jean Dupont')
 await page.selectOption('[data-testid="choix-joueur"]', 'messi')
 await page.click('[data-testid="bouton-voter"]')

 // vérifier le message de confirmation
 await expect(page.locator('[data-testid="confirmation"]'))
  .toHaveText('Vote enregistré')
})
```

Playwright ouvre un vrai navigateur, fait exactement ce qu'un journaliste ferait le soir de la cérémonie.

---

## 3) LES LOCATORS : TROUVER LES ÉLÉMENTS

Playwright a plusieurs façons de trouver un élément. Certaines sont meilleures que d'autres.

```js
// EVITER : fragile, casse si le HTML change
page.locator('.vote-button')
page.locator('#btn-submit')
page.locator('div > button:nth-child(2)')

// PRÉFÉRER : sémantique, stable
page.getByRole('button', { name: 'Voter' })
page.getByLabel('Joueur')
page.getByText('Vote enregistré')
page.getByPlaceholder('Nom du journaliste')

// ACCEPTABLE pour les tests : data-testid explicite
page.locator('[data-testid="bouton-voter"]')
```

Règle : utilise `getByRole` et `getByLabel` en priorité.
Les sélecteurs CSS et XPath cassent à la première restructuration du HTML.

---

## 4) ATTENTES : PLAYWRIGHT EST ASYNC PAR DÉFAUT

Playwright attend automatiquement que les éléments soient prêts avant d'interagir.
Mais pour les assertions, tu dois explicitement attendre.

```js
// automatique : Playwright attend que l'élément soit cliquable
await page.click('button')

// attendre qu'un élément apparaisse (animations, chargement du classement)
await expect(page.locator('[data-testid="classement"]')).toBeVisible()

// attendre qu'un texte soit présent
await expect(page.locator('[data-testid="classement"]')).toContainText('Messi')

// attendre une navigation vers la page de confirmation
await page.click('[data-testid="voir-classement"]')
await page.waitForURL('/classement')

// timeout personnalisé si une opération est lente (ex: calcul du vainqueur)
await expect(page.locator('[data-testid="vainqueur"]')).toBeVisible({ timeout: 10000 })
```

---

## 5) FIXTURES : PRÉPARER L'ÉTAT

Les tests E2E ont besoin d'un état cohérent. Un journaliste non authentifié ne peut pas voter. Playwright permet de préparer cet état avant chaque test.

```js
// tests/e2e/fixtures.js
const { test: baseTest } = require('@playwright/test')

// fixture qui crée un journaliste authentifié avant le test
const test = baseTest.extend({
 journalisteConnecté: async ({ page }, use) => {
  await page.goto('/enter_dojo')
  await page.fill('[data-testid="email"]', 'jean@lequipe.fr')
  await page.fill('[data-testid="password"]', 'pass1234')
  await page.click('[data-testid="btn-login"]')
  await page.waitForURL('/dashboard')
  // maintenant le contexte est authentifié pour tout le test
  await use(page)
 }
})

module.exports = { test }
```

```js
// tests/e2e/vote-auth.spec.js
const { test } = require('./fixtures')
const { expect } = require('@playwright/test')

test('un journaliste connecté peut voter', async ({ journalisteConnecté: page }) => {
 await page.goto('/vote')
 // page est déjà authentifiée grâce à la fixture
 await page.selectOption('[data-testid="choix-joueur"]', 'messi')
 await page.click('[data-testid="bouton-voter"]')
 await expect(page.locator('[data-testid="confirmation"]')).toBeVisible()
})
```

---

## 6) CE QUE L'E2E ATTRAPE QUE PERSONNE D'AUTRE NE VOIT

```
Exemple : soir de la cérémonie Ballon d'Or

Unit tests : validerVote() retourne true
Intégration : vote stocké en DB
Contract : format de réponse API respecté

E2E : le bouton "Voter" est désactivé après un vote, mais
   si le journaliste clique très vite deux fois (double-click),
   deux votes sont envoyés depuis le même compte.
   Aucun des tests précédents ne pouvait voir ça.
   Playwright le voit en 30 secondes.
```

L'E2E teste le technique comme un utilisateur l'utilise. Les comportements liés au timing, aux animations, aux interactions UI : invisibles ailleurs.

---

## 7) E2E EN CI : NE PAS EN ABUSER

Les tests E2E sont lents (10-60 secondes par test). Sur une suite de 50 tests E2E : plusieurs minutes.

En CI/CD, les règles pratiques :
- unit tests : à chaque push
- intégration : à chaque push
- E2E : sur les PRs et avant deploy, pas sur chaque commit

Et ne teste en E2E que les **flux critiques** :
- connexion du journaliste
- vote et confirmation
- affichage du classement final

Pas besoin d'E2E sur chaque bouton. Les unit tests couvrent les détails.

---

## EXERCICES

## EXO 1 : le bug du soir de cérémonie

Tu hérites d'un rapport de bug soumis le soir de la cérémonie : "Des journalistes disent avoir voté mais leur vote n'apparaît pas dans le classement en direct." Ton unit test passe. Ton test d'intégration passe. Quelque chose se passe entre le clic et le serveur.

Écris un test Playwright qui reproduit le chemin complet : connexion → vote → vérification que le vote est visible dans le classement en direct. Si ce test passe, le bug est ailleurs. S'il échoue, tu viens de localiser le problème à l'interface.

Contrainte : utilise `getByRole` et `getByLabel` pour tous les sélecteurs. Aucun sélecteur CSS, aucun `data-testid` inventé. Construis le test comme si l'interface existait, et commente ce que chaque sélecteur cherche.

(Indice : la page de classement met peut-être 2-3 secondes à se mettre à jour après le vote. `await expect(...).toBeVisible({ timeout: 5000 })` est ton filet.)

---

## EXO 2 : simuler la pression du jour J

Le soir de la cérémonie, des milliers de journalistes votent en même temps. Playwright peut pas simuler 1000 utilisateurs, mais il peut simuler un cas de concurrence : deux votes du même compte depuis deux onglets différents.

Écris un test qui :
1. ouvre deux contextes de navigateur distincts (`browser.newContext()`)
2. dans les deux contextes, connecte le même journaliste
3. lance les deux votes quasi-simultanément avec `Promise.all`
4. vérifie que le système n'a enregistré qu'un seul vote (le deuxième doit être rejeté ou ignoré)

C'est ça, un test E2E qui teste autre chose que le flux normal. Et c'est exactement ce que les unit tests ne peuvent pas voir.

---

## RÉSUMÉ

Playwright lance un vrai navigateur et simule un vrai utilisateur.
`getByRole`, `getByLabel`, `getByText` : plus stables que les sélecteurs CSS.
Playwright attend automatiquement les éléments : utilise `expect(...).toBeVisible()` pour les assertions async.
E2E attrape ce que les autres tests ne voient pas : timing, UI, interactions complexes.
Ne mets pas tout en E2E : c'est lent. Réserve-les aux flux critiques.
