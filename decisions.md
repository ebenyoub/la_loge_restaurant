# Décisions produit — La Loge Bar & Food

Ce document est la source de vérité des décisions de portée applicables au MVP.

## D-001 — Réservation MVP par demande manuelle

**Statut :** validée
**Date :** 20 juin 2026

Le client envoie une demande complète ; le gérant la confirme, la refuse, l'annule ou reprend contact. Aucune table n'est confirmée ou bloquée automatiquement.

**Conséquence :** libellés, e-mails et écrans parlent de demande et d'attente de confirmation.

## D-002 — Champs et validation de la demande

**Statut :** validée
**Date :** 20 juin 2026

Le formulaire collecte nom, prénom, téléphone, e-mail, date, heure, couverts, message facultatif, occasion facultative et consentement RGPD. Les champs nécessaires sont validés côté serveur ; les horaires d'ouverture sont contrôlés avant persistance.

## D-003 — Persistance et e-mails de création

**Statut :** validée
**Date :** 20 juin 2026

Une demande valide est persistée avant l'envoi d'un e-mail au gérant et d'un accusé de réception au client via SMTP Brevo.

**Limite actuelle :** aucun e-mail n'est envoyé lors d'un changement de statut.

## D-004 — Administration des réservations

**Statut :** validée
**Date :** 20 juin 2026

L'administration authentifiée permet de consulter, filtrer et traiter les demandes, y compris les notes internes. Les seuls statuts sont `nouvelle`, `en attente`, `confirmée`, `refusée` et `annulée`.

## D-005 — Capacité : alerte, jamais blocage automatique

**Statut :** validée
**Date :** 20 juin 2026

Les règles de capacité ne doivent jamais empêcher la réception d'une demande. La décision finale reste humaine. Les vues d'alerte de charge avancées restent à compléter si elles sont souhaitées.

## D-006 — CMS livré et limites

**Statut :** validée
**Date :** 21 juin 2026

L'administration livrée gère les réglages généraux, horaires, adresse, téléphone, e-mail, réseaux sociaux, SEO principal, catégories et plats.

**Limite actuelle :** les textes d'accueil structurés, médias, événements/privatisations et édition des mentions légales ne constituent pas encore des fonctions CMS livrées.

## D-007 — Pas de page builder

**Statut :** validée
**Date :** 20 juin 2026

La mise en page reste fixe, responsive et contrôlée. Aucun éditeur visuel libre, composant arbitraire ou constructeur de pages n'est prévu.

## D-008 — Priorités post-MVP

**Statut :** validée
**Date :** 20 juin 2026

Statistiques, notifications SMS/WhatsApp/push, disponibilité fine, synchronisation Google Calendar, galerie, événements privés et disposition avancée sont P2.

## D-009 — Stack effectivement implémentée

**Statut :** validée  
**Date :** 21 juin 2026

Le frontend utilise Next.js, TypeScript et Tailwind CSS. Le backend utilise Express 5, TypeScript, MySQL et Prisma. L'authentification admin utilise JWT et bcrypt ; les e-mails transactionnels utilisent SMTP Brevo.

L'hébergement de production reste à choisir ; aucune décision Vercel, base managée ou fournisseur de secrets n'est implicite.

## D-010 — API séparée et URL centralisée

**Statut :** validée  
**Date :** 21 juin 2026

Le frontend ne contacte pas `/api/v1` de manière relative. Toutes les requêtes passent par `src/lib/api.ts`, alimenté par `NEXT_PUBLIC_API_URL` (valeur locale par défaut : `http://localhost:4000/api/v1`).

## D-011 — Carte publique : source de vérité MySQL

**Statut :** validée
**Date :** 21 juin 2026

La carte publique lit `MenuCategory` et `MenuItem` via `GET /api/v1/public/menu`. L'administration utilise les routes `/api/v1/admin/menu-categories` et `/api/v1/admin/menu-items` sur la même API et base de données.

**Conséquence :** aucun plat, prix ou descriptif ne doit être inventé côté frontend. Sans description fournie, elle est masquée ou présentée comme « Description à confirmer ».

## D-012 — Réglages publics

**Statut :** validée  
**Date :** 21 juin 2026

Le header, footer et contenus pratiques utilisent `GET /api/v1/public/settings`. Les routes admin sont limitées au préfixe `/api/v1/admin` afin de ne pas intercepter les routes publiques.

## D-013 — Référence visuelle et typographie

**Statut :** validée par directive de travail
**Date :** 21 juin 2026

La capture Figma actuelle fournie par le client est la référence visuelle ; `figma-make/` local n'est pas la source de vérité. Les textes visibles des pages publiques suivent une hiérarchie sans-serif et n'affichent ni serif ni italique sans validation explicite.

## D-014 — Images : droits bloquants avant publication

**Statut :** bloquante avant mise en ligne
**Date :** 21 juin 2026

Les médias de `public/images/imported/` sont des éléments d'audit. Leur provenance publique ne vaut pas autorisation de réutilisation. Chaque média publié doit être couvert par une validation écrite du client ou remplacé par un média avec droits établis.

## D-015 — Éléments différés

**Statut :** validée
**Date :** 21 juin 2026

Captcha, rate limiting, e-mails de changement de statut et déploiement sont volontairement différés jusqu'à la finalisation de la connexion des contenus, des images, de la fidélité Figma et du responsive.
