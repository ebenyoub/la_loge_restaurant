# Checklist de Recette MVP — La Loge Bar & Food

Ce document est la source de vérité pour le déroulement de la recette finale (P1-30) avant mise en ligne.

---

## 1. Vues Publiques (Parcours Visiteur)

### 1.1. Accueil
- [x] **Visuel Hero & Contrastes :** La photo de façade de nuit s'affiche correctement avec son filtre assombrissant.
- [x] **Informations dynamiques :** L'adresse et les horaires du jour s'affichent correctement depuis le contexte des réglages de la base de données.
- [x] **Actions (CTAs) :** Les boutons « Demander une réservation » et « Voir la carte » renvoient vers les bonnes pages.
- [ ] **À tester manuellement :** Vérifier la lisibilité des textes du Header transparent sur différents écrans et luminosités d'images.

### 1.2. Carte
- [x] **Catégories & Plats :** Rendu dynamique à partir de la base de données (9 catégories, 46 plats).
- [x] **Navigation par ancres :** Défilement fluide vers les sections de la carte avec décalage (offset) adapté au header fixe.
- [x] **Indisponibilités :** Les plats indisponibles sont masqués ou présentés conformément à la règle **D-011**.
- [ ] **À tester manuellement :** Comportement en cas d'indisponibilité réseau lors du chargement des plats (affichage de l'état d'erreur).

### 1.3. Demande de Réservation
- [x] **Validation RHF + Zod :** Validation stricte côté client (nom, prénom, e-mail, téléphone, date, heure, couverts, occasion).
- [x] **Consentement RGPD :** Case à cocher obligatoire avec lien cliquable vers la politique de confidentialité.
- [x] **Bandeau d'information :** Présentation claire indiquant que la réservation est manuelle et soumise à confirmation (règle **D-001**).
- [ ] **À tester manuellement :** Soumettre une demande avec des horaires en dehors des plages d'ouverture (doit être bloqué par la validation).

