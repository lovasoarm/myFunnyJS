[← Sommaire TECH-ILA](../README.md)

# Niveau 6 : IA et développement moderne (section 9)

---

## 9 : Niveau 6 : IA et développement moderne

**Tag : NOYAU DURABLE** (la méthode de vérification) / **PÉRISSABLE** (les outils, les modèles, les prompts)

Prérequis MyFunnyJS : modules `23_ai_native_dev/` et `29_ai_agents_and_autonomy/` complets. Ce document ne les répète pas : il les applique aux technologies.

### 9.1 : Ce qui change vraiment dans le métier

L'IA a rendu la production de code plausible quasi gratuite. Elle n'a rien changé au coût de :

- comprendre un problème mal formulé ;
- décider entre trois solutions valides ;
- vivre avec la décision six mois plus tard ;
- réparer à 3h du matin ;
- en assumer la responsabilité.

La valeur s'est déplacée de "écrire du code" vers "**savoir si ce code est le bon**".

### 9.2 : Le cadre, à appliquer sur chaque techno de ce document

```text
CE QUE L'IA PEUT ACCÉLÉRER
   boilerplate, conversion de formats, première ébauche de tests,
   exploration d'une API inconnue, traduction entre écosystèmes,
   explication d'un code legacy, génération de données de test

CE QU'ELLE NE PEUT PAS DÉCIDER À TA PLACE
   la pertinence du problème, le compromis retenu, le modèle de données,
   le niveau de cohérence acceptable, le contexte métier absent du prompt,
   la responsabilité de ce qui est livré

LA PREUVE À OBTENIR AVANT DE FAIRE CONFIANCE
   un test qui échoue avant le correctif et passe après ;
   une mesure avant/après ;
   la doc officielle de l'API citée ;
   la vérification que la dépendance existe et est maintenue ;
   la lecture du chemin d'erreur, pas seulement du chemin heureux
```

### 9.3 : Les défaillances typiques, par technologie

| Techno | Ce que l'IA produit de plausible et faux                                               |
| ------ | -------------------------------------------------------------------------------------- |
| React  | `useEffect` avec dépendances inventées, cleanup manquant, race condition non gérée     |
| Node   | code qui charge tout en mémoire, pas de backpressure, pas d'arrêt gracieux             |
| SQL    | requêtes correctes mais sans index, migrations bloquantes, N+1 invisible               |
| NestJS | modules mal câblés, guard placé après le pipe, provider singleton avec état de requête |
| Auth   | JWT sans expiration raisonnable, autorisation par rôle sans vérification de propriété  |
| Docker | image root, secret dans une couche, pas de healthcheck                                 |
| Files  | handler non idempotent, retry infini, pas de dead-letter                               |
| Python | dépendances qui n'existent pas ou versions incompatibles                               |
| Spring | annotations d'une version antérieure du framework, mélangées à une plus récente        |

Le point commun : **le chemin heureux est correct**. Ce sont les cas d'échec, la concurrence et l'exploitation qui manquent. Exactement le contenu des modules `05`, `26`, `28`.

### 9.4 : Le protocole de vérification en 5 gestes

1. **Reformule la demande** avant de prompter. Si tu ne peux pas l'écrire en trois phrases, l'IA ne le pourra pas non plus.
2. **Exige un critère de réussite binaire.** Une commande, une sortie attendue. C'est la discipline des `EXO_JEUNE_IA` de MyFunnyJS.
3. **Vérifie les frontières** : la doc de l'API existe-t-elle vraiment ? Le paquet est-il maintenu ? La signature est-elle celle de la version que tu utilises ?
4. **Lis le chemin d'erreur.** L'IA écrit rarement de bons cas d'échec.
5. **Demande la faille.** "Sous quelle condition ce code casse-t-il ?" Une bonne réponse en cite trois. Une mauvaise dit "ce code est robuste".

### 9.5 : Agents et autonomie

Un agent enchaîne des actions sans validation à chaque étape. Ce qui compte alors :

- **Spécification vérifiable** avant lancement (`29_ai_agents_and_autonomy/02_verifiable_specifications.md`) : sans critère d'arrêt, un agent optimise le plausible.
- **Lecture de trace** : savoir où il a dévié, pas seulement s'il a réussi.
- **Refus de trace** : savoir dire "cette exécution est invalide même si le résultat semble bon".
- **Hygiène de bac à sable** : périmètre, secrets, effets irréversibles. Un agent avec accès en écriture à la prod est un incident en attente.

**Ce qui restera valable dans 10 ans.** La démarche : spécifier, exécuter, vérifier par une preuve, assumer. **Ce qui bougera** : les modèles, les outils, les techniques de prompt, les protocoles d'agents. Ne mémorise aucun prompt.

### 9.6 : La position honnête

L'IA n'est ni un ennemi ni une baguette magique. Elle est un accélérateur avec un angle mort massif : elle produit du **plausible**, pas du **vrai**. Un développeur qui ne sait pas faire la différence produit plus vite des problèmes plus coûteux.

**Résistance acquise.** Une réponse IA plausible ne suffit plus à te convaincre. Tu demandes une preuve : et tu sais laquelle demander selon la techno.

---
