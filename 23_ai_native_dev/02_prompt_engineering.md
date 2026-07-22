---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# PROMPTER COMME UN DEV, PAS COMME UN UTILISATEUR

Temps de lecture ~11 min

L'IA répond à ce qu'on lui dit. Si tu lui dis quelque chose de flou, elle répond quelque chose de plausible. Plausible n'est pas correct. Plausible c'est ce qui ressemble à correct sans l'être.

La différence entre un bon prompt et un mauvais prompt, c'est pas la magie : c'est la précision. Un bon prompt te donne du code utile. Un mauvais prompt te donne du code qui compile.

C'est exactement le problème de Shikamaru quand il doit briefer son équipe avant une mission complexe. Un briefing flou donne une exécution approximative. Un briefing précis donne le résultat voulu. Sauf qu'avec l'IA, personne ne meurt si tu te rates : t'as juste du code bugué en prod.

---

## 1) LE PROMPT ANATOMIE

Un prompt efficace pour du code a 5 composants. Tu n'as pas toujours besoin des 5, mais tu dois savoir lesquels tu omets et pourquoi.

```
[CONTEXTE]  ce que tu construis, le projet, les contraintes existantes
[RÔLE]    qui doit répondre (un senior dev TS ? un expert sécurité ?)
[TÂCHE]    ce que tu veux exactement
[FORMAT]   comment tu veux la réponse (TypeScript, sans lib externe, commenté)
[CONTRAINTES] ce qu'elle ne doit pas faire (pas de mutation, pas de try/catch global)
```

Exemple mauvais :

```
"Écris une fonction pour valider un email"
```

L'IA va produire quelque chose. Avec une regex approximative. Qui va passer 80% des cas. Et rater les edge cases qui arrivent en prod.

Exemple correct :

```
Tu es un dev senior JavaScript.
Écris une fonction validateEmail(email: string): boolean en TypeScript.
Contraintes :
- pas de dépendances externes
- doit rejeter les emails avec des espaces
- doit rejeter les emails sans domaine valide (pas de .com à une lettre)
- doit gérer les sous-domaines (user@mail.company.io est valide)
Retourne true ou false uniquement, pas de message d'erreur.
Ajoute des commentaires sur les cas limites gérés.
```

---

## 2) LE CONTEXTE : L'INGRÉDIENT QUE TOUT LE MONDE OUBLIE

L'IA ne connaît pas ton projet. Elle ne connaît pas tes conventions. Elle ne connaît pas ce que tu as déjà en place.

Si tu ne lui donnes pas le contexte, elle invente un contexte par défaut : Express + Mongoose + REST classique + conventions npm. Peut-être que c'est ton stack. Peut-être pas.

```js
// Ce que tu dois fournir dans un prompt sérieux :

/*
CONTEXTE DU PROJET :
- Pipeline d'analyse Oracle Glitch (détection d'hallucinations LLM)
- Stack : Node.js / TypeScript / Zod pour la validation
- Conventions : async/await partout, custom errors qui étendent Error, pas de any
- Patterns : validate-in validate-out sur chaque frontière de module
- Tests : Jest avec ts-jest
*/

// Maintenant demande ce que tu veux.
// L'IA va s'aligner sur TON codebase, pas inventer le sien.
```

Astuce : crée un fichier `AI_CONTEXT.md` à la racine. Il contient ton stack, tes conventions, tes patterns. Tu le copies en début de prompt. 10 secondes, résultats bien meilleurs.

---

## 3) LES PATTERNS DE PROMPT QUI MARCHENT

### Pattern 1 : Le comparatif

Quand tu n'es pas sûr de l'approche :

```
"Montre-moi 3 façons différentes de résoudre X.
Pour chacune : les avantages, les limites, dans quel cas tu choisirais cette option."
```

Tu forces l'IA à te montrer les compromis. Toi tu arbitres. C'est ça, le niveau 4 du workflow vu en `01_ai_workflow`.

### Pattern 2 : Le challenger

Quand t'as déjà une solution et tu veux la tester :

```
"Voici mon implémentation de X :
[ton code]

Qu'est-ce qui peut casser ? Qu'est-ce que j'ai raté ?
Ne réécris pas tout : liste juste les problèmes avec des explications."
```

C'est ce que Léon fait dans Garo quand il teste une nouvelle technique de combat contre Mendoza. Il ne demande pas à son mentor de faire à sa place. Il exécute, il montre, il demande ce qui n'allait pas.

