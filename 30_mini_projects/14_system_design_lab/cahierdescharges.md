# CAHIER DES CHARGES : SYSTEM DESIGN LAB

Temps de lecture ~2 min


## C'EST QUOI CE PROJET, CONCRÈTEMENT

Deux services qui se parlent via une queue et survivent au chaos. C'est le mur d'AOT : tant qu'il tient, la ville vit ; tu testes chaque brèche avant que le Titan colossal ne la trouve pour toi.

## OBJECTIF

Construire un mini-écosystème (front + broker + worker) avec retry, idempotence et tracing distribué, puis le chaos-tester.

## CONTRAINTES NON NÉGOCIABLES

- Docker Compose, 3 services minimum.
- Retry avec backoff exponentiel côté worker.
- Idempotence : rejouer un message ne double pas l'effet.
- Un `trace_id` traverse les 3 services.

## LIVRABLE

`ARCHITECTURE.md`, ADRs, code fonctionnel, chaos test, `POSTMORTEM.md`, dépôt GitHub public.

## SÉCURITÉ (gate obligatoire)

Avant de considérer le projet fini, tu dois traiter ces exigences OWASP contextuelles. Un projet qui marche mais qui est vulnérable n'est pas fini.

- Message poisoning (OWASP A08 - Data Integrity) : valider et signer/authentifier les messages de la queue pour qu'un worker ne traite pas un payload forgé.
- Rate limiting (OWASP A04) : borner le débit d'entrée côté front pour éviter qu'un flood ne noie broker et worker.

Pour chaque exigence : écris dans `SECURITY.md` la menace, ta contre-mesure, et le test qui la prouve. Le `verification_pack` de ce projet contient un test de sécurité qui doit passer.

## AUTO-ÉVALUATION

- [ ] Livrable complet et fonctionnel
- [ ] Contraintes respectées et vérifiées
- [ ] Section Sécurité traitée et testée
- [ ] ADR rédigé et relu
- [ ] POSTMORTEM honnête écrit

---

## Securite (gate obligatoire, Partie I)

- **Exigence 1** : aucune donnee sensible (secret, token, cle) dans le code source ni dans les logs. Utiliser variables d'environnement + `.env.example` versionne (jamais `.env`).
- **Exigence 2** : toute entree externe (STDIN, fichier, HTTP, CLI) est validee AVANT usage (type, longueur, format). En cas d'invalidite : erreur explicite, jamais un crash silencieux.

Un test dans `verification_pack/<projet>/verify.sh` doit prouver ces deux points (ex : lancer le programme avec une entree malformee et verifier qu'il refuse proprement).

---
stability: intemporel
