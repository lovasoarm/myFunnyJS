---
stability: intemporel
---

# SCRIPTS D'AUTOMATISATION : LE CODE QUI BOSSE À TA PLACE
Temps de lecture ~8 min

Un script d'automatisation, c'est du code qui fait à ta place ce que tu ferais à la main. Renommer 300 fichiers, transformer des données d'un format à un autre, synchroniser deux dossiers, générer des rapports : si tu le fais plus d'une fois, tu l'automatises. C'est la définition du dev qui ne travaille pas deux fois.

---

## 1) RENOMMER EN MASSE

```js
// scénario : t'as 200 fichiers de replay nommés en vrac
// match1.mp4, MATCH_2.mp4, match-3.mp4, Match4.mp4
// tu veux tout normaliser en : 2026-06-01_match-001.mp4

import { readdir, rename } from 'node:fs/promises'
import path from 'node:path'

async function normalizeFilenames(dir) {
 const files = await readdir(dir)
 const videoFiles = files.filter(f => f.endsWith('.mp4'))

 const results = { renamed: 0, skipped: 0, errors: [] }

 for (const [index, filename] of videoFiles.entries()) {
  const oldPath = path.join(dir, filename)
  // format normalisé : numéro sur 3 chiffres, kebab-case
  const number = String(index + 1).padStart(3, '0')
  const newName = `2026-06-01_match-${number}.mp4`
  const newPath = path.join(dir, newName)

  if (filename === newName) {
   results.skipped++
   continue
  }

  try {
   await rename(oldPath, newPath)
   console.log(`${filename} --> ${newName}`)
   results.renamed++
  } catch (err) {
   results.errors.push({ file: filename, error: err.message })
  }
 }

 return results
}
```

---

## 2) TRANSFORMER DES DONNÉES (ETL BASIQUE)

```js
// Extract-Transform-Load : lire une source, transformer, écrire ailleurs
// cas concret : convertir les stats de match depuis CSV vers JSON enrichi

import { createReadStream } from 'node:fs'
import { writeFile, mkdir } from 'node:fs/promises'
import { createInterface } from 'node:readline'
import path from 'node:path'

async function csvToJson(inputPath, outputDir) {
 await mkdir(outputDir, { recursive: true })

 const stream = createReadStream(inputPath)
 const rl = createInterface({ input: stream })

 let headers = null
 const records = []

 for await (const line of rl) {
  if (!line.trim()) continue

  const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))

  if (!headers) {
   headers = values // première ligne = headers
   continue
  }

  // assembler un objet depuis les headers et les valeurs
  const record = Object.fromEntries(
   headers.map((h, i) => [h, values[i] ?? null])
  )
  records.push(record)
 }

 // enrichir les données avant de les écrire
 const enriched = records.map((r, i) => ({
  ...r,
  id: i + 1,
  processedAt: new Date().toISOString(),
  // convertir les champs numériques
  goals: parseInt(r.goals, 10) || 0,
  assists: parseInt(r.assists, 10) || 0,
 }))

 const outputPath = path.join(
  outputDir,
  path.basename(inputPath, '.csv') + '.json'
 )
 await writeFile(outputPath, JSON.stringify(enriched, null, 2))

 return { input: inputPath, output: outputPath, count: enriched.length }
}
```

---

## 3) SYNCHRONISER DEUX DOSSIERS

```js
// copier les fichiers du dossier source vers destination
// seulement ceux qui sont nouveaux ou modifiés

import { readdir, stat, copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

async function syncDirs(source, dest) {
 await mkdir(dest, { recursive: true })

 const entries = await readdir(source, { withFileTypes: true })
 const report = { copied: [], skipped: [], errors: [] }

 for (const entry of entries) {
  const srcPath = path.join(source, entry.name)
  const destPath = path.join(dest, entry.name)

  if (entry.isDirectory()) {
   // récursion dans les sous-dossiers
   const sub = await syncDirs(srcPath, destPath)
   report.copied.push(...sub.copied)
   report.skipped.push(...sub.skipped)
   report.errors.push(...sub.errors)
   continue
  }

  try {
   const srcStat = await stat(srcPath)
   let destStat = null

   try {
    destStat = await stat(destPath)
   } catch {
    // destination n'existe pas encore
   }

   const shouldCopy = !destStat || srcStat.mtime > destStat.mtime
   // copier si : fichier absent OU source plus récente que destination

   if (shouldCopy) {
    await copyFile(srcPath, destPath)
    report.copied.push(entry.name)
   } else {
    report.skipped.push(entry.name)
   }
  } catch (err) {
   report.errors.push({ file: entry.name, error: err.message })
  }
 }

 return report
}
```

