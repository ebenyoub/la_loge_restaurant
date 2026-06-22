# La Loge Bar & Food

Site vitrine et administration MVP du restaurant La Loge Bar & Food.

## État au 21 juin 2026

Le MVP fonctionnel est avancé : vitrine Next.js, API Express, MySQL/Prisma, formulaires de réservation et de contact, e-mails SMTP Brevo et administration protégée par JWT sont opérationnels.

Les pages publiques sont `/`, `/carte`, `/reservation`, `/contact` et `/mentions-legales`. La carte publique lit les catégories et plats de MySQL ; l'administration permet de gérer les réservations, messages, catégories, plats et réglages.

La mise en ligne reste conditionnée notamment par la validation des données légales, des coordonnées publiques et des droits d'utilisation des photos.

## Stack

- Frontend : Next.js App Router, TypeScript, Tailwind CSS
- Backend : Express 5, TypeScript
- Données : Prisma et MySQL
- Authentification admin : JWT et bcrypt
- E-mails : SMTP Brevo via Nodemailer
- Tests : Playwright côté frontend, Vitest/Supertest côté backend

## Démarrer le frontend

```bash
npm install
npm run dev
```

Le frontend est disponible sur [http://localhost:3000](http://localhost:3000). Il utilise `NEXT_PUBLIC_API_URL` et, en développement local par défaut, l'API `http://localhost:4000/api/v1`.

## Démarrer le backend

```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

Configurer les variables d'environnement nécessaires au backend, dont `DATABASE_URL`, `JWT_SECRET` et les paramètres SMTP. Voir [backend/README.md](./backend/README.md).

## Vérifications

```bash
npm run lint
npm run build
npm run test:e2e

cd backend && npm test
```

## Documentation

- [État du projet](./PROJECT_STATE.md)
- [Actions restantes](./TODO.md)
- [Pilotage des tâches](./TASKS.md)
- [Décisions produit et techniques](./decisions.md)
- [Backlog produit](./product-backlog.md)
- [Contrats d'API](./docs/api-contracts.md)
- [Architecture backend](./docs/backend-architecture.md)
- [Schéma de données](./docs/database-schema.md)
- [Inventaire et statut des images](./docs/images-inventory.md)

## Images

Les fichiers de `public/images/imported/` ne peuvent pas être publiés ou intégrés sans validation écrite des droits par le client. Leur présence dans le dépôt ne vaut pas autorisation d'utilisation.
