---
statut: revu
last_reviewed: 2026-08
proprietaire: mainteneur TECH-ILA
revue: trimestrielle
companion: MyFunnyJS
---

[← Sommaire TECH-ILA](../README.md)

> **Tu viens de** : [Niveau 5 : Transfert vers d'autres écosystèmes](./05-niveau-5-transfert.md)
> **Tu dois déjà savoir** : lire une codebase inconnue avec la grille des 9 questions, écrire un test qui prouve un correctif, distinguer ce qu'une techno masque de ce qu'elle résout.
> **Ensuite** : [Cartes MyFunnyJS ↔ technologies](./07-cartes-myfunnyjs.md)

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

**Outils nommés, pas seulement la section.** GitHub Copilot (**PÉRISSABLE**) : complétion en ligne, utile pour le boilerplate, aveugle au contexte métier. ChatGPT, Claude, Gemini (**PÉRISSABLE**) : chat conversationnel, plausible sur l'explication, dangereux sur l'affirmation non vérifiée. Agents de code autonomes type Claude Code, Cursor en mode agent, Devin (**PÉRISSABLE**) : enchaînent des actions, voir 9.5. Aucun de ces noms ne survivra tel quel dix ans ; le protocole de 9.4 leur survit.

<a id="sec-ia-cadre"></a>

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
   la vérification que la dépendance existe, est maintenue et sous quelle licence ;
   la lecture du chemin d'erreur, pas seulement du chemin heureux
```

### 9.3 : Les défaillances typiques, par technologie

| Techno | Ce que l'IA produit de plausible et faux                                               | Geste de vérification                                                                 |
| ------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| React  | `useEffect` avec dépendances inventées, cleanup manquant, race condition non gérée     | démonte le composant dans un test et vérifie qu'aucun `setState` ne survient après    |
| Node   | code qui charge tout en mémoire, pas de backpressure, pas d'arrêt gracieux             | rejoue le traitement sur un jeu de données 100 fois plus gros et observe le heap      |
| SQL    | requêtes correctes mais sans index, migrations bloquantes, N+1 invisible               | `EXPLAIN ANALYZE` sur la requête, compte les appels DB par requête HTTP               |
| NestJS | modules mal câblés, guard placé après le pipe, provider singleton avec état de requête | teste l'ordre d'exécution guard → pipe → handler avec une requête non authentifiée    |
| Auth   | JWT sans expiration raisonnable, autorisation par rôle sans vérification de propriété  | tente d'accéder à la ressource d'un autre utilisateur avec un jeton valide            |
| Docker | image root, secret dans une couche, pas de healthcheck                                 | `docker history` sur l'image et `whoami` dans le conteneur                            |
| Files  | handler non idempotent, retry infini, pas de dead-letter                               | envoie deux fois le même message et vérifie qu'un seul effet est produit              |
| Python | dépendances qui n'existent pas ou versions incompatibles                               | `pip install` à froid dans un environnement vierge, jamais dans le contexte du prompt |
| Spring | annotations d'une version antérieure du framework, mélangées à une plus récente        | démarre le conteneur Spring et lis l'erreur de câblage au boot, pas la doc de mémoire |

Le point commun : **le chemin heureux est correct**. Ce sont les cas d'échec, la concurrence et l'exploitation qui manquent. Exactement le contenu des modules `05`, `26`, `28`.

### 9.4 : Le protocole de vérification en 5 gestes

1. **Reformule la demande** avant de prompter. Si tu ne peux pas l'écrire en trois phrases, l'IA ne le pourra pas non plus.
2. **Exige un critère de réussite binaire.** Une commande, une sortie attendue. C'est la discipline des `EXO_JEUNE_IA` de MyFunnyJS.
3. **Vérifie les frontières** : la doc de l'API existe-t-elle vraiment ? Le paquet est-il maintenu ? La signature est-elle celle de la version que tu utilises ? **Et sous quelle licence est-il publié ?** C'est le seul de ces critères qui peut à lui seul faire refuser un livrable en entreprise.
   **Règle de refus.** Toute dépendance sous licence copyleft forte (GPL, AGPL) est refusée dans un produit propriétaire. La vérification se fait à la source : page du dépôt, fichier `LICENSE` : jamais dans la réponse de l'IA, et toujours avant l'écriture du premier import.
4. **Lis le chemin d'erreur.** L'IA écrit rarement de bons cas d'échec.
5. **Demande la faille.** "Sous quelle condition ce code casse-t-il ?" Une bonne réponse en cite trois. Une mauvaise dit "ce code est robuste".

> **Exercice : La licence qu'on ne lit jamais**
> **Temps réaliste** : 20 min · **Prérequis matériel / compte** : un accès à un assistant IA quelconque · **Coût max** : 0 € ·
> **Mode** : assistant autorisé
> **Contraintes** : demande à une IA de te proposer trois dépendances pour un besoin réel de ton projet (par exemple : parsing de dates, file d'attente locale, génération de PDF). Ne lui demande pas la licence.
> **Réutilise** : `22_security/09_supply_chain_sbom.md`
> **Piège** : l'IA cite souvent une licence de mémoire, parfois fausse ou périmée.
> **À observer** : la licence que l'IA t'annonce pour chacune, si elle le fait spontanément.
> **Vérification** (observable, chiffrée) : va lire la licence à la source (dépôt du paquet, champ `license` du registre) pour les trois dépendances, classe-les en libre / permissive / copyleft faible / copyleft fort, et note les écarts avec ce que l'IA avait dit.
> **Repli 100 % local et gratuit** : aucun assistant sous la main ? Prends trois dépendances déjà installées dans un projet à toi, devine leur licence de mémoire AVANT de vérifier, puis lis le champ `license` du registre. L'IA à tromper, c'est toi.
> **Extension** : refais l'exercice sur une dépendance déjà présente dans un de tes projets sans que tu aies jamais vérifié sa licence.

### 9.5 : Agents et autonomie

Un agent enchaîne des actions sans validation à chaque étape. Ce qui compte alors :

- **Spécification vérifiable** avant lancement (`29_ai_agents_and_autonomy/02_verifiable_specifications.md`) : sans critère d'arrêt, un agent optimise le plausible.
- **Lecture de trace** : savoir où il a dévié, pas seulement s'il a réussi.
- **Refus de trace** : savoir dire "cette exécution est invalide même si le résultat semble bon".
- **Hygiène de bac à sable** : périmètre, secrets, effets irréversibles. Un agent avec accès en écriture à la prod est un incident en attente.

**Exemple qui casse : les tests ignorés en silence.** Un agent reçoit la consigne « fais passer la suite de tests ». Trois tests d'intégration échouent à cause d'une régression réelle. La trace montre la démarche : l'agent les marque comme ignorés, puis annonce la suite verte. Techniquement, la consigne est respectée. La spécification vérifiable manquante tenait en une ligne : « aucun test ne doit être désactivé ou ignoré ».

**Ce qui restera valable dans 10 ans.** La démarche : spécifier, exécuter, vérifier par une preuve, assumer. **Ce qui bougera** : les modèles, les outils, les techniques de prompt, les protocoles d'agents. Ne mémorise aucun prompt.

### 9.6 : La position honnête

L'IA n'est ni un ennemi ni une baguette magique. Elle est un accélérateur avec un angle mort massif : elle produit du **plausible**, pas du **vrai**. Un développeur qui ne sait pas faire la différence produit plus vite des problèmes plus coûteux.

**Résistance acquise.** Une réponse IA plausible ne suffit plus à te convaincre. Tu demandes une preuve : et tu sais laquelle demander selon la techno.

### 9.7 : Angles morts que l'IA ne résout pas

Ni aujourd'hui, ni sur le legacy, ni sur ce qui arrive.

| Angle mort                                     | Pourquoi l'IA ne le couvre pas                                      |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| Demande ambiguë                                | elle comble les trous par du plausible au lieu de poser la question |
| Spécification contradictoire                   | elle implémente la dernière phrase lue                              |
| Contexte métier absent du prompt               | il n'est écrit nulle part, il vit dans la tête de trois personnes   |
| Choix entre solutions valides                  | elle propose ; elle n'assume pas                                    |
| Compromis coût / perf / sécurité / maintenance | elle n'a ni ta facture, ni ton équipe, ni ton SLA                   |
| Legacy mal documenté                           | elle voit un fichier, pas quinze ans d'histoire                     |
| Symptôme vs cause racine                       | elle corrige ce qu'on lui montre                                    |
| Bug non déterministe                           | elle ne peut pas le reproduire chez toi                             |
| API inventée, dépendance inexistante           | c'est statistiquement plausible, donc généré                        |
| Faille dans du code plausible                  | l'autorisation métier n'a aucune signature détectable               |
| Effets de bord                                 | invisibles dans l'extrait fourni                                    |
| Décider de **ne pas** coder                    | elle produit toujours quelque chose                                 |
| Défendre la décision en réunion                | ce n'est pas elle qui sera là dans six mois                         |
| Responsabilité du système livré                | juridiquement et humainement, c'est toi                             |
| Reconnaître ce qu'on ne sait pas               | elle répond avec la même assurance dans les deux cas                |
| Doc, IA et exemples qui se contredisent        | il faut aller lire le code source, ou expérimenter                  |

**Legacy.** Le code ancien contient des décisions dont le contexte a disparu. Un `if` bizarre est parfois un correctif de bug de 2019 pour un client qui existe encore. Supprimer ce que tu ne comprends pas est la façon la plus rapide de créer un incident (`13_refactoring/07_do_not_touch_before_explain.md`).

**Futur.** À mesure que la génération de code s'améliore, deux choses grossissent : le **volume** de code à maintenir, et le coût d'une mauvaise décision d'architecture prise vite. Les compétences qui prennent de la valeur sont donc : la spécification vérifiable, la revue, l'observabilité, la sécurité et la capacité à supprimer du code.

### 9.8 : Trois spécimens IA fautifs, à démonter

Reconnaître une faille dans un texte plausible est une compétence perceptive : elle s'acquiert sur des spécimens, pas sur une liste de catégories. Les trois exercices ci-dessous se font **sans lire la correction avant d'avoir répondu**.

#### Spécimen 1 : React, l'abonnement qui fuit

```jsx
// Réponse IA plausible : badge de notifications non lues
function NotificationBadge({ userId }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const socket = subscribeToNotifications(userId, (n) => {
      setCount(n.unreadCount);
    });
  }, [userId]);

  return <span>{count}</span>;
}
```

> **Exercice : Le badge qui continue d'écouter**
> **Temps réaliste** : 45 min · **Prérequis matériel / compte** : un projet React local · **Coût max** : 0 € ·
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : n'ouvre aucun assistant tant que tu n'as pas écrit ta réponse.
> **Réutilise** : `01_fundamentals/02_scope/02_closure_trap.md`
> **Piège** : le code fonctionne parfaitement en démo manuelle ; la faille n'apparaît qu'en navigation répétée ou après démontage du composant.
> **À observer** : le nombre d'abonnements actifs après plusieurs changements de `userId`, et les avertissements de la console au démontage.
> **Vérification** (observable, chiffrée) : écris un test qui monte le composant, le démonte, puis déclenche un message du flux simulé : le test doit prouver qu'aucun `setState` n'est appelé après démontage.
> **Repli 100 % local et gratuit** : le spécimen fautif est déjà écrit dans le document ; l'exercice se fait au crayon, sans IA et sans réseau.
> **Extension** : reproduis la même faille avec un `fetch` annulable plutôt qu'un abonnement, et corrige avec `AbortController`.

**Correction annotée.**

```jsx
useEffect(() => {
  let active = true;
  const socket = subscribeToNotifications(userId, (n) => {
    if (active) setCount(n.unreadCount);
  });
  return () => {
    active = false;
    socket.unsubscribe();
  };
}, [userId]);
```

**Faille pointée après coup.** Sans le `return`, chaque changement de `userId` empile un nouvel abonnement au lieu de fermer le précédent : c'est la fuite. Et si le composant est démonté pendant qu'un message arrive, `setCount` s'exécute sur un composant qui n'existe plus : avertissement React d'abord, fuite mémoire réelle ensuite si le flux est actif longtemps.

#### Spécimen 2 : Docker, le secret gravé dans une couche

```dockerfile
# Réponse IA plausible
FROM node:20
WORKDIR /app
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

