---
stability: intemporel
---

# DOCKER BASICS : CONTAINERISER UNE APP NODE : DOCKERFILE, COMPOSE, MULTI-STAGE BUILDS
Temps de lecture ~9 min

"Ça marche chez moi" c'est la phrase la plus dangereuse du camp. Daryl teste son plan sur son terrain, ça marche. Il l'applique sur un autre terrain, ça foire, parce que le sol est différent, l'humidité est différente, les ressources dispo sont différentes. Docker résout exactement ce problème : il fait que l'environnement soit IDENTIQUE partout, peu importe la machine qui l'exécute.

---

## 1) LE CONCEPT : ISOLATION, PAS VIRTUALISATION COMPLÈTE

Erreur fréquente : penser qu'un container Docker c'est comme une machine virtuelle (VM). C'est faux, et la différence compte.

```
MACHINE VIRTUELLE          CONTAINER DOCKER
------------------          -----------------
simule un OS complet         partage le noyau (kernel) de l'OS hôte
démarre en dizaines de secondes   démarre en millisecondes
pèse plusieurs Go          pèse souvent quelques dizaines de Mo
isolation totale           isolation au niveau processus
```

```
[MACHINE HÔTE]
  |
  +-- [Container 1] -- ton app Node, isolée
  +-- [Container 2] -- une base de données, isolée
  +-- [Container 3] -- un cache Redis, isolé

  (tous partagent le même kernel, mais chacun voit son propre filesystem,
   ses propres processus, son propre réseau)
```

**Technique :** un container utilise des fonctionnalités du noyau Linux (namespaces, cgroups) pour isoler un processus comme s'il tournait seul sur sa machine, sans le coût de virtualiser un OS entier. C'est pour ça que c'est rapide et léger comparé à une VM classique.

---

## 2) DOCKERFILE : LA RECETTE DE TON ENVIRONNEMENT

```dockerfile
# On part d'une image de base : Node déjà installé, version précise
# "alpine" = une distribution Linux minimaliste, très légère
FROM node:20-alpine

# Le dossier où tout va se passer DANS le container
WORKDIR /app

# On copie d'abord SEULEMENT les fichiers de dépendances
# (pas tout le code source pour l'instant, c'est volontaire, voir plus bas)
COPY package.json package-lock.json ./

# Installation des dépendances DANS le container
RUN npm ci

# MAINTENANT on copie le reste du code source
COPY . .

# Le port que l'app écoute à l'intérieur du container
EXPOSE 3000

# La commande qui démarre l'app quand le container se lance
CMD ["node", "src/index.js"]
```

```
ordre des instructions dockerfile --> chaque ligne crée une "couche" (layer) en cache
si une couche n'a pas changé   --> Docker la réutilise, pas besoin de la refaire
```

**Pourquoi l'ordre compte (et pourquoi on copie package.json AVANT le code) :**

```
MAUVAIS ORDRE :
COPY . .       <-- copie tout, y compris le code qui change à CHAQUE commit
RUN npm ci       <-- cette étape se relance à CHAQUE build, même pour 1 ligne changée

BON ORDRE :
COPY package.json ./  <-- ce fichier change rarement
RUN npm ci       <-- cette étape lourde reste EN CACHE tant que package.json bouge pas
COPY . .        <-- le code change souvent, mais cette étape est rapide
```

**Qui casse en prod :** un mauvais ordre dans le Dockerfile fait que chaque build réinstalle TOUTES les dépendances même pour un changement d'une ligne de code. Sur un gros projet, ça transforme un build de 30 secondes en build de 10 minutes, à chaque déploiement.

---

## 3) MULTI-STAGE BUILD : LE CAMP DE BASE VS LE CAMP D'EXPÉDITION

Tu as pas besoin d'emporter tout ton atelier de réparation en expédition. Juste l'outil fini. Un multi-stage build applique ce principe : utiliser une image complète (avec tous les outils de build) pour CONSTRUIRE l'app, puis ne garder que le résultat fini dans une image finale minimaliste.

