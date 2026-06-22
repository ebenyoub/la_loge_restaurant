# Schéma de données MVP — La Loge Bar & Food

**Statut :** schéma fonctionnel traduit dans `backend/prisma/schema.prisma` et migré sur MySQL local. Ce document reste la référence fonctionnelle ; le schéma Prisma est la référence exécutable.
**Portée :** données nécessaires à la vitrine administrable, aux demandes de réservation, aux messages de contact et à l'administration.
**Cible validée :** MySQL avec Prisma.

## 1. Principes de modélisation

- Les identifiants sont des identifiants opaques (`UUID` ou `ULID`, choix à arrêter avec la stack), jamais des identifiants séquentiels exposés publiquement.
- Tous les enregistrements administrables ont au minimum `createdAt` et `updatedAt`, stockés en UTC.
- Les dates et heures demandées par un client sont conservées séparément en date et heure locales, avec le fuseau `Europe/Paris`. Elles ne représentent pas une réservation confirmée.
- Les prix sont stockés en centimes entiers, jamais en nombre flottant.
- Les statuts sont contrôlés par des valeurs énumérées ; ils ne sont pas des textes libres.
- Les données personnelles sont limitées à celles utiles au traitement, accessibles uniquement depuis l'administration authentifiée et supprimées ou anonymisées selon une durée de conservation validée.
- Les contenus restent structurés : une section connue peut être activée, modifiée ou, si autorisé, réordonnée. Aucun modèle de page builder libre n'est prévu.
- Les images ne sont référencées qu'après validation de leurs droits. Leur fichier est géré par un stockage à définir ; la base ne stocke pas les fichiers binaires.

## 2. Vue d'ensemble des relations

```text
Administrator ──< ReservationStatusHistory >── Reservation ──< ReservationNote
       │                                           │
       │                                           └── ReservationService ──< CapacityRule
       │
       ├──< ContentSection >── MediaAsset
       ├──< MenuCategory ──< MenuItem >── MediaAsset
       ├──< SeoMetadata
       └──< LegalDocument

ContactMessage

RestaurantSettings ──< OpeningHour
RestaurantSettings ──< SocialLink
```

`Administrator` est lié aux modifications de statut et, lorsque la fonctionnalité est activée, aux mises à jour de contenus. Les demandes de réservation et les messages de contact restent indépendants : un message ne crée pas de réservation.

## 3. Types contrôlés

| Type | Valeurs MVP | Source / remarque |
| --- | --- | --- |
| `reservation_status` | `nouvelle`, `en_attente`, `confirmee`, `refusee`, `annulee` | Décision D-004. Les termes `pending`, `confirmed` et `refused` utilisés dans certains flux correspondent respectivement à `nouvelle`/`en_attente`, `confirmee` et `refusee`. Les accents ne sont pas utilisés dans le stockage. |
| `reservation_occasion` | `anniversaire`, `repas_pro`, `groupe`, `autre` | Décision D-002 ; valeur nullable si aucune occasion n'est renseignée. |
| `contact_status` | `nouveau`, `lu`, `traite`, `archive` | Proposition à valider avant l'admin Contact. Le terme `new` correspond à `nouveau`. |
| `menu_availability` | `disponible`, `indisponible` | Le MVP ne gère pas encore la disponibilité planifiée. |
| `media_rights_status` | `a_verifier`, `valide`, `refuse`, `expire` | Empêche la publication accidentelle d'une image sans droits confirmés. |
| `admin_role` | `gerant`, `editeur` | Proposition minimale : le gérant traite les demandes ; l'éditeur ne gère que les contenus. À valider avec les comptes réels. |
| `notification_status` | `a_envoyer`, `envoye`, `echec` | Statut destiné au suivi des e-mails P1. Les e-mails de création sont implémentés ; vérifier le schéma Prisma pour connaître les journaux effectivement persistés. |

## 4. Données de réservation

### 4.1 `Reservation`

