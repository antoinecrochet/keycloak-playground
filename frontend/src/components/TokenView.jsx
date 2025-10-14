import React from 'react'
import { decodeJwt } from '../utils/decodeJwt'
import Button from './Button'

export default function TokenView({ label, token }){
  const decoded = decodeJwt(token)
  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{label}</h4>
        <div className="space-x-2">
          <Button onClick={()=>navigator.clipboard.writeText(token||'')}>Copy</Button>
        </div>
      </div>
      <pre className="text-xs bg-slate-50 p-3 rounded overflow-auto">{token || '—'}</pre>
      <div className="mt-3">
        <h5 className="font-medium">Decoded</h5>
        <pre className="text-xs bg-slate-50 p-3 rounded overflow-auto">{decoded ? JSON.stringify(decoded, null, 2) : '—'}</pre>
      </div>
    </div>
  )
}