```dockerfile
# ===== STAGE 1 : construction =====
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
# Cette étape produit un dossier /app/dist avec le code compilé/optimisé

# ===== STAGE 2 : exécution =====
FROM node:20-alpine AS runner
WORKDIR /app
# On copie SEULEMENT le résultat du build, pas les outils qui ont servi à le produire
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/index.js"]
```

```
image avec UN SEUL stage (tout en un) --> contient outils de build + code source + node_modules dev
                      facilement 500 Mo à 1 Go

image avec multi-stage         --> contient SEULEMENT le code compilé + dépendances de prod
                      souvent 80-150 Mo
```

**Technique :** chaque `FROM` démarre un nouveau stage indépendant. `COPY --from=builder` permet de piocher des fichiers d'un stage précédent sans embarquer tout son contenu. Le stage final ne garde aucune trace des outils de compilation, des devDependencies, ou du code source brut.

**Qui casse en prod :** une image sans multi-stage qui embarque tout l'outillage de build, les `devDependencies`, le code source non compilé. Résultat : une image énorme, plus lente à déployer, avec une surface d'attaque (zone exploitable par un attaquant) plus grande, parce que plus d'outils présents = plus de vulnérabilités potentielles.

---

## 4) DOCKER COMPOSE : ORCHESTRER PLUSIEURS CONTAINERS ENSEMBLE

Une vraie app a rarement un seul container. Elle a une app, une base de données, peut-être un cache. Docker Compose décrit tout ce petit camp en un seul fichier.

```yaml
# docker-compose.yml
services:
 app:
  build: .
  ports:
   - "3000:3000"   # port machine hôte : port container
  depends_on:
   - db
  environment:
   - DATABASE_URL=postgres://camp:secret@db:5432/survivants

 db:
  image: postgres:16-alpine
  environment:
   - POSTGRES_USER=camp
   - POSTGRES_PASSWORD=secret
   - POSTGRES_DB=survivants
  volumes:
   - db_data:/var/lib/postgresql/data  # persiste les données même si le container redémarre

volumes:
 db_data:
```

```js
// Une seule commande lance TOUT le camp en même temps :
// docker compose up
//
// app et db démarrent, dans le même réseau virtuel Docker,
// et "db" devient un nom d'hôte résolvable DEPUIS le container "app"
// (regarde DATABASE_URL : "db" est le nom du service, pas une IP en dur)
```

**Pourquoi ça compte :** sans Compose, il faudrait lancer chaque container manuellement, configurer le réseau à la main, gérer l'ordre de démarrage soi-même. Compose décrit tout ça de façon déclarative (tu décris l'état voulu, pas les étapes pour y arriver) et reproductible.

**Qui casse en prod :** oublier `depends_on`, et l'app démarre avant que la base de données soit prête à accepter des connexions. L'app crash au démarrage avec une erreur de connexion, alors que tout est "censé" être configuré correctement.

---

## EXERCICES

EXO 1 : Le camp portable :
Containerise un petit serveur Node existant (ou crée-en un minimal avec Express) avec un Dockerfile respectant le bon ordre (dépendances avant code source). Build l'image, lance-la, vérifie qu'elle répond bien sur le port exposé.

EXO 2 : Le sac allégé :
Transforme ton Dockerfile en multi-stage build. Compare la taille de l'image finale avant/après avec `docker images`. Note la différence en pourcentage et explique en une phrase d'où vient le gain.

EXO 3 : Le camp complet :
Crée un `docker-compose.yml` qui lance ton app Node ET une base PostgreSQL (ou Redis) ensemble, avec `depends_on` correctement configuré. Vérifie que l'app peut bien joindre la base de données en utilisant le nom du service comme hostname, pas une IP en dur.

---

## RÉSUMÉ

Docker isole au niveau processus, pas au niveau OS complet : c'est pour ça que c'est léger et rapide comparé à une VM. L'ordre des instructions dans un Dockerfile détermine ce qui reste en cache, donc la vitesse de chaque build. Le multi-stage build sépare la construction de l'exécution, pour une image finale minimaliste sans outils de build inutiles en prod. Docker Compose orchestre plusieurs containers ensemble de façon déclarative, avec un réseau et une résolution de noms automatiques entre services. "Ça marche chez moi" devient "ça marche partout pareil", point final.
