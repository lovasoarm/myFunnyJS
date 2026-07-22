---
stability: intemporel
---

# Éthique & Licences (annexe indispensable)
Temps de lecture ~6 min

> **INTEMPOREL** : le droit d'auteur logiciel existe depuis les années 80,
> les licences OSS depuis les années 90, l'AI Act depuis 2024. La logique
> juridique bouge lentement : vs la mode technique.

## 1. Licences OSS de base

| Licence   | Peux-tu vendre ? | Dois-tu ouvrir tes modifs ? | Attribution ? |
|-------------|------------------|-----------------------------|---------------|
| MIT     | Oui       | Non             | Oui (notice) |
| Apache 2.0 | Oui       | Non             | Oui + brevets |
| BSD-3    | Oui       | Non             | Oui      |
| GPL v3   | Oui       | **Oui** (copyleft fort)   | Oui      |
| LGPL    | Oui       | Modifs de la lib oui    | Oui      |
| AGPL    | Oui       | **Oui même en SaaS**    | Oui      |
| Unlicense  | Oui       | Non             | Non      |
| Proprio   | Selon contrat  | -              | -       |

### Piège classique

Mixer du **GPL** dans une base **MIT** distribuée = ta base entière devient
GPL par contamination. Toujours vérifier la licence de **chaque** dépendance
avant de la vendorer.

## 2. Code généré par IA : statut juridique

État en 2026 (à re-vérifier tous les 6 mois : **PÉRISSABLE**) :

- **USA** : l'US Copyright Office refuse le copyright sur du code purement
 généré par IA sans intervention humaine créative.
- **EU (AI Act, entré en vigueur 2024)** : obligation de transparence sur
 les contenus générés + traçabilité du dataset d'entraînement pour les
 modèles à haut risque.
- **Reproduction littérale d'un training set** : plusieurs procès en cours
 (Copilot, Stability). Tant que non tranchés, **assume que la sortie IA
 peut contenir du code sous licence**.

### Règles Thor

1. Ne demande **jamais** à l'IA de "reproduire l'algorithme de X". Demande
  un algorithme, décris-le fonctionnellement.
2. Passe toute sortie IA dans un scanner de licence (ex: `licensee`, `scancode`).
3. Documente dans `AI_USAGE.md` : quand tu as utilisé l'IA, sur quel code,
  quelle validation.
4. Pour du code destiné à un client / employeur : vérifie leur politique
  IA **avant** de coller quoi que ce soit.

## 3. Éthique : au-delà du légal

- **Consentement** : si tu scrapes, respecte robots.txt, rate-limit, ToS.
- **Vie privée** : minimise les données collectées (GDPR "minimisation").
- **Biais** : si tu entraînes un modèle, mesure les biais sur les groupes
 protégés. Documente les limites dans un "model card".
- **Dark patterns** : refuse d'implémenter des interfaces qui trompent
 le shinobi (opt-out caché, faux boutons, honte du décochage).
- **Impact énergétique** : voir `31_annexes/03_finops_greenops.md`.

## 4. Checklist avant de publier

- [ ] `LICENSE` clair à la racine.
- [ ] `NOTICE` si Apache ou dépendances avec attributions.
- [ ] `AI_USAGE.md` transparence sur le code assisté.
- [ ] Audit `npm audit` + `licensee` en CI.
- [ ] `PRIVACY.md` si tu collectes de la donnée shinobi.

## (attention) Ce que l'analogie "c'est juste du code" cache

Le code est un **produit juridique**. Ce que tu écris (ou colles) crée des
obligations pour toi, ton employeur, tes shinobis. L'ignorance ne
protège pas.


## Le piège du code GPL craché par Copilot

Une IA peut cracher du code copié d'un repo GPL sans te prévenir. Si tu l'intègres dans un jutsu propriétaire, tu es en violation.

**Protocole minimum :**
1. Tout snippet > 20 lignes venant d'une IA : grep sur GitHub, vérifie l'absence de match exact.
2. Doute ? Réécris-le. Zéro copier-coller aveugle.
3. En entreprise : politique claire écrite. En perso : mentionne "AI-assisted" dans le README si tu diffuses.

Voir aussi : SPDX license identifiers, `license-checker` npm package.
