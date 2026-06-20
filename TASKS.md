# Pilotage des tâches — La Loge Bar & Food

## État actuel

### MVP public terminé

* Accueil
* Carte
* Réservation (statique)
* Contact (statique)
* Mentions légales (statique)

### Technique

* Next.js
* TypeScript
* Tailwind installé
* CSS Modules conservés jusqu'à la fin du MVP
* Lint OK
* Build OK
* Schéma de données et architecture backend MVP documentés

### Non développé

* Backend
* Base de données
* Prisma
* Administration
* Envoi d'e-mails
* Réservation fonctionnelle

---

## Tâche en cours

Aucune — l'architecture backend MVP et les flux métier sont documentés et en attente de validation humaine.

---

## Règles Codex

Avant chaque tâche :

1. Lire :

   * AGENTS.md
   * TASKS.md
   * PROJECT_STATE.md
   * TODO.md

2. Respecter strictement le périmètre.

3. Exécuter :

   * npm run lint
   * npm run build

4. Fournir :

   * fichiers modifiés
   * résumé du travail
   * validations effectuées
   * données restant à valider

5. Exécuter :

   * scripts/review-state.sh

6. Ne jamais créer automatiquement un commit.

---

## Gestion des commits

Lorsque la tâche est terminée :

1. Exécuter scripts/review-state.sh
2. Présenter le résumé des changements
3. Proposer un message de commit
4. Attendre validation humaine
5. Exécuter scripts/checkpoint.sh "<message>"

---

## Gestion automatique de la roadmap

Quand une tâche est terminée :

1. Mettre à jour TASKS.md.
2. Mettre à jour TODO.md.
3. Mettre à jour PROJECT_STATE.md.
4. Déplacer la tâche terminée dans l'historique.
5. Proposer automatiquement la prochaine tâche logique du MVP.
6. Remplir la section "Prochaine tâche".
7. Attendre validation humaine avant exécution.

Ne jamais laisser la roadmap sans prochaine tâche proposée.

---

## Checklist avant validation

* [ ] Périmètre respecté
* [ ] Lint OK
* [ ] Build OK
* [ ] Responsive vérifié
* [ ] Accessibilité vérifiée
* [ ] review-state.sh exécuté
* [ ] Documentation mise à jour

---

## Historique des tâches

* [x] Créer le schéma de données MVP dans `docs/database-schema.md`, sans ORM, base de données, API ni modification des pages.
* [x] Documenter l'architecture backend MVC Express et les flux Réservation / Contact dans `docs/backend-architecture.md`, sans installer Prisma, créer de base, API, serveur ni modifier les pages.

## Prochaine tâche proposée

Après validation humaine de l'architecture backend : formaliser les contrats d'API des flux Réservation et Contact (schémas de requêtes, réponses, erreurs et validations), sans créer le serveur Express ni installer Prisma.
