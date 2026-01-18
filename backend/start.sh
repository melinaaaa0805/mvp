#!/bin/sh
# start.sh

# Générer le client Prisma (optionnel si déjà généré dans builder)
# npx prisma generate --schema=./prisma/schema.prisma

# Appliquer les migrations sur la DB
npx prisma migrate deploy

# Seed de la DB
npx prisma db seed

# Lancer le serveur
echo "Starting NestJS server on port ${PORT:-4000}"
node dist/main.js
