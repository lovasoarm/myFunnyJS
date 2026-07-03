[INTEMPOREL]

# EXO [IA MENTEUSE] : error_handling (catch qui avale)

> Tag `[IA MENTEUSE]` : une IA a généré ce code. Il tourne. Il a l'air propre. Il ment.
> Durée : 15 min chrono. Zéro exécution avant d'avoir écrit ta réponse.

## Contexte

Tu demandes à une IA générique de sécuriser un appel API qui récupère les stats d'un match (voir `04_async_error_traps.md`), pour que l'app ne crash jamais si l'API répond mal. Voici ce qu'elle génère :

```js
async function chargerStatsMatch(id) {
  try {
    const res = await fetch(`/api/matchs/${id}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("Erreur lors du chargement des stats");
  }
}

async function afficherMatch(id) {
  const stats = await chargerStatsMatch(id);
  console.log("Score final :", stats.score);
}

afficherMatch(99999); // ID inexistant
```

L'IA t'assure : "le `try/catch` protège complètement ton app : si l'API échoue, l'erreur est catchée et logguée proprement, ton programme ne crash jamais."

## Consigne

Avant de lancer une seule ligne :

1. Prédis exactement ce qui se passe quand `id` n'existe pas : que voit l'utilisateur, que voit la console.
2. Identifie la phrase de l'IA qui est fausse. Le programme "ne crash jamais" : est-ce vrai plus loin dans le code ?
3. Corrige le code pour que l'erreur soit soit propagée proprement, soit gérée avec une vraie valeur de repli (pas juste un log qui disparaît).

Ensuite seulement, lance le code et compare à ta prédiction.

## Piège caché

Le `catch` attrape bien l'erreur réseau, mais il ne `return` rien après avoir loggué : `chargerStatsMatch` retourne donc `undefined`. Le crash n'a pas disparu, il a juste déménagé deux lignes plus loin, dans `afficherMatch`, quand `stats.score` explose sur `undefined`. Un catch qui log sans traiter la conséquence ne protège rien, il déplace juste le problème et rend le vrai bug plus dur à tracer.

## Preuve à livrer

- ta prédiction écrite AVANT exécution (`prediction.txt`)
- le diff entre ta prédiction et le résultat réel
- ta version corrigée (`fix.js`), avec un choix assumé entre "je propage l'erreur" et "je retourne une valeur de repli explicite", justifié en une phrase

## Pourquoi c'est vital

Un `catch` qui log et ne fait rien d'autre est le piège d'erreur le plus généré par les IA de code, parce qu'il coche visuellement la case "gestion d'erreur" sans en avoir la fonction. Ce module t'apprend à vérifier ce qui se passe après le catch, pas juste dans le catch.