Une ligne représente une **demande** de réservation. Elle ne doit jamais être assimilée à une table confirmée tant que `status` n'est pas `confirmee`.

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `status` | `reservation_status` | Oui | Valeur initiale : `nouvelle`. |
| `firstName` | texte court | Oui | Prénom transmis dans le formulaire. |
| `lastName` | texte court | Oui | Nom transmis dans le formulaire. |
| `phone` | texte court | Oui | Valeur saisie ; normalisation E.164 à définir côté serveur. |
| `email` | texte court | Oui | Validation de format côté serveur ; utilisé pour l'accusé de réception. |
| `requestedDate` | date | Oui | Date locale demandée. |
| `requestedTime` | heure | Oui | Heure locale demandée. |
| `timezone` | texte court | Oui | `Europe/Paris` pour le MVP. |
| `guestCount` | entier positif | Oui | Nombre de couverts demandés, strictement supérieur à zéro. |
| `occasion` | `reservation_occasion` | Non | Occasion facultative. |
| `message` | texte long | Non | Demande ou précision du client. |
| `serviceId` | référence `ReservationService` | Non | Assigné si le créneau demandé correspond à un service configuré ; l'absence ne bloque jamais la demande. |
| `consentAcceptedAt` | date-heure UTC | Oui | Horodatage du consentement RGPD. |
| `consentVersion` | texte court | Oui | Version du texte affiché au moment de la collecte. |
| `retentionExpiresAt` | date-heure UTC | Oui | Calculé à partir de la durée de conservation validée. |
| `statusChangedAt` | date-heure UTC | Oui | Date du dernier changement de statut. |
| `createdAt` | date-heure UTC | Oui | Date de réception de la demande. |
| `updatedAt` | date-heure UTC | Oui | Dernière mise à jour. |
| `deletedAt` | date-heure UTC | Non | Suppression/anonymisation logique si retenue ; décision à valider. |

**Index minimaux :** `(requestedDate, requestedTime)`, `status`, `createdAt DESC`, `lastName`, `email`. Les filtres admin par date, statut et nom en dépendent.

### 4.2 `ReservationStatusHistory`

Chaque changement de statut est conservé. L'historique n'est pas visible publiquement.

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `reservationId` | référence `Reservation` | Oui | Suppression en cascade à arbitrer selon la conservation légale. |
| `previousStatus` | `reservation_status` | Non | Vide pour la création initiale. |
| `nextStatus` | `reservation_status` | Oui | Nouveau statut appliqué. |
| `changedByAdminId` | référence `Administrator` | Non | Vide pour une création système ; renseigné pour une action admin. |
| `createdAt` | date-heure UTC | Oui | Horodatage de la transition. |

**Contrainte :** une transition crée une ligne d'historique et met à jour `Reservation.status` dans la même transaction.

### 4.3 `ReservationNote`

Les notes sont internes, sans affichage public ni inclusion dans les e-mails client.

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `reservationId` | référence `Reservation` | Oui | Demande concernée. |
| `body` | texte long | Oui | Note de suivi : rappel, contrainte de table, etc. |
| `authorAdminId` | référence `Administrator` | Oui | Auteur identifié. |
| `createdAt` | date-heure UTC | Oui | Création. |
| `updatedAt` | date-heure UTC | Oui | Dernière modification. |

### 4.4 `ReservationService`

Décrit un service configurable, par exemple déjeuner ou dîner. Il permet de calculer la charge sans bloquer les demandes hors créneau.

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `code` | texte court unique | Oui | Identifiant stable, par exemple `midi` ou `soir`. Valeurs à valider. |
| `label` | texte court | Oui | Libellé affichable dans l'administration. |
| `startTime` | heure | Oui | Début de service local. |
| `endTime` | heure | Oui | Fin de service local. |
| `isActive` | booléen | Oui | Désactive un service sans supprimer son historique. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

### 4.5 `CapacityRule`

Paramètres d'alerte. Ils ne refusent ni ne masquent aucune demande.

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `serviceId` | référence `ReservationService` | Oui | Service concerné. |
| `maxGuestCount` | entier positif | Oui | Maximum indicatif de couverts pour un service. |
| `maxRequestCountPerSlot` | entier positif | Non | Seuil facultatif de demandes par créneau. |
| `effectiveFrom` | date | Oui | Début d'application de la règle. |
| `effectiveTo` | date | Non | Fin d'application ; vide si règle courante. |
| `isActive` | booléen | Oui | Une seule règle active par service et période se chevauchant, à garantir côté application/base. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

**Calcul de charge :** agréger `guestCount` et le nombre de demandes par `requestedDate` et `serviceId` ou `requestedTime`. Les statuts inclus dans le calcul (`nouvelle`, `en_attente`, `confirmee`, etc.) sont à valider ; le résultat est une alerte visuelle, jamais un refus automatique.

