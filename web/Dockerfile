###########################
# 1) Build stage
###########################
FROM node:20-alpine AS build
WORKDIR /app

# Copiem doar manifestele de pachete (pentru cache bun)
COPY package*.json ./
RUN npm ci

# Copiem restul codului și generăm build‑ul
COPY . .
RUN npm run build    # produce folderul `dist/`

###########################
# 2) Runtime stage (Nginx)
###########################
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Luăm build‑ul din etapa anterioară
COPY --from=build /app/dist .

# Expunem portul default nginx
EXPOSE 80

# Pornim Nginx în prim‑plan
CMD ["nginx", "-g", "daemon off;"]