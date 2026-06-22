# Backend — La Loge Bar & Food

API Express 5 du MVP. Elle expose les formulaires publics, les données publiques de la carte et des réglages, ainsi que les routes d'administration protégées par JWT.

## Fonctions livrées

- Réservations et messages de contact : validation, persistance MySQL et e-mails client/gérant.
- Validation des horaires d'ouverture pour les demandes de réservation.
- Authentification admin par JWT et bcrypt.
- Gestion admin des réservations, notes internes, messages, catégories, plats et réglages.
- Endpoints publics `GET /api/v1/public/menu` et `GET /api/v1/public/settings`.

## Prérequis

- Node.js et npm compatibles avec le projet.
- MySQL accessible via `DATABASE_URL`.
- Un `JWT_SECRET` d'au moins 32 caractères.
- Paramètres SMTP Brevo pour les e-mails transactionnels.

## Commandes

```bash
npm install
npm run prisma:generate
npm run dev
npm test
npm run build
```

Le serveur local écoute habituellement sur le port `4000`; le frontend utilise `NEXT_PUBLIC_API_URL`, avec `http://localhost:4000/api/v1` comme valeur de développement par défaut.

`GET /health` est disponible comme sonde technique. La documentation des routes est maintenue dans [../docs/api-contracts.md](../docs/api-contracts.md).
