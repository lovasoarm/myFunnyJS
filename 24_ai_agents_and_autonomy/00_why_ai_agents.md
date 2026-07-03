[PERISSABLE] PÉRISSABLE : vérifié 2026-07 (mais le squelette conceptuel est intemporel)

# POURQUOI CE MODULE EXISTE

> Ce module reutilise : IA native (23_ai_native_dev), observabilite (27_observability).
Temps de lecture ~10 min

`23_ai_native_dev` t'a appris à travailler avec un copilote qui te suggère du code
une ligne à la fois. Ce module te prépare au **niveau au-dessus** : les agents
autonomes multi-étapes (Devin, Cursor Composer, Claude Code, agents maison) qui
prennent une intention (`"corrige ce bug de prod"`) et exécutent 40 actions
d'affilée : lire, écrire, tester, commit, ouvrir une PR.

En 2028, la question ne sera plus "sais-tu écrire du code ?" mais "sais-tu diriger
un agent qui écrit 50× plus vite que toi sans qu'il ne casse la prod ?".

---

## LE PROBLÈME NOUVEAU

Un copilote se corrige à chaque ligne : tu vois, tu valides, tu passes. Un agent
autonome enchaîne 40 décisions avant que tu ne relises. Si la 3e est fausse, les 37
suivantes sont fausses aussi mais **cohérentes entre elles**. Le résultat compile,
passe les tests que l'agent a lui-même écrits, ouvre une PR propre : et introduit
une régression subtile que personne ne verra avant 3 mois.

C'est le nouveau piège. Ce module l'anatomise.

---

## LES 3 COMPÉTENCES CIBLES

1. **Cahier des charges vérifiable machine.** Un prompt vague donne 40 actions
   vagues. Un cahier des charges avec critères d'acceptation binaires (tests qui
   passent, fichier X existe, métrique Y sous seuil Z) borne l'agent.
2. **Audit d'une trace d'agent.** Lire les 40 actions comme on lit une stack trace :
   trouver la décision qui a tout dévié.
3. **Refuser une trace.** Reconnaître qu'un agent a bien fait le job DEMANDÉ mais
   pas le job VOULU. Politesse à part, savoir revert.

---

## PLAN DU MODULE

- `01_agents_vs_copilots.md`         : différence fondamentale, quand utiliser quoi
- `02_verifiable_specifications.md`  : écrire un cahier des charges bornable
- `03_reading_agent_traces.md`       : analyser une trace de 40 actions
- `04_refusing_a_trace.md`           : l'art du revert argumenté
- `05_agent_sandbox_hygiene.md`      : sécurité : ce qu'on ne laisse jamais faire
- `06_agents_grimoire.md`            : synthèse
- `07_agent_hallucination_gym.md`    : 10 traces piégées, à démonter

---

## (attention) ATTENTION PÉRENNITÉ

Les OUTILS cités périront (Devin, Cursor, Claude Code peuvent disparaître). Les
CONCEPTS survivront : bornage par tests, audit de trace, refus argumenté. Reste
sur les concepts en lisant ce module. Chaque fichier isole ce qui est intemporel
de ce qui est daté 2026-2028.

Prérequis : `23_ai_native_dev` complet, `06_testing`, `22_security`.

> Ce module réutilise : l'IA native du module 23 (`23_ai_native_dev`), les tests du module 06 (`06_testing`), la sécurité du module 22 (`22_security`).
