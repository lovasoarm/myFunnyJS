---
stability: intemporel
---

# MOCK INTERVIEW : DEBUG ASYNC EN DIRECT (solo)

Temps de lecture ~3 min


Objectif : simuler seul un entretien technique où on te lâche un bug async et où on te regarde le résoudre à voix haute. En vrai, le recruteur juge ta MÉTHODE, pas la vitesse. Ce drill t'entraîne à penser fort, sous pression, sans IA.

## PROTOCOLE (25 min chrono)

1. Prépare un enregistreur (téléphone, OBS, n'importe quoi). Tu vas te filmer ou t'enregistrer en audio. Non négociable : sans enregistrement, tu ne verras pas tes tics.
2. Lance un chrono de 20 min.
3. Ouvre le bug ci-dessous. Lis-le à voix haute. Puis résous-le EN PARLANT : chaque hypothèse, chaque test, chaque doute, dit à voix haute comme si un CTO t'écoutait.
4. À 5 min de la fin, arrête-toi et récapitule ta solution en 3 phrases, comme un vrai débrief d'entretien.

## LE BUG À RÉSOUDRE

Un worker Node traite des jobs. Le code est censé traiter 100 jobs en parallèle borné à 5, puis logguer "TERMINÉ". En prod, il logue "TERMINÉ" avant que les jobs soient finis, et parfois un job silencieusement perdu.

```js
async function runAll(jobs) {
 const results = [];
 jobs.forEach(async (job) => {
  const r = await process(job);
  results.push(r);
 });
 console.log("TERMINÉ", results.length);
 return results;
}
```

Tu dois : (a) expliquer POURQUOI "TERMINÉ" s'affiche trop tôt, (b) pourquoi des résultats manquent, (c) proposer un fix avec concurrence bornée à 5.

## LES 5 RELANCES-PIÈGES (le recruteur te pousse)

Après ta première réponse, réponds à voix haute à chacune. Elles sont conçues pour te faire douter ou sur-corriger.

1. "Pourquoi `forEach` avec un callback async ne fait pas ce que tu crois ?" (piège : beaucoup répondent "il attend", c'est faux, `forEach` ignore la promesse retournée.)
2. "Si je remplace par `Promise.all(jobs.map(...))`, tu as fini ?" (piège : ça règle l'attente mais PAS la borne de concurrence à 5 ni un job qui throw.)
3. "Que se passe-t-il si UN job rejette ?" (piège : `Promise.all` rejette tout au premier échec ; veux-tu vraiment ça ? `allSettled` ?)
4. "Comment tu limites à 5 en parallèle SANS librairie ?" (piège : on veut te voir raisonner sur un pool/sémaphore, pas citer p-limit.)
5. "Prouve-moi que ton fix marche. Comment tu le testes ?" (piège : si tu n'as pas de test déterministe, ta correction est une croyance.)

## GRILLE D'AUTO-ÉVALUATION (note-toi honnêtement)

- [ ] J'ai reproduit/expliqué le bug AVANT de coder un fix. (2 pts)
- [ ] J'ai nommé la vraie cause : `forEach` ignore les promesses async. (2 pts)
- [ ] J'ai distingué "attendre" (Promise.all) de "borner" (pool). (2 pts)
- [ ] J'ai géré le cas d'un job qui rejette (allSettled ou try/catch par job). (2 pts)
- [ ] J'ai proposé un test déterministe (mock de `process`, compteur d'appels concurrents max). (2 pts)
- [ ] J'ai parlé clairement, sans "euh" toutes les 5 secondes, en verbalisant mes hypothèses. (bonus)

Score < 6/10 : rejoue le module `03_async` puis recommence ce mock.

## (attention) CE QUE LE DRILL RÉVÈLE

Si tu as foncé coder sans parler, tu échoueras en entretien même avec le bon code. Le recruteur achète ta pensée visible, pas ton silence suivi d'une solution. Comme un capitaine qui organise sa défense à voix haute pendant le match : ce n'est pas qu'il parle pour parler, c'est qu'il aligne l'équipe en temps réel.

## APRÈS

Regarde ton enregistrement. Note : où tu as paniqué, où tu as menti (dit "je pense que" en étant sûr, ou l'inverse), où tu as sauté la reproduction. Refais le drill dans 3 jours avec un autre bug de ton cru.