### 4.6 `NotificationLog`

Journal minimal des notifications transactionnelles à créer lorsque les e-mails seront développés. Il évite de dupliquer les envois et permet le diagnostic sans stocker le contenu complet des e-mails.

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `reservationId` | référence `Reservation` | Non | Renseigné pour les e-mails de réservation. |
| `contactMessageId` | référence `ContactMessage` | Non | Renseigné pour les e-mails de contact. |
| `kind` | texte court contrôlé | Oui | Exemples : `reservation_manager`, `reservation_customer`, `contact_manager`, `contact_customer`. |
| `recipient` | texte court | Oui | Destinataire réel de l'envoi ; donnée personnelle à conserver selon la politique validée. |
| `status` | `notification_status` | Oui | État d'envoi. |
| `providerMessageId` | texte court | Non | Identifiant du prestataire, si disponible. |
| `lastErrorCode` | texte court | Non | Code technique, sans contenu sensible. |
| `sentAt` | date-heure UTC | Non | Renseigné après succès. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

**Contrainte :** exactement une des références `reservationId` ou `contactMessageId` doit être renseignée.

## 5. Messages de contact

### 5.1 `ContactMessage`

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `status` | `contact_status` | Oui | Valeur initiale proposée : `nouveau`. |
| `name` | texte court | Oui | Nom renseigné par le visiteur. |
| `email` | texte court | Oui | Validation de format côté serveur. |
| `phone` | texte court | Non | Facultatif dans le formulaire Contact. |
| `subject` | texte court | Oui | Objet de la demande. |
| `message` | texte long | Oui | Contenu du message. |
| `consentAcceptedAt` | date-heure UTC | Oui | Horodatage du consentement. |
| `consentVersion` | texte court | Oui | Version du texte affiché. |
| `retentionExpiresAt` | date-heure UTC | Oui | Durée à valider. |
| `handledByAdminId` | référence `Administrator` | Non | Administrateur qui clôture ou traite le message, si ce suivi est retenu. |
| `handledAt` | date-heure UTC | Non | Date de traitement. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |
| `deletedAt` | date-heure UTC | Non | Suppression/anonymisation logique, à arbitrer. |

**Index minimaux :** `status`, `createdAt DESC`, `email`.

## 6. Contenus administrables

### 6.1 `RestaurantSettings`

Enregistrement unique portant les informations transverses du restaurant. L'unicité est imposée au niveau applicatif ou par une clé fixe.

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire ; un seul enregistrement actif. |
| `restaurantName` | texte court | Oui | Nom public. |
| `shortPresentation` | texte long | Non | Présentation générale, à valider. |
| `addressLine1` / `addressLine2` | texte court | Non | Adresse officielle, seulement après résolution de la divergence connue. |
| `postalCode` / `city` / `countryCode` | texte court | Non | Adresse normalisée. |
| `phone` / `email` | texte court | Non | Coordonnées publiques après validation. |
| `googleMapsUrl` | URL | Non | Lien d'itinéraire validé. |
| `defaultLocale` | texte court | Oui | `fr` pour le MVP. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

### 6.2 `OpeningHour`

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `dayOfWeek` | entier 0–6 | Oui | Convention à figer : lundi à dimanche, par exemple `1–7`. |
| `opensAt` / `closesAt` | heure | Non | Une plage d'ouverture. Plusieurs lignes autorisent coupure midi/soir. |
| `isClosed` | booléen | Oui | Permet de représenter une journée fermée. |
| `displayOrder` | entier positif | Oui | Ordre de lecture. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

Les exceptions, jours fériés et le calcul dynamique ouvert/fermé restent hors MVP ; ils ne sont pas modélisés ici.

### 6.3 `SocialLink`

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `platform` | texte court contrôlé | Oui | Exemples : `instagram`, `facebook`, `tiktok`. Liste à valider. |
| `url` | URL | Oui | URL du compte actif. |
| `isActive` | booléen | Oui | Évite de supprimer l'historique de configuration. |
| `displayOrder` | entier positif | Oui | Ordre d'affichage. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

### 6.4 `ContentSection`

