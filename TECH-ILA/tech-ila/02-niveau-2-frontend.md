[← Sommaire TECH-ILA](../README.md)

# Niveau 2 : Frontend (section 5)

---

## 5 : Niveau 2 : Frontend

### 5.1 : React

**Tag : PROFESSIONNELLE** · Prérequis MyFunnyJS : `01_fundamentals/02_scope/02_closure_trap.md`, `11_functional_js/01_pure_functions.md`, `16_architecture_patterns/`, `17_web_concepts/03_state_and_dataflow.md`

#### Pourquoi elle existe

Avant React, mettre à jour une interface signifiait décrire **comment** modifier le DOM, étape par étape. Deux développeurs touchant le même nœud, et l'interface divergeait de l'état réel. React propose l'inverse : tu décris **à quoi** l'interface doit ressembler pour un état donné, la bibliothèque calcule la différence.

#### Quel problème elle résout

La synchronisation entre un état qui change et un DOM qui doit le refléter. Rien d'autre. React n'est pas un framework d'application : ni routing, ni data fetching, ni architecture. C'est important, parce que **toutes les décisions difficiles restent les tiennes**.

#### Ce que MyFunnyJS permet déjà de comprendre

Presque tous les bugs React que tu rencontreras sont des mécanismes JavaScript déjà vus, déplacés dans un cycle de rendu.

- `01_fundamentals/02_scope/02_closure_trap.md` : chaque rendu crée de nouvelles closures ; un effet mal câblé capture une valeur périmée.
- `01_fundamentals/01_variables/02_reference_chaos.md` : muter un objet d'état ne déclenche pas de rendu, parce que l'identité de la référence n'a pas changé.
- `11_functional_js/01_pure_functions.md` : un composant est une fonction pure de ses props et de son état ; tout le reste est un effet.
- `03_async/04_event_loop/` : pourquoi lire l'état juste après `setState` renvoie l'ancienne valeur.
- `28_edge_cases/05_race_condition_hunter.md` : deux fetchs concurrents, le plus lent écrase le plus rapide.
- `08_memory_performance/01_gc/06_detached_dom_leak.md` : un abonnement non nettoyé au démontage est une fuite, pas un détail.

#### Ne pas écrire "React sert à construire des interfaces"

React devient intéressant après les modules sur l'état, les fonctions, la composition, les effets et l'architecture. Il fournit un modèle pour organiser l'interface, mais il ne supprime ni les problèmes d'état partagé, ni les effets mal contrôlés, ni les décisions d'architecture. MyFunnyJS aide à comprendre ce qui se passe quand un composant se réexécute, quand une closure capture une ancienne valeur, et quand une mauvaise séparation des responsabilités transforme l'interface en champ de mines.

#### Concepts MyFunnyJS mobilisés

| Concept MyFunnyJS                                                           | Où il frappe dans React                                                                                                  |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Closures (`01_fundamentals/02_scope/02_closure_trap.md`)                    | chaque rendu crée de nouvelles closures ; un handler dans un `useEffect` mal câblé capture une valeur périmée            |
| Références vs copies (`01_fundamentals/01_variables/02_reference_chaos.md`) | muter un objet d'état ne déclenche pas de rendu : l'identité n'a pas changé                                              |
| Pureté (`11_functional_js/01_pure_functions.md`)                            | un composant doit être une fonction pure de ses props et de son état                                                     |
| Event loop (`03_async/04_event_loop/`)                                      | pourquoi les mises à jour d'état sont groupées et pourquoi lire l'état juste après `setState` te donne l'ancienne valeur |
| Fuites mémoire (`08_memory_performance/01_gc/06_detached_dom_leak.md`)      | abonnement non nettoyé au démontage = fuite + `setState` sur composant démonté                                           |
| Race conditions (`28_edge_cases/05_race_condition_hunter.md`)               | deux fetchs concurrents, le plus lent écrase le plus rapide                                                              |

#### Ce que React ajoute

Un modèle déclaratif, la composition de composants, la réconciliation, les hooks (état local, effets, contexte), et un écosystème gigantesque.

#### Ce qu'il masque

Quand exactement le DOM est touché. La planification des rendus (concurrent rendering). Le fait qu'un rendu peut être **abandonné**. Résultat : les gens écrivent des effets comme si l'ordre d'exécution était garanti.

