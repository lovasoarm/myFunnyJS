---
stability: intemporel
---

# SYNTHÈSE E : L'ORACLE QUI SURVEILLE SA PROPRE FOLIE
Temps de lecture ~7 min

> Couvre : `23_ai_native_dev` + `24_databases` + `25_scalability` + `26_observability` + `27_team_craft` + `28_edge_cases` + `18_oop_js`
> Durée cible : 180 à 240 minutes
> Le bloc senior. Si t'arrives ici sans galérer, c'est que t'as sauté des trucs avant.

---

## LE CONTEXTE

L'Oracle (un LLM branché sur ton pipeline) analyse du code JS soumis par des devs, propose des corrections, et génère des tests. Le problème : l'Oracle hallucine parfois. Il invente des fonctions qui existent pas. Il retourne du JSON à moitié valide. Il jure qu'un `NaN === NaN` est vrai.

Ta mission : construire le pipeline qui encadre l'Oracle. Pas pour le remplacer, pour le surveiller. Le système doit aussi tenir la charge (des centaines de devs qui soumettent du code en même temps), logger ce qui se passe pour debug en prod, et persister les analyses pour historique.

C'est le projet le plus exigeant parce qu'il croise 7 modules, dont certains qui ont rien à voir entre eux sur le papier (OOP et observability, par exemple) mais qui doivent cohabiter dans le même système, comme dans un vrai job.

---

## CE QUE TU DOIS LIVRER

```
src/
├── core/
│  ├── CodeAnalyzer.js     classe OOP, responsabilité unique : analyser
│  ├── PromptBuilder.js    construit le prompt envoyé à l'Oracle
│  └── OutputValidator.js   valide ce que l'Oracle retourne
├── validators/
│  ├── Validator.js       classe de base
│  ├── StrictValidator.js    extends Validator
│  └── LLMOutputValidator.js  extends StrictValidator
├── db/
│  └── analysisStore.js    persistance des analyses
├── observability/
│  ├── logger.js        logging structuré avec correlation ID
│  └── metrics.js        compteurs et alerting basique
└── edgeCases/
  └── knownTraps.js      les pièges JS volontairement injectés en test

tests/
└── pipeline.test.js
```

---

## CONTRAINTES TECHNIQUES PRÉCISES

**Du module 18 (oop js) :**
La chaîne `Validator -> StrictValidator -> LLMOutputValidator` doit être une vraie chaîne de prototypes utilisée intentionnellement, pas juste des classes qui font semblant d'hériter. `LLMOutputValidator` doit pouvoir appeler `super()` pour réutiliser la logique de `StrictValidator`, qui elle-même réutilise celle de `Validator`.
Utilise au moins un mixin pour composer un comportement transversal (par exemple, la capacité de logger chaque validation) sans le dupliquer dans les 3 classes.

**Du module 23 (ai native dev) :**
Le streaming de la réponse de l'Oracle doit être géré token par token, pas attendre la réponse complète avant de traiter quoi que ce soit. `PromptBuilder` doit construire des prompts qui réduisent activement le risque d'hallucination (contexte précis, format de sortie imposé), pas juste balancer la question brute.
`OutputValidator` doit utiliser un schéma de validation strict (type Zod ou équivalent) : si la sortie de l'Oracle matche pas le schéma attendu, elle est rejetée avant même d'arriver au reste du système.

**Du module 28 (edge cases) :**
`knownTraps.js` doit injecter au minimum 4 pièges réels dans les tests : un cas où l'Oracle retourne un JSON tronqué en plein milieu, un cas où une métrique calculée par l'Oracle contient `NaN`, un cas de timeout après 3 secondes, un cas où l'Oracle prétend qu'une comparaison flottante (`0.1 + 0.2 === 0.3`) est vraie alors qu'elle l'est pas.
Le système doit catcher ces 4 cas et réagir, pas crasher ni laisser passer une donnée corrompue.

**Du module 24 (databases) :**
Chaque analyse validée doit être persistée avec, au minimum, le code original, le résultat de l'Oracle, le verdict du validator, et un timestamp. Réfléchis à l'indexation : si plus tard on veut chercher "toutes les analyses où l'Oracle a halluciné", quelle structure d'index permettrait cette recherche sans scanner toute la table.

**Du module 25 (scalability) et 26 (observability), ensemble :**
Simule une charge de 50 analyses simultanées (pas séquentielles, vraiment en parallèle) et vérifie que le système applique un rate limiting cohérent pour pas saturer l'appel à l'Oracle. Chaque analyse doit avoir un correlation ID unique tracé dans les logs, du moment où la requête arrive jusqu'au moment où le résultat est persisté, pour pouvoir suivre une requête précise dans les logs même au milieu de 50 autres en parallèle.

**Du module 27 (team craft) :**
Rédige un `ADR/001-validation-strategy.md` qui documente pourquoi t'as choisi une validation stricte par schéma plutôt que de faire confiance à l'Oracle avec une simple vérification de type basique. Le format ADR (Architecture Decision Record) doit suivre la structure standard : contexte, décision, conséquences.

---

## CE QUI SE PASSE SI TU ZAPPES UNE CONTRAINTE

Si `OutputValidator` fait une vérification de type basique au lieu d'un schéma strict : l'Oracle va un jour retourner un JSON qui a la bonne forme générale mais un champ critique manquant, ton système va planter en prod sur un cas que t'avais jamais testé, et personne va comprendre pourquoi parce que "le JSON avait l'air bon".

Si t'as pas de correlation ID tracé de bout en bout : le jour où 1 analyse sur 50 plante en prod, tu vas chercher dans des logs qui mélangent tout, sans pouvoir isoler quelle requête précise a foiré.

---

## CHECKLIST AVANT DE VALIDER

```
[ ] La chaîne de prototypes Validator -> StrictValidator -> LLMOutputValidator fonctionne avec super()
[ ] Au moins un mixin compose un comportement transversal sans duplication
[ ] Le streaming token par token est implémenté, pas une attente de réponse complète
[ ] Un schéma de validation strict rejette toute sortie Oracle non conforme
[ ] Les 4 pièges edge case sont testés et catchés sans crash
[ ] Chaque analyse persistée a code original + résultat + verdict + timestamp
[ ] 50 analyses simultanées sont rate limitées correctement
[ ] Un correlation ID unique trace chaque requête de bout en bout dans les logs
[ ] ADR/001-validation-strategy.md existe et suit le format standard
```

Si tu termines cette synthèse proprement : t'as plus un curriculum dans la tête, t'as un cerveau d'ingénieur qui sait croiser des préoccupations qui semblaient pas liées au départ. C'est exactement ça, le métier.

---

> **Rappel `DEPENDENCY_LEDGER`** : avant de clore ce bloc, ouvre `DEPENDENCY_LEDGER.md` à la racine et ajoute une ligne par outil IA utilisé (quoi, quand, pourquoi, combien de temps gagné/perdu). Silence = drift.