Gère les sections **déjà prévues** dans une mise en page fixe. Ce modèle ne permet ni d'ajouter un type de bloc arbitraire ni de stocker du code.

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `sectionKey` | texte court unique | Oui | Clé contrôlée, par exemple `home.hero`, `home.presentation`, `home.menu_preview`, `home.access`, `home.final_cta`. |
| `title` | texte court | Non | Titre de la section. |
| `body` | texte long | Non | Texte éditorial. Le format riche éventuel est à définir. |
| `isEnabled` | booléen | Oui | Active ou désactive une section autorisée. |
| `displayOrder` | entier positif | Non | Utilisable seulement pour les groupes de sections explicitement réordonnables. |
| `mediaAssetId` | référence `MediaAsset` | Non | Visuel associé après validation des droits. |
| `updatedByAdminId` | référence `Administrator` | Non | Dernier éditeur. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

### 6.5 `SeoMetadata`

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `route` | texte court unique | Oui | Une des routes publiques MVP : `/`, `/carte`, `/reservation`, `/contact`, `/mentions-legales`. |
| `title` | texte court | Oui | Balise title de la route. |
| `metaDescription` | texte court | Oui | Meta description. |
| `localKeywords` | texte long | Non | Liste structurée ou texte à normaliser ; termes locaux validés uniquement. |
| `updatedByAdminId` | référence `Administrator` | Non | Dernier éditeur. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

### 6.6 `LegalDocument`

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `documentKey` | texte court unique | Oui | `mentions_legales`, `confidentialite` ou `cookies`. Ce sont des sections de `/mentions-legales`, pas des routes supplémentaires. |
| `title` | texte court | Oui | Titre affiché. |
| `body` | texte long | Oui | Texte fourni ou validé par le responsable légal. |
| `version` | texte court | Oui | Version publiée. |
| `publishedAt` | date-heure UTC | Non | Vide tant que le texte est en validation. |
| `updatedByAdminId` | référence `Administrator` | Non | Dernier éditeur. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

### 6.7 `MediaAsset`

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `storageKey` | texte court unique | Oui | Clé du fichier dans le stockage, pas une URL publique figée. |
| `altText` | texte court | Oui | Texte alternatif obligatoire avant publication. |
| `sourceUrl` | URL | Non | Source d'import, utile pour les images existantes. |
| `rightsStatus` | `media_rights_status` | Oui | Valeur initiale : `a_verifier`. |
| `mimeType` | texte court | Oui | Par exemple `image/webp`. |
| `width` / `height` | entier positif | Oui | Dimensions du média. |
| `fileSizeBytes` | entier positif | Oui | Poids de fichier. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

Une contrainte applicative doit interdire toute association publique d'un média dont `rightsStatus` n'est pas `valide`.

## 7. Carte et menus

### 7.1 `MenuCategory`

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `name` | texte court | Oui | Nom de catégorie affiché. |
| `slug` | texte court unique | Oui | Identifiant stable pour les ancres ou URLs futures. |
| `description` | texte long | Non | Introduction facultative. |
| `displayOrder` | entier positif | Oui | Ordre de la carte. |
| `isActive` | booléen | Oui | Cache une catégorie sans supprimer son contenu. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

### 7.2 `MenuItem`

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `categoryId` | référence `MenuCategory` | Oui | Catégorie parente. |
| `name` | texte court | Oui | Nom du plat ou de la boisson. |
| `description` | texte long | Non | Description courte. |
| `priceCents` | entier positif | Oui | Prix en centimes ; devise affichée : EUR, à centraliser. |
| `allergenInfo` | texte long | Non | Informations validées sur les allergènes. |
| `dietaryInfo` | texte long | Non | Régimes ou particularités, seulement si confirmés. |
| `availability` | `menu_availability` | Oui | `disponible` ou `indisponible`. |
| `imageAssetId` | référence `MediaAsset` | Non | Image facultative avec droits validés. |
| `displayOrder` | entier positif | Oui | Ordre dans la catégorie. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

## 8. Administration et accès

### 8.1 `Administrator`

