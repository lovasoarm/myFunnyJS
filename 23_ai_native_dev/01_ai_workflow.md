---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# L'IA DANS TON FLUX : OUTIL, PAS BÉQUILLE
Temps de lecture ~12 min

En 2026, tout le monde "utilise l'IA". La moitié copie-colle du code qu'elle ne comprend pas. L'autre moitié refuse l'outil par principe. Les deux ont tort.

Un dev qui sait utiliser l'IA sans lui faire confiance aveuglément est plus dangereux qu'un dev qui l'ignore. Pas parce que l'IA code vite : parce que ce dev reste le cerveau de l'équation.

Pense au Chevalier Léon dans Garo : il a une armure surpuissante, mais c'est lui qui dirige la bataille. L'armure ne décide pas. Si elle décidait seule, ce serait une catastrophe. L'IA, c'est ton armure.

---

## 1) CE QUE L'IA FAIT VRAIMENT BIEN

L'IA est un outil. Comme un linter, comme un compilateur : il fait ce qu'il fait, et toi tu décides si c'est utile.

Ce qu'elle gère sans te décevoir :

```
génération de boilerplate   --> scaffolding rapide, pas de réflexion requise
documentation de fonctions   --> JSDoc, commentaires, README
transformation mécanique    --> renommer, reformatter, convertir JSON <-> TS types
premier jet de tests unitaires --> la structure est là, toi tu valides le sens
recherche de pattern      --> "est-ce qu'il y a un meilleur algo ici ?"
explication de code inconnu  --> "c'est quoi ce RegEx de 3 lignes ?"
```

Ce qu'elle bâcle régulièrement :

```
logique métier complexe    --> elle invente des règles qui n'existent pas
sécurité            --> code fonctionnel, vulnérabilité invisible
architecture          --> elle suit les patterns populaires, pas les tiens
tests réels          --> elle génère des tests qui passent, pas des tests utiles
intégration dans ton codebase --> elle ne connaît pas tes conventions
```

La règle d'or : **l'IA génère, toi tu valides**. Pas le contraire.

---

## 2) LE WORKFLOW EN BOUCLE COURTE

Voici comment ça doit tourner dans ta tête, pas comment les tutos Instagram le présentent.

```
PROBLÈME
  |
  v
COMPRENDS le problème toi-même (30 secondes minimum)
  |
  v
DÉCOMPOSE ce que tu veux (quoi, pas comment)
  |
  v
PROMPT précis à l'IA
  |
  v
LIS le code généré ligne par ligne
  |
  v
IDENTIFIE ce qui est bon / faux / manquant
  |
  v
INTÈGRE ou corrige manuellement
  |
  v
TESTE (pas "ça semble marcher" : tes tests automatiques)
  |
  v
COMPRENDS pourquoi ça marche
```

Le point qui tue 80% des devs débutants : **sauter l'étape "comprends"** avant et après.

C'est le même réflexe que Rick Grimes dans Walking Dead : avant de bouger dans un couloir inconnu, il vérifie. Il n'envoie pas Daryl en éclaireur parce que Daryl est plus rapide. Il envoie Daryl parce qu'il comprend la mission et qu'il peut évaluer ce que Daryl va lui rapporter.

Si tu ne comprends pas ce que tu demandes, tu ne vas pas comprendre ce qu'elle génère. Et si tu ne comprends pas ce qu'elle génère, t'as une bombe à retardement dans ton codebase.

---

## 3) LES ZONES DE CONFIANCE

Tout n'est pas pareil. Il faut calibrer ta confiance selon le type de code.

```
ZONE VERTE (confiance haute, check rapide) :
- Utilitaires sans effets de bord (deepClone, debounce, formatDate)
- Conversions de types connues
- CSS / styles
- Ordres_mission shell banales

ZONE ORANGE (confiance modérée, review sérieuse) :
- Requêtes DB
- Parsing de données externes
- Logique de calcul (les maths qu'elle invente parfois)
- Gestion des erreurs

ZONE ROUGE (confiance basse, tu réécris ou tu valides à fond) :
- Auth et tokens
- Permissions et rôles
- Chiffrement
- Logique métier critique (argent, données médicales, accès)
- Toute opération destructive (DELETE, TRUNCATE, rm -rf)
```

