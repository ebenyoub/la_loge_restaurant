# Contrats d'API MVP — Réservation et Contact

**Statut :** spécification d'API — aucun serveur Express, endpoint, package Prisma, migration ou base de données n'est créé par ce document.

**Portée :** contrats publics pour les formulaires Réservation et Contact, puis contrats d'administration indispensables à leur traitement. Les contrats de contenu, médias et authentification détaillée restent hors de cette tâche.

## 1. Conventions communes

| Élément | Convention |
| --- | --- |
| Préfixe | `/api/v1` |
| Format | JSON UTF-8 en entrée et sortie |
| Production | HTTPS obligatoire |
| Date / heure de demande | `YYYY-MM-DD` et `HH:mm`, interprétées en `Europe/Paris` |
| Identifiants | Identifiants opaques ; format définitif UUID ou ULID à valider avant Prisma |
| Champs inconnus | Rejetés avec une erreur `400 INVALID_BODY` |
| Champs contrôlés par le serveur | Statuts, dates d'audit, identité admin, capacité calculée, version de consentement et destinataires e-mail |
| Pagination | `page` commence à `1`, `pageSize` est limité à `100` ; valeurs exactes à confirmer à l'implémentation |

Les exemples montrent la forme cible des messages. Ils ne constituent pas une API disponible.

### 1.1 Enveloppe de succès

```json
{
  "data": {},
  "requestId": "opaque-request-id"
}
```

`requestId` est généré par le serveur. Il peut être communiqué au support sans exposer de données personnelles.

### 1.2 Enveloppe d'erreur

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

Les erreurs ne retournent ni données d'autres clients, ni notes internes, ni détails SQL, ni secrets, ni contenu d'e-mail.

### 1.3 Codes HTTP

| Code | Code applicatif indicatif | Usage |
| --- | --- | --- |
| `201` | — | Ressource créée et persistée. |
| `200` | — | Lecture ou mise à jour réussie. |
| `400` | `INVALID_BODY` | JSON illisible, champ inconnu ou paramètre de requête invalide. |
| `401` | `UNAUTHENTICATED` | Session admin absente ou invalide. |
| `403` | `FORBIDDEN` | Rôle insuffisant. |
| `404` | `NOT_FOUND` | Ressource inexistante ou non accessible. |
| `409` | `CONFLICT` | Conflit de concurrence ou contrainte d'unicité. Jamais un dépassement de capacité. |
| `422` | `VALIDATION_ERROR` / `INVALID_STATUS_TRANSITION` | Données métier invalides ou transition de statut interdite. |
| `429` | `RATE_LIMITED` | Limitation anti-spam déclenchée. |
| `500` | `INTERNAL_ERROR` | Erreur interne sans détail technique exposé. |

## 2. Vocabulaire des statuts

Les valeurs persistées et renvoyées par l'API Réservation sont les valeurs validées dans `decisions.md` :

| Terme métier | Valeur API / base | Signification |
| --- | --- | --- |
| Demande reçue (`pending`) | `nouvelle` | Valeur créée par le serveur après un envoi valide. |
| En cours de traitement | `en_attente` | Le gérant doit encore décider ou recontacter le client. |
| Demande acceptée (`confirmed`) | `confirmee` | La table est confirmée manuellement. |
| Demande refusée (`refused`) | `refusee` | La demande est refusée manuellement. |
| Demande annulée | `annulee` | La demande est annulée manuellement. |

Le client public ne peut jamais envoyer ni modifier `status`. La capacité n'est jamais une cause de réponse `409` ou `422` : elle produit uniquement une alerte dans l'administration.

Pour Contact, les valeurs proposées sont `nouveau`, `lu`, `traite`, `archive`. Elles doivent être validées avant la création de l'administration Contact.

## 3. Endpoints publics

### 3.1 Créer une demande de réservation

`POST /api/v1/reservations`

**Authentification :** aucune. La route est protégée par la limitation de débit et le mécanisme anti-spam retenu.

#### Corps attendu

```json
{
  "firstName": "Camille",
  "lastName": "Martin",
  "phone": "+33600000000",
  "email": "camille@example.com",
  "requestedDate": "2026-07-18",
  "requestedTime": "20:30",
  "guestCount": 4,
  "occasion": "anniversaire",
  "message": "Une chaise haute si possible.",
  "consent": true
}
```

