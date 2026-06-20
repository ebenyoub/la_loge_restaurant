# Backend MVP

Socle Express, TypeScript et Prisma/MySQL de La Loge Bar & Food.

## Commandes

```bash
npm install
npm run prisma:generate
npm run build
npm start
```

La route `GET /health` répond sans se connecter à MySQL. Une connexion réelle nécessite des
variables MySQL validées et l'ajout ultérieur des modèles Prisma.