---

## 4) GÉNÉRER DES RAPPORTS

```js
// générer un rapport markdown depuis des données JSON

async function generateReport(votes, outputPath) {
 // agréger les données
 const byPlayer = {}
 votes.forEach(({ player, points, journalist }) => {
  if (!byPlayer[player]) {
   byPlayer[player] = { points: 0, votes: 0, journalists: [] }
  }
  byPlayer[player].points += points
  byPlayer[player].votes++
  byPlayer[player].journalists.push(journalist)
 })

 // trier par points décroissants
 const ranking = Object.entries(byPlayer)
  .sort(([, a], [, b]) => b.points - a.points)
  .map(([player, stats], index) => ({ rank: index + 1, player, ...stats }))

 // générer le markdown
 const lines = [
  '# Ballon d\'Or 2026 : Classement provisoire',
  `> Généré le ${new Date().toLocaleDateString('fr-FR')} : ${votes.length} votes comptabilisés`,
  '',
  '| # | Joueur | Points | Votes |',
  '|---|--------|--------|-------|',
  ...ranking.slice(0, 10).map(r =>
   `| ${r.rank} | ${r.player} | ${r.points} | ${r.votes} |`
  ),
  '',
  '## Détail des votes',
  ...ranking.slice(0, 3).map(r => [
   `### ${r.rank}. ${r.player}`,
   `${r.points} points de ${r.votes} journalistes`,
   `Votants : ${r.journalists.join(', ')}`,
   ''
  ].join('\n'))
 ]

 await writeFile(outputPath, lines.join('\n'), 'utf-8')
 return outputPath
}
```

---

## 5) ORCHESTRER PLUSIEURS SCRIPTS

```js
// un script qui coordonne d'autres opérations
// comme un chef d'orchestre : chaque tâche sait ce qu'elle fait,
// le script principal sait dans quel ordre

import { syncDirs } from './sync.js'
import { csvToJson } from './transform.js'
import { generateReport } from './report.js'
import { loadVotes } from './votes.js'

async function runPipeline() {
 const steps = [
  { name: 'Sync des données sources', fn: () => syncDirs('./raw', './data') },
  { name: 'Transformation CSV → JSON', fn: () => csvToJson('./data/votes.csv', './processed') },
  { name: 'Génération du rapport', fn: async () => {
    const votes = await loadVotes('./processed/votes.json')
    return generateReport(votes, './reports/ballon-dor-2026.md')
  }},
 ]

 for (const step of steps) {
  process.stdout.write(`${step.name}...`)
  try {
   const result = await step.fn()
   process.stdout.write(' OK\n')
   if (result) console.log(' ', JSON.stringify(result))
  } catch (err) {
   process.stdout.write(' ERREUR\n')
   console.error(` ${err.message}`)
   process.exit(1) // une étape échoue : on arrête tout
  }
 }

 console.log('\nPipeline terminé.')
}

runPipeline()
```

---

## EXERCICES

## EXO 1 : le normaliseur de données

T'as des fichiers JSON de stats de joueurs générés par différentes sources. Le problème : les champs ont des noms différents selon la source (`goals` vs `nbGoals` vs `nb_goals`). Écris un script `normalize.js` qui lit tous les fichiers JSON d'un dossier et produit un format canonique : `{ player, goals, assists, matchesPlayed }`.

---

## EXO 2 : le générateur de fixtures

Écris `generateFixtures(teams, rounds)` qui génère un calendrier de compétition : chaque équipe joue contre chaque autre équipe `rounds` fois. Exporte les fixtures en JSON et en CSV. Les fichiers doivent être nommés `fixtures-YYYY-MM-DD.json` et `fixtures-YYYY-MM-DD.csv`.

---

## EXO 3 : le pipeline complet

Crée un script `pipeline.js` qui :
1. lit les votes depuis `./data/raw/*.csv`
2. normalise les données (un format canonique)
3. sauvegarde en `./data/processed/votes.json`
4. génère un rapport markdown en `./reports/`
5. affiche un résumé dans le terminal (combien de fichiers traités, combien de votes, top 3 joueurs)

Chaque étape doit logger son avancement. Si une étape échoue : les étapes suivantes ne s'exécutent pas.

---

## RÉSUMÉ

Un script d'automatisation fait une chose, bien, de manière reproductible. Le pattern ETL (Extract-Transform-Load) structure la plupart des scripts de données : lire la source, transformer, écrire ailleurs. Pour orchestrer plusieurs scripts : une boucle sur des étapes nommées, chaque étape peut fail-fast. La règle : si tu le fais deux fois à la main, tu l'automatises. Si tu l'automatises, tu le testes.
