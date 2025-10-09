import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const app = express();
app.use(bodyParser.json());

// ==================== CONFIG ====================
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || "http://auth.localhost";
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || "test";
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || "rs-server";
const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || "your-secret";
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// JWKS pour vérification token Keycloak
const JWKS = createRemoteJWKSet(
  new URL(`${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`)
);

function log(...args) { console.log('[backend]', ...args); }

// ==================== Helpers ====================

// Vérifie un token JWT (user ou RPT)
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`
    });
    return payload;
  } catch (e) {
    log('Token invalid:', e.message);
    return null;
  }
}

// Cache du PAT pour éviter de requêter Keycloak à chaque appel
let cachedPAT = null;
let patExpiry = 0;

async function getPAT() {
  const now = Date.now();
  if (cachedPAT && now < patExpiry) {
    return cachedPAT;
  }
  log('Fetching new PAT...');
  const resp = await fetch(`${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  });
  const data = await resp.json();
  if (!data.access_token) {
    log('PAT fetch failed:', data);
    throw new Error('Cannot obtain PAT');
  }
  cachedPAT = data.access_token;
  patExpiry = now + (data.expires_in - 10) * 1000; // expiry minus 10s de sécurité
  log('PAT obtained, expires in', data.expires_in, 'seconds');
  return cachedPAT;
}

async function getKeycloakTicket(resourceId = 'prod-doc-1', scopes = ['view']) {
  const pat = await getPAT(); // utilise PAT du backend
  log('Requesting UMA ticket from Keycloak with backend PAT...');

  const resp = await fetch(`${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/authz/protection/permission`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${pat}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([{ resource_id: resourceId, resource_scopes: scopes }])
  });
  const data = await resp.json();
  log('Keycloak ticket response:', data);
  if (!data.ticket) throw new Error('Cannot obtain UMA ticket');
  return data.ticket;
}

// Échange ticket UMA → RPT avec PAT
async function exchangeTicketForRpt(ticket) {
  const pat = await getPAT();
  log('Exchanging ticket for RPT...');
  const resp = await fetch(`${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${pat}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      ticket,
      audience: CLIENT_ID
    })
  });
  const data = await resp.json();
  log('RPT exchange result:', data);
  if (!data.access_token) throw new Error('Cannot obtain RPT');
  return data.access_token;
}

// ==================== Routes ====================

// ---------- RESOURCE ENDPOINT ----------
app.get('/api/resource/:id', async (req, res) => {
  const resourceId = req.params.id;
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'missing_token' });

  const userToken = authHeader.split(' ')[1];
  const userPayload = await verifyToken(userToken);
  if (!userPayload) return res.status(401).json({ error: 'invalid_token' });

  try {
    const ticket = await getKeycloakTicket(resourceId, ['view']);
    const rpt = await exchangeTicketForRpt(ticket);

    log('RPT received:', rpt);

    // 4️⃣ Return dummy response
    return res.status(200).json({
      resource: resourceId,
    });
  } catch (err) {
    log('Access error', err);
    return res.status(500).json({ error: 'rpt_failed', error_description: err.message });
  }
});


// ==================== Start server ====================
app.listen(3000, () => log('Backend started on port 3000'));