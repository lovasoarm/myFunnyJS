---
statut: revu
last_reviewed: 2026-08
proprietaire: mainteneur TECH-ILA
revue: trimestrielle
companion: MyFunnyJS
---

[← Sommaire TECH-ILA](../README.md)

> **Tu viens de** : [01-niveau-1-socle.md](./01-niveau-1-socle.md) (Node, npm/pnpm, TypeScript, HTTP/REST, Git, Docker, PostgreSQL, déploiement de base)
> **Tu dois déjà savoir** : closures et portée (`01_fundamentals/02_scope/02_closure_trap.md`), fonctions pures (`11_functional_js/01_pure_functions.md`), les patrons d'architecture de base (`16_architecture_patterns/`)
> **Ensuite** : [03-niveau-3-backend.md](./03-niveau-3-backend.md) (Express, NestJS, auth, Redis, files, temps réel)

# Niveau 2 : Frontend (section 5)

---

## 5 : Niveau 2 : Frontend

### 5.1 : React

**React** : Tag : PROFESSIONNELLE ·
Coût : ~40 h avant utilité · Durée de vie : ~8 ans · À apprendre après : fonctions pures, closures, architecture de base

- **Ancrage MyFunnyJS** : `01_fundamentals/02_scope/02_closure_trap.md`, `11_functional_js/01_pure_functions.md`, `17_web_concepts/03_state_and_dataflow.md`
- **Ce qu'elle ajoute** : un modèle déclaratif, la composition de composants, la réconciliation, les hooks.
- **Ce qu'elle masque** : quand exactement le DOM est touché, la planification des rendus (concurrent rendering), le fait qu'un rendu peut être abandonné.
- **Ce qu'elle ne résout pas** : l'architecture, l'état serveur, les performances, l'accessibilité.
- **Quand ne pas la choisir** : pas avant que le projet ait un état d'interface qui dépasse deux ou trois variables locales : un site de contenu se traite en HTML + un peu de JS.
- **Exemple qui casse** : un `useEffect` avec un tableau de dépendances vide capture `count = 0` pour toujours ; aucune erreur, aucun message : c'est un plafonnement silencieux à 1.
- **Preuve que c'est acquis** : tu sais dire pourquoi un composant se réexécute et le montrer au profiler · **Si tu bloques, reviens à** : `01_fundamentals/02_scope/02_closure_trap.md`

#### Pourquoi elle existe

Avant React, mettre à jour une interface signifiait décrire **comment** modifier le DOM, étape par étape. Deux développeurs touchant le même nœud, et l'interface divergeait de l'état réel. React propose l'inverse : tu décris **à quoi** l'interface doit ressembler pour un état donné, la bibliothèque calcule la différence.

#### Quel problème elle résout

La synchronisation entre un état qui change et un DOM qui doit le refléter. Rien d'autre. React n'est pas un framework d'application : ni routing, ni data fetching, ni architecture. C'est important, parce que **toutes les décisions difficiles restent les tiennes**.

#### Ce que MyFunnyJS permet déjà de comprendre

Presque tous les bugs React que tu rencontreras sont des mécanismes JavaScript déjà vus, déplacés dans un cycle de rendu.

- [02_closure_trap.md](../../01_fundamentals/02_scope/02_closure_trap.md) : chaque rendu crée de nouvelles closures ; un effet mal câblé capture une valeur périmée.
- [02_reference_chaos.md](../../01_fundamentals/01_variables/02_reference_chaos.md) : muter un objet d'état ne déclenche pas de rendu, parce que l'identité de la référence n'a pas changé.
- [01_pure_functions.md](../../11_functional_js/01_pure_functions.md) : un composant est une fonction pure de ses props et de son état ; tout le reste est un effet.
- `03_async/04_event_loop/` : pourquoi lire l'état juste après `setState` renvoie l'ancienne valeur.
- [05_race_condition_hunter.md](../../28_edge_cases/05_race_condition_hunter.md) : deux fetchs concurrents, le plus lent écrase le plus rapide.
- [06_detached_dom_leak.md](../../08_memory_performance/01_gc/06_detached_dom_leak.md) : un abonnement non nettoyé au démontage est une fuite, pas un détail.

#### Ne pas écrire "React sert à construire des interfaces"

React devient intéressant après les modules sur l'état, les fonctions, la composition, les effets et l'architecture. Il fournit un modèle pour organiser l'interface, mais il ne supprime ni les problèmes d'état partagé, ni les effets mal contrôlés, ni les décisions d'architecture. MyFunnyJS aide à comprendre ce qui se passe quand un composant se réexécute, quand une closure capture une ancienne valeur, et quand une mauvaise séparation des responsabilités transforme l'interface en champ de mines.

#### Concepts MyFunnyJS mobilisés

| Concept MyFunnyJS                                                                                        | Où il frappe dans React                                                                                                  |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Closures ([02_closure_trap.md](../../01_fundamentals/02_scope/02_closure_trap.md))                       | chaque rendu crée de nouvelles closures ; un handler dans un `useEffect` mal câblé capture une valeur périmée            |
| Références vs copies ([02_reference_chaos.md](../../01_fundamentals/01_variables/02_reference_chaos.md)) | muter un objet d'état ne déclenche pas de rendu : l'identité n'a pas changé                                              |
| Pureté ([01_pure_functions.md](../../11_functional_js/01_pure_functions.md))                             | un composant doit être une fonction pure de ses props et de son état                                                     |
| Event loop (`03_async/04_event_loop/`)                                                                   | pourquoi les mises à jour d'état sont groupées et pourquoi lire l'état juste après `setState` te donne l'ancienne valeur |
| Fuites mémoire ([06_detached_dom_leak.md](../../08_memory_performance/01_gc/06_detached_dom_leak.md))    | abonnement non nettoyé au démontage = fuite + `setState` sur composant démonté                                           |
| Race conditions ([05_race_condition_hunter.md](../../28_edge_cases/05_race_condition_hunter.md))         | deux fetchs concurrents, le plus lent écrase le plus rapide                                                              |

