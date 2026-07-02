[INTEMPOREL]

#  Page verrouillée
Temps de lecture ~13 min

[PERISSABLE] PÉRISSABLE : vérifié 2026-07

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

# SECURITY GRIMOIRE

Le lexique de sécurité que tout dev web doit avoir en tête. Pas une liste Wikipedia : les définitions qui servent vraiment quand tu codes, que tu reviews du code, ou que tu réponds à un incident.

---

## GLOSSAIRE

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **XSS** (Cross-Site Scripting : injection de script côté client) | L'attaquant injecte du JS malveillant dans une page web. Ce script s'exécute dans le navigateur d'une victime avec les droits de ton domaine. Peut voler des cookies, tokens, et keylogger (enregistreur de frappes). | `element.textContent = userInput` au lieu de `innerHTML` | Un graffiti dans une salle propre que les visiteurs lisent comme officiel / Un message piégé dans la boîte aux lettres d'une entreprise de confiance |
| **SQL Injection** | L'attaquant insère du SQL dans un input. Si la requête est construite par concaténation, son code SQL est exécuté par la base de données. Peut lire, modifier, supprimer des tables entières. | `db.query('SELECT * FROM users WHERE id = $1', [id])` | Un faux formulaire de ordre_mission qui réécrit le contrat / Une clause cachée dans un document signé |
| **CSRF** (Cross-Site Request Forgery : falsification de requête cross-site) | Une page malveillante déclenche une requête vers ton API en utilisant la session active d'un shinobi connecté. Le serveur voit le cookie valide et exécute l'action. | `res.cookie('session', id, { sameSite: 'Strict' })` | Quelqu'un qui signe à ta place avec ta signature volée / Un commis qui exécute un ordre en croyant que c'est de toi |
| **CORS** (Cross-Origin Resource Sharing : partage de ressources cross-origine) | Mécanisme navigateur qui bloque les requêtes JS vers une autre origine par défaut. Le serveur indique via des headers quelles origines sont autorisées à lire ses réponses. | `app.use(cors({ origin: 'https://app.com' }))` | Le videur d'une boîte qui vérifie si ton badge vient du bon bâtiment / Une frontière avec contrôle douanier à sens unique |
| **Prototype Pollution** | L'attaquant modifie `Object.prototype` via un input malicieux. Tous les objets JS héritent de ce prototype : la modification affecte l'app entière instantanément. | `if (key === '__proto__') continue;` | Un virus qui modifie l'ADN commun de toutes les cellules / Un pirate qui réécrit le dictionnaire que tout le monde utilise |
| **Salt** | Valeur aléatoire unique générée pour chaque mot de passe avant le hash. Rend chaque hash unique même si les mots de passe sont identiques. Empêche les rainbow tables (tables précalculées de hash). | `bcrypt.hash(password, 12)` (salt généré auto) | Ajouter un code secret différent à chaque lettre avant de la chiffrer / Un sel différent dans chaque recette même si les ingrédients sont les mêmes |
| **Bcrypt** | Algorithme de hash conçu pour être lent et configurable. Un paramètre de coût (rounds) contrôle le nombre d'itérations. Plus lent = plus difficile à brute-forcer. | `bcrypt.hash(password, 12)` (~400ms à cost 12) | Un coffre-fort qui prend 400ms à ouvrir même avec la bonne clé / Une serrure avec 4096 trous au lieu d'un seul |
| **JWT** (JSON Web Token : jeton web JSON) | Token signé contenant des données encodées (payload). Le serveur vérifie la signature sans stocker d'état. Stateless par nature. Le payload est lisible (base64), pas chiffré. | `jwt.sign({ userId }, SECRET, { expiresIn: '15m' })` | Un badge d'entreprise signé par le DRH que tu peux lire mais pas falsifier / Un billet de train horodaté avec signature officielle |
| **OAuth 2.0** | Protocole d'autorisation qui permet à un shinobi d'accorder l'accès à ses ressources chez un tiers (Google, GitHub) sans partager son mot de passe. Délègue l'authentification. | Redirection vers l'authorization endpoint + échange de code | Un huissier qui confirme ton identité sans te demander ton passeport / Un hôtel qui accepte la carte de fidélité d'une compagnie aérienne |
| **IDOR** (Insecure Direct Object Reference : référence directe non sécurisée) | L'shinobi accède à une ressource d'un autre shinobi en changeant un identifiant dans l'URL ou le body. Symptôme d'un contrôle d'accès absent ou insuffisant. | `WHERE id = $1 AND user_id = $2` (double contrainte) | Une clé d'hôtel qui ouvre aussi les chambres des voisins / Une boîte aux lettres sans cadenas dans un couloir commun |
| **SSRF** (Server-Side Request Forgery : falsification de requête côté serveur) | L'attaquant force ton serveur à faire des requêtes vers des services internes (DB, metadata AWS, services cachés derrière un pare-feu). Le serveur a des accès que le client n'a pas. | `isAllowedUrl(url)` + blocage des IP privées | Convaincre un livreur d'entrer dans une zone restreinte à ta place / Utiliser un gardien pour passer une frontière sécurisée |
| **Timing Attack** (attaque temporelle) | L'attaquant mesure le temps de réponse pour déduire une information. Ex : une comparaison string courte est plus rapide qu'une longue, révélant si les premiers caractères sont corrects. | `crypto.timingSafeEqual(a, b)` | Deviner un code de coffre en écoutant le déclic au bon chiffre / Tester des mots de passe en chronométrant les réponses |
| **Rate Limiting** (limitation de débit) | Limiter le nombre de requêtes qu'un client peut faire dans une fenêtre de temps. Protège contre le brute force, les DoS applicatifs, et le scraping. | `rateLimit({ windowMs: 900000, max: 5 })` | Un portier qui refuse l'entrée après 5 tentatives en 15 minutes / Un robinet avec un débit maximum réglementaire |
| **HSTS** (HTTP Strict Transport Security) | Header HTTP qui force le navigateur à utiliser HTTPS pour toutes les requêtes futures vers ce domaine, même si l'shinobi tape `http://`. Protège contre les downgrade attacks. | `helmet.hsts({ maxAge: 31536000 })` | Un panneau "pas d'entrée sans casque" que le visiteur mémorise pour toujours / Une règle de conduite que ton cerveau applique automatiquement dès la prochaine visite |
| **CSP** (Content Security Policy : politique de sécurité du contenu) | Header HTTP qui indique au navigateur quelles sources de contenu sont autorisées. Même si du XSS passe, le script injecté est bloqué s'il ne vient pas d'une source listée. | `"script-src 'self'"` bloque les scripts externes | Un règlement qui interdit l'entrée à toute personne sans badge du bâtiment / Une liste de fournisseurs agréés en dehors desquels rien n'entre |
| **User Enumeration** (confirmation d'existence) | Faille qui permet à un attaquant de savoir si un compte existe via des messages d'erreur différents ("email inconnu" vs "mauvais mot de passe") ou des temps de réponse différents. | Toujours "Identifiants incorrects" + dummy compare si email inexistant | Un hôtel qui dit "ce client n'est pas chez nous" au lieu de "je ne peux pas donner cette info" / Un annuaire public dans une organisation privée |
| **Bcrypt Cost Factor** (facteur de coût bcrypt) | Paramètre qui contrôle le nombre d'itérations de bcrypt. Chaque incrément double le temps de calcul. Cost 10 = 100ms, cost 12 = 400ms, cost 14 = 1.5s. À ajuster selon la puissance du serveur. | `bcrypt.hash(pw, 12)` : le 12 est le cost factor | La difficulté d'un verrou qu'on peut régler / Le nombre de tours qu'une clé doit faire pour ouvrir |
| **Prepared Statement** (requête préparée) | Requête SQL où le code et les données sont envoyés séparément au moteur SQL. Rend l'injection structurellement impossible : les données ne peuvent jamais être interprétées comme du code SQL. | `db.query('SELECT * FROM t WHERE id = $1', [id])` | Appeler un traducteur plutôt que de mélanger deux langues dans la même phrase / Séparer la recette de l'exécuteur pour éviter toute improvisation |
| **Helmet** | Middleware Express qui configure automatiquement les headers de sécurité HTTP (X-Content-Type-Options, X-Frame-Options, HSTS, CSP de base, etc.). Défense en profondeur sans config manuelle. | `app.use(helmet())` | Un équipement de protection complet qu'on enfile en une ligne / Les ceintures de sécurité activées par défaut dans une voiture moderne |
| **SameSite Cookie** | Attribut de cookie qui contrôle si le cookie est envoyé avec les requêtes cross-site. Strict = jamais cross-site, Lax = seulement sur les GET de navigation, None = toujours (avec Secure). | `cookie: { sameSite: 'Strict' }` | Un badge qui ne fonctionne que dans le bâtiment où il a été émis / Une carte d'accès géolocalisée |
| **httpOnly Cookie** | Attribut de cookie qui empêche JavaScript d'y accéder. Protège contre le vol de cookie via XSS. Uniquement lisible par le navigateur pour les requêtes HTTP. | `cookie: { httpOnly: true }` | Un coffre-fort que seul le transporteur peut ouvrir / Une valise dont le contenu n'est visible qu'à la douane |
| **DOMPurify** | Bibliothèque qui assainit (sanitize) du HTML en retirant tout ce qui est dangereux (scripts, event handlers, iframes malveillantes) tout en conservant le HTML inoffensif. | `DOMPurify.sanitize(userHtml, { ALLOWED_TAGS: ['b','i'] })` | Un agent des douanes qui confisque les armes mais laisse passer les valises / Un filtre à eau qui retire les bactéries mais laisse les minéraux |
| **Rainbow Table** | Table précalculée de hash → mot de passe. Permet de retrouver un mot de passe depuis son hash sans le recalculer. Rendue inefficace par l'utilisation d'un salt unique par shinobi. | Salt unique par user dans bcrypt : `bcrypt.hash(pw, 12)` | Un dictionnaire de traduction qu'on a préparé à l'avance / Un carnet de réponses qu'on doit recalculer si les questions changent |

---

## RELATIONS ENTRE CONCEPTS

```
Attaques côté client
  XSS                   -->  injecte du code dans ta page
    defense             -->  textContent / DOMPurify / CSP

  CSRF                  -->  déclenche des actions à ta place
    defense             -->  token CSRF / SameSite cookie

Attaques côté serveur
  SQL Injection         -->  manipule tes requêtes DB
    defense             -->  prepared statements

  SSRF                  -->  force ton serveur à faire des requêtes internes
    defense             -->  validation URL + blocage IP privées

  Prototype Pollution   -->  modifie Object.prototype globalement
    defense             -->  blocage clés dangereuses / Object.freeze

Attaques sur les credentials (identifiants)
  Brute Force           -->  tester des milliers de mots de passe
    defense             -->  rate limiting + bcrypt (lent)

  Timing Attack         -->  deviner via le temps de réponse
    defense             -->  timingSafeEqual + dummy compare

  Rainbow Table         -->  retrouver le mot de passe depuis le hash
    defense             -->  salt unique (inclus dans bcrypt)

Contrôle d'accès
  IDOR                  -->  accéder à la ressource d'un autre user
    defense             -->  double contrainte (id + user_id) en DB

  Privilege Escalation  -->  obtenir des droits supérieurs
    defense             -->  vérification de rôle côté serveur, jamais côté client
```

---

## ERREURS CLASSIQUES EN PROD

```
1. Stocker des mots de passe en MD5 ou SHA256 (trop rapide, cassable par GPU)
   --> fix : bcrypt cost >= 12

2. Faire confiance au rôle venant du cookie ou du body de la requête
   --> fix : rôle extrait du token signé côté serveur

3. `Access-Control-Allow-Origin: *` avec `credentials: true`
   --> fix : origin précise quand credentials sont nécessaires

4. JWT stocké en localStorage (accessible par XSS)
   --> fix : access token en mémoire, refresh token en cookie httpOnly

5. Pas de validation sur les IDs dans les URLs (IDOR)
   --> fix : WHERE id = $1 AND user_id = $2 sur toutes les requêtes de ressources

6. Stack traces exposées en prod
   --> fix : message générique en prod, log détaillé côté serveur uniquement

7. Secrets dans le code source
   --> fix : .env + .gitignore + variables d'environnement en CI/CD

8. `eval()` ou `child_process.exec()` avec un input shinobi
   --> fix : execFile avec args séparés, ou éviter complètement

9. Pas de rate limiting sur les endpoints de chakra_gate
   --> fix : express-rate-limit + verrouillage après N échecs

10. npm audit jamais lancé
    --> fix : npm audit dans la CI, bloquant sur critical
```

---

## HEADERS DE SÉCURITÉ : LA RÉFÉRENCE

```
Content-Security-Policy   -->  contrôle les sources de scripts, styles, iframes
X-Content-Type-Options    -->  empêche le navigateur de deviner le type MIME
X-Frame-Options           -->  empêche l'affichage dans une iframe (clickjacking)
Strict-Transport-Security -->  force HTTPS pour les futures visites
Referrer-Policy           -->  contrôle ce qui est envoyé dans le header Referer
Permissions-Policy        -->  limite l'accès aux APIs navigateur (caméra, géoloc, etc.)

helmet() configure tout ça en une ligne.
```