```js
// Zone verte : tu prends, tu lis vite, tu check le test
const deepClone = (obj) => JSON.parse(JSON.stringify(obj))
// OK mais attention : perd les fonctions, les Map, les Date

// Zone rouge : tu réécris toi-même ou tu audites ligne par ligne
async function verifyToken(token) {
 // L'IA va produire quelque chose qui "fonctionne"
 // mais va rater la vérification de l'expiration, l'audience, l'issuer
 // si tu ne lui dis pas explicitement
}
```

Dans Naruto, Kakashi ne confie pas la mission d'infiltration de la village de la brume à Naruto parce que Naruto est capable de beaucoup de choses. Il calibre les missions selon le niveau de risque. Tu fais pareil avec l'IA.

---

## 4) LE PIÈGE DE LA DÉPENDANCE COGNITIVE

C'est là que ça devient dangereux. Pas la sécurité : ta compétence.

Scénario classique : t'as utilisé l'IA pendant 3 mois pour tout. Un jour, l'IA est down, ou t'es en entretien, ou t'as un bug tellement contextuel qu'elle ne peut pas aider. Tu bloques.

Pourquoi ? Parce que t'as pas vraiment réfléchi depuis 3 mois : elle a réfléchi pour toi.

```
Ce que tu dois garder DANS TA TÊTE :
- les structures de données et quand les utiliser
- les patterns d'architecture de base
- la lecture de stacktraces
- le debugging manuel (console.log, breakpoints, inspection réseau)
- l'estimation de complexité algorithmique

Ce que tu peux déléguer à l'IA :
- la syntaxe que tu connais mais que tu tapes mal
- les patterns répétitifs sans valeur intellectuelle
- le premier jet d'une implémentation que tu vas revoir
```

La règle : **utilise l'IA pour aller plus vite, pas pour éviter de penser**.

C'est la différence entre Michael Scofield (Prison Break) et T-Bag. Michael utilise les outils, les ressources, les autres personnages : mais le plan, c'est dans sa tête. T-Bag suit en espérant que ça marche. Tu veux être Michael, pas T-Bag.

Si tu utilises l'IA parce que tu ne sais pas, c'est un signal : apprends d'abord, délègue ensuite.

---

## 5) COÛT ET QUOTAS API : LA FACTURE QUE PERSONNE NE LIT

Tu intègres un LLM (large language model : modèle de langage) dans ton app. Ça marche en dev. Tu déploies. Un mois plus tard, la facture API arrive et elle a trois fois la taille que t'avais prévu.

Ce qui s'est passé : t'as pensé en "est-ce que ça marche", jamais en "combien ça coûte à chaque appel".

```
CE QUI TE COÛTE DE L'ARGENT À CHAQUE REQUÊTE :
- tokens (unités de texte : un mot fait souvent 1 à 2 tokens) en entrée
- tokens en sortie (souvent facturés plus cher que l'entrée)
- le contexte que tu renvoies à chaque appel (historique de conversation = payé à chaque fois)
- les retries (réessais automatiques) silencieux sur erreur réseau
```

Le piège classique : tu renvoies tout l'historique de chat à chaque message pour garder le contexte. Message 1 coûte 50 tokens. Message 20 de la même conversation coûte 3000 tokens, parce que tu rebalances toute la conversation précédente à chaque fois. Personne ne voit ça en dev avec 3 messages de test.

```js
// Dangereux : pas de limite, pas de contrôle
async function demanderAOracle(historique, nouveauMessage) {
 return await client.messages.create({
  model: "claude-sonnet-4-6",
  messages: [...historique, nouveauMessage] // grossit à l'infini
 })
}

// Mieux : tu gères la fenêtre toi-même
async function demanderAOracle(historique, nouveauMessage) {
 const MAX_HISTORIQUE = 10             // tu décides combien de tours tu gardes
 const historiqueReduit = historique.slice(-MAX_HISTORIQUE)
 return await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1000,                // tu plafonnes aussi la sortie
  messages: [...historiqueReduit, nouveauMessage]
 })
}
```

Trois réflexes à prendre avant de brancher un LLM en prod :

```
1. ESTIME avant de coder
  --> combien d'appels par jour, combien de tokens par appel, prix par token du modèle
  --> fais le calcul sur un mois avant de valider l'archi, pas après la facture

2. PLAFONNE tout ce qui peut grossir
  --> max_tokens en sortie, taille de l'historique envoyé, taille des documents joints
  --> un input non plafonné + un shinobi qui colle un PDF entier = facture qui explose

3. SURVEILLE en prod comme une métrique business
  --> coût par shinobi actif, pas juste coût total
  --> alerte si un seul compte génère 1000x la conso moyenne (bug ou abus)
```

