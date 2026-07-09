---
stability: intemporel
---

# ADR-001 : EventEmitter natif Node.js pour simuler le streaming SSE sans serveur HTTP
Temps de lecture ~5 min

## Statut
Accepté : 2026-01

## Contexte
La Chronique des Chevaliers nécessite un mécanisme de streaming : quand Leon combat un Horror, le Conseil de Surveillance doit recevoir les événements du combat en temps réel (armure engagée, dégâts infligés, Horror éliminé ou armure effondrée). En production, ce canal serait un flux SSE (Server-Sent Events) sur HTTP. Mais le périmètre de ce projet est pédagogique : les modules couverts sont `03_async`, `05_error_handling`, `20_realtime`, `16_architecture_patterns`. L'objectif est de comprendre le pattern event-driven et les Promises, pas de configurer un serveur HTTP.

Deux options se présentent : ouvrir un vrai serveur Express avec des endpoints SSE, ou simuler ce comportement avec `EventEmitter` natif de Node.js.

## Décision
On utilise `EventEmitter` natif Node.js pour simuler le canal de streaming entre les Chevaliers et le Conseil. Pas de serveur HTTP, pas de port ouvert. Le Conseil s'abonne aux événements via `.on('combat:update', handler)`, le Chevalier émet via `.emit('combat:update', payload)`.

```
Chevalier          EventEmitter (canal)      Conseil
---------          ----------------        -------
armure.engager()  --> emit('armure:active', { id, ms }) --> .on() handler
combat.attaquer() --> emit('combat:dégâts', { hp, ms }) --> .on() handler
horror.éliminé()  --> emit('mission:succès', { log })  --> .on() handler
armure > 99.9s   --> emit('armure:collapse', { err }) --> .on() handler (ERROR)
```

`Promise.race` gère la limite des 99,9 secondes : la Promise du combat et un timer de 99 900ms s'affrontent, la première qui résout gagne.

## Alternatives considérées

**Serveur Express avec vrais endpoints SSE**
- Avantages : exactement ce qu'on ferait en prod, l'apprenant voit une vraie requête HTTP avec les headers `Content-Type: text/event-stream`
- Limites : ajoute Express comme dépendance, nécessite de gérer un port, le démarrage devient `node src/server.js` avec un curl séparé pour observer : la complexité réseau masque la complexité async qu'on veut enseigner
- Rejeté parce que : le module `20_realtime` couvrira le vrai SSE HTTP en détail ; ici l'objectif est de maîtriser async/await + error propagation + event-driven, pas la couche réseau

**Callbacks directs entre modules**
- Avantages : le plus simple : le dispatcher appelle directement `conseil.onCombatUpdate(data)`
- Limites : couplage fort entre le Chevalier et le Conseil : le Chevalier doit connaître le Conseil pour lui parler, l'architecture event-driven (découplage producteur/consommateur) disparaît
- Rejeté parce que : la leçon architecturale de ce projet est précisément l'inversion de dépendance via les événements : le Chevalier ne sait pas qui écoute, il émet et c'est tout

## Conséquences

Gains :
- zéro dépendance réseau : `npm install` + `node src/index.js` suffisent pour voir tourner toute la démo
- l'architecture event-driven est lisible dans le code sans bruit réseau autour
- `EventEmitter` est natif : pas de bibliothèque, pas de version à gérer, les concepts se transfèrent directement vers WebSocket et SSE dans le module `20_realtime`

Sacrifices :
- l'apprenant ne voit pas les vrais headers SSE (`data:`, `event:`, `id:`) : il devra faire le lien mental quand il arrivera au module 19
- la simulation via `EventEmitter` ne gère pas la reconnexion automatique ni le `Last-Event-ID` : ce sont des comportements SSE réels absents ici par design

Décisions liées :
- ADR-002 portera sur la stratégie de propagation des erreurs : `HorrorEscapeError`, `ArmorCollapseError`, `KnightDownError` : fail-fast sur les missions critiques, fallback sur les secondaires
