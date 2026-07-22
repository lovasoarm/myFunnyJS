---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# DETACHED DOM LEAK : LE POISON DES SPA
Temps de lecture ~25 min

Un nœud DOM que tu retires de l'arbre visible peut rester en RAM des heures si un seul
JS quelque part tient encore une référence. Multiplié par une SPA qui monte/démonte
20 composants par minute, ta page bouffe 500 MB en une heure sans qu'aucun bouton
n'agisse.

Prérequis : `05_heap_snapshot_hands_on.md`.

---

## 1) SCÉNARIO REPRO (à exécuter dans une page vide)

```html
<button id="mount">Mount</button>
<button id="unmount">Unmount</button>
<div id="host"></div>
<script>
const cache = [];       // <-- coupable silencieux

document.getElementById('mount').onclick = () => {
 const el = document.createElement('div');
 el.textContent = 'panel ' + cache.length;
 el.onclick = () => console.log(el.textContent);  // closure capture `el`
 cache.push(el);                  // <-- retenu à vie
 document.getElementById('host').appendChild(el);
};

document.getElementById('unmount').onclick = () => {
 document.getElementById('host').innerHTML = '';  // "détaché", mais...
};
</script>
```

1. Clique Mount x 20, puis Unmount.
2. Snapshot Memory → filtre "Detached".
3. Tu verras 20 `Detached HTMLDivElement`. Ils SONT retenus par `cache`.

---

## 2) LES 3 CAUSES CANONIQUES

```
CAUSE               COMMENT LA RECONNAÎTRE        FIX
--------------------------------  -----------------------------------  ------------------------
1. Cache/registre global      Array/Map/Set qui ne se vide jamais  WeakMap/WeakSet OU vider
2. Event listener non retiré    addEventListener sans removeListener AbortController.signal
3. Timer/interval non annulé    setInterval qui référence un nœud   clearInterval au unmount
```

---

## 3) FIX AVEC `AbortController` (moderne, propre)

```js
const ac = new AbortController();
el.addEventListener('click', handler, { signal: ac.signal });
// au unmount :
ac.abort();            // retire TOUS les listeners liés en 1 appel
```

Pourquoi c'est mieux que `removeEventListener` : tu n'as pas à garder une référence
au handler exact. Un seul `abort()` nettoie tout un scope de listeners.

---

## 4) MISSION

Reproduis le bug, capture snapshot A (avant Mount), B (après Mount + Unmount + gc()),
C (après ton fix + Unmount + gc()). Livre `LEAK_REPORT_dom.md` avec les 3 snapshots
comparés et le patch. Si le delta detached n'est pas 0 en C, ton fix est incomplet.

---

## 5) (attention) PIÈGE

`WeakMap` ne protège PAS si la clé est retenue ailleurs. Un `WeakMap<HTMLElement, data>`
ne libère l'entrée QUE si plus rien ne référence l'HTMLElement. Si `cache.push(el)`
existe, WeakMap ne t'aide pas : c'est `cache` qu'il faut virer.

Prochaine étape : `07_worker_leak_reproduction.md`.
