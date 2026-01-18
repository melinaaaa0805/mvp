# Étape 1 : build
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
# Build React en mode production
RUN npm run build

# Étape 2 : serveur léger pour servir les fichiers statiques
FROM nginx:alpine

# Copie les fichiers build
COPY --from=build /app/build /usr/share/nginx/html

# Remplace le default.conf pour gérer SPA React
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
