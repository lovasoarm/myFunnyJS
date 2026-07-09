---
stability: intemporel
---

# ADR-001 : validation stricte par schéma Zod et règles métier pour contrôler la sortie d'un LLM
Temps de lecture ~6 min

## Statut

Accepté : 2026-01

## Contexte

Oracle Glitch est le seul projet du portfolio qui appelle réellement l'Anthropic API (`claude-haiku-4-5-20251001`) en streaming token-par-token. L'IA analyse un fichier JavaScript cible et renvoie une structure JSON contenant des `bugs`, des `fixes` et des `tests` générés. Le problème : un LLM est par nature non-déterministe et peut produire des sorties incorrectes de plusieurs façons indépendantes :

- JSON malformé ou tronqué en cours de stream (timeout, coupure réseau, modèle qui s'arrête)
- Shape valide mais champs absents ou mal typés (`severite: "CATASTROPHIQUE"` au lieu de l'enum autorisé)
- Shape valide, champs corrects, mais contenu sémantiquement faux (`if (x === NaN)` proposé comme fix, alors que `NaN === NaN` est `false` en JavaScript)
- Appel à des fonctions qui n'existent pas (`validateNaN(x)`, `checkIsNumber(y)`) inventées par l'IA

Trois approches étaient envisageables pour gérer ces cas :

1. **Confiance aveugle** : parser le JSON et utiliser la sortie telle quelle, en laissant l'utilisateur juger
2. **Validation de shape uniquement** : valider la structure avec Zod et accepter tout ce qui passe le schéma
3. **Pipeline de validation en couches** : schéma Zod + règles métier spécifiques aux erreurs connues des LLM, avec rejet explicite des fixes "non-vérifiables"

## Décision

Adoption d'un **pipeline de validation à trois étages** où chaque étage est une classe distincte qui hérite ou étend la précédente, et où le contrat (schéma) est défini AVANT toute implémentation du client streaming.

L'ordre de construction est imposé : `analysisSchema.js` → `LLMOutputValidator.js` → `streamingClient.js`, jamais l'inverse. Le schéma est la source de vérité, le validator s'appuie dessus, le client streaming se conforme au contrat validé.

Architecture des validators :

```
Validator (interface de base)
  └── StrictValidator (règles restrictives génériques)
     └── LLMOutputValidator (règles spécifiques aux erreurs IA connues)
```

Règles concrètes implémentées dans `LLMOutputValidator` :
- Shape Zod : `bugs[]`, `fixes[]`, `tests[]` avec types et enums stricts
- Pattern d'erreur IA : détection des `x === NaN` dans `codeFix` → rejet
- Fonctions inexistantes : si `codeFix` contient un appel non-standard (`validateNaN`, `checkIsNumber`), le fix est marqué `non-vérifiable` au lieu d'être retenu
- JSON tronqué : si le stream se termine avant la fermeture du dernier `}`, levée de `MalformedResponseError`

Timeout du streaming séparé en deux niveaux :
- **5s** pour le time-to-first-token (l'IA ne démarre pas)
- **2s** entre chaque token suivant (l'IA s'est arrêtée en plein milieu)

Aucun test n'appelle l'API réelle : `streamingClient` est mocké via Jest. Chaque `npm test` coûte 0 token.

## Conséquences

Positives :
- Le pipeline détecte trois classes d'erreurs distinctes (shape, contenu, sémantique) qu'un simple `JSON.parse` + Zod laisserait passer
- L'héritage `Validator → StrictValidator → LLMOutputValidator` permet d'ajouter une nouvelle règle (ex: nouveau pattern d'erreur IA observé en prod) sans toucher aux classes parentes : ouvert à l'extension, fermé à la modification
- Les tests sont rapides et gratuits (0 appel API), ce qui permet de tester 60+ cas d'edge cases sans coût
- Le timeout en deux niveaux distingue "ça ne démarre pas" de "ça s'est coupé", ce qui donne des messages d'erreur exploitables
- Le contrat défini en premier (schéma Zod) sert de documentation vivante de ce qu'on attend de l'IA

Négatives :
- Le validator rejette parfois des fixes corrects parce qu'il ne reconnaît pas la fonction utilisée (faux positif sur "non-vérifiable") : compromis assumé, on préfère sous-utiliser un fix douteux que d'en appliquer un faux
- La maintenance des patterns d'erreur IA dans `LLMOutputValidator` est manuelle : chaque nouvelle hallucination observée en prod doit être ajoutée comme règle
- Pas de boucle de feedback automatique vers le modèle : si l'IA renvoie 3 fois un JSON malformé, on échoue au lieu de relancer avec un prompt corrigé (hors périmètre, retry intelligent prévu en V2)
- Le mock Jest de `streamingClient` ne couvre pas les bugs réseau réels : les vrais incidents de stream coupé n'apparaissent qu'en exécution réelle avec la clé API

Décisions liées :
- ADR-002 portera sur la stratégie de retry : faut-il relancer automatiquement un appel API quand le JSON est malformé, ou laisser l'utilisateur relancer manuellement (coût vs UX)
- ADR-003 portera sur le logging des sorties IA rejetées : faut-il les archiver pour entraîner un classifieur local de qualité, ou les jeter par souci de confidentialité du code analysé
