# CI/CD BASICS : GITHUB ACTIONS DE ZÉRO : TESTER, BUILDER, DÉPLOYER À CHAQUE PUSH

Le camp a une checklist avant chaque expédition : vérifier les armes, vérifier les munitions, vérifier l'essence. Si Rick fait cette checklist de mémoire à chaque fois, un jour il va oublier une étape, et ce jour-là quelqu'un en paie le prix. La solution : automatiser la checklist. C'est exactement ce que fait un pipeline CI/CD.

---

## 1) CI ET CD : DEUX CONCEPTS DIFFÉRENTS, SOUVENT CONFONDUS

```
CI  --> Continuous Integration (intégration continue)
        à CHAQUE push, on vérifie automatiquement que le code est sain
        (tests, lint, build) AVANT de l'intégrer au reste du projet

CD  --> Continuous Deployment/Delivery (déploiement/livraison continue)
        si le code est sain (CI passé), on l'envoie automatiquement
        vers un environnement (staging, prod)
```

```
DÉVELOPPEUR PUSH
       |
       v
   [CI : tests + lint + build] --> échec --> on bloque, on alerte, RIEN d'autre ne se passe
       |
     succès
       |
       v
   [CD : déploiement automatique vers staging/prod]
```

**Technique :** CI répond à "est-ce que ce code est correct ?". CD répond à "est-ce que ce code va en prod ?". Tu peux avoir l'un sans l'autre : CI seul (tu valides automatiquement, mais tu déploies à la main), ou les deux ensemble (validation ET déploiement entièrement automatisés).

---

## 2) ANATOMIE D'UN PIPELINE GITHUB ACTIONS

```yaml
# .github/workflows/ci.yml
name: CI du camp

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Récupérer le code
        uses: actions/checkout@v4

      - name: Installer Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Installer les dépendances
        run: npm ci

      - name: Linter le code
        run: npm run lint

      - name: Lancer les tests
        run: npm test

      - name: Build du projet
        run: npm run build
```

```
on:           --> QUAND ce pipeline se déclenche (push, pull request, planifié, manuel...)
jobs:         --> QUOI faire, organisé en jobs qui peuvent tourner en parallèle ou en série
runs-on:      --> SUR QUEL OS la machine virtuelle GitHub tourne (ubuntu, windows, macos)
steps:        --> les étapes séquentielles à l'intérieur d'un job
uses:         --> réutilise une action déjà écrite par toi ou la communauté
run:          --> exécute une commande shell directement
```

**Technique :** chaque exécution de workflow tourne sur une machine virtuelle fraîche, jetable, fournie par GitHub. Rien de persistant entre deux runs, sauf si tu utilises explicitement du cache. C'est ce qui garantit que le pipeline teste dans des conditions reproductibles, pas dans un environnement pollué par des runs précédents.

---

## 3) LE CACHE : NE PAS REFAIRE CE QUI A DÉJÀ ÉTÉ FAIT

```yaml
- name: Installer Node
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'    # <-- met en cache automatiquement le dossier ~/.npm
```

```
sans cache  --> npm ci re-télécharge TOUTES les dépendances à CHAQUE run
                peut prendre 1-3 minutes selon la taille du projet

avec cache  --> les dépendances déjà téléchargées sont récupérées depuis le cache GitHub
                souvent quelques secondes au lieu de minutes
```

**Qui casse en prod (enfin, qui plombe la CI) :** un pipeline sans cache qui prend 8 minutes à chaque run, alors qu'avec un cache bien configuré il en prendrait 90 secondes. Sur une équipe qui push 20 fois par jour, c'est des heures cumulées perdues à attendre, chaque semaine.

---

## 4) MATRIX BUILDS : TESTER PLUSIEURS CONFIGURATIONS EN PARALLÈLE

Le camp doit savoir si son plan marche peu importe le terrain : forêt, ville, désert. Une matrix build teste ton code sur plusieurs configurations en même temps.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

