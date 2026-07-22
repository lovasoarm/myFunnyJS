---
stability: intemporel
---

# PUBLICATION CHECKLIST

Temps de lecture ~4 min

Ce que tu dois cocher avant de publier publiquement un mini-projet, un
billet de blog ou un produit issu du curriculum.

Cette checklist était historiquement collée en fin de `POSTMORTEM_TEMPLATE.md`.
Elle en a été extraite pour être réutilisable par n'importe quel livrable
public (mini-projet, RFC publiée, article, talk).

## 1. Contenu

- [ ] Une seule idée principale, énonçable en une phrase.
- [ ] Titre lisible sans contexte externe (pas d'ironie interne).
- [ ] Résumé (2-3 lignes) en tête pour le lecteur pressé.
- [ ] Public cible identifié (« ce billet vise les devs JS de 2-4 ans XP »).

## 2. Vérifications techniques

- [ ] Tous les blocs de code compilent / s'exécutent tels quels.
- [ ] Version de Node / navigateur / dépendance mentionnée explicitement.
- [ ] Commandes shell testées sur au moins Linux et macOS.
- [ ] Liens externes vérifiés (pas de 404).

## 3. Protection des données

- [ ] Aucune donnée réelle (client, collègue, endpoint interne, token).
- [ ] Screenshots anonymisés.
- [ ] Repo public : `.env`, secrets, fichiers `NOTES_PERSO.md` exclus.
- [ ] Historique git nettoyé (pas de credentials dans les commits passés).

## 4. Crédits et sources

- [ ] Sources externes citées (articles, ADR, code).
- [ ] Licences respectées (image, snippet, dataset).
- [ ] Contributeurs mentionnés.

## 5. Diffusion

- [ ] Lien du dépôt public : `https://github.com/<toi>/<projet>`
- [ ] Lien du billet de blog (si rédigé) : ...
- [ ] Date de publication : ...
- [ ] Peer-review reçue de : `@pseudo` (au moins un relecteur externe).

## 6. Après publication

- [ ] Réponses aux commentaires structurantes (72 h).
- [ ] Corrections des erreurs signalées dans les 7 jours.
- [ ] Retour d'expérience ajouté au POSTMORTEM du projet.
