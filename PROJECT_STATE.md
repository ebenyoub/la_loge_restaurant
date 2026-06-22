# État du projet — La Loge Bar & Food

**Dernière mise à jour :** 22 juin 2026  
**Phase :** MVP fonctionnel avancé ; consolidation des contenus, de la fidélité visuelle et de la recette avant mise en ligne.

## Éléments livrés et vérifiés

### Frontend

- Pages publiques : Accueil, Carte, Réservation, Contact/Accès et Mentions légales (chargées dynamiquement depuis MySQL).
- Carte publique connectée à MySQL via `GET /api/v1/public/menu` : 9 catégories et 46 plats lors du dernier contrôle.
- Réglages publics chargés via `GET /api/v1/public/settings`; les états de chargement techniques ne sont pas affichés dans le header ni le footer.
- Formulaires Réservation et Contact connectés à l'API et migrés vers le standard React Hook Form + Zod.
- Menu mobile accessible ; navigation de la carte avec ancres dont l'offset tient compte du header et de la barre de catégories sticky.
- Direction typographique publique sans-serif, sans italique visible, conformément à la capture Figma fournie comme référence visuelle actuelle.
- Fondation technique React Hook Form + Zod opérationnelle (`src/lib/forms/` et `src/lib/validation/`).
- Métadonnées SEO et SEO local : Balises title/description dynamiques, OpenGraph, Twitter, canonical, données structurées JSON-LD (Restaurant), sitemap.xml et robots.txt configurés.


### Administration

- Login JWT migré vers React Hook Form + Zod, avec formulaire navigateur standard (`Enter`, `autocomplete` identifiant/mot de passe).
- Redirection automatique si le jeton JWT admin est invalide ou expiré (détection 401 sur toutes les requêtes admin, suppression de `admin_token`, `admin_user` du localStorage et cookie, redirection vers `/admin/login?expired=true` avec un message d'avertissement).
- Navigation admin complète : Réservations, Contacts, Sections de la carte, Plats et Réglages.
- Réservations : liste, filtres, fiche détail, changement de statut et notes internes avec états de mutation, désactivation des actions et mise à jour immédiate de l'interface.
- Contacts : liste, détail et changement de statut.
- Carte : CRUD catégories et plats. Les vues admin lisent les mêmes données MySQL que la carte publique (9 catégories, 46 plats lors du dernier contrôle).
- Réglages : informations générales, horaires, réseaux sociaux, SEO et documents légaux / RGPD (éditables via React Hook Form + Zod).
- La barre admin reste sous le header public fixe, y compris sur mobile.

### Backend et données

- Express 5, TypeScript, Prisma et MySQL opérationnels.
- Réservations et contacts persistés, avec e-mail client et e-mail gérant via SMTP Brevo.
- Validation des horaires d'ouverture sur les réservations.
- Authentification JWT/bcrypt et routes admin protégées sous `/api/v1/admin`.
- API publique distincte : `/api/v1/public/menu` et `/api/v1/public/settings`.
- Tests backend : 49 tests passants lors de la dernière validation backend.

### Validation réalisée

- `npm run lint` : OK.
- `npm run build` : OK.
- `npm run test:e2e` : OK (14 tests passants couvrant les espaces d'administration et les parcours publics : carte, contact, réservation, et menu burger).

## Décisions de portée en vigueur

| Sujet | Décision |
| --- | --- |
| Réservation | Demande manuelle : aucune confirmation ou blocage automatique. |
| E-mails | E-mails de création au client et au gérant uniquement ; pas d'e-mail de changement de statut à ce stade. |
| API frontend | Toute requête passe par `src/lib/api.ts` et `NEXT_PUBLIC_API_URL`; aucun appel relatif `/api/v1`. |
| Carte publique | Source de vérité : `MenuCategory` et `MenuItem` MySQL. Une absence de données produit un état vide, pas des plats inventés. |
| Administration | Administration JWT avec gestion des réservations, contacts, catégories, plats et réglages. |
| Design public | Capture Figma actuelle fournie par le client comme référence visuelle. Sans-serif et sans italique visible sur les pages publiques. |
| Images | Aucun média de `public/images/imported/` ne peut être publié sans validation écrite des droits. |
| Hors périmètre actuel | Captcha, rate limiting, e-mails de changement de statut, déploiement, calendrier et confirmation automatique. |
| Standard Frontend | UI Foundation, Architecture modulaire, React Hook Form, Zod, Pages orchestratrices, Types dérivés des schémas. |
| Standard Formulaires | React Hook Form et Zod obligatoires. Centralisation dans `src/lib/validation/`, hook par formulaire `useXxxForm` et intégration avec les primitives UI. |

## Restant avant mise en ligne

1. Obtenir les coordonnées, horaires, mentions légales, politique de confidentialité et durées de conservation définitifs.
2. Obtenir l'autorisation écrite des photos réellement exploitables ou organiser/fournir de nouveaux médias ; retirer tout média non autorisé avant publication.
3. Valider la carte, les prix, descriptions, disponibilités, allergènes et contenus éditoriaux en production.
4. Finir l'alignement visuel responsive avec la capture Figma actuelle, avec recette desktop et mobile.
5. Préparer séparément le déploiement : secrets, CORS, MySQL managé, domaine, SMTP, sauvegardes, supervision et revue de sécurité/RGPD.

## Documents de référence

- [Backlog produit](./product-backlog.md)
- [Décisions](./decisions.md)
- [Actions restantes](./TODO.md)
- [Contrats d'API](./docs/api-contracts.md)
- [Inventaire des images](./docs/images-inventory.md)
