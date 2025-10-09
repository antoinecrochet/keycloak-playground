import React, { useEffect, useState } from 'react'
import Keycloak from 'keycloak-js';
import TokenView from './components/TokenView'
import UserInfo from './components/UserInfo'
import UmaPlayground from './components/UmaPlayground'

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'http://auth.localhost'
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || 'test'
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'js-client'
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export default function App() {
  const [kc, setKc] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const kc = new Keycloak({
      url: KEYCLOAK_URL,
      realm: KEYCLOAK_REALM,
      clientId: KEYCLOAK_CLIENT_ID
    });

    kc.init({ onLoad: 'check-sso', pkceMethod: 'S256', checkLoginIframe: false })
      .then(auth => {
        setKc(kc)
        setAuthenticated(!!auth)
        if (auth) {
          kc.loadUserInfo().then(ui => setUserInfo(ui)).catch(() => { })
          // auto refresh token
          setInterval(() => { kc.updateToken(30).catch(() => { }); }, 50000)
        }
      }).catch(err => {
        console.error('kc init error', err)
      })
  }, [])

  async function handleLogin() { kc?.login() }
  async function handleLogout() { kc?.logout() }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <header className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Keycloak UMA Dashboard</h1>
          <div>
            <span className={'px-3 py-1 rounded text-sm ' + (authenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
              {authenticated ? 'Authenticated' : 'Not authenticated'}
            </span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleLogin} className="px-3 py-1 bg-indigo-600 text-white rounded">Login</button>
          <button onClick={handleLogout} className="px-3 py-1 border rounded">Logout</button>
          <button onClick={() => kc && kc.updateToken(5).then(() => setKc({ ...kc })).catch(() => { })} className="px-3 py-1 border rounded">Refresh token</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <TokenView label="Access Token" token={kc?.token} />
          <TokenView label="ID Token" token={kc?.idToken} />
        </div>

        <UserInfo info={userInfo} />

        <UmaPlayground kc={kc} apiBase={API_BASE} />
      </main>
    </div>
  )
}
