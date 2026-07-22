---
stability: intemporel
---

# NODE_VERSION.md : Politique de version Node (visible apprenant)

Fichier pedagogique volontairement conserve a la racine.
Le fichier `.nvmrc` est **explicitement visible** dans le repo : c'est un
support d'apprentissage, pas seulement un artefact d'outillage.

## Regle simple

- Cible : **Node 22 LTS** (`.nvmrc` = `v22`).
- Plancher garanti : **tout code du curriculum doit tourner aussi sous Node 20 LTS**.
- Formulation officielle : _"Node >= 22 recommande, tout code doit tourner sur 20 LTS et 22."_

## Pourquoi c'est ecrit ici (et pas seulement dans un README)

Un apprenant qui ouvre `.nvmrc` doit pouvoir comprendre a quoi il sert.
Detail complet : `31_annexes/29_toolchain/08_NODE_VERSIONS.md`.

## Commandes utiles

```bash
nvm install     # installe la version listee dans .nvmrc
nvm use         # bascule sur cette version
node -v         # doit afficher v22.x (ou v20.x accepte)
```
