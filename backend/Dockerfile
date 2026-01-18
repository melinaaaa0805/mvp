# =========================
# Étape 1 : Build
# =========================
FROM node:20-bullseye AS builder
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openssl ca-certificates

# 1. Copier les fichiers de dépendances depuis le dossier backend
COPY package*.json ./

# 2. Copier le dossier prisma (depuis backend/prisma vers ./prisma dans l'image)
COPY /prisma ./prisma 

# 3. Installation et génération
RUN npm ci
# On utilise npx pour forcer la version 5.10.1 du projet
RUN npx prisma generate --schema=./prisma/schema.prisma

# 4. Copier le reste du code du dossier backend
COPY . .

# 5. Build NestJS
RUN npm run build

# =========================
# Étape 2 : Runtime
# =========================
FROM node:20-bullseye AS production
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Récupération des fichiers compilés
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./

# Environnement
ENV NODE_ENV=production

# Render utilise dynamiquement PORT, on ne fixe pas EXPOSE 4000
# On lance les migrations, le seed, puis le serveur
CMD npx prisma migrate deploy && npx prisma db seed && node dist/main.js