# Architecture backend MVP — La Loge Bar & Food

**Statut :** architecture documentée — aucune dépendance, serveur, API, migration Prisma ou base de données n'est créée par ce document.
**Décisions validées :** MySQL, Prisma, Express et architecture MVC.
**Portée :** demandes de réservation, messages de contact, administration, contenus et e-mails transactionnels P1.

## 1. Objectif et frontières

Le frontend Next.js reste responsable de l'interface publique et de l'administration. Un backend Express séparé sera responsable de l'API, des règles métier, de l'authentification, de l'accès à MySQL via Prisma et de l'orchestration des e-mails.

```text
Navigateur
    │
    ├── Next.js : pages publiques et administration
    │       │ requêtes HTTPS JSON
    ▼
Express API (MVC)
    │  ├── middlewares : sécurité, authentification, validation, erreurs
    │  ├── controllers : adaptation HTTP
    │  ├── services : règles métier et transactions
    │  └── Prisma models : accès aux données
    ▼
MySQL

Express ──> prestataire e-mail transactionnel à choisir
```

Le frontend ne doit jamais accéder directement à MySQL, Prisma, aux secrets d'e-mail ni aux données d'autres clients. Aucune route API n'est créée dans le projet Next.js pour cette architecture.

## 2. Organisation MVC cible

Le répertoire est indicatif. Il ne doit pas être créé avant l'autorisation d'implémenter le backend.

```text
backend/
├── prisma/
│   └── schema.prisma              # schéma Prisma issu de docs/database-schema.md
├── src/
│   ├── app.ts                     # assemblage Express et middlewares globaux
│   ├── server.ts                  # démarrage HTTP, séparé pour les tests
│   ├── config/
│   │   └── env.ts                 # lecture et validation des variables d'environnement
│   ├── routes/
│   │   └── v1/
│   │       ├── public.routes.ts
│   │       ├── admin.routes.ts
│   │       └── auth.routes.ts
│   ├── controllers/
│   │   ├── reservation.controller.ts
│   │   ├── contact.controller.ts
│   │   ├── admin-reservation.controller.ts
│   │   ├── content.controller.ts
│   │   └── auth.controller.ts
│   ├── services/
│   │   ├── reservation.service.ts
│   │   ├── contact.service.ts
│   │   ├── capacity.service.ts
│   │   ├── notification.service.ts
│   │   ├── content.service.ts
│   │   └── auth.service.ts
│   ├── validators/
│   │   ├── reservation.validator.ts
│   │   ├── contact.validator.ts
│   │   └── admin.validator.ts
│   ├── middlewares/
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── validate.ts
│   │   ├── rate-limit.ts
│   │   ├── request-id.ts
│   │   └── error-handler.ts
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── logger.ts
│   └── errors/
│       └── app-error.ts
└── tests/
```

### Responsabilités

| Couche | Responsabilité | Ne doit pas faire |
| --- | --- | --- |
| Routes | Associer une méthode et une URL au middleware puis au controller. | Contenir les règles métier ou des requêtes Prisma. |
| Controllers | Lire la requête validée, appeler un service, produire la réponse HTTP. | Décider les statuts ou envoyer directement des e-mails. |
| Services | Appliquer les règles métier, gérer les transactions Prisma et appeler les adaptateurs nécessaires. | Dépendre de détails de rendu Next.js. |
| Models Prisma | Décrire les tables et relations MySQL selon `docs/database-schema.md`. | Contenir une logique de contrôle HTTP. |
| Validators | Valider le schéma des entrées avant le controller. | Persister ou modifier des données. |
| Middlewares | Sécurité transversale : authentification, autorisation, limitation, traçabilité, erreurs. | Porter des règles propres à une réservation. |

## 3. Convention d'API

