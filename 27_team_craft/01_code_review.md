---
stability: intemporel
---

# CODE REVIEW : REVIEWER SANS ÉCRASER
Temps de lecture ~10 min

Une PR non reviewée c'est une bombe à retardement.
Une PR mal reviewée c'est un dev junior qui décide de travailler en silence plutôt que de subir une correction humiliante.
Une bonne review : elle enseigne, elle protège, et elle construit la confiance dans l'équipe.

Ce fichier t'apprend à faire les trois.

---

## 1) CE QU'UNE CODE REVIEW N'EST PAS

Avant le code : les mauvaises intuitions à déraciner.

**Ce n'est pas un examen.**
T'es pas le prof. T'es un collègue qui regarde le code avant qu'il parte en prod.

**Ce n'est pas une démonstration de supériorité.**
Si ta review donne l'impression que t'es plus malin que l'auteur : t'as raté ta review.

**Ce n'est pas une chasse aux fautes.**
La review cherche des problèmes, pas des preuves d'incompétence.

**Ce n'est pas facultatif.**
"LGTM" (looks good to me) en 30 secondes sans lire le code : c'est pas une review. C'est une signature en blanc.

```
MAUVAISE REVIEW          BONNE REVIEW
--------------------------     --------------------------
"pourquoi t'as fait ça comme ça"  "cette approche fonctionne,
(ton accusateur)          mais si on ajoute X, on va
                  avoir un problème : regarde :"
"c'est pas la bonne façon"     "voilà une alternative avec
(pas d'alternative)         ses avantages et ses limites"

"ça marche mais c'est moche"    "c'est lisible mais le nom de
(subjectif, pas actionnable)    cette variable cache l'intent :
                  quelque chose comme `activeSessions`
                  serait plus clair"
```

---

## 2) LES TROIS NIVEAUX D'UN COMMENTAIRE DE REVIEW

Tout commentaire de review appartient à un de ces trois niveaux. Si tu l'identifies pas avant d'écrire : tu vas créer de la confusion.

**Bloquant :** le code ne peut pas merger dans cet état.
```
// BUG : cette fonction ne gère pas le cas `userId = null`
// Si l'utilisateur n'est pas connecté, `getUserData(null)` explose en prod.
// À corriger avant merge.
function getUserData(userId) {
 return db.find({ id: userId }); // `find({ id: null })` retourne tous les utilisateurs -- catastrophe
}
```

**Non-bloquant / à améliorer :** le code fonctionne, mais t'as une suggestion concrète.
```
// Suggestion : `filterActive` fait deux choses -- filtrer et logguer.
// Si on sépare les responsabilités, on peut tester chaque partie indépendamment.
// Pas bloquant, mais à considérer si on revient sur ce module.
function filterActive(matches) {
 const result = matches.filter(m => m.status === 'active');
 console.log(`matches actifs : ${result.length}`); // log mélangé à la logique
 return result;
}
```

**Nitpick :** micro-détail de style ou de convention, complètement optionnel.
```
// nitpick : `res` vs `response` -- pas bloquant, juste une cohérence
// avec les autres handlers du projet où on utilise toujours `response`.
app.get('/players', (req, res) => { ... })
```

**Règle :** si tu ne précises pas le niveau, l'auteur ne sait pas si c'est un bloquant ou un nitpick : et soit il sous-réagit, soit il panique pour rien.

---

## 3) COMMENT LIRE UNE PR AVANT DE COMMENTER

Ordre de lecture : pas ligne par ligne. D'abord le contexte, ensuite le code.

```
ÉTAPE 1 : lire la description de la PR
     --> quel problème ça résout ?
     --> pourquoi cette approche ?
     --> y a des tradeoffs connus ?

ÉTAPE 2 : regarder les fichiers modifiés dans l'ensemble
     --> quelle est la portée du changement ?
     --> est-ce qu'il y a des fichiers qui MANQUENT ?
       (exemple : feature ajoutée sans tests)

ÉTAPE 3 : lire le code dans le sens de l'exécution
     --> entry point (point d'entrée) --> logique principale --> sortie
     --> pas dans l'ordre alphabétique des fichiers

ÉTAPE 4 : chercher les cas aux limites (edge cases)
     --> null / undefined
     --> tableau vide
     --> utilisateur non connecté
     --> timeout réseau
     --> state concurrent (deux requêtes en même temps)

ÉTAPE 5 : vérifier ce qui n'est pas là
     --> tests manquants
     --> erreurs non catchées
     --> cas non documentés
```

---

## 4) ÉCRIRE UN COMMENTAIRE QUI AIDE

La structure d'un bon commentaire de review :

```
[observation] + [impact] + [suggestion ou question]
```

Exemple concret sur du code Walking Dead :

```javascript
// Code soumis en PR :
function calculateRations(survivors, totalFood) {
 return totalFood / survivors; // divise la nourriture par le nombre de survivants
}
```

Mauvais commentaire :
```
"tu gères pas le cas où survivors = 0"
```