| Champ | Requis | Validation serveur |
| --- | --- | --- |
| `firstName` | Oui | Texte non vide, longueur maximale à fixer. |
| `lastName` | Oui | Texte non vide, longueur maximale à fixer. |
| `phone` | Oui | Texte non vide ; normalisation E.164 à définir par le service. |
| `email` | Oui | Format e-mail valide, normalisé côté serveur. |
| `requestedDate` | Oui | Date ISO valide, non antérieure à la date locale de réception. Les règles de délai restent à valider. |
| `requestedTime` | Oui | Heure au format `HH:mm`, valide dans `Europe/Paris`. |
| `guestCount` | Oui | Entier strictement positif. Le seuil de groupe à appliquer reste à valider. |
| `occasion` | Non | Une des valeurs : `anniversaire`, `repas_pro`, `groupe`, `autre`. |
| `message` | Non | Texte libre limité en taille ; limite exacte à définir. |
| `consent` | Oui | Doit être exactement `true`. |

Le serveur attribue `status: "nouvelle"`, calcule la date d'expiration de conservation, associe éventuellement un service, crée l'historique et les journaux de notification. Le client ne transmet ni `status`, ni `serviceId`, ni date d'audit, ni version de consentement.

#### Succès — `201 Created`

```json
{
  "data": {
    "id": "opaque-reservation-id",
    "status": "nouvelle",
    "requestedDate": "2026-07-18",
    "requestedTime": "20:30",
    "guestCount": 4,
    "message": "Votre demande a bien été enregistrée. Elle reste en attente de confirmation par La Loge."
  },
  "requestId": "opaque-request-id"
}
```

La réponse `201` dépend de la persistance réussie de la demande, pas du succès immédiat d'un e-mail. Une erreur d'envoi est gérée dans `NotificationLog` et ne doit pas faire croire au client que sa table est confirmée.

