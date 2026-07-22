---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# AI CODE REVIEW ARENA : DEVINE, REVIEWE, CORRIGE
Temps de lecture ~13 min

`27_team_craft/01_code_review.md` t'a donné la posture : comment commenter, comment recevoir une review, la checklist d'un reviewer sérieux. Ce qui manquait : la pratique. Voilà 5 snippets, chacun avec un problème réel caché dedans. Ton boulot : le trouver avant de lire le corrigé.

---

## CE QUE CET EXERCICE PROUVE VRAIMENT (lis ça avant de commencer)

Chaque snippet ci-dessous est étiqueté "origine probable : IA" ou "origine probable : humain". Sois honnête sur ce que ça veut dire : **en review réelle, tu ne sais jamais avec certitude qui ou quoi a écrit une ligne donnée**. Ce que tu peux faire, c'est reconnaître des *patterns* qui reviennent plus souvent d'un côté que de l'autre. C'est ça que cet exercice entraîne : pas un détecteur infaillible, un instinct de reviewer.

```
PATTERNS QUI REVIENNENT SOUVENT CÔTÉ IA (pas une règle absolue) :
- gestion d'erreur cosmétique : un try/catch qui existe mais qui ne fait rien d'utile
- optimisme silencieux : le code suppose que tout se passe bien, sans le vérifier
- sur-ingénierie locale : une abstraction ajoutée là où une ligne suffisait
- commentaires qui décrivent CE QUE fait le code, jamais POURQUOI
- une réponse "plausible" à la demande, qui rate un détail métier non précisé

PATTERNS QUI REVIENNENT SOUVENT CÔTÉ HUMAIN (pas une règle absolue) :
- faute d'inattention ponctuelle (un `<=` au lieu de `<`, une variable mal nommée copiée-collée)
- un edge case oublié parce que le dev codait avec UN cas précis en tête
- un raccourci pris sciemment, sous pression de deadline, jamais nettoyé après
- un commentaire qui dit "TODO" ou "à corriger" et qui ne l'a jamais été
```

Garde ces deux listes en tête en lisant. Mais ne les traite pas comme une vérité : le but de l'EXO final, c'est justement de te confronter à un cas où l'intuition se trompe.

---

## SNIPPET 1 : LE VALIDATEUR DE VOTE (Ballon d'Or)

**Origine probable : IA**

```javascript
async function validerVote(votant, joueurId) {
 try {
  const dejaVote = await db.votes.findOne({ votant });
  if (dejaVote) {
   console.log('Vote déjà enregistré pour ce votant');
   return { success: false };
  }
  const joueur = await db.joueurs.findById(joueurId);
  const nouveauVote = await db.votes.create({ votant, joueurId, date: new Date() });
  return { success: true, vote: nouveauVote };
 } catch (error) {
  console.log('Erreur lors du vote');
  return { success: false };
 }
}
```

<details>
<summary>CORRIGÉ (clique pour révéler)</summary>

**Le problème** : `joueur` est récupéré (`await db.joueurs.findById(joueurId)`) mais jamais vérifié. Si `joueurId` n'existe pas en DB, `joueur` vaut `undefined`, et le code continue quand même : il crée un vote pour un joueur qui n'existe pas. Aucune erreur n'est levée, le `catch` ne se déclenche pas parce qu'il n'y a pas d'exception, juste une donnée invalide qui passe.

**Pourquoi c'est un pattern IA typique** : la fonction A L'AIR complète. Elle vérifie le double-vote, elle a un try/catch, elle retourne un objet structuré. Mais elle ne vérifie jamais que `joueur` n'est pas `undefined` avant de continuer : c'est exactement l'optimisme silencieux. Le `catch` générique donne une fausse impression de robustesse : il attrape les erreurs de connexion DB, mais pas les données métier invalides, qui ne sont pas des erreurs au sens JS.

**Le fix** :
```javascript
const joueur = await db.joueurs.findById(joueurId);
if (!joueur) {
 return { success: false, raison: 'joueur introuvable' };
}
```

**Catégorie de la checklist `01_code_review.md`** : FONCTIONNEL → "les cas aux limites sont couverts (null, empty, error)".