#### Ce que React ajoute

Un modèle déclaratif, la composition de composants, la réconciliation, les hooks (état local, effets, contexte), et un écosystème gigantesque.

#### Ce qu'il masque

Quand exactement le DOM est touché. La planification des rendus (concurrent rendering). Le fait qu'un rendu peut être **abandonné**. Résultat : les gens écrivent des effets comme si l'ordre d'exécution était garanti.

#### Ce qu'il ne résout pas

- L'architecture. Un dossier `components/` de 300 fichiers reste un désastre.
- L'état serveur. React n'a aucune notion de cache, de revalidation, de requête en vol.
- Les performances. Un rendu inutile de 4 000 nœuds reste lent.
- L'accessibilité. `<div onClick>` n'est pas un bouton ([02_aria_basics.md](../../19_web_inclusive/02_aria_basics.md)).

#### Exemple minimal

```jsx
function StreamToggle() {
  const [live, setLive] = useState(false);
  return (
    <button onClick={() => setLive(!live)}>
      {live ? "Flux actif" : "Flux en pause"}
    </button>
  );
}
```

#### Exemple qui casse : la closure périmée

```jsx
function IngestCounter({ streamId }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // MAUVAIS : `count` est figé à 0 dans cette closure
    }, 1000);
    return () => clearInterval(id);
  }, []); // deps vides → l'effet ne revoit jamais `count`

  return <p>{count}</p>;
}
```

Le compteur monte à 1 et s'arrête. Aucun message d'erreur, aucune exception : c'est le symptôme le plus trompeur de React. Ce n'est **pas** un bug React. C'est `01_fundamentals/02_scope/02_closure_trap.md`, exactement. L'effet s'exécute une fois, sa closure capture `count = 0`, et `0 + 1` vaut toujours 1.

Correctif : `setCount(c => c + 1)` : la mise à jour fonctionnelle ne dépend pas de la valeur capturée.

#### Exemple qui casse : la race condition de fetch

```jsx
useEffect(() => {
  fetch(`/api/streams/${id}/stats`)
    .then((r) => r.json())
    .then(setStats); // MAUVAIS : si `id` change vite, la vieille réponse peut arriver en dernier
}, [id]);
```

L'utilisateur clique sur trois flux d'affilée. La réponse du premier arrive après celle du troisième. L'écran affiche les stats du mauvais flux, sans aucune erreur, sans aucun log. Le bug le plus détesté du frontend.

Correctif : `AbortController` ([02c_abort_controller.md](../../03_async/03_async_await/02c_abort_controller.md)) ou un drapeau d'annulation dans le cleanup. Ou, mieux, une bibliothèque d'état serveur qui gère ça pour toi.

#### Décisions d'architecture

**Où vit l'état ?** C'est _la_ question React.

```text
état d'un seul composant        → useState
état partagé par 2-3 voisins    → remonter d'un cran (lifting)
état de toute une section       → useContext (attention : tout consommateur rerend)
état venant du serveur          → TanStack Query / SWR : PAS useState + useEffect
état global client complexe     → Zustand / Redux Toolkit : CONTEXTUELLE
état d'URL (filtres, page)      → l'URL elle-même, pas un state
```

La confusion **état client / état serveur** est l'erreur d'architecture la plus coûteuse du frontend moderne. L'état serveur a un cache, une fraîcheur, des retries, une invalidation. Le réimplémenter à la main avec `useEffect` produit invariablement les mêmes cinq bugs.

#### Performance

Mesure d'abord (React DevTools Profiler). Ensuite seulement : `memo`, `useMemo`, `useCallback`, virtualisation des longues listes, découpage du bundle. `useMemo` partout, sans mesure, ajoute du coût et zéro gain : c'est [00_measure_first.md](../../08_memory_performance/00_measure_first.md) que les gens oublient dès qu'ils sont dans un `.jsx`.

#### Testing

Testing Library : tu interroges le DOM comme un utilisateur (`getByRole`), pas comme un développeur (`querySelector('.btn-primary')`). Bonus énorme : un test qui utilise `getByRole` échoue quand ton accessibilité est cassée.

#### Sécurité

React échappe le texte par défaut. `dangerouslySetInnerHTML` retire cette protection : c'est du XSS direct si la source n'est pas assainie ([01_xss_injection.md](../../22_security/01_xss_injection.md)). Le nom de l'API te prévient ; les gens l'utilisent quand même.

```jsx
// Rendu d'un commentaire utilisateur
function Comment({ raw }) {
  // MAUVAIS : injecte le HTML brut tel quel, XSS garanti si `raw` vient d'un utilisateur
  // return <div dangerouslySetInnerHTML={{ __html: raw }} />;

  // correct : assainir avant, ou ne jamais désactiver l'échappement
  return <div>{raw}</div>;
}
```

#### Observabilité

Un frontend n'a pas de logs serveur : ce que tu ne remontes pas est perdu avec l'onglet du navigateur.

- **Suivi d'erreurs (Sentry ou équivalent).** Il capture les exceptions non attrapées et les rejets de promesse. Ce qu'il ne capture pas par défaut : les erreurs de rendu avalées par un composant parent. Un `ErrorBoundary` qui affiche un joli message sans remonter l'erreur est un trou noir.
- **Source maps.** Sans elles, chaque trace est `a.min.js:1:48219`. Elles doivent être **envoyées au service de suivi** et **non servies publiquement** : sinon tu publies ton code source avec ton bundle. Le drill correspondant est [07_prod_stack_trace_drill.md](../../26_observability/07_prod_stack_trace_drill.md).
- **Ce que tu regardes vraiment.** Le taux d'erreur par version (une régression apparaît au déploiement, pas dans un test), le nombre d'utilisateurs touchés plutôt que le nombre d'occurrences, et le regroupement : mille occurrences d'un même bug ne valent pas mille tickets.
- **Le piège de confidentialité.** Les outils de replay de session enregistrent les champs de formulaire. Sans masquage explicite, tu envoies des données personnelles à un tiers ([08_privacy_and_aiact.md](../../22_security/08_privacy_and_aiact.md)).

