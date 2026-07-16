# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~10 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## GRIMOIRE : WEB CONCEPTS

Tout ce qu'un ingé web doit avoir dans le crâne, pas juste dans les doigts. Ce grimoire couvre HTTP, le pipeline de rendu, l'état, le cache, l'auth, la sérialisation, et le rendering (SSR/SSG/CSR/ISR). Si un terme te paraît flou ici, retourne à la leçon correspondante : ce tableau résume, il ne remplace pas.

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| HTTP | Protocole texte qui définit comment client et serveur se parlent (verbe, status, headers) | `fetch('/api/ninjas', { method: 'GET' })` |un échange de scrolls de mission entre l'Hokage et un ninja | un appel radio entre Michael et son contact à l'extérieur|
| Verbe HTTP | L'intention de la requête : GET lit, POST crée, PUT remplace, PATCH modifie, DELETE supprime | `fetch(url, { method: 'PATCH' })` |"consulter le dossier" vs "ajouter un prisonnier" vs "le faire évader" : chaque verbe Prison Break a une intention différente | Walter qui "vérifie le stock" (GET) vs qui "cuisine un nouveau lot" (POST)|
| Status code | Code à 3 chiffres qui dit ce qui s'est passé (2xx ok, 4xx ta faute, 5xx leur faute) | `if (res.status === 404) { /* introuvable */ }` |un Horror absent du quartier (404, rien trouvé) vs l'armure de Garo qui se désintègre (500, erreur côté système) | un carton rouge (4xx, faute du joueur) vs un terrain impraticable (5xx, faute de l'organisation)|
| Header HTTP | Métadonnée envoyée en plus du contenu (type, taille, cache, auth) | `res.headers.get('Content-Type')` |l'étiquette sur un colis de Trapsoul Radio qui dit "fragile, format mp3" avant même d'ouvrir la boîte | le badge d'accès de Fox River qui dit qui tu es avant que tu passes la porte|
| Critical Rendering Path | Le chemin que parcourt le navigateur du HTML brut au pixel affiché à l'écran | `<link rel="preload" href="style.css">` (priorise) |la chaîne complète d'un Rasengan : rassembler le chakra, le former, le projeter : sauter une étape et ça foire à l'écran | le pipeline d'un but : passe, contrôle, frappe, avant que le ballon touche le filet|
| Reflow | Recalcul de la position et taille des éléments dans la page | `el.style.width = '50%'` (déclenche un reflow) |reconfigurer toute la formation d'une équipe de foot quand un joueur change de poste : tout le monde se replace | Rick qui redessine tout le plan du camp parce qu'une clôture a bougé|
| Repaint | Redessin visuel sans changer les positions (couleur, ombre) | `el.style.color = 'red'` (repaint seulement) |changer le maillot d'une équipe sans changer sa position sur le terrain | repeindre la porte de la cellule sans déplacer la cellule|
| State (état) | Les données qui décrivent ce que l'app affiche à un instant donné | `let chakra = 100;` |la jauge de chakra de Naruto à un instant T : un seul chiffre, mais il pilote tout l'affichage du combat | le score affiché au tableau pendant un match : une seule vérité, visible par tous|
| Single source of truth | Un seul endroit qui détient la vérité sur une donnée, jamais deux copies qui divergent | `const store = { chakra: 100 };` |un seul registre des prisonniers à Fox River, pas une copie par gardien qui pourrait diverger | le classement officiel du Ballon d'Or, pas une version par journal qui raconterait un score différent|
| Cache-Control | Header qui dit au navigateur combien de temps garder une ressource sans redemander | `res.set('Cache-Control', 'max-age=3600')` |la provision de Rick qui dure une semaine avant de devoir ressortir chercher de la nourriture | un épisode de Trapsoul Radio téléchargé qu'on réécoute sans redemander le réseau|
| ETag | Empreinte unique d'une version de ressource, pour vérifier si elle a changé | `res.set('ETag', '"v3-naruto"')` |l'empreinte digitale de T-Bag dans le dossier : si elle change, ce n'est plus le même dossier | le numéro de lot de Walter sur chaque batch : identifie précisément quelle version a été produite|
| Stale-while-revalidate | Stratégie de cache : sers l'ancienne version tout de suite, rafraîchis en arrière-plan | `Cache-Control: stale-while-revalidate=60` |le Conseil de Garo qui agit sur le dernier rapport connu pendant qu'un nouveau rapport arrive en parallèle | le classement Ballon d'Or affiché tel quel pendant qu'un nouveau vote se compile derrière|
| Authentication (authentification) | Vérifier QUI tu es (identité) | `jwt.verify(token, secret)` |le gardien de Fox River qui vérifie ton badge avant de te laisser entrer : il confirme juste qui tu es | le videur qui checke ta pièce d'identité à l'entrée du concert|
| Authorization (autorisation) | Vérifier ce que TU as le droit de faire (permission) | `if (user.role !== 'admin') throw new Error('Forbidden')` |le badge de Fox River qui dit OÙ tu as le droit d'aller une fois entré : cuisine oui, bloc administratif non | un joueur remplaçant autorisé à entrer sur le terrain, mais pas à toucher le poste d'entraîneur|
| Sérialisation | Transformer une structure en mémoire en format transportable (texte ou binaire) | `JSON.stringify({ ninja: 'Sasuke' })` |empaqueter un jutsu en parchemin transportable pour l'envoyer à un autre village | coucher la recette de Walter sur papier pour qu'elle survive au transport|
| Désérialisation | L'opération inverse : reconstruire la structure depuis le format transporté | `JSON.parse('{"ninja":"Sasuke"}')` |déplier le parchemin reçu et reconstituer le jutsu prêt à l'emploi | relire la recette de Walter et refaire exactement le même jutsu|
| Protobuf | Format binaire compact pour sérialiser, plus rapide et plus léger que JSON | `Message.encode(data).finish()` |un message codé compressé entre Chevaliers de Garo, plus rapide qu'un long rapport écrit en clair | une passe courte et précise au foot plutôt qu'un long centre lent|
| SSR (rendu côté serveur) | Le serveur génère le HTML complet à chaque requête | `res.send(renderToString(<App />))` |le QG qui prépare un rapport de mission complet avant de l'envoyer au ninja, à chaque demande | la cuisine de Walter qui refait un plat frais à chaque service|
| SSG (génération statique) | Le HTML est généré une fois au build, servi tel quel ensuite | `fs.writeFileSync('page.html', html)` (au build) |un parchemin de jutsu déjà gravé une fois pour toutes, distribué tel quel à tous les ninjas | les CD de Trapsoul Radio déjà pressés, prêts à être vendus sans repasser en studio|
| CSR (rendu côté client) | Le navigateur reçoit un squelette vide et construit la page via JS | `root.innerHTML = renderApp()` |un kit de jutsu à assembler soi-même une fois reçu, rien n'est prêt à l'arrivée | un meuble en kit livré à plat, à monter chez soi avant de pouvoir s'en servir|
| ISR (régénération incrémentale) | Statique qui se régénère automatiquement après un délai défini | `revalidate: 60` |le tableau des stats d'un joueur mis à jour automatiquement après chaque match, pas en continu seconde par seconde | le rapport de patrouille de Garo refait toutes les heures, pas à chaque pas|
| Hydratation | Le JS qui "réveille" un HTML déjà affiché pour le rendre interactif | `hydrateRoot(container, <App />)` |un sceau de scellement qui s'active et réveille le pouvoir gravé dessus | un golem de pierre immobile qui prend vie une fois le rituel terminé|
| CORS | Mécanisme qui autorise (ou bloque) un domaine à appeler une API d'un autre domaine | `res.set('Access-Control-Allow-Origin', '*')` |la frontière entre deux villages ninja : un message extérieur n'entre que si le village l'autorise explicitement | un club qui n'accepte un transfert que depuis certaines ligues partenaires|

## CE QU'IL FAUT RETENIR AU-DELÀ DU TABLEAU

HTTP, c'est la base de toute communication web : sans comprendre les status codes et les headers, tu débugges à l'aveugle. Le Critical Rendering Path explique pourquoi une image mal placée fait ramer toute la page : un reflow coûte cher, un repaint coûte moins. L'état (state) et sa source unique de vérité, c'est ce qui évite les bugs du genre "l'affichage dit une chose, la donnée réelle en dit une autre" : un classique qui pourrit les apps en prod.

Le cache (Cache-Control, ETag, stale-while-revalidate) n'est pas juste de la perf gratuite : mal géré, il sert de vieilles données au shinobi sans qu'il le sache. Authentication et authorization sont deux problèmes différents : confondre les deux, c'est le genre d'erreur qui finit dans le module 22_security.

Sur le rendering (SSR/SSG/CSR/ISR), le vrai piège c'est de choisir par habitude plutôt que par besoin réel. Une page qui change toutes les secondes n'a rien à faire en SSG. Une doc qui change une fois par mois n'a rien à faire en SSR. Le bon choix dépend de la fréquence de changement du contenu, pas de la mode du moment.

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: stable