---

## 6) INTÉGRER L'IA DANS UN VRAI PROJET D'ÉQUIPE

En solo c'est simple. En équipe, ça se complique.

```
RÈGLES D'ÉQUIPE QUI ÉVITENT LE CHAOS :

1. Code AI = code reviewé comme n'importe quel autre code
  --> pas de "mais c'est l'IA qui l'a écrit donc ça doit être bon"

2. Tests obligatoires sur tout code généré
  --> l'IA peut générer des tests aussi, mais un humain valide leur sens

3. Pas de secrets dans les prompts envoyés à un LLM externe
  --> clés API, données shinobis, schéma DB : jamais dans le contexte

4. Conventions de codebase explicites
  --> si tu ne donnes pas ton eslint, tes conventions de nommage, ton architecture
  --> l'IA va inventer les siennes. C'est le chaos.

5. Traçabilité des décisions
  --> si un module entier vient de l'IA, note-le en commentaire ou ADR
  --> pour que ton équipe sache qui comprend vraiment ce code
```

---

## 7) LE CYCLE DE MONTÉE EN COMPÉTENCE

Voici la progression qui te rend difficile à remplacer, même avec l'IA :

```
NIVEAU 1 : Tu utilises l'IA comme un moteur de recherche amélioré
 --> tu demandes des exemples, tu les recopies, ça marche parfois

NIVEAU 2 : Tu décomposes le problème avant de prompter
 --> tu sais ce que tu veux, l'IA t'économise le temps de l'écrire

NIVEAU 3 : Tu valides et tu corriges la sortie
 --> tu lis le code, tu vois les bugs, tu améliores

NIVEAU 4 : Tu utilises l'IA comme sparring partner
 --> tu lui soumets TES solutions pour challenger tes choix
 --> tu lui demandes "qu'est-ce que j'ai raté ?"

NIVEAU 5 : Tu arbitres entre plusieurs approches
 --> tu lui demandes 3 solutions différentes, tu choisis en connaissance de cause
 --> tu sais pourquoi tu choisis, pas juste laquelle choisir
```

L'objectif de MyFunnyJS : t'emmener au niveau 4-5. Pas juste t'apprendre à prompter.

---

## EXERCICES

**EXO 1 : La cartographie de confiance dans la cuisine de Walter**
Walter White a un pipeline de traitement : calcul de pureté du jutsu, gestion des stocks de précurseurs, routage des livraisons, authentification des distributeurs. Classe chacune de ces 4 fonctions en zone verte / orange / rouge selon les critères vus ici. Justifie chaque classement en une phrase. (15 minutes)

**EXO 2 : L'audit de sortie de l'oracle**
Demande à un LLM de générer une fonction `analyserSurvivant(survivant)` qui valide et classe un survivant de Walking Dead selon ses attributs (force, furtivité, expérience, groupe d'appartenance). Lis le code. Trouve au moins 3 cas que la fonction rate (Negan sans groupe ? Un survivant blessé ? Un enfant ?). Corrige-les. (20 minutes)

**EXO 3 : Le test de mémoire musculaire**
Sans IA, sans documentation, écris une fonction `debounce(fn, delay)` depuis ta mémoire. Ensuite demande à l'IA la même chose. Compare les deux. Qu'est-ce qu'elle a que t'as pas ? Qu'est-ce que t'as qu'elle n'a pas ? (10 minutes)

**EXO 4 : La facture qui fait peur**
Le pipeline Oracle Glitch du mini-projet `09_oracle_glitch` est appelé 50 000 fois par jour, avec en moyenne 200 tokens en entrée et 100 en sortie. Cherche le prix par token d'un modèle actuel et calcule le coût mensuel. Propose une optimisation pour le réduire de moitié sans perdre en qualité. (15 minutes)

---

## RÉSUMÉ

L'IA est un multiplicateur de productivité si tu sais déjà penser : c'est une béquille cognitive si tu ne sais pas. La différence entre les deux, c'est toi qui valides chaque ligne. Le workflow n'est pas "prompte, copie, déploie". C'est "comprends, prompte, valide, comprends encore". Et ça inclut le coût : un appel IA qui marche mais qui plombe ta facture n'est pas une solution, c'est un problème déguisé.
