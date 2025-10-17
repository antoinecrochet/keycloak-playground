import React from 'react'
import pkg from '../../package.json'

export default function AboutPage() {
  const appVersion = pkg.version
  const keycloakVersion = pkg.dependencies['keycloak-js']

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">About</h2>
      <div className="p-4 bg-white shadow rounded">
        <div className="space-y-3 text-sm">
          <p>
            <strong>Application version:</strong> {appVersion}
          </p>
          <p>
            <strong>Keycloak JS client version:</strong> {keycloakVersion}
          </p>
          <p>
            This project is available on{' '}
            <a
              href="https://github.com/antoinecrochet/keycloak-playground"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline hover:text-indigo-800"
            >
              https://github.com/antoinecrochet/keycloak-playground
            </a>{' '}
            under the <strong>MIT License</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