#### Erreur de validation — `422 Unprocessable Content`

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Certains champs doivent être corrigés.",
    "fields": {
      "guestCount": "Le nombre de personnes doit être supérieur à zéro.",
      "consent": "Votre consentement est requis pour envoyer la demande."
    }
  },
  "requestId": "opaque-request-id"
}
```

### 3.2 Créer un message de contact

`POST /api/v1/contact-messages`

**Authentification :** aucune. La route est protégée par la limitation de débit et le mécanisme anti-spam retenu.

#### Corps attendu

```json
{
  "name": "Camille Martin",
  "email": "camille@example.com",
  "phone": "+33600000000",
  "subject": "Question sur l'accessibilité",
  "message": "Pouvez-vous me confirmer l'accès à la salle ?",
  "consent": true
}
```

| Champ | Requis | Validation serveur |
| --- | --- | --- |
| `name` | Oui | Texte non vide, longueur maximale à fixer. |
| `email` | Oui | Format e-mail valide, normalisé côté serveur. |
| `phone` | Non | Texte non vide si présent ; normalisation à définir. |
| `subject` | Oui | Texte non vide, longueur maximale à fixer. |
| `message` | Oui | Texte non vide, limité en taille ; limite exacte à définir. |
| `consent` | Oui | Doit être exactement `true`. |

Le serveur attribue `status: "nouveau"`, enregistre les métadonnées RGPD et crée un journal de notification à destination du restaurant. Le client ne transmet jamais `status`, `handledByAdminId`, `handledAt` ou dates d'audit.

#### Succès — `201 Created`

```json
{
  "data": {
    "id": "opaque-contact-message-id",
    "status": "nouveau",
    "message": "Votre message a bien été enregistré."
  },
  "requestId": "opaque-request-id"
}
```

Un accusé de réception e-mail au client Contact n'est pas encore une décision MVP. Cette réponse ne promet donc aucun e-mail ni délai de réponse.

## 4. Endpoints d'administration — Réservation

Toutes les routes suivantes exigent une session admin valide et le rôle `gerant`. Le mécanisme exact de session sera défini avec l'authentification.

### 4.1 Lister les demandes

`GET /api/v1/admin/reservations?date=2026-07-18&status=nouvelle&name=Martin&page=1&pageSize=20`

| Paramètre | Requis | Validation |
| --- | --- | --- |
| `date` | Non | Date ISO `YYYY-MM-DD`. |
| `status` | Non | Valeur `reservation_status` connue. |
| `name` | Non | Texte de recherche limité en taille. |
| `page` | Non | Entier positif ; défaut `1`. |
| `pageSize` | Non | Entier positif plafonné à `100`. |

#### Succès — `200 OK`

```json
{
  "data": {
    "items": [
      {
        "id": "opaque-reservation-id",
        "requestedDate": "2026-07-18",
        "requestedTime": "20:30",
        "customerName": "Camille Martin",
        "guestCount": 4,
        "occasion": "anniversaire",
        "status": "nouvelle",
        "capacityAlert": false
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 1
  },
  "requestId": "opaque-request-id"
}
```

La liste ne contient pas le téléphone, l'e-mail, le message ni les notes internes. Ces données ne sont disponibles que dans le détail.

### 4.2 Consulter une demande

`GET /api/v1/admin/reservations/:id`

#### Succès — `200 OK`

```json
{
  "data": {
    "id": "opaque-reservation-id",
    "status": "en_attente",
    "firstName": "Camille",
    "lastName": "Martin",
    "phone": "+33600000000",
    "email": "camille@example.com",
    "requestedDate": "2026-07-18",
    "requestedTime": "20:30",
    "guestCount": 4,
    "occasion": "anniversaire",
    "message": "Une chaise haute si possible.",
    "capacityAlert": false,
    "statusHistory": [],
    "notes": []
  },
  "requestId": "opaque-request-id"
}
```

### 4.3 Modifier le statut d'une demande

`PATCH /api/v1/admin/reservations/:id/status`

#### Corps attendu

```json
{
  "status": "confirmee"
}
```

| Champ | Requis | Validation serveur |
| --- | --- | --- |
| `status` | Oui | Une des valeurs `en_attente`, `confirmee`, `refusee`, `annulee`. La transition exacte est vérifiée par le service. |

Le status `nouvelle` est uniquement attribué lors de la création publique. Toute transition crée un `ReservationStatusHistory` dans la même transaction que la mise à jour.

#### Succès — `200 OK`

```json
{
  "data": {
    "id": "opaque-reservation-id",
    "status": "confirmee",
    "statusChangedAt": "2026-07-10T14:35:00Z"
  },
  "requestId": "opaque-request-id"
}
```

#### Transition invalide — `422 Unprocessable Content`

```json
{
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Cette transition de statut n'est pas autorisée."
  },
  "requestId": "opaque-request-id"
}
```

### 4.4 Ajouter une note interne

`POST /api/v1/admin/reservations/:id/notes`

#### Corps attendu

```json
{
  "body": "Client rappelé le 10 juillet, confirmation attendue."
}
```

`body` est obligatoire, non vide et limité en taille. Le serveur associe l'auteur à la session admin ; `authorAdminId` n'est jamais accepté dans le corps.

#### Succès — `201 Created`

```json
{
  "data": {
    "id": "opaque-note-id",
    "body": "Client rappelé le 10 juillet, confirmation attendue.",
    "createdAt": "2026-07-10T14:36:00Z"
  },
  "requestId": "opaque-request-id"
}
```

### 4.5 Consulter la charge

`GET /api/v1/admin/capacity?date=2026-07-18&serviceId=opaque-service-id`

La réponse agrège les couverts et demandes selon les règles validées. Elle retourne une alerte sans jamais empêcher la création d'une demande.

```json
{
  "data": {
    "date": "2026-07-18",
    "serviceId": "opaque-service-id",
    "guestCount": 42,
    "requestCount": 13,
    "maxGuestCount": 40,
    "maxRequestCountPerSlot": 15,
    "capacityAlert": true
  },
  "requestId": "opaque-request-id"
}
```

### 4.6 Mettre à jour un seuil de capacité

`PUT /api/v1/admin/capacity-rules/:id`

```json
{
  "maxGuestCount": 40,
  "maxRequestCountPerSlot": 15,
  "effectiveFrom": "2026-07-01",
  "effectiveTo": null,
  "isActive": true
}
```

`maxGuestCount` est obligatoire et strictement positif. `maxRequestCountPerSlot` est optionnel et strictement positif quand il est fourni. Les chevauchements de règles actives pour un même service sont refusés avec `409 CONFLICT`.

## 5. Endpoints d'administration — Contact

Toutes les routes Contact d'administration exigent une session admin valide et le rôle `gerant`, car elles manipulent des données personnelles.

### 5.1 Lister les messages

`GET /api/v1/admin/contact-messages?status=nouveau&search=Martin&page=1&pageSize=20`

| Paramètre | Requis | Validation |
| --- | --- | --- |
| `status` | Non | Valeur `contact_status` connue. |
| `search` | Non | Recherche limitée en taille sur nom, e-mail ou objet. |
| `page` / `pageSize` | Non | Pagination commune. |

#### Succès — `200 OK`

```json
{
  "data": {
    "items": [
      {
        "id": "opaque-contact-message-id",
        "name": "Camille Martin",
        "email": "camille@example.com",
        "subject": "Question sur l'accessibilité",
        "status": "nouveau",
        "createdAt": "2026-07-10T14:30:00Z"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 1
  },
  "requestId": "opaque-request-id"
}
```

### 5.2 Consulter un message

`GET /api/v1/admin/contact-messages/:id`

#### Succès — `200 OK`

```json
{
  "data": {
    "id": "opaque-contact-message-id",
    "name": "Camille Martin",
    "email": "camille@example.com",
    "phone": "+33600000000",
    "subject": "Question sur l'accessibilité",
    "message": "Pouvez-vous me confirmer l'accès à la salle ?",
    "status": "nouveau",
    "createdAt": "2026-07-10T14:30:00Z"
  },
  "requestId": "opaque-request-id"
}
```

### 5.3 Modifier le statut d'un message

`PATCH /api/v1/admin/contact-messages/:id/status`

```json
{
  "status": "traite"
}
```

`status` doit être une valeur `contact_status` validée. Le serveur renseigne `handledByAdminId` et `handledAt` lorsque le message passe à `traite` ou `archive`. Les transitions définitives restent à valider avant implémentation.

#### Succès — `200 OK`

```json
{
  "data": {
    "id": "opaque-contact-message-id",
    "status": "traite",
    "handledAt": "2026-07-10T15:00:00Z"
  },
  "requestId": "opaque-request-id"
}
```

## 6. Règles RGPD et sécurité utiles aux contrats

1. Les endpoints publics ne demandent que les données nécessaires au traitement annoncé.
2. `consent: true` est obligatoire avant toute persistance ; l'horodatage, la version du texte et la date de conservation sont déterminés côté serveur.
3. Les réponses publiques ne retournent pas l'e-mail, le téléphone, les notes internes, les journaux de notification, l'identité du gérant ou une information de charge.
4. Les endpoints admin sont authentifiés et limités au rôle `gerant` pour les données de réservation et contact.
5. Les corps de formulaire et en-têtes d'authentification ne sont pas écrits en clair dans les journaux applicatifs.
6. La limitation de débit, l'anti-spam, les limites de taille et la validation s'exécutent avant toute écriture en base ou notification.
7. Une demande de suppression ou d'accès doit pouvoir être reliée à la donnée concernée, selon la politique de conservation validée.
8. L'URL de l'API, la politique CORS, le prestataire e-mail, les durées de conservation et la version des textes de consentement restent à valider avant l'implémentation.

## 7. Éléments explicitement hors implémentation

- Aucun serveur Express ni route HTTP n'est créé.
- Prisma n'est ni installé ni configuré.
- Aucune base MySQL, migration ou variable d'environnement n'est créée.
- Aucun formulaire Next.js n'est branché sur ces contrats.
- Aucun e-mail, mécanisme d'authentification ou anti-spam réel n'est activé.

## 8. Prochaine étape proposée

Les prérequis d'initialisation sont documentés dans `docs/backend-prerequisites.md` et le socle Express/Prisma est créé dans `backend/`. La prochaine tâche traduit le schéma de données en modèles Prisma, sans migration, base de données ni branchement des formulaires publics.