</details>

---

## SNIPPET 2 : LE CALCUL DE COOLDOWN (Rasengan Engine)

**Origine probable : humain**

```javascript
function jutsuEstDisponible(jutsu, tourActuel) {
 const tourDernierUsage = jutsu.dernierUsage;
 const cooldown = jutsu.cooldown;

 if (tourActuel - tourDernierUsage <= cooldown) {
  return false;
 }
 return true;
}
```

<details>
<summary>CORRIGÉ (clique pour révéler)</summary>

**Le problème** : `<=` au lieu de `<`. Si un jutsu a un cooldown de 3 tours et a été utilisé au tour 5, il redevient disponible au tour 9 (5 + 3 + 1) avec cette version, au lieu du tour 8 (5 + 3) attendu. Un tour de cooldown en trop, à chaque jutsu, à chaque combat. Le genre de bug qui passe les tests si personne n'a écrit un test pile sur la limite exacte (`tourActuel - tourDernierUsage === cooldown`).

**Pourquoi c'est un pattern humain typique** : une erreur de borne (`<=` vs `<`) classique, le genre de faute qu'on fait en tapant vite et qu'on ne revoit jamais parce que le code "a l'air" juste à la lecture rapide. Pas un manque de compréhension du concept : une inattention ponctuelle sur un détail qui se voit seulement si tu testes pile la limite.

**Le fix** :
```javascript
if (tourActuel - tourDernierUsage < cooldown) {
 return false;
}
```

**Catégorie de la checklist** : TESTS → "si un bug est corrigé : un test qui aurait détecté ce bug est présent". Un test sur la limite exacte aurait attrapé ça immédiatement.

</details>

---

## SNIPPET 3 : LE GESTIONNAIRE DE SESSION (Trapsoul Radio)

**Origine probable : IA**

```javascript
class SessionManager {
 constructor() {
  this.sessions = new Map();
 }

 createSession(userId, options = {}) {
  const sessionConfig = {
   userId,
   createdAt: Date.now(),
   expiresAt: Date.now() + (options.duration || 3600000),
   metadata: options.metadata || {},
   preferences: options.preferences || {},
   locale: options.locale || 'fr',
  };

  const sessionId = this.generateSessionId();
  this.sessions.set(sessionId, sessionConfig);
  return sessionId;
 }

 generateSessionId() {
  return 'sess_' + Math.random().toString(36).substring(2, 15);
 }

 getSession(sessionId) {
  return this.sessions.get(sessionId);
 }
}
```

<details>
<summary>CORRIGÉ (clique pour révéler)</summary>

**Le problème** : deux choses. D'abord, `getSession` retourne une session même si elle a expiré (`expiresAt` dépassé) : rien ne vérifie `expiresAt` contre l'heure actuelle. Ensuite, `generateSessionId` utilise `Math.random()` pour générer un identifiant de session : c'est prévisible, pas cryptographiquement sûr, et donc inadapté pour un identifiant qui sert de clé d'accès (un attaquant peut potentiellement deviner ou brute-forcer des sessions actives).

**Pourquoi c'est un pattern IA typique** : la classe a l'air complète et professionnelle (options par défaut, structure propre, nommage clair). Mais elle implémente la PARTIE VISIBLE de la demande ("créer et récupérer des sessions") sans implémenter la partie qui n'a pas été explicitement demandée mais qui est implicite dans le mot "session" : l'expiration doit être VÉRIFIÉE, pas juste stockée, et l'ID doit être SÛR, pas juste unique en apparence. Une réponse plausible à la lettre du prompt, qui rate l'esprit.

**Le fix** :
```javascript
const crypto = require('crypto');

generateSessionId() {
 return 'sess_' + crypto.randomBytes(16).toString('hex');
}

getSession(sessionId) {
 const session = this.sessions.get(sessionId);
 if (!session) return null;
 if (Date.now() > session.expiresAt) {
  this.sessions.delete(sessionId);
  return null;
 }
 return session;
}
```

