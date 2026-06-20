# Pilotage des tâches — La Loge Bar & Food

## Tâche en cours

Aucune — les formulaires publics de réservation et de contact sont connectés au backend Express.

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

* [x] Périmètre respecté
* [x] Lint OK
* [x] Build OK
* [x] Responsive vérifié
* [x] Accessibilité vérifiée
* [x] review-state.sh exécuté
* [x] Documentation mise à jour

---

## Historique des tâches

* [x] Créer le schéma de données MVP dans `docs/database-schema.md`, sans ORM, base de données, API ni modification des pages.
* [x] Documenter l'architecture backend MVC Express et les flux Réservation / Contact dans `docs/backend-architecture.md`, sans installer Prisma, créer de base, API, serveur ni modifier les pages.
* [x] Formaliser les contrats d'API Réservation et Contact dans `docs/api-contracts.md`, sans créer le serveur Express, installer Prisma ni modifier les pages.
* [x] Préparer la checklist de validation backend dans `docs/backend-prerequisites.md`, sans installer Prisma, créer Express, base de données ou API.
* [x] Initialiser le socle backend Express, TypeScript et Prisma/MySQL avec `/health`, sans base de données, migration, logique métier, authentification, e-mail ni formulaire.
* [x] Traduire docs/database-schema.md en modèles Prisma, générer le client et valider le schéma sans créer de migration ni de base de données.
* [x] Créer les contrôleurs, validateurs et routes Express pour les endpoints publics `POST /api/v1/reservations` et `POST /api/v1/contact-messages` avec validation stricte selon les contrats d'API, sans persistance réelle ni envoi d'e-mails.
* [x] Initialiser la base de données locale MySQL, exécuter la première migration Prisma et connecter les endpoints `POST /api/v1/reservations` et `POST /api/v1/contact-messages` pour persister réellement les demandes en base (sans envoi d'e-mails réels).
* [x] Implémenter l'authentification administrateur (endpoints `POST /api/v1/admin/login`, middleware de session/protection des routes) sans développer les interfaces d'administration ni connecter le frontend.
* [x] Correction sécurité JWT_SECRET obligatoire (longueur minimale 32 caractères et échec au démarrage).
* [x] Implémenter les routes d'administration des réservations (`GET /api/v1/admin/reservations`, `GET /api/v1/admin/reservations/:id`, `PATCH /api/v1/admin/reservations/:id/status` et création de notes internes) protégées par session admin/rôle, sans développer le frontend ni envoyer d'e-mails réels.
* [x] Implémenter les routes d'administration des messages de contact (`GET /api/v1/admin/contact-messages`, `GET /api/v1/admin/contact-messages/:id` et `PATCH /api/v1/admin/contact-messages/:id/status`) protégées par session admin/rôle, sans développer le frontend ni envoyer d'e-mails réels.
* [x] Mettre en place une stratégie de tests backend en configurant Vitest et Supertest et en créant les premiers tests unitaires/d'intégration.
* [x] Connecter les formulaires publics de réservation (`/reservation`) et de contact (`/contact`) au backend Express.

---

## Prochaine tâche proposée

Implémenter la page de connexion de l'administration frontend `/admin/login` et stocker de manière sécurisée le jeton JWT.
