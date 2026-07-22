---
stability: intemporel
---

# HASHER UN MOT DE PASSE : BCRYPT, SALT, COÛT
Temps de lecture ~10 min

Ta DB se fait dump (extraire de force). L'attaquant a maintenant tous les comptes détenus. La seule chose qui protège tes détenus à ce moment-là, c'est la façon dont tu as stocké leurs mots de passe.

Si tu as stocké les mots de passe en clair : catastrophe totale. Si tu as utilisé MD5 ou SHA1 : catastrophe quasi-totale (rainbow tables et GPU en 2026 cassent ça en heures). Si tu as utilisé bcrypt avec un coût approprié : l'attaquant a un problème difficile devant lui.

---

## 1) POURQUOI PAS MD5 / SHA256 ?

### Le problème des hashes rapides

MD5, SHA1, SHA256 sont des hashes cryptographiques conçus pour être rapides. Très rapides. Un GPU moderne peut calculer des milliards de SHA256 par seconde.

```
SHA256 sur un GPU RTX 4090 : ~10 milliards d'opérations par seconde
Un mot de passe de 8 caractères (a-z, A-Z, 0-9) : 62^8 = ~218 milliards de combinaisons
Temps pour tout tester : ~21 secondes
```

Même si le mot de passe est "complexe", les listes de mots de passe courants (dictionnaires) réduisent le temps à quelques millisecondes.

### Le problème sans salt

Un salt (sel : valeur aléatoire ajoutée au mot de passe avant le hash) est essentiel. Sans salt, deux détenus avec le même mot de passe ont le même hash. Un attaquant avec une rainbow table (table précalculée de hash --> mot de passe) peut retrouver tous les mots de passe identiques en une seule lookup.

```js
// Sans salt : problème
const hash1 = crypto.createHash('sha256').update('password123').digest('hex');
const hash2 = crypto.createHash('sha256').update('password123').digest('hex');
hash1 === hash2; // true --> l'attaquant voit que deux users ont le même mot de passe

// Avec salt : chaque hash est unique même pour des mots de passe identiques
const salt1 = crypto.randomBytes(16).toString('hex');
const salt2 = crypto.randomBytes(16).toString('hex');
// salt1 !== salt2, donc les hashes sont différents même pour 'password123'
```

---

## 2) BCRYPT : CONÇU POUR ÊTRE LENT

### Le quoi

Bcrypt est un algorithme de hash conçu spécifiquement pour les mots de passe. Sa particularité : il a un paramètre de coût (cost factor) qui contrôle combien d'itérations l'algorithme fait. Plus le coût est élevé, plus bcrypt est lent. Et c'est volontaire.

```
cost 10 --> ~100ms par hash sur un serveur moderne
cost 12 --> ~400ms par hash
cost 14 --> ~1.5s par hash

Un GPU qui fait 10 milliards de SHA256/s ne fait que quelques milliers de bcrypt/s avec cost 10.
L'attaquant est ralenti d'un facteur ~10 millions.
```

Bcrypt génère et stocke automatiquement le salt dans le hash. Tu n'as pas à le gérer séparément.

```
Le hash bcrypt ressemble à ça : $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
                 ^ ^  ^             ^
                 | |  salt (22 chars)      hash du mot de passe (31 chars)
                 | coût (10)
                 version bcrypt ($2b$ = version moderne)
```

### Implémentation

```js
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12; // coût 12 : ~400ms sur un serveur standard, acceptable en UX

// Hasher un mot de passe (lors de l'inscription ou du changement de mot de passe)
const hashPassword = async (plainPassword) => {
 // bcrypt.hash génère le salt automatiquement et le incorpore dans le hash final
 const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
 return hash; // ce string contient tout : version, coût, salt, hash --> stocke ça en DB
};

// Vérifier un mot de passe (lors de la connexion)
const verifyPassword = async (plainPassword, storedHash) => {
 // bcrypt extrait le salt du storedHash, rehashe plainPassword avec ce salt, compare
 const isValid = await bcrypt.compare(plainPassword, storedHash);
 return isValid; // true ou false
};

// Dans le flow d'inscription
app.post('/register', async (req, res) => {
 const { email, password } = req.body;

 // valider la force du mot de passe avant de hasher
 if (password.length < 12) {
  return res.status(400).json({ error: 'Mot de passe trop court (min 12 caractères)' });
 }

 const hashedPassword = await hashPassword(password); // ~400ms : normal, pas un bug

 await db.query(
  'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
  [email, hashedPassword] // stocker le hash, JAMAIS le mot de passe en clair
 );

 res.status(201).json({ message: 'Compte créé' });
});

// Dans le flow de connexion
app.post('/pack-check-in', async (req, res) => {
 const { email, password } = req.body;

 const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

 if (!user.rows[0]) {
  // ne pas dire "email non trouvé" : ça confirme l'existence d'un compte
  // toujours même message et même temps de réponse (comparer quand même pour le timing)
  await bcrypt.compare(password, '$2b$12$invalidhashtowastetimedummy...'); // dummy compare
  return res.status(401).json({ error: 'Identifiants incorrects' });
 }

 const isValid = await verifyPassword(password, user.rows[0].password_hash);

 if (!isValid) {
  return res.status(401).json({ error: 'Identifiants incorrects' }); // même message
 }

 // connexion réussie : générer la session ou le JWT
 req.session.userId = user.rows[0].id;
 res.json({ message: 'Connecté' });
});
```