Compromis : chaque outil ajoute du JavaScript au premier chargement. Le suivi d'erreurs vaut son poids ; le replay de session complet, à discuter.

#### Déploiement

Une application React compilée est un dossier de fichiers statiques. Tout le reste est une décision d'hébergement.

| Option                                                     | Ce que tu gagnes                                  | Ce que tu paies                                                       |
| ---------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| **Plateforme managée** (Vercel, Netlify, Cloudflare Pages) | CDN, prévisualisations par PR, zéro configuration | dépendance à un fournisseur, coût qui monte avec le trafic            |
| **Bucket + CDN** (S3/CloudFront, GCS)                      | contrôle, coût prévisible                         | à câbler soi-même : invalidation de cache, en-têtes, redirections SPA |
| **Auto-hébergé** (Nginx, conteneur)                        | maîtrise complète, contrainte de souveraineté     | c'est toi l'astreinte : TLS, mises à jour, supervision                |

Trois points qui cassent en production et jamais en local :

1. **Les variables d'environnement du build sont publiques.** C'est le piège déjà démonté en [5.2](#52--vite-et-loutillage-de-build) : une valeur préfixée `VITE_` est inlinée dans le bundle. Un secret n'a rien à faire dans un frontend, quel que soit le nom de la variable.
2. **Le fallback SPA.** Sans règle de réécriture vers `index.html`, un rechargement sur `/factures/42` renvoie un 404 du serveur, pas de ton routeur.
3. **Le cache des assets.** Les fichiers hachés se mettent en cache un an ; `index.html` ne se met **jamais** en cache. L'inverse produit des utilisateurs bloqués sur une version morte pendant des heures.

> **Exercice : Remonter d'une erreur de production à sa ligne**
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : un compte gratuit sur un service de suivi d'erreurs · **Coût max** : 0 €
> **Mode** : assistant autorisé
> **Contraintes** : provoque une erreur réelle en production (pas en local), les source maps sont envoyées au service de suivi mais absentes du site public, et le rapport d'erreur contient la version déployée.
> **Réutilise** : [07_prod_stack_trace_drill.md](../../26_observability/07_prod_stack_trace_drill.md)
> **Piège** : ajoute une variable `VITE_` contenant un faux jeton, déploie, puis retrouve-la dans les sources servies au navigateur.
> **À observer** : le nom du fichier et le numéro de ligne dans le rapport, l'en-tête `Cache-Control` de `index.html` et celui d'un asset haché, et le comportement d'un rechargement sur une route profonde.
> **Vérification** (observable, chiffrée) : rechargement sur `/quelque/chose/de/profond` sans 404, et une erreur remontée avec sa ligne d'origine exacte.
> **Repli 100 % local et gratuit** : sers le build avec `serve -s dist`, simule le rechargement de route via son option de fallback, et inspecte les sources avec les DevTools au lieu d'un vrai déploiement.
> **Extension** : tu déploies une nouvelle version pendant qu'un utilisateur a l'ancienne ouverte : que se passe-t-il quand son application demande un chunk qui n'existe plus ?

##### Pont vers les modules MyFunnyJS

[02_closure_trap.md](../../01_fundamentals/02_scope/02_closure_trap.md) (l'effet qui capture une valeur périmée), [02_reference_chaos.md](../../01_fundamentals/01_variables/02_reference_chaos.md) (muter l'état ne rerend pas), [05_race_condition_hunter.md](../../28_edge_cases/05_race_condition_hunter.md) (deux fetchs concurrents), [06_detached_dom_leak.md](../../08_memory_performance/01_gc/06_detached_dom_leak.md) (l'abonnement non nettoyé), [05_sentry_in_prod.md](../../26_observability/05_sentry_in_prod.md) et [07_prod_stack_trace_drill.md](../../26_observability/07_prod_stack_trace_drill.md) (les deux sections ci-dessus), [02_aria_basics.md](../../19_web_inclusive/02_aria_basics.md) (ce que React ne résout pas), [04_process_env_argv.md](../../15_runtime_env/04_process_env_argv.md) (la variable d'environnement inlinée).

#### Quand choisir React

Interface riche, état complexe, équipe déjà formée, besoin d'un écosystème fourni, réutilisation possible vers React Native.

#### Quand ne pas le choisir

- Site principalement de contenu → HTML + un peu de JS, ou un générateur statique. Envoyer 200 Ko de JS pour afficher un article est un mauvais compromis.
- Widget embarqué léger → Web Components ou vanilla.
- Équipe non formée sur un projet court.

#### Alternatives

| Alternative                     | Tag             | Ce qui change                                           | Ce qui reste               | Ce que ça change côté mécanisme MyFunnyJS                                                  |
| ------------------------------- | --------------- | ------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| **Vue** (PROFESSIONNELLE)       | PROFESSIONNELLE | réactivité fine-grain, moins de rendus inutiles         | composants, état, effets   | même piège de closure dans les handlers, mais moins de rendus à surveiller                 |
| **Svelte** (CONTEXTUELLE)       | CONTEXTUELLE    | compilation, pas de VDOM                                | même modèle mental état→UI | la réactivité est câblée au compilateur, la fuite mémoire se déplace mais ne disparaît pas |
| **Solid** (CONTEXTUELLE)        | CONTEXTUELLE    | signaux, réactivité granulaire                          | JSX, composition           | un composant ne se "réexécute" presque plus : le débogage par closure change de forme      |
| **Angular** (CONTEXTUELLE)      | CONTEXTUELLE    | framework complet, DI, RxJS : fort en grande entreprise | composants, cycle de vie   | l'injection de dépendances remplace le prop-drilling ; le même principe SOLID qu'en NestJS |
| **HTMX / vanilla** (PÉRISSABLE) | PÉRISSABLE      | rendu serveur, très peu de JS                           | HTTP, DOM                  | plus de closure d'effet à traquer : le bug se déplace côté serveur                         |

Si tu comprends "état → rendu → effet → nettoyage", tu apprends n'importe lequel en une semaine. C'est le but.

#### Ce qui restera valable dans 5 à 10 ans

Le modèle déclaratif, la composition, la séparation état client / état serveur, le cycle montage-mise à jour-démontage, la nécessité de nettoyer ses abonnements. **Ce qui bougera** : la signature des hooks, les conventions de serveur/client, les API expérimentales.

> **Exercice : Reproduire et corriger la race condition** : jeûne d'IA obligatoire
> **Temps réaliste** : 1 h 30 · **Prérequis matériel / compte** : aucun · **Coût max** : 0 €
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : reproduis volontairement la race condition de fetch ci-dessus, avec un délai réseau simulé aléatoire ; prouve le bug (log l'ID demandé et l'ID affiché) ; corrige-le de deux façons différentes.
> **Réutilise** : [05_race_condition_hunter.md](../../28_edge_cases/05_race_condition_hunter.md)
> **Piège** : la correction par `AbortController` change le comportement observable (pas de flash de contenu) contrairement au simple drapeau d'annulation : un junior les croit équivalentes.
> **À observer** : l'ordre d'arrivée des réponses réseau vs l'ordre des clics, et ce qui s'affiche finalement.
> **Vérification** (observable, chiffrée) : sur 20 cycles de clics rapides avec délai aléatoire, 20/20 affichent l'ID correctement synchronisé avec le dernier clic.
> **Repli 100 % local et gratuit** : simule le réseau avec `setTimeout(Math.random() * 2000)`, aucun serveur requis.
> **Extension** : que se passe-t-il si l'utilisateur revient en arrière pendant la requête ?
> **Preuve du jeûne demandée** : avant d'écrire une ligne de code, rédige en 5 lignes ton raisonnement écrit sur la cause exacte du bug et les deux stratégies de correction envisagées, horodaté avant toute exécution.

**Résistance acquise.** Tu ne diras plus "React re-render trop". Tu diras "ce composant se réexécute parce que cette référence change à chaque rendu" : et tu pourras le prouver avec le profiler.

---

### 5.2 : Vite et l'outillage de build

**Vite** : Tag : PROFESSIONNELLE (l'outil) / PÉRISSABLE (sa configuration) ·
Coût : ~6 h avant utilité · Durée de vie : ~4 ans · À apprendre après : modules ES, CommonJS vs ESM

- **Ancrage MyFunnyJS** : [01_import_export.md](../../01_fundamentals/06_modules/01_import_export.md), le graphe d'imports pilote le tree-shaking
- **Ce qu'elle ajoute** : rechargement en millisecondes en dev via des modules ESM natifs, un bundle optimisé au build.
- **Ce qu'elle masque** : la différence entre variable de build (inlinée, publique) et variable de runtime (privée) ; la résolution réelle du graphe de modules sous le tree-shaking.
- **Ce qu'elle ne résout pas** : un code métier mal découpé reste un gros bundle, quel que soit le bundler.
- **Quand ne pas la choisir** : pas avant que le projet dépasse quelques fichiers : pour une page unique, un simple script suffit ; en environnement legacy CommonJS profondément imbriqué, la migration coûte plus qu'elle ne rapporte à court terme.
- **Exemple qui casse** : une clé mise dans `VITE_SECRET_KEY` est inlinée dans le bundle ; n'importe qui ouvre les sources et la lit, sans le moindre avertissement au build.
- **Preuve que c'est acquis** : tu sais lire un rapport de bundle et dire quel import fait grossir quel chunk · **Si tu bloques, reviens à** : [01_import_export.md](../../01_fundamentals/06_modules/01_import_export.md)

**Le problème résolu.** Le navigateur veut un bundle optimisé ; le développeur veut un rechargement instantané. Vite sépare les deux : en dev, il sert des modules ESM natifs (rechargement en millisecondes) ; en build, il produit un bundle optimisé.

#### Ce que MyFunnyJS permet déjà de comprendre

Un bundler ne fait qu'appliquer mécaniquement ce que ton graphe d'imports déclare.

- [01_import_export.md](../../01_fundamentals/06_modules/01_import_export.md) : ce que tu importes définit le graphe parcouru, donc ce qui survit au tree-shaking.
- [03_commonjs_vs_esm.md](../../15_runtime_env/03_commonjs_vs_esm.md) : la moitié des erreurs de build sont un mélange CommonJS/ESM, pas un bug de Vite.
- [04_process_env_argv.md](../../15_runtime_env/04_process_env_argv.md) : une variable lue au build est inlinée donc publique ; une variable de runtime ne l'est pas.
- [07_prod_stack_trace_drill.md](../../26_observability/07_prod_stack_trace_drill.md) : sans source maps, une stack trace minifiée est illisible.

> **Exercice : Réduire un bundle de 30 %**
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : aucun · **Coût max** : 0 €
> **Mode** : assistant autorisé
> **Contraintes** : partir d'une mesure par chunk, ne pas toucher au code métier avant d'avoir identifié le plus gros contributeur, et justifier chaque changement (import nommé au lieu d'un import global, découpage par route, dépendance remplacée).
> **Réutilise** : [01_import_export.md](../../01_fundamentals/06_modules/01_import_export.md)
> **Piège** : ajoute une variable préfixée `VITE_` contenant un faux token, build, puis retrouve sa valeur en clair dans les fichiers générés.
> **À observer** : la taille avant/après par chunk, le nombre de requêtes au premier chargement, et le fichier exact où la variable apparaît.
> **Vérification** (observable, chiffrée) : le build passe, l'application fonctionne, et la mesure d'après montre au moins 30 % de réduction sur le chunk principal.
> **Repli 100 % local et gratuit** : tout l'exercice est déjà local, aucun repli nécessaire.
> **Extension** : ajoute un budget de taille qui fait échouer le build au-delà d'un seuil ; que se passe-t-il quand une dépendance grossit de 5 % la semaine suivante ?

**Ce que tu dois comprendre, et qui survivra à Vite :** tree-shaking (élimination du code mort), code splitting (découpage par route), source maps (retrouver ta ligne d'origine dans un stack trace minifié : indispensable pour [07_prod_stack_trace_drill.md](../../26_observability/07_prod_stack_trace_drill.md)), budget de bundle, et la différence entre variables d'environnement de build (inlinées, donc **publiques**) et de runtime.

**Piège coûteux.** Tu mets une clé d'API dans `VITE_SECRET_KEY`. Elle est inlinée dans le bundle. N'importe qui ouvre les sources et la lit. Aucune erreur, aucun avertissement.

**Ce qu'il ne faut pas mémoriser.** La config de Vite, Rollup, esbuild, Webpack, Turbopack. Tout ça change. Le concept "je transforme des modules en artefacts optimisés" ne change pas.

#### Alternatives

| Alternative               | Tag             | Ce que ça change                                        | Ce que ça change côté mécanisme MyFunnyJS                      |
| ------------------------- | --------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| **Webpack**               | PÉRISSABLE      | configuration plus lourde, écosystème de loaders mature | même graphe d'imports, résolution plus lente à observer        |
| **esbuild**               | PROFESSIONNELLE | vitesse de compilation brute, moins de plugins          | le tree-shaking devient quasi instantané à mesurer             |
| **Turbopack**             | CONTEXTUELLE    | cache incrémental orienté Next.js                       | le graphe de modules est mis en cache entre les runs           |
| **Bun** (bundler intégré) | CONTEXTUELLE    | runtime + bundler + gestionnaire de paquets unifiés     | le graphe d'imports et l'exécution partagent le même processus |

---

### 5.3 : Routing, formulaires, accessibilité

**Routing / formulaires / a11y** : Tag : NOYAU DURABLE (les concepts) / PÉRISSABLE (les API) ·
Coût : ~10 h avant utilité · Durée de vie : ~10 ans (concepts) / ~3 ans (API) · À apprendre après : React, état serveur vs client

- **Ancrage MyFunnyJS** : [03_state_and_dataflow.md](../../17_web_concepts/03_state_and_dataflow.md), l'URL comme source de vérité
- **Ce qu'elle ajoute** : navigation sans rechargement, validation de saisie utilisable au clavier et au lecteur d'écran.
- **Ce qu'elle masque** : la différence entre validation de confort (client) et validation de sécurité (serveur) ; le fait qu'un routeur client réinvente une partie du navigateur qu'il faut re-tester (retour, rechargement, lien direct).
- **Ce qu'elle ne résout pas** : un formulaire accessible sur un mauvais modèle de données reste un mauvais formulaire.
- **Quand ne pas la choisir** : pas avant que l'application ait plus d'un écran : une page unique n'a pas besoin de routeur ; ne jamais faire l'impasse sur l'accessibilité "faute de temps", le coût de rattrapage est bien supérieur.
- **Exemple qui casse** : un filtre de dates non testé sur deux fuseaux horaires affiche des lignes différentes pour la même URL selon le fuseau du client : bug invisible en recette, découvert en production internationale.
- **Preuve que c'est acquis** : un parcours complet au clavier sans souris, une URL qui reproduit exactement l'état visuel ailleurs · **Si tu bloques, reviens à** : [03_state_and_dataflow.md](../../17_web_concepts/03_state_and_dataflow.md)

#### Ce que MyFunnyJS permet déjà de comprendre

- [03_state_and_dataflow.md](../../17_web_concepts/03_state_and_dataflow.md) : une route est un état partageable ; l'URL est une source de vérité comme une autre.
- [02_aria_basics.md](../../19_web_inclusive/02_aria_basics.md) : HTML sémantique d'abord, ARIA ensuite : la règle ne change pas avec le framework.
- [02_dates_timezones.md](../../19_web_inclusive/08_i18n/02_dates_timezones.md) : un champ de date sans fuseau explicite produit des bugs invisibles en recette.
- [02_custom_errors.md](../../05_error_handling/02_custom_errors.md) : un message de validation est une erreur destinée à un humain, donc à concevoir.

**Routing.** Une route est un état partageable. Ce qui compte : l'URL doit être la source de vérité pour ce qui est partageable (filtres, pagination, onglet actif). Un dashboard dont on ne peut pas envoyer le lien à un collègue a raté sa conception. À maîtriser : routes imbriquées, chargement de données par route, états de chargement et d'erreur, routes protégées.

#### Ce que ça masque, spécifiquement pour le routing client

Un routeur client réimplémente une partie du navigateur (historique, focus après navigation, restauration de scroll). Rien de tout ça n'est gratuit : ce sont des cas à retester explicitement, pas des acquis du framework.

**Formulaires.** Le sujet réel est la **validation à deux niveaux** : côté client pour le confort, côté serveur pour la sécurité. La validation client est un service à l'utilisateur, jamais une protection. Partage le même schéma (Zod) entre les deux : une seule source de vérité, deux points d'application.

**Accessibilité.** Module `19_web_inclusive/` entièrement. Ce qui compte en pratique : HTML sémantique d'abord (un `<button>` avant tout ARIA), navigation clavier complète, focus visible et géré dans les modales, contraste suffisant, messages d'erreur annoncés (`aria-live`). Non négociable dans le secteur public européen, et de plus en plus ailleurs.

**Ce que personne ne dit :** un composant accessible est aussi plus facile à tester. `getByRole('button', { name: /relancer/i })` ne fonctionne que si ton bouton est un vrai bouton avec un nom accessible. L'accessibilité te rend service deux fois.

#### Quand ne pas la choisir

Pas de routeur client pour un site à une seule page. Pas de bibliothèque de formulaires complète pour un formulaire de contact à trois champs : la complexité additionnelle dépasse le problème.

> **Exercice : État dans l'URL et formulaire clavier**
> **Temps réaliste** : 2 h 30 · **Prérequis matériel / compte** : aucun · **Coût max** : 0 €
> **Mode** : assistant autorisé
> **Contraintes** : un lien collé dans un autre navigateur reproduit exactement le même écran, le bouton retour défait un filtre à la fois, et la validation partage un seul schéma entre client et serveur.
> **Réutilise** : [03_state_and_dataflow.md](../../17_web_concepts/03_state_and_dataflow.md)
> **Piège** : un filtre de dates : deux utilisateurs dans deux fuseaux différents doivent voir les mêmes lignes pour la même URL.
> **À observer** : l'URL après chaque interaction, l'ordre de tabulation, et où va le focus après application des filtres.
> **Vérification** (observable, chiffrée) : parcours complet sans souris jusqu'au bout, puis rechargement de la page : rien n'est perdu.
> **Repli 100 % local et gratuit** : tout se joue en local, aucun repli nécessaire.
> **Extension** : que fais-tu quand un filtre devient invalide parce que la donnée qu'il ciblait a été supprimée ?

---

### 5.4 : Next.js et les stratégies de rendu

**Next.js** : Tag : CONTEXTUELLE (le framework, ses conventions changent vite) ·
Coût : ~20 h avant utilité · Durée de vie : ~3 ans (le framework) / ~10 ans (le socle « stratégies de rendu », NOYAU DURABLE) · À apprendre après : React solide, SEO et rendu, stratégies de cache

- **Ancrage MyFunnyJS** : [07_seo_and_rendering.md](../../17_web_concepts/07_seo_and_rendering.md), les quatre stratégies de rendu
- **Ce qu'elle ajoute** : routing par fichiers, rendu serveur et composants serveur, cache multi-niveaux, handlers d'API.
- **Ce qu'elle masque** : sa couche de cache empilée à plusieurs niveaux, et la frontière serveur/client que le bundler traverse en suivant les imports, pas ton intention.
- **Ce qu'elle ne résout pas** : l'architecture de données, la sécurité de tes accès, les performances de tes requêtes SQL.
- **Quand ne pas la choisir** : pas avant d'avoir un vrai besoin de SEO ou de contenu semi-statique : une application interne derrière authentification n'en a aucun besoin ; une équipe qui refuse de suivre le rythme des versions a raison de s'abstenir.
- **Exemple qui casse** : `Hydration failed because the initial UI does not match what was rendered on the server` : presque toujours une date, un fuseau horaire, ou une lecture de `localStorage` pendant le rendu.
- **Preuve que c'est acquis** : tu sais nommer, sans le framework, quelle stratégie de rendu convient à quel écran et pourquoi · **Si tu bloques, reviens à** : [07_seo_and_rendering.md](../../17_web_concepts/07_seo_and_rendering.md)

**Le socle durable ne s'appelle pas Next.js : il s'appelle « stratégies de rendu ». C'est lui qui est NOYAU DURABLE, pas le framework.**

#### Quel problème il résout

Une application React pure envoie une page vide puis du JavaScript. Conséquences : premier affichage lent, indexation fragile, données récupérées trop tard. Next.js déplace une partie du rendu et de la récupération de données côté serveur.

#### Ce que MyFunnyJS permet déjà de comprendre

- [07_seo_and_rendering.md](../../17_web_concepts/07_seo_and_rendering.md) : pourquoi une page vide envoyée au navigateur est d'abord un problème d'indexation.
- [02_browser_render_pipeline.md](../../17_web_concepts/02_browser_render_pipeline.md) : ce que « hydrater » veut dire concrètement dans le pipeline de rendu.
- [04_caching_strategies.md](../../17_web_concepts/04_caching_strategies.md) : les caches empilés de Next sont les stratégies que tu connais, appliquées à trois niveaux.
- [01_import_export.md](../../01_fundamentals/06_modules/01_import_export.md) : la fuite d'un secret côté client est une chaîne d'imports, pas un mauvais placement de fichier.
- [01_node_vs_browser.md](../../15_runtime_env/01_node_vs_browser.md) : la frontière serveur/client existait avant le framework.

#### Les stratégies de rendu : le vrai sujet : NOYAU DURABLE

```text
                     UNE MÊME PAGE, QUATRE STRATÉGIES

  SSG (build)        contenu figé  → HTML prêt sur CDN, ultra rapide
    │                                revalidation ou rebuild pour changer
    ▼
  ISR (revalidation) contenu semi- → HTML servi périmé, régénéré en tâche
                      figé            de fond après un délai (`revalidate`)
    │
    ▼
  SSR (par requête)  contenu frais → HTML généré à chaque requête,
                      /personnalisé   coût serveur + latence à chaque appel
    │
    ▼
  RSC (composants    calcul serveur → zéro JS envoyé pour ce composant,
       serveur)        sans état      mais aucune interactivité possible
    │
    ▼
  Client (JS pur)    interactivité  → hydratation, état, effets,
                                       rien à indexer sans SSR/SSG en amont
```

| Stratégie                       | Quand                           | Compromis                                                                         |
| ------------------------------- | ------------------------------- | --------------------------------------------------------------------------------- |
| **Statique (SSG)** (build)      | contenu qui change rarement     | ultra rapide, nécessite un rebuild ou une revalidation                            |
| **ISR**                         | contenu semi-frais accepté      | rapide, mais un utilisateur peut voir une version périmée pendant la régénération |
| **Serveur (SSR)** (par requête) | contenu personnalisé ou frais   | coût serveur, latence par requête                                                 |
| **RSC** (composants serveur)    | calcul lourd sans interactivité | zéro JS client pour ce composant, mais pas d'état local                           |
| **Client**                      | interactions post-chargement    | rien à indexer, dépend du JS                                                      |

Comprendre ce diagramme vaut plus que connaître l'API du framework. Il est vrai dans Next, Nuxt, SvelteKit, Remix, Astro, TanStack Start, et dans tout ce qui existera après.

#### Ce que Next ajoute

Routing par fichiers, rendu serveur et composants serveur, optimisation d'images et de polices, une couche de cache, des handlers d'API, une histoire de déploiement toute faite.

#### Ce qu'il masque

**Sa couche de cache.** C'est la source n°1 d'incompréhension : "pourquoi ma donnée est périmée ?" Plusieurs caches empilés (requête, route, client) avec des règles d'invalidation non triviales.

Il masque aussi la frontière serveur/client. Un import mal placé fait fuiter du code serveur : ou pire, un secret : dans le bundle navigateur.

#### Ce qu'il ne résout pas

L'architecture de données, la sécurité de tes accès, les performances de tes requêtes SQL, la conception de ton domaine.

#### Exemple qui casse

Un composant serveur importe un helper qui, trois niveaux plus bas, importe un client d'administration base de données avec la clé de service. Un composant client importe ce même helper pour réutiliser un type. Le bundler tire la chaîne entière côté navigateur. La clé part chez l'utilisateur.

Le correctif n'est pas de déplacer le composant, c'est de **casser la chaîne d'imports** : les types partagés dans un module neutre, le client privilégié chargé dynamiquement à l'intérieur du handler, après vérification de l'appelant.

```ts
// route serveur : handler avec secret jamais journalisé
export async function POST(req: Request) {
  const dbKey = process.env.DB_SERVICE_KEY; // correct : lu depuis l'environnement
  // console.log("clé utilisée :", dbKey); // MAUVAIS : ne jamais journaliser un secret

  const body = requestSchema.safeParse(await req.json()); // validation en frontière
  if (!body.success) {
    return Response.json({ error: "payload invalide" }, { status: 400 });
  }
  // requête paramétrée, jamais de concaténation de chaîne SQL
  const rows = await db.query("SELECT * FROM streams WHERE id = $1", [
    body.data.id,
  ]);
  // MAUVAIS : const rows = await db.query(`SELECT * FROM streams WHERE id = ${body.data.id}`);
  return Response.json(rows);
}
```

#### Exemple qui casse : l'hydratation

Message littéral : `Hydration failed because the initial UI does not match what was rendered on the server`. Cause la plus fréquente : une date formatée différemment côté serveur (UTC) et côté client (fuseau local), ou une lecture de `localStorage` pendant le rendu initial : cette API n'existe pas côté serveur.

#### Testing

Trois niveaux, trois outils, et une erreur courante : tout tester au même endroit. Les composants serveur ne se testent pas comme des composants client, parce qu'ils n'ont ni état ni cycle de vie : ce sont des fonctions qui rendent du HTML à partir de données. Teste-les comme des fonctions. Les composants client se testent avec Testing Library, comme en [5.1](#51--react). Ce qui n'est testable qu'en bout de chaîne (Playwright) : l'hydratation, le streaming, la navigation, et les frontières serveur/client.

#### Sécurité

La zone dangereuse de Next n'est pas le rendu, c'est la **frontière**. Deux règles qui évitent la majorité des incidents :

- Un code serveur n'est protégé que si aucune chaîne d'imports ne le tire côté client. Le bundler suit les imports, pas ton intention ([01_import_export.md](../../01_fundamentals/06_modules/01_import_export.md)).
- Une server action est un **endpoint public**. Elle est appelable directement, sans passer par ton interface. L'autorisation se vérifie dedans, à chaque appel, pas dans le composant qui affiche le bouton.

Le reste vaut comme partout : validation côté serveur ([01_xss_injection.md](../../22_security/01_xss_injection.md)), cookies `SameSite`, en-têtes de sécurité.

#### Observabilité

Une application Next produit des erreurs des deux côtés de la frontière, et elles ne se lisent pas au même endroit : côté serveur dans les logs de l'hébergeur, côté client dans le suivi d'erreurs du navigateur. Un seul incident peut apparaître dans les deux, ou dans un seul. L'instrumentation doit donc porter un **identifiant de corrélation partagé** entre le rendu serveur et le navigateur, sinon tu compares deux histoires sans savoir qu'elles n'en font qu'une ([02_distributed_tracing.md](../../26_observability/02_distributed_tracing.md)).

Le point spécifique à surveiller : les erreurs d'**hydratation**. Elles n'empêchent pas la page de s'afficher, elles la font diverger silencieusement. Cause n°1 : une valeur qui diffère entre serveur et client, presque toujours une date ou un fuseau ([02_dates_timezones.md](../../19_web_inclusive/08_i18n/02_dates_timezones.md)) ou une lecture de `localStorage` pendant le rendu.

#### Déploiement

Next n'est plus un dossier statique : c'est un serveur, ou un ensemble de fonctions. Ce choix conditionne le reste.

| Option                     | Ce que tu gagnes                                       | Ce que tu paies                                                                                                   |
| -------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Vercel**                 | tout le framework fonctionne, y compris les nouveautés | facturation à l'usage difficile à prévoir, forte adhérence au fournisseur                                         |
| **Conteneur auto-hébergé** | portable, coût maîtrisé, souveraineté                  | certaines fonctionnalités demandent un travail d'intégration ; le cache d'images et la revalidation sont à câbler |
| **Export statique**        | simple, hébergeable partout                            | tu perds le rendu serveur, donc la moitié de la raison d'utiliser Next                                            |

Le piège des variables d'environnement est le **même qu'en [5.2](#52--vite-et-loutillage-de-build)**, avec un préfixe différent : ce qui est préfixé `NEXT_PUBLIC_` part dans le navigateur. La différence avec React seul, c'est qu'ici les deux mondes cohabitent dans le même dépôt : un secret sans préfixe reste serveur, jusqu'au jour où un composant client importe le module qui le lit.

##### Pont vers les modules MyFunnyJS

[07_seo_and_rendering.md](../../17_web_concepts/07_seo_and_rendering.md) (les quatre stratégies de rendu), [04_caching_strategies.md](../../17_web_concepts/04_caching_strategies.md) (les caches empilés), [01_node_vs_browser.md](../../15_runtime_env/01_node_vs_browser.md) (la frontière existait avant le framework), [01_import_export.md](../../01_fundamentals/06_modules/01_import_export.md) (la fuite de secret est une chaîne d'imports), [02_dates_timezones.md](../../19_web_inclusive/08_i18n/02_dates_timezones.md) (l'erreur d'hydratation la plus fréquente), [02_distributed_tracing.md](../../26_observability/02_distributed_tracing.md) (corréler serveur et client).

#### Quand choisir Next.js

Site public ayant besoin de SEO, e-commerce, contenu éditorial, produit avec beaucoup de pages semi-statiques, équipe React voulant un cadre fourni.

#### Quand ne pas le choisir

- Application interne derrière authentification, sans besoin de SEO → une SPA + une API est plus simple et moins coûteuse à opérer.
- Besoin d'une API publique riche → un backend dédié (NestJS, FastAPI, Spring) sera mieux outillé.
- Équipe qui ne veut pas suivre le rythme d'évolution du framework. C'est un vrai argument, pas une paresse.

#### Alternatives

| Alternative                        | Tag          | Ce qui change                                          | Ce que ça change côté mécanisme MyFunnyJS                    |
| ---------------------------------- | ------------ | ------------------------------------------------------ | ------------------------------------------------------------ |
| **Remix / React Router framework** | CONTEXTUELLE | boundary de données par route, moins de magie de cache | même graphe état→URL, moins de couches de cache à déboguer   |
| **Astro**                          | CONTEXTUELLE | îlots d'interactivité, HTML par défaut                 | le JS n'existe que là où tu l'as explicitement demandé       |
| **SvelteKit**                      | CONTEXTUELLE | compilation, moins de JS envoyé                        | le cycle hydratation reste, mais son coût mémoire diminue    |
| **Nuxt**                           | CONTEXTUELLE | équivalent Next pour Vue                               | mêmes quatre stratégies de rendu, autre écosystème           |
| **TanStack Start**                 | PÉRISSABLE   | jeune, orienté TanStack Query natif                    | la frontière état client/serveur est explicite dès le départ |

Toutes reposent sur les quatre stratégies de rendu ci-dessus.

#### Ce qui restera dans 5 à 10 ans

SSR, hydratation (le HTML rendu côté serveur est repris par le JS côté client pour devenir interactif), streaming, invalidation de cache, budget de performance, Core Web Vitals (`08_memory_performance/05_core_web_vitals/`). **Ce qui bougera** : la structure des dossiers, le nom des directives, la stratégie de cache par défaut. Tag **PÉRISSABLE** assumé sur les conventions du framework ; **NOYAU DURABLE** sur les stratégies de rendu elles-mêmes.

> **Exercice : Trois rendus, une mesure**
> **Temps réaliste** : 3 h · **Prérequis matériel / compte** : aucun · **Coût max** : 0 €
> **Mode** : assistant autorisé
> **Contraintes** : prends une page avec une liste filtrée ; implémente-la en trois variantes : tout client, rendu serveur, statique + revalidation.
> **Réutilise** : [07_seo_and_rendering.md](../../17_web_concepts/07_seo_and_rendering.md)
> **Piège** : la variante statique + revalidation semble la meilleure sur le papier mais expose une fenêtre de données périmées que le junior sous-estime toujours.
> **À observer** : taille du JS envoyé, temps jusqu'au premier contenu, fraîcheur réelle des données affichées.
> **Vérification** (observable, chiffrée) : les trois mesures sont écrites côte à côte, avec la contrainte "les données ont au plus 60 s de retard acceptable" appliquée pour trancher.
> **Repli 100 % local et gratuit** : `next dev` et `next build && next start` en local suffisent, aucun déploiement cloud nécessaire.
> **Extension** : que se passe-t-il si le nombre de pages statiques dépasse 100 000 : le rebuild complet devient-il encore viable ?

---

### 5.5 : React Native : encadré, pas une fiche

> **React Native, en 10 lignes.**
> **Tag : CONTEXTUELLE** · Coût : ~15 h avant utilité (si React déjà su) · Durée de vie : ~5 ans · À apprendre après : React solide.
> **Ce qui transfère** : le modèle mental état → rendu → effet, les hooks, les closures et leurs pièges, la gestion d'abonnements et leur nettoyage.
> **Ce qui ne transfère pas** : les éléments ne sont plus des nœuds DOM mais des vues natives ; navigation, gestes, cycle de vie d'application (arrière-plan, mémoire), permissions, distribution par store, mises à jour : chacun a son propre modèle.
> **Honnêteté.** "Écris une fois, tourne partout" est faux. Compte 70-85 % de code partagé et une part irréductible de spécifique par plateforme.
> **Quand y aller** : besoin réel d'une application mobile, équipe déjà React, budget qui ne permet pas deux équipes natives séparées.
> **Quand ne pas y aller** : application très gourmande en performances graphiques, forte dépendance à des API système de pointe, équipe déjà native.
> **Si tu bloques, reviens à** : [01_node_vs_browser.md](../../15_runtime_env/01_node_vs_browser.md) : un même langage, deux environnements d'exécution aux API différentes, exactement le saut web → natif.

---

### 5.6 : Frontend : ce qui te rend employable

Ce qu'un recruteur peut réellement vérifier chez toi :

- tu sais expliquer pourquoi un composant se réexécute ;
- tu sais distinguer état client et état serveur ;
- tu sais mesurer avant d'optimiser et montrer une capture de profiler ;
- ton interface fonctionne au clavier ;
- tes formulaires valident des deux côtés ;
- tu sais lire un stack trace minifié grâce aux source maps.

Six points. Aucun ne demande de connaître la dernière API à la mode.

---

[← Niveau 1 : Socle](./01-niveau-1-socle.md) · [Sommaire](../README.md) · [03-niveau-3-backend →](./03-niveau-3-backend.md)
