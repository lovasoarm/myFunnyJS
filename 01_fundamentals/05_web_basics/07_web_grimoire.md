[INTEMPOREL]

#  Page verrouillée
Temps de lecture ~9 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

# WEB GRIMOIRE : LES MOTS QUE TU DOIS MAÎTRISER

Le web c'est pas juste du HTML qui s'affiche.
C'est un arbre en mémoire, un réseau de requêtes, un coffre-fort de données, et un système de modules connectés.
Si tu ne maîtrises pas ces termes, tu codes à l'aveugle dans un navigateur.

---

| Terme | Définition | Code | Analogies |
|---|---|---|---|
| DOM | Document Object Model : représentation en mémoire de la page HTML sous forme d'arbre de nodes : c'est ce que JS manipule | `document.querySelector("h1")` <br> `document.createElement("div")` <br> `element.textContent = "yo"` | Un plan d'architecte de ta maison : tu modifies le plan, la maison change / Un arbre généalogique : chaque élément a un parent, des enfants, des frères |
| Node | Unité de base de l'arbre DOM : peut être un élément HTML, du texte, ou un attribut | `document.querySelector("p")` <br> `// Element node` <br> `// "Bonjour" → Text node` | Une pièce dans un immeuble : chaque pièce a sa place, ses connexions, ses voisins / Un nœud dans un réseau ferroviaire |
| querySelector | Méthode qui retourne le premier élément correspondant au sélecteur CSS : retourne `null` si rien trouvé | `document.querySelector(".card")` <br> `document.querySelector("#menu")` <br> `document.querySelector("h1")` | Un détective qui cherche le premier suspect correspondant au signalement / Ctrl+F dans un document : s'arrête au premier match |
| querySelectorAll | Retourne une NodeList de tous les éléments correspondants : pas un Array, mais itérable avec `forEach` | `document.querySelectorAll(".item")` <br> `const arr = [...document.querySelectorAll("li")]` | Un filet de pêche : ramène tout ce qui correspond / Un scanner qui liste tous les suspects |
| Event | Signal déclenché par une interaction : clic, frappe clavier, soumission de formulaire, scroll... | `element.addEventListener("click", fn)` <br> `element.addEventListener("input", fn)` <br> `element.addEventListener("submit", fn)` | Une sonnette : quelqu'un appuie → tu réagis / Un capteur de mouvement : détecte, déclenche |
| Event Bubbling | Quand un event se déclenche, il remonte l'arbre DOM du nœud ciblé jusqu'au document | `child.click()` <br> `// → déclenche les listeners de child` <br> `// → puis parent, puis body, puis document` | Une bulle qui remonte à la surface : part du fond, passe par chaque couche / Un chuchotement qui remonte de génération en génération |
| Event Delegation | Mettre un seul listener sur un parent pour gérer les events de tous ses enfants : exploite le bubbling | `parent.addEventListener("click", e => {` <br> `  if (e.target.matches("li"))` <br> `    e.target.remove();` <br> `})` | Un chef de sécurité à l'entrée : un seul point de contrôle pour toute la salle / Un standardiste : une seule ligne, il redirige tout |
| Reflow | Recalcul du layout de la page par le navigateur : déclenché à chaque modification de taille, position ou structure DOM | `element.style.width = "200px";` <br> `// → reflow` <br> `element.classList.add("hidden");` <br> `// → reflow si ça change le layout` | Réorganiser tous les meubles de la maison à chaque fois qu'on ajoute une chaise / Recalculer tout un tableur quand tu changes une seule cellule |
| DocumentFragment | Nœud léger hors-DOM utilisé pour construire des éléments en mémoire avant de les injecter en une seule fois | `const frag = document.createDocumentFragment();` <br> `frag.append(li1, li2, li3);` <br> `parent.append(frag); // 1 seul reflow` | Un plateau de service : tu prépares tout en cuisine, tu apportes tout d'un coup / Un camion de déménagement : tout chargé avant de partir |
| Fetch | API native JS pour envoyer des requêtes HTTP et communiquer avec un serveur ou une API | `fetch("https://api.example.com/users")` <br> `.then(r => r.json())` <br> `.then(data => console.log(data))` | Un coursier : tu lui donnes l'adresse, il va chercher le colis et te le rapporte / Un appel téléphonique : tu poses la question, tu attends la réponse |
| Promise | Objet représentant une valeur future : peut être en attente (pending), résolue (fulfilled), ou échouée (rejected) | `fetch(url)             // → Promise<Response>` <br> `.then(fn)             // si fulfilled` <br> `.catch(fn)            // si rejected` | Un ticket de vestiaire : tu le donnes maintenant, tu récupères le manteau plus tard / Un bon de ordre_mission : promesse de livraison, pas encore la livraison |
| async / await | Syntaxe qui permet d'écrire du code asynchrone comme du code synchrone : `await` attend la résolution d'une Promise | `async function load() {` <br> `  const r = await fetch(url);` <br> `  const data = await r.json();` <br> `}` | Dire "attends que le café soit prêt avant de verser" au lieu de jongler avec des minuteries / Lire les étapes d'une recette dans l'ordre au lieu de toutes les lancer en même temps |
| try / catch / finally | Bloc de gestion d'erreur : `try` = code risqué, `catch` = plan B, `finally` = s'exécute toujours | `try { await fetch(url) }` <br> `catch(e) { console.log(e.message) }` <br> `finally { hideSpinner() }` | Essayer de traverser la forêt (try), avoir un plan de secours si tu te perds (catch), ranger ton sac dans tous les cas (finally) / Un parachutiste : saute (try), parachute de secours (catch), atterrit toujours quelque part (finally) |
| LocalStorage | Stockage clé-valeur permanent dans le navigateur : survit aux rechargements et fermetures d'onglet, strings uniquement | `localStorage.setItem("key", JSON.stringify(obj))` <br> `JSON.parse(localStorage.getItem("key"))` | Un carnet de notes dans ta poche : tu l'écris aujourd'hui, tu le lis demain / Un coffre-fort dans le navigateur : persiste même quand tu éteins l'ordi |
| sessionStorage | Stockage clé-valeur temporaire : même API que localStorage mais meurt à la fermeture de l'onglet | `sessionStorage.setItem("step", "2")` <br> `sessionStorage.getItem("step")` | Une ardoise effaçable : dure toute la session, disparaît quand tu fermes / La mémoire à court terme : utile maintenant, oubliée après |
| Cookie | Stockage navigateur envoyé automatiquement au serveur à chaque requête : le seul des trois que le serveur peut lire | `document.cookie = "user=Blob; max-age=604800"` | Un badge nominatif : tu l'as sur toi, le vigile (serveur) peut le lire à chaque entrée / Un passeport : tu le présentes à chaque frontière |
| Template string | Syntaxe backtick permettant l'interpolation de variables et le multi-ligne dans une string | `` `Hello ${name}` `` <br> `` `<div>${user.hp} HP</div>` `` | Un formulaire avec des cases à remplir automatiquement / Un Mad Libs : le texte est là, tu glisses les variables dedans |
| Helper | Petite fonction utilitaire qui encapsule une opération répétée pour la rendre plus courte et lisible | `function $(sel) { return document.querySelector(sel); }` <br> `function on(el, ev, fn) { el.addEventListener(ev, fn); }` | Un raccourci clavier : même action, moins de touches / Un assistant : il fait les tâches répétitives pour que toi tu te concentres sur l'essentiel |
