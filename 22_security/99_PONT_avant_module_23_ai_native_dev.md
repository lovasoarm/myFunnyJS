---
stability: intemporel
---

# PONT : de sécuriser du code humain à sécuriser du code IA à le développement natif IA

-> ~10 min

> **ARRÊTE-TOI ICI.** Ce fichier est un point de passage obligé entre `22_security` et `23_ai_native_dev`. Ne l'ouvre pas comme "encore un chapitre" : c'est un palier de respiration avant un saut de nature.

## POURQUOI CE PONT EXISTE

Tu sais reconnaître XSS, CSRF, injection SQL, secrets fuités. `23_ai_native_dev/` te demande de repérer les mêmes failles quand elles arrivent dans un output Copilot qui a l'air propre. La menace n'a pas changé, le canal si.

## CE QUE TU MAÎTRISES DÉJÀ

- Auditer une entrée utilisateur.
- Reconnaître un pattern OWASP dans du code.
- Refuser un secret hardcodé, même dans un exemple.

## VOCABULAIRE NOUVEAU QUI ARRIVE

- **Hallucination** : une API que le modèle a inventée, qui n'existe pas.
- **Plausible-mais-faux** : code qui compile, tourne, et fait mal la mauvaise chose.
- **Prompt injection** : entrée utilisateur qui détourne l'instruction du modèle.
- **Secret leak via prompt** : coller une clé API dans un prompt public.

## LE PIÈGE MENTAL TYPIQUE DU SAUT

Faire confiance à un snippet IA parce qu'il ressemble à du code que tu aurais écrit. La ressemblance rassure, elle ne prouve rien.

## EXERCICE-CHARNIÈRE (5 min chrono)

Copilot te propose `const hash = crypto.createHash('md5').update(pass).digest('hex')` pour hasher un mot de passe. Nomme les 3 problèmes. Réponse : MD5 (cassé), pas de salt, pas de coût. `22_security/05_hashing_bcrypt.md` a la version correcte.

## SI TU BLOQUES

Relis le module précédent avant de continuer. Ce pont existe précisément parce que sauter cette marche brise beaucoup d'apprenants. Aucune honte à revenir.
