---
stability: intemporel
---

# Page verrouillée

> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../31_annexes/18_GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~6 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## TESTING GRIMOIRE

Le vocabulaire du testing. Chaque terme à sa place. Pas de confusion possible.

---

## TYPES DE TESTS

| Terme              | Définition                                                                                    | Code                                                    | Analogies                                                                                          | Limite |
| ------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| Unit test          | Teste une seule fonction en isolation totale, toutes les dépendances remplacées par des mocks | `expect(calculeKDA(10,5,2)).toBe(6.25)`                 | sniper qui vise un seul ennemi / chirurgien qui opère un seul organe                               | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Test d'intégration | Teste plusieurs modules branchés ensemble, vérifie que les interfaces sont compatibles        | `const r = validateVote(vote); stockeVote(r)`           | tester toute une chaîne de montage / brancher deux circuits et vérifier que le courant passe       | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Test E2E           | Simule un shinobi réel dans un vrai navigateur du clic jusqu'à la base de données             | `await page.click('button'); expect(...).toBeVisible()` | observateur qui suit le client de l'entrée jusqu'à la caisse / agent qui teste le parcours complet | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Contract test      | Vérifie que le format de réponse d'un service respecte ce qu'un autre service attend          | `validContrat(réponse, schéma)`                         | contrat signé entre deux équipes / cahier des charges que chaque partie s'engage à respecter       | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| TDD                | Écrire le test avant le code, cycle RED → GREEN → REFACTOR                                    | écrire `expect(fn()).toBe(x)` avant `fn()` existe       | dessiner le plan avant de construire / écrire le cahier des charges avant de coder                 | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |

---

## DOUBLURES DE TEST

| Terme | Définition                                                                                                     | Code                                                               | Analogies                                                                                                               | Limite |
| ----- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------- |
| Mock  | Remplace une dépendance ET enregistre les appels : qui l'a appelé, combien de fois, avec quels args            | `const envoi = jest.fn(); expect(envoi).toHaveBeenCalledWith(...)` | acteur doublure qui joue le rôle ET garde un journal de tournage / agent sous couverture qui rapporte tous les contacts | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Stub  | Remplace une fonction par une valeur fixe sans enregistrer les appels, sert juste à contrôler le retour        | `jest.fn().mockReturnValue(true)`                                  | réponse automatique sur un téléphone / panneau qui indique toujours la même direction                                   | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Spy   | Surveille une vraie fonction sans la remplacer : la laisse s'exécuter et enregistre comment elle a été appelée | `jest.spyOn(logger, 'warn')`                                       | caméra de surveillance qui observe sans intervenir / observateur qui prend des notes sans toucher                       | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Fake  | Implémentation simplifiée mais fonctionnelle (ex: DB in-memory), différente de la vraie mais qui marche        | base de données tableau JS à la place de PostgreSQL                | décor de cinéma qui ressemble à la vraie chose / simulateur de vol qui reproduit les conditions sans voler vraiment     | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |

---

## CONCEPTS JEST

| Terme                | Définition                                                                                     | Code                                        | Analogies                                                                                   | Limite |
| -------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------- | ------- |
| `describe`           | Groupe logique de tests autour d'une même unité, affecte pas l'exécution, juste l'organisation | `describe('calculeKDA', () => { ... })`     | chapitre d'un livre / dossier qui regroupe les fichiers d'un même sujet                     | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| `it` / `test`        | Déclare un test individuel avec une description en langage humain du comportement attendu      | `it('retourne 0 si deaths vaut 0', ...)`    | scénario d'un film / règle précise dans un contrat                                          | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| `expect`             | Lance une assertion : compare la valeur réelle à la valeur attendue via un matcher             | `expect(valeur).toBe(résultat)`             | balance qui compare deux poids / arbitre qui vérifie si la balle est dans la zone           | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| `beforeEach`         | Callback qui s'exécute avant chaque test du describe : remise à zéro de l'état                 | `beforeEach(() => { store.clear() })`       | préparation du terrain avant chaque match / reset d'une console de jeu                      | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| `afterEach`          | Callback après chaque test : nettoyage des effets de bord (timers, mocks, connexions)          | `afterEach(() => { jest.clearAllMocks() })` | nettoyage du plateau après chaque round / fermeture des connexions après chaque session     | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| `jest.clearAllMocks` | Réinitialise les compteurs et retours de tous les mocks sans les désinstaller                  | `jest.clearAllMocks()`                      | effacer le tableau sans enlever la craie / vider les compteurs sans débrancher les capteurs | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |

---

## MATCHERS

| Terme                  | Définition                                                                                        | Code                                     | Analogies                                                                                                   | Limite |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------- |
| `toBe`                 | Égalité stricte (===), pour les primitives uniquement, échoue sur les objets (référence)          | `expect(42).toBe(42)`                    | comparer deux empreintes digitales / vérifier l'identité d'une personne, pas juste sa ressemblance          | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| `toEqual`              | Comparaison profonde de valeur, pour les objets et tableaux : compare le contenu pas la référence | `expect({a:1}).toEqual({a:1})`           | comparer le contenu de deux coffres-forts / vérifier si deux copies d'un document sont identiques           | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| `toBeCloseTo`          | Comparaison de flottants avec tolérance (±2 décimales par défaut)                                 | `expect(0.1+0.2).toBeCloseTo(0.3)`       | mesure à quelques millimètres près / poids au gramme près et pas à l'atome                                  | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| `toThrow`              | Vérifie qu'une fonction lève une erreur (l'appel doit être wrappé dans une arrow function)        | `expect(() => fn()).toThrow('msg')`      | tester qu'une alarme sonne / vérifier qu'un fusible saute sous surcharge                                    | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| `toHaveBeenCalledWith` | Vérifie les arguments exacts avec lesquels un mock a été appelé                                   | `expect(fn).toHaveBeenCalledWith('arg')` | vérifier les logs d'accès avec les détails / contrôler l'entrée passée, pas juste qu'une entrée a été passée | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |

---

## CONCEPTS AVANCÉS

| Terme                    | Définition                                                                                                    | Code                                          | Analogies                                                                                                                                            | Limite |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Coverage                 | Pourcentage de lignes/branches/fonctions exécutées par les tests, révèle les zones non testées                | `jest --coverage`                             | carte thermique des zones visitées / audit qui montre les parties non inspectées                                                                     | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| AAA                      | Arrange-Act-Assert : les trois phases d'un test : préparer les données, appeler le code, vérifier le résultat | commentaires `// ARRANGE / ACT / ASSERT`      | le rituel de combat de Naruto (préparer le chakra, lancer le jutsu, vérifier le résultat) / la check-list d'un pilote avant, pendant et après le vol | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Consumer-driven contract | Contrat d'API défini par le consommateur, pas le fournisseur : le client dit ce dont il a besoin              | fichier pact généré par les tests consumer    | le client qui définit les specs du produit qu'il titan / l'acheteur qui rédige le cahier des charges                                                | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Playwright locator       | Référence à un élément UI dans Playwright, préférer les sélecteurs sémantiques aux CSS                        | `page.getByRole('button', { name: 'Voter' })` | description d'une personne par son rôle plutôt que son numéro de siège / chercher "le caissier" plutôt que "siège 14-C"                              | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |
| Test pyramid             | Distribution idéale des tests : beaucoup d'unit (bas) → moins d'intégration → peu d'E2E (haut)                | 80% unit / 15% intégration / 5% E2E           | pyramid alimentaire : base large de légumes, sommet étroit de sucre / architecture : fondations larges, toit étroit                                  | L'image simplifie : le mécanisme runtime réel peut différer (spécificités moteur JS, edge cases, timing). |

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---

## OÙ LES ANALOGIES CASSENT (règle B.2)

Les analogies de ce grimoire simplifient : elles ne définissent pas. Une
closure **nest pas** un tiroir ; un event loop **nest pas** un carrousel ;
une pile **nest pas** une pile de crêpes. Chaque analogie sert à visualiser
un mécanisme ; elle cesse dès que tu veux raisonner sur la complexité, la
mémoire, la concurrence ou les cas limites. Reviens toujours à la définition
technique avant de coder, débugger ou expliquer à un pair. Une analogie
prise pour la réalité devient un obstacle épistémologique.
