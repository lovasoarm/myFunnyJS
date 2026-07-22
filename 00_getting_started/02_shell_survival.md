---
stability: intemporel
---

# 02 : Shell : survie en territoire hostile
Temps de lecture ~5 min

Ton terminal, c'est ton katana. Pas d'IDE qui te tient la main. Dix commandes, tu survis à 90% des situations.

## Le kit minimum

```
pwd        # où suis-je
ls -la       # qui vit ici (fichiers cachés inclus)
cd dossier     # entrer
cd ..       # sortir
mkdir -p a/b/c   # créer une arbo
rm -rf poubelle  # supprimer (attention: pas de corbeille)
cp -r src dst   # copier
mv old new     # renommer/déplacer
cat fichier    # afficher
less fichier    # afficher gros fichier (q pour quitter)
```

## Chercher : `find` + `grep`

```
find . -name "*.md"      # tous les .md sous ici
grep -rn "TODO" .       # chercher "TODO" récursif avec n° ligne
find . -name "*.js" | xargs grep -l "eval"  # combo
```

## Pipe et redirection

```
cmd1 | cmd2    # sortie de 1 devient entrée de 2
cmd > fichier   # écraser
cmd >> fichier   # ajouter à la fin
cmd 2> err.log   # rediriger les erreurs
```

## Piège

`rm -rf /` détruit ta machine. `rm -rf $VAR/` détruit ta machine si `$VAR` est vide. Vérifie **avant** d'appuyer sur Entrée.

## Mission

1. Crée `/tmp/mission/{a,b,c}`.
2. Trouve tous les `.md` dans le repo MyFunnyJS qui contiennent le mot "closure".
3. Compte-les. Sans utiliser d'IDE.
