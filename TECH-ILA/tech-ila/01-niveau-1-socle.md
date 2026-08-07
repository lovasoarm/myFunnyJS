[← Sommaire TECH-ILA](../TECH-ILA.md)

# Niveau 1 : Socle professionnel (section 4)

---

## 4 : Niveau 1 : Socle professionnel

Tout ce qui suit est vrai que tu fasses du web, du mobile, de la data ou de l'embarqué. C'est le seul niveau où presque tout est **NOYAU DURABLE**.

### 4.1 : Terminal et Linux

**Tag : NOYAU DURABLE** · Prérequis MyFunnyJS : `00_getting_started/02_shell_survival.md`

**Pourquoi ça existe.** Une machine de production n'a pas d'interface graphique. Le jour où ton service tombe à 3h du matin, tu as un SSH, un shell, et rien d'autre.

#### Ce que MyFunnyJS permet déjà de comprendre

Tu as déjà manipulé un shell et écrit des scripts qui parlent au système ; il ne reste qu'à transposer ces gestes sur une machine sans interface graphique.

- `00_getting_started/02_shell_survival.md` : navigation, pipes, redirections : c'est exactement la chaîne `tail -f | grep` que tu utiliseras en incident.
- `15_runtime_env/06_node_cli_scripts/` : tu as déjà lu `process.argv` et le système de fichiers depuis du code ; un script shell et un script Node résolvent le même problème avec deux vocabulaires.
- `15_runtime_env/02_streams_buffers.md` : un pipe Unix est un stream, et la backpressure que tu connais en Node y est le même mécanisme.
- `15_runtime_env/04_process_env_argv.md` : `export`, `env`, `printenv` : la configuration par l'environnement, déjà pratiquée.

**Ce que tu dois savoir faire sans réfléchir :**

| Geste                      | Commande type                                 | Quand                         |
| -------------------------- | --------------------------------------------- | ----------------------------- |
| Trouver qui mange le CPU   | `top`, `htop`                                 | incident perf                 |
| Suivre un log qui grossit  | `tail -f app.log \| grep ERROR`               | debug prod                    |
| Trouver un fichier         | `find . -name '*.env'`, `rg "TODO"`           | audit codebase                |
| Voir ce qui écoute un port | `ss -tlnp`, `lsof -i :3000`                   | "port already in use"         |
| Enchaîner du texte         | `cat x.csv \| cut -d, -f2 \| sort \| uniq -c` | analyse rapide                |
| Comprendre les permissions | `ls -l`, `chmod`, `chown`                     | "permission denied" en Docker |
| Variables d'environnement  | `export`, `env`, `printenv`                   | config d'app                  |

**Exemple qui casse.** Ton conteneur Docker écrit dans `/data`, monté depuis l'hôte. Le process tourne en `uid 1000`, le dossier appartient à `root`. Ton app plante avec `EACCES: permission denied`. Aucune ligne de JavaScript n'est en cause. Si tu ne sais pas lire `ls -ln`, tu vas passer trois heures à réécrire ton code de logging.

**Ce qui restera dans 10 ans.** Les pipes, les flux, les codes de sortie, les permissions, les signaux (`SIGTERM`, `SIGKILL`). Ce sont les mêmes concepts que les streams Node (`15_runtime_env/02_streams_buffers.md`).

**Ce qu'il ne faut pas mémoriser.** Les 40 flags de `tar`. Personne ne les connaît. `man` existe.

> **Exercice.** Prends le log d'un de tes mini-projets MyFunnyJS (`30_mini_projects/`). Écris une seule ligne de shell qui sort le top 5 des messages d'erreur les plus fréquents, triés. Contrainte : pas de script Node. Vérification : relance la commande sur un fichier vide, elle ne doit pas planter.

---

### 4.2 : Git et GitHub

**Tag : NOYAU DURABLE** · Prérequis MyFunnyJS : `01_fundamentals/08_git_core.md`, `00_getting_started/03_git_101.md`

**Quel problème ça résout.** Pas "sauvegarder du code". Git résout : _plusieurs cerveaux modifient la même vérité en parallèle et doivent réconcilier_. C'est un problème de systèmes distribués déguisé en outil (cf. `25_scalability/01_distributed_thinking.md`).

**Le modèle mental à avoir.** Git n'est pas un historique de fichiers, c'est un **graphe orienté acyclique de snapshots**. Chaque commit pointe vers son ou ses parents. Une branche est un simple pointeur mobile. Quand tu as ce modèle, `rebase`, `cherry-pick` et `reflog` cessent d'être de la magie.

#### Ce que MyFunnyJS permet déjà de comprendre

L'outil est déjà couvert ; ce qui manque, c'est le réflexe d'aller chercher une intention dans l'historique.

- `01_fundamentals/08_git_core.md` : commits, branches, fusion : le graphe de snapshots est déjà en place dans ta tête.
- `00_getting_started/03_git_101.md` : les gestes quotidiens et l'hygiène de commit.
- `04_debugging/05_hypothesis_driven_debug.md` : `git bisect` n'est que ta dichotomie d'hypothèses appliquée à l'historique.
- `27_team_craft/04_navigate_codebase.md` : sur du legacy, `git log` est la meilleure documentation disponible.
- `25_scalability/01_distributed_thinking.md` : deux dépôts qui divergent puis réconcilient, c'est un problème distribué déguisé en outil.

