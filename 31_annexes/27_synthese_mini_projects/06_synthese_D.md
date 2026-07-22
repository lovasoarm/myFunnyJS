---
stability: intemporel
---

# SYNTHÈSE D : SÉCURISER LE RÉSEAU RADIO DE FOX RIVER
Temps de lecture ~7 min

> Couvre : `15_runtime_env` + `16_architecture_patterns` + `17_web_concepts` + `21_api_craft` + `22_security`
> Durée cible : 150 à 220 minutes
> La plus grosse synthèse du curriculum. C'est voulu : c'est le bloc système web complet.

---

## LE CONTEXTE

Michael Scofield a besoin d'un système de communication entre les détenus impliqués dans le plan d'évasion. Chaque message doit passer par une API, être authentifié, et T-Bag (qui a accès partiel au système depuis l'intérieur) ne doit RIEN pouvoir lire ni injecter.

Le système doit tourner en CLI côté serveur (un script Node qui simule le serveur de Fox River) et exposer une API REST que d'autres scripts viennent consommer (simulant les terminaux des différents détenus).

---

## CE QUE TU DOIS LIVRER

```
src/
├── server.js         point d'entrée Express
├── routes/
│  └── messages.js
├── middleware/
│  ├── auth.js        vérification JWT
│  ├── rateLimit.js
│  └── sanitize.js       protection XSS / injection
├── cli/
│  └── envoyerMessage.js   script CLI qui consomme l'API comme un détenu le ferait
└── architecture/
  └── couches.md       explication de la séparation domaine/infra choisie

tests/
└── messages.test.js
```

---

## CONTRAINTES TECHNIQUES PRÉCISES

**Du module 15 (runtime env) :**
Le script CLI (`envoyerMessage.js`) doit lire ses paramètres via `process.argv`, pas en dur dans le code. Il doit pouvoir tourner en argument minimal (`node envoyerMessage.js --to=westmoreland --msg="le plan tient"`) et gérer le cas où un argument obligatoire manque sans crasher silencieusement.

**Du module 17 (web concepts) :**
Le cycle de vie HTTP de chaque requête doit suivre le schéma canonique de la charte ASCII (`31_annexes/01_ascii_charte.md`, schéma 5) : auth, validation, handler, error handler, dans cet ordre, sans exception.
Choisis et justifie une stratégie de cache pour l'endpoint de lecture des messages (qui sera consulté en boucle par les terminaux des détenus) : pas de cache du tout serait une erreur de perf, un cache trop long serait un risque de sécurité (messages obsolètes affichés comme actuels).

**Du module 21 (api craft) :**
CRUD complet sur la ressource `messages` : envoyer, lire, marquer comme lu, supprimer. JWT obligatoire sur chaque endpoint sauf l'authentification elle-même. Le refresh token doit avoir une durée de vie différente du token d'accès, et tu dois documenter pourquoi cette différence existe.

**Du module 22 (security), le coeur critique de cette synthèse :**
- Sanitization stricte de chaque message entrant contre XSS (T-Bag va essayer d'injecter du JS dans un message texte)
- Protection contre la prototype pollution si jamais un payload JSON malicieux essaie de polluer `Object.prototype`
- Rate limiting par détenu : un détenu qui spam 50 requêtes en 10 secondes doit être bloqué temporairement, pas le système entier
- Les mots de passe (si authentification par mot de passe en plus du JWT) doivent être hashés avec bcrypt, jamais stockés en clair

**Du module 16 (architecture patterns) :**
Le fichier `architecture/couches.md` doit expliquer concrètement, avec le schéma canonique de la charte ASCII (schéma 6), pourquoi la logique de validation d'un message (un message ne peut pas dépasser 500 caractères, ne peut pas être vide) vit dans le domaine et pas dans le middleware Express. Si tu mets cette règle dans le middleware, elle est couplée à Express : le jour où tu changes de framework, tu la perds.

---

## CE QUI SE PASSE SI TU ZAPPES UNE CONTRAINTE

Si tu sanitizes pas correctement les messages : T-Bag injecte un script dans son message, et dès qu'un autre détenu consulte sa liste de messages dans une interface qui fait du rendu HTML, le script s'exécute dans SON contexte à lui. C'est une XSS stockée classique, et c'est exactement le genre de faille qui passe inaperçue en dev parce que personne teste avec un payload malveillant réel.

Si tu mets la logique métier dans le middleware au lieu du domaine : ton architecture en couches existe sur le papier mais pas dans les faits, et le premier refacto sérieux va devoir tout déplacer.

---

## CHECKLIST AVANT DE VALIDER

```
[ ] Le CLI lit ses params via process.argv et gère l'argument manquant proprement
[ ] Le cycle HTTP respecte exactement le schéma canonique (auth -> validation -> handler -> error handler)
[ ] CRUD complet avec JWT sur chaque endpoint sauf l'auth elle-même
[ ] Sanitization XSS testée avec un vrai payload malveillant dans les tests
[ ] Rate limiting actif et testé (vérifie qu'un détenu spécifique est bloqué, pas tout le système)
[ ] bcrypt utilisé si mot de passe stocké, jamais de clair
[ ] architecture/couches.md justifie pourquoi la validation vit dans le domaine
```

Cette synthèse est la plus exigeante du curriculum jusqu'ici. Si tu termines ça sans relire la doc 10 fois : t'es prêt pour les modules 22 à 28.

---

> **Rappel `DEPENDENCY_LEDGER`** : avant de clore ce bloc, ouvre `DEPENDENCY_LEDGER.md` à la racine et ajoute une ligne par outil IA utilisé (quoi, quand, pourquoi, combien de temps gagné/perdu). Silence = drift.
