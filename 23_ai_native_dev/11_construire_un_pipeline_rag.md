---
stability: intemporel
---

# CONSTRUIRE UN PIPELINE RAG : RÉCUPÉRER AVANT DE GÉNÉRER
Temps de lecture ~12 min

> **Prérequis** : `12_ai_grimoire.md` (entrées RAG, embedding, vector database), `02_prompt_engineering.md`.
> **Objectif** : construire les quatre étapes toi-même, en JS pur, sans service payant. Nommer un mécanisme et le faire tourner sont deux compétences différentes.

---

## 1) LE PROBLÈME QUE LE RAG RÉSOUT

Tu demandes à un LLM (grand modèle de langage) une réponse sur la procédure interne de déploiement de ta boîte. Il n'a jamais vu cette procédure. Il répond quand même, avec assurance, une procédure plausible et fausse.

Kakashi lit le rapport de mission d'une équipe avant de la briefer. Il n'improvise pas de mémoire : il ouvre le dossier, retient les trois pages pertinentes, et parle en s'appuyant dessus. Sans le dossier, il resterait convaincant et inutile.

RAG (Retrieval Augmented Generation : génération augmentée par récupération), c'est exactement ça : on va chercher les documents pertinents **avant** d'écrire le prompt, et on les colle dedans. Le modèle ne devine plus, il lit.

Pourquoi ça compte : c'est la seule façon d'ancrer un LLM dans des données qu'il n'a jamais vues, sans le réentraîner. Et le réentraînement, dans une boîte normale, tu ne le feras pas.

---

## 2) LES QUATRE ÉTAPES, SANS MAGIE

```
1. INDEXATION (une fois, en amont)
   documents --> découpage en morceaux --> embedding de chaque morceau --> stockés

2. REQUÊTE (à chaque question)
   question --> embedding de la question
            --> comparaison avec tous les morceaux (similarité)
            --> les K plus proches
            --> injectés dans le prompt
            --> le LLM répond en s'appuyant dessus
```

Un **embedding** est un vecteur : un tableau de nombres qui représente le sens d'un texte. Deux textes qui parlent de la même chose ont des vecteurs qui pointent dans la même direction, même sans partager un seul mot. C'est ce qui permet à "comment relancer le service" de retrouver un document intitulé "procédure de redémarrage".

Une **vector database** (base de données vectorielle) ne fait rien de conceptuellement différent de ce que tu vas écrire ci-dessous : elle compare des vecteurs. Elle le fait juste vite sur des millions d'entrées, avec un index approximatif. Sur cinquante documents, une boucle `for` suffit, et elle est exacte.

---

## 3) ÉTAPE PAR ÉTAPE, EN JS PUR

### Découper : les morceaux, pas les fichiers

Injecter un document de 40 pages dans le prompt coûte cher en tokens et noie la réponse. On découpe en **chunks** (morceaux de quelques centaines de caractères), avec un léger recouvrement pour ne pas couper une idée en deux.

```js
function decouper(texte, taille = 400, recouvrement = 60) {
 const morceaux = []
 for (let i = 0; i < texte.length; i += taille - recouvrement) {
  morceaux.push(texte.slice(i, i + taille))
 }
 return morceaux
}
```

Le recouvrement est le détail qui sépare un pipeline correct d'un pipeline frustrant : sans lui, une phrase coupée en plein milieu devient introuvable par les deux morceaux qui la contiennent à moitié.

### Comparer : la similarité cosinus, à la main

La **similarité cosinus** mesure l'angle entre deux vecteurs : 1 = même direction (même sens), 0 = sans rapport. C'est trois lignes de maths, pas une bibliothèque.

```js
function similariteCosinus(a, b) {
 let produit = 0, normeA = 0, normeB = 0
 for (let i = 0; i < a.length; i++) {
  produit += a[i] * b[i]
  normeA += a[i] * a[i]
  normeB += b[i] * b[i]
 }
 return produit / (Math.sqrt(normeA) * Math.sqrt(normeB))
}
```

Le pourquoi de l'angle plutôt que de la distance : un texte long et un texte court sur le même sujet ont des vecteurs de longueurs différentes mais de même direction. L'angle ignore la longueur, ce qui est précisément ce qu'on veut.

### Récupérer : les K meilleurs, et seulement eux

```js
function rechercher(index, vecteurQuestion, k = 3) {
 return index
  .map(entree => ({ ...entree, score: similariteCosinus(entree.vecteur, vecteurQuestion) }))
  .sort((x, y) => y.score - x.score)
  .slice(0, k)
}
```

Trois morceaux, pas trente. Plus de contexte ne veut pas dire meilleure réponse : au-delà d'un certain volume, le modèle dilue et se met à répondre à côté.

### Injecter : le prompt qui interdit d'inventer

```js
function construirePrompt(question, morceaux) {
 const contexte = morceaux.map((m, i) => `[Source ${i + 1}]\n${m.texte}`).join('\n\n')
 return `Réponds uniquement à partir des sources ci-dessous.
Si la réponse ne s'y trouve pas, réponds exactement : "Pas dans les sources fournies."
Cite le numéro de la source utilisée.

${contexte}

Question : ${question}`
}
```

