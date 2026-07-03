# TESTING GRIMOIRE

Le vocabulaire du testing. Chaque terme à sa place. Pas de confusion possible.

---

## TYPES DE TESTS

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Unit test | Teste une seule fonction en isolation totale, toutes les dépendances remplacées par des mocks | `expect(calculeKDA(10,5,2)).toBe(6.25)` | sniper qui vise un seul ennemi / chirurgien qui opère un seul organe |
| Test d'intégration | Teste plusieurs modules branchés ensemble, vérifie que les interfaces sont compatibles | `const r = validateVote(vote); stockeVote(r)` | tester toute une chaîne de montage / brancher deux circuits et vérifier que le courant passe |
| Test E2E | Simule un shinobi réel dans un vrai navigateur du clic jusqu'à la base de données | `await page.click('button'); expect(...).toBeVisible()` | observateur qui suit le client de l'entrée jusqu'à la caisse / agent qui teste le parcours complet |
| Contract test | Vérifie que le format de réponse d'un service respecte ce qu'un autre service attend | `validContrat(réponse, schéma)` | contrat signé entre deux équipes / cahier des charges que chaque partie s'engage à respecter |
| TDD | Écrire le test avant le code, cycle RED → GREEN → REFACTOR | écrire `expect(fn()).toBe(x)` avant `fn()` existe | dessiner le plan avant de construire / écrire le cahier des charges avant de coder |

---

## DOUBLURES DE TEST

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Mock | Remplace une dépendance ET enregistre les appels : qui l'a appelé, combien de fois, avec quels args | `const envoi = jest.fn(); expect(envoi).toHaveBeenCalledWith(...)` | acteur doublure qui joue le rôle ET garde un journal de tournage / agent sous couverture qui rapporte tous les contacts |
| Stub | Remplace une fonction par une valeur fixe sans enregistrer les appels, sert juste à contrôler le retour | `jest.fn().mockReturnValue(true)` | réponse automatique sur un téléphone / panneau qui indique toujours la même direction |
| Spy | Surveille une vraie fonction sans la remplacer : la laisse s'exécuter et enregistre comment elle a été appelée | `jest.spyOn(logger, 'warn')` | caméra de surveillance qui observe sans intervenir / observateur qui prend des notes sans toucher |
| Fake | Implémentation simplifiée mais fonctionnelle (ex: DB in-memory), différente de la vraie mais qui marche | base de données tableau JS à la place de PostgreSQL | décor de cinéma qui ressemble à la vraie chose / simulateur de vol qui reproduit les conditions sans voler vraiment |

---

## CONCEPTS JEST

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| `describe` | Groupe logique de tests autour d'une même unité, affecte pas l'exécution, juste l'organisation | `describe('calculeKDA', () => { ... })` | chapitre d'un livre / dossier qui regroupe les fichiers d'un même sujet |
| `it` / `test` | Déclare un test individuel avec une description en langage humain du comportement attendu | `it('retourne 0 si deaths vaut 0', ...)` | scénario d'un film / règle précise dans un contrat |
| `expect` | Lance une assertion : compare la valeur réelle à la valeur attendue via un matcher | `expect(valeur).toBe(résultat)` | balance qui compare deux poids / arbitre qui vérifie si la balle est dans la zone |
| `beforeEach` | Callback qui s'exécute avant chaque test du describe : remise à zéro de l'état | `beforeEach(() => { store.clear() })` | préparation du terrain avant chaque match / reset d'une console de jeu |
| `afterEach` | Callback après chaque test : nettoyage des effets de bord (timers, mocks, connexions) | `afterEach(() => { jest.clearAllMocks() })` | nettoyage du plateau après chaque round / fermeture des connexions après chaque session |
| `jest.clearAllMocks` | Réinitialise les compteurs et retours de tous les mocks sans les désinstaller | `jest.clearAllMocks()` | effacer le tableau sans enlever la craie / vider les compteurs sans débrancher les capteurs |

---

## MATCHERS

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| `toBe` | Égalité stricte (===), pour les primitives uniquement, échoue sur les objets (référence) | `expect(42).toBe(42)` | comparer deux empreintes digitales / vérifier l'identité d'une personne, pas juste sa ressemblance |
| `toEqual` | Comparaison profonde de valeur, pour les objets et tableaux : compare le contenu pas la référence | `expect({a:1}).toEqual({a:1})` | comparer le contenu de deux coffres-forts / vérifier si deux copies d'un document sont identiques |
| `toBeCloseTo` | Comparaison de flottants avec tolérance (±2 décimales par défaut) | `expect(0.1+0.2).toBeCloseTo(0.3)` | mesure à quelques millimètres près / poids au gramme près et pas à l'atome |
| `toThrow` | Vérifie qu'une fonction lève une erreur (l'appel doit être wrappé dans une arrow function) | `expect(() => fn()).toThrow('msg')` | tester qu'une alarme sonne / vérifier qu'un fusible saute sous surcharge |
| `toHaveBeenCalledWith` | Vérifie les arguments exacts avec lesquels un mock a été appelé | `expect(fn).toHaveBeenCalledWith('arg')` | vérifier les logs d'accès avec les détails / contrôler la titan passée, pas juste qu'une titan a été passée |

---

## CONCEPTS AVANCÉS

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Coverage | Pourcentage de lignes/branches/fonctions exécutées par les tests, révèle les zones non testées | `jest --coverage` | carte thermique des zones visitées / audit qui montre les parties non inspectées |
| AAA | Arrange-Act-Assert : les trois phases d'un test : préparer les données, appeler le code, vérifier le résultat | commentaires `// ARRANGE / ACT / ASSERT` | avant le match / pendant le match / après le match |
| Consumer-driven contract | Contrat d'API défini par le consommateur, pas le fournisseur : le client dit ce dont il a besoin | fichier pact généré par les tests consumer | le client qui définit les specs du produit qu'il titan / l'acheteur qui rédige le cahier des charges |
| Playwright locator | Référence à un élément UI dans Playwright, préférer les sélecteurs sémantiques aux CSS | `page.getByRole('button', { name: 'Voter' })` | description d'une personne par son rôle plutôt que son numéro de siège / chercher "le caissier" plutôt que "siège 14-C" |
| Test pyramid | Distribution idéale des tests : beaucoup d'unit (bas) → moins d'intégration → peu d'E2E (haut) | 80% unit / 15% intégration / 5% E2E | pyramid alimentaire : base large de légumes, sommet étroit de sucre / architecture : fondations larges, toit étroit |

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.
