# Prérequis de production backend MVP

**Statut :** le backend local est implémenté (Express, Prisma/MySQL, JWT/bcrypt, SMTP Brevo). Cette checklist concerne désormais le passage vers un environnement exposé et de production.

**Décisions déjà validées :** MySQL, Prisma, Express, JWT/bcrypt et SMTP Brevo.
**Objectif :** fermer les décisions opérationnelles, de sécurité et de conformité avant le déploiement, sans exposer de secret dans ce document.

## 1. Règle de passage

L'initialisation du backend est autorisée uniquement après validation humaine des prérequis critiques ci-dessous. Elle pourra alors créer le squelette Express MVC et installer les dépendances approuvées, mais ne devra pas brancher les formulaires publics ni créer une base de production sans une tâche distincte.

Les prérequis concernent les flux décrits dans :

- `docs/database-schema.md`
- `docs/backend-architecture.md`
- `docs/api-contracts.md`

## 2. Variables d'environnement à prévoir

Les noms ci-dessous sont une convention cible. Ils ne doivent être ajoutés ni à un fichier `.env`, ni à une plateforme, ni au dépôt dans cette tâche.

### 2.1 Backend Express

| Variable | Sensible | Usage | Décision attendue |
| --- | --- | --- | --- |
| `NODE_ENV` | Non | Environnement d'exécution : développement, préproduction ou production. | Valeurs et environnements disponibles. |
| `PORT` | Non | Port HTTP local ou fourni par l'hébergeur. | Géré par l'hébergeur ou fixé localement. |
| `API_BASE_URL` | Non | URL publique canonique de l'API. | Sous-domaine, HTTPS et domaine propriétaire. |
| `CORS_ALLOWED_ORIGINS` | Non | Origines Next.js autorisées à appeler l'API. | URL développement, préproduction et production. |
| `TRUST_PROXY` | Non | Configuration Express derrière un proxy d'hébergement. | Valeur adaptée à l'hébergeur. |
| `LOG_LEVEL` | Non | Niveau de journalisation sans données personnelles. | Politique de logs par environnement. |
| `DATABASE_URL` | Oui | Chaîne de connexion MySQL utilisée par Prisma. | Hôte, base, TLS, utilisateur applicatif à privilèges minimaux. |
| `JWT_SECRET` | Oui | Signature des jetons JWT admin ; 32 caractères minimum. | Rotation et propriétaire du secret. |
| `SMTP_*` | Oui | Hôte, port, utilisateur et mot de passe SMTP Brevo. | Compte propriétaire, expéditeur et rotation. |
| `EMAIL_FROM` | Non | Adresse expéditrice validée. | Domaine et authentification d'envoi. |
| `RESTAURANT_NOTIFICATION_EMAIL` | Non | Destinataire des nouvelles demandes. | Adresse validée et personnes habilitées. |
| `RATE_LIMIT_*` | Non | Seuils de limitation des routes publiques. | Seuils et stratégie anti-spam à valider. |

### 2.2 Frontend Next.js

| Variable | Sensible | Usage | Décision attendue |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Non | Préfixe API consommé par le navigateur. | Doit correspondre à l'URL publique `/api/v1` et à la politique CORS. |

Les préfixes `NEXT_PUBLIC_` ne doivent jamais contenir de secret, clé e-mail, chaîne MySQL, clé de session ou identifiant d'administration.

## 3. Gestion des secrets

### Exigences minimales

- Les secrets sont stockés dans le gestionnaire de secrets de l'hébergeur ou un coffre dédié, jamais dans Git, un fichier public, une variable `NEXT_PUBLIC_*`, une capture d'écran ou une documentation partagée.
- Les valeurs de développement, préproduction et production sont séparées.
- Les accès sont attribués nominativement, avec le minimum de privilèges nécessaire.
- Une procédure de rotation est définie pour `DATABASE_URL`, `SESSION_SECRET`, les clés d'authentification et les clés d'e-mail.
- Les journaux, erreurs et outils de monitoring masquent les en-têtes d'authentification, corps de formulaire, mots de passe et chaînes de connexion.
- Un fichier d'exemple éventuel ne contient que des noms de variables et des valeurs fictives non exploitables ; sa création relève de la tâche d'initialisation, pas de celle-ci.

### Validation attendue

