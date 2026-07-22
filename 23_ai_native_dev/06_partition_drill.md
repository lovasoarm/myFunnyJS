---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# 06 : Partition drill : ce que tu delegue a l'IA, ce que tu gardes
-> ~30 min drill

Compétence Pierre 5 : savoir **decouper une tache** entre toi et l'IA, avec
un critere de decision explicite. Sans ce drill, tu delegues par reflexe
et tu perds le contact avec ton propre jugement.

## Le principe

Une IA n'est ni bonne ni mauvaise en soi. Elle est **excellente sur les
taches a haut ratio "syntaxe/reflexion"** et **dangereuse sur les taches
a haut ratio "contexte/decision"**. Ton travail : trier avant d'ouvrir
le chat.

## Grille de tri (a copier dans ton `TDD_JOURNAL.md` du jour)

Pour chaque sous-tache, coche **une** case et justifie en 1 phrase.

| # | Sous-tache | A l'IA | A moi | Pourquoi (1 phrase) |
|---|------------|--------|-------|---------------------|
| 1 |            |        |       |                     |
| 2 |            |        |       |                     |
| 3 |            |        |       |                     |
| 4 |            |        |       |                     |
| 5 |            |        |       |                     |

## Regles de decision

**Delegue a l'IA quand :**
- Boilerplate reconnaissable (getters/setters, mappings, migrations
  triviales, docstrings depuis signature).
- Traduction de format (JSON -> YAML, SQL -> Prisma schema).
- Genereration de cas de test evidents a partir d'une spec deja ecrite.
- Regex a partir d'exemples que **tu as** ecrits et que **tu peux** verifier.

**Garde pour toi quand :**
- La decision engage l'architecture (choix de pattern, decoupage de module,
  frontiere de service). Voir `31_annexes/17_frontieres_modules.md`.
- Le code touche a la securite, l'auth, la crypto, la gestion des secrets.
- Le bug est **flaky** ou **race condition** : l'IA voit un happy path,
  pas un ordonnancement.
- Le contexte est **legacy** et tu n'as pas encore fait ton
  `31_annexes/00_cartographier_codebase_inconnue.md`.
- Il faut ecrire une hypothese falsifiable (voir
  `04_debugging/05_hypothesis_driven_debug.md`).

## Le drill (30 min chrono)

1. Prends un mini-projet en cours (ex : `04_breaking_cache`).
2. Ecris la liste des 5 prochaines sous-taches concretes.
3. Remplis la grille avant d'ouvrir le chat IA.
4. Execute les taches "A moi" **sans IA**, chrono.
5. Execute les taches "A l'IA" avec IA, chrono.
6. Compare :
   - Temps reel vs temps prevu (ecart en %).
   - Nombre de retours arriere (revert / rewrite).
   - Nombre de bugs echappes attrapes en review.

## Livrable obligatoire

`PARTITION_<date>.md` dans le dossier du mini-projet, avec la grille remplie
et la comparaison chiffree. C'est ton indicateur objectif de dependance
IA : il alimente `DEPENDENCY_LEDGER.md` a la racine.

## Piege : la delegation par confort

Le piege classique : on delegue "pour aller vite" une tache qui aurait pris
2 min a la main et qui prend 8 min a formuler + verifier + patcher. La grille
casse ce reflexe : si tu ne peux pas justifier "a l'IA" en 1 phrase, garde
la tache.

## Ou l'analogie casse

On parle de "partition" comme dans une partition musicale ou un decoupage
de disque. Ce n'est pas un contrat fige : la ligne bouge selon **ton**
niveau du moment, pas selon une regle universelle. Refais ce drill toutes
les 4 semaines.

## Reference croisee

- `23_ai_native_dev/07_solo_vs_copilot_drill.md`
- `DEPENDENCY_LEDGER.md`
- `node solution.js` (auto-verif ecrite par toi)
