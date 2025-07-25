# inventory-api/Dockerfile

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# 1. Copiem doar manifestele ca să avem cache bun
COPY package.json package-lock.json ./

# 2. Instalăm strict pe lockfile
RUN npm install

# 3. Copiem restul codului
COPY . .

# 4. Construim (dacă ai build script, altfel sari peste pasul ăsta)
#    de exemplu: RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# 5. Copiem artefactele din build (în cazul nostru tot codul + node_modules)
COPY --from=build /app ./

# 6. Expunem portul
EXPOSE 4000

# 7. Pornim serverul
CMD ["node", "index.js"]