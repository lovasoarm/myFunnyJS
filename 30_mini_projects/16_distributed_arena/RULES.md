# RULES : Distributed Arena

1. Pas de framework distribué (pas de RabbitMQ, pas de Redis, pas de Kafka). TCP ou
  IPC uniquement. Tu dois SENTIR ce qu'un broker te cache.
2. Pas d'IA pour l'ADR. Tu peux l'utiliser pour boilerplate. Décision = toi.
3. Chaque commit doit passer `verify.js` sur le scénario `race` au minimum.
4. Tu n'as pas le droit d'ignorer un chaos qui te dépasse. Tu écris "je ne sais pas
  encore résoudre X, voici pourquoi" dans le POSTMORTEM. C'est valorisant, pas honteux.

---
stability: intemporel
