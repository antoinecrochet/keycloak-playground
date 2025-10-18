FROM node:20-alpine
LABEL maintainer="Antoine Crochet <antoinecrochet.contact+github@gmail.com>"
LABEL org.opencontainers.image.source=https://github.com/antoinecrochet/keycloak-playground
LABEL org.opencontainers.image.description="A playground backend application to explore Keycloak features like UMA, Authorization Services, and more."
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
