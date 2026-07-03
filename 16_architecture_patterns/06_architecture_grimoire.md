#  Page verrouillée
Temps de lecture ~9 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

# GRIMOIRE D'ARCHITECTURE : LE LEXIQUE DU DEV QUI CONSTRUIT POUR DURER

---

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Module Pattern | Encapsuler (isoler) du code derrière une interface publique : l'intérieur est privé, seule la surface est accessible | `const mod = (() => { const _private = 1; return { get: () => _private }; })();` | Une capsule de médicament (l'actif est à l'intérieur, tu avales juste la gélule) / Les plans tatoués de Scofield (seul lui voit le détail complet) |
| MVC | Model-View-Controller : séparer les données (Model), l'affichage (View), et la logique de coordination (Controller) en trois couches distinctes | `Model.getUser() --> Controller --> View.render(data)` | Une cuisine de restaurant (Model = stock, Controller = chef, View = assiette servie) / Dragon Ball Z (données = power level, controller = Kaioken, vue = l'explosion) |
| Clean Architecture | Architecture où le domaine (la logique métier) est au centre et ne dépend de rien d'externe : bases de données, frameworks, APIs sont en périphérie | `Domain --> UseCase --> Interface --> Infra` | Le chakra d'un ninja (le domaine intérieur ne dépend pas des outils externes) / Un camp de Rick (les règles du camp ne changent pas selon qui apporte la nourriture) |
| Event-Driven | Architecture où les composants communiquent via des événements (events) émis et consommés : aucun composant n'appelle l'autre directement | `emitter.emit('user.created', data)` | Un stade de foot (le speaker annonce, les tribunes réagissent chacune à leur façon) / Garo (le signal Horror déclenche chaque Chevalier indépendamment) |
| Pub/Sub | Publisher/Subscriber : pattern où un publisher émet sur un channel sans connaître les subscribers : les subscribers choisissent leurs channels | `pubsub.publish('orders', data)` | Une radio FM (la station émet, tu choisis la fréquence) / Un chat de groupe (quelqu'un écrit, tous les membres reçoivent) |
| EventBus | Bus d'événements : objet central qui reçoit les events (émis) et les redistribue aux listeners (abonnés) enregistrés | `bus.on('evt', cb); bus.emit('evt', data)` | Le Wi-Fi du camp de Grimes (tous les survivants écoutent le même signal) / Une tour de contrôle aérien |
| Listener | Fonction abonnée à un event : elle s'exécute à chaque fois que l'event est émis | `bus.on('event', (data) => { ... })` | Un garde posté à un checkpoint (il attend, et réagit quand quelqu'un passe) / Un ultra dans le stade (il attend le but, puis il explose) |
| Microservices | Architecture où chaque domaine fonctionnel est un service indépendant avec son propre process, sa propre DB, et son propre déploiement | `OrderService / PaymentService / UserService` chacun sur son port | Fox River divisé en cellules indépendantes / Un groupe de Chevaliers de Garo : chacun autonome, chacun avec sa zone |
| Monolithe | Application où tout le code vit dans un seul process, une seule base de code, un seul déploiement : pas forcément mauvais si bien structuré | `app.use('/orders', ordersRouter)` (tout dans le même serveur) | Un immeuble entier sous un même toit / La ville de Konoha : tout dans les murs, une seule administration |
| API Gateway | Point d'entrée unique qui route les requêtes vers les bons services internes : gère l'auth, le logging, le rate-limiting | `GET /api/orders  -->  OrderService:3001` | Le réceptionniste de Prison Break (filtre qui entre, redirige vers la bonne aile) / Le capitaine qui reçoit les alertes et dispatche les Chevaliers |
| Service Discovery | Mécanisme qui permet aux services de se trouver dynamiquement : pas d'IP en dur (hard-coded), un registre central tient la liste | `registry.resolve('payment-service') --> http://10.0.0.5:3002` | L'annuaire du camp (tu cherches "médecin", tu trouves la tente 7) / Kōsenjō de Garo : chaque Chevalier s'enregistre et le Conseil sait où il est |
| Couplage | Dépendance entre deux composants : fort couplage = un changement dans A casse B ; faible couplage = A et B peuvent évoluer indépendamment | `A.method()` directement dans B = fort / EventBus entre A et B = faible | Des cellules de prison communicantes (fort) vs cellules isolées avec messagers (faible) / Passe en jeu direct (fort) vs jeu en triangle avec intermédiaire (faible) |
| Cohésion | Degré auquel les éléments d'un module font la même chose : forte cohésion = tout ce qui est dans le module travaille pour le même objectif | `UserService` qui gère auth + profil + préférences (fort) / UserService qui gère auth + stock (faible) | Un poste de garde (tout le monde surveille l'entrée) / Un cuisinier qui fait aussi la compta (faible cohésion) |
| Domain | Domaine métier (business domain) : le problème réel que le code résout : ordres_mission, tributs, shinobis | `// domain/order.js : ici la logique métier pure, pas les détails techniques` | La tactique de foot (domaine = football, pas la marque du ballon) / Le plan d'évasion (domaine = s'échapper, pas les outils utilisés) |
| Bounded Context | Limite (boundary) dans laquelle un concept a une définition précise : "User" en contexte tribut ≠ "User" en contexte analytics | `PaymentUser { iban, limit }` vs `AnalyticsUser { sessions, lastSeen }` | "Ninja" chez les Leaf = protecteur, chez l'ennemi = assassin : même mot, contexte différent / "Arrière" en foot ≠ "arrière" en basket : le poste dépend du contexte du sport |
| Message Queue | File de messages : un service publie un message, il est stocké en attente, un autre service le consomme plus tard | `queue.publish('evt', data); queue.consume('evt')` | Une boîte aux lettres (le facteur dépose, tu lis quand tu veux) / Les alertes Horror stockées jusqu'à ce qu'un Chevalier soit disponible |
| Distributed Monolith | Le pire des deux mondes : des services séparés qui s'appellent en synchrone en chaîne : la latence s'additionne, une panne propage partout | `A --> B --> C --> D` (si D plante, tout plante) | Fox River avec des ailes "indépendantes" mais reliées par un seul couloir central / Des ninjas en équipe mais un seul jutsu décisif pour tout le groupe |
| SLA | Service Level Agreement (niveau de service garanti) : engagement contractuel sur la disponibilité, la latence, le taux d'erreur d'un service | `// PaymentService SLA : 99.99% uptime, <100ms p99` | Le contrat du Chevalier de Garo (99.9 secondes max, sinon l'armure se désintègre) / Le gardien de but qui s'engage à intervenir sur chaque tir cadré |
| Latence | Temps écoulé entre l'émission d'une requête et la réception de la réponse : chaque hop (saut réseau) ajoute de la latence | `// En microservices : 5 services = 5 x latence réseau` | Le temps de course entre deux ailes du stade / Le temps de transmission d'un signal entre deux tours de guet |
| Fault Tolerance | Tolérance aux pannes : capacité d'un système à continuer de fonctionner partiellement même quand un composant tombe | `try { await serviceA() } catch { return fallbackResponse() }` | Rick Grimes sans Glenn : le camp continue, rôles redistribués / Une équipe de foot qui continue à jouer après l'expulsion d'un joueur |
| Circuit Breaker | Disjoncteur (circuit breaker) : mécanisme qui arrête d'appeler un service défaillant et retourne une réponse par défaut le temps qu'il récupère | `if (failures > threshold) { return cachedResponse; }` | Un fusible électrique (coupe avant que tout brûle) / Un entraîneur qui sort un joueur blessé avant qu'il aggrave sa blessure |
