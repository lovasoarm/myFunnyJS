---
stability: intemporel
---

# SPRINT HELL : QUAND PERSONNE NE SAIT CE QU'IL FAUT VRAIMENT LIVRER
Temps de lecture ~11 min

Tu sais coder. Tu sais lire un ticket clair. Mais un sprint réel, ce n'est jamais un ticket clair. C'est trois personnes qui veulent trois choses différentes, un manager qui change de priorité le mardi, et un planning qui était déjà serré avant que tout ça commence.

Ce module ne t'apprend pas une technique. Il te met dans le sprint, avec les mêmes contradictions qu'un vrai. Pas pour te stresser : pour que la première fois que ça t'arrive en entreprise, ce ne soit pas la première fois.

Pourquoi ça compte : la compétence technique pure plafonne vite en valeur si tu ne sais pas naviguer l'ambiguïté humaine autour. Un junior qui code bien mais qui fige devant une spec floue reste junior plus longtemps qu'un junior qui sait poser les bonnes questions et avancer quand même.

---

## 1) LE PROTOCOLE : 5H, SEUL, SANS AIDE EXTÉRIEURE

```
Préparation   --> 10 min  : lire tout le brief une fois, sans coder
Sprint actif  --> 4h30   : chronométré, interruptions incluses
Debrief     --> 20 min  : remplir le compte rendu de fin
```

Règles strictes pour que la simulation ait une vraie valeur :

```
pas d'IA pour décider des priorités    --> l'IA peut coder, jamais arbitrer
pas de relecture du brief après le départ --> comme un vrai sprint, l'info arrive en cours de route
chronomètre visible en permanence     --> la pression temporelle fait partie de l'exercice
log de chaque décision prise, à chaud   --> tu écris CE QUE tu décides ET pourquoi, sur le moment
```

Le log de décisions est la partie la plus négligée et la plus utile. Un dev qui code vite sans noter pourquoi il a tranché entre deux options contradictoires ne pourra jamais défendre ce choix en daily, ni s'en souvenir au retro.

---

## 2) LE BRIEF : TROIS SOURCES, TROIS VERSIONS DIFFÉRENTES

Tu reçois trois messages au lancement du sprint, comme s'ils venaient de trois personnes différentes de l'équipe. Ils ne se contredisent pas frontalement : c'est pire, ils se chevauchent juste assez pour créer une fausse impression d'alignement.

**Message du Product Owner (reçu à 0h00) :**

> Pour vendredi on a besoin du tableau de classement en direct pour le vote du Ballon d'Or. Priorité absolue : ça doit être visible sur grand écran pendant l'événement, donc lisible de loin. Le reste peut attendre la semaine prochaine.

**Message du Lead Tech (reçu à 0h00, sur un autre canal) :**

> Avant de toucher au classement : le système de vote actuel a un bug de double comptage qu'on traîne depuis 3 semaines. Tant que c'est pas corrigé, n'importe quel tableau qu'on affiche est faux. Ça doit passer avant tout le reste.

**Message d'un coéquipier (reçu à 1h15, en cours de sprint) :**

> Au fait, le client a confirmé ce matin : il veut aussi un export CSV des votes pour son audit comptable. Il en a besoin pour vendredi aussi. Désolé, ça vient de tomber, je sais que c'est pas le bon moment.

Personne ne ment. Personne n'est de mauvaise foi. Mais les trois "priorité absolue pour vendredi" ne peuvent pas toutes être vraies en même temps dans le temps qu'il te reste.

---

## 3) CE QUE LA SIMULATION TESTE VRAIMENT

Pas ta vitesse de code. Ces quatre réflexes :

**Détecter le conflit avant de coder, pas après**

Le piège classique : commencer à coder le tableau de classement (le message le plus "excitant" techniquement) avant de réaliser que livrer un classement basé sur un système de vote buggé est pire que ne rien livrer du tout.

**Distinguer urgence annoncée et urgence réelle**

Trois personnes disent "priorité absolue". Une seule a raison sur le plan technique : un classement faux affiché publiquement pendant un événement médiatisé est un risque de réputation plus grave qu'un export CSV en retard d'une semaine.

**Remonter le conflit au lieu de le trancher seul dans le silence**

```
mauvais réflexe : choisir en silence, espérer que ça passe
bon réflexe   : message court et factuel à TOUTE l'équipe, pas juste à une personne

"Je vois 3 demandes prioritaires qui ne tiennent pas ensemble dans le temps dispo.
Je pars sur : fix du bug de vote d'abord (bloquant pour tout le reste),
puis classement si le temps le permet. Export CSV reporté sauf contre-ordre.
Dites-moi si je me trompe de lecture."
```

Ce message ne demande pas la permission de chacun un par un. Il annonce une décision argumentée, avec une porte de sortie si quelqu'un a une info que tu n'as pas.

**Documenter, pas juste exécuter**

Le compte rendu de fin de sprint (section 5) n'est pas une formalité administrative. C'est la preuve, après coup, que ta décision avait une logique, pas juste une intuition du moment.

---

## 4) LE TICKET MAL FICELÉ : RECONNAÎTRE LE SYMPTÔME

Au-delà du conflit entre trois sources, il y a un deuxième piège dans le brief lui-même : des formulations qui semblent actionnables mais ne le sont pas.

