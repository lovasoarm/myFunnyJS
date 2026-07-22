---
stability: intemporel
---

# RGPD ET AI ACT : CE QUE TU N'AS PAS LE DROIT DE LOGGER
Temps de lecture ~11 min

Michael Scofield ne laisse jamais une trace de plus que nécessaire. Chaque carte, chaque appel, chaque mouvement dans Fox River : calculé pour ne rien révéler de plus que ce qui sert le plan. Dans ton code, c'est pareil. Chaque `console.log`, chaque colonne de DB, chaque payload envoyé à un service tiers est une trace. Et une trace mal gérée ne te fait pas juste perdre des points en code review : elle peut faire tomber toute l'équipe devant un régulateur.

RGPD (Règlement Général sur la Protection des Données) et AI Act (le règlement européen sur l'intelligence artificielle) ne sont pas des sujets juridiques que tu délègues à un service légal lointain. Ce sont des contraintes techniques qui changent ce que ton code a le droit de faire, point final.

---

## 1) RGPD : LE PLAN D'ÉVASION QUE TU DOIS SUIVRE À LA LETTRE

### Le quoi

Le RGPD encadre comment une entreprise collecte, stocke, utilise et supprime les données personnelles (toute info qui identifie ou peut identifier une personne : nom, email, IP, géolocalisation, voire un identifiant technique recoupé avec d'autres données). Il s'applique à toute entreprise qui traite des données de résidents européens, peu importe où le serveur est hébergé.

```
donnée personnelle --> collectée --> traitée --> stockée --> un jour supprimée
                                 ^
                      c'est cette étape que la majorité du code oublie
```

### Pourquoi ça existe

Avant le RGPD (applicable depuis 2018), une boîte pouvait collecter ce qu'elle voulait, le garder éternellement, le revendre, et ne jamais te dire ce qu'elle savait de toi. Le RGPD inverse la logique : par défaut, tu n'as pas le droit de collecter, sauf si tu as une base légale claire et que tu informes la personne.

### Les principes qui changent ton code

```
Minimisation    --> tu ne collectes que ce qui sert vraiment, pas "on sait jamais"
Limitation de but  --> une donnée collectée pour X ne sert pas à Y sans nouveau consentement
Droit à l'oubli   --> un supporter peut demander la suppression complète de ses données
Droit d'accès    --> un supporter peut demander un export de tout ce que tu as sur lui
Portabilité     --> cet export doit être dans un format réutilisable (JSON, pas un PDF scanné)
Privacy by design  --> la protection des données se pense AVANT d'écrire le endpoint, pas après un audit
```

```js
// Mauvais : collecte "au cas où", sans base légale claire
function createUser(data) {
 return db.users.insert({
  email: data.email,
  password: hash(data.password),
  fullName: data.fullName,
  phoneNumber: data.phoneNumber, // pourquoi ? le formulaire ne demandait même pas le téléphone
  browserFingerprint: data.fingerprint, // collecté "pour la sécurité", jamais utilisé
  lastKnownIP: data.ip, // gardé indéfiniment, jamais nettoyé
 });
}

// Correct : on ne stocke que ce qui sert un but déclaré, avec une date d'expiration en tête
function createUser(data) {
 return db.users.insert({
  email: data.email,
  password: hash(data.password),
  fullName: data.fullName,
  createdAt: new Date(),
  // lastKnownIP volontairement absent : utile pour le rate limiting, pas pour le profil supporter
  // si besoin de l'IP, elle vit dans les logs applicatifs avec sa propre rétention (cf. section 3)
 });
}
```

### Le droit à l'oubli en pratique

Le piège classique : supprimer la ligne `users` mais oublier les 6 autres tables qui référencent ce supporter (logs, sessions, commentaires, cache, backups, service tiers d'emailing).

```js
// Naïf : ça donne l'impression que c'est réglé, mais le supporter existe encore partout ailleurs
async function deleteUser(userId) {
 await db.users.delete(userId);
}

// Réel : un droit à l'oubli touche tout ce qui identifie la personne, pas une seule table
async function deleteUser(userId) {
 await db.transaction(async (trx) => {
  await trx.sessions.deleteWhere({ userId });
  await trx.comments.anonymize({ userId }); // anonymiser, pas toujours supprimer (cf. section 4)
  await trx.auditLogs.redact({ userId }); // remplace l'identité, garde la trace de l'action
  await trx.users.delete(userId);
 });
 await emailProvider.deleteContact(userId); // service tiers : souvent oublié, toujours visé par l'audit
 await cache.invalidate(`user:${userId}`);
}
```

---

## 2) AI ACT : CE QUI CHANGE QUAND TON CODE PARLE À UN MODÈLE

### Le quoi

L'AI Act (entré en application progressive depuis 2024, premières obligations concrètes effectives depuis 2025-2026) classe les systèmes d'IA par niveau de risque, et impose des obligations différentes selon ce niveau. Pour un dev qui branche un LLM (modèle de langage) sur son jutsu, ça touche directement le code.

```
Risque inacceptable --> interdit (notation sociale, manipulation comportementale ciblée)
Risque élevé     --> obligations lourdes (traçabilité, supervision humaine, documentation)
Risque limité     --> obligation de transparence (le supporter doit savoir qu'il parle à une IA)
Risque minimal    --> pas d'obligation spécifique (la majorité des features IA grand public)
```

### Ce qui touche réellement ton code

```js
// Mauvais : un chatbot qui ne se déclare jamais comme tel
function renderChatMessage(text) {
 return `<div class="message">${text}</div>`; // le supporter ne sait pas si c'est un humain ou pas
}

// Correct : transparence explicite, exigée dès qu'un supporter interagit avec une IA générative
function renderChatMessage(text, isAIGenerated) {
 return `
  <div class="message">
   ${isAIGenerated ? '<span class="ai-badge">Réponse générée par IA</span>' : ''}
   ${text}
  </div>
 `;
}
```

Pour un système classé "risque élevé" (recrutement automatisé, scoring de crédit, tri de candidatures), les obligations montent : il faut pouvoir expliquer une décision, garder une trace de chaque inférence (résultat produit par le modèle), et permettre une supervision humaine réelle, pas un bouton "valider" qui ne fait que cliquer sans jamais rien lire.

```js
// Un système à risque élevé doit logger CE QUI A SERVI à la décision, pas juste le résultat
async function scoreApplication(application) {
 const result = await aiModel.predict(application);

 await auditLog.record({
  modelVersion: aiModel.version, // traçabilité : quel modèle a décidé, quelle version
  inputFeatures: application.relevantFields, // ce qui a été montré au modèle
  output: result.score,
  confidence: result.confidence,
  timestamp: new Date(),
  requiresHumanReview: result.confidence < 0.8, // seuil de supervision humaine obligatoire
 });

 return result;
}
```

---

## 3) CE QUE TU AS LE DROIT DE LOGGER, ET CE QUI T'ENTERRE

C'est la question concrète que tout dev se pose un jour devant un `console.log(req.body)` posé pour débugger vite fait, jamais retiré.

```
JAMAIS en clair dans un log   --> mot de passe, token de session, numéro de carte, code 2FA
À éviter sauf besoin justifié  --> email complet, nom complet, adresse IP sans rotation
OK avec rétention limitée    --> ID supporter technique (UUID), action effectuée, timestamp
Toujours OK           --> métriques agrégées (nombre de requêtes, latence, taux d'erreur)
```

```js
// Mauvais : ce log devient une preuve à charge si la DB de logs fuite un jour
logger.info('Chakra_gate attempt', {
 email: user.email,
 password: req.body.password, // catastrophe : un mot de passe en clair dans des logs
 creditCard: user.paymentMethod.last4, // pas nécessaire pour débugger un login
});

// Correct : on garde ce qui sert à débugger, on retire ce qui identifie ou compromet
logger.info('Chakra_gate attempt', {
 userId: user.id, // identifiant technique, pas l'email en clair
 success: false,
 ip: hashIP(req.ip), // hashée, pas stockée brute : utile pour détecter un pattern, pas pour identifier
});
```

La rétention compte autant que le contenu. Un log gardé éternellement, même propre, devient un problème de conformité avec le temps : la durée doit correspondre à un but déclaré (debug : quelques jours à quelques semaines ; audit de sécurité : plus long, mais documenté).

```js
// Politique de rétention explicite, pas "on verra plus tard"
const LOG_RETENTION = {
 debug: '7d',
 security: '90d', // les logs de sécurité ont une durée plus longue, justifiée par leur usage
 audit: '1y', // traçabilité réglementaire, durée alignée avec l'obligation légale
};
```

---

## 4) ANONYMISATION VS PSEUDONYMISATION : PAS LA MÊME GARANTIE

Le piège terminologique qui revient sans arrêt en revue de code.

```
Pseudonymisation --> remplacer l'identité par un alias, mais la ré-identification reste possible
            (avec la table de correspondance)
Anonymisation   --> destruction complète du lien : impossible de revenir à la personne
```

```js
// Pseudonymisation : T-Bag reste identifiable si quelqu'un a la clé de correspondance
function pseudonymize(comment) {
 return { ...comment, authorId: hash(comment.authorId) }; // réversible si on connaît la fonction hash + le seed
}

// Anonymisation réelle : aucune table, aucune clé ne permet de revenir à la personne
function anonymize(comment) {
 return { ...comment, authorId: null, authorName: 'Supporter supprimé' };
}
```

Une donnée "pseudonymisée" reste une donnée personnelle au sens du RGPD. Une donnée vraiment "anonymisée" sort du périmètre. La confusion entre les deux est l'erreur numéro un en audit de conformité : une équipe pense avoir réglé un droit à l'oubli en hashant un ID, alors que techniquement la personne reste ré-identifiable.

---

## 5) LE RISQUE RÉEL QUAND C'EST IGNORÉ

```
Amende RGPD     --> jusqu'à 4% du chiffre d'affaires mondial annuel, ou 20M€
Amende AI Act     --> jusqu'à 7% du chiffre d'affaires mondial pour les usages interdits
Risque réputationnel --> une fuite de données mal gérée tue la confiance plus vite qu'un bug visible
Risque individuel   --> le dev qui a posé le `console.log(req.body)` n'est pas poursuivi personnellement,
              mais c'est souvent son code qui devient la pièce à conviction de l'audit
```

Ce n'est pas une checklist à cocher une fois en fin de projet. C'est une question à se poser à chaque endpoint qui touche une donnée personnelle, à chaque ligne de log ajoutée pour débugger, à chaque fois qu'un modèle d'IA reçoit un input qui vient d'un vrai supporter.

---

## EXERCICES

## EXO 1 : L'AUDIT DE FOX RIVER

Le système de gestion des profils de `05_prison_break_api` log actuellement `req.body` complet sur chaque requête entrante, sans filtrage. Identifier tous les champs qui ne devraient jamais apparaître en clair dans un log, proposer la version filtrée, et écrire une fonction `sanitizeForLog(payload)` réutilisable sur tout le projet.

## EXO 2 : LE DROIT À L'OUBLI COMPLET

Un supporter de l'Ultras Dashboard demande la suppression totale de son compte. Lister toutes les tables et services qui contiennent une trace de lui (profil, commentaires sur les matchs, sessions, logs d'erreur, service d'emailing externe), puis écrire la fonction `deleteUserCompletely(userId)` qui couvre chaque source, avec anonymisation là où la suppression casserait l'intégrité des données d'autres supporters (commentaires liés, historique de match).

## EXO 3 : LE BADGE DE TRANSPARENCE IA

L'Oracle Glitch (`09_oracle_glitch`) génère des suggestions de fix de code et les affiche directement dans l'interface, sans jamais préciser qu'elles viennent d'un LLM. Modifier le composant d'affichage pour respecter l'obligation de transparence de l'AI Act (badge visible, distinction claire entre suggestion humaine et suggestion IA), et ajouter un log d'audit qui trace quelle version du modèle a généré chaque suggestion.

---

## RÉSUMÉ

RGPD et AI Act ne sont pas des sujets que tu ignores en te disant "c'est le boulot des juristes". Le RGPD impose minimisation, droit à l'oubli réel (toutes les tables, pas une seule), et une distinction stricte entre pseudonymisation (réversible) et anonymisation (définitive). L'AI Act impose transparence dès qu'un supporter parle à une IA, et traçabilité renforcée pour les systèmes à risque élevé. Le réflexe à garder : avant chaque `console.log`, chaque colonne de DB, chaque payload envoyé à un modèle, se demander si cette donnée sert vraiment un but déclaré, et combien de temps elle doit survivre.