```text
main      A───B───C
                   \
feature             D───E     ← branche = pointeur sur E
```

**Ce que tu dois savoir faire :**

- lire l'historique d'un fichier pour comprendre _pourquoi_ une ligne existe (`git log -p --follow chemin`) ;
- retrouver le commit qui a introduit un bug (`git bisect`) : c'est du debugging par dichotomie, exactement `04_debugging/05_hypothesis_driven_debug.md` appliqué à l'historique ;
- récupérer un travail perdu (`git reflog`) ;
- résoudre un conflit sans écraser le travail des autres ;
- écrire un message de commit qui explique **pourquoi**, pas **quoi**.

**Ce que GitHub ajoute.** Pull requests, revue de code, Actions (CI), Issues. **Ce qu'il masque.** Rien de Git : mais il crée l'illusion que "merge" est un bouton. **Ce qu'il ne résout pas.** Une mauvaise découpe de commits reste illisible même avec une belle PR.

**Piège fréquent.** `git push --force` sur une branche partagée. Tu réécris une histoire que d'autres ont déjà récupérée. Utilise `--force-with-lease` : il refuse si quelqu'un a poussé entre-temps.

**Alternatives crédibles.** Mercurial (rare), Jujutsu (`jj`, émergent, **PÉRISSABLE** pour l'instant), Perforce (jeu vidéo, gros binaires). Le modèle de commit-graphe reste identique.

**Pont MyFunnyJS.** `27_team_craft/01_code_review.md` (la PR est le support de la revue), `27_team_craft/04_navigate_codebase.md` (l'historique est ta meilleure doc sur du legacy).

> **Exercice : archéologie.** Clone un repo open source que tu ne connais pas. Sans lire le README, trouve : le point d'entrée, le commit qui a introduit la fonctionnalité principale, et une décision d'architecture visible dans l'historique. Écris 10 lignes. Piège : le point d'entrée n'est presque jamais `index.js`.

**Réflexe gagné.** Devant du code incompréhensible, ton premier geste n'est plus "je réécris". C'est `git log`. Tu cherches l'intention avant de juger le résultat.

---

### 4.3 : Node.js

**Tag : PROFESSIONNELLE** (le runtime) / **NOYAU DURABLE** (les concepts) · Prérequis MyFunnyJS : module `03_async` complet, `15_runtime_env/01_node_vs_browser.md`

#### Pourquoi elle existe

Exécuter du JavaScript hors du navigateur, avec des I/O non bloquantes. L'idée fondatrice : un seul thread, une boucle d'événements, et tout ce qui attend (disque, réseau) est délégué au système.

#### Quel problème elle résout

Les serveurs classiques ouvraient un thread par connexion. 10 000 connexions = 10 000 threads = mémoire explosée. Node répond : un thread, des milliers de connexions, tant que le travail est **I/O-bound** (limité par l'attente réseau/disque) et non **CPU-bound** (limité par le calcul).

#### Ce que MyFunnyJS permet déjà de comprendre

Beaucoup. Vraiment beaucoup.

- `03_async/04_event_loop/` : tu sais déjà pourquoi une microtâche passe avant un `setTimeout`. C'est **exactement** ce qui explique pourquoi ton handler HTTP répond avant ton log.
- `03_async/06_backpressure.md` : tu sais que si tu lis plus vite que tu n'écris, la mémoire monte. C'est le bug n°1 des pipelines de fichiers en Node.
- `15_runtime_env/02_streams_buffers.md` : les streams ne sont pas une API exotique, c'est le modèle central de Node.
- `08_memory_performance/01_gc/` : un serveur Node qui vit des semaines révèle toutes les fuites qu'un script de 3 secondes cachait.

#### Ce que Node ajoute

Un accès système : `fs`, `net`, `http`, `crypto`, `worker_threads`, `child_process`. Un modèle de modules (CommonJS puis ESM, cf. `15_runtime_env/03_commonjs_vs_esm.md`). Un écosystème npm gigantesque.

#### Ce qu'il masque

L'epoll/kqueue du système. La gestion du pool de threads libuv (4 threads par défaut) utilisé pour le disque, le DNS et certaines opérations crypto. Tu ne le vois pas : jusqu'au jour où ton hachage bcrypt synchrone bloque tout.

#### Ce qu'il ne résout pas

- Le CPU-bound. Une boucle de calcul de 2 secondes gèle **toutes** les requêtes.
- La mémoire. Le heap V8 a une limite (souvent ~1,5-4 Go selon la version et les flags).
- La cohérence. Plusieurs instances Node = plusieurs états en mémoire. Ton compteur en variable globale ment dès la deuxième instance.

#### Exemple minimal

```js
import { createServer } from "node:http";

createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
}).listen(3000);
```

#### Exemple réaliste : traitement de fichier volumineux

Un pipeline qui ingère un export de métriques de 4 Go et compte les événements par type.

```js
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

export async function countByType(path) {
  const counts = new Map();
  const rl = createInterface({
    input: createReadStream(path),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // backpressure gérée par le for await
    if (!line) continue;
    const type = line.slice(0, line.indexOf(","));
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
}
```

#### Exemple qui casse

```js
//[INTERDIT]le fichier entier atterrit en mémoire
const data = await readFile("metrics-4gb.log", "utf8");
for (const line of data.split("\n")) {
  /* ... */
}
```

Sur ta machine de dev avec un échantillon de 5 Mo : parfait. En production sur 4 Go : `JavaScript heap out of memory`, le conteneur est tué par l'orchestrateur (OOMKill), et le redémarrage relance le traitement depuis zéro. Boucle infinie de crash.

**Le diagnostic** vient de `08_memory_performance/04_profiling/` : heap snapshot, tu vois une seule string géante. Pas besoin de deviner.

#### Pièges fréquents

| Piège                                 | Symptôme                                     | Cause réelle                                                           |
| ------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| Travail CPU dans le handler           | latence de **toutes** les routes             | event loop bloquée                                                     |
| `await` dans une boucle sur 500 items | lenteur linéaire                             | pas de parallélisme (`Promise.all` avec limite de concurrence)         |
| `Promise.all` sur 5 000 items         | explosion réseau, timeouts                   | pas de limite de concurrence                                           |
| État en variable module               | bug qui n'apparaît qu'en prod multi-instance | tu as supposé un seul process                                          |
| `process.exit()` dans un handler      | requêtes coupées en vol                      | pas d'arrêt gracieux                                                   |
| Erreur async non catchée              | crash silencieux du process                  | `unhandledRejection` (cf. `05_error_handling/04_async_error_traps.md`) |

#### Décisions d'architecture

- **Un ou plusieurs process ?** Node est mono-thread : utilise `cluster` ou plusieurs conteneurs pour exploiter tous les cœurs. Conséquence immédiate : plus de session en mémoire, plus de cache local fiable.
- **Où mettre l'état ?** Réponse par défaut : la base de données ou Redis. Pas la RAM du process.
- **Arrêt gracieux.** Sur `SIGTERM`, tu arrêtes d'accepter, tu finis les requêtes en cours, tu fermes les connexions DB, puis tu sors. Sans ça, chaque déploiement casse des requêtes.

#### Testing

Vitest ou le runner natif `node:test`. Les tests d'intégration frappent un vrai serveur HTTP éphémère. Base de données : vrai PostgreSQL dans un conteneur, pas un mock. Cf. `06_testing/04_integration_reactor.md` et `06_testing/03_mocking_madness.md` (mocker la DB, c'est tester ton mock).

#### Sécurité

`22_security/09_supply_chain_sbom.md` prend tout son sens ici : un `npm install` tire des centaines de paquets transitifs. Verrouille le lockfile, active `npm audit` en CI, épingle les versions, méfie-toi des paquets installés hier par un compte inconnu.

#### Performance

Mesure avant d'optimiser (`08_memory_performance/00_measure_first.md`). Outils : `node --inspect` + DevTools, `node --cpu-prof`, `clinic.js`, `autocannon` pour la charge. Métrique reine côté serveur : le **lag de l'event loop**. Si elle dépasse 50 ms, quelque chose bloque.

#### Observabilité

Logs structurés JSON (`pino`), un `request_id` propagé partout, métriques exportées. Cf. `26_observability/01_structured_logging.md`.

#### Déploiement

Conteneur Docker, image `node:XX-slim` ou distroless, utilisateur non root, `NODE_ENV=production`, healthcheck HTTP.

#### Quand choisir Node

- API HTTP/JSON, BFF (backend-for-frontend), temps réel, outillage CLI, SSR.
- Équipe déjà JS/TS : un seul langage, un seul modèle mental, du code partagé.

#### Quand ne pas le choisir

- Calcul lourd continu (traitement d'images, ML, simulation) → Python, Go, Rust, Java.
- Besoin de garanties de typage fort à la compilation dans un domaine critique → JVM ou .NET.
- Équipe sans culture JS : le coût du "tout est asynchrone" est réel.

#### Alternatives

| Alternative          | Ce qu'elle change                                                            | Ce qui reste identique         |
| -------------------- | ---------------------------------------------------------------------------- | ------------------------------ |
| **Deno**             | TS natif, sécurité par permissions                                           | event loop, modèle async       |
| **Bun**              | démarrage rapide, runtime tout-en-un : jeune, **PÉRISSABLE** sur les détails | JS, async, npm                 |
| **Go**               | vraie concurrence, goroutines, binaire unique                                | pas d'event loop mono-thread   |
| **Python (FastAPI)** | async aussi, écosystème data                                                 | modèle async/await très proche |

#### Ce qui restera valable dans 5 à 10 ans

L'event loop, la distinction I/O-bound / CPU-bound, la backpressure, l'arrêt gracieux, la propagation d'erreurs async. Le nom du runtime peut changer, ces cinq choses non.

#### Ce qu'il ne faut surtout pas mémoriser

La signature exacte de `fs.promises`, la liste des flags V8, l'API de `worker_threads`. Doc ouverte, toujours.

> **Exercice.** Écris un service HTTP qui télécharge un fichier distant, le transforme ligne à ligne et renvoie un résumé. Contraintes : mémoire constante quelle que soit la taille, arrêt gracieux sur `SIGTERM`, un `request_id` dans chaque log. Piège réaliste : la source coupe la connexion à mi-parcours. Que renvoies-tu ? Vérification : lance-le avec `--max-old-space-size=128` sur un fichier de 1 Go. Il doit tenir.

**Arme débloquée.** Tu peux désormais expliquer pourquoi une API Node "lente" n'a souvent aucun problème de base de données : juste un `JSON.parse` de 30 Mo dans le mauvais handler.

---

### 4.4 : npm, pnpm et la gestion de dépendances

**Tag : NOYAU DURABLE** (le concept) / **PÉRISSABLE** (les commandes) · Prérequis : `00_getting_started/04_package_managers.md`

**Le vrai sujet n'est pas la commande d'installation.** C'est : _comment garantir que la machine de CI, celle de ta collègue et la prod exécutent exactement le même code ?_

| Concept              | Ce que c'est                             | Pourquoi ça compte                                                               |
| -------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| **Lockfile**         | l'arbre exact des versions résolues      | reproductibilité ; sans lui, un build peut casser sans qu'aucune ligne ne change |
| **SemVer**           | `major.minor.patch`                      | `^1.2.3` accepte `1.9.0` : un mainteneur peut casser en "mineur"                 |
| **Deps transitives** | dépendances de tes dépendances           | 90 % de ton `node_modules` que tu n'as jamais choisi                             |
| **`npm ci`**         | installe strictement le lockfile         | la commande de CI ; `npm install` peut modifier le lock                          |
| **peer deps**        | "j'ai besoin que _toi_ fournisses React" | source classique de conflits                                                     |

#### Ce que MyFunnyJS permet déjà de comprendre

Tu as déjà vu qu'installer une dépendance, c'est importer du code que tu n'as pas écrit et dont tu deviens responsable.

- `00_getting_started/04_package_managers.md` : résolution de versions, lockfile, arbre de dépendances : le problème est identique avec pip, Maven ou NuGet.
- `22_security/09_supply_chain_sbom.md` : chaque dépendance transitive est une surface d'attaque, pas une ligne gratuite.
- `22_security/10_audit_your_supply_chain.md` : la méthode d'audit que tu as déjà appliquée à un petit projet.
- `01_fundamentals/06_modules/01_import_export.md` : ce que tu importes détermine ce qui finit dans ton artefact.

**npm vs pnpm.** pnpm utilise un store global et des liens durs : installations plus rapides, disque économisé, et surtout **isolation stricte** : un paquet ne peut pas importer ce qu'il n'a pas déclaré. npm est le défaut universel. Yarn existe encore. Choisir : pnpm pour un monorepo ou une grosse équipe, npm pour tout le reste. Le débat ne mérite pas plus de trois minutes.

**Exemple qui casse.** Ton CI passe le lundi, échoue le mardi, sans commit entre les deux. Cause : un `npm install` (pas `ci`) a résolu une version mineure publiée dans la nuit, avec une régression. Correctif : `npm ci` partout, et Renovate/Dependabot pour des montées de version **visibles dans une PR**.

**Sécurité.** Typosquatting (`react-dom` vs `raect-dom`), scripts `postinstall` malveillants, compromission de mainteneur. Lis `22_security/09_supply_chain_sbom.md` et `22_security/10_audit_your_supply_chain.md` : ce module devient concret ici.

> **Exercice.** Sur un projet existant : liste les dépendances directes, puis compte le total transitif. Choisis-en une "petite" et évalue honnêtement si tu pourrais la remplacer par 20 lignes maison. Écris la décision et son compromis (maintenance vs surface d'attaque).

---

### 4.5 : TypeScript en conditions réelles

**Tag : PROFESSIONNELLE** (fortement installée) · Prérequis MyFunnyJS : module `14_typescript` complet

MyFunnyJS t'a donné le langage : génériques, types utilitaires, gardes de type, types conditionnels, `tsconfig`. TECH-ILA ne les réexplique pas. Ce qui change en entreprise :

#### Ce que MyFunnyJS permet déjà de comprendre

Le langage est acquis ; ce qui change en entreprise, c'est l'endroit où tu acceptes de faire confiance à un type.

- `14_typescript/` : génériques, gardes de type, unions discriminées, `tsconfig` : rien de tout ça n'est à réapprendre.
- `28_edge_cases/01_nan_undefined_null.md` : pourquoi `strictNullChecks` n'est pas un caprice de configuration.
- `01_fundamentals/04_types/02_type_coercion.md` : tout ce qui arrive d'une query string est une `string` ; le type ne le corrige pas, la validation si.
- `13_refactoring/03_code_smells.md` : un type de 40 lignes est un smell, exactement comme une fonction de 400 lignes.

**1. TypeScript ne protège pas les frontières.** Ton type `User` est effacé à l'exécution. Une réponse d'API mal formée passera à travers ton `as User` sans un bruit. La règle : **valider à la frontière**, typer à l'intérieur.

```ts
import { z } from "zod";

const MetricEvent = z.object({
  id: z.string().uuid(),
  kind: z.enum(["ingest", "retry", "drop"]),
  at: z.coerce.date(),
});
type MetricEvent = z.infer<typeof MetricEvent>; // le type dérive du schéma

export async function loadEvent(res: Response): Promise<MetricEvent> {
  return MetricEvent.parse(await res.json()); // jette si le contrat est violé
}
```

Un seul schéma, deux usages : validation runtime + type statique. C'est le patron le plus rentable de tout l'écosystème TS.

**2. `any` et `as` sont des dettes.** `as` dit au compilateur "tais-toi". Parfois nécessaire, jamais gratuit. Active `strict: true`, `noUncheckedIndexedAccess`, et interdis `any` implicite.

**3. Les types ne remplacent pas les tests.** Un type garantit la forme, pas le comportement. `06_testing/09_test_strategy_not_framework.md` reste valable.

**Ce que TS masque.** Le coût de compilation, la complexité des types trop malins. Un type de 40 lignes que personne ne relit est un code smell (`13_refactoring/03_code_smells.md`).

**Transférabilité.** Les génériques TS ↔ génériques Java/C#. Les unions discriminées ↔ `sealed interface` Java, records C#, `Union` Python. Le raisonnement "rendre les états impossibles inexprimables" est universel.

**Ce qui restera.** Le typage progressif, la validation aux frontières, la dérivation type-depuis-schéma. **Ce qui bougera.** La syntaxe des décorateurs, les types conditionnels exotiques, les flags de compilation.

> **Exercice.** Prends une fonction de ton mini-projet qui accepte `(status: string)`. Remplace par une union discriminée qui rend impossible l'état "annulé + date de fin". Le compilateur doit refuser le mauvais code. Vérification : commente ta garde de type et vérifie que TS gueule.

---

### 4.6 : HTTP et REST

**Tag : NOYAU DURABLE** · Prérequis MyFunnyJS : `17_web_concepts/01_http_rest_basics.md`, `01_fundamentals/05_web_basics/02_fetch_adventure.md`

Tu vas passer ta carrière à envoyer et recevoir des requêtes HTTP. C'est le protocole le plus rentable à connaître **en profondeur**.

#### Ce que MyFunnyJS permet déjà de comprendre

Tu as déjà envoyé des requêtes et géré leurs échecs ; HTTP ajoute surtout un vocabulaire de contrat entre deux machines.

- `17_web_concepts/01_http_rest_basics.md` : méthodes, codes, en-têtes : la base est posée.
- `01_fundamentals/05_web_basics/02_fetch_adventure.md` : timeouts, annulation, réponses inattendues : les pièges déjà rencontrés côté client.
- `05_error_handling/03_error_propagation.md` : un code HTTP est une propagation d'erreur à travers un réseau, avec perte de contexte.
- `17_web_concepts/04_caching_strategies.md` : `ETag` et `Cache-Control` sont la version réseau de ce que tu as déjà vu en mémoire.

**Ce qui compte vraiment :**

| Sujet       | Ce que tu dois pouvoir expliquer                                                                         |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| Méthodes    | pourquoi `PUT` est idempotent et `POST` non : et pourquoi ça change ta stratégie de retry                |
| Codes       | 4xx = le client a tort ; 5xx = tu as tort. Un 200 avec `{"error": ...}` est un mensonge                  |
| Idempotence | comment un client peut réessayer sans créer deux fois la même chose (clé d'idempotence)                  |
| Cache       | `ETag` (empreinte de version d'une ressource : le client la renvoie, le serveur répond 304 si rien n'a changé), `Cache-Control`, `stale-while-revalidate` (cf. `17_web_concepts/04_caching_strategies.md`)       |
| Contenu     | négociation, compression, streaming de réponses                                                          |
| Connexion   | keep-alive, HTTP/2 multiplexé, HTTP/3 sur QUIC                                                           |
| CORS        | ce n'est **pas** de la sécurité serveur, c'est une protection navigateur (`22_security/02_csrf_cors.md`) |

**Exemple qui casse.** Un client mobile perd le réseau après avoir envoyé un `POST /jobs`. Il réessaie. Le serveur crée deux jobs identiques, le pipeline traite deux fois, les métriques doublent. Correctif : le client envoie un header `Idempotency-Key`, le serveur stocke le résultat de la première requête et rejoue la même réponse. Ce n'est pas du code compliqué : c'est une **décision** que personne ne prend si personne n'y pense.

**REST : ce qu'on en garde.** Des ressources, des URLs stables, des verbes cohérents, des codes honnêtes. **Ce qu'on abandonne.** La chasse aux niveaux de maturité HATEOAS. Presque aucune équipe ne les applique, et ce n'est pas grave.

**Pont MyFunnyJS.** `21_api_craft/` tout entier, `05_error_handling/03_error_propagation.md` (un code HTTP est une propagation d'erreur à travers un réseau).

> **Exercice.** Avec `curl -v` uniquement, décris le cycle complet d'une requête vers une API publique : DNS, TLS, headers envoyés, headers reçus, cache, taille. Puis provoque un 4xx et un 5xx et explique la différence de responsabilité.

---

### 4.7 : SQL et PostgreSQL

**Tag : NOYAU DURABLE** (SQL et le modèle relationnel) / **PROFESSIONNELLE** (PostgreSQL) · Prérequis : `24_databases/01_sql_basics.md`, `24_databases/03_data_modeling.md`

Si tu ne dois investir sérieusement que dans **une** techno backend au-delà du langage, c'est celle-ci. SQL a 50 ans et sera là dans 20 ans.

#### Ce que MyFunnyJS permet déjà de comprendre

Une base de données n'introduit presque aucun concept nouveau : elle rend durables et concurrentes des structures que tu as déjà écrites.

- `09_data_structures/07_hash_table/` et `09_data_structures/06_bst/` : un index B-tree, c'est l'arbre que tu as déjà implémenté ; un index de hachage, la table que tu as déjà implémentée.
- `08_memory_performance/03_complexity/` : un `Seq Scan` sur 10 millions de lignes, c'est O(n), et tu sais ce que ça coûte.
- `28_edge_cases/05_race_condition_hunter.md` : un `if (await exists(x))` suivi d'un `insert` est la race condition que tu as déjà chassée, cette fois entre deux transactions.
- `28_edge_cases/02_floating_point.md` : pourquoi un montant se stocke en `NUMERIC` et jamais en flottant.

#### Ce que la DB ajoute

Durabilité, transactions, concurrence, contraintes. Une contrainte `UNIQUE` en base est **la seule** garantie d'unicité réelle. Un `if (await exists(x))` dans ton code est une race condition en attente (cf. `28_edge_cases/05_race_condition_hunter.md`).

#### Ce qu'elle masque

Le planificateur de requêtes. Il décide seul d'utiliser un index ou non, selon des statistiques. Il change d'avis quand le volume change. Ta requête rapide en dev peut devenir un scan complet en prod.

#### Notions essentielles

```text
Modélisation        clés, relations, normalisation, quand dénormaliser
Requêtes            JOIN, GROUP BY, window functions, CTE
Index               B-tree, partiel, composite, ordre des colonnes
Transactions        ACID, niveaux d'isolation, verrous, deadlocks
Plan d'exécution    EXPLAIN ANALYZE : la seule source de vérité
Migrations          versionnées, réversibles, compatibles en avant
```

#### Exemple réaliste : index composite

Une table d'événements d'ingestion, 40 millions de lignes. Requête du dashboard :

```sql
SELECT kind, count(*)
FROM ingest_event
WHERE tenant_id = $1 AND occurred_at >= now() - interval '7 days'
GROUP BY kind;
```

Sans index : 3,2 s. Avec `CREATE INDEX ON ingest_event (tenant_id, occurred_at)` : 40 ms. L'ordre des colonnes n'est pas décoratif : `tenant_id` d'abord parce que c'est l'égalité, `occurred_at` ensuite parce que c'est la plage. Inverse l'ordre et tu perds l'essentiel du gain.

**Preuve exigée :** `EXPLAIN (ANALYZE, BUFFERS)` avant et après. Sans mesure, ce n'est pas de l'optimisation, c'est de la superstition (`08_memory_performance/00_measure_first.md`).

#### Exemple qui casse : la migration qui bloque

```sql
ALTER TABLE ingest_event ADD COLUMN source text NOT NULL DEFAULT 'legacy';
```

Sur une version ancienne de PostgreSQL, cette commande réécrit toute la table en prenant un verrou exclusif. 40 millions de lignes, table bloquée plusieurs minutes, toutes les écritures en attente, timeouts en cascade. C'est un incident, pas une migration.

Le geste correct : ajouter la colonne nullable, remplir par lots, ajouter la contrainte ensuite. Principe général : **les migrations doivent être compatibles avec l'ancienne et la nouvelle version du code en même temps** (expand / migrate / contract).

#### Transactions et isolation

| Niveau                     | Ce qu'il empêche        | Coût                                  |
| -------------------------- | ----------------------- | ------------------------------------- |
| Read Committed (défaut PG) | lectures sales          | faible, mais lectures non répétables  |
| Repeatable Read            | lectures non répétables | erreurs de sérialisation à gérer      |
| Serializable               | toutes les anomalies    | conflits fréquents, retry obligatoire |

Retenir : plus tu montes, plus tu dois **gérer les échecs et rejouer**. Il n'y a pas de niveau gratuit.

#### ORM : le vrai compromis

|       | ORM (Prisma, TypeORM, Drizzle, Hibernate, EF Core)       | SQL direct                                                         |
| ----- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| Gain  | typage, migrations, moins de boilerplate                 | contrôle total, perf prévisible                                    |
| Coût  | requêtes générées parfois catastrophiques, N+1 invisible (une requête supplémentaire par élément d'une liste au lieu d'une seule) | plus de code, mapping manuel                                       |
| Piège | tu crois lire du JS, tu produis 200 requêtes             | injection SQL si tu concatènes (`22_security/01_xss_injection.md`) |

Position honnête : ORM pour le CRUD, SQL brut pour les requêtes analytiques et les cas chauds. Et tu regardes **toujours** le SQL généré au moins une fois.

#### Testing

Tests d'intégration sur un vrai PostgreSQL en conteneur, jamais sur un mock : ce que tu veux vérifier (index utilisé, contrainte violée, sérialisation en échec) n'existe que dans le vrai moteur. Chaque test tourne dans une transaction annulée à la fin, ou sur une base recréée par migration : c'est le même chemin qu'en production. Et tes migrations se testent aussi : appliquer, puis revenir en arrière.

#### Sécurité

Requêtes paramétrées, toujours : dès que tu concatènes, tu ouvres une injection SQL (`22_security/01_xss_injection.md`). Moindre privilège : l'utilisateur base de données de ton API n'a pas besoin de `DROP TABLE`. Et les niveaux d'isolation sont aussi un sujet de correction : au-dessus de Read Committed, tu dois gérer les échecs de sérialisation et rejouer, sinon une transaction perdue passe silencieusement.

#### Quand ne pas choisir PostgreSQL

- Cache éphémère à très haut débit → Redis.
- Données massivement non structurées avec schéma imprévisible → un document store peut se défendre.
- Analytique sur des milliards de lignes → moteur colonne (ClickHouse, DuckDB, BigQuery).

Mais commence par PostgreSQL. Il fait du JSONB, du plein-texte, des files simples, du géospatial. Beaucoup d'architectures à cinq bases auraient dû en avoir une.

#### Ce qui restera dans 10 ans

Le modèle relationnel, l'algèbre relationnelle, ACID, les index, la lecture d'un plan d'exécution. **Ce qui bougera** : la syntaxe d'un ORM précis, les options de config, les extensions.

> **Exercice.** Crée une table de 2 millions de lignes générées. Écris une requête lente (>1 s). Lis le plan. Ajoute un index. Relis le plan. Écris trois lignes : ce que le plan disait avant, après, et **pourquoi** l'index a changé la décision du planificateur. Piège : ajoute un index qui n'est **pas** utilisé, et explique pourquoi.

**Connexion activée.** Arbre binaire, complexité, hash table, race condition, transaction : cinq chapitres MyFunnyJS viennent de fusionner en un seul modèle mental appelé "base de données".

---

### 4.8 : Testing en conditions réelles

**Tag : NOYAU DURABLE** (stratégie) / **PÉRISSABLE** (le runner) · Prérequis : module `06_testing` complet

MyFunnyJS t'a appris la stratégie (`06_testing/09_test_strategy_not_framework.md`). Voici l'outillage professionnel actuel.

#### Ce que MyFunnyJS permet déjà de comprendre

La stratégie est acquise ; l'outillage ne fait que l'appliquer avec de vraies dépendances.

- `06_testing/09_test_strategy_not_framework.md` : quoi tester, à quelle granularité, et pourquoi le runner est un détail.
- `06_testing/03_mocking_madness.md` : mocker la base, c'est tester ton mock : Testcontainers existe pour ça.
- `06_testing/04_integration_reactor.md` : le test qui traverse plusieurs couches est celui qui attrape les bugs réels.
- `04_debugging/04_repro_before_fix.md` : un test qui échoue d'abord est la preuve qu'un correctif corrige quelque chose.

| Outil               | Rôle                                              | Tag                      |
| ------------------- | ------------------------------------------------- | ------------------------ |
| **Vitest**          | tests unitaires et d'intégration, écosystème Vite | PROFESSIONNELLE          |
| **Jest**            | historique, encore massivement en place           | PROFESSIONNELLE          |
| **node:test**       | runner natif, zéro dépendance                     | NOYAU DURABLE (tendance) |
| **Playwright**      | end-to-end navigateur, multi-navigateurs          | PROFESSIONNELLE          |
| **Testing Library** | tests de composants orientés utilisateur          | PROFESSIONNELLE          |
| **Testcontainers**  | vraie base dans un conteneur jetable              | PROFESSIONNELLE          |
| **MSW**             | interception réseau réaliste                      | CONTEXTUELLE             |

**La règle qui survit à tous les runners :** teste le **comportement observable**, pas l'implémentation. Un test qui casse à chaque refactoring sans bug réel est un coût, pas une protection.

**Exemple qui casse.** Suite verte en CI, bug en prod : les tests mockaient la base. Le mock renvoyait toujours les lignes triées ; PostgreSQL sans `ORDER BY` ne garantit rien. Correctif : Testcontainers avec un vrai PostgreSQL. Le test devient plus lent et enfin utile.

> **Exercice.** Prends un test existant. Casse volontairement l'implémentation **sans** casser le comportement (renomme une variable interne, extrais une fonction). Si le test échoue, il testait la mauvaise chose. Réécris-le.

---

### 4.9 : Docker et conteneurisation

**Tag : PROFESSIONNELLE** (Docker) / **NOYAU DURABLE** (l'isolation et l'immutabilité) · Prérequis : `15_runtime_env/04_process_env_argv.md`

**Le problème résolu :** "ça marche sur ma machine". Un conteneur emballe l'app **et** son environnement d'exécution.

**Modèle mental.** Une image est un empilement de couches en lecture seule. Un conteneur est un process isolé (namespaces + cgroups Linux) qui monte cette image. **Ce n'est pas une VM** : pas de noyau séparé, démarrage en millisecondes.

#### Ce que MyFunnyJS permet déjà de comprendre

Un conteneur ne change pas ton code : il rend visibles les hypothèses que ton code faisait sur son environnement.

- `15_runtime_env/04_process_env_argv.md` : configuration par variables d'environnement et signaux : `SIGTERM` et l'arrêt gracieux sont exactement le sujet de `docker stop`.
- `00_getting_started/02_shell_survival.md` : uid, permissions, `ls -ln` : la moitié des `permission denied` d'un conteneur se lisent là.
- `08_memory_performance/01_gc/` : une limite mémoire de conteneur ne crée pas la fuite, elle la révèle plus tôt.
- `15_runtime_env/03_commonjs_vs_esm.md` : ce qui casse au build dans l'image casse pour les mêmes raisons qu'en local.

**Exemple réaliste : image multi-étages**

```dockerfile
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci                       # couche cachée tant que les deps ne changent pas
COPY . .
RUN npm run build

FROM node:22-slim AS run
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node                        # jamais root
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

Copier `package*.json` **avant** le code n'est pas de la coquetterie : c'est ce qui fait passer ton build de 4 minutes à 20 secondes grâce au cache de couches.

**Pièges fréquents :**

| Piège                        | Conséquence                                          |
| ---------------------------- | ---------------------------------------------------- |
| Tourner en root              | escalade de privilèges si l'app est compromise       |
| Secrets dans le `Dockerfile` | ils restent dans l'historique des couches, à jamais  |
| Pas de `.dockerignore`       | tu envoies `node_modules` et `.git` au build         |
| Tag `latest` en prod         | tu ne sais plus quelle version tourne                |
| Pas de healthcheck           | l'orchestrateur route du trafic vers un process mort |
| Ignorer `SIGTERM`            | requêtes coupées à chaque déploiement                |

**Ce que Docker ne résout pas.** Une app mal écrite reste mal écrite. Une fuite mémoire est juste redémarrée plus souvent. Et un `docker-compose.yml` de 400 lignes est une architecture qui a échoué.

**Quand ne pas conteneuriser.** Un script ponctuel, un site statique, une fonction serverless. Le conteneur a un coût opérationnel (registre, build, scan de vulnérabilités).

**Kubernetes ?** **CONTEXTUELLE**. Puissant, et un coût de complexité énorme. Tu n'en as pas besoin pour trois services. Apprends-en le vocabulaire (pod, service, deployment, ingress) pour lire les offres et les conversations ; approfondis seulement si une mission l'exige.

> **Exercice.** Conteneurise un de tes mini-projets. Contraintes : image finale < 200 Mo, utilisateur non root, arrêt gracieux vérifié (`docker stop` ne doit couper aucune requête en vol), healthcheck. Vérification : `docker stats` pendant une charge avec `autocannon`.

---

### 4.10 : Déploiement de base

**Tag : PROFESSIONNELLE** · Prérequis : `26_observability/06_debug_in_prod.md`

Ce que tu dois comprendre, quel que soit l'hébergeur :

```text
code poussé
    ↓ build reproductible (CI)
artefact immuable (image, bundle)
    ↓ config injectée par l'environnement (jamais dans l'artefact)
déploiement progressif (rolling / canary)
    ↓ healthcheck
trafic basculé
    ↓ observation (erreurs, latence, saturation)
rollback possible en une commande
```

#### Ce que MyFunnyJS permet déjà de comprendre

Tu connais déjà les trois mécanismes qui font tenir ce schéma.

- `15_runtime_env/04_process_env_argv.md` : la config vient de l'environnement, jamais de l'artefact : c'est la règle n°1 ci-dessous, déjà pratiquée.
- `26_observability/06_debug_in_prod.md` : un déploiement sans observation est un pari ; tu sais déjà quoi regarder.
- `22_security/09_supply_chain_sbom.md` : l'artefact promu contient tout ce que tu as installé, y compris ce que tu n'as pas choisi.
- `05_error_handling/05_error_strategy.md` : décider à l'avance ce qui déclenche un rollback est une stratégie d'erreur, pas une improvisation.

**Les trois règles.** (1) L'artefact est identique de la préprod à la prod, seule la config change. (2) Tout déploiement doit pouvoir revenir en arrière. (3) Un déploiement sans observation n'est pas un déploiement, c'est un pari.

**Variables d'environnement et secrets.** Les secrets ne sont ni dans Git, ni dans l'image, ni dans le bundle frontend. Un `VITE_API_KEY` dans du code client est **public**, même minifié. C'est une des fuites les plus fréquentes chez les juniors.

**Plateformes.** PaaS (déploiement en une commande, cher à l'échelle), conteneurs managés, VM classique, serverless (démarrage à froid, contraintes d'exécution). Toutes **PÉRISSABLES** dans leurs détails, toutes identiques dans le schéma ci-dessus.

> **Exercice.** Déploie un de tes mini-projets sur une plateforme gratuite, puis prouve la règle n°1 : le **même** artefact tourne en préprod et en prod, seule la config change. Contraintes : une variable d'environnement différente entre les deux, aucun secret dans l'image ni dans le bundle, un rollback exécuté en une commande. Réutilise `15_runtime_env/04_process_env_argv.md` : la config est lue au démarrage, validée, et le service refuse de démarrer si une variable obligatoire manque. Piège réaliste : glisse volontairement une clé dans une variable préfixée pour le client, déploie, puis retrouve-la dans le bundle téléchargé par le navigateur. À observer : l'empreinte de l'artefact déployé dans les deux environnements, le message d'erreur au démarrage sans la variable, et l'endroit exact où la clé apparaît en clair. Vérification : après rollback, la version précédente répond et le healthcheck repasse au vert. Extension : que se passe-t-il si la variable manquante n'est lue qu'au premier appel d'une route rare, trois jours après le déploiement ?

**Seuil franchi.** Le niveau 1 est le seul dont aucune ligne ne sera obsolète dans dix ans. Si tu l'as vraiment, tu peux apprendre n'importe quel framework par-dessus : c'est exactement ce que teste un entretien senior.

---
