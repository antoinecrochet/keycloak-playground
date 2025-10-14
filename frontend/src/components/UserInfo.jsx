import React from 'react'

export default function UserInfo({ info }){
  return (
    <div className="p-4 bg-white shadow rounded">
      <h4 className="font-semibold mb-2">User Info</h4>
      <pre className="text-xs bg-slate-50 p-3 rounded overflow-auto">{info ? JSON.stringify(info, null, 2) : '—'}</pre>
    </div>
  )
}