- Préfixe : `/api/v1`.
- Corps de requête et réponses : JSON UTF-8.
- L'API est servie uniquement en HTTPS en production.
- Les routes publiques n'acceptent que les champs prévus ; les champs supplémentaires sont rejetés ou ignorés explicitement selon le validateur retenu.
- Les dates et heures demandées sont interprétées dans `Europe/Paris` et conservées conformément à `docs/database-schema.md`.
- Les réponses publiques ne retournent jamais une note interne, un historique admin, un seuil de capacité, un e-mail de gérant ni des données d'autres visiteurs.
- Les routes d'administration exigent une session authentifiée et un rôle autorisé.

### Format de succès

```json
{
  "data": {},
  "requestId": "opaque-request-id"
}
```

### Format d'erreur

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Certains champs doivent être corrigés.",
    "fields": {
      "email": "Format d’e-mail invalide."
    }
  },
  "requestId": "opaque-request-id"
}
```

Le détail technique, les requêtes SQL, les secrets et les données personnelles ne sont jamais inclus dans une réponse d'erreur.

## 4. Routes prévues

Ces routes sont une cible d'implémentation ; elles ne sont pas créées dans cette tâche.

### 4.1 Routes publiques

| Méthode | Route | Service | Réponse attendue |
| --- | --- | --- | --- |
| `POST` | `/api/v1/reservations` | `ReservationService.createRequest` | `201` : demande enregistrée et en attente de confirmation. |
| `POST` | `/api/v1/contact-messages` | `ContactService.createMessage` | `201` : message enregistré. |

### 4.2 Routes d'authentification admin

| Méthode | Route | Rôle | Remarque |
| --- | --- | --- | --- |
| `POST` | `/api/v1/admin/auth/login` | Public | À confirmer avec le fournisseur d'authentification. |
| `POST` | `/api/v1/admin/auth/logout` | Authentifié | Invalidation de session selon le mécanisme retenu. |
| `GET` | `/api/v1/admin/auth/me` | Authentifié | Retourne l'identité et le rôle, sans données sensibles. |

### 4.3 Routes d'administration des réservations

| Méthode | Route | Rôle minimal | Usage |
| --- | --- | --- | --- |
| `GET` | `/api/v1/admin/reservations` | `gerant` | Liste filtrée par date, statut et nom. |
| `GET` | `/api/v1/admin/reservations/:id` | `gerant` | Détail, historique, notes et indicateur de charge. |
| `PATCH` | `/api/v1/admin/reservations/:id/status` | `gerant` | Changement de statut contrôlé et historisé. |
| `POST` | `/api/v1/admin/reservations/:id/notes` | `gerant` | Ajout d'une note interne. |
| `GET` | `/api/v1/admin/capacity` | `gerant` | Vue de charge et alertes non bloquantes. |
| `PUT` | `/api/v1/admin/capacity-rules/:id` | `gerant` | Modification des seuils de capacité. |

### 4.4 Routes d'administration des contenus

| Groupe | Routes prévues | Rôle minimal |
| --- | --- | --- |
| Informations générales et horaires | Lecture / mise à jour de `RestaurantSettings`, `OpeningHour`, `SocialLink` | `editeur` ou `gerant` |
| Carte | CRUD contrôlé de `MenuCategory` et `MenuItem` | `editeur` ou `gerant` |
| Sections, SEO et légal | Lecture / mise à jour de `ContentSection`, `SeoMetadata`, `LegalDocument` | `editeur` ou `gerant` |
| Médias | Ajout, métadonnées, statut de droits, association à un contenu | `editeur` ou `gerant` |

La liste précise des routes de contenu sera détaillée lorsque l'interface admin sera cadrée. Le modèle ne doit pas permettre un page builder libre.

## 5. Validation, sécurité et middlewares

### Ordre recommandé des middlewares

```text
request-id
  → headers de sécurité / CORS configuré
  → limitation de débit et anti-spam pour les routes publiques
  → parsing JSON avec limite de taille
  → authentification et autorisation pour les routes admin
  → validation de la requête
  → controller
  → error-handler centralisé
