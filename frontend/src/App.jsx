import React, { useEffect, useState } from 'react'
import Keycloak from 'keycloak-js';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'

import Home from './pages/Home'
import UserInfoPage from './pages/UserInfoPage'
import UmaPlaygroundPage from './pages/UmaPlaygroundPage'
import RolesPermissionsPage from './pages/RolesPermissionsPage'
import AboutPage from './pages/AboutPage'
import Button from './components/Button'

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
    <Router>
      <div className="min-h-screen p-6 bg-gray-100">
        <header className="max-w-5xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Keycloak Playground</h1>
            <span className={`px-3 py-1 rounded text-sm ${authenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {authenticated ? 'Authenticated' : 'Not authenticated'}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-2">
            <nav className="flex gap-4">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `pb-1 ${isActive ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'}`
                }
              >
                Tokens
              </NavLink>
              <NavLink
                to="/userinfo"
                className={({ isActive }) =>
                  `pb-1 ${isActive ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'}`
                }
              >
                User Info
              </NavLink>
              <NavLink
                to="/roles"
                className={({ isActive }) =>
                  `pb-1 ${isActive ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'}`
                }
              >
                Roles & Permissions
              </NavLink>
              <NavLink
                to="/uma"
                className={({ isActive }) =>
                  `pb-1 ${isActive ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'}`
                }
              >
                UMA Playground
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `pb-1 ${isActive ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'}`
                }
              >
                About
              </NavLink>
            </nav>

            <div className="flex gap-2">
              {!authenticated && <Button onClick={() => kc?.login()}>Login</Button>}
              {authenticated && (
                <>
                  <Button onClick={() => kc?.logout()}>Logout</Button>
                  <Button variant="secondary" onClick={() => kc?.updateToken(5)}>Refresh Token</Button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto space-y-6">
          <Routes>
            <Route path="/" element={<Home kc={kc} />} />
            <Route path="/userinfo" element={<UserInfoPage userInfo={userInfo} />} />
            <Route path="/roles" element={<RolesPermissionsPage kc={kc} />} />
            <Route path="/uma" element={<UmaPlaygroundPage kc={kc} apiBase={API_BASE} />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