### Pattern 3 : Le step-by-step

Quand la tâche est complexe :

```
"On va faire ça en 3 étapes.
Étape 1 seulement pour l'instant : la structure de données.
Ne code pas la logique encore."
```

Forcer des étapes évite que l'IA génère 200 lignes de code d'un coup que tu ne comprends pas.

### Pattern 4 : L'explication d'abord

Pour les concepts que tu veux vraiment comprendre :

```
"Explique-moi le mécanisme derrière X (max 10 lignes).
Ensuite, montre un exemple minimal qui casse (le cas d'erreur).
Ensuite, montre la solution correcte."
```

Ce pattern force la structure intuition --> risque --> solution : exactement le cycle pédagogique de MyFunnyJS.

---

## 4) LES PROMPTS QUI TUENT LA QUALITÉ

Voici les formulations qui garantissent une réponse inutile :

```
"Fais ça le mieux possible"
--> Le mieux selon qui ? Selon quoi ? Résultat : du code générique

"Optimise ce code"
--> Optimise quoi ? La vitesse ? La lisibilité ? La taille ? Résultat : du refactoring random

"Est-ce que c'est correct ?"
--> Elle va dire oui sauf si c'est vraiment faux. Elle est polie.

"Améliore cette fonction"
--> Résultat : une version différente qui n'est pas nécessairement meilleure pour ton cas

"Écris du code production-ready"
--> Elle va ajouter des try/catch partout et de la doc JSDoc. Pas de la vraie prod.
```

La règle : **si ton prompt peut s'appliquer à 10 projets différents sans changer un mot, il est trop vague**.

---

## 5) FEW-SHOT PROMPTING : MONTRER AVANT DE DEMANDER

Le few-shot (quelques exemples) : la technique la plus sous-utilisée par les devs.

Au lieu d'expliquer ce que tu veux, tu montres des exemples de ce que tu veux.

```
"Voici comment on gère les erreurs dans le projet Oracle Glitch :

// Mauvais (ce qu'on ne fait pas) :
throw 'analyse échouée'

// Bon (ce qu'on fait) :
throw new LLMOutputError('OutputValidator', 'réponse tronquée à mi-JSON')

// Mauvais :
try {
 ...
} catch(e) {
 console.log(e)
}

// Bon :
try {
 ...
} catch(e) {
 logger.error({ error: e.message, context: 'validateOutput', model: 'claude-sonnet-4-6' })
 throw new ValidationError('Sortie LLM invalide', { cause: e })
}

Maintenant écris la fonction detectHallucination(output) en suivant ces patterns."
```

L'IA va s'aligner sur TES exemples. C'est bien plus efficace que de décrire les règles en langage naturel.

---

## 6) PROMPT POUR DU CODE SÉCURISÉ

La sécurité nécessite des prompts explicites. L'IA ne va pas penser à tout automatiquement.

```
"Écris la route POST /api/chevaliers en Express.
Elle doit :
1. Valider le body avec Zod (schema fourni plus bas)
2. Sanitiser les inputs avant insertion en DB (pas de prototype pollution possible)
3. Ne jamais retourner le token d'armure dans la réponse
4. Rate limiter : 5 tentatives max par IP par heure (middleware express-rate-limit)
5. Logger la tentative avec l'IP mais SANS les données sensibles en clair

Schema Zod : [...]
"
```

Sans ces contraintes explicites, l'IA génère une route qui marche en dev et qui est une passoire en prod.

---

## 7) ITÉRER SUR UN PROMPT

Le prompt parfait du premier coup n'existe pas. C'est un dialogue.

```
Tour 1 : tu demandes une première version
  |
  v
Tu lis, tu identifies ce qui manque ou ce qui est faux
  |
  v
Tour 2 : tu corriges de façon ciblée
--> "Ta version ne gère pas le cas où la réponse LLM est tronquée. Corrige ça seulement."
  |
  v
Tu lis encore
  |
  v
Tour 3 : tu finalises
--> "Maintenant ajoute les types TypeScript stricts sur chaque paramètre et la valeur de retour."
```

Le pire réflexe : re-prompter tout depuis le début parce que le résultat n'était pas parfait. Tu gardes le contexte du dialogue, tu corriges de façon chirurgicale.

---

## 8) PROMPT ENGINEERING VS INGÉNIERIE RÉELLE

