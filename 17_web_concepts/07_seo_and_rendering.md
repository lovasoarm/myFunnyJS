---
stability: intemporel
---

# SEO ET RENDERING : OÙ TON HTML NAÎT VRAIMENT
Temps de lecture ~8 min

Ton navigateur affiche une page. Mais cette page, elle est née où ? Sur le serveur, juste avant de te l'envoyer ? Sur ton navigateur, après coup ? Ou elle dormait déjà toute construite sur un CDN (réseau de distribution de contenu) depuis des heures ? Le choix change tout : vitesse perçue, référencement Google, coût serveur. Mal choisir, c'est comme envoyer Sasuke seul contre Madara : techniquement possible, mais tu vas souffrir pour rien.

## 1) CSR : LE NAVIGATEUR FAIT TOUT LE SALE BOULOT

CSR (Client-Side Rendering : rendu côté client) veut dire : le serveur t'envoye un HTML quasi vide, plus un gros bundle JS. Le navigateur télécharge le JS, l'exécute, et construit la page lui-même.

```js
// Ce que le serveur renvoie en CSR pur
// <div id="root"></div>
// <script src="bundle.js"></script>

// bundle.js fait TOUT le travail après coup
function renderApp() {
 const root = document.getElementById('root');
 // React, Vue, ou vanilla JS construit le DOM ici
 root.innerHTML = `<h1>Bienvenue, ${getUserName()}</h1>`; // (le contenu apparaît APRÈS le JS)
}

renderApp();
```

Diagramme du voyage :

```
Requête --> Serveur renvoie HTML vide + JS --> Navigateur télécharge JS --> JS s'exécute --> Page apparaît
```

Le souci : entre "Requête" et "Page apparaît", il y a un trou noir. Un robot Google qui ne sait pas exécuter du JS lourd, il voit... rien. Ou un écran blanc pendant que le JS charge. C'est rapide à développer, mais le premier rendu (FCP : First Contentful Paint) est lent et le SEO (référencement naturel) en prend un coup.

## 2) SSR : LE SERVEUR PRÉ-CUISINE LE PLAT

SSR (Server-Side Rendering : rendu côté serveur) veut dire : à chaque requête, le serveur exécute ton code, génère le HTML complet, et l'envoie déjà rempli. Le navigateur n'a plus qu'à afficher, puis le JS arrive ensuite pour "réveiller" la page (hydratation).

```js
// Express + un moteur SSR (simplifié à l'extrême)
app.get('/profil/:id', async (req, res) => {
 const ninja = await getNinjaById(req.params.id); // (requête DB à chaque visite)

 const html = `
  <html>
   <body>
    <h1>${ninja.nom}</h1>
    <p>Rang : ${ninja.rang}</p>
   </body>
  </html>
 `; // (HTML déjà rempli, pas un squelette vide)

 res.send(html);
});
```

```
Requête --> Serveur exécute le code --> Serveur génère le HTML complet --> Navigateur affiche direct
```

Avantage réel : Google voit du contenu tout de suite, et l'utilisateur aussi. Le piège : chaque requête refait le boulot. Si 10 000 personnes regardent le profil de Naruto en même temps, ton serveur recalcule le même HTML 10 000 fois. Ça coûte du CPU pour rien si le contenu ne change pas entre chaque visite.

## 3) SSG : CONSTRUIRE UNE FOIS, SERVIR MILLE FOIS

SSG (Static Site Generation : génération statique) veut dire : le HTML est généré une seule fois, au moment du build (la construction du projet), pas à chaque requête. Ensuite c'est juste un fichier statique posé sur un CDN.

```js
// Script de build (exécuté UNE FOIS, pas à chaque visite)
async function buildPages() {
 const ninjas = await getAllNinjas(); // (une seule requête DB, au build)

 for (const ninja of ninjas) {
  const html = `<h1>${ninja.nom}</h1><p>Rang : ${ninja.rang}</p>`;
  fs.writeFileSync(`./dist/profil-${ninja.id}.html`, html); // (fichier figé sur disque)
 }
}
```

```
Build (une fois) --> HTML généré et stocké --> CDN sert le fichier --> Requête : zéro calcul serveur
```

C'est ultra rapide à servir : le CDN balance un fichier statique, point. Le piège évident : si les stats de Naruto changent (il monte en rang), la page reste figée jusqu'au prochain build. Bon pour un blog, une doc, une page produit qui change pas toutes les 5 minutes. Mauvais pour un dashboard de match en direct.

## 4) ISR : LE COMPROMIS QUI RAFRAÎCHIT TOUT SEUL

ISR (Incremental Static Regeneration : régénération statique incrémentale) prend le meilleur des deux : du statique ultra rapide, mais qui se régénère automatiquement après un délai, sans tout rebuilder.

```js
// Exemple conceptuel (style Next.js)
export async function getStaticProps() {
 const ninja = await getNinjaById('naruto-007');

 return {
  props: { ninja },
  revalidate: 60, // (après 60 secondes, la prochaine requête déclenche une régénération en arrière-plan)
 };
}
```

```
1ère requête après 60s --> Sert l'ancienne version (rapide) --> Régénère en arrière-plan --> Prochaine requête voit la nouvelle version
```

Risque réel : l'utilisateur peut voir une donnée légèrement périmée pendant la fenêtre de régénération. Pour un profil de joueur de foot où les stats changent une fois par match, c'est parfait. Pour un système de tribut, c'est un cauchemar : tu ne veux jamais qu'un prix affiché soit périmé.

## 5) CHOISIR : LA VRAIE QUESTION

```
Le contenu change à CHAQUE requête (escouade, dashboard live) --> SSR ou CSR
Le contenu change RAREMENT (doc, landing page, blog)     --> SSG
Le contenu change PARFOIS, à intervalle connu        --> ISR
Le SEO compte zéro (app interne, dashboard admin)       --> CSR suffit
```

Risque réel partagé par SSR et SSG mal utilisés : l'hydratation (le JS qui "réactive" le HTML déjà affiché) peut créer un flash bizarre si le serveur et le client ne sont pas d'accord sur le contenu (hydration mismatch). Walter White ne mélange jamais deux formules sans vérifier qu'elles donnent le même résultat : toi non plus.

---

## EXERCICES

EXO 1 : Le dashboard qui ne doit jamais mentir :
Tu construis la page de stats live d'un match de foot (score, possession, minute du match). Choisis le mode de rendu et justifie pourquoi les trois autres modes sont de mauvaises idées ici (indice : qu'est-ce qui se passe si la donnée est périmée de 5 minutes ?).

EXO 2 : La page profil de Ballon d'Or :
Tu as 500 joueurs nominés. Leurs stats changent une fois par semaine après les votes. Choisis entre SSG et ISR, et fixe une valeur de `revalidate` cohérente avec le rythme réel des votes.

EXO 3 : Le piège du robot aveugle :
Une page CSR pure n'apparaît dans aucun résultat Google. Explique en deux phrases pourquoi, sans dire juste "le robot ne voit pas le JS" (va plus loin : que voit-il EXACTEMENT à la place ?).

## RÉSUMÉ

CSR balance un squelette vide et laisse le navigateur tout construire : rapide à coder, lent à afficher, mauvais pour le SEO. SSR génère le HTML complet à chaque requête : bon SEO, mais ça coûte du calcul serveur en boucle. SSG génère une fois au build et sert un fichier figé : ultra rapide, mais périmé jusqu'au prochain build. ISR régénère automatiquement après un délai : le compromis pour du contenu qui change, mais pas à chaque seconde.
