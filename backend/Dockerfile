FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci && npx prisma generate

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src ./src
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json prisma.config.ts ./
COPY prisma ./prisma

RUN npm ci --omit=dev && npx prisma generate

COPY --from=builder /app/dist ./dist

# Prisma custom client imports files from dist/generated/prisma.
# Some generated files remain .ts and are not emitted by tsc, so we copy them explicitly.
COPY --from=builder /app/src/generated/prisma ./dist/generated/prisma

EXPOSE 4000
CMD ["npm", "run", "start"]
