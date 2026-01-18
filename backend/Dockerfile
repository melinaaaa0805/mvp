# =========================
# Étape 1 : Build
# =========================
FROM node:20-bullseye AS builder

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

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

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "dist/main.js"]