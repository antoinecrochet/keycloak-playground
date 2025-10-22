# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Production stage ----
FROM nginx:alpine
LABEL maintainer="Antoine Crochet <antoinecrochet.contact+github@gmail.com>"
LABEL org.opencontainers.image.source=https://github.com/antoinecrochet/keycloak-playground
LABEL org.opencontainers.image.description="A playground application to explore Keycloak features like UMA, Authorization Services, and more."
LABEL org.opencontainers.image.licenses=MIT
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