```
SANS matrix :
1 job, teste sur Node 20 seulement
--> si ça casse sur Node 18 chez un client, tu le découvres APRÈS, en prod

AVEC matrix :
3 jobs en parallèle, testent sur Node 18, 20 ET 22 simultanément
--> tu détectes les incompatibilités de version AVANT le merge
```

**Pourquoi ça compte :** une lib publiée sur npm doit souvent supporter plusieurs versions de Node, parfois plusieurs OS. Une matrix build vérifie automatiquement toutes ces combinaisons à chaque push, sans que tu aies à le faire manuellement sur chaque machine.

---

## 5) SECRETS : NE JAMAIS METTRE UN MOT DE PASSE EN CLAIR

```yaml
steps:
  - name: Déployer
    env:
      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}    # injecté depuis les secrets GitHub
    run: ./deploy.sh
```

```
JAMAIS ça :
run: curl -H "Authorization: Bearer abc123motdepasse" https://api.deploy.com
# le token est visible en clair dans le fichier, committé, lisible par n'importe qui

TOUJOURS ça :
les secrets sont stockés dans GitHub (Settings > Secrets), jamais dans le code
le workflow y accède via ${{ secrets.NOM_DU_SECRET }}, sans jamais l'exposer en clair dans les logs
```

**Qui casse en prod (et c'est grave) :** un token d'API ou un mot de passe de base de données committé en clair dans un fichier YAML. Une fois sur Git, même supprimé après coup, il reste dans l'historique. La seule vraie solution après une fuite : révoquer le secret immédiatement, pas juste le supprimer du fichier.

---

## 6) UN PIPELINE CD MINIMAL

```yaml
jobs:
  test:
    # ... (comme avant, lint + tests + build)

  deploy:
    needs: test              # attend que "test" réussisse avant de démarrer
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'   # déploie SEULEMENT depuis la branche main

    steps:
      - uses: actions/checkout@v4
      - name: Build l'image Docker
        run: docker build -t camp-manager:${{ github.sha }} .
      - name: Push vers le registre
        run: docker push camp-manager:${{ github.sha }}
      - name: Déployer en prod
        run: ./scripts/deploy.sh
```

```
needs: test  --> garantit l'ordre : pas de déploiement si les tests échouent
if: ...      --> garantit la condition : déploie QUE depuis main, pas depuis une branche de test
```

**Technique :** `needs` crée une dépendance explicite entre jobs. Sans ça, GitHub Actions ferait tourner `test` et `deploy` en parallèle par défaut, ce qui serait catastrophique : déployer du code jamais validé.

---

## EXERCICES

EXO 1 : La checklist automatisée :
Crée un pipeline GitHub Actions basique pour un petit projet Node : récupération du code, installation des dépendances avec cache, lint, et tests. Vérifie qu'un push avec un test cassé fait bien échouer le pipeline (rouge), et qu'un push propre le fait passer (vert).

EXO 2 : Le camp multi-terrain :
Transforme ton pipeline en matrix build qui teste sur 2 ou 3 versions de Node différentes. Casse volontairement la compatibilité avec une ancienne version (utilise une fonctionnalité JS récente) et observe quel job de la matrix échoue précisément.

EXO 3 : Le secret bien gardé :
Configure un secret GitHub (genre une fausse clé d'API), utilise-le dans un step du pipeline via `${{ secrets.NOM }}`, et vérifie dans les logs du run que la valeur n'apparaît jamais en clair (GitHub la masque automatiquement). Explique en une phrase pourquoi committer un secret en clair reste dangereux même après suppression du fichier.

---

## RÉSUMÉ

CI vérifie que le code est sain à chaque push, CD l'envoie automatiquement quand c'est le cas : deux étapes distinctes, souvent enchaînées. Un workflow GitHub Actions tourne sur une machine jetable et reproductible, avec un cache pour éviter de refaire le travail déjà fait. Les matrix builds testent plusieurs configurations en parallèle, les secrets protègent les credentials sensibles hors du code source. `needs` et les conditions `if` garantissent l'ordre et les règles de déploiement. Le pipeline, c'est la checklist du camp qu'on oublie jamais, parce qu'elle est plus fiable qu'une mémoire humaine sous pression.
