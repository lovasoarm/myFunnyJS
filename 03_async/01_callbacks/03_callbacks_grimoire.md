# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~7 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## CALLBACKS GRIMOIRE

Les termes qui reviennent dans toute discussion sur l'async JS pré-Promises.
Savoir les nommer, c'est pouvoir en parler avec précision et lire du code legacy sans deviner.

---

| Terme                | Définition                                                                                    | Code                                                 | Analogies                                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ / meme mecanique cote football : le staff repete jusqu'a ce que la tactique tienne sans le tableau |
| **Callback**             | Fonction passée en argument à une autre fonction, pour être appelée plus tard : souvent quand une opération async est terminée.                         | `charger(id, function(err, data) { ... })`                              | Laisser son numéro à un livreur pour qu'il rappelle quand il arrive / Donner une sonnette à un médecin pour te rappeler quand c'est ton tour               |
| **Error-first callback**       | Convention Node.js : le premier argument du callback est toujours une erreur (`null` si tout va bien). Aucune librairie Node sérieuse déroge à ça.                | `fs.readFile("f.txt", function(err, data) { if (err) return; ... })`                 | Un rapport militaire qui commence toujours par "situation" avant "plan d'action" / Un arbitre qui signale d'abord le hors-jeu avant de laisser le jeu continuer     |
| **Callback hell**          | Imbrication de callbacks qui crée une pyramide illisible. Pas un problème esthétique : un problème de maintenance, de gestion d'erreur, et de testabilité.            | `a(function() { b(function() { c(function() { /* t'es ici */ }) }) })`                | Un plan d'évasion avec 5 portes, chaque porte cachée derrière la précédente / Un arbre généalogique dessiné de droite à gauche                      |
| **Inversion of control**       | Quand tu passes ton callback à une fonction tierce, tu lui confies le contrôle : c'est elle qui décide quand appeler ton code, combien de fois, et avec quoi.          | `librairieTierce.charger(opts, monCallback)` : `monCallback` peut être appelé 0, 1 ou N fois     | Confier sa carte de crédit à quelqu'un d'autre pour qu'il paye à ta place / Donner les clés de son club à un agent et espérer qu'il négocie bien             |
| **Continuation-passing style (CPS)** | Style de code où chaque fonction reçoit une "continuation" : ce qu'il faut faire ensuite : au lieu de retourner une valeur. Les callbacks error-first sont du CPS.        | `function etape(data, suite) { traiter(data); suite(null, resultat) }`                | Passer le ballon au lieu de marquer soi-même / Transmettre un dossier à l'équipe suivante au lieu de le garder                              |
| **Sequential callbacks**       | Callbacks exécutés l'un après l'autre, chaque étape attendant la fin de la précédente. Indispensable quand l'étape N dépend du résultat de N-1.                 | `a(function(err, r1) { b(r1, function(err, r2) { c(r2, ...) }) })`                  | Faire les passes dans l'ordre du jeu posé, pas en rush / Monter les chapitres d'un plan dans l'ordre logique                               |
| **Parallel callbacks**        | Plusieurs callbacks lancés simultanément, un compteur qui détecte quand tous sont terminés. Utilisé quand les opérations sont indépendantes.                   | `let count = 3; [a,b,c].forEach(id => charger(id, () => { if(--count === 0) fin() }))`        | Trois joueurs qui récupèrent le ballon sur différentes zones en même temps / Trois cuisiniers qui préparent chaque plat d'un repas en parallèle             |
| **Named callbacks**         | Technique anti-callback-hell : extraire les fonctions anonymes en fonctions nommées au lieu de les imbriquer. Même comportement, code linéaire et lisible.            | `function surChargement(err, data) { ... }` puis `charger(id, surChargement)`             | Donner un prénom à chaque joueur plutôt que de les appeler "le gars là" / Nommer chaque acte d'une pièce de théâtre au lieu de les numéroter               |
| **Timeout pattern**         | Combiner un callback async avec un `setTimeout` pour garantir qu'une réponse est émise dans un délai donné : succès ou erreur. Un booléen `estTermine` évite les doubles appels. | `const t = setTimeout(() => { if (!done) callback(new Error("Timeout")) }, 3000)`           | Un minuteur pendant une épreuve : si le joueur ne répond pas dans le temps imparti, l'arbitre siffle / Un transfert qui expire à minuit si les deux clubs ne signent pas |
| **Retry pattern**          | Réappeler une opération async en cas d'échec, avec un compteur de tentatives et un délai croissant entre chaque essai.                              | `function essayer(n) { op(function(err) { if (err && n > 0) setTimeout(() => essayer(n-1), 500) }) }` | Tirer un penalty raté une deuxième fois si l'arbitre ordonne un retir / Relancer une négociation de transfert échouée après un délai de réflexion            |
| **Concurrency control**       | Limiter le nombre de callbacks qui s'exécutent simultanément. Un compteur `actif` empêche de dépasser le seuil, une queue lance les suivants au fur et à mesure.         | `while (actif < MAX && index < ids.length) { actif++; charger(ids[index++], onDone) }`        | Max 3 joueurs en zone de presse en même temps / Faire entrer les spectateurs par groupes pour ne pas saturer les tourniquets                       |
| **Thunkification**          | Transformer une fonction error-first callback en une fonction qui retourne une fonction sans argument. Étape intermédiaire vers les Promises.                  | `const thunk = (cb) => charger(id, cb)`                                | Préparer une action sans la déclencher, puis l'activer quand on est prêt / Préparer un discours et le lire seulement quand on a le micro                 |

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
