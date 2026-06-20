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
* Contrats d'API Réservation et Contact documentés
* Prérequis de validation backend documentés
* Socle backend Express, TypeScript et Prisma/MySQL initialisé

### Non développé

* Base de données
* Administration
* Envoi d'e-mails
* Réservation fonctionnelle
* Routes métier Réservation et Contact
* Modèles Prisma et migrations

---

## Tâche en cours

Aucune — le socle backend démarre et répond sur `/health`. Les modèles, migrations, routes métier, authentification, e-mails et formulaires restent à implémenter.

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
* [x] Formaliser les contrats d'API Réservation et Contact dans `docs/api-contracts.md`, sans créer le serveur Express, installer Prisma ni modifier les pages.
* [x] Préparer la checklist de validation backend dans `docs/backend-prerequisites.md`, sans installer Prisma, créer Express, base de données ou API.
* [x] Initialiser le socle backend Express, TypeScript et Prisma/MySQL avec `/health`, sans base de données, migration, logique métier, authentification, e-mail ni formulaire.
* [x] Traduire docs/database-schema.md en modèles Prisma, générer le client et valider le schéma sans créer de migration ni de base de données.

## Prochaine tâche proposée

Créer les contrôleurs, validateurs et routes Express pour les endpoints publics `POST /api/v1/reservations` et `POST /api/v1/contact-messages` avec validation stricte selon les contrats d'API, sans persistance réelle ni envoi d'e-mails.
