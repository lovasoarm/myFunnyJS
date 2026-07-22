---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# 05b : Backpressure : quand le producteur va plus vite que le consommateur
Temps de lecture ~5 min

Ton stream produit 10 MB/s. Ton consommateur en avale 2 MB/s. Sans régulation, tu explose la RAM. C'est la backpressure : dire au producteur "attends".

## Push vs Pull

- **Push** : le producteur envoie dès qu'il peut. Rapide, mais dangereux.
- **Pull** : le consommateur tire quand il est prêt. Sûr, mais nécessite un protocole.

Node streams : mode push par défaut, mais `.pause()` / `.resume()` + `readable.read()` te donnent du pull.

## Exemple minimal

```js
import { createReadStream, createWriteStream } from 'node:fs'
const src = createReadStream('huge.log')
const dst = createWriteStream('/dev/null')

src.on('data', chunk => {
 const ok = dst.write(chunk)
 if (!ok) src.pause()     // dst sature -> stop
})
dst.on('drain', () => src.resume()) // dst prêt -> reprendre
```

Ou plus court, la version qui fait tout ça pour toi : `src.pipe(dst)` ou `pipeline(src, dst, cb)`.

## Web Streams (fetch, WHATWG)

`ReadableStream` a un `queuingStrategy`. Un `highWaterMark` bas force le consommateur à tirer. Pareil, pattern universel.

## Ce que l'analogie cache

La backpressure ne "ralentit" pas magiquement le producteur si tu l'ignores. Si le producteur est un WebSocket ou une DB, il faut coder la logique de pause (buffer intermédiaire, credit-based flow).

## Mission

Écris un pipeline : lecture d'un CSV de 1 GB, transformation ligne par ligne, écriture. Mesure la RAM. Sans backpressure vs avec.
