---
stability: intemporel
---

# PROPAGATION D'ERREURS : QUI CATCH QUOI ET À QUEL NIVEAU

Temps de lecture ~7 min


Une erreur levée quelque part dans ton code ne disparaît pas. Elle remonte la call stack jusqu'à ce que quelqu'un la catch. Si personne ne la catch : le programme crash.

Le vrai problème c'est pas "est-ce que je catch" : c'est "est-ce que je catch au bon niveau, avec la bonne réaction".

---

## 1) COMMENT UNE ERREUR REMONTE

Visualisation directe :

```
main()
 └─> processerMatch()
    └─> chargerJoueurs()
       └─> queryDB()
          └─> ERREUR LEVÉE ICI

si queryDB ne catch pas --> l'erreur remonte à chargerJoueurs
si chargerJoueurs ne catch pas --> remonte à processerMatch
si processerMatch ne catch pas --> remonte à main
si main ne catch pas --> crash
```

```js
function queryDB(sql) {
 // connexion échoue
 throw new DatabaseError("SELECT", "timeout après 5000ms");
}

function chargerJoueurs(matchId) {
 // pas de try/catch ici
 // l'erreur de queryDB traverse et remonte
 return queryDB(`SELECT * FROM joueurs WHERE match_id = ${matchId}`);
}

function processerMatch(matchId) {
 try {
  const joueurs = chargerJoueurs(matchId);
  return analyserJoueurs(joueurs);
 } catch (e) {
  // c'est ici que DatabaseError arrive
  if (e instanceof DatabaseError) {
   console.error("DB indisponible pendant le traitement du match", matchId);
   return { statut: "echec", raison: "db_timeout" };
  }
  throw e; // le reste remonte encore
 }
}
```

`chargerJoueurs` ne catch pas : c'est correct. Ce n'est pas son niveau de responsabilité.

---

## 2) LE PRINCIPE : CATCH AU BON NIVEAU

Règle : tu catches une erreur uniquement si tu peux faire quelque chose d'utile avec elle.

```
niveau bas (queryDB)   : lever l'erreur, ne pas la catcher
niveau métier (service) : catcher et transformer en erreur métier
niveau API (controller) : catcher et transformer en réponse HTTP
niveau app (main)    : catcher et logger sans crash
```

Mauvais pattern : catch sans action :

```js
function chargerJoueurs(matchId) {
 try {
  return queryDB(`SELECT * FROM joueurs WHERE match_id = ${matchId}`);
 } catch (e) {
  console.log("erreur");
  // on retourne undefined silencieusement
  // l'appelant ne sait pas que ça a foiré
 }
}
```

`chargerJoueurs` a avalé l'erreur. L'appelant reçoit `undefined` et continue comme si de rien n'était. Le bug apparaît plus loin, sans contexte. Impossible à debugger.

Bon pattern : laisser remonter ou transformer :

```js
function chargerJoueurs(matchId) {
 // pas de try/catch : l'erreur remonte, c'est voulu
 return queryDB(`SELECT * FROM joueurs WHERE match_id = ${matchId}`);
}

// ou transformer si tu as de la valeur à ajouter
function chargerJoueurs(matchId) {
 try {
  return queryDB(`SELECT * FROM joueurs WHERE match_id = ${matchId}`);
 } catch (e) {
  // transformer avec du contexte supplémentaire
  throw new DatabaseError(
   "chargerJoueurs",
   `match ${matchId} : ${e.message}`,
  );
 }
}
```

---

## 3) RETHROWING : ATTRAPER PUIS RELANCER

Pattern courant : tu catches pour inspecter, tu relances ce qui n'est pas de ton ressort.

```js
function processerDonnees(data) {
 try {
  valider(data);
  transformer(data);
  sauvegarder(data);
 } catch (e) {
  if (e instanceof ValidationError) {
   // ça, je sais gérer
   logWarning("données invalides ignorées", { data, erreur: e.message });
   return null;
  }
  // DatabaseError, TypeError, etc. : pas mon rôle
  // je relance sans toucher
  throw e;
 }
}
```

`throw e` : relance l'erreur originale avec sa stack trace intacte.

Ne jamais faire ça :

```js
catch (e) {
 throw new Error(e.message)
 // tu perds la stack trace originale
 // tu perds le type de l'erreur
 // tu perds toutes les propriétés custom
}
```

---

## 4) WRAPPING : ENRICHIR AVANT DE RELANCER

Parfois tu veux ajouter du contexte sans perdre l'original.

```js
class ServiceError extends Error {
 constructor(message, cause) {
  super(message);
  this.name = "ServiceError";
  this.cause = cause; // l'erreur originale préservée
 }
}

function serviceJoueurs(matchId) {
 try {
  return chargerJoueurs(matchId);
 } catch (e) {
  // wrapping : contexte métier + cause originale préservée
  throw new ServiceError(
   `Impossible de charger les joueurs pour le match ${matchId}`,
   e,
  );
 }
}

try {
 serviceJoueurs(42);
} catch (e) {
 console.log(e.message); // "Impossible de charger les joueurs pour le match 42"
 console.log(e.cause.message); // "DB failure pendant "SELECT" : timeout après 5000ms"
 console.log(e.cause.name); // "DatabaseError"
}
```