Bon commentaire :
```
// Si `survivors` vaut 0 (tous morts ou groupe vide après une attaque),
// cette division retourne `Infinity` -- et ça passe silencieusement.
// En prod : le système de rationnement distribue des rations infinies à personne.
// Suggestion : ajouter une garde en entrée :
//
//  if (survivors <= 0) throw new RationError('no survivors to feed');
//
// Ou retourner 0 si un groupe vide est un cas valide dans notre logique.
// Bloquant -- ce cas arrive dès qu'un groupe est éliminé.
```

**La règle du pourquoi :**
Chaque commentaire bloquant doit expliquer ce qui casse : pas juste "c'est faux". L'auteur doit comprendre le danger, pas juste obéir.

---

## 5) RECEVOIR UNE REVIEW SANS PARTIR EN GUERRE

La review c'est bidirectionnel. Si t'es l'auteur :

```
RÉACTION COURANTE         RÉACTION UTILE
--------------------------     --------------------------
"il comprend pas mon code"     "est-ce que je peux mieux
                  l'expliquer dans un commentaire ?"

"c'est du nitpicking"       "est-ce que ce point bloque ou
                  c'est une suggestion ?"

"ça marche en local"        "est-ce que mon test couvre
                  le cas qu'il mentionne ?"

répondre sur le ton défensif    répondre : "merci, j'ai ajouté
                  le cas -- regarde le commit X"
```

Quand tu n'es pas d'accord : explique ton choix technique, pas ta frustration.
```
// L'auteur peut répondre à un commentaire :
// "J'ai choisi cette approche parce que `Array.prototype.find` retourne
// undefined plutôt que null -- et le reste du projet teste `=== undefined`.
// Si tu préfères une convention différente, on peut en discuter en équipe."
```

---

## 6) LA CHECKLIST D'UN REVIEWER SÉRIEUX

Avant d'approuver une PR, cette liste doit être passée :

```
FONCTIONNEL
[ ] le code fait ce que la PR dit qu'il fait
[ ] les cas aux limites sont couverts (null, empty, error)
[ ] les erreurs sont catchées et propagées correctement

TESTS
[ ] les tests existent
[ ] les tests testent vraiment quelque chose (pas juste 100% coverage artificiel)
[ ] si un bug est corrigé : un test qui aurait détecté ce bug est présent

LISIBILITÉ
[ ] les noms de variables et fonctions reflètent l'intent
[ ] la logique complexe est commentée
[ ] le code peut être lu sans l'auteur dans la salle

ARCHITECTURE
[ ] le changement respecte les conventions du projet
[ ] il n'y a pas de couplage (dépendance) inattendu
[ ] si une nouvelle abstraction est créée : elle est nécessaire

SÉCURITÉ (pour les features exposées)
[ ] les inputs utilisateurs sont validés
[ ] les données sensibles ne sont pas loguées
[ ] les permissions sont vérifiées

PERFORMANCE
[ ] pas de requête DB ou réseau dans une boucle
[ ] les structures de données choisies sont cohérentes avec la charge attendue
```

---

## EXERCICES

**EXO 1 : l'autopsie de PR**

Le code suivant a été soumis en PR par un survivant de la prison de Fox River.
Trouve tous les problèmes, classe-les (bloquant / suggestion / nitpick), et écris les commentaires selon la structure `[observation] + [impact] + [suggestion]`.

```javascript
// PR : "ajout de l'endpoint de vote pour le Ballon d'Or"
app.post('/vote', async (req, res) => {
 const player = req.body.player;
 const journalist = req.body.journalist;

 const existing = await db.query(
  `SELECT * FROM votes WHERE journalist = '${journalist}'` // concaténation directe
 );

 if (existing.length > 0) {
  res.send('already voted');
  return;
 }

 await db.query(
  `INSERT INTO votes VALUES ('${player}', '${journalist}', ${Date.now()})`
 );

 res.send('vote recorded');
});
```

(indice : pense à l'injection SQL, aux status codes HTTP, aux erreurs async non catchées, et à ce qui se passe si `req.body` est undefined)

---

**EXO 2 : réécrire un mauvais commentaire**

Ces commentaires ont été laissés dans une review. Réécris chacun pour qu'il soit utile, précis, et non agressif.

```
1. "tu gères pas les erreurs"
2. "ce nom de variable c'est nul"
3. "pourquoi t'as fait ça ?"
4. "ça marche mais c'est over-engineered"
5. "LGTM mais je suis pas sûr"
```

---

**EXO 3 : reviewer une PR de refactoring**

Tu reçois une PR qui dit : "refactoring du module de scores, même comportement, juste plus propre".
Quelles sont les cinq premières questions que tu poses ou les cinq points que tu vérifies avant même de lire le code ?

---

## RÉSUMÉ

Une code review c'est pas une inspection. C'est une collaboration avec un diff ouvert.
Classifier chaque commentaire (bloquant / suggestion / nitpick) évite 80% des frictions.
La structure `observation + impact + suggestion` transforme un reproche en information utile.
Recevoir une review sans défensive : ça s'apprend, et ça fait gagner du temps à tout le monde.
La checklist existe pour que "LGTM" veuille dire quelque chose.
