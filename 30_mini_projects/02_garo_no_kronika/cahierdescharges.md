---
stability: intemporel
---

# CAHIER DES CHARGES : GARO NO KRONIKA

Temps de lecture ~14 min

## PRÉREQUIS

```
Node.js    : v20+
npm      : v10+
Variables env : aucune
Outils externes: aucun

# Installation
$ npm install

# Lancer la démo
$ node src/index.js

# Lancer les tests
$ npm test
```

Le streaming est simulé via le module natif `events` de Node.js (`EventEmitter`), pas via un vrai serveur HTTP. Zéro dépendance réseau, zéro port ouvert. C'est un choix délibéré : l'objectif est de comprendre le pattern event-driven, pas de configurer un serveur SSE.

---

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Inspiré de Garo Honoo no Kokuin (Garo : La flamme de la marque). Des Horrors (démons qui prennent forme humaine et dévorent les faibles) apparaissent dans plusieurs quartiers de la ville simultanément. Un Conseil de Surveillance détecte les apparitions et dispatche des missions aux Chevaliers d'Or disponibles. Chaque Chevalier prépare son armure dorée (ce qui prend du temps), combat le Horror, et streame le résultat en temps réel vers le Conseil. L'armure ne peut tenir que 99,9 secondes. Si le combat dépasse ce seuil : l'armure se désintègre, le Chevalier est vulnérable, et la mission échoue.

Ce que tu dois voir tourner à la fin :

```
$ node src/index.js

[CONSEIL] Horror détecté : Quartier Est (niveau CRITIQUE)
[CONSEIL] Horror détecté : Quartier Ouest (niveau MODÉRÉ)
[DISPATCH] León Luis => Quartier Est
[DISPATCH] Alfonso San Valiante => Quartier Ouest

[ARMURE] León : préparation... (2.3s)
[ARMURE] Alfonso : préparation... (1.8s)
[COMBAT] León vs Horror Anima : en cours...
[COMBAT] Alfonso vs Horror Blade : en cours...
[STREAM] Alfonso => victoire en 44.2s | Quartier Ouest sécurisé
[STREAM] León => victoire en 67.8s | Quartier Est sécurisé
[CONSEIL] Rapport : 2/2 missions réussies | 0 armures désintégrées

$ npm test
PASS tests/dispatcher.test.js (18 tests)
PASS tests/knight.test.js (14 tests)
PASS tests/armor.test.js (12 tests)
PASS tests/council.test.js (10 tests)
```

Ce projet est différent du premier : tu gères de l'asynchrone réel (des opérations qui prennent du temps et qui peuvent se produire en parallèle), des erreurs qui doivent se propager proprement, et un flux d'événements en temps réel vers un observateur.

## POURQUOI CE PROJET EXISTE

Ce projet teste la maîtrise de l'asynchrone non pas en isolation mais sous contraintes multiples simultanées :

- **gérer plusieurs opérations async en parallèle sans bloquer le Conseil** : deux Chevaliers qui combattent en même temps ne peuvent pas se bloquer mutuellement. Le Conseil doit rester réactif pendant que les combats se déroulent.
- **respecter une contrainte de timeout critique** : si un combat dépasse 99,9 secondes, l'erreur doit être levée, propagée, et traitée. Pas absorbée en silence, pas ignorée. Traitée.
- **distinguer erreur fatale et erreur récupérable** : l'armure qui se désintègre est une erreur fatale (la mission échoue, on ne réessaie pas). Un Horror qui résiste plus longtemps que prévu est une situation dégradée (on continue mais on alerte).
- **streamer des événements vers un observateur sans couplage fort** : le Conseil n'appelle pas le Chevalier pour avoir des nouvelles. C'est le Chevalier qui émet des événements, et le Conseil écoute. C'est l'inversion du contrôle (pattern event-driven).

## LES 4 MODULES QUE CE PROJET COUVRE, ET OÙ ILS SE VOIENT DANS LE CODE

### `03_async` : Promises, async/await, race, allSettled

**Où ça se voit** : `src/engine/dispatcher.js`, `src/engine/missionRunner.js`.
**Pourquoi c'est nécessaire ici** : chaque mission est une Promise. Deux missions en parallèle = `Promise.allSettled`. Le timeout de 99,9 secondes = `Promise.race` entre le combat et un timer. Sans maîtrise de ces primitives async, le dispatcher bloque ou perd des missions.