```
"ça doit être visible sur grand écran, donc lisible de loin"

problème : aucun critère mesurable
 - quelle taille de police minimum ?
 - quelle distance de lecture cible ?
 - quel contraste minimum ?

sans clarification : tu codes une interprétation, le PO en avait une autre
résultat probable : retour en arrière vendredi, sous pression, pas le temps de refaire
```

La compétence ici n'est pas "deviner ce que le PO voulait vraiment". C'est savoir transformer une phrase floue en une ou deux questions précises, posées une seule fois, groupées, plutôt que de revenir cinq fois avec cinq micro-questions qui fatiguent tout le monde.

```
mauvais : 5 questions séparées sur 5 messages, sur 2 heures
bon   : 1 message groupé, envoyé une fois, qui débloque tout d'un coup

"Pour le classement grand écran : je pars sur police 48px minimum
et contraste fond noir / texte blanc, sauf si t'as une maquette précise.
Je code avec ça par défaut si pas de retour avant 14h."
```

Note la dernière phrase : un deadline implicite de décision, pas une attente passive. C'est ce qui évite qu'une question bloque tout le sprint en attendant une réponse qui ne vient jamais.

---

## 5) COMPTE RENDU DE FIN DE SPRINT (À REMPLIR APRÈS LES 5H)

```
Décision prise sur le conflit des 3 priorités :


Pourquoi cette décision plutôt qu'une autre :


Ce qui a été livré, concrètement :


Ce qui a été volontairement reporté :


Message envoyé à l'équipe (copie exacte) :


Si un retour était arrivé en sens contraire à 14h : qu'est-ce qui aurait changé :


Sur une échelle de "j'ai subi le chaos" à "j'ai piloté le chaos" : où tu te places, honnêtement :
```

La dernière question compte plus que les autres. La première fois, "subir le chaos" est normal. Le but du drill n'est pas zéro chaos : ce n'est pas réaliste. Le but est de réduire, sprint après sprint, la part de subi face à la part de piloté.

---

## 6) QUAND ÇA CASSE : LE CAS DU SPRINT QUI EXPLOSE EN VRAI

```
8h00  PO confirme priorité classement, brief clair, sprint démarre serein
9h45  Lead Tech signale le bug de vote, urgence non négociable selon lui
11h20 coéquipier ajoute la demande CSV, "désolé c'est tombé ce matin"
13h00 decision prise, message envoyé, fix du bug en cours
14h30 pas de retour de l'équipe : tu continues sur ta lecture initiale
16h00 fix du bug terminé et testé, début du classement
17h30 fin du sprint, classement partiel livré, CSV reporté, fix livré
```

Ce déroulé n'est pas un échec. Trois choses sur quatre demandées initialement ne sont pas dans l'état rêvé par chacune des trois sources. Mais la décision a été prise vite, argumentée, communiquée, et documentée. C'est ça, la compétence testée : pas livrer tout, livrer le bon arbitrage sous contrainte réelle.

---

## EXERCICES

## EXO 1 : LANCE LE SPRINT

Mets en place le chronomètre, ouvre les trois messages de la section 2 sans les relire à l'avance, et lance les 4h30. Code ce que tu juges nécessaire pour appuyer ta décision (le fix du bug de vote peut être simulé en pseudo-code si tu n'as pas le vrai système sous la main, l'important est la décision, pas l'implémentation parfaite).

## EXO 2 : LE SPRINT À DEUX VOIX (si tu as un binôme de pratique)

Refais le drill, mais cette fois un partenaire joue le rôle des trois sources en direct, avec le droit d'ajouter une quatrième complication à n'importe quel moment des 4h30, sans prévenir. Observe comment ta décision initiale tient (ou pas) face à une information totalement nouvelle arrivée tard.

---

## UNE AUTRE FAÇON DE VOIR LA MÊME PRESSION

Une CAN (Coupe d'Afrique des Nations) se joue souvent dans des conditions que personne ne contrôle entièrement : terrain difficile, calendrier resserré entre les matchs, un sélectionneur qui doit composer avec des joueurs revenus tard de leur club européen. Le sélectionneur qui réussit n'est pas celui qui attend la situation parfaite. C'est celui qui prend une décision claire avec les informations qu'il a à l'instant T, l'assume publiquement devant le groupe, et l'ajuste si une info change avant le coup d'envoi. Un sprint chaotique se pilote pareil : pas en cherchant la clarté parfaite, en décidant vite avec ce qu'on a, et en restant capable de l'expliquer après coup.

---

## RÉSUMÉ

Un sprint réel n'arrive jamais avec une seule source de vérité claire : plusieurs personnes annoncent chacune leur urgence, sincèrement, sans se concerter. La compétence n'est pas de deviner la bonne réponse, c'est de détecter le conflit avant de coder, distinguer urgence annoncée et urgence réelle, remonter la décision avec un message factuel plutôt que de trancher en silence, et documenter le raisonnement pour pouvoir le défendre après coup. Un ticket flou se débloque avec une question groupée et un deadline de décision implicite, pas avec cinq allers-retours épuisants. Livrer un arbitrage clair sous contrainte vaut mieux que de viser une livraison parfaite impossible dans le temps donné.