Cette consigne d'abstention n'est pas décorative. Sans elle, le modèle comble les trous du contexte avec ses souvenirs d'entraînement, et tu obtiens une réponse mi-sourcée mi-inventée : le pire des deux mondes, parce qu'elle a l'air vérifiée.

### Le pipeline complet

```js
async function indexer(documents, embed) {
 const index = []
 for (const doc of documents) {
  for (const texte of decouper(doc.contenu)) {
   index.push({ source: doc.nom, texte, vecteur: await embed(texte) })
  }
 }
 return index
}

async function repondre(question, index, embed, llm) {
 const vecteurQuestion = await embed(question)
 const morceaux = rechercher(index, vecteurQuestion, 3)
 if (morceaux[0].score < 0.3) {
  return 'Pas dans les sources fournies.' // rien d'assez proche : on n'appelle même pas le LLM
 }
 return llm(construirePrompt(question, morceaux))
}
```

Le seuil de score est l'économie la plus rentable du pipeline : une question hors sujet ne consomme aucun token et ne peut pas produire d'hallucination.

---

## 4) LE REPLI 100 % LOCAL : EMBEDDER SANS COMPTE

Tu n'as pas besoin d'une API pour faire tourner tout ça. Un embedding maison, primitif mais suffisant pour valider la mécanique : un sac de mots (vecteur où chaque position compte les occurrences d'un mot du vocabulaire).

```js
function embedLocal(vocabulaire) {
 return async texte => {
  const mots = texte.toLowerCase().match(/[a-zà-ÿ]+/g) || []
  return vocabulaire.map(mot => mots.filter(m => m === mot).length)
 }
}
```

Ce que ça fait bien : la mécanique complète tourne, hors ligne, gratuitement, et tu vois les scores bouger.
Ce que ça ne fait pas : le sens. "redémarrer" et "relancer" restent deux positions étrangères l'une à l'autre. C'est justement la démonstration de ce qu'apporte un vrai modèle d'embedding : la synonymie. Fais tourner les deux versions et compare les morceaux récupérés sur la même question : la différence est l'argument.

---

## 5) CE QUI CASSE (MAIS FUN) : LE PIPELINE QUI RÉPOND TOUJOURS QUELQUE CHOSE

```js
// exemple minimal : 5 documents, questions directes, tout marche

// exemple réaliste : 500 documents, dont trois versions successives
// de la même procédure

// exemple qui casse : la question porte sur la procédure ACTUELLE.
// Les trois versions se ressemblent énormément, donc les trois sortent
// en tête avec des scores quasi identiques. Le modèle reçoit trois
// procédures contradictoires, en choisit une, et répond avec assurance
// en citant la version périmée de 2023.
```

La correction : la récupération ne se contente pas de la similarité. Tu attaches des métadonnées (date, version, statut) à chaque morceau, tu filtres avant de classer, et tu affiches la source dans la réponse pour que l'humain puisse contredire. Un pipeline RAG qui ne montre pas ses sources est invérifiable, donc inutilisable en production.

---

## 6) CE QUE ÇA NE RÉSOUT PAS

- **Le modèle peut toujours halluciner** dans les interstices du contexte fourni. RAG réduit la surface, il ne la ferme pas (voir `09_ai_hallucination_gym.md`).
- **Une mauvaise récupération donne une mauvaise réponse.** 80 % des pipelines décevants sont un problème de découpage ou de classement, pas de modèle.
- **Les droits d'accès.** Si l'index contient des documents que l'utilisateur n'a pas le droit de lire, le pipeline les lui lira à voix haute. Le filtrage par permissions se fait à la récupération, jamais dans le prompt.

---

## EXERCICES

**EXO 1 : Le pipeline complet en local**
Prends cinq documents techniques que tu écris toi-même (procédure de déploiement, règles de nommage, checklist de revue : du contenu neutre que tu produis, pas un corpus copié ailleurs). Fais tourner l'indexation, la recherche et l'injection avec `embedLocal`. Affiche les trois morceaux récupérés et leurs scores avant toute réponse. (45 minutes)

**EXO 2 : Casse ton propre découpage**
Reprends l'EXO 1 avec `recouvrement = 0`, puis formule une question dont la réponse tombe pile à la frontière entre deux morceaux. Note ce que la récupération renvoie, remets le recouvrement, compare. (20 minutes)

**EXO 3 : Le seuil d'abstention**
Pose trois questions sans aucun rapport avec ton corpus. Ajuste le seuil de score jusqu'à ce que les trois soient refusées sans qu'aucune question légitime ne le soit. Note le chiffre retenu et pourquoi. (20 minutes)

---

## RÉSUMÉ

Un pipeline RAG tient en quatre gestes : découper, embedder, récupérer les plus proches, injecter dans le prompt. Une boucle de similarité cosinus remplace une vector database tant que le corpus est petit, et un embedding maison suffit à valider la mécanique hors ligne, au prix de la synonymie. Le seuil d'abstention et l'affichage des sources sont ce qui sépare un assistant vérifiable d'un générateur de réponses plausibles. Le mécanisme "récupérer avant de générer" survivra à toutes les bases vectorielles qui se disputent le marché.
