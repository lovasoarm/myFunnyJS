---
stability: intemporel
---

[PORTFOLIO]

# GARO NO KRONIKA

-> ~6 min

Des Horrors apparaissent simultanément dans plusieurs quartiers. Le Conseil de Surveillance dispatche des Chevaliers d'Or disponibles. Chaque Chevalier prépare son armure (ça prend du temps), combat, et streame le résultat en direct vers le Conseil. L'armure tient 99,9 secondes maximum : au-delà, elle se désintègre, et la mission échoue.

Le streaming est simulé avec `EventEmitter` natif de Node. Zéro serveur HTTP, zéro port ouvert : l'objectif est de comprendre le pattern event-driven, pas de configurer du SSE réel.

---

## CE QUE ÇA FAIT

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
```

---

## INSTALLATION

```
Node.js    : v20+
npm      : v10+
Variables env : aucune
Outils externes: aucun
```

```bash
npm install
node src/index.js  # lance la démo
npm test       # lance la suite de tests
```

---

## ARCHITECTURE

```
src/
├── council/
│  ├── council.js     # détecte, dispatche, construit le rapport
│  ├── dispatcher.js    # choisit quel Chevalier va où
│  └── streamReceiver.js  # écoute les événements de combat, ne fait aucun appel sortant
│
├── knight/
│  ├── knight.js       # le Chevalier, son armure, son état
│  └── streamEmitter.js   # émet les événements de combat
│
├── armor/
│  └── armor.js       # préparation de l'armure, timer des 99,9s
│
├── engine/
│  ├── missionRunner.js   # Promise.race entre combat et timeout
│  └── combat.js       # simule le combat lui-même
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

Flux d'appel complet :

```
index.js
 --> council.detectHorror(location, level)
 --> dispatcher.assign(horror, availableKnights)
    --> knight.prepareMission(horror)
       --> armor.equip(knight)
       --> missionRunner.run(knight, horror)
          --> Promise.race([combat.fight(...), timeout(99900)])
          --> streamEmitter.emit(event)
 --> council.streamReceiver.on(event, handler)  // écoute EN PARALLÈLE des missions
 --> Promise.allSettled([mission1, mission2, ...])
 --> council.buildReport(results)
```

Le Conseil écoute pendant que les missions tournent. Ce n'est pas séquentiel : les deux choses se passent en même temps.

---

## MODULES CRAZYDEVS COUVERTS

| Module           | Où ça se voit                              |
| -------------------------- | ----------------------------------------------------------------------- |
| `03_async`         | `dispatcher.js` (allSettled), `missionRunner.js` (race + timeout)    |
| `05_error_handling`    | `errors/` (erreurs custom typées), propagation dans `missionRunner.js` |
| `20_realtime`       | `streamEmitter.js` / `streamReceiver.js` : pattern SSE simulé en JS pur |
| `16_architecture_patterns` | découplage total Conseil/Chevalier via événements (event-driven)    |

---

## RÈGLES NON-NÉGOCIABLES DE CE PROJET

```
1. Zéro catch vide : chaque erreur est classée, remontée ou loggée
2. Le Conseil n'appelle jamais une méthode interne d'un Chevalier directement
3. Chaque erreur custom porte ses métadonnées (knight, horror, durée, pas juste un message)
```

---

## DOCUMENTS DU PROJET

```
cahierdescharges.md  --> spécification complète, ordre de construction, cas limites
TDD_JOURNAL.md    --> trace de l'écriture des tests, dans l'ordre réel
POSTMORTEM.md     --> bugs async rencontrés, décisions prises
ADR/         --> décisions d'architecture documentées
```

---

## BENCH & DÉCISIONS (obligatoire)

Aucun mini-projet n'est "fini" sans cette section. Documente au moins **un**
trade-off chiffré :

- **Question** : "J'ai comparé X vs Y."
- **Charge** : (taille des données, N itérations, hardware).
- **Résultat** : `X = 12ms`, `Y = 48ms` sur 10 000 items.
- **Décision** : "J'ai retenu X car …"
- **Ce que je n'ai pas mesuré** : (mémoire, DX, coût cloud…).

Sans chiffres, ce n'est pas une décision, c'est une préférence.
Voir `08_memory_performance/00_measure_first.md`.

## Pitch 3 lignes

Ce projet démontre une compétence clé : lire du code inconnu, débugger sous pression, livrer un produit (ADR + tests) qu'un autre dev peut reprendre. Utilisable en portfolio et en entretien.

## Empreinte carbone (critère d'acceptation)

Estime l'empreinte carbone approximative de ton déploiement ou de ton algo. Justifie **un** choix d'optimisation (moins d'invocations, cache, batch, région serveur). Voir `31_annexes/03_finops_greenops.md`.

## THÈME NEUTRE (optionnel)

Si les références Naruto/DBZ ne te parlent pas, remplace mentalement par un domaine que tu connais (foot, cuisine, musique). Le concept technique reste identique.

## Structure attendue

Chaque mini-projet doit contenir a minima :

- `src/` : code source (obligatoire).
- `tests/` : tests unitaires et/ou d'intégration (obligatoire).
- `README.md` : présentation, objectifs, comment lancer.
- `TDD_JOURNAL.md` : trace de la démarche TDD.
- `POSTMORTEM.md` : ce qui a marché, ce qui a cassé, ce que tu retiens.
- `ADR/` : décisions architecturales (Architecture Decision Records).
- `cahierdescharges.md` : contraintes et périmètre.

Un CI check impose la présence de `src/` et `tests/` avant validation.

---

## REPRODUCTIBILITÉ

Installation canonique : `npm ci` (pas `npm install`). `npm ci` respecte strictement le `package-lock.json` : deux personnes qui clonent obtiennent exactement les mêmes versions. Committe toujours ton `package-lock.json`. Sans lui, un `npm install` 3 mois plus tard installera d'autres versions et tu debug un fantôme.