| Champ | Type logique | Requis | Règle / usage |
| --- | --- | --- | --- |
| `id` | UUID / ULID | Oui | Clé primaire. |
| `email` | texte court unique | Oui | Identifiant de connexion et contact admin. |
| `displayName` | texte court | Oui | Nom affiché dans l'administration. |
| `role` | `admin_role` | Oui | Droits minimaux à valider. |
| `authProvider` | texte court | Oui | Identifie le mode d'authentification retenu. |
| `externalAuthId` | texte court unique | Non | Identifiant du fournisseur si authentification déléguée. |
| `passwordHash` | texte long | Non | Autorisé seulement si l'authentification locale est retenue ; jamais de mot de passe en clair. |
| `isActive` | booléen | Oui | Désactive l'accès sans détruire les traces. |
| `lastLoginAt` | date-heure UTC | Non | Information de sécurité minimale. |
| `createdAt` / `updatedAt` | date-heure UTC | Oui | Audit standard. |

**Contrainte :** un compte doit avoir soit `externalAuthId`, soit `passwordHash`, selon le mécanisme d'authentification choisi. Les rôles et la politique de connexion restent à valider avant implémentation.

## 9. Règles de sécurité, conservation et intégrité

1. Les validations de formulaire sont réalisées côté serveur avant toute écriture ou notification.
2. Les notes de réservation, l'historique, les journaux de notification et les données client ne sont jamais exposés par les routes publiques.
3. Les suppressions de catégories, plats ou services utilisés doivent être remplacées par une désactivation afin de préserver la cohérence historique.
4. Les références de médias sont supprimées ou réaffectées avant suppression d'un `MediaAsset`.
5. `Reservation.retentionExpiresAt` et `ContactMessage.retentionExpiresAt` doivent être calculés depuis une durée validée dans la politique de confidentialité ; aucune durée n'est présumée dans ce document.
6. Les accès administrateurs, changements de statut et mises à jour sensibles de contenu devront faire l'objet d'un journal d'audit si le niveau de traçabilité requis le confirme. Ce journal n'est pas encore un modèle MVP obligatoire.
7. Les données de réservation et contact doivent être exportables et supprimables/anonymisables pour répondre aux demandes de droits, selon les règles légales validées.

## 10. Décisions à valider avant implémentation

| Sujet | Décision requise | Impact sur le schéma |
| --- | --- | --- |
| Hébergement MySQL | Prestataire, région, sauvegardes, accès et propriété du compte. | Déploiement, connexion et politique de sauvegarde. |
| Prisma | Version, stratégie de migration et conventions d'identifiants. | Traduction du modèle relationnel en schéma Prisma. |
| Identifiants | UUID ou ULID | Génération des clés primaires et ordre de tri. |
| Authentification admin | Fournisseur, comptes, rôles et réinitialisation | Champs d'authentification et protection des routes. |
| Services et créneaux | Noms, heures, jours actifs, seuil groupe | `ReservationService`, calcul de capacité, validation formulaire. |
| Calcul de charge | Statuts inclus dans les couverts et demandes | Règle d'agrégation et alerte admin. |
| Conservation RGPD | Durée pour demandes et messages, procédure d'anonymisation | `retentionExpiresAt`, tâches de purge et politique légale. |
| Contact et e-mails | Destinataires, prestataire, textes et traitement des erreurs | `NotificationLog`, secrets et flux d'envoi. |
| Contenu riche | Texte simple ou éditeur riche contrôlé | Format de `ContentSection.body` et `LegalDocument.body`. |
| Médias | Stockage, transformation, droits, suppression | `MediaAsset.storageKey` et publication conditionnelle. |
| SEO | Limites de saisie et responsables de mise à jour | Validation de `SeoMetadata`. |

## 11. Hors périmètre de ce schéma MVP

- Réservation ou confirmation automatique, plan de tables et affectation de tables.
- Synchronisation Google Calendar.
- Notifications SMS, WhatsApp ou push.
- Statistiques avancées et suivi publicitaire.
- Événements privés, galerie publique, avis clients et statut dynamique ouvert/fermé.
- Éditeur visuel libre ou modèles de pages personnalisables.

## 12. État d'implémentation et prochaine étape

Les contrats sont documentés dans `docs/api-contracts.md`, les prérequis de production dans `docs/backend-prerequisites.md` et le schéma exécutable est dans `backend/prisma/schema.prisma`. La migration locale, les API et les formulaires sont déjà implémentés.

Les données et fonctionnalités décrites ici mais absentes du schéma Prisma ne doivent pas être considérées comme livrées : médias administrables, sections éditoriales, documents légaux éditables, capacité avancée et audit complet restent à arbitrer ou implémenter séparément.
