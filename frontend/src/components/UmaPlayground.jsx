import React, { useState } from 'react'
import Button from './Button'

export default function UmaPlayground({ kc, apiBase }) {
  const [reply, setReply] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState(`${apiBase}/api/resource/prod-doc-1`)

  async function callResource() {
    setLoading(true)
    setReply(null)
    try {
      if (!url.startsWith(apiBase)) {
        setReply({ error: 'URL must start with ' + apiBase })
        setLoading(false)
        return
      }
      if (!kc?.token) {
        setReply({ error: 'Not authenticated' })
        setLoading(false)
        return
      }

      const resp = await fetch(url, { method, headers: { Authorization: 'Bearer ' + kc.token } })
      const text = await resp.text()
      let parsed
      try { parsed = JSON.parse(text) } catch { parsed = text }
      setReply({ status: resp.status, body: parsed })
    } catch (e) {
      setReply({ error: String(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-white shadow rounded relative">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold">User-Managed Access Playground</h4>
          <div className="text-sm text-slate-500">Backend handles ticket/RPT</div>
        </div>
        <Button
          onClick={() => setShowHelp(true)}
          variant="secondary"
          className="text-xs"
        >
          📘 What is UMA?
        </Button>
      </div>

      <div className="space-x-2 mb-4 flex items-center">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border rounded text-sm bg-slate-50 px-2 py-1"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="px-2 py-1 border rounded text-sm bg-slate-50 flex-grow"
        />

        <Button onClick={callResource} disabled={loading}>
          {loading ? 'Calling…' : 'Call Protected Resource'}
        </Button>
      </div>

      <div>
        <h5 className="font-medium">Backend reply</h5>
        <pre className="text-xs bg-slate-50 p-3 rounded h-56 overflow-auto">
          {reply ? JSON.stringify(reply, null, 2) : '—'}
        </pre>
      </div>

      {showHelp && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"  // ⬅ fixed + z-50
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">ℹ️ What is UMA?</h3>
            <p className="text-sm text-gray-700 mb-4">
              UMA (User-Managed Access) is an OAuth2 extension that delegates authorization
              decisions to an external authorization server (here: Keycloak).
              Instead of hardcoding permissions into your backend, you define resources, scopes,
              policies, and permissions in Keycloak. The server just needs to request and validate UMA tickets and RPT tokens.
            </p>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">✅ Advantages</h4>
              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                <li>No backend redeploy needed when access rules change.</li>
                <li>Centralized authorization across multiple apps.</li>
                <li>Clear separation between authentication and authorization.</li>
                <li>Flexible, dynamic access control using scopes and policies.</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">⚠️ Considerations</h4>
              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                <li>More complex than simple RBAC or hardcoded checks.</li>
                <li>Requires proper Keycloak configuration (resources, policies, scopes).</li>
                <li>Debugging access issues can be trickier.</li>
              </ul>
            </div>

            <div className="mb-4 text-sm">
              📚 Official docs:{' '}
              <a
                href="https://www.keycloak.org/docs/latest/authorization_services/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Keycloak UMA Documentation
              </a>
            </div>

            <div className="text-right">
              <button
                onClick={() => setShowHelp(false)}
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
