import React, { useState } from 'react'

export default function UmaPlayground({ kc, apiBase }){
  const [reply, setReply] = useState(null)
  const [loading, setLoading] = useState(false)

  async function callResource(){
    setLoading(true)
    setReply(null)
    try {
      const url = apiBase + '/api/resource/prod-doc-1'
      // call backend which handles UMA server-side
      const resp = await fetch(url, { headers: { Authorization: 'Bearer ' + (kc?.token || '') } })
      const text = await resp.text()
      let parsed = null
      try { parsed = JSON.parse(text) } catch(e){ parsed = text }
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

      <div className="space-x-2 mb-4">
        <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={callResource} disabled={loading}>
          {loading ? 'Calling…' : 'Call Protected Resource'}
        </button>
      </div>

      <div>
        <h5 className="font-medium">Backend reply</h5>
        <pre className="text-xs bg-slate-50 p-3 rounded h-56 overflow-auto">{reply ? JSON.stringify(reply, null, 2) : '—'}</pre>
      </div>
    </div>
  )
}