| Sujet | Responsable à désigner | Preuve de validation |
| --- | --- | --- |
| Propriété des comptes techniques | Client ou gérant | Liste des propriétaires et des accès de secours. |
| Stockage des secrets | Responsable technique | Coffre ou configuration d'hébergement identifié. |
| Rotation et révocation | Responsable technique | Procédure courte et canal d'urgence. |
| Accès administrateurs | Client / gérant | Comptes nominatifs, jamais partagés. |

## 4. Hébergement du backend Express

Le prestataire n'est pas encore choisi. Il doit être compatible avec un service Node.js/Express indépendant du déploiement Next.js.

| Critère | Exigence minimale à valider |
| --- | --- |
| Région et données | Région compatible avec les exigences RGPD et les contrats de sous-traitance retenus. |
| HTTPS et domaine | HTTPS géré, sous-domaine API contrôlé par le client et renouvellement de certificat clair. |
| Secrets | Variables chiffrées, accès restreint et séparation des environnements. |
| Déploiement | Déploiement depuis le dépôt, journal d'exécution, rollback et environnements séparés. |
| Santé et disponibilité | Health check, redémarrage contrôlé et alertes d'indisponibilité. |
| Observabilité | Logs consultables, masquage des données personnelles et conservation définie. |
| Réseau | Autoriser seulement les origines CORS validées et les sorties nécessaires vers MySQL et l'e-mail. |
| Coût et propriété | Compte, moyen de paiement et plafonds de dépense détenus ou validés par le client. |

**Décision à produire avant installation :** prestataire, région, URL d'API, propriétaire du compte, environnements disponibles et procédure de déploiement/rollback.

## 5. Hébergement MySQL

La base doit être un service MySQL managé ou administré avec un niveau de sécurité et d'exploitation compatible avec des données de réservation et de contact.

| Critère | Exigence minimale à valider |
| --- | --- |
| Compatibilité | Version MySQL supportée par la version Prisma choisie. |
| Région et contrat | Région, conditions de traitement des données et sous-traitants identifiés. |
| Chiffrement | Connexion TLS entre Express et MySQL ; chiffrement au repos selon l'offre sélectionnée. |
| Comptes | Utilisateur applicatif dédié, sans privilèges d'administration globale. |
| Réseau | Accès limité au backend Express et aux opérateurs autorisés ; aucune exposition publique non nécessaire. |
| Sauvegardes | Fréquence, durée de conservation, chiffrement et test de restauration documentés. |
| Reprise | Procédure de restauration, objectif de reprise et interlocuteur d'astreinte définis. |
| Migrations | Stratégie Prisma, environnement de préproduction et procédure de rollback validés avant la première migration. |
| Coût et propriété | Compte, facturation, plafonds et accès de secours validés. |

**Décision à produire avant installation :** prestataire MySQL, version, région, stratégie de sauvegarde, procédure de restauration et utilisateur applicatif à créer lors de la tâche dédiée.

## 6. Authentification et droits admin

L'architecture prévoit des routes admin et les rôles `gerant` et `editeur`. Le mécanisme d'authentification reste à valider avant l'initialisation.

| Sujet | Décision requise |
| --- | --- |
| Mécanisme | Fournisseur d'identité externe ou authentification locale ; aucun mot de passe en clair. |
| Session | Cookie de session sécurisé ou jeton ; compatibilité avec les domaines Next.js/API et CORS à confirmer. |
| Comptes initiaux | Liste nominative des gérants et éditeurs ; aucun compte partagé. |
| Rôles | `gerant` traite demandes, messages et capacités ; `editeur` gère les contenus. Les droits exacts sont à confirmer. |
| Réinitialisation | Parcours de récupération, révocation de compte et changement de personne responsable. |
| MFA | Exigence ou non pour les gérants ; décision à tracer. |
| Journalisation | Événements de connexion et actions sensibles à conserver sans stocker de secret. |

**Recommandation de sécurité :** privilégier une session sécurisée et un périmètre de domaine maîtrisé plutôt qu'un jeton stocké dans le navigateur. Le mécanisme exact reste une décision d'implémentation validée séparément.

## 7. Règles RGPD et légales restantes

