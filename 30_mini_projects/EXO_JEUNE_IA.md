---
stability: intemporel
---

# EXO [JEUNE IA] : 30_mini_projects

Temps de lecture ~2 min

> Tag `[JEUNE IA]` : IA totalement coupée (Copilot / Claude / ChatGPT
> désactivés). Durée : 45 min chrono.

## Contexte

Tu joues le rôle du **dev senior** qui accompagne une IA junior sur son
premier mini-projet. L'IA est bornée : elle sait générer du code, elle ne
sait pas juger un scope.

## Mission

Prends `10_legacy_dungeon` ou `13_memory_hunter`. Sans écrire une ligne
de code, produis **un brief de 300 mots max** que tu donnerais à une IA
junior pour qu'elle attaque le projet sans dérailler.

Le brief doit contenir, dans cet ordre :

1. **But mesurable** en une phrase.
2. **Périmètre exclu** (ce que l'IA ne doit surtout PAS coder toute seule
   sans validation humaine — typiquement : les décisions d'architecture,
   la politique d'éviction, le choix de broker).
3. **3 checkpoints** où l'IA doit s'arrêter et te montrer son travail.
4. **1 test d'acceptation** rédigé en langage naturel.

## Auto-vérification (10 min)

Relis ton brief à voix haute. Si un dev de 2 ans XP le lit sans contexte,
peut-il commencer à guider une IA ? Si non, reformule.

Piège classique : le brief liste toutes les fonctions à écrire. C'est la
mauvaise granularité. Le brief doit contraindre les **choix**, pas la
frappe.

Livrable : `BRIEF.md` dans le dossier du mini-projet choisi. Non versionné
si tu le juges brouillon.
