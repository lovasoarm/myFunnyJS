---
perennite: intemporel
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Gérer l'échec est une posture d'ingénieur, pas une API.
---
> **Statut de pérennité :** **intemporel** | évolutif | périssable
> Statut effectif de ce module : **intemporel**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : try/catch (01_fundamentals), async & promises (03_async). Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI CE MODULE MÉRITE TON TEMPS : ERROR HANDLING

Temps de lecture ~5 min


> **Durée de vie : intemporel.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Ton code va planter. Pas "peut-être". Pas "si tu codes mal". Une API qui timeout, un input opérateur tordu, un fichier qui n'existe plus : ça arrive en prod, tous les jours, sur tous les systèmes. La vraie question n'est pas "comment éviter les erreurs", c'est "comment les voir venir, les contenir, et continuer à fonctionner".

Un dev qui ne gère pas ses erreurs ne code pas un système : il code une bombe à retardement.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Sans stratégie d'erreur, ton app a deux modes : "ça marche" et "tout explose". Une erreur dans une fonction profonde remonte (ou pas), crash le process Node entier, ou pire : passe silencieusement et corrompt une donnée plus loin sans que personne ne le sache avant que le client appelle le support.

L'error handling, c'est la discipline qui répond à trois questions précises à chaque ligne de code à risque : qu'est-ce qui peut foirer ici, qui doit le savoir, et que doit-il se passer ensuite.

Bien fait, l'error handling transforme un crash potentiel en message clair, en fallback (solution de repli) propre, ou en retry (nouvelle tentative) intelligent. L'opérateur ne voit jamais le chaos : il voit un système qui dégrade gracieusement.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui ne gère pas ses erreurs découvre les problèmes en prod, jamais avant. Une erreur async qu'on a oublié de catcher (capturer) tombe en silence : aucun log, aucun crash visible, juste une fonctionnalité qui s'arrête de marcher sans explication.

Sans erreurs custom (`CustomError`, `ValidationError`, etc.) qui racontent une histoire précise, chaque incident en prod devient une enquête. Les logs disent juste "Error: undefined is not a function" sans contexte, sans savoir quelle requête, quel opérateur, quelle donnée a déclenché le problème.

Le cas le plus brutal : une erreur non gérée dans un serveur Node peut crasher tout le process. Tous les opérateurs connectés sont déconnectés à cause d'un seul opérateur qui a envoyé une donnée inattendue.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
appel API externe       --> timeout/erreur réseau --> retry ou fallback
parsing de donnée opérateur --> format invalide    --> erreur custom claire
opération async oubliée    --> erreur silencieuse  --> bug fantôme en prod
chaîne de microservices    --> qui catch quoi    --> propagation contrôlée
opération critique vs secondaire --> fail-fast vs fallback --> stratégie adaptée
```

Chaque point d'entrée externe (API, fichier, input opérateur, base de données) est une source potentielle d'erreur. La question n'est jamais "est-ce que ça va planter" : c'est "quand, et qu'est-ce qu'on fait à ce moment-là".

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Intemporel dans le principe, en évolution dans la syntaxe. Le `try/catch` existe depuis longtemps et reste la base. Ce qui a changé, c'est la complexité des systèmes : avant, une erreur restait dans un script isolé. Aujourd'hui, une erreur traverse des microservices, des queues de messages, des appels async en cascade, et la discipline de propagation devient critique.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, gérer les erreurs voulait souvent dire vérifier un code de retour ou un premier argument de callback (`error-first callback` : convention où le premier paramètre d'un callback est réservé à l'erreur). Fonctionnel, mais un oubli passait inaperçu.

Avec les Promises et `async/await`, le `try/catch` est devenu central : une erreur async se catch comme une erreur synchrone. Mais ça a introduit un nouveau piège : les erreurs dans des Promises non attendues (sans `await`, sans `.catch()`) qui tombent en silence total si on n'ajoute pas un handler global (`unhandledRejection`).

La tendance actuelle va vers des erreurs typées et structurées : avec TypeScript, avec des classes d'erreur custom riches en contexte : parce qu'un message générique "Error" ne suffit plus dans un système distribué où il faut tracer une erreur à travers plusieurs services.

---

## 6) NOYAU DUR DU MÉTIER ?

Oui. Le curriculum le place explicitement dans le noyau dur : "sans ça, t'es imprudent". `05_error_handling` dépend de `01_fundamentals` et `03_async`, et c'est un prérequis direct pour `21_api_craft` et `22_security`. Un dev qui ne maîtrise pas ce module construit des APIs fragiles, des systèmes qui crashent en cascade, et des incidents de prod qui auraient pu être évités avec un `try/catch` bien placé.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Les systèmes deviennent de plus en plus distribués (microservices, queues, API tierces), donc le nombre de points de défaillance possibles augmente, pas l'inverse. La capacité à anticiper ce qui peut casser, à choisir la bonne stratégie (fail-fast quand c'est critique, fallback quand c'est tolérable, retry quand c'est transitoire), restera un signe distinctif entre un dev junior et un dev senior, peu importe le framework du moment.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

Une erreur non gérée n'est pas juste un bug : c'est un système qui ment sur son propre état. Ce module te donne la discipline pour l'anticiper, la contenir, et la communiquer clairement. Sans lui, tu découvres les problèmes quand l'opérateur te les signale. Avec lui, tu les vois venir.

> Dans ce module, tu vas croiser des stack traces (la pile d'appels affichée quand une erreur remonte) dans les exemples. T'as pas besoin de savoir la lire couramment pour avancer : le module suivant (`05_debugging`) t'apprend à la décortiquer ligne par ligne. Ici, contente-toi de repérer qu'elle existe et qu'elle raconte un chemin d'exécution.

Maintenant, ouvre `01_try_catch_basics.md`. Et apprends ce que `try/catch` attrape vraiment, et ce qu'il laisse filer.
