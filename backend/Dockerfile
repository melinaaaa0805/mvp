# =========================
# Étape 1 : Build
# =========================
FROM node:20-bullseye AS builder

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copier uniquement package.json pour installer deps
COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copier le reste du code
COPY . .

# Build NestJS et compiler start.ts en JS
RUN npm run build

# =========================
# Étape 2 : Runtime
# =========================
FROM node:20-bullseye AS production

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copier node_modules, dist et prisma depuis le builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./

ENV NODE_ENV=staging
EXPOSE 4000
# À la fin de votre Dockerfile
# On enchaîne : Migration -> Seed -> Start
CMD npx prisma migrate deploy && npx prisma db seed && node dist/main.js