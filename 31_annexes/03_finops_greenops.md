---
stability: intemporel
---

# FINOPS ET GREENOPS : LE KI A UN COÛT, MÊME EN PROD
Temps de lecture ~10 min

Vegeta n'utilise jamais le Kaioken (technique qui multiplie la puissance, au prix d'un épuisement brutal du ki) sans raison. Chaque montée en puissance vide la réserve, et la réserve ne se remplit pas instantanément. En prod, c'est pareil : chaque requête, chaque conteneur qui tourne, chaque modèle d'IA qu'on appelle consomme du CPU, de la mémoire, de l'électricité. Et tout ça a un prix, en dollars et en watts.

FinOps (Financial Operations : gérer le coût cloud comme une compétence d'ingénierie, pas comme une ligne de facture qu'on découvre en fin de mois) et GreenOps (Green Operations : réduire l'empreinte énergétique du code en prod) ne sont pas des sujets réservés aux équipes infra. Un dev qui écrit une requête N+1 ou laisse tourner un cron toutes les 10 secondes au lieu de toutes les heures fait une décision FinOps, qu'il le sache ou non.

---

## 1) FINOPS : POURQUOI CE N'EST PLUS UN SUJET DE COMPTABLE

### Le quoi

Le cloud (AWS, GCP, Azure) a une particularité que les serveurs physiques n'avaient pas : tu payes à l'usage, en temps réel, et il est extrêmement facile de payer pour des ressources que personne ne regarde. Le FinOps, c'est la discipline qui relie chaque ligne de code à son coût réel, pour que les décisions d'architecture intègrent le prix dès le départ, pas après le choc de la facture.

```
2015 -------- le cloud coûte ce qu'il coûte, personne ne regarde vraiment
2020 -------- les factures cloud explosent, les équipes FinOps apparaissent
2026 -------- le coût est un critère de design au même titre que la performance
```

### Pourquoi ça a changé

Avant, un serveur physique était un coût fixe décidé une fois, par quelqu'un d'autre. Le cloud a rendu le coût variable, granulaire (facturé à la seconde, au Go, à la requête), et directement piloté par les décisions techniques du quotidien. Un dev qui choisit un type d'instance, une fréquence de polling, ou une stratégie de cache influence directement la facture, en temps réel.

### Ce qui coûte vraiment cher, et ce qui ne coûte presque rien

```
Ressources oubliées qui tournent pour rien  --> coût le plus bête, le plus fréquent
Sur-provisionnement "au cas où"        --> 10 instances pour un trafic qui en demande 2
Requêtes N+1 et données non cachées      --> multiplie le coût de calcul sans valeur ajoutée
Logs et métriques jamais nettoyés       --> stockage qui grossit indéfiniment, jamais purgé
Vrai calcul intensif (IA, vidéo, gros batch)  --> cher par nature, mais au moins justifié
```

```js
// Mauvais : un cron qui poll une API externe toutes les 10 secondes, 24h/24, pour une donnée qui change une fois par jour
setInterval(async () => {
 const data = await fetchExternalRanking();
 await cache.set('ranking', data);
}, 10_000); // 8640 appels par jour pour une donnée qui bouge... une fois par jour

// Correct : la fréquence colle au taux de changement réel de la donnée
setInterval(async () => {
 const data = await fetchExternalRanking();
 await cache.set('ranking', data);
}, 3_600_000); // une fois par heure suffit largement, le coût d'appel chute de 99%
```

### Tagging : savoir QUI consomme QUOI

Le problème numéro un en FinOps n'est pas "on dépense trop", c'est "on ne sait pas qui dépense quoi". Sans tagging (étiqueter chaque ressource cloud avec son service, son équipe, son environnement), une facture cloud est une boîte noire.

```js
// Une ressource sans tag est une dépense fantôme, impossible à attribuer à une équipe
const instance = await cloud.createInstance({ type: 't3.medium' });

// Une ressource taguée devient traçable : qui l'a créée, pourquoi, jusqu'à quand
const instance = await cloud.createInstance({
 type: 't3.medium',
 tags: {
  team: 'ultras-dashboard',
  environment: 'staging',
  owner: 'backend-team',
  expiresAt: '2026-09-01', // une ressource de staging sans date d'expiration finit oubliée pour toujours
 },
});
```

---

## 2) GREENOPS : LE WATT EST LE NOUVEAU MILLISECONDE

### Le quoi

Le GreenOps applique la même logique que le FinOps, mais à l'empreinte énergétique plutôt qu'au coût financier. Un data center (centre de données qui héberge les serveurs cloud) consomme de l'électricité pour calculer ET pour refroidir, et cette consommation a un impact carbone mesurable.

```
Code inefficace --> plus de CPU utilisé --> plus d'électricité consommée --> empreinte carbone plus lourde
```

### Pourquoi c'est devenu un critère, pas une option

Pendant longtemps, l'optimisation visait uniquement la vitesse perçue par l'utilisateur. Mais une requête plus rapide consomme aussi, presque toujours, moins d'énergie : moins de cycles CPU, moins de temps serveur allumé, moins de transferts réseau. Le GreenOps ne demande pas un sacrifice de performance : il aligne deux objectifs qui pointaient déjà dans la même direction.

```js
// Mauvais : recalculer un classement complet à chaque requête, même si rien n'a changé
app.get('/ranking', async (req, res) => {
 const allMatches = await db.matches.findAll(); // charge tout, à chaque appel
 const ranking = computeFullRanking(allMatches); // recalcul intégral, à chaque appel
 res.json(ranking);
});

// Correct : on calcule une fois, on sert depuis le cache tant que rien n'a changé
app.get('/ranking', async (req, res) => {
 const cached = await cache.get('ranking');
 if (cached) return res.json(cached); // zéro calcul CPU, zéro accès DB, zéro watt gaspillé

 const allMatches = await db.matches.findAll();
 const ranking = computeFullRanking(allMatches);
 await cache.set('ranking', ranking, { ttl: 300 });
 res.json(ranking);
});
```

### Carbon-aware scheduling : décaler le calcul, pas juste le réduire

Une optimisation moins connue : l'intensité carbone du réseau électrique varie selon l'heure et la région (plus d'énergie solaire en journée, plus de charbon ou de gaz la nuit selon les pays). Le carbon-aware scheduling consiste à décaler les tâches non urgentes (batch jobs, rapports, entraînement de modèles) vers les fenêtres où l'électricité est la plus propre.

```js
// Un batch job lourd, lancé sans réflexion sur le timing
cron.schedule('0 2 * * *', runNightlyReportGeneration); // 2h du matin, choisi au hasard

// Un batch carbon-aware, décalé vers une fenêtre où le mix électrique est plus propre
// (ex : décalage vers les heures de forte production solaire dans la région d'hébergement)
cron.schedule('0 13 * * *', runNightlyReportGeneration); // tâche non urgente, déplacée en milieu de journée
```

---

## 3) LE KI N'EST PAS INFINI : MESURER AVANT D'OPTIMISER

Optimiser sans mesurer, c'est sortir le Kaioken sans savoir combien de ki il reste. Les outils existent pour chiffrer précisément ce qu'un bout de code coûte, en argent et en énergie.

```
AWS Cost Explorer / GCP Billing --> coût détaillé par service, par tag, par période
Carbon footprint tools (cloud)  --> estimation de l'empreinte CO2 par charge de travail
Lighthouse (déjà vu en 08)     --> un score de perf élevé corrèle presque toujours avec moins d'énergie
node --prof (déjà vu en 08)    --> identifier le code qui consomme le plus de CPU, donc le plus de watts
```

```js
// Mesurer avant d'affirmer qu'une fonction "coûte cher" : l'intuition se trompe souvent
console.time('computeFullRanking');
const ranking = computeFullRanking(allMatches);
console.timeEnd('computeFullRanking'); // computeFullRanking: 842ms : voilà la vraie cible à optimiser
```

---

## 4) CE QUI EST INVARIANT, CE QUI VA BOUGER

```
Invariant  --> mesurer avant d'optimiser, taguer ses ressources, éviter le gaspillage évident
Semi-stable --> les outils de billing et de carbon tracking (les noms changent, le principe reste)
Conjoncturel --> les chiffres précis d'intensité carbone par région, les prix exacts du cloud
```

Le réflexe à garder ne vieillit pas : avant d'ajouter une ressource, un cron, un appel répété, se demander combien ça coûte et combien ça consomme. Les outils précis pour le mesurer changeront. La question, elle, reste valable.

---

## EXERCICES

## EXO 1 : LE CRON QUI VIDE LA RÉSERVE DE KI POUR RIEN

L'Ultras Dashboard a un job qui recalcule les statistiques de tous les matchs de la saison toutes les 30 secondes, alors que les données ne changent qu'au moment où un événement de match arrive (un but, un carton). Réécrire la stratégie pour passer d'un polling fréquent à un déclenchement événementiel (event-driven, déjà vu en `02_async`), et chiffrer en commentaire la réduction approximative du nombre d'exécutions par jour.

## EXO 2 : LE TAGGING DU CAMP

Le système de gestion de camp de `03_walking_dead_protocol` provisionne des ressources cloud (simulées) pour chaque simulation de menace, sans jamais les taguer ni les détruire après usage. Écrire une fonction `provisionSimulation()` qui tague chaque ressource (équipe, environnement, date d'expiration) et une fonction `cleanupExpiredSimulations()` qui détruit automatiquement tout ce qui a dépassé sa date d'expiration.

## EXO 3 : LE BATCH CARBON-AWARE DE L'ORACLE GLITCH

L'Oracle Glitch lance une régénération complète de ses tests d'IA chaque nuit à minuit, sans justification de timing. Proposer une stratégie de carbon-aware scheduling pour ce batch non urgent (en argumentant le choix de la fenêtre horaire), et écrire la fonction qui vérifie, avant de lancer la tâche, si elle peut être reportée sans impact métier.

---

## RÉSUMÉ

FinOps et GreenOps partent du même principe : chaque ligne de code a un coût mesurable, en argent et en énergie, et ce coût se décide au moment où le code est écrit, pas après la facture. Le tagging permet de savoir qui consomme quoi. Le cache et la fréquence d'exécution bien calibrée évitent le gaspillage le plus fréquent. Le carbon-aware scheduling décale ce qui peut l'être vers les fenêtres les plus propres. Et comme pour le ki : on mesure avant d'optimiser, jamais l'inverse.
