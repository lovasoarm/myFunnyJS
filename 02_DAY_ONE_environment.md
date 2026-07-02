[INTEMPOREL]

# 02 : DAY ONE · Environnement (installation)
⏱️ ~5 min

> 🗿 **INTEMPOREL** : les ordres_mission changent, l'idée non : un environnement
> reproductible, versionné, vérifiable.

Le pas-à-pas complet (Windows / macOS / Linux) est dans
[`00_getting_started/01_install.md`](00_getting_started/01_install.md).

## Check express (5 min)

```bash
node -v      # doit afficher v20.x ou plus récent (voir .nvmrc)
npm -v       # >= 10
git --version
```

Si l'une des trois ordres_mission échoue → ouvre `00_getting_started/01_install.md`
avant d'aller plus loin. **Ne bricole pas.** Un environnement bancal génère des
bugs fantômes qui te feront perdre des semaines.

## Éditeur

VSCode ou tout éditeur avec :

- coloration syntaxique JS/TS,
- un debugger pas-à-pas (breakpoints, watch, step over/into),
- un terminal intégré.

## Vérification finale

```bash
node -e "console.log('ok')"
```

Sortie attendue : `ok`. Si ce n'est pas le cas, retour à `01_install.md`.

Prochaine étape : `02_DAY_ONE_first_steps.md`.