> **Exercice : L'image qui a gardé le secret**
> **Temps réaliste** : 45 min · **Prérequis matériel / compte** : Docker installé en local · **Coût max** : 0 € ·
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : construis réellement cette image avant de corriger quoi que ce soit.
> **Réutilise** : `15_runtime_env/04_process_env_argv.md`
> **Piège** : l'image se construit et tourne sans erreur ; rien ne signale la faille au build.
> **À observer** : le résultat de `docker history <image>` et l'utilisateur retourné par `docker run --rm <image> whoami`.
> **Vérification** (observable, chiffrée) : `docker history` ne doit plus faire apparaître la moindre valeur de secret, et `whoami` dans le conteneur ne doit jamais retourner `root`.
> **Repli 100 % local et gratuit** : aucun (l'exercice est déjà local).
> **Extension** : ajoute un système de fichiers en lecture seule (`--read-only`) et vérifie que l'application démarre toujours.

**Correction annotée.**

```dockerfile
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
RUN useradd --uid 1001 --create-home appuser
COPY --from=build --chown=appuser:appuser /app/dist ./dist
COPY --from=build --chown=appuser:appuser /app/node_modules ./node_modules
// MAUVAIS : ENV DATABASE_URL=$DATABASE_URL (figé dans une couche, lisible par `docker history`)
// La bonne pratique : la variable est injectée à l'exécution par l'orchestrateur, jamais gravée au build.
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**Faille pointée après coup.** `ARG` suivi d'un `ENV` grave la valeur dans une couche de l'image, lisible par quiconque a accès à l'image même sans accès au dépôt de secrets. Et sans `USER`, le process tourne en root : une faille applicative devient une faille du système hôte.

#### Spécimen 3 : NestJS, le guard qui passe après le pipe

```typescript
// Réponse IA plausible : confirmation d'une commande par slug
@Injectable()
class ResolveOrderPipe implements PipeTransform {
  constructor(private readonly orders: OrdersService) {}
  async transform(value: any) {
    // pratique : crée un brouillon si le slug est inconnu
    return this.orders.findOrCreateBySlug(value.slug);
  }
}

@Controller("orders")
export class OrdersController {
  @Post(":slug/confirm")
  @UsePipes(ResolveOrderPipe)
  @UseGuards(AuthGuard)
  confirm(@Param() param: any) {
    return this.service.confirm(param.id);
  }
}
```

> **Exercice : La commande créée avant l'autorisation**
> **Temps réaliste** : 1 h · **Prérequis matériel / compte** : un projet NestJS minimal · **Coût max** : 0 € ·
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : envoie une requête **sans jeton d'authentification** avant de lire la correction.
> **Réutilise** : `16_architecture_patterns/02_solid_principles.md`
> **Piège** : le guard renvoie bien 401 ; on croit donc que rien ne s'est passé avant.
> **À observer** : l'état de la base de données après une requête non authentifiée.
> **Vérification** (observable, chiffrée) : compte les lignes créées dans la table des commandes après dix requêtes non authentifiées sur cet endpoint : le compte doit rester à zéro.
> **Repli 100 % local et gratuit** : le spécimen fautif et sa correction annotée sont déjà dans le document ; l'exercice se lit et s'annote au crayon, sans IA et sans réseau.
> **Extension** : reproduis le même défaut avec un `ValidationPipe` global qui exécute une validation asynchrone coûteuse (appel réseau) avant tout guard.

**Correction annotée.**

```typescript
@Controller("orders")
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post(":slug/confirm")
  @UseGuards(AuthGuard)
  async confirm(@Param("slug") slug: string) {
    const order = await this.orders.findBySlugOrThrow(slug); // lecture pure, pas d'effet de bord
    return this.service.confirm(order.id);
  }
}
```

**Faille pointée après coup.** Un pipe attaché à un paramètre de route peut s'exécuter avant que le guard de la méthode n'ait eu l'occasion de refuser la requête, dès que ce pipe fait plus que transformer une valeur. Ici, `findOrCreateBySlug` a un effet de bord : une écriture en base : exécuté pour toute requête, authentifiée ou non. Un pipe reste pur : validation et transformation, jamais création. La résolution qui a un effet de bord se fait dans le handler, après le guard.

### 9.9 : Ce qui prend de la valeur, ce qui en perd

Le reste de ce niveau porte sur l'usage de l'IA. Cette section pose la question inverse, celle que se pose un lecteur qui planifie une carrière : quelles compétences perdent de la valeur parce qu'un modèle les produit correctement, et lesquelles en gagnent ? Ce sont des tendances observables aujourd'hui, pas des prophéties : aucune date, aucun métier déclaré mort.

| Perd de la valeur | Gagne de la valeur | Ne bouge pas |
| ------------------- | -------------------- | -------------- |
| Écrire du code de plomberie à partir d'une spécification claire | Formuler le problème avant qu'il soit spécifiable | Le modèle relationnel |
| Connaître une API par cœur | Décider ce qu'on ne construit pas | La boucle d'événements et l'ordonnancement |
| Produire un CRUD de plus | Diagnostiquer en production sous pression | La concurrence et l'état partagé |
| Traduire d'un langage à l'autre | Vérifier une affirmation produite par un modèle | La mémoire, les références, le coût d'une allocation |
| Rédiger des tests unitaires évidents | Porter la responsabilité d'une décision devant une équipe | Les protocoles et les frontières réseau |

La troisième colonne est la condition des deux autres : on ne peut pas vérifier ce qu'on ne comprend pas, et vérifier est justement la colonne qui gagne.

**Chaque tag NOYAU DURABLE de ce document est un pari sur la troisième colonne.**

Pour aller plus loin côté mécanismes : [`23_ai_native_dev/`](../../23_ai_native_dev/) et [`29_ai_agents_and_autonomy/`](../../29_ai_agents_and_autonomy/).

---

[← Niveau 5 : Transfert](./05-niveau-5-transfert.md) · [Sommaire](../README.md) · [Cartes MyFunnyJS →](./07-cartes-myfunnyjs.md)
