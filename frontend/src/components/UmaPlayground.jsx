import React, { useState } from 'react'
import Button from './Button'

export default function UmaPlayground({ kc, apiBase }) {
  const [reply, setReply] = useState(null)
  const [loading, setLoading] = useState(false)

  async function callResource() {
    setLoading(true)
    setReply(null)
    try {
      const method = document.getElementById('http-method').value
      const url = document.getElementById('resource-url').value
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
      // call backend which handles UMA server-side
      const resp = await fetch(url, { method, headers: { Authorization: 'Bearer ' + (kc?.token || '') } })
      const text = await resp.text()
      let parsed = null
      try { parsed = JSON.parse(text) } catch (e) { parsed = text }
      setReply({ status: resp.status, body: parsed })
    } catch (e) {
      setReply({ error: String(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">UMA Playground</h4>
        <div className="text-sm text-slate-500">Backend handles ticket/RPT</div>
      </div>

      <div className="space-x-2 mb-4" style={{ display: 'flex', alignItems: 'center' }}>
        <select id="http-method" className="border rounded text-sm bg-slate-50 px-2 py-1" defaultValue="GET">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input id="resource-url" type="text" defaultValue={apiBase + '/api/resource/prod-doc-1'} className="px-2 py-1 border rounded text-sm bg-slate-50" style={{ flexGrow: 1 }} />
        <Button onClick={callResource} disabled={loading}>
          {loading ? 'Calling…' : 'Call Protected Resource'}
        </Button>
      </div>

      <div>
        <h5 className="font-medium">Backend reply</h5>
        <pre className="text-xs bg-slate-50 p-3 rounded h-56 overflow-auto">{reply ? JSON.stringify(reply, null, 2) : '—'}</pre>
      </div>
    </div>
  )
}