```

### Règles de validation publique

| Domaine | Règles minimales |
| --- | --- |
| Réservation | Nom, prénom, téléphone, e-mail, date, heure, nombre de couverts et consentement obligatoires ; occasion limitée aux quatre valeurs validées ; message facultatif ; statut ignoré s'il est envoyé par le client. |
| Contact | Nom, e-mail, objet, message et consentement obligatoires ; téléphone facultatif ; statut ignoré s'il est envoyé par le client. |
| RGPD | Le consentement doit être explicitement vrai ; l'API enregistre son horodatage et la version du texte. |
| Anti-spam | Limitation par IP et empreinte de requête ; mécanisme complémentaire non intrusif à choisir. Aucun mécanisme ne doit servir de traceur non conforme. |
| Taille | Limites de longueur sur les textes et taille maximale du JSON pour éviter les abus. Valeurs exactes à définir avant implémentation. |

### Codes d'erreur HTTP

| Code | Cas |
| --- | --- |
| `400` | Corps JSON illisible ou règle de requête élémentaire non respectée. |
| `401` | Session absente ou invalide. |
| `403` | Rôle insuffisant ou action interdite. |
| `404` | Ressource admin inexistante. |
| `409` | Conflit de concurrence ou règle d'unicité. Ne sert jamais à bloquer une demande pour capacité dépassée. |
| `422` | Données de formulaire syntaxiquement valides mais métier non acceptables. |
| `429` | Limitation anti-spam déclenchée. |
| `500` | Erreur interne non exposée au client. |

## 6. Flux métier — réservation

### 6.1 Vocabulaire de statut

Les valeurs persistées et API suivent la décision D-004 : `nouvelle`, `en_attente`, `confirmee`, `refusee`, `annulee`.

| Terme du besoin | Valeur persistée / API | Sens |
| --- | --- | --- |
| `pending` | `nouvelle` à la création, puis éventuellement `en_attente` | Demande reçue, sans table confirmée. |
| `confirmed` | `confirmee` | Demande acceptée manuellement par le gérant. |
| `refused` | `refusee` | Demande refusée manuellement par le gérant. |

Le client ne peut pas fournir ni modifier ce statut. La capacité ne change pas ce flux : elle crée une alerte pour le gérant, jamais un refus automatique.

### 6.2 Création d'une demande

```text
1. Client : soumet le formulaire Réservation.
2. Frontend : POST /api/v1/reservations en HTTPS.
3. Middleware : limite de débit, anti-spam, parsing puis validation serveur.
4. ReservationService :
   a. vérifie les règles métier et interprète date/heure en Europe/Paris ;
   b. crée Reservation avec status = nouvelle ;
   c. crée ReservationStatusHistory ;
   d. enregistre consentement, version et date d'expiration ;
   e. calcule l'alerte éventuelle de capacité sans bloquer la création ;
   f. crée deux NotificationLog à envoyer.
5. MySQL : transaction validée.
6. NotificationService : envoie l'e-mail au restaurant puis l'accusé de réception client ;
   chaque résultat met à jour son NotificationLog.
7. API : répond 201 uniquement si la demande est persistée ; le message public indique
   « en attente de confirmation », jamais « réservation confirmée ».
```

L'envoi d'e-mail intervient après l'écriture réussie. Si un e-mail échoue, la demande reste enregistrée et le journal permet une relance ou un traitement manuel. Le comportement de relance et le prestataire restent à valider.

### 6.3 Traitement par le gérant

```text
1. Gérant authentifié : consulte la liste filtrée et la charge associée.
2. API : vérifie le rôle gerant et charge la demande.
3. Gérant : ajoute une note interne si nécessaire.
4. Gérant : choisit en_attente, confirmee, refusee ou annulee.
5. ReservationService : valide la transition, met à jour Reservation et crée
   ReservationStatusHistory dans une transaction.
