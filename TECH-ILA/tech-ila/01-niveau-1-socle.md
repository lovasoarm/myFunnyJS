---
statut: revu
last_reviewed: 2026-08
proprietaire: mainteneur TECH-ILA
revue: trimestrielle
companion: MyFunnyJS
---

[← Sommaire TECH-ILA](../README.md)

> **Tu viens de** : [00-orientation.md](./00-orientation.md) — la grille d'admission et le test du zéro outil.
> **Tu dois déjà savoir** : utiliser un terminal basique, avoir écrit du JavaScript/TypeScript avec MyFunnyJS jusqu'au module `14_typescript`, avoir un projet Node minimal qui tourne en local.
> **Ensuite** : [02-niveau-2-frontend.md](./02-niveau-2-frontend.md) — React, Next.js, formulaires et accessibilité.

# Niveau 1 : Socle professionnel (section 4)

---

## 4 : Niveau 1 : Socle professionnel

Tout ce qui suit est vrai que tu fasses du web, du mobile, de la data ou de l'embarqué. C'est le seul niveau où presque tout est **NOYAU DURABLE**.

### 4.1 : Terminal et Linux

**Terminal et Linux** — Tag : NOYAU DURABLE · Coût : ~8 h avant utilité · Durée de vie : ~30 ans · À apprendre après : rien, c'est le point de départ.

**Pourquoi ça existe.** Une machine de production n'a pas d'interface graphique. Le jour où ton service tombe à 3h du matin, tu as un SSH, un shell, et rien d'autre.

- **Ancrage MyFunnyJS** : [00_getting_started/02_shell_survival.md](../../00_getting_started/02_shell_survival.md) — navigation, pipes, redirections : c'est exactement la chaîne `tail -f | grep` que tu utiliseras en incident.
- **Ce qu'elle ajoute** : un accès direct au système — processus, permissions, signaux, réseau — sans interface graphique entre toi et la machine.
- **Ce qu'elle masque** : le fait qu'une commande "qui marche chez toi" dépend de la version du shell, du `PATH`, des locales et des droits de l'utilisateur courant — rien de tout ça n'est visible dans la commande elle-même.
- **Ce qu'elle ne résout pas** : elle ne t'apprend pas à lire un code source ni à comprendre une architecture ; c'est un outil d'observation et d'action, pas de compréhension.
- **Quand ne pas la choisir** : pas avant que tu aies un vrai besoin d'agir sur une machine distante ou un incident à diagnostiquer — apprendre 40 flags par cœur sans les avoir utilisés une fois ne sert à rien.
- **Exemple qui casse** : ton conteneur Docker écrit dans `/data`, monté depuis l'hôte. Le process tourne en `uid 1000`, le dossier appartient à `root`. Ton app plante avec `EACCES: permission denied, open '/data/output.log'`. Aucune ligne de JavaScript n'est en cause.
- **Preuve que c'est acquis** : tu sais lire `ls -ln` et expliquer un `permission denied` sans changer une ligne de code. **Si tu bloques, reviens à** : [00_getting_started/02_shell_survival.md](../../00_getting_started/02_shell_survival.md).

#### Ce que MyFunnyJS permet déjà de comprendre

Tu as déjà manipulé un shell et écrit des scripts qui parlent au système ; il ne reste qu'à transposer ces gestes sur une machine sans interface graphique.

- [00_getting_started/02_shell_survival.md](../../00_getting_started/02_shell_survival.md) : navigation, pipes, redirections.
- [15_runtime_env/06_node_cli_scripts/](../../15_runtime_env/06_node_cli_scripts/) : tu as déjà lu `process.argv` et le système de fichiers depuis du code ; un script shell et un script Node résolvent le même problème avec deux vocabulaires.
- [15_runtime_env/02_streams_buffers.md](../../15_runtime_env/02_streams_buffers.md) : un pipe Unix est un stream, et la backpressure que tu connais en Node y est le même mécanisme.
- [15_runtime_env/04_process_env_argv.md](../../15_runtime_env/04_process_env_argv.md) : `export`, `env`, `printenv` : la configuration par l'environnement, déjà pratiquée.

**Ce que tu dois savoir faire sans réfléchir :**

| Geste                      | Commande type                                 | Quand                         |
| -------------------------- | ---------------------------------------------- | ----------------------------- |
| Trouver qui mange le CPU   | `top`, `htop`                                  | incident perf                 |
| Suivre un log qui grossit  | `tail -f app.log \| grep ERROR`                | debug prod                    |
| Trouver un fichier         | `find . -name '*.env'`, `rg "TODO"`            | audit codebase                |
| Voir ce qui écoute un port | `ss -tlnp`, `lsof -i :3000`                    | "port already in use"         |
| Enchaîner du texte         | `cat x.csv \| cut -d, -f2 \| sort \| uniq -c`  | analyse rapide                |
| Comprendre les permissions | `ls -l`, `chmod`, `chown`                      | "permission denied" en Docker |
| Variables d'environnement  | `export`, `env`, `printenv`                    | config d'app                  |

**Ce qui restera dans 10 ans.** Les pipes, les flux, les codes de sortie, les permissions, les signaux (`SIGTERM`, `SIGKILL`). Ce sont les mêmes concepts que les streams Node ([15_runtime_env/02_streams_buffers.md](../../15_runtime_env/02_streams_buffers.md)).

**Ce qu'il ne faut pas mémoriser.** Les 40 flags de `tar`. Personne ne les connaît. `man` existe.

> **Exercice — Top 5 des erreurs en une ligne**
> **Temps réaliste** : 30 min · **Prérequis matériel / compte** : un terminal, un de tes mini-projets MyFunnyJS · **Coût max** : 0 €
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : une seule ligne de shell, pas de script Node
> **Réutilise** : [30_mini_projects/](../../30_mini_projects/) — un fichier de log existant ou généré par ton projet
> **Piège** : un fichier vide ou sans erreur ne doit pas faire planter la commande
> **À observer** : l'ordre de tri change selon que tu comptes avant ou après avoir extrait le message
> **Vérification** (observable, chiffrée) : relance la commande sur un fichier vide — elle doit rendre une sortie vide et un code de sortie 0, jamais une erreur
> **Repli 100 % local et gratuit** : exercice déjà 100 % local, aucun repli nécessaire
> **Extension** : adapte la commande pour qu'elle tourne aussi sur un flux `tail -f` en continu, sans relancer le pipeline à chaque nouvelle ligne

---

### 4.2 : Git et GitHub

**Git et GitHub** — Tag : NOYAU DURABLE · Coût : ~10 h avant utilité · Durée de vie : ~25 ans · À apprendre après : le terminal (4.1).

**Quel problème ça résout.** Pas "sauvegarder du code". Git résout : _plusieurs cerveaux modifient la même vérité en parallèle et doivent réconcilier_. C'est un problème de systèmes distribués déguisé en outil (cf. [25_scalability/01_distributed_thinking.md](../../25_scalability/01_distributed_thinking.md)).

**Le modèle mental à avoir.** Git n'est pas un historique de fichiers, c'est un **graphe orienté acyclique de snapshots**. Chaque commit pointe vers son ou ses parents. Une branche est un simple pointeur mobile. Quand tu as ce modèle, `rebase`, `cherry-pick` et `reflog` cessent d'être de la magie.

- **Ancrage MyFunnyJS** : [01_fundamentals/08_git_core.md](../../01_fundamentals/08_git_core.md) — commits, branches, fusion : le graphe de snapshots est déjà en place dans ta tête.
- **Ce qu'elle ajoute** : un historique complet et distribué, la capacité de revenir à n'importe quel état passé, et un langage commun pour réconcilier le travail de plusieurs personnes.
- **Ce qu'elle masque** : GitHub crée l'illusion que "merge" est un bouton. Le vrai travail — comprendre pourquoi deux versions divergent — reste entier ; l'interface ne fait que déclencher la même commande `git merge` que tu aurais tapée toi-même.
- **Ce qu'elle ne résout pas** : une mauvaise découpe de commits reste illisible même avec une belle pull request. Git ne rend pas une histoire cohérente qui ne l'était pas au moment d'écrire les commits.
- **Quand ne pas la choisir** : pas avant que tu travailles à plusieurs ou que tu aies besoin de revenir en arrière — un script solo d'un après-midi n'a pas besoin d'un dépôt.
- **Exemple qui casse** : tu fais `git push --force` sur une branche partagée après un rebase. Un collègue avait déjà récupéré l'ancienne histoire. Son prochain `git pull` répond `fatal: Need to specify how to reconcile divergent branches` et son travail local risque d'être écrasé au prochain merge sauvage.
- **Preuve que c'est acquis** : tu retrouves, dans un dépôt que tu ne connais pas, le commit qui a introduit un bug via `git bisect`, sans lire une seule ligne de documentation. **Si tu bloques, reviens à** : [00_getting_started/03_git_101.md](../../00_getting_started/03_git_101.md).

#### Ce que MyFunnyJS permet déjà de comprendre

L'outil est déjà couvert ; ce qui manque, c'est le réflexe d'aller chercher une intention dans l'historique.

- [01_fundamentals/08_git_core.md](../../01_fundamentals/08_git_core.md) : commits, branches, fusion : le graphe de snapshots est déjà en place dans ta tête.
- [00_getting_started/03_git_101.md](../../00_getting_started/03_git_101.md) : les gestes quotidiens et l'hygiène de commit.
- [04_debugging/05_hypothesis_driven_debug.md](../../04_debugging/05_hypothesis_driven_debug.md) : `git bisect` n'est que ta dichotomie d'hypothèses appliquée à l'historique.
- [27_team_craft/04_navigate_codebase.md](../../27_team_craft/04_navigate_codebase.md) : sur du legacy, `git log` est la meilleure documentation disponible.
- [25_scalability/01_distributed_thinking.md](../../25_scalability/01_distributed_thinking.md) : deux dépôts qui divergent puis réconcilient, c'est un problème distribué déguisé en outil.

```text
main      A───B───C
                   \
feature             D───E     ← branche = pointeur sur E
```

**Ce que tu dois savoir faire :**

- lire l'historique d'un fichier pour comprendre _pourquoi_ une ligne existe (`git log -p --follow chemin`) ;
- retrouver le commit qui a introduit un bug (`git bisect`) ;
- récupérer un travail perdu (`git reflog`) ;
- résoudre un conflit sans écraser le travail des autres ;
- écrire un message de commit qui explique **pourquoi**, pas **quoi**.

**Piège fréquent.** `git push --force` sur une branche partagée. Utilise `--force-with-lease` : il refuse si quelqu'un a poussé entre-temps.

**Alternatives crédibles.** Mercurial (rare, PÉRISSABLE), Jujutsu (`jj`, émergent, PÉRISSABLE pour l'instant, mécanisme MyFunnyJS inchangé : toujours un graphe de snapshots), Perforce (jeu vidéo, gros binaires, mécanisme MyFunnyJS inchangé : verrouillage centralisé au lieu d'un graphe distribué).

