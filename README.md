# Keycloak Playground

Application de test pour Keycloak 26 avec OIDC et UMA.  
Comprend un frontend React + Vite et un backend Node.js.

## Fonctionnalités

- Frontend :
  - Login / Logout avec Keycloak
  - Affichage des Access Token et ID Token
  - Affichage des User Info
  - Interface pour tester les ressources UMA

- Backend :
  - API protégée par Keycloak
  - Échange des tickets UMA contre RPT
  - Vérification des tokens JWT
  - Logs pour debug des autorisations UMA

## Prérequis

- Docker & Docker Compose
- Keycloak 26.x
- Clients Keycloak configurés :
  - `js-client` (public) pour le frontend
  - `rs-server` (confidential / service account) pour le backend

## Lancer le projet

```
docker compose up --build
```

Frontend : http://localhost:5173
Backend : http://localhost:3000/api/resource/prod-doc-1

## Variables d’environnement

.env à la racine (Docker Compose) :
```
KEYCLOAK_URL=http://auth.localhost
KEYCLOAK_REALM=test
KEYCLOAK_FRONT_CLIENT_ID=js-client
KEYCLOAK_BACK_CLIENT_ID=rs-server
KEYCLOAK_CLIENT_SECRET=*****
BACKEND_PORT=3000
BACKEND_URL=http://localhost:3000
FRONTEND_PORT=5173
```

.frontend/.env :
```
VITE_KEYCLOAK_URL=http://auth.localhost
VITE_KEYCLOAK_REALM=test
VITE_KEYCLOAK_CLIENT_ID=js-client
VITE_API_BASE_URL=http://localhost:3000/api
```

## Développement

Frontend :
```
cd frontend
npm install
npm run dev
```

Backend :
```
cd backend
npm install
node server.js
```