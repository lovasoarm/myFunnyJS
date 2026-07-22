---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# EXO [IA MENTEUSE] : async (forEach + await)

Temps de lecture ~2 min


> Tag `[IA MENTEUSE]` : une IA a généré ce code. Il tourne. Il a l'air propre. Il ment.
> Durée : 15 min chrono. Zéro exécution avant d'avoir écrit ta réponse.

## Contexte

Tu demandes à une IA générique d'écrire une fonction qui récupère la mission de chaque Makai Knight (voir `01_async_jungle.md`) l'une après l'autre, dans l'ordre, en attendant chaque résultat avant de passer au suivant. Voici ce qu'elle génère :

```js
async function briefAllKnights(knights) {
 console.log("Début du briefing");

 knights.forEach(async (knight) => {
  const mission = await fetchMission(knight);
  console.log(`${knight} : ${mission}`);
 });

 console.log("Briefing terminé, tout le monde est informé");
}

briefAllKnights(["leon", "zaruba", "rei"]);
```

L'IA t'assure : "le `await` à l'intérieur du `forEach` garantit que chaque mission est récupérée avant de passer au knight suivant, donc le log 'Briefing terminé' arrive bien après que tous les knights ont reçu leur mission."

## Consigne

Avant de lancer une seule ligne :

1. Prédis l'ordre exact des logs dans la console.
2. Identifie la phrase de l'IA qui est fausse, et explique le mécanisme réel derrière `forEach` et `async`.
3. Corrige le code pour que "Briefing terminé" s'affiche vraiment en dernier, avec deux solutions différentes (une séquentielle, une parallèle).

Ensuite seulement, lance le code et compare à ta prédiction.

## Piège caché

`forEach` ne connaît rien à `async`/`await`. Il lance la callback pour chaque élément et passe direct au suivant, sans jamais attendre la Promise retournée (voir `01_async_jungle.md`, section piège des boucles). Le `await` bloque bien l'exécution interne de chaque callback, mais `forEach` lui-même ne bloque jamais.

## Preuve à livrer

- ta prédiction écrite AVANT exécution (`prediction.txt`)
- le diff entre ta prédiction et le résultat réel
- tes deux versions corrigées (`fix_sequentiel.js` avec une boucle `for...of`, `fix_parallele.js` avec `Promise.all` + `map`)

## Pourquoi c'est vital

`forEach` + `await` est un des pièges les plus générés par les IA de code, parce que syntaxiquement ça ressemble à du code qui attend. Si tu ne sais pas pourquoi ça ment, tu vas debugger un bug de timing en prod pendant des heures sans jamais soupçonner ces trois lignes.
