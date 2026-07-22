---
perennite: perissable
stability: moderne
duree_de_vie_estimee: 3-5 ans
raison: WebSocket, SSE, WebRTC : APIs stables mais l'écosystème bouge.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : async (03_async), event loop et backpressure (03_async/06), réseau (17_web_concepts). Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI CE MODULE MÉRITE TON TEMPS : REAL-TIME

> **Durée de vie : 2-3 ans, revenir en 2028.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Temps de lecture ~8 min

Un chat où il faut rafraîchir la page pour voir les nouveaux messages. Un dashboard de match qui affiche le score d'il y a 5 minutes. Une app de notifications qui ne notifie jamais en direct. Ce sont des systèmes cassés aux yeux d'un utilisateur de 2026, habitué à voir les choses apparaître instantanément.

Le HTTP classique (requête, réponse, fin) ne suffit plus pour ça. Le temps réel demande un autre modèle de communication, et si tu ne le maîtrises pas, ton système a l'air d'avoir 10 ans de retard. C'est exactement le terrain du mini-projet `02_garo_no_kronika` : un Chevalier Garo qui reçoit son alerte de combat avec 5 secondes de retard, c'est un Horror qui a déjà fait des dégâts avant même que la mission soit dispatchée.

---

## PRÉREQUIS

Ce module suppose que tu maîtrises :
- tout `03_async` : complet, event loop incluse
- HTTP, headers, stateless : voir `17_web_concepts/01_http_rest_basics.md`

Si ces bases ne sont pas là : reviens ici après.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Le modèle HTTP classique fonctionne en requête-réponse : le client demande, le serveur répond, la connexion se ferme. Pour savoir si quelque chose a changé, le client doit redemander, encore et encore (polling : interroger le serveur à intervalle régulier), ce qui gaspille de la bande passante et introduit toujours un délai entre le moment où l'événement arrive et le moment où le client le voit.

Le temps réel résout ce problème avec des mécanismes pensés pour le push (le serveur pousse l'info vers le client dès qu'elle existe, sans attendre une nouvelle requête) :
- les WebSockets pour une communication bidirectionnelle persistante
- les SSE (Server-Sent Events : événements envoyés par le serveur) pour un flux unidirectionnel simple du serveur vers le client
- WebRTC pour une communication peer-to-peer directe entre deux navigateurs (vidéo, audio, partage de données sans passer par un serveur intermédiaire pour chaque paquet)

Chaque mécanisme répond à un besoin précis : WebSocket quand tu as besoin d'échanger dans les deux sens (chat), SSE quand tu as juste besoin de recevoir des mises à jour du serveur (flux d'actualité, score live), WebRTC quand tu as besoin d'une communication directe à faible latence entre deux utilisateurs (appel vidéo).

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui ne connaît que HTTP classique implémente le temps réel avec du polling agressif : interroger le serveur toutes les 2 secondes pour voir s'il y a du nouveau. Ça marche, mais ça gaspille des ressources serveur énormes (chaque utilisateur génère des requêtes en continu, même quand rien ne change), et ça introduit toujours un délai perceptible entre l'événement réel et son affichage.

Sur un système avec beaucoup de utilisateurs connectés simultanément, l'absence de maîtrise du temps réel se traduit directement par des coûts d'infrastructure qui explosent (toutes ces requêtes de polling inutiles consomment du CPU et de la bande passante) et une expérience utilisateur qui semble en retard par rapport à des concurrents qui maîtrisent ces mécanismes.

Et sur des cas critiques comme un chat ou un système d'alerte, ne pas gérer correctement la reconnexion automatique (quand la connexion WebSocket ou SSE tombe, par exemple sur un changement de réseau) veut dire que l'utilisateur perd silencieusement des messages ou des événements, sans même savoir que sa connexion a été coupée.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
chat en direct, messagerie instantanée           --> WebSocket  --> communication bidirectionnelle persistante
flux d'actualité, score de match en direct         --> SSE     --> push unidirectionnel simple du serveur
appel vidéo, partage d'écran entre deux utilisateurs     --> WebRTC    --> peer-to-peer à faible latence
notification poussée en temps réel              --> WebSocket/SSE --> alerte instantanée sans polling
dashboard d'analytics avec données qui changent en continu  --> SSE     --> mise à jour live sans rechargement
```

Ces mécanismes apparaissent dans tout système qui a une dimension "live" : un système de trading qui affiche les prix en direct, un outil de collaboration où plusieurs utilisateurs voient les modifications des autres en temps réel, un système de monitoring qui alerte instantanément en cas de problème.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Les protocoles eux-mêmes (WebSocket, SSE, WebRTC) sont des standards web établis et stables. Ce qui évolue, c'est leur niveau d'adoption : ces mécanismes étaient autrefois réservés à des cas d'usage de niche (trading, jeux en ligne), et sont devenus des attentes standard pour une grande variété de systèmes grand public.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, le polling était la solution par défaut pour simuler du temps réel, malgré son inefficacité, parce que les alternatives (WebSocket en particulier) demandaient une infrastructure serveur plus complexe à mettre en place et à scaler. Aujourd'hui, le tooling autour de ces protocoles s'est largement simplifié, et l'infrastructure cloud moderne facilite la gestion de connexions persistantes à grande échelle.

Les attentes des utilisateurs ont aussi évolué : un délai de quelques secondes pour voir une mise à jour, acceptable il y a dix ans, est aujourd'hui perçu comme un système cassé ou mal fini, parce que les standards de référence (réseaux sociaux, outils de collaboration) ont habitué les utilisateurs à de l'instantané.

---

## 6) NOYAU DUR DU MÉTIER ?

Prérequis explicite : `20_realtime`, prérequis `03_async` complet + `17_web_concepts`. Tu ne peux pas comprendre la gestion des connexions persistantes et des événements en flux sans déjà maîtriser l'event loop et les bases du protocole HTTP. Le mini-projet `02_garo_no_kronika` combine directement `03_async`, `05_error_handling`, `20_realtime`, et `16_architecture_patterns` pour construire un système de dispatch d'alertes en temps réel avec gestion de timeout strict.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

L'attente des utilisateurs pour de l'instantané ne va pas diminuer, elle va continuer d'augmenter. Les protocoles sous-jacents (WebSocket, SSE, WebRTC) sont des standards web matures qui ne vont pas être remplacés du jour au lendemain. Maîtriser ces mécanismes reste une compétence différenciante, parce que beaucoup de devs restent confortables avec le modèle requête-réponse classique et n'ont jamais eu besoin (ou pris le temps) d'aller plus loin.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

Le modèle HTTP classique ne suffit plus dès qu'une fonctionnalité doit sembler "vivant" et instantané. Ça casse de deux façons sans ces mécanismes : du polling coûteux et toujours en retard, ou une reconnexion mal gérée qui perd des événements silencieusement. L'attente d'instantané des utilisateurs ne fait qu'augmenter, jamais l'inverse.

Maintenant, ouvre `01_ws_basics.md`. Et arrête de faire semblant d'être en direct avec du polling.

> Ce module réutilise : l'event loop du module 03 (`03_async`), les web concepts du module 17 (`17_web_concepts`).