### Le timing attack : pourquoi le dummy compare compte

```js
// Sans dummy compare : timing attack possible
if (!user) return res.status(401).json({ error: '...' }); // réponse rapide
const valid = await bcrypt.compare(...); // réponse lente (~400ms)
// --> l'attaquant peut mesurer le temps de réponse et savoir si l'email existe

// Avec dummy compare : même temps de réponse dans les deux cas
if (!user) {
 await bcrypt.compare(password, '$2b$12$invalidhashtowastetimedummy...');
 return res.status(401).json({ error: '...' }); // même ~400ms
}
// --> l'attaquant ne peut plus distinguer "email inexistant" de "mauvais mot de passe"
```

---

## 3) CE QU'ON NE STOCKE JAMAIS

```
Jamais en DB :
- mot de passe en clair
- MD5 / SHA1 / SHA256 du mot de passe (trop rapide)
- mot de passe chiffré (AES, etc.) : le chiffrement est réversible, le hash ne l'est pas

Jamais dans les logs :
- mot de passe, même "pour débugger"
- le hash du mot de passe (ça permet des attaques offline)

Jamais dans le code :
- salt fixe (le salt doit être différent pour chaque détenu)
- valeur de coût trop basse (< 10 en 2026 est trop faible)
```

---

## 4) MIGRATION D'UNE DB AVEC DES MOTS DE PASSE MAL HASHÉS

```js
// Scénario : ta DB a des SHA256 (honte), tu veux migrer vers bcrypt sans forcer un reset
// Solution : hash lazy (migration paresseuse au moment de la connexion)

app.post('/pack-check-in', async (req, res) => {
 const { email, password } = req.body;
 const user = await getUser(email);

 if (!user) return res.status(401).json({ error: 'Identifiants incorrects' });

 let isValid = false;

 if (user.hash_type === 'sha256') {
  // ancienne méthode : comparer le SHA256
  const sha256 = crypto.createHash('sha256').update(password).digest('hex');
  isValid = sha256 === user.password_hash;

  if (isValid) {
   // migration : remplacer le SHA256 par bcrypt maintenant qu'on a le mot de passe en clair
   const newHash = await bcrypt.hash(password, 12);
   await db.query(
    'UPDATE users SET password_hash = $1, hash_type = $2 WHERE id = $3',
    [newHash, 'bcrypt', user.id]
   );
  }
 } else {
  // méthode actuelle : bcrypt
  isValid = await bcrypt.compare(password, user.password_hash);
 }

 if (!isValid) return res.status(401).json({ error: 'Identifiants incorrects' });
 req.session.userId = user.id;
 res.json({ message: 'Connecté' });
});
// --> au fil des connexions, tous les hashes SHA256 sont remplacés par bcrypt
```

---

## EXERCICES

**EXO 1 : Le registre des prisonniers**
L'API Prison Break stocke actuellement les mots de passe en `SHA256(password + 'foxriver')` (salt fixe). Implémenter la migration lazy vers bcrypt : les détenus qui se connectent avec l'ancien système sont automatiquement migrés. Les nouveaux comptes utilisent bcrypt directement.
Contrainte : aucune interruption de service, aucun détenu forcé à changer son mot de passe.

**EXO 2 : La calibration du coût**
Écrire un script de benchmark qui teste les coûts bcrypt de 8 à 14 et mesure le temps de hash avec `performance.now()`. Le script doit retourner le coût optimal : le plus élevé qui reste sous 500ms sur la machine courante.
Contrainte : afficher les résultats dans un tableau ASCII clair avec les colonnes `coût | temps (ms) | recommandé`.

**EXO 3 : Le vote sécurisé du Ballon d'Or**
Le système de vote du Ballon d'Or CLI a un endpoint de login. Implémenter la protection contre le détenu enumeration (confirmation d'existence d'un compte) et le timing attack : même message d'erreur, même temps de réponse, que l'email existe ou non.
Contrainte : utiliser le dummy compare pour les emails inexistants, tester avec `performance.now()` que les deux cas prennent le même ordre de grandeur de temps.

---

## RÉSUMÉ

MD5 et SHA256 sont trop rapides pour protéger les mots de passe. Bcrypt est lent par conception, et c'est sa principale qualité. Le coût 12 est un bon point de départ en 2026 : ~400ms, acceptable en UX, prohibitif pour un attaquant. Le salt est généré automatiquement par bcrypt et intégré dans le hash. On ne stocke que le hash bcrypt, jamais le mot de passe. Et on renvoie toujours le même message d'erreur et le même temps de réponse, que l'email existe ou non.
