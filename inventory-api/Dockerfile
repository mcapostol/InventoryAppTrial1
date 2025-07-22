# -------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# copiem doar fișierele de dependențe mai întâi ⇒ cache mai bun
COPY package*.json ./
RUN npm ci          # instalează dependențele exact cum sunt în lockfile

# copiem restul codului
COPY . .

# dacă folosești TypeScript: RUN npm run build
# dacă e JavaScript pur, sari direct la runtime stage

# -------- runtime stage ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=4000

COPY --from=build /app /app

# elimină dependențele dev
RUN npm ci --omit=dev
EXPOSE 4000
CMD ["npm", "start"]  