Un point important pour éviter l'illusion : le prompt engineering ne remplace pas la compréhension.

```
CE QUE LE PROMPT ENGINEERING PEUT FAIRE :
- améliorer la qualité du premier jet
- réduire le nombre d'itérations nécessaires
- forcer l'IA à respecter tes contraintes
- obtenir des explications plus claires

CE QUE LE PROMPT ENGINEERING NE PEUT PAS FAIRE :
- remplacer ta compréhension du code généré
- garantir qu'il n'y a pas de bug caché
- s'assurer que l'approche est la bonne pour ton contexte
- valider la logique métier que l'IA ne connaît pas
```

Un bon prompt te donne une meilleure matière première. C'est tout. La transformation en code solide, c'est toujours toi.

---

## 9) CHECKLIST FINALE : LES 6 QUESTIONS AVANT D'ENVOYER

Avant d'appuyer sur Entrée, passe le prompt à cette grille. Six questions, dix secondes. Aucune n'est optionnelle : c'est le minimum syndical, pas un idéal.

1. **Contexte** : est-ce que l'IA sait sur quel projet elle bosse (stack, conventions, contraintes déjà en place) ?
2. **Rôle** : ai-je posé qui doit répondre (senior dev TS ? expert sécurité ? junior qui débute ?) ? Un rôle non posé, c'est une réponse générique.
3. **Tâche** : est-ce que la tâche est formulée en verbe d'action précis, avec une entrée et une sortie identifiées ? Pas "aide-moi avec X" : "écris une fonction `f(a, b): T` qui fait Y".
4. **Format** : ai-je dit comment je veux la réponse (langage, style, longueur, avec/sans commentaires, avec/sans tests) ?
5. **Contraintes** : ai-je listé ce qu'elle **ne doit pas** faire (pas de mutation, pas de lib externe, pas de try/catch global, pas de dépendance à runtime X) ?
6. **Vérifiabilité** : **comment vais-je vérifier objectivement que la réponse est correcte, sans relire tout le code à l'œil ?** Un test qui passe, une commande qui renvoie 0, un output qui match un pattern précis. Si la seule vérification possible est "ça a l'air bien", ton prompt est trop flou : reformule-le pour que la réponse produise un produit testable.

La 6e question est celle qui sépare le prompt de dev senior du prompt de vibe-coder. Un dev senior formule ses demandes de façon à ce que la réponse soit **falsifiable** : si elle est fausse, quelque chose casse visiblement. Un vibe-coder demande "écris un truc qui marche" et lit la réponse en priant. Devine qui livre en prod.

---

## EXERCICES

**EXO 1 : Le re-prompt chirurgical sur l'Oracle**
Demande à un LLM de générer une fonction `validerSortieLLM(output)` qui vérifie qu'une réponse JSON d'un LLM est conforme à un schéma. Identifie 3 problèmes dans le résultat (cas d'erreur non géré, typage manquant, réponse tronquée non détectée). Corrige avec 3 prompts ciblés, un par problème. Ne refais pas tout en un seul prompt. (20 minutes)

**EXO 2 : Le few-shot sur les patterns de Garo**
Voici le contexte du projet Garo no Kronika : chaque erreur a un type précis (`HorrorEscapeError`, `ArmorCollapseError`, `KnightDownError`), on log toujours avec le nom du Chevalier et la zone de patrouille, on ne catch jamais silencieusement. Crée 2 exemples few-shot complets (mauvais / bon), puis demande à l'IA de générer la fonction `gererIncident(knight, horror)` en respectant ces patterns. Compare avec ce que tu obtiens sans few-shot. (15 minutes)

**EXO 3 : Le comparatif d'approches sur la déduplication**
Demande 3 implémentations différentes d'une fonction qui déduplique un tableau de ninjas selon leur identifiant de clan. Force l'IA à te donner les compromis de chaque approche. Choisis une, justifie ton choix par écrit en 3 phrases. (15 minutes)

---

## RÉSUMÉ

Un prompt flou donne du code plausible. Un prompt précis donne du code utile. La différence : contexte + contraintes + format + exemples. Le few-shot est la technique la plus puissante et la moins utilisée. L'itération en dialogue est normale : tu corriges de façon ciblée, pas depuis zéro. Et à la fin, le code qui rentre dans ton codebase, c'est sous ta responsabilité : pas celle du LLM.