| Sujet | À valider avant collecte réelle |
| --- | --- |
| Responsable de traitement | Entité juridique, coordonnées et point de contact pour les droits. |
| Finalités | Traitement de la demande de réservation ou de contact, et aucune finalité non annoncée. |
| Consentements | Texte final, version, emplacement, preuve et condition d'envoi. |
| Conservation | Durées des réservations, messages, journaux de notification et procédure d'anonymisation/suppression. |
| Sous-traitants | Hébergeur backend, MySQL, e-mail, anti-spam et observabilité ; contrats nécessaires. |
| Droits des personnes | Procédure d'accès, rectification, suppression et réponse aux demandes. |
| Cookies et traceurs | Outils activés, nécessité d'un consentement, bannière et registre des choix. |
| Anti-spam | Données traitées, éventuels transferts, durée et information visible. |
| Données d'e-mail | Adresse expéditrice, destinataire gérant, contenu, erreurs et relances. |

Le consentement ne remplace pas les autres obligations légales. La politique de confidentialité et les mentions légales doivent être validées avant l'activation de tout formulaire réel.

## 8. Risques avant implémentation

| Risque | Conséquence | Réduction attendue avant initialisation |
| --- | --- | --- |
| Secret publié ou partagé | Accès non autorisé à la base, l'e-mail ou l'administration. | Coffre, permissions nominatives, rotation et revue avant déploiement. |
| Domaine/CORS mal configuré | Formulaires bloqués ou appels inter-origines non souhaités. | Définir les domaines exacts par environnement et tester la politique CORS. |
| Base exposée publiquement | Fuite ou altération de données personnelles. | Réseau privé/restrictif, TLS et utilisateur à privilèges minimaux. |
| Sauvegarde non testée | Perte durable des demandes. | Politique de sauvegarde et test de restauration. |
| Règles métier incomplètes | Traitement incohérent des demandes ou alertes de capacité erronées. | Valider créneaux, transitions de statut, capacité et seuil groupe. |
| Textes RGPD incomplets | Collecte non conforme ou impossibilité de répondre aux droits. | Valider textes, durées, responsables et processus de suppression. |
| Échec d'e-mail silencieux | Le gérant ou le client ne reçoit pas l'information attendue. | Choisir le prestataire, les alertes et la stratégie de relance. |
| Compte admin partagé | Absence de traçabilité et accès persistant après départ. | Comptes nominatifs, révocation et rôles minimaux. |
| Coûts imprévus | Interruption du service ou dépassement de budget. | Budgets, alertes de coût et propriétaire de facturation. |
| Dépendance vulnérable | Risque de sécurité ou blocage de mise en production. | Revoir les rapports `npm audit`, les avis amont et les mises à jour compatibles ; ne pas appliquer de downgrade majeur sans décision. |

## 9. Checklist de validation avant installation

### Critiques — toutes obligatoires

- [ ] Prestataire et région d'hébergement Express validés.
- [ ] Prestataire MySQL, région, version, sauvegardes et restauration validés.
- [ ] Sous-domaines frontend/API et politique CORS validés.
- [ ] Propriétaires des comptes backend, MySQL et e-mail identifiés.
- [ ] Stockage des secrets et procédure de rotation validés.
- [ ] Authentification admin, comptes initiaux, rôles et récupération validés.
- [ ] Prestataire e-mail, expéditeur et destinataire gérant validés.
- [ ] Textes de consentement, durées de conservation et responsable RGPD validés.
- [ ] Services, créneaux, taille de groupe, transitions de statut et règle de capacité validés.
- [ ] Stratégie de logs, masquage des données et accès aux logs validés.

### Avant de brancher les formulaires publics

- [ ] Les validations serveur des contrats d'API sont implémentées et testées.
- [ ] La protection anti-spam et la limitation de débit sont configurées et testées.
- [ ] Les e-mails restaurant et client sont testés sans formulation de confirmation automatique.
- [ ] Les procédures de suppression/anonymisation et de récupération de données sont testées.
- [ ] Le parcours admin est protégé, testé et limité aux rôles autorisés.

## 10. Résultat attendu avant mise en ligne

Le backend de développement reste inchangé tant que cette checklist n'est pas validée. Avant mise en ligne, préparer une configuration de secrets hors Git, MySQL managé avec sauvegardes, CORS restrictif, domaine SMTP vérifié, stratégie de logs sans données personnelles et procédure de rotation/réponse aux incidents.