#### Ce qu'il ne résout pas

- L'architecture. Un dossier `components/` de 300 fichiers reste un désastre.
- L'état serveur. React n'a aucune notion de cache, de revalidation, de requête en vol.
- Les performances. Un rendu inutile de 4 000 nœuds reste lent.
- L'accessibilité. `<div onClick>` n'est pas un bouton (`19_web_inclusive/02_aria_basics.md`).

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
      setCount(count + 1); //[INTERDIT]`count` est figé à 0 dans cette closure
    }, 1000);
    return () => clearInterval(id);
  }, []); // deps vides → l'effet ne revoit jamais `count`

  return <p>{count}</p>;
}
```

Le compteur monte à 1 et s'arrête. Ce n'est **pas** un bug React. C'est `01_fundamentals/02_scope/02_closure_trap.md`, exactement. L'effet s'exécute une fois, sa closure capture `count = 0`, et `0 + 1` vaut toujours 1.

Correctif : `setCount(c => c + 1)` : la mise à jour fonctionnelle ne dépend pas de la valeur capturée.

#### Exemple qui casse : la race condition de fetch

```jsx
useEffect(() => {
  fetch(`/api/streams/${id}/stats`)
    .then((r) => r.json())
    .then(setStats); //[INTERDIT]si `id` change vite, la vieille réponse peut arriver en dernier
}, [id]);
```

L'utilisateur clique sur trois flux d'affilée. La réponse du premier arrive après celle du troisième. L'écran affiche les stats du mauvais flux, sans aucune erreur, sans aucun log. Le bug le plus détesté du frontend.

Correctif : `AbortController` (`03_async/03_async_await/02c_abort_controller.md`) ou un drapeau d'annulation dans le cleanup. Ou, mieux, une bibliothèque d'état serveur qui gère ça pour toi.

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

Mesure d'abord (React DevTools Profiler). Ensuite seulement : `memo`, `useMemo`, `useCallback`, virtualisation des longues listes, découpage du bundle. `useMemo` partout, sans mesure, ajoute du coût et zéro gain : c'est `08_memory_performance/00_measure_first.md` que les gens oublient dès qu'ils sont dans un `.jsx`.

#### Testing

Testing Library : tu interroges le DOM comme un utilisateur (`getByRole`), pas comme un développeur (`querySelector('.btn-primary')`). Bonus énorme : un test qui utilise `getByRole` échoue quand ton accessibilité est cassée.

#### Sécurité

React échappe le texte par défaut. `dangerouslySetInnerHTML` retire cette protection : c'est du XSS direct si la source n'est pas assainie (`22_security/01_xss_injection.md`). Le nom de l'API te prévient ; les gens l'utilisent quand même.

#### Observabilité

Un frontend n'a pas de logs serveur : ce que tu ne remontes pas est perdu avec l'onglet du navigateur.

- **Suivi d'erreurs (Sentry ou équivalent).** Il capture les exceptions non attrapées et les rejets de promesse. Ce qu'il ne capture pas par défaut : les erreurs de rendu avalées par un composant parent. Un `ErrorBoundary` qui affiche un joli message sans remonter l'erreur est un trou noir.
- **Source maps.** Sans elles, chaque trace est `a.min.js:1:48219`. Elles doivent être **envoyées au service de suivi** et **non servies publiquement** : sinon tu publies ton code source avec ton bundle. Le drill correspondant est `26_observability/07_prod_stack_trace_drill.md`.
- **Ce que tu regardes vraiment.** Le taux d'erreur par version (une régression apparaît au déploiement, pas dans un test), le nombre d'utilisateurs touchés plutôt que le nombre d'occurrences, et le regroupement : mille occurrences d'un même bug ne valent pas mille tickets.
- **Le piège de confidentialité.** Les outils de replay de session enregistrent les champs de formulaire. Sans masquage explicite, tu envoies des données personnelles à un tiers (`22_security/08_privacy_and_aiact.md`).

Compromis : chaque outil ajoute du JavaScript au premier chargement. Le suivi d'erreurs vaut son poids ; le replay de session complet, à discuter.

#### Déploiement

Une application React compilée est un dossier de fichiers statiques. Tout le reste est une décision d'hébergement.

| Option                          | Ce que tu gagnes                                | Ce que tu paies                                                          |
| ------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------- |
| **Plateforme managée** (Vercel, Netlify, Cloudflare Pages) | CDN, prévisualisations par PR, zéro configuration | dépendance à un fournisseur, coût qui monte avec le trafic                 |
| **Bucket + CDN** (S3/CloudFront, GCS) | contrôle, coût prévisible                     | à câbler soi-même : invalidation de cache, en-têtes, redirections SPA      |
| **Auto-hébergé** (Nginx, conteneur) | maîtrise complète, contrainte de souveraineté   | c'est toi l'astreinte : TLS, mises à jour, supervision                     |

Trois points qui cassent en production et jamais en local :

1. **Les variables d'environnement du build sont publiques.** C'est le piège déjà démonté en [5.2](#52--vite-et-loutillage-de-build) : une valeur préfixée `VITE_` est inlinée dans le bundle. Un secret n'a rien à faire dans un frontend, quel que soit le nom de la variable.
2. **Le fallback SPA.** Sans règle de réécriture vers `index.html`, un rechargement sur `/factures/42` renvoie un 404 du serveur, pas de ton routeur.
3. **Le cache des assets.** Les fichiers hachés se mettent en cache un an ; `index.html` ne se met **jamais** en cache. L'inverse produit des utilisateurs bloqués sur une version morte pendant des heures.

> **Exercice.** Déploie un de tes mini-projets React et prouve que tu peux remonter d'une erreur de production à ta ligne de code. Contraintes : provoque une erreur réelle en production (pas en local), les source maps sont envoyées au service de suivi mais absentes du site public, et le rapport d'erreur contient la version déployée. Réutilise `26_observability/07_prod_stack_trace_drill.md` : écris trois lignes sur ce que la trace montrait avant les source maps et après. Piège réaliste : ajoute une variable `VITE_` contenant un faux jeton, déploie, puis retrouve-la dans les sources servies au navigateur. À observer : le nom du fichier et le numéro de ligne dans le rapport, l'en-tête `Cache-Control` de `index.html` et celui d'un asset haché, et le comportement d'un rechargement sur une route profonde. Vérification : rechargement sur `/quelque/chose/de/profond` sans 404, et une erreur remontée avec sa ligne d'origine. Extension : tu déploies une nouvelle version pendant qu'un utilisateur a l'ancienne ouverte : que se passe-t-il quand son application demande un chunk qui n'existe plus ?

##### Pont vers les modules MyFunnyJS

`01_fundamentals/02_scope/02_closure_trap.md` (l'effet qui capture une valeur périmée), `01_fundamentals/01_variables/02_reference_chaos.md` (muter l'état ne rerend pas), `28_edge_cases/05_race_condition_hunter.md` (deux fetchs concurrents), `08_memory_performance/01_gc/06_detached_dom_leak.md` (l'abonnement non nettoyé), `26_observability/05_sentry_in_prod.md` et `07_prod_stack_trace_drill.md` (les deux sections ci-dessus), `19_web_inclusive/02_aria_basics.md` (ce que React ne résout pas), `15_runtime_env/04_process_env_argv.md` (la variable d'environnement inlinée).

#### Quand choisir React

Interface riche, état complexe, équipe déjà formée, besoin d'un écosystème fourni, réutilisation possible vers React Native.

#### Quand ne pas le choisir

- Site principalement de contenu → HTML + un peu de JS, ou un générateur statique. Envoyer 200 Ko de JS pour afficher un article est un mauvais compromis.
- Widget embarqué léger → Web Components ou vanilla.
- Équipe non formée sur un projet court.

#### Alternatives

| Alternative        | Ce qui change                                                          | Ce qui reste               |
| ------------------ | ---------------------------------------------------------------------- | -------------------------- |
| **Vue**            | réactivité fine-grain, moins de rendus inutiles                        | composants, état, effets   |
| **Svelte**         | compilation, pas de VDOM                                               | même modèle mental état→UI |
| **Solid**          | signaux, réactivité granulaire                                         | JSX, composition           |
| **Angular**        | framework complet, DI, RxJS : CONTEXTUELLE (fort en grande entreprise) | composants, cycle de vie   |
| **HTMX / vanilla** | rendu serveur, très peu de JS                                          | HTTP, DOM                  |

Si tu comprends "état → rendu → effet → nettoyage", tu apprends n'importe lequel en une semaine. C'est le but.

#### Ce qui restera valable dans 5 à 10 ans

Le modèle déclaratif, la composition, la séparation état client / état serveur, le cycle montage-mise à jour-démontage, la nécessité de nettoyer ses abonnements. **Ce qui bougera** : la signature des hooks, les conventions de serveur/client, les API expérimentales.

> **Exercice.** Reproduis volontairement la race condition de fetch ci-dessus, avec un délai réseau simulé aléatoire. Prouve le bug (log l'ID demandé et l'ID affiché). Corrige-le de deux façons différentes. Écris trois lignes sur le compromis entre les deux. Extension : que se passe-t-il si l'utilisateur revient en arrière pendant la requête ?

**Résistance acquise.** Tu ne diras plus "React re-render trop". Tu diras "ce composant se réexécute parce que cette référence change à chaque rendu" : et tu pourras le prouver avec le profiler.

---

### 5.2 : Vite et l'outillage de build

**Tag : PROFESSIONNELLE** (Vite) / **PÉRISSABLE** (sa configuration) · Prérequis : `01_fundamentals/06_modules/`, `15_runtime_env/03_commonjs_vs_esm.md`

**Le problème résolu.** Le navigateur veut un bundle optimisé ; le développeur veut un rechargement instantané. Vite sépare les deux : en dev, il sert des modules ESM natifs (rechargement en millisecondes) ; en build, il produit un bundle optimisé.

#### Ce que MyFunnyJS permet déjà de comprendre

Un bundler ne fait qu'appliquer mécaniquement ce que ton graphe d'imports déclare.

- `01_fundamentals/06_modules/01_import_export.md` : ce que tu importes définit le graphe parcouru, donc ce qui survit au tree-shaking.
- `15_runtime_env/03_commonjs_vs_esm.md` : la moitié des erreurs de build sont un mélange CommonJS/ESM, pas un bug de Vite.
- `15_runtime_env/04_process_env_argv.md` : une variable lue au build est inlinée donc publique ; une variable de runtime ne l'est pas.
- `26_observability/07_prod_stack_trace_drill.md` : sans source maps, une stack trace minifiée est illisible.

> **Exercice.** Réduis le bundle de production d'un de tes mini-projets de 30 % sans supprimer de fonctionnalité. Contraintes : partir d'une mesure par chunk, ne pas toucher au code métier avant d'avoir identifié le plus gros contributeur, et justifier chaque changement (import nommé au lieu d'un import global, découpage par route, dépendance remplacée). Réutilise `01_fundamentals/06_modules/01_import_export.md` : explique en trois lignes pourquoi un import global empêche le tree-shaking là où un import nommé le permet. Piège réaliste : ajoute une variable préfixée `VITE_` contenant un faux token, build, puis retrouve sa valeur en clair dans les fichiers générés. À observer : la taille avant/après par chunk, le nombre de requêtes au premier chargement, et le fichier exact où la variable apparaît. Vérification : le build passe, l'application fonctionne, et la mesure d'après est écrite à côté de celle d'avant. Extension : ajoute un budget de taille qui fait échouer le build au-delà d'un seuil ; que se passe-t-il quand une dépendance grossit de 5 % la semaine suivante ?

**Ce que tu dois comprendre, et qui survivra à Vite :** tree-shaking (élimination du code mort), code splitting (découpage par route), source maps (retrouver ta ligne d'origine dans un stack trace minifié : indispensable pour `26_observability/07_prod_stack_trace_drill.md`), budget de bundle, et la différence entre variables d'environnement de build (inlinées, donc **publiques**) et de runtime.

**Piège coûteux.** Tu mets une clé d'API dans `VITE_SECRET_KEY`. Elle est inlinée dans le bundle. N'importe qui ouvre les sources et la lit. Aucune erreur, aucun avertissement.

**Ce qu'il ne faut pas mémoriser.** La config de Vite, Rollup, esbuild, Webpack, Turbopack. Tout ça change. Le concept "je transforme des modules en artefacts optimisés" ne change pas.

---

### 5.3 : Routing, formulaires, accessibilité

**Tag : NOYAU DURABLE** (les concepts) / **PÉRISSABLE** (les API)

#### Ce que MyFunnyJS permet déjà de comprendre

- `17_web_concepts/03_state_and_dataflow.md` : une route est un état partageable ; l'URL est une source de vérité comme une autre.
- `19_web_inclusive/02_aria_basics.md` : HTML sémantique d'abord, ARIA ensuite : la règle ne change pas avec le framework.
- `19_web_inclusive/08_i18n/02_dates_timezones.md` : un champ de date sans fuseau explicite produit des bugs invisibles en recette.
- `05_error_handling/02_custom_errors.md` : un message de validation est une erreur destinée à un humain, donc à concevoir.

**Routing.** Une route est un état partageable. Ce qui compte : l'URL doit être la source de vérité pour ce qui est partageable (filtres, pagination, onglet actif). Un dashboard dont on ne peut pas envoyer le lien à un collègue a raté sa conception. À maîtriser : routes imbriquées, chargement de données par route, états de chargement et d'erreur, routes protégées.

**Formulaires.** Le sujet réel est la **validation à deux niveaux** : côté client pour le confort, côté serveur pour la sécurité. La validation client est un service à l'utilisateur, jamais une protection. Partage le même schéma (Zod) entre les deux : une seule source de vérité, deux points d'application.

**Accessibilité.** Module `19_web_inclusive/` entièrement. Ce qui compte en pratique : HTML sémantique d'abord (un `<button>` avant tout ARIA), navigation clavier complète, focus visible et géré dans les modales, contraste suffisant, messages d'erreur annoncés (`aria-live`). Non négociable dans le secteur public européen, et de plus en plus ailleurs.

**Ce que personne ne dit :** un composant accessible est aussi plus facile à tester. `getByRole('button', { name: /relancer/i })` ne fonctionne que si ton bouton est un vrai bouton avec un nom accessible. L'accessibilité te rend service deux fois.

> **Exercice.** Prends un écran de liste avec au moins deux filtres et une pagination. Déplace tout l'état partageable dans l'URL, puis rends le formulaire pleinement utilisable au clavier. Contraintes : un lien collé dans un autre navigateur reproduit exactement le même écran, le bouton retour défait un filtre à la fois, et la validation partage un seul schéma entre client et serveur. Réutilise `17_web_concepts/03_state_and_dataflow.md` : écris trois lignes sur ce qui appartient à l'URL, ce qui appartient au composant et ce qui appartient au serveur. Piège réaliste : un filtre de dates : deux utilisateurs dans deux fuseaux différents doivent voir les mêmes lignes pour la même URL. À observer : l'URL après chaque interaction, l'ordre de tabulation, et où va le focus après application des filtres. Vérification : parcours complet sans souris, puis rechargement de la page : rien n'est perdu. Extension : que fais-tu quand un filtre devient invalide parce que la donnée qu'il ciblait a été supprimée ?

---

### 5.4 : Next.js

**Tag : PROFESSIONNELLE** (adoption forte) / **PÉRISSABLE** (ses conventions changent vite) · Prérequis : React solide, `17_web_concepts/07_seo_and_rendering.md`, `17_web_concepts/04_caching_strategies.md`

#### Quel problème il résout

Une application React pure envoie une page vide puis du JavaScript. Conséquences : premier affichage lent, indexation fragile, données récupérées trop tard. Next.js déplace une partie du rendu et de la récupération de données côté serveur.

#### Ce que MyFunnyJS permet déjà de comprendre

- `17_web_concepts/07_seo_and_rendering.md` : pourquoi une page vide envoyée au navigateur est d'abord un problème d'indexation.
- `17_web_concepts/02_browser_render_pipeline.md` : ce que « hydrater » veut dire concrètement dans le pipeline de rendu.
- `17_web_concepts/04_caching_strategies.md` : les caches empilés de Next sont les stratégies que tu connais, appliquées à trois niveaux.
- `01_fundamentals/06_modules/01_import_export.md` : la fuite d'un secret côté client est une chaîne d'imports, pas un mauvais placement de fichier.
- `15_runtime_env/01_node_vs_browser.md` : la frontière serveur/client existait avant le framework.

#### Les stratégies de rendu : le vrai sujet

| Stratégie                 | Quand                         | Compromis                                              |
| ------------------------- | ----------------------------- | ------------------------------------------------------ |
| **Statique** (build)      | contenu qui change rarement   | ultra rapide, nécessite un rebuild ou une revalidation |
| **Serveur** (par requête) | contenu personnalisé ou frais | coût serveur, latence par requête                      |
| **Client**                | interactions post-chargement  | rien à indexer, dépend du JS                           |
| **Streaming**             | pages composites              | complexité, mais perçu bien meilleur                   |

Comprendre ces quatre lignes vaut plus que connaître l'API du framework. Elles sont vraies dans Next, Nuxt, SvelteKit, Remix, Astro, TanStack Start, et dans tout ce qui existera après.

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

#### Testing

Trois niveaux, trois outils, et une erreur courante : tout tester au même endroit. Les composants serveur ne se testent pas comme des composants client, parce qu'ils n'ont ni état ni cycle de vie : ce sont des fonctions qui rendent du HTML à partir de données. Teste-les comme des fonctions. Les composants client se testent avec Testing Library, comme en [5.1](#51--react). Ce qui n'est testable qu'en bout de chaîne (Playwright) : l'hydratation, le streaming, la navigation, et les frontières serveur/client.

#### Sécurité

La zone dangereuse de Next n'est pas le rendu, c'est la **frontière**. Deux règles qui évitent la majorité des incidents :

- Un code serveur n'est protégé que si aucune chaîne d'imports ne le tire côté client. Le bundler suit les imports, pas ton intention (`01_fundamentals/06_modules/01_import_export.md`).
- Une server action est un **endpoint public**. Elle est appelable directement, sans passer par ton interface. L'autorisation se vérifie dedans, à chaque appel, pas dans le composant qui affiche le bouton.

Le reste vaut comme partout : validation côté serveur (`22_security/01_xss_injection.md`), cookies `SameSite`, en-têtes de sécurité.

#### Observabilité

Une application Next produit des erreurs des deux côtés de la frontière, et elles ne se lisent pas au même endroit : côté serveur dans les logs de l'hébergeur, côté client dans le suivi d'erreurs du navigateur. Un seul incident peut apparaître dans les deux, ou dans un seul. L'instrumentation doit donc porter un **identifiant de corrélation partagé** entre le rendu serveur et le navigateur, sinon tu compares deux histoires sans savoir qu'elles n'en font qu'une (`26_observability/02_distributed_tracing.md`).

Le point spécifique à surveiller : les erreurs d'**hydratation**. Elles n'empêchent pas la page de s'afficher, elles la font diverger silencieusement. Cause n°1 : une valeur qui diffère entre serveur et client, presque toujours une date ou un fuseau (`19_web_inclusive/08_i18n/02_dates_timezones.md`) ou une lecture de `localStorage` pendant le rendu.

#### Déploiement

Next n'est plus un dossier statique : c'est un serveur, ou un ensemble de fonctions. Ce choix conditionne le reste.

| Option                       | Ce que tu gagnes                                   | Ce que tu paies                                                              |
| ---------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------|
| **Vercel**                   | tout le framework fonctionne, y compris les nouveautés | facturation à l'usage difficile à prévoir, forte adhérence au fournisseur     |
| **Conteneur auto-hébergé**   | portable, coût maîtrisé, souveraineté               | certaines fonctionnalités demandent un travail d'intégration ; le cache d'images et la revalidation sont à câbler |
| **Export statique**          | simple, hébergeable partout                          | tu perds le rendu serveur, donc la moitié de la raison d'utiliser Next          |

Le piège des variables d'environnement est le **même qu'en [5.2](#52--vite-et-loutillage-de-build)**, avec un préfixe différent : ce qui est préfixé `NEXT_PUBLIC_` part dans le navigateur. La différence avec React seul, c'est qu'ici les deux mondes cohabitent dans le même dépôt : un secret sans préfixe reste serveur, jusqu'au jour où un composant client importe le module qui le lit.

##### Pont vers les modules MyFunnyJS

`17_web_concepts/07_seo_and_rendering.md` (les quatre stratégies de rendu), `17_web_concepts/04_caching_strategies.md` (les caches empilés), `15_runtime_env/01_node_vs_browser.md` (la frontière existait avant le framework), `01_fundamentals/06_modules/01_import_export.md` (la fuite de secret est une chaîne d'imports), `19_web_inclusive/08_i18n/02_dates_timezones.md` (l'erreur d'hydratation la plus fréquente), `26_observability/02_distributed_tracing.md` (corréler serveur et client).

#### Quand choisir Next.js

Site public ayant besoin de SEO, e-commerce, contenu éditorial, produit avec beaucoup de pages semi-statiques, équipe React voulant un cadre fourni.

#### Quand ne pas le choisir

- Application interne derrière authentification, sans besoin de SEO → une SPA + une API est plus simple et moins coûteuse à opérer.
- Besoin d'une API publique riche → un backend dédié (NestJS, FastAPI, Spring) sera mieux outillé.
- Équipe qui ne veut pas suivre le rythme d'évolution du framework. C'est un vrai argument, pas une paresse.

#### Alternatives

Remix / React Router framework, Astro (contenu, îlots d'interactivité), SvelteKit, Nuxt, TanStack Start. Toutes reposent sur les quatre stratégies de rendu ci-dessus.

#### Ce qui restera dans 5 à 10 ans

SSR, hydratation (le HTML rendu côté serveur est repris par le JS côté client pour devenir interactif), streaming, invalidation de cache, budget de performance, Core Web Vitals (`08_memory_performance/05_core_web_vitals/`). **Ce qui bougera** : la structure des dossiers, le nom des directives, la stratégie de cache par défaut. Tag **PÉRISSABLE** assumé sur les conventions.

> **Exercice.** Prends une page avec une liste filtrée. Implémente-la en trois variantes : tout client, rendu serveur, statique + revalidation. Mesure : taille du JS, temps jusqu'au premier contenu, fraîcheur des données. Écris une matrice de décision et choisis, avec la contrainte "les données ont au plus 60 s de retard acceptable".

---

### 5.5 : React Native

**Tag : CONTEXTUELLE** · Prérequis : React solide

Même modèle mental, cible différente. Les composants ne sont plus des éléments DOM mais des vues natives. Ce qui change réellement : navigation, gestes, cycle de vie de l'application (arrière-plan, mémoire), permissions, distribution par les stores, mises à jour.

#### Ce que MyFunnyJS permet déjà de comprendre

- `15_runtime_env/01_node_vs_browser.md` : un même langage, deux environnements d'exécution aux API différentes : c'est exactement le saut web → natif.
- `08_memory_performance/01_gc/` : une application mise en arrière-plan puis tuée révèle les abonnements non nettoyés.
- `03_async/06_backpressure.md` : sur réseau mobile instable, produire plus vite que le réseau n'absorbe est la norme.
- `01_fundamentals/05_web_basics/03_storage_treasure.md` : stocker un token sur l'appareil pose les mêmes questions qu'en navigateur, avec un autre modèle de menace.

**Honnêteté.** "Écris une fois, tourne partout" est faux. Compte 70-85 % de code partagé et une part irréductible de spécifique par plateforme. Le mobile a ses propres métiers ; y arriver par React Native est légitime, mais ne t'annonce pas développeur mobile après un tutoriel.

**Quand ne pas le choisir.** App très gourmande en performances graphiques, forte dépendance à des API système de pointe, ou équipe déjà native.

> **Exercice.** Prends un écran qui affiche une liste distante et fais-le survivre à un réseau mobile réel : coupe le réseau, mets l'application en arrière-plan trois minutes, reviens. Contraintes : aucun écran blanc, aucune requête relancée en double au retour, un état « données périmées » affiché explicitement. Réutilise `15_runtime_env/01_node_vs_browser.md` : liste ce que ton code web supposait de son environnement et qui n'existe plus ici. Piège réaliste : le système peut tuer l'application en arrière-plan ; au retour elle redémarre à froid, pas là où tu l'avais laissée. À observer : le nombre de requêtes émises au retour au premier plan, l'état affiché pendant la coupure, et la mémoire avant/après dix allers-retours. Vérification : dix cycles arrière-plan/premier plan sans croissance continue de la mémoire. Extension : que décides-tu si les données locales et les données serveur ont divergé pendant la coupure ?

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