**Catégorie de la checklist** : SÉCURITÉ → "les permissions sont vérifiées" (l'expiration EST une permission temporelle) et un point qui n'est même pas dans la checklist de base mais que ce cas révèle : la qualité cryptographique d'un générateur d'ID, à ajouter à ta propre checklist perso si tu touches à de l'auth.

</details>

---

## SNIPPET 4 : LE PARSER DE FLAGS CLI (Ballon d'Or CLI)

**Origine probable : humain**

```javascript
function parseFlags(argv) {
 const flags = {};
 for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
   const key = argv[i].slice(2);
   flags[key] = argv[i + 1];
   // TODO: gérer le cas où le flag est un booléen sans valeur (--verbose)
  }
 }
 return flags;
}
```

<details>
<summary>CORRIGÉ (clique pour révéler)</summary>

**Le problème** : le TODO dit exactement ce qui manque, et c'est resté un TODO. Si tu appelles `node cli.js --verbose --export csv`, le parser lit `argv[i+1]` pour `--verbose`, donc `flags.verbose` vaut `"--export"` (la chaîne du flag suivant), pas `true`. Et `flags.export` vaut `"csv"`, ce qui est correct, mais seulement par accident de position. Inverse l'ordre des flags (`--export csv --verbose`) et `flags.verbose` devient `undefined` (parce qu'il n'y a rien après dans le tableau). Le comportement change selon l'ordre des arguments, ce qui est rarement ce qu'on veut pour un CLI.

**Pourquoi c'est un pattern humain typique** : le dev savait que ce cas existait (le TODO le prouve), l'a sciemment reporté, probablement sous pression de livrer une version qui marche pour SON cas de test du moment, et ne l'a jamais retravaillé. Le commentaire n'est pas un oubli de compréhension, c'est une dette assumée puis oubliée.

**Le fix** :
```javascript
function parseFlags(argv, flagsBooleens = []) {
 const flags = {};
 for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
   const key = argv[i].slice(2);
   if (flagsBooleens.includes(key)) {
    flags[key] = true;
   } else {
    flags[key] = argv[i + 1];
    i++; // on consomme aussi la valeur, pour pas la reparser comme un flag
   }
  }
 }
 return flags;
}
```

**Catégorie de la checklist** : FONCTIONNEL → "le code fait ce que la PR dit qu'il fait". Un TODO non résolu dans du code qui semble fini est un signal d'alarme classique en review : toujours demander "ce TODO, c'est pour quand ?"

</details>

---

## SNIPPET 5 : LE CALCULATEUR DE RÉCOMPENSES (Ultras Dashboard)

**Origine probable : IA**

```javascript
function calculerRecompenseAbonnement(montantTotal, nombreAbonnes, tauxBonus) {
 // Calcule la récompense distribuée par abonné en fonction du montant total
 // et du taux de bonus appliqué
 const recompenseBase = montantTotal / nombreAbonnes;
 const bonus = recompenseBase * tauxBonus;
 return recompenseBase + bonus;
}

// Exemple d'utilisation :
// calculerRecompenseAbonnement(10000, 50, 0.1) => 220
```

<details>
<summary>CORRIGÉ (clique pour révéler)</summary>

**Le problème** : aucune vérification que `nombreAbonnes` n'est pas zéro. `montantTotal / 0` retourne `Infinity` en JS, pas une erreur. La fonction ne plante jamais, elle retourne juste un nombre absurde (`Infinity` ou `NaN` si `montantTotal` est aussi 0) qui peut se propager silencieusement plus loin dans le système (affiché à un utilisateur, stocké en DB, utilisé dans un autre calcul). Si le dashboard affiche "récompense : Infinity €" un jour où il n'y a aucun abonné, le bug remonte depuis l'UI, pas depuis la fonction elle-même : difficile à tracer jusqu'ici sans réflexe.

**Pourquoi c'est un pattern IA typique** : le commentaire au-dessus de la fonction décrit fidèlement CE QUE fait le code ("calcule la récompense... en fonction du montant total et du taux de bonus"), mais ne dit jamais POURQUOI ni sous quelles conditions ce calcul est valide. L'exemple d'utilisation fourni est un cas heureux (`nombreAbonnes = 50`), jamais un cas limite. C'est une réponse syntaxiquement et mathématiquement correcte à "calcule une récompense par abonné", qui ne protège pas contre l'input réel du monde (zéro abonné, un jour calme, un nouveau dashboard vide).

**Le fix** :
```javascript
function calculerRecompenseAbonnement(montantTotal, nombreAbonnes, tauxBonus) {
 if (nombreAbonnes <= 0) {
  return 0; // ou lever une erreur explicite, selon ce que le métier attend
 }
 const recompenseBase = montantTotal / nombreAbonnes;
 const bonus = recompenseBase * tauxBonus;
 return recompenseBase + bonus;
}
```

**Catégorie de la checklist** : FONCTIONNEL → "les cas aux limites sont couverts (null, empty, error)". Zéro abonné est un empty case classique, et JS ne le signale jamais comme une erreur par lui-même : c'est à toi de le faire.

</details>

---

## EXERCICES

**EXO 1 : Review à l'aveugle, sans le corrigé**
Reprends les 5 snippets. Avant de cliquer sur un seul corrigé, écris pour chacun : le bug que tu repères (s'il y en a un que tu vois), ta classification "origine probable" avec ta propre justification, et la catégorie de la checklist `01_code_review.md` qui s'applique. Compare ensuite avec les corrigés. (25 minutes)

**EXO 2 : Le snippet qui te trompe**
Sur les 5, lequel as-tu classé "IA" ou "humain" à l'envers de l'étiquette donnée, ou pour lequel ta justification était bancale même si la classification finale était bonne ? Réécris en une phrase pourquoi ton instinct s'est trompé sur celui-là précisément. (10 minutes)

**EXO 3 : Crée ton propre snippet piège**
Génère une fonction avec un LLM sur un sujet de ton choix (lié à n'importe quel mini-projet déjà fait). Lis-la avec la checklist de `01_code_review.md`. Si tu trouves un vrai problème caché : documente-le dans le même format que les 5 snippets ci-dessus (problème, pourquoi c'est ce pattern, le fix, la catégorie checklist). Si tu n'en trouves aucun après une lecture sérieuse : c'est aussi un résultat valide, note pourquoi cette génération-là était propre. (20 minutes)

---

## RÉSUMÉ

Une classification "origine IA / origine humaine" n'est jamais une certitude en review réelle : c'est un instinct construit sur des patterns récurrents, pas une preuve. Les patterns IA fréquents : optimisme silencieux, gestion d'erreur cosmétique, réponse plausible à la lettre du prompt qui rate l'esprit. Les patterns humains fréquents : erreurs de borne, edge cases oubliés sous pression de deadline, dette assumée et jamais nettoyée. Dans les deux cas, la checklist de `01_code_review.md` reste le même outil : fonctionnel, tests, lisibilité, architecture, sécurité, performance. Peu importe qui ou quoi a écrit la ligne, la question reste la même : qu'est-ce qui casse, et dans quelles conditions précises ?

---

## Transformer une hallucination en leçon

Quand l'IA hallucine (méthode inexistante, comportement inventé), ne te contente pas de "corriger et passer".

### Protocole (5 min)

1. **Copie** la réponse fausse dans `HALLUCINATIONS.md` du projet en cours.
2. **Nomme** précisément l'erreur (API inexistante ? Sémantique fausse ? Version obsolète ?).
3. **Trouve la source** officielle qui contredit (MDN, RFC, doc du framework).
4. **Écris** en 3 lignes **pourquoi** l'IA a probablement halluciné (nom plausible, pattern d'autres langages, doc obsolète dans le training set).
5. **Ajoute** l'exemple à ton **prompt système** perso pour éviter la prochaine fois.

### Exemple

L'IA propose `array.remove(x)`. Erreur : n'existe pas en JS. Origine probable : confusion Python/Ruby. Fix mental : "en JS on filtre ou on splice, jamais `.remove`."

### Livrable

Un `HALLUCINATIONS.md` par projet. Ce fichier est **un actif** : il devient ta liste noire et améliore tes prompts au fil du temps.