6. API : retourne le nouvel état, sans exposer les notes à un client public.
```

Les notifications d'un changement de statut ne sont pas encore une exigence produit distincte ; elles seront ajoutées seulement après validation des textes et du périmètre d'e-mail.

## 7. Flux métier — contact

### 7.1 Vocabulaire de statut

Le terme `new` demandé dans le flux correspond à la valeur persistée `nouveau` proposée dans `docs/database-schema.md`. La liste définitive des statuts Contact doit être validée avant l'administration dédiée.

### 7.2 Création d'un message

```text
1. Client : soumet le formulaire Contact.
2. Frontend : POST /api/v1/contact-messages en HTTPS.
3. Middleware : limitation de débit, anti-spam, parsing puis validation serveur.
4. ContactService :
   a. crée ContactMessage avec status = nouveau ;
   b. enregistre consentement, version et date d'expiration ;
   c. crée un NotificationLog à destination du restaurant.
5. MySQL : transaction validée.
6. NotificationService : envoie l'e-mail au restaurant et journalise le résultat.
7. API : répond 201 avec un message de réception ; aucune promesse de délai non validé.
```

Le flux d'accusé de réception au client est une décision à prendre : il est requis pour la réservation, mais pas encore explicitement pour le contact.

### 7.3 Traitement admin

```text
1. Administrateur authentifié : lit les messages selon son rôle.
2. Il passe le statut de nouveau à lu, traite ou archive, si ces statuts sont validés.
3. La date et l'administrateur de traitement sont enregistrés.
4. Les données suivent la durée de conservation définie dans la politique de confidentialité.
```

## 8. Prisma et MySQL — règles d'implémentation future

- Le schéma Prisma sera la traduction de `docs/database-schema.md`, après validation des décisions ouvertes.
- Prisma utilise MySQL comme unique source de données ; aucun accès SQL depuis les controllers.
- Les opérations combinant une demande, son historique de statut et ses journaux de notification sont transactionnelles.
- Les migrations Prisma doivent être versionnées et appliquées par l'environnement de déploiement, jamais depuis le navigateur.
- Les chaînes de connexion, clés d'e-mail, secrets de session et identifiants cloud sont fournis uniquement par variables d'environnement validées au démarrage.
- La version de Prisma, la stratégie de migration, l'hébergement MySQL, les sauvegardes et la rotation des secrets sont à décider avant installation.

## 9. Données et décisions restant à valider

| Sujet | Décision nécessaire |
| --- | --- |
| Hébergement MySQL | Prestataire, région, sauvegardes, accès et propriété du compte. |
| Authentification admin | Méthode, fournisseurs, session, rôles réels, MFA éventuel et récupération de compte. |
| E-mail transactionnel | Prestataire, adresse expéditrice, destinataire gérant, textes, relances et gestion des échecs. |
| Anti-spam | Limitation, mécanisme complémentaire et règles de consentement associées. |
| Règles de réservation | Services, créneaux, tailles de groupe, capacité, transitions autorisées et statuts pris en compte pour la charge. |
| RGPD | Version des consentements, durées de conservation, procédure d'anonymisation, contact des droits. |
| Contact admin | Statuts définitifs et éventuel accusé de réception client. |
| Déploiement Express | Hébergeur, URL de l'API, CORS, observabilité, journalisation et stratégie de mise à jour. |

## 10. Hors périmètre de cette tâche

- Installation de Prisma ou de tout paquet backend.
- Création d'un serveur Express, d'une API, de routes, de contrôleurs, de modèles ou de migrations.
- Création d'une base MySQL ou de secrets d'environnement.
- Branchement des formulaires publics.
- Création de l'administration ou envoi réel d'e-mails.
- Modification des pages publiques existantes.

## 11. Prochaine étape proposée

Après validation de cette architecture : formaliser les contrats d'API (schémas de requêtes et réponses) et les règles exactes de validation pour Réservation et Contact, sans créer encore le serveur Express ni installer Prisma.
