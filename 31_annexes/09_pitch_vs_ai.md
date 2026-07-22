---
stability: intemporel
---

# Pitch : "Pourquoi moi et pas une IA ?"
Temps de lecture ~5 min

Trois pitchs types. Adapte, mais garde la structure.

---

## Pitch 1 : Le débuggeur (30s)

> "Une IA génère du code. Elle ne débugge pas un système en prod à 3h du matin quand la métrique s'effondre. Ma valeur, c'est de lire un stack trace, formuler une hypothèse, la vérifier, et écrire un post-mortem qu'un autre dev peut relire dans 6 mois. J'ai fait ça 5 fois dans MyFunnyJS, j'ai les ADR et les LEAK_REPORT pour le prouver."

Preuve à sortir : `30_mini_projects/13_memory_hunter/LEAK_REPORT_*.md`.

---

## Pitch 2 : L'architecte (30s)

> "L'IA propose 10 solutions. Elle ne choisit pas. Ma valeur, c'est de peser un trade-off avec le contexte métier, l'écrire dans un ADR, et défendre le choix 6 mois plus tard face à quelqu'un qui n'était pas là. Voici mon ADR sur l'eviction du cache : voilà pourquoi j'ai pris LRU et pas LFU."

Preuve : `13_memory_hunter/ADR/ADR-001_decision.md`.

---

## Pitch 3 : Le passeur (30s)

> "Une IA écrit du code. Elle n'onboarde pas un junior. Ma valeur, c'est de rendre lisible ce que l'équipe fait, dans le code, dans les docs, dans la revue. Voici trois PR où mon commentaire a évité un bug en prod."

Preuve : trois liens PR de ton portfolio.

---

## Anti-pattern

Ne dis **jamais** "je suis meilleur qu'une IA". Dis "j'utilise l'IA comme un stagiaire brillant mais dangereux : je vérifie tout ce qu'elle produit, et je décide". Nuance qui te fait passer de junior à mid.

---

## "Je ne sais pas" vs "Je ne sais pas encore"

Distinction critique en entretien et en revue.

- **"Je ne sais pas."** Fin. Sans plan. Signale un mur.
- **"Je ne sais pas encore."** Ouvre : *"voici comment j'irais chercher la réponse : docs officielles, minimal reproducer, benchmark, question à un pair."*

Un ingénieur crédible dit souvent le second. Jamais le premier tout court.