`e.cause` c'est un standard ES2022. Il préserve toute la chaîne de causalité.

---

## 5) ARCHITECTURE DE PROPAGATION EN COUCHES

Exemple complet : une API de stats de foot avec propagation bien structurée.

```
Request HTTP
  └─> Controller     : catch tout, répond en JSON
     └─> Service    : catch erreurs métier, transforme
        └─> Repository : lève des DatabaseError
           └─> DB : connexion, queries
```

```js
// couche basse:soulève sans catcher
class MatchRepository {
 async trouver(id) {
  const result = await this.db.query("SELECT * FROM matchs WHERE id = ?", [
   id,
  ]);
  if (!result.rows.length) {
   throw new NotFoundError("Match", id);
  }
  return result.rows[0];
 }
}

// couche service:transforme ou enrichit
class MatchService {
 async getStatsMatch(id) {
  try {
   const match = await this.repo.trouver(id);
   return calculerStats(match);
  } catch (e) {
   if (e instanceof NotFoundError) {
    throw e; // relance directement:le controller sait quoi faire
   }
   // erreur inattendue : enrichir avec le contexte métier
   throw new ServiceError(`Stats indisponibles pour match ${id}`, e);
  }
 }
}

// couche controller:transforme en réponse HTTP
class MatchController {
 async handleGetStats(req, res) {
  try {
   const stats = await this.service.getStatsMatch(req.params.id);
   res.json({ success: true, data: stats });
  } catch (e) {
   if (e instanceof NotFoundError) {
    return res.status(404).json({ error: e.message });
   }
   if (e instanceof ServiceError) {
    // log complet pour le monitoring, message générique pour l'opérateur
    logError(e);
    return res.status(500).json({ error: "erreur interne" });
   }
   // vraiment inattendu
   logError(e);
   res.status(500).json({ error: "erreur interne" });
  }
 }
}
```

Chaque couche a un rôle clair. Personne n'avale silencieusement.

---

## 6) LE HANDLER GLOBAL : DERNIER FILET

En Node.js, tu peux avoir un handler global pour les erreurs non catchées. C'est le dernier recours, pas la solution.

```js
// pour les Promises non catchées
process.on("unhandledRejection", (reason, promise) => {
 console.error("Promise non catchée :", reason);
 // log, alerte Sentry, puis on décide si on crash ou pas
 process.exit(1); // en prod : vaut mieux crash proprement que continuer en état indéfini
});

// pour les exceptions synchrones non catchées
process.on("uncaughtException", (error) => {
 console.error("Exception non catchée :", error);
 process.exit(1);
});
```

Ce handler global ne remplace pas une bonne architecture. Il attrape ce qui a raté les filets du bas. Si tu t'y retrouves souvent, tu as un problème de propagation quelque part.

---

## 7) ANTI-PATTERNS À ÉVITER

### Catch vide

```js
try {
 opération();
} catch (e) {
 // rien
}
// l'erreur disparaît. tu sais plus si ça marche ou pas.
```

### Catch qui log et retourne undefined

```js
try {
 return opération();
} catch (e) {
 console.log(e);
 // retourne undefined implicitement
 // l'appelant pense avoir un résultat valide
}
```

### Catch trop large qui écrase l'info

```js
try {
 opération();
} catch (e) {
 throw new Error("quelque chose s'est mal passé");
 // tu viens de perdre tout le contexte de l'erreur originale
}
```

---

## EXERCICES

## EXO 1 : LA CHAÎNE GARO

Implémente trois fonctions en cascade : `detecterHorror()`, `alerterChevalier()`, `engagerCombat()`.

Chaque fonction peut lancer une erreur différente. Mets le catch uniquement dans `main()`, et fais remonter correctement pour que `main` sache exactement ce qui a foiré et à quel niveau.

---

## EXO 2 : LE WRAPPING

Reprends l'exemple Garo. Modifie `alerterChevalier` pour qu'elle wrappe les erreurs de `detecterHorror` dans une `AlertError` en préservant `cause`.

Dans le catch final, affiche à la fois le message wrapper et le message de la cause.

---

## EXO 3 : ARCHITECTURE EN COUCHES

Crée une mini-architecture Repository / Service / Controller pour un système de joueurs :

- `JoueurRepository.find(id)` lève `NotFoundError` si le joueur n'existe pas
- `JoueurService.getProfile(id)` relance `NotFoundError`, wrappe le reste
- `JoueurController.handle(id)` traduit en statut et message JSON

Teste avec un id valide et un id inexistant.

---

## RÉSUMÉ

Une erreur remonte jusqu'à ce que quelqu'un la catch. Si personne ne la catch, le programme crash.

Tu catches seulement si tu peux agir. Sinon tu relances avec `throw e` : ou tu enrichis avec `cause` avant de relancer.

Ne jamais avaler silencieusement. Un catch vide est pire qu'un crash : tu sais même plus que ça a cassé.

L'architecture en couches donne à chaque niveau un rôle clair : lever, transformer, ou répondre.