**Pont MyFunnyJS.** [27_team_craft/01_code_review.md](../../27_team_craft/01_code_review.md) (la PR est le support de la revue), [27_team_craft/04_navigate_codebase.md](../../27_team_craft/04_navigate_codebase.md) (l'historique est ta meilleure doc sur du legacy).

> **Exercice — Archéologie de dépôt**
> **Temps réaliste** : 1 h 30 · **Prérequis matériel / compte** : Git installé, accès à un dépôt open source public · **Coût max** : 0 €
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : ne pas lire le README ; tout doit venir de l'historique et du code
> **Réutilise** : [27_team_craft/04_navigate_codebase.md](../../27_team_craft/04_navigate_codebase.md)
> **Piège** : le point d'entrée n'est presque jamais `index.js`
> **À observer** : le style des messages de commit change-t-il selon l'auteur ou dans le temps ?
> **Vérification** (observable, chiffrée) : tu identifies nommément le point d'entrée, le commit exact (hash court) qui a introduit la fonctionnalité principale, et une décision d'architecture visible dans l'historique — le tout en 10 lignes écrites
> **Repli 100 % local et gratuit** : clone un de tes propres mini-projets MyFunnyJS si aucun accès réseau n'est disponible
> **Extension** : refais le même exercice avec `git log --all --graph --oneline` pour visualiser les branches abandonnées

**Réflexe gagné.** Devant du code incompréhensible, ton premier geste n'est plus "je réécris". C'est `git log`. Tu cherches l'intention avant de juger le résultat.

---

### 4.3 : Node.js

**Node.js** — Tag : PROFESSIONNELLE (le runtime) / NOYAU DURABLE (les concepts) · Coût : ~15 h avant utilité · Durée de vie : ~8 ans pour le runtime, ~20 ans pour les concepts · À apprendre après : Git (4.2), npm (4.4).

#### Pourquoi elle existe

Exécuter du JavaScript hors du navigateur, avec des I/O non bloquantes. L'idée fondatrice : un seul thread, une boucle d'événements, et tout ce qui attend (disque, réseau) est délégué au système.

#### Quel problème elle résout

Les serveurs classiques ouvraient un thread par connexion. 10 000 connexions = 10 000 threads = mémoire explosée. Node répond : un thread, des milliers de connexions, tant que le travail est **I/O-bound** (limité par l'attente réseau/disque) et non **CPU-bound** (limité par le calcul).

- **Ancrage MyFunnyJS** : [03_async/04_event_loop/](../../03_async/04_event_loop/) — tu sais déjà pourquoi une microtâche passe avant un `setTimeout`. C'est exactement ce qui explique pourquoi ton handler HTTP répond avant ton log.
- **Ce qu'elle ajoute** : un accès système (`fs`, `net`, `http`, `crypto`, `worker_threads`, `child_process`), un modèle de modules, un écosystème npm gigantesque.
- **Ce qu'elle masque** : l'epoll/kqueue du système et le pool de threads libuv (4 threads par défaut) utilisé pour le disque, le DNS et certaines opérations crypto. Tu ne le vois pas — jusqu'au jour où ton hachage bcrypt synchrone bloque tout.
- **Ce qu'elle ne résout pas** : le CPU-bound (une boucle de calcul de 2 secondes gèle toutes les requêtes), la mémoire (le heap V8 a une limite), la cohérence entre plusieurs instances.
- **Quand ne pas la choisir** : pas avant d'avoir vérifié que ton travail est I/O-bound — pour du calcul lourd continu (traitement d'images, ML, simulation), pas avant d'avoir écarté Python, Go ou Rust.
- **Exemple qui casse** : un pipeline lit un fichier entier en mémoire avec `readFile` sur un export de 4 Go. Sur ta machine de dev avec un échantillon de 5 Mo, ça passe. En production : `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`, le conteneur est tué par l'orchestrateur (OOMKill), et le redémarrage relance le traitement depuis zéro.
- **Preuve que c'est acquis** : tu sais expliquer pourquoi une API Node "lente" n'a souvent aucun problème de base de données — juste un `JSON.parse` de 30 Mo dans le mauvais handler. **Si tu bloques, reviens à** : [03_async/04_event_loop/](../../03_async/04_event_loop/).

#### Ce que MyFunnyJS permet déjà de comprendre

- [03_async/04_event_loop/](../../03_async/04_event_loop/) : tu sais déjà pourquoi une microtâche passe avant un `setTimeout`.
- [03_async/06_backpressure.md](../../03_async/06_backpressure.md) : tu sais que si tu lis plus vite que tu n'écris, la mémoire monte. C'est le bug n°1 des pipelines de fichiers en Node.
- [15_runtime_env/02_streams_buffers.md](../../15_runtime_env/02_streams_buffers.md) : les streams ne sont pas une API exotique, c'est le modèle central de Node.
- [08_memory_performance/01_gc/](../../08_memory_performance/01_gc/) : un serveur Node qui vit des semaines révèle toutes les fuites qu'un script de 3 secondes cachait.

#### Exemple minimal

```js
import { createServer } from "node:http";

createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
}).listen(3000);
```

#### Exemple réaliste : traitement de fichier volumineux

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
// MAUVAIS : le fichier entier atterrit en mémoire
const data = await readFile("metrics-4gb.log", "utf8");
for (const line of data.split("\n")) {
  /* ... */
}
```

Message obtenu en production sur le fichier de 4 Go : `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`. Le diagnostic vient de [08_memory_performance/04_profiling/](../../08_memory_performance/04_profiling/) : heap snapshot, tu vois une seule string géante. Pas besoin de deviner.

#### Pièges fréquents

| Piège                                 | Symptôme                                     | Cause réelle                                                           |
| ------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| Travail CPU dans le handler           | latence de **toutes** les routes             | event loop bloquée                                                       |
| `await` dans une boucle sur 500 items | lenteur linéaire                             | pas de parallélisme (`Promise.all` avec limite de concurrence)           |
| `Promise.all` sur 5 000 items         | explosion réseau, timeouts                   | pas de limite de concurrence                                             |
| État en variable module               | bug qui n'apparaît qu'en prod multi-instance | tu as supposé un seul process                                            |
| `process.exit()` dans un handler      | requêtes coupées en vol                      | pas d'arrêt gracieux                                                     |
| Erreur async non catchée              | crash silencieux du process                  | `unhandledRejection` (cf. [05_error_handling/04_async_error_traps.md](../../05_error_handling/04_async_error_traps.md)) |

#### Décisions d'architecture

- **Un ou plusieurs process ?** Node est mono-thread : utilise `cluster` ou plusieurs conteneurs pour exploiter tous les cœurs. Conséquence immédiate : plus de session en mémoire, plus de cache local fiable.
- **Où mettre l'état ?** Réponse par défaut : la base de données ou Redis. Pas la RAM du process.
- **Arrêt gracieux.** Sur `SIGTERM`, tu arrêtes d'accepter, tu finis les requêtes en cours, tu fermes les connexions DB, puis tu sors.

#### Testing

Vitest ou le runner natif `node:test`. Les tests d'intégration frappent un vrai serveur HTTP éphémère. Base de données : vrai PostgreSQL dans un conteneur, pas un mock. Cf. [06_testing/04_integration_reactor.md](../../06_testing/04_integration_reactor.md) et [06_testing/03_mocking_madness.md](../../06_testing/03_mocking_madness.md).

#### Sécurité

[22_security/09_supply_chain_sbom.md](../../22_security/09_supply_chain_sbom.md) prend tout son sens ici : un `npm install` tire des centaines de paquets transitifs. Verrouille le lockfile, active `npm audit` en CI, épingle les versions, méfie-toi des paquets installés hier par un compte inconnu.

#### Performance

Mesure avant d'optimiser ([08_memory_performance/00_measure_first.md](../../08_memory_performance/00_measure_first.md)). Outils : `node --inspect` + DevTools, `node --cpu-prof`, clinic.js (PROFESSIONNELLE, mécanisme MyFunnyJS : profiling du même event loop), autocannon (CONTEXTUELLE, mécanisme MyFunnyJS : génération de charge pour observer la backpressure). Métrique reine côté serveur : le **lag de l'event loop**. Si elle dépasse 50 ms, quelque chose bloque.

#### Observabilité

Logs structurés JSON (pino — PROFESSIONNELLE, mécanisme MyFunnyJS : sérialisation structurée plutôt que `console.log`), un `request_id` propagé partout, métriques exportées. Cf. [26_observability/01_structured_logging.md](../../26_observability/01_structured_logging.md).

#### Déploiement

Conteneur Docker, image `node:XX-slim` ou distroless (image minimale sans shell ni gestionnaire de paquets, réduisant la surface d'attaque — voir 4.9 pour le détail), utilisateur non root, `NODE_ENV=production`, healthcheck HTTP.

#### Alternatives

| Alternative           | Ce qu'elle change                                                            | Ce qui reste identique (mécanisme MyFunnyJS)   |
| --------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------ |
| Deno (PROFESSIONNELLE) | TS natif, sécurité par permissions                                            | event loop, modèle async ([03_async/04_event_loop/](../../03_async/04_event_loop/)) |
| Bun (PÉRISSABLE)       | démarrage rapide, runtime tout-en-un, jeune sur les détails                    | JS, async, npm                                    |
| Go (CONTEXTUELLE)      | vraie concurrence, goroutines, binaire unique                                 | pas d'event loop mono-thread — modèle différent   |
| Python/FastAPI (CONTEXTUELLE) | async aussi, écosystème data                                            | modèle async/await très proche ([03_async/04_event_loop/](../../03_async/04_event_loop/)) |

#### Ce qui restera valable dans 5 à 10 ans

L'event loop, la distinction I/O-bound / CPU-bound, la backpressure, l'arrêt gracieux, la propagation d'erreurs async.

#### Ce qu'il ne faut surtout pas mémoriser

La signature exacte de `fs.promises`, la liste des flags V8, l'API de `worker_threads`. Doc ouverte, toujours.

> **Exercice — Pipeline mémoire constante**
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : Node installé localement · **Coût max** : 0 €
> **Mode** : assistant autorisé pour la recherche d'API, jeûne d'IA obligatoire pour l'écriture du code
> **Contraintes** : mémoire constante quelle que soit la taille du fichier source, arrêt gracieux sur `SIGTERM`, un `request_id` dans chaque log
> **Réutilise** : [15_runtime_env/02_streams_buffers.md](../../15_runtime_env/02_streams_buffers.md)
> **Piège** : la source distante coupe la connexion à mi-parcours — que renvoies-tu au client ?
> **À observer** : la courbe de mémoire du process pendant tout le traitement
> **Vérification** (observable, chiffrée) : lance le service avec `--max-old-space-size=128` sur un fichier de 1 Go généré localement ; il doit tenir sans `heap out of memory`
> **Repli 100 % local et gratuit** : génère le fichier de 1 Go toi-même avec un script au lieu de le télécharger
> **Extension** : ajoute une limite de débit pour ne pas saturer le disque local pendant le test

**Arme débloquée.** Tu peux désormais expliquer pourquoi une API Node "lente" n'a souvent aucun problème de base de données : juste un `JSON.parse` de 30 Mo dans le mauvais handler.

---

### 4.4 : npm, pnpm et la gestion de dépendances

**npm et pnpm** — Tag : NOYAU DURABLE (le concept) / PÉRISSABLE (les commandes) · Coût : ~4 h avant utilité · Durée de vie : ~5 ans pour les commandes, ~20 ans pour le concept de résolution de dépendances · À apprendre après : Node (4.3).

**Le vrai sujet n'est pas la commande d'installation.** C'est : _comment garantir que la machine de CI, celle de ta collègue et la prod exécutent exactement le même code ?_

- **Ancrage MyFunnyJS** : [00_getting_started/04_package_managers.md](../../00_getting_started/04_package_managers.md) — résolution de versions, lockfile, arbre de dépendances : le problème est identique avec pip, Maven ou NuGet.
- **Ce qu'elle ajoute** : un arbre de dépendances résolu et reproductible, une convention de versionnage (SemVer), un registre public.
- **Ce qu'elle masque** : 90 % de ton `node_modules` que tu n'as jamais choisi toi-même — les dépendances transitives. Un `npm install` (sans lockfile figé) peut faire tourner un code différent d'un jour à l'autre sans qu'aucune ligne de ton projet ne change.
- **Ce qu'elle ne résout pas** : la confiance dans le code que tu installes. Un paquet compromis publié en mineur passe le lockfile si tu ne l'as pas encore figé.
- **Quand ne pas la choisir** : pas avant d'avoir un vrai besoin d'une dépendance externe — pas avant que 20 lignes maison ne suffisent plus.
- **Exemple qui casse** : ton CI passe le lundi, échoue le mardi, sans commit entre les deux. La commande `npm install` (pas `ci`) a résolu une version mineure publiée dans la nuit avec une régression. Le message en CI est un échec de test métier, pas une erreur d'installation — rien n'indique la vraie cause.
- **Preuve que c'est acquis** : tu peux expliquer pourquoi `npm ci` est la commande de CI et jamais `npm install`. **Si tu bloques, reviens à** : [00_getting_started/04_package_managers.md](../../00_getting_started/04_package_managers.md).

| Concept              | Ce que c'est                             | Pourquoi ça compte                                                               |
| -------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| Lockfile              | l'arbre exact des versions résolues       | reproductibilité ; sans lui, un build peut casser sans qu'aucune ligne ne change  |
| SemVer                | `major.minor.patch`                       | `^1.2.3` accepte `1.9.0` : un mainteneur peut casser en "mineur"                   |
| Deps transitives      | dépendances de tes dépendances            | 90 % de ton `node_modules` que tu n'as jamais choisi                              |
| `npm ci`              | installe strictement le lockfile          | la commande de CI ; `npm install` peut modifier le lock                           |
| peer deps             | "j'ai besoin que _toi_ fournisses React"  | source classique de conflits                                                       |

#### Ce que MyFunnyJS permet déjà de comprendre

- [00_getting_started/04_package_managers.md](../../00_getting_started/04_package_managers.md) : résolution de versions, lockfile, arbre de dépendances.
- [22_security/09_supply_chain_sbom.md](../../22_security/09_supply_chain_sbom.md) : chaque dépendance transitive est une surface d'attaque, pas une ligne gratuite.
- [22_security/10_audit_your_supply_chain.md](../../22_security/10_audit_your_supply_chain.md) : la méthode d'audit que tu as déjà appliquée à un petit projet.
- [01_fundamentals/06_modules/01_import_export.md](../../01_fundamentals/06_modules/01_import_export.md) : ce que tu importes détermine ce qui finit dans ton artefact.

**npm vs pnpm.** pnpm utilise un store global et des liens durs : installations plus rapides, disque économisé, et surtout **isolation stricte** : un paquet ne peut pas importer ce qu'il n'a pas déclaré. npm est le défaut universel. Yarn (PROFESSIONNELLE, mécanisme MyFunnyJS inchangé) existe encore. Choisir : pnpm pour un monorepo ou une grosse équipe, npm pour tout le reste.

**Sécurité.** Typosquatting (`react-dom` vs `raect-dom`), scripts `postinstall` malveillants, compromission de mainteneur. Lis [22_security/09_supply_chain_sbom.md](../../22_security/09_supply_chain_sbom.md) et [22_security/10_audit_your_supply_chain.md](../../22_security/10_audit_your_supply_chain.md).

> **Exercice — Auditer sa propre supply chain**
> **Temps réaliste** : 1 h · **Prérequis matériel / compte** : un projet Node existant avec un `package.json` · **Coût max** : 0 €
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : évaluer honnêtement, pas rhétoriquement
> **Réutilise** : [22_security/10_audit_your_supply_chain.md](../../22_security/10_audit_your_supply_chain.md)
> **Piège** : une dépendance qui semble petite (une seule fonction) traîne souvent 5 à 10 paquets transitifs
> **À observer** : le nombre de dépendances transitives comparé au nombre de dépendances directes
> **Vérification** (observable, chiffrée) : liste les dépendances directes, compte le total transitif via `npm ls --all | wc -l`, choisis-en une "petite" et écris la décision — la remplacer par du code maison ou la garder — avec son compromis chiffré (nombre de lignes maison vs nombre de paquets transitifs retirés)
> **Repli 100 % local et gratuit** : exercice déjà 100 % local
> **Extension** : configure `npm audit` en échec de CI si une vulnérabilité de sévérité haute est trouvée

---

### 4.5 : TypeScript en conditions réelles

**TypeScript** — Tag : PROFESSIONNELLE · Coût : ~6 h avant utilité au-delà du langage de base · Durée de vie : ~10 ans · À apprendre après : npm (4.4).

MyFunnyJS t'a donné le langage : génériques, types utilitaires, gardes de type, types conditionnels, `tsconfig`. TECH-ILA ne les réexplique pas. Ce qui change en entreprise, c'est l'endroit où tu acceptes de faire confiance à un type.

- **Ancrage MyFunnyJS** : [14_typescript/](../../14_typescript/) — génériques, gardes de type, unions discriminées, `tsconfig` : rien de tout ça n'est à réapprendre.
- **Ce qu'elle ajoute** : un contrat statique entre les parties de ton code, vérifié à la compilation, et un vocabulaire pour "rendre les états impossibles inexprimables".
- **Ce qu'elle masque** : le fait que ton type `User` est **entièrement effacé à l'exécution**. Un `as User` sur une réponse d'API mal formée passe sans un bruit — TypeScript ne protège aucune frontière réseau ou fichier.
- **Ce qu'elle ne résout pas** : le comportement. Un type garantit une forme, pas une logique correcte ; les tests restent nécessaires (cf. [06_testing/09_test_strategy_not_framework.md](../../06_testing/09_test_strategy_not_framework.md)).
- **Quand ne pas la choisir** : pas avant qu'un projet dépasse le stade du script jetable d'une heure — sur un prototype d'après-midi, le coût de configuration dépasse le bénéfice.
- **Exemple qui casse** : une réponse d'API renvoie `{ "id": 42 }` au lieu de `{ "id": "42" }`. Le code fait `const user = (await res.json()) as User;` puis `user.id.toUpperCase()`. TypeScript ne dit rien à la compilation. À l'exécution : `TypeError: user.id.toUpperCase is not a function`.
- **Preuve que c'est acquis** : tu sais dire, pour n'importe quelle fonction, où s'arrête la garantie du compilateur et où commence la responsabilité de la validation runtime. **Si tu bloques, reviens à** : [14_typescript/](../../14_typescript/).

#### Ce que MyFunnyJS permet déjà de comprendre

- [14_typescript/](../../14_typescript/) : génériques, gardes de type, unions discriminées, `tsconfig`.
- [28_edge_cases/01_nan_undefined_null.md](../../28_edge_cases/01_nan_undefined_null.md) : pourquoi `strictNullChecks` n'est pas un caprice de configuration.
- [01_fundamentals/04_types/02_type_coercion.md](../../01_fundamentals/04_types/02_type_coercion.md) : tout ce qui arrive d'une query string est une `string` ; le type ne le corrige pas, la validation si.
- [13_refactoring/03_code_smells.md](../../13_refactoring/03_code_smells.md) : un type de 40 lignes est un smell, exactement comme une fonction de 400 lignes.

**1. TypeScript ne protège pas les frontières.** La règle : **valider à la frontière**, typer à l'intérieur.

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

**2. `any` et `as` sont des dettes.** `as` dit au compilateur "tais-toi". Parfois nécessaire, jamais gratuit. Active `strict: true`, `noUncheckedIndexedAccess`, et interdis `any` implicite.

**3. Les types ne remplacent pas les tests.** Un type garantit la forme, pas le comportement.

**Transférabilité.** Les génériques TS ↔ génériques Java/C#. Les unions discriminées ↔ `sealed interface` Java, records C#, `Union` Python.

**Ce qui restera.** Le typage progressif, la validation aux frontières, la dérivation type-depuis-schéma. **Ce qui bougera.** La syntaxe des décorateurs, les types conditionnels exotiques, les flags de compilation.

> **Exercice — États impossibles inexprimables**
> **Temps réaliste** : 1 h · **Prérequis matériel / compte** : un mini-projet TypeScript existant · **Coût max** : 0 €
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : le compilateur doit refuser le mauvais code, pas seulement un test
> **Réutilise** : [14_typescript/](../../14_typescript/)
> **Piège** : une union discriminée mal construite laisse encore un état incohérent passer
> **À observer** : le message d'erreur exact du compilateur quand tu casses volontairement la garde de type
> **Vérification** (observable, chiffrée) : commente ta garde de type et vérifie que `tsc` échoue avec au moins une erreur ; remets-la et vérifie 0 erreur
> **Repli 100 % local et gratuit** : déjà 100 % local
> **Extension** : ajoute un test qui vérifie qu'un objet JSON invalide est rejeté par le schéma zod correspondant, pas seulement par le type

---

### 4.6 : HTTP et REST

**HTTP et REST** — Tag : NOYAU DURABLE · Coût : ~5 h avant utilité · Durée de vie : ~25 ans · À apprendre après : TypeScript (4.5).

Tu vas passer ta carrière à envoyer et recevoir des requêtes HTTP. C'est le protocole le plus rentable à connaître **en profondeur**.

- **Ancrage MyFunnyJS** : [17_web_concepts/01_http_rest_basics.md](../../17_web_concepts/01_http_rest_basics.md) — méthodes, codes, en-têtes : la base est posée.
- **Ce qu'il ajoute** : un vocabulaire de contrat stable entre deux machines qui ne partagent ni langage ni mémoire.
- **Ce qu'il masque** : CORS n'est **pas** de la sécurité serveur, c'est une protection navigateur — un client non-navigateur (curl, un autre serveur) l'ignore complètement, ce qui donne un faux sentiment de protection.
- **Ce qu'il ne résout pas** : la fiabilité applicative. Un réseau qui coupe en plein `POST` laisse le client dans l'incertitude ; HTTP seul ne garantit aucune idempotence sans décision explicite côté client et serveur.
- **Quand ne pas la choisir** : pas avant d'avoir besoin d'un échange entre deux systèmes indépendants — en interne, dans un seul process, un simple appel de fonction suffit.
- **Exemple qui casse** : un client mobile perd le réseau après avoir envoyé un `POST /jobs`. Il réessaie. Sans clé d'idempotence, le serveur répond deux fois `201 Created` avec deux identifiants différents, le pipeline traite deux fois, les métriques doublent.
- **Preuve que c'est acquis** : avec `curl -v` seul, tu expliques la différence entre un 4xx et un 5xx sur un cas réel, sans consulter de documentation. **Si tu bloques, reviens à** : [17_web_concepts/01_http_rest_basics.md](../../17_web_concepts/01_http_rest_basics.md).

#### Ce que MyFunnyJS permet déjà de comprendre

- [17_web_concepts/01_http_rest_basics.md](../../17_web_concepts/01_http_rest_basics.md) : méthodes, codes, en-têtes.
- [01_fundamentals/05_web_basics/02_fetch_adventure.md](../../01_fundamentals/05_web_basics/02_fetch_adventure.md) : timeouts, annulation, réponses inattendues.
- [05_error_handling/03_error_propagation.md](../../05_error_handling/03_error_propagation.md) : un code HTTP est une propagation d'erreur à travers un réseau, avec perte de contexte.
- [17_web_concepts/04_caching_strategies.md](../../17_web_concepts/04_caching_strategies.md) : `ETag` et `Cache-Control` sont la version réseau de ce que tu as déjà vu en mémoire.

**Ce qui compte vraiment :**

| Sujet       | Ce que tu dois pouvoir expliquer                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| Méthodes    | pourquoi `PUT` est idempotent et `POST` non, et pourquoi ça change ta stratégie de retry                  |
| Codes       | 4xx = le client a tort ; 5xx = tu as tort. Un 200 avec `{"error": ...}` est un mensonge                   |
| Idempotence | comment un client peut réessayer sans créer deux fois la même chose (clé d'idempotence)                   |
| Cache       | `ETag`, `Cache-Control`, `stale-while-revalidate`                                                          |
| Contenu     | négociation, compression, streaming de réponses                                                            |
| Connexion   | keep-alive, HTTP/2 multiplexé, HTTP/3 sur QUIC                                                              |
| CORS        | protection navigateur, pas de sécurité serveur ([22_security/02_csrf_cors.md](../../22_security/02_csrf_cors.md)) |

**REST : ce qu'on en garde.** Des ressources, des URLs stables, des verbes cohérents, des codes honnêtes. **Ce qu'on abandonne.** La chasse aux niveaux de maturité HATEOAS.

**Pont MyFunnyJS.** [21_api_craft/](../../21_api_craft/) tout entier, [05_error_handling/03_error_propagation.md](../../05_error_handling/03_error_propagation.md).

> **Exercice — Anatomie d'une requête**
> **Temps réaliste** : 1 h · **Prérequis matériel / compte** : `curl` installé, accès à une API publique gratuite · **Coût max** : 0 €
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : uniquement `curl -v`, aucune bibliothèque
> **Réutilise** : [17_web_concepts/01_http_rest_basics.md](../../17_web_concepts/01_http_rest_basics.md)
> **Piège** : une réponse mise en cache par un proxy intermédiaire fausse ta mesure de latence
> **À observer** : la séquence DNS → TLS → headers envoyés → headers reçus → taille du corps
> **Vérification** (observable, chiffrée) : tu produis un 4xx et un 5xx sur la même API et tu écris, pour chacun, qui est responsable (client ou serveur) en une phrase
> **Repli 100 % local et gratuit** : lance ton propre serveur Node local (voir 4.3) si aucune API publique n'est joignable
> **Extension** : ajoute un header `Idempotency-Key` à un `POST` répété et observe si le serveur le respecte

---

### 4.7 : SQL et PostgreSQL

**PostgreSQL** — Tag : NOYAU DURABLE (SQL, le modèle relationnel) / PROFESSIONNELLE (PostgreSQL lui-même) · Coût : ~20 h avant utilité · Durée de vie : ~15 ans pour PostgreSQL, ~50 ans pour SQL · À apprendre après : HTTP/REST (4.6).

Si tu ne dois investir sérieusement que dans **une** techno backend au-delà du langage, c'est celle-ci. SQL a 50 ans et sera là dans 20 ans.

- **Ancrage MyFunnyJS** : [09_data_structures/07_hash_table/](../../09_data_structures/07_hash_table/) et [09_data_structures/06_bst/](../../09_data_structures/06_bst/) — un index B-tree, c'est l'arbre que tu as déjà implémenté ; un index de hachage, la table que tu as déjà implémentée.
- **Ce qu'elle ajoute** : durabilité, transactions, concurrence, contraintes. Une contrainte `UNIQUE` en base est la seule garantie d'unicité réelle.
- **Ce qu'elle masque** : le planificateur de requêtes. Il décide seul d'utiliser un index ou non, selon des statistiques, et change d'avis quand le volume change. Ta requête rapide en dev peut devenir un scan complet en prod.
- **Ce qu'elle ne résout pas** : une mauvaise modélisation. Un schéma mal pensé produit des requêtes lentes quels que soient les index posés dessus.
- **Quand ne pas la choisir** : pas avant d'avoir un besoin de cohérence transactionnelle — pour un cache éphémère à très haut débit, pas avant d'avoir écarté Redis ; pour de l'analytique sur des milliards de lignes, pas avant d'avoir écarté un moteur colonne.
- **Exemple qui casse** : `ALTER TABLE ingest_event ADD COLUMN source text NOT NULL DEFAULT 'legacy';` sur une table de 40 millions de lignes en version ancienne de PostgreSQL. La commande réécrit toute la table sous verrou exclusif ; les autres requêtes attendent puis échouent avec `canceling statement due to statement timeout`.
- **Preuve que c'est acquis** : tu sais lire un `EXPLAIN ANALYZE` et dire, sans deviner, si un index est utilisé et pourquoi. **Si tu bloques, reviens à** : [24_databases/01_sql_basics.md](../../24_databases/01_sql_basics.md).

#### Ce que MyFunnyJS permet déjà de comprendre

- [09_data_structures/07_hash_table/](../../09_data_structures/07_hash_table/) et [09_data_structures/06_bst/](../../09_data_structures/06_bst/) : un index B-tree, c'est l'arbre que tu as déjà implémenté.
- [08_memory_performance/03_complexity/](../../08_memory_performance/03_complexity/) : un `Seq Scan` sur 10 millions de lignes, c'est O(n), et tu sais ce que ça coûte.
- [28_edge_cases/05_race_condition_hunter.md](../../28_edge_cases/05_race_condition_hunter.md) : un `if (await exists(x))` suivi d'un `insert` est la race condition que tu as déjà chassée, cette fois entre deux transactions.
- [28_edge_cases/02_floating_point.md](../../28_edge_cases/02_floating_point.md) : pourquoi un montant se stocke en `NUMERIC` et jamais en flottant.

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

```sql
SELECT kind, count(*)
FROM ingest_event
WHERE tenant_id = $1 AND occurred_at >= now() - interval '7 days'
GROUP BY kind;
```

Sans index : 3,2 s. Avec `CREATE INDEX ON ingest_event (tenant_id, occurred_at)` : 40 ms. L'ordre des colonnes n'est pas décoratif : `tenant_id` d'abord parce que c'est l'égalité, `occurred_at` ensuite parce que c'est la plage.

**Preuve exigée :** `EXPLAIN (ANALYZE, BUFFERS)` avant et après. Sans mesure, ce n'est pas de l'optimisation, c'est de la superstition ([08_memory_performance/00_measure_first.md](../../08_memory_performance/00_measure_first.md)).

#### Exemple qui casse : la migration qui bloque

```sql
ALTER TABLE ingest_event ADD COLUMN source text NOT NULL DEFAULT 'legacy';
```

Message obtenu côté requêtes concurrentes : `canceling statement due to statement timeout`. Le geste correct : ajouter la colonne nullable, remplir par lots, ajouter la contrainte ensuite (expand / migrate / contract).

#### Ce qui casse en production — trois pièges silencieux

- **La race condition d'unicité.** Un `SELECT` suivi d'un `INSERT` pour vérifier l'unicité passe sous charge : deux requêtes concurrentes lisent l'absence avant que l'une des deux n'insère, et tu obtiens un doublon sans aucune erreur. Ni retry ni verrou applicatif ne règlent le fond ; seule une contrainte `UNIQUE` sur la colonne l'empêche structurellement — après avoir nettoyé les doublons déjà accumulés.
- **L'arrondi en flottant.** Une facturation calcule des remises en `float`, arrondies ligne par ligne, mais additionne les valeurs non arrondies pour le total. Sur 300 lignes, l'écart atteint 4 centimes — assez pour qu'un service comptable rejette la facture entière. Changer de langage ne change rien : les `float` sont les mêmes IEEE 754 partout. Seuls `NUMERIC` côté SQL et `decimal.Decimal` / `BigDecimal` côté applicatif règlent le problème, au prix de performances moindres.
- **Le fuseau horaire implicite.** Un rapport quotidien filtre avec `WHERE date >= today()` sur un serveur en UTC, alors que l'entreprise vit en Europe/Paris. Les mesures entre 00 h et 02 h locales tombent dans le rapport de la veille, sans erreur, pendant des mois — jusqu'à un audit comptable qui trouve un écart constant. Le correctif tient en une ligne ; expliquer l'écart au client prend, lui, plusieurs semaines.

#### Transactions et isolation

| Niveau                     | Ce qu'il empêche        | Coût                                  |
| --------------------------- | -------------------------- | ---------------------------------------- |
| Read Committed (défaut PG) | lectures sales             | faible, mais lectures non répétables    |
| Repeatable Read            | lectures non répétables    | erreurs de sérialisation à gérer        |
| Serializable               | toutes les anomalies       | conflits fréquents, retry obligatoire   |

#### ORM : le vrai compromis

|       | ORM (Prisma, TypeORM, Drizzle, Hibernate, EF Core)      | SQL direct                                                          |
| ----- | ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| Gain  | typage, migrations, moins de boilerplate                   | contrôle total, perf prévisible                                        |
| Coût  | requêtes générées parfois catastrophiques, N+1 invisible   | plus de code, mapping manuel                                            |
| Piège | tu crois lire du JS, tu produis 200 requêtes               | injection SQL si tu concatènes ([22_security/01_xss_injection.md](../../22_security/01_xss_injection.md)) |

#### Testing

Tests d'intégration sur un vrai PostgreSQL en conteneur, jamais sur un mock. Chaque test tourne dans une transaction annulée à la fin, ou sur une base recréée par migration.

#### Sécurité — requête sûre vs requête concaténée

```sql
-- MAUVAIS : concaténation directe, ouvre l'injection SQL
-- SELECT * FROM users WHERE email = '" + userInput + "';

-- BON : requête paramétrée, le pilote échappe la valeur
SELECT * FROM users WHERE email = $1;
```

```js
// MAUVAIS : la valeur utilisateur devient du SQL exécutable
const rows = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// BON : la valeur reste une donnée, jamais du code
const rows = await db.query("SELECT * FROM users WHERE email = $1", [email]);
```

Moindre privilège : l'utilisateur base de données de ton API n'a pas besoin de `DROP TABLE`.

#### Quand ne pas choisir PostgreSQL

- Cache éphémère à très haut débit → Redis.
- Données massivement non structurées avec schéma imprévisible → un document store peut se défendre.
- Analytique sur des milliards de lignes → moteur colonne (ClickHouse, DuckDB, BigQuery).

#### Ce qui restera dans 10 ans

Le modèle relationnel, l'algèbre relationnelle, ACID, les index, la lecture d'un plan d'exécution.

> **Exercice — Lire un plan d'exécution**
> **Temps réaliste** : 2 h · **Prérequis matériel / compte** : PostgreSQL local (paquet système ou conteneur local) · **Coût max** : 0 €
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : générer les 2 millions de lignes toi-même, en local
> **Réutilise** : [24_databases/03_data_modeling.md](../../24_databases/03_data_modeling.md)
> **Piège** : un index créé n'est pas forcément utilisé par le planificateur
> **À observer** : le coût estimé et le temps réel dans `EXPLAIN ANALYZE`, avant et après l'index
> **Vérification** (observable, chiffrée) : la requête passe de plus d'1 s à moins de 100 ms après l'ajout de l'index ; tu écris trois lignes expliquant ce que le plan disait avant, après, et pourquoi le planificateur a changé de décision
> **Repli 100 % local et gratuit** : PostgreSQL en conteneur local (`docker run` sans registre distant payant) ou installation système directe
> **Extension** : ajoute un second index volontairement inutile et explique, plan à l'appui, pourquoi il n'est jamais choisi

**Connexion activée.** Arbre binaire, complexité, hash table, race condition, transaction : cinq chapitres MyFunnyJS viennent de fusionner en un seul modèle mental appelé "base de données".

---

### 4.8 : Testing en conditions réelles

**Testing** — Tag : NOYAU DURABLE (stratégie) / PÉRISSABLE (le runner) · Coût : ~6 h avant utilité au-delà des bases · Durée de vie : ~4 ans pour le runner, ~20 ans pour la stratégie · À apprendre après : PostgreSQL (4.7).

MyFunnyJS t'a appris la stratégie ([06_testing/09_test_strategy_not_framework.md](../../06_testing/09_test_strategy_not_framework.md)). Voici l'outillage professionnel actuel.

- **Ancrage MyFunnyJS** : [06_testing/09_test_strategy_not_framework.md](../../06_testing/09_test_strategy_not_framework.md) — quoi tester, à quelle granularité, et pourquoi le runner est un détail.
- **Ce qu'il ajoute** : la capacité de faire tourner un test contre une vraie dépendance jetable (base de données, file d'attente) au lieu d'un mock.
- **Ce qu'il masque** : une suite verte donne un faux sentiment de sécurité si elle teste des mocks au lieu du comportement réel — le vert ne dit rien sur ce qui a été réellement vérifié.
- **Ce qu'il ne résout pas** : une mauvaise architecture reste difficile à tester quel que soit l'outil ; un test ne remplace pas une conception testable.
- **Quand ne pas la choisir** : pas avant qu'une fonction ait un comportement observable qui vaille la peine d'être figé — tester un getter trivial ne protège rien.
- **Exemple qui casse** : suite verte en CI, bug en prod. Les tests mockaient la base ; le mock renvoyait toujours les lignes triées, PostgreSQL sans `ORDER BY` ne garantit rien. En prod l'ordre change et l'écran affiche les résultats dans le désordre, sans qu'aucun test n'échoue : `0 failing, 42 passing`.
- **Preuve que c'est acquis** : tu casses volontairement une implémentation sans casser le comportement, et un bon test ne bouge pas. **Si tu bloques, reviens à** : [06_testing/09_test_strategy_not_framework.md](../../06_testing/09_test_strategy_not_framework.md).

#### Ce que MyFunnyJS permet déjà de comprendre

- [06_testing/09_test_strategy_not_framework.md](../../06_testing/09_test_strategy_not_framework.md) : quoi tester, à quelle granularité.
- [06_testing/03_mocking_madness.md](../../06_testing/03_mocking_madness.md) : mocker la base, c'est tester ton mock.
- [06_testing/04_integration_reactor.md](../../06_testing/04_integration_reactor.md) : le test qui traverse plusieurs couches est celui qui attrape les bugs réels.
- [04_debugging/04_repro_before_fix.md](../../04_debugging/04_repro_before_fix.md) : un test qui échoue d'abord est la preuve qu'un correctif corrige quelque chose.

| Outil               | Rôle                                              | Tag                      |
| --------------------- | ---------------------------------------------------- | -------------------------- |
| Vitest                | tests unitaires et d'intégration, écosystème Vite    | PROFESSIONNELLE            |
| Jest                  | historique, encore massivement en place              | PROFESSIONNELLE            |
| node:test             | runner natif, zéro dépendance                        | NOYAU DURABLE (tendance)   |
| Playwright            | end-to-end navigateur, multi-navigateurs             | PROFESSIONNELLE            |
| Testing Library       | tests de composants orientés utilisateur             | PROFESSIONNELLE            |
| Testcontainers        | vraie base dans un conteneur jetable                 | PROFESSIONNELLE            |
| MSW                   | interception réseau réaliste                         | CONTEXTUELLE               |

**La règle qui survit à tous les runners :** teste le **comportement observable**, pas l'implémentation.

> **Exercice — Un test qui teste la mauvaise chose**
> **Temps réaliste** : 1 h · **Prérequis matériel / compte** : un mini-projet avec au moins un test existant · **Coût max** : 0 €
> **Mode** : jeûne d'IA obligatoire
> **Contraintes** : ne pas changer le comportement observable de la fonction testée
> **Réutilise** : [06_testing/03_mocking_madness.md](../../06_testing/03_mocking_madness.md)
> **Piège** : un refactor "sans risque" (renommer une variable interne) peut casser un test qui espionnait l'implémentation
> **À observer** : quel test échoue et pourquoi, précisément
> **Vérification** (observable, chiffrée) : après le refactor interne, si un test échoue sans changement de comportement, tu le réécris ; à la fin, 100 % des tests passent et le comportement externe est identique (mêmes entrées, mêmes sorties observées)
> **Repli 100 % local et gratuit** : déjà 100 % local
> **Extension** : remplace un mock de base de données par Testcontainers et observe si le test détecte un bug que le mock cachait

---

### 4.9 : Docker et conteneurisation

**Docker** — Tag : PROFESSIONNELLE (Docker) / NOYAU DURABLE (l'isolation et l'immutabilité) · Coût : ~10 h avant utilité · Durée de vie : ~10 ans pour Docker, ~20 ans pour le modèle de conteneur · À apprendre après : Testing (4.8).

**Le problème résolu :** "ça marche sur ma machine". Un conteneur emballe l'app **et** son environnement d'exécution.

**Modèle mental.** Une image est un empilement de couches en lecture seule. Un conteneur est un process isolé (namespaces + cgroups Linux) qui monte cette image. **Ce n'est pas une VM** : pas de noyau séparé, démarrage en millisecondes.

- **Ancrage MyFunnyJS** : [15_runtime_env/04_process_env_argv.md](../../15_runtime_env/04_process_env_argv.md) — configuration par variables d'environnement et signaux : `SIGTERM` et l'arrêt gracieux sont exactement le sujet de `docker stop`.
- **Ce qu'il ajoute** : un environnement d'exécution reproductible, isolé du système hôte, packagé une fois et exécuté identiquement partout.
- **Ce qu'il masque** : le réseau (un conteneur a sa propre interface réseau virtuelle — un "connection refused" entre deux conteneurs est souvent un problème de réseau Docker, pas de code) ; le cache de couches (l'ordre des instructions du Dockerfile décide si ton build prend 20 secondes ou 4 minutes) ; le fait que ton process tourne en PID 1 dans le conteneur — un rôle normalement tenu par `init`, qui ne relaie pas les signaux à ses enfants par défaut, d'où des process zombies ou un `SIGTERM` ignoré ; et l'écart entre l'UID de l'utilisateur dans le conteneur et celui de l'hôte, qui provoque des `permission denied` sur les volumes montés.
- **Ce qu'il ne résout pas** : une app mal écrite reste mal écrite. Une fuite mémoire est juste redémarrée plus souvent. Un `docker-compose.yml` de 400 lignes est une architecture qui a échoué.
- **Quand ne pas la choisir** : pas avant d'avoir plus d'un environnement à reproduire — pas pour un script ponctuel, un site statique ou une fonction serverless, où le conteneur n'ajoute qu'un coût opérationnel (registre, build, scan de vulnérabilités).
- **Exemple qui casse** : le process tourne en PID 1 sans gérer les signaux. `docker stop` envoie `SIGTERM`, le process ne l'intercepte pas nativement en PID 1, Docker attend le délai de grâce puis envoie `SIGKILL` : requêtes en vol coupées net, aucun log de fermeture propre.
- **Preuve que c'est acquis** : tu sais expliquer, sur un `permission denied` de volume monté, si la cause est l'UID hôte, l'UID conteneur, ou les droits du dossier. **Si tu bloques, reviens à** : [00_getting_started/02_shell_survival.md](../../00_getting_started/02_shell_survival.md) (4.1) pour la lecture des permissions.

**Ce que tu logues ici.** Uniquement les événements du cycle de vie du conteneur utiles au diagnostic — démarrage, échec de healthcheck, réception de `SIGTERM`, arrêt effectif — jamais le contenu des variables d'environnement ni les secrets injectés au démarrage.
**Avec quel identifiant.** L'identifiant de conteneur (`docker ps --format`) et le `request_id` applicatif propagé depuis 4.3, pour pouvoir corréler un log applicatif avec l'instance de conteneur qui l'a produit, y compris après un redémarrage.

#### Ce que MyFunnyJS permet déjà de comprendre

- [15_runtime_env/04_process_env_argv.md](../../15_runtime_env/04_process_env_argv.md) : configuration par variables d'environnement et signaux.
- [00_getting_started/02_shell_survival.md](../../00_getting_started/02_shell_survival.md) : uid, permissions, `ls -ln` : la moitié des `permission denied` d'un conteneur se lisent là.
- [08_memory_performance/01_gc/](../../08_memory_performance/01_gc/) : une limite mémoire de conteneur ne crée pas la fuite, elle la révèle plus tôt.
- [15_runtime_env/03_commonjs_vs_esm.md](../../15_runtime_env/03_commonjs_vs_esm.md) : ce qui casse au build dans l'image casse pour les mêmes raisons qu'en local.

#### Exemple réaliste : image multi-étages, non-root, sans secret en couche

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
# aucun ARG/ENV de secret ici : un secret construit dans l'image reste lisible
# pour toujours dans l'historique des couches, même après suppression
```

Copier `package*.json` **avant** le code n'est pas de la coquetterie : c'est ce qui fait passer ton build de 4 minutes à 20 secondes grâce au cache de couches.

**Lecture de secret depuis l'environnement, jamais journalisée :**

```js
// MAUVAIS : le secret finit dans les logs au premier incident
console.log("config chargée", process.env);

// BON : on lit le secret, on l'utilise, on ne le journalise jamais
const dbPassword = process.env.DB_PASSWORD;
if (!dbPassword) {
  throw new Error("DB_PASSWORD manquant"); // message sans valeur sensible
}
```

**Pièges fréquents :**

| Piège                        | Conséquence                                          |
| ------------------------------ | ------------------------------------------------------- |
| Tourner en root                | escalade de privilèges si l'app est compromise         |
| Secrets dans le `Dockerfile`   | ils restent dans l'historique des couches, à jamais     |
| Pas de `.dockerignore`         | tu envoies `node_modules` et `.git` au build            |
| Tag `latest` en prod           | tu ne sais plus quelle version tourne                   |
| Pas de healthcheck             | l'orchestrateur route du trafic vers un process mort    |
| Ignorer `SIGTERM`              | requêtes coupées à chaque déploiement                   |

**Liveness vs readiness — deux questions différentes.** La liveness répond à « ce process est-il vivant, ou faut-il le tuer et le redémarrer ? » — un process bloqué en boucle infinie échoue sa liveness. La readiness répond à « ce process peut-il accepter du trafic maintenant ? » — un process vivant mais qui n'a pas encore de connexion à la base de données doit échouer sa readiness sans être redémarré. Confondre les deux fait redémarrer en boucle un service qui attendait juste une dépendance lente.

```js
// liveness : le process répond, point.
app.get("/livez", (req, res) => res.status(200).send("ok"));

// readiness : le process répond ET ses dépendances sont prêtes.
app.get("/readyz", (req, res) => {
  if (!db.isConnected()) return res.status(503).send("db not ready");
  res.status(200).send("ok");
});
```

**Ce que Docker ne résout pas.** Une app mal écrite reste mal écrite. Une fuite mémoire est juste redémarrée plus souvent.

**Quand ne pas conteneuriser.** Un script ponctuel, un site statique, une fonction serverless.

**Kubernetes ?** CONTEXTUELLE. Puissant, et un coût de complexité énorme. Apprends-en le vocabulaire (pod, service, deployment, ingress) pour lire les offres et les conversations ; approfondis seulement si une mission l'exige.

> **Exercice — Conteneuriser sans casser l'arrêt propre**
> **Temps réaliste** : 2 h 30 · **Prérequis matériel / compte** : Docker installé localement (Docker Desktop ou équivalent gratuit) · **Coût max** : 0 €
> **Mode** : assistant autorisé pour la syntaxe Dockerfile, jeûne d'IA obligatoire pour le diagnostic des erreurs
> **Contraintes** : image finale < 200 Mo, utilisateur non root, arrêt gracieux vérifié, healthcheck présent
> **Réutilise** : un de tes mini-projets MyFunnyJS ([30_mini_projects/](../../30_mini_projects/))
> **Piège** : `docker stop` ne doit couper aucune requête en vol — un process en PID 1 qui ignore `SIGTERM` échoue silencieusement ce critère
> **À observer** : le comportement du process pendant les 10 secondes de délai de grâce avant `SIGKILL`
> **Vérification** (observable, chiffrée) : `docker images` montre une taille finale sous 200 Mo ; pendant une charge générée avec autocannon, `docker stop` puis un nouveau test montrent 0 requête en erreur côté client
> **Repli 100 % local et gratuit** : tout l'exercice est déjà local, aucun registre distant nécessaire
> **Extension** : ajoute une limite mémoire (`docker run -m 128m`) et observe à quel seuil le conteneur est tué

---

### 4.10 : Déploiement de base

**Déploiement** — Tag : PROFESSIONNELLE · Coût : ~6 h avant utilité · Durée de vie : ~5 ans pour les plateformes citées, ~20 ans pour le schéma de déploiement · À apprendre après : Docker (4.9).

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

- **Ancrage MyFunnyJS** : [15_runtime_env/04_process_env_argv.md](../../15_runtime_env/04_process_env_argv.md) — la config vient de l'environnement, jamais de l'artefact.
- **Ce qu'il ajoute** : un chemin reproductible entre "ça marche sur ma machine" et "ça tourne pour de vrais utilisateurs", avec un moyen de revenir en arrière.
- **Ce qu'il masque** : la facilité apparente d'un PaaS ("déploie en une commande") cache la config réseau, les quotas et les coûts qui apparaissent seulement à l'échelle ; un déploiement qui "a marché" sans observation ne dit rien sur son état réel.
- **Ce qu'il ne résout pas** : un `VITE_API_KEY` dans du code client reste **public**, même minifié, quelle que soit la plateforme de déploiement.
- **Quand ne pas la choisir** : pas avant d'avoir un artefact qui tourne de façon fiable en local — déployer un service instable ne fait que déplacer le problème vers un public plus large.
- **Exemple qui casse** : une clé secrète est glissée dans une variable préfixée `VITE_` (donc injectée côté client). Le build réussit, le déploiement réussit, aucune erreur nulle part. La clé apparaît en clair dans le bundle téléchargé par le navigateur, visible par `view-source:` — l'erreur n'est jamais un message, c'est une fuite silencieuse.
- **Preuve que c'est acquis** : tu montres, sur ton propre déploiement, que le même artefact tourne en préprod et en prod avec uniquement la config qui change. **Si tu bloques, reviens à** : [15_runtime_env/04_process_env_argv.md](../../15_runtime_env/04_process_env_argv.md).

#### Ce que MyFunnyJS permet déjà de comprendre

- [15_runtime_env/04_process_env_argv.md](../../15_runtime_env/04_process_env_argv.md) : la config vient de l'environnement, jamais de l'artefact.
- [26_observability/06_debug_in_prod.md](../../26_observability/06_debug_in_prod.md) : un déploiement sans observation est un pari.
- [22_security/09_supply_chain_sbom.md](../../22_security/09_supply_chain_sbom.md) : l'artefact promu contient tout ce que tu as installé, y compris ce que tu n'as pas choisi.
- [05_error_handling/05_error_strategy.md](../../05_error_handling/05_error_strategy.md) : décider à l'avance ce qui déclenche un rollback est une stratégie d'erreur, pas une improvisation.

**Les trois règles.** (1) L'artefact est identique de la préprod à la prod, seule la config change. (2) Tout déploiement doit pouvoir revenir en arrière. (3) Un déploiement sans observation n'est pas un déploiement, c'est un pari.

**Variables d'environnement et secrets.** Les secrets ne sont ni dans Git, ni dans l'image, ni dans le bundle frontend.

**Plateformes.** PaaS (déploiement en une commande, cher à l'échelle), conteneurs managés, VM classique, serverless (démarrage à froid, contraintes d'exécution). Toutes PÉRISSABLES dans leurs détails, toutes identiques dans le schéma ci-dessus.

> **Exercice — Le même artefact, deux environnements**
> **Temps réaliste** : 3 h · **Prérequis matériel / compte** : Docker local ou serveur statique local ; un compte gratuit sur une plateforme de déploiement est optionnel, jamais requis · **Coût max** : 0 €, aucune carte bancaire ne doit être demandée à aucune étape
> **Mode** : assistant autorisé pour la configuration de plateforme, jeûne d'IA obligatoire pour le diagnostic
> **Contraintes** : une variable d'environnement différente entre les deux environnements, aucun secret dans l'image ni dans le bundle, un rollback exécuté en une commande
> **Réutilise** : [15_runtime_env/04_process_env_argv.md](../../15_runtime_env/04_process_env_argv.md) — la config est lue au démarrage, validée, et le service refuse de démarrer si une variable obligatoire manque
> **Piège** : glisse volontairement une clé dans une variable préfixée pour le client, déploie, puis retrouve-la dans le bundle téléchargé par le navigateur
> **À observer** : l'empreinte de l'artefact déployé dans les deux environnements (même hash d'image ou de build), le message d'erreur au démarrage sans la variable obligatoire, et l'endroit exact où la clé mal préfixée apparaît en clair
> **Vérification** (observable, chiffrée) : après rollback, la version précédente répond en moins de 30 secondes et le healthcheck repasse au vert ; le hash de l'artefact en préprod et en prod est identique
> **Repli 100 % local et gratuit** : si tu ne veux ou ne peux pas utiliser de plateforme distante, fais tourner les deux "environnements" en local — un serveur statique local (`npx serve` ou équivalent) pour le rôle préprod, et un conteneur Docker local pour le rôle prod, avec deux fichiers `.env` différents ; le rollback devient `docker run` sur le tag d'image précédent. Cet exercice est entièrement réalisable sans aucun compte externe.
> **Extension** : que se passe-t-il si la variable manquante n'est lue qu'au premier appel d'une route rare, trois jours après le déploiement ?

**Seuil franchi.** Le niveau 1 est le seul dont aucune ligne ne sera obsolète dans dix ans. Si tu l'as vraiment, tu peux apprendre n'importe quel framework par-dessus : c'est exactement ce que teste un entretien senior.

---

## Jour 1 : le projet ne démarre pas

Encadré de dépannage à suivre dans l'ordre, avant de demander de l'aide à quelqu'un d'autre.

1. **Vérifie la version du runtime attendue** — compare `node -v` à ce qu'exige le projet (`.nvmrc`, `engines` dans `package.json`). Une erreur de syntaxe sur une fonctionnalité récente vient souvent d'un runtime trop vieux.
2. **Vérifie le lockfile** — installe avec `npm ci` (ou l'équivalent pnpm), jamais `npm install`, pour reproduire exactement l'arbre de dépendances attendu (cf. 4.4).
3. **Vérifie les dépendances de service** — base de données, cache, file d'attente : sont-elles démarrées (conteneur local, service système) avant de lancer l'app ?
4. **Distingue une erreur de build d'une erreur de config** — une erreur de build casse la compilation ou l'installation, avant même que ton code s'exécute ; une erreur de config apparaît après démarrage, au premier accès à une ressource (base, variable manquante). Le message et le moment où il apparaît te disent lequel c'est.
5. **Cherche les variables d'environnement manquantes** — un service bien écrit refuse de démarrer avec un message explicite nommant la variable ; s'il démarre quand même et plante plus tard, c'est un défaut à corriger, pas juste un incident à contourner.
6. **Vérifie les ports occupés** — `ss -tlnp` ou `lsof -i :PORT` (cf. 4.1) avant de blâmer le code.
7. **Vérifie l'état des migrations** — une base présente mais non migrée produit des erreurs de colonne ou table manquante qui ressemblent à un bug de code.
8. **Vide le cache si le comportement ne correspond pas au code lu** — cache de build, cache de dépendances, image Docker obsolète : un cache périmé fait tourner un ancien artefact en silence.
9. **Relis le message d'erreur littéralement, du début à la fin** — la cause réelle est souvent trois lignes avant la ligne qui te saute aux yeux.
10. **Demande de l'aide seulement après avoir noté** : la commande exacte lancée, le message d'erreur complet, la version du runtime, et ce que tu as déjà éliminé aux étapes 1 à 9 — sans ces quatre éléments, personne ne peut t'aider plus vite que tu ne peux te débloquer toi-même.

---

[← 00-orientation.md](./00-orientation.md) · [Sommaire](../README.md) · [02-niveau-2-frontend.md →](./02-niveau-2-frontend.md)