### `05_error_handling` : propagation et stratégies d'erreur

**Où ça se voit** : `src/errors/`, les `try/catch` dans `missionRunner.js`.
**Pourquoi c'est nécessaire ici** : `ArmorCollapseError`, `HorrorEscapeError`, `KnightDownError` sont des erreurs distinctes qui demandent des traitements distincts. Les absorber toutes dans un `catch (e) { console.log(e) }` est un crime. Le Conseil doit savoir exactement ce qui s'est passé.

### `20_realtime` : SSE (Server-Sent Events) : flux d'événements unidirectionnels

**Où ça se voit** : `src/council/streamReceiver.js`, `src/knight/streamEmitter.js`.
**Pourquoi c'est nécessaire ici** : le Conseil reçoit les événements de combat en temps réel, pas à la fin du combat. Chaque coup, chaque changement de statut, chaque seconde critique : streamé. C'est le pattern SSE (Server-Sent Events : flux d'événements envoyés du serveur vers le client, unidirectionnel) simulé en JS pur ici.

### `16_architecture_patterns` : event-driven, module pattern

**Où ça se voit** : toute la séparation entre `src/council/` et `src/knight/`. Le Conseil ne connaît pas l'implémentation des Chevaliers.
**Pourquoi c'est nécessaire ici** : si le Conseil appelle directement les méthodes du Chevalier, tout est couplé. Si le Chevalier émet des événements et que le Conseil s'abonne, on peut changer l'implémentation d'un Chevalier sans toucher au Conseil. C'est le cœur de l'architecture event-driven.

### Résumé visuel

```
03_async       --> dispatcher.js (allSettled), missionRunner.js (race + timeout)
05_error_handling  --> errors/ (custom errors), propagation dans missionRunner.js
20_realtime     --> streamEmitter.js (Chevalier émet), streamReceiver.js (Conseil écoute)
15_architecture   --> découplage total Conseil / Chevalier via événements
```

## FLUX D'APPEL : QUI APPELLE QUI, DANS QUEL ORDRE

```
src/index.js
 --> council.detectHorror(location, level)    // horror détecté
 --> dispatcher.assign(horror, availableKnights) // choisit quel chevalier
    --> knight.prepareMission(horror)      // le chevalier se prépare
       --> armor.equip(knight)        // prépare l'armure (async, délai réel)
       --> missionRunner.run(knight, horror) // lance le combat
          --> Promise.race([
             combat.fight(knight, horror), // le combat lui-même
             timeout(99900)         // le timer d'armure
            ])
          --> streamEmitter.emit(event)  // chaque événement streamé
 --> council.streamReceiver.on(event, handler)  // le conseil écoute en parallèle
 --> Promise.allSettled([mission1, mission2, ...]) // attend toutes les missions
 --> council.buildReport(results)         // rapport final
```

Le point clé : `council.streamReceiver` écoute pendant que les missions tournent. Ce n'est pas séquentiel. Les deux se passent en même temps.

## L'ARCHITECTURE DU CODE, FICHIER PAR FICHIER

```
src/
├── council/
│  ├── council.js
│  ├── dispatcher.js
│  └── streamReceiver.js
│
├── knight/
│  ├── knight.js
│  └── streamEmitter.js
│
├── armor/
│  └── armor.js
│
├── engine/
│  ├── missionRunner.js
│  └── combat.js
│
├── errors/
│  ├── ArmorCollapseError.js
│  ├── HorrorEscapeError.js
│  └── KnightDownError.js
│
└── index.js

tests/
├── dispatcher.test.js
├── knight.test.js
├── armor.test.js
└── council.test.js
```

### `src/council/council.js`

**Ce que ça fait** : représente le Conseil de Surveillance. Reçoit les détections de Horrors, déclenche le dispatch, construit le rapport final.
**Entrée** : événements de détection (`{ location, level }`).
**Sortie** : rapport de mission (`{ success, failed, armorLost }`).

### `src/council/dispatcher.js`

**Ce que ça fait** : choisit quel Chevalier envoyer sur quelle mission. Si plusieurs Horrors apparaissent simultanément, dispatche plusieurs Chevaliers en parallèle.
**Entrée** : liste de Horrors détectés, liste de Chevaliers disponibles.
**Sortie** : un tableau de Promises de missions (une par mission lancée).

### `src/council/streamReceiver.js`

**Ce que ça fait** : reçoit les événements streamés par les Chevaliers pendant les combats. Écoute, ne fait pas d'appels sortants.
**Entrée** : un type d'événement et un handler.
**Sortie** : rien (side-effect : appelle le handler quand l'événement arrive).

### `src/knight/knight.js`

**Ce que ça fait** : représente un Chevalier d'Or. Contient son nom, son niveau, son état (disponible / en mission / KO).
**Entrée** : un identifiant de Chevalier.
**Sortie** : un objet Chevalier avec ses méthodes.

### `src/knight/streamEmitter.js`

**Ce que ça fait** : étend `EventEmitter` (module natif Node.js). Chaque action notable du combat (touche reçue, esquive, chakra critique, statut d'armure) déclenche un `this.emit('combat:event', payload)`. C'est la simulation du flux SSE : même logique d'événements unidirectionnels, sans serveur HTTP.
**Entrée** : un type d'événement (`'combat:hit'`, `'armor:warning'`, `'mission:end'`) et un payload.
**Sortie** : rien (side-effect : tous les handlers abonnés via `streamReceiver.on()` sont appelés).

### `src/council/streamReceiver.js`

**Ce que ça fait** : reçoit une référence au `streamEmitter` du Chevalier et s'y abonne avec `emitter.on(type, handler)`. Le Conseil écoute sans jamais appeler le Chevalier directement.
**Entrée** : une instance de `streamEmitter` et des handlers par type d'événement.
**Sortie** : rien (side-effect : appelle les handlers quand les événements arrivent).

### `src/armor/armor.js`

**Ce que ça fait** : gère l'état de l'armure dorée. La préparation prend un délai aléatoire (simulé). Après équipement, un timer de 99 900 ms (99,9 secondes) démarre.
**Entrée** : un Chevalier.
**Sortie** : une Promise qui resolve quand l'armure est prête, et expose un `timeout` qui reject si le timer expire.

### `src/engine/missionRunner.js`

**Ce que ça fait** : orchestre une mission complète. Lance `armor.equip()`, puis `Promise.race([combat.fight(), armor.timeout])`. Catch les erreurs et les classe (`ArmorCollapseError`, `HorrorEscapeError`).
**Entrée** : un Chevalier et un Horror.
**Sortie** : une Promise qui resolve avec le résultat de la mission ou reject avec une erreur typée.

### `src/engine/combat.js`

**Ce que ça fait** : simule le combat entre un Chevalier et un Horror. Durée aléatoire, résultat aléatoire selon les niveaux respectifs.
**Entrée** : un Chevalier, un Horror.
**Sortie** : une Promise qui resolve avec `{ duration, outcome }`.

### `src/errors/ArmorCollapseError.js` / `HorrorEscapeError.js` / `KnightDownError.js`

**Ce que ça fait** : des classes d'erreur custom (étendant `Error`) avec un nom, un message, et des métadonnées contextuelles (quel Chevalier, quel Horror, à quel moment).

## L'ORDRE DE CONSTRUCTION (PAR OÙ COMMENCER)

```
1. src/errors/     --> zéro dépendance, juste des classes, testables immédiatement
2. src/armor/armor.js  --> dépend uniquement d'un timer, testable avec des timeouts courts
3. src/knight/knight.js --> données statiques + état simple
4. src/knight/streamEmitter.js + src/council/streamReceiver.js --> les deux ensemble
5. src/engine/combat.js --> dépend de knight, testable avec des mocks de knight
6. src/engine/missionRunner.js --> dépend de armor + combat + errors
7. src/council/dispatcher.js  --> dépend de knight + missionRunner
8. src/council/council.js   --> orchestre tout
9. src/index.js        --> branche, démo complète
```

## ESTIMATION DE TEMPS ET ZONES DE RÉSISTANCE

**Durée totale estimée** : 14 à 20 heures de travail réel.

| Étape              | Durée estimée | Zone de résistance                                        |
| ------------------ | ------------- | --------------------------------------------------------- |
| errors/            | 30min         | Faible                                                    |
| armor.js           | 2h            | Moyenne : gérer le timer correctement sans memory leak    |
| knight + stream    | 2h            | Moyenne : le pattern emitter/receiver                     |
| combat.js          | 1h30          | Faible                                                    |
| missionRunner.js   | 4-5h          | **Haute** : Promise.race + gestion des erreurs imbriquées |
| dispatcher.js      | 2h            | Moyenne : allSettled et lecture des résultats partiels    |
| council.js + index | 1h30          | Faible                                                    |
| Tests complets     | 2-3h          | Moyenne : mocker des Promises qui résolvent ou reject     |

Le point de résistance majeur est `missionRunner.js`. La combinaison de `Promise.race`, d'un timeout, et de la propagation d'erreurs typées dans un même bloc async est précisément ce que le module `03_async` + `05_error_handling` préparent. Si tu bloques ici, relis `05_error_handling/03_error_propagation.md`.

## EXEMPLE DE TEST REMPLI

```js
// tests/armor.test.js
import { equipArmor } from "../src/armor/armor.js";
import { createKnight } from "../src/knight/knight.js";

describe("armor", () => {
  test("equip() résout quand le délai de préparation est écoulé", async () => {
    const leon = createKnight("leon");
    const armor = await equipArmor(leon);
    expect(armor.equipped).toBe(true);
    expect(armor.knight).toBe("leon");
  });

  test("timeout reject avec ArmorCollapseError après 99.9s simulées", async () => {
    // On passe un timeout court (50ms) pour le test
    const leon = createKnight("leon");
    const { timeout } = await equipArmor(leon);

    await expect(timeout(50)).rejects.toThrow("ArmorCollapseError");
  });
});

// tests/dispatcher.test.js
import { dispatch } from "../src/council/dispatcher.js";

describe("dispatcher", () => {
  test("allSettled retourne les deux résultats même si une mission échoue", async () => {
    const horrors = [
      { location: "Est", level: "CRITIQUE" },
      { location: "Ouest", level: "MODÉRÉ" },
    ];
    const knights = [
      { id: "leon", available: true },
      { id: "alfonso", available: true },
    ];

    const results = await dispatch(horrors, knights);

    // allSettled ne throw jamais : on lit le statut
    expect(results).toHaveLength(2);
    results.forEach((r) => {
      expect(["fulfilled", "rejected"]).toContain(r.status);
    });
  });
});
```

## CAS LIMITES À TESTER OBLIGATOIREMENT

1. **Timeout à 99,9 secondes** : simulé avec un timer court en test (50ms). Le `Promise.race` doit rejeter avec `ArmorCollapseError`, pas une erreur générique.
2. **Plus de Horrors que de Chevaliers disponibles** : le dispatcher doit émettre un `HorrorEscapeError` pour chaque Horror sans Chevalier, sans bloquer les missions déjà lancées.
3. **Deux missions en parallèle dont une échoue** : `Promise.allSettled` doit retourner les deux résultats. Le succès de la première ne doit pas masquer l'échec de la seconde.
4. **Événement streamé après la fin de la mission** : le streamReceiver ne doit pas planter si un événement arrive après que la mission est terminée.

## LES RÈGLES QUE TU NE DOIS JAMAIS CASSER

1. **Zéro `catch` vide.** Chaque erreur est catchée, classée, et remontée ou loggée. Un `catch (e) {}` sans contenu est interdit.
2. **Le Conseil ne connaît pas les méthodes internes des Chevaliers.** `council.js` ne fait jamais `knight.attack()` ou `knight.defend()`. Il écoute des événements, c'est tout.
3. **Chaque erreur custom a ses métadonnées.** `new ArmorCollapseError({ knight: 'leon', duration: 102 })` : pas juste un message texte.

## CE QUE TU NE FAIS PAS DANS CE PROJET

- Pas de serveur HTTP réel (le streaming est simulé en JS pur, pas avec un vrai serveur SSE).
- Pas de persistance entre les sessions.
- Pas d'interface graphique.
- Pas de TypeScript.

## LES ADR

```
ADR/001-pourquoi-promise-race-pour-le-timeout-armure.md
ADR/002-pourquoi-event-driven-entre-chevalier-et-conseil.md
ADR/003-pourquoi-allsettled-plutot-que-all-pour-le-dispatch.md
```

Exemple rempli :

```markdown
# ADR 002 : Architecture event-driven entre Chevalier et Conseil

## Contexte

Le Conseil a besoin de savoir ce qui se passe pendant les combats en temps réel.
Deux approches possibles : le Conseil appelle le Chevalier pour avoir des nouvelles
(polling), ou le Chevalier envoie des événements au Conseil (push).

## Décision

Le Chevalier émet des événements via streamEmitter. Le Conseil s'abonne via
streamReceiver. Ils ne se connaissent pas directement.

## Alternatives considérées

- Polling depuis le Conseil toutes les Xms : rejeté, parce que ça crée un couplage
  temporel (le Conseil dépend du fait que le Chevalier réponde à la bonne fréquence)
  et génère des appels inutiles.
- Callback direct passé au Chevalier : rejeté, parce que ça couple le Chevalier au
  Conseil. Si le Conseil change, le Chevalier doit changer aussi.

## Conséquences

- Ajouter un nouveau type d'observateur (un journaliste, un historien) = s'abonner
  au même streamEmitter. Zéro modification du Chevalier.
- Les tests du Chevalier n'ont pas besoin de mocker le Conseil.
```

## QUAND EST-CE QUE LE PROJET EST VRAIMENT FINI

```
[ ] une démo complète avec 2 missions parallèles s'affiche dans la console
[ ] Promise.race est utilisé dans missionRunner.js avec un vrai timeout
[ ] Promise.allSettled est utilisé dans dispatcher.js pour les missions parallèles
[ ] les 3 classes d'erreur custom existent avec métadonnées
[ ] les 4 cas limites ont chacun un test
[ ] le Conseil n'appelle aucune méthode interne des Chevaliers directement
[ ] les 3 ADR sont remplis avec contexte, décision, alternatives, conséquences
[ ] POSTMORTEM.md documente au moins un bug async rencontré pendant le dev
[ ] TDD_JOURNAL.md trace quels tests ont été écrits en premier
```

## SÉCURITÉ (gate obligatoire)

Un projet qui marche mais qui est vulnérable n'est pas fini. Traite ces exigences OWASP contextuelles avant de livrer.

- Validation d'entrée (OWASP A03) : sanitizer les données de chronique avant traitement (pas d'injection via les champs texte).
- Intégrité des données (OWASP A08) : vérifier la cohérence des enregistrements avant persistance.

Pour chaque exigence : documente dans `SECURITY.md` la menace, ta contre-mesure et le test qui la prouve. Le `verification_pack` de ce projet contient un test de sécurité qui doit passer.

---

## Securite (gate obligatoire, Partie I)

- **Exigence 1** : aucune donnee sensible (secret, token, cle) dans le code source ni dans les logs. Utiliser variables d'environnement + `.env.example` versionne (jamais `.env`).
- **Exigence 2** : toute entree externe (STDIN, fichier, HTTP, CLI) est validee AVANT usage (type, longueur, format). En cas d'invalidite : erreur explicite, jamais un crash silencieux.

Un test dans `node solution.js` (auto-verif ecrite par toi) doit prouver ces deux points (ex : lancer le programme avec une entree malformee et verifier qu'il refuse proprement).

## RÔLE DES DOSSIERS (ne skippe pas)

- `src/` : **tu remplis toi-même**. Le dossier est vide exprès : c'est ton livrable. Aucun code fourni.
- `tests/` : **TDD strict : tu écris le test AVANT le code de `src/`**. Rouge → vert → refactor. Si `tests/` est vide en fin de projet, ce projet ne compte pas dans ton portfolio.
- `ADR/` : **au moins 1 décision architecturale documentée** (choix de structure, trade-off, alternative rejetée + pourquoi). Format : Contexte / Décision / Conséquences.
- `POSTMORTEM.md` : **rédigé à la fin, honnête**. Ce qui a foiré, combien de temps t'a coûté chaque blocage, ce que tu referais autrement.
- `TDD_JOURNAL.md` : trace vivante du cycle rouge/vert/refactor.

**Un CTO qui feuillette ton portfolio regarde `src/` ET `tests/` ET `ADR/`. Un `src/` vide sans `tests/` associé = projet non fini, quelle que soit la qualité du reste.**