### 1.4. Contact & Accès
- [x] **Informations Pratiques (NAP) :** Numéro de téléphone, e-mail et adresse physique uniformes provenant des réglages de la base de données.
- [x] **Liens cliquables (Actions mobiles) :** Téléphone cliquable (`tel:`), e-mail cliquable (`mailto:`) et itinéraire cliquable vers Google Maps.
- [x] **Carte interactive (Iframe) :** Intégration Google Maps avec chargement paresseux (`loading="lazy"`).
- [ ] **À tester manuellement :** Vérifier l'ergonomie de l'itinéraire sur mobile (redirection vers l'application GPS native).

### 1.5. Mentions Légales
- [x] **Affichage unifié :** Rendu dynamique des mentions légales, de la politique de confidentialité et de la gestion des cookies à partir de la table MySQL `LegalDocument`.
- [x] **Fil d'Ariane :** Navigation simplifiée pour retourner à l'accueil.
- [ ] **À tester manuellement :** Tester la navigation par ancres dans la barre latérale sur desktop.

---

## 2. Espace Administration (Parcours Gestionnaire)

### 2.1. Authentification & Sécurité (Login)
- [x] **Formulaire standard :** Connexion JWT avec gestion par React Hook Form + Zod, soumission via touche `Enter` et autocomplétion du navigateur.
- [x] **Redirection automatique (401) :** Déconnexion immédiate et redirection vers `/admin/login?expired=true` si le token expire ou est altéré.
- [ ] **À tester manuellement :** Tenter d'accéder à `/admin/reservations` sans jeton d'authentification (doit rediriger vers le login).

### 2.2. Gestion des Réservations
- [x] **Liste & Filtres :** Filtres par date et par statut (`nouvelle`, `en attente`, `confirmée`, `refusée`, `annulée`).
- [x] **Fiche Détail & Notes Internes :** Visualisation des détails et ajout de notes internes persistées sans rechargement de page.
- [x] **Indication de charge :** Affichage de la charge pour aider le gérant dans sa prise de décision.
- [x] **Rappel RGPD :** Message affiché indiquant la durée de conservation maximale de 3 ans.
- [ ] **À tester manuellement :** Changer le statut d'une réservation et vérifier la mise à jour instantanée du compteur ou de la couleur du statut dans la liste.

### 2.3. Messages de Contact
- [x] **Traitement des demandes :** Liste des messages reçus avec filtres de statut (`nouveau`, `lu`, `traité`, `archivé`).
- [x] **Rappel RGPD :** Message affiché indiquant la durée de conservation de 3 ans.
- [ ] **À tester manuellement :** Valider l'envoi d'une réponse par e-mail au visiteur directement depuis l'interface (si configuré).

### 2.4. Catégories & Plats (Admin)
- [x] **CRUD Complet :** Ajout, modification, suppression et tri par ordre d'affichage.
- [ ] **À tester manuellement (RGPD / Validation) :** Refactorisation des formulaires vers RHF + Zod à confirmer dans une prochaine phase technique.

### 2.5. Réglages Généraux & Horaires
- [x] **Configuration dynamique :** Modification instantanée des coordonnées du restaurant, horaires d'ouverture, liens sociaux, et métadonnées SEO.
- [x] **Édition des documents légaux :** Éditeur pour les mentions légales, la politique de confidentialité, et les cookies.
- [ ] **À tester manuellement :** Modifier une heure d'ouverture et vérifier son impact direct sur le widget des horaires d'accueil.

---

## 3. SEO, RGPD & Performances

### 3.1. SEO & Métadonnées
- [x] **Tags Dynamiques :** Titres, meta descriptions, et tags OpenGraph/Twitter injectés à partir de la configuration SEO.
- [x] **Sitemap & Robots :** Fichiers `/sitemap.xml` et `/robots.txt` correctement générés.
- [x] **Données structurées JSON-LD :** Schéma `Restaurant` et `LocalBusiness` présent sur la page d'accueil avec les coordonnées réelles.

### 3.2. RGPD & Cookies
- [x] **Consentement explicite :** Cases à cocher obligatoires avec lien de politique intégrés dans les formulaires Contact et Réservation.
- [x] **Absence de cookies tiers :** Aucun service tiers (type Analytics ou Pixels) n'étant configuré, la politique de cookie confirme qu'aucun consentement complémentaire (bandeau) n'est nécessaire (décision **D-018**).

### 3.3. Performances
- [x] **Responsive Images :** Composant `next/image` configuré avec l'attribut `sizes` correct pour éviter les téléchargements d'images trop lourdes sur mobile.

---

## 4. Classification de la Recette

### 4.1. Ce qui est prêt (Validé techniquement)
* Architecture modulaire, séparation des layouts public et admin.
* Validation TypeScript et compilation Turbopack (`npm run build`).
* Routage public, pages statiques et dynamiques.
* Connexion MySQL pour l'affichage de la carte et la configuration générale.
* Authentification admin JWT et protection des endpoints de l'API.

### 4.2. Ce qui doit être testé manuellement
* Délivrabilité des e-mails SMTP Brevo (notification gérant + confirmation client).
* Rendu final responsive sur des modèles de téléphones spécifiques (iPhone Safari, Android Chrome).
* Comportements en cas de coupure réseau (mode hors-ligne, messages d'erreurs API).

### 4.3. Ce qui bloque un déploiement de production
* **Validation écrite des droits d'auteur** pour toutes les images du répertoire `/public/images/imported/` (bloquant absolu, règle **D-014**).
* **Validation finale des coordonnées réelles** (adresse, téléphone, horaires d'ouverture définitifs) par le client.
* **Validation des mentions légales définitives** (identité de l'éditeur, responsable de publication, hébergeur final).

### 4.4. Ce qui peut être reporté après le MVP (P2)
* Système d'anti-spam avancé (Captcha, Rate limiting) sur les formulaires publics.
* Notifications SMS ou WhatsApp pour les confirmations de réservations.
* Synchronisation avec Google Calendar.
* Statistiques de visites et de conversion (Dashboard admin).
