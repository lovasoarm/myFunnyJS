---
stability: intemporel
---

# SIMULATION DE DÉFENSE ORALE : SEUL, SOUS OBJECTION

Temps de préparation ~5 min. Temps d'exécution ~15 min. Solo, chronométré, filmé
(caméra du téléphone posée face à toi). Ce document n'est pas de la lecture :
c'est un drill.

## POURQUOI CE FICHIER EXISTE

Savoir un truc ne vaut rien tant que tu n'as pas tenu ton propos sous pression.
La rétro d'un CTO hostile n'est pas une conversation : c'est une charge. Ce
drill convertit « je sais » en « je peux le tenir sous pression, seul, sans
Google, sans notes, sans IA ».

## SCÉNARIO

Tu défends ton **ADR-002** (celui du pivot multi-tenant du
`30_mini_projects/14_system_design_lab/`) devant un CTO hostile. Il n'a pas
lu ton code. Il vient de lire ton ADR en diagonale. Il te donne 5 minutes
pour justifier ton choix, puis 5 minutes de contre-feu, puis 5 minutes de
verdict.

Personnage joué par toi-même à la deuxième voix (change de posture physique
entre les rôles) :

> **CTO** : « Tu m'as fait perdre trois semaines sur un pivot qui, franchement,
> je le sentais pas. Convaincs-moi que tu n'as pas juste suivi la mode. »

## RÈGLES DU DRILL

- **Timer visible** : 5 min défense + 5 min objections + 5 min verdict. Pas de
  pause. Pas de « attends ». Si tu bloques, tu bloques à voix haute.
- **Solo** : aucun binôme, aucune IA, aucun brouillon lu. Une feuille A4
  blanche autorisée pour un schéma dessiné en direct.
- **Filmé** : téléphone en mode caméra, cadre buste. Tu ne regardes PAS le
  replay avant d'avoir écrit ton auto-évaluation.
- **Une seule prise**. Pas de retake. Le premier jet est le livrable.

## LES 3 OBJECTIONS TYPES (pré-écrites, à jouer)

À la fin de ta défense, tu **dois** te répondre à chacune de ces trois
objections dans l'ordre, à voix haute :

1. **« Ton pivot coûte cher pour un problème que tu n'as pas encore. »**
   Défense attendue : preuve chiffrée (ordre de grandeur du trafic attendu,
   coût du refactor plus tard) OU aveu honnête que c'était prématuré. L'aveu
   propre vaut plus que la justification faible.

2. **« La solution que tu as rejetée (schema-per-tenant) est celle que tout
   le monde utilise en 2026. Pourquoi toi non ? »**
   Défense attendue : critère de décision explicite (isolation vs opérabilité,
   coût migration, connaissance de l'équipe). Si ton critère n'a pas de nom,
   tu perds ce round.

3. **« Ton ADR ne mentionne aucun rollback. Qu'est-ce que tu fais si en prod
   le P99 explose à 500ms au lieu des 200 promis ? »**
   Défense attendue : plan de rollback nommé (feature flag, dual-write, kill
   switch) OU aveu que le rollback n'a pas été pensé et que c'est un trou.

## GRILLE D'AUTO-ÉVALUATION (5 critères, notés /2)

À remplir **avant** de regarder le replay. À re-remplir après le replay pour
mesurer l'écart entre auto-perception et réalité.

| Critère                       | 0                              | 1                              | 2                                  |
| ----------------------------- | ------------------------------ | ------------------------------ | ---------------------------------- |
| **Clarté du problème résolu** | Je n'ai pas su le nommer       | Nommé mais flou                | Nommé + une phrase qui claque      |
| **Trade-off explicite**       | Je n'ai pas cité d'alternative | Alternative citée sans critère | Alternative + critère de tri nommé |
| **Tenue sous objection**      | J'ai reculé ou paniqué         | J'ai tenu mais bafouillé       | J'ai reformulé et tenu             |
| **Aveu propre vs bluff**      | J'ai bluffé                    | Bluff partiel                  | Aveu ciblé, précis, sans excuse    |
| **Rollback nommé**            | Pas mentionné                  | Mentionné vaguement            | Nommé + condition de déclenchement |

Score : /10.

- **< 5** : tu ne tiens pas en entretien réel. Refais le drill dans 48h avec
  le même ADR, sans changer le fond.
- **5–7** : tu tiens mais tu bavardes. Refais avec un timer plus serré (3 min
  défense au lieu de 5).
- **8–10** : tu peux passer à l'entretien réel. Garde la vidéo comme baseline.

## APRÈS LE DRILL

- Compare ton auto-évaluation d'avant-replay et après-replay. L'écart est la
  vraie leçon : c'est la partie de toi que tu ne vois pas.
- Copie ta note dans `31_annexes/interview/JOURNAL.md` (crée le si absent).
  Trois drills = un pattern. Le pattern est ton axe de progrès.

## POURQUOI CE DRILL EST NON-NÉGOCIABLE

Sans preuve orale sous pression, ton savoir est théorique. Un CTO ne lit pas
tes tests ; il te regarde dans les yeux pendant que tu défends un choix qui a
coûté. Ce fichier est le seul endroit du repo où l'apprenant s'entend
lui-même. Tant que tu n'as pas fait ce drill au moins une fois, la pierre
« Communication » reste inachevée.
