import React, { useEffect, useState } from 'react'

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch (e) {
    return null
  }
}

export default function RolesPermissions({ kc }) {
  const [realmRoles, setRealmRoles] = useState([])
  const [clientRoles, setClientRoles] = useState({})

  useEffect(() => {
    if (kc?.token) {
      const decodedToken = decodeToken(kc.token)

      const rr = decodedToken?.realm_access?.roles || []
      setRealmRoles(rr)

      // client roles
      const cr = decodedToken?.resource_access || {}
      setClientRoles(cr)
    } else {
      setRealmRoles([])
      setClientRoles({})
    }
  }, [kc])

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Roles & Permissions</h2>

      {!kc?.token && <p className="text-gray-500">Not authenticated</p>}

      {kc?.token && (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Realm Roles</h3>
            {realmRoles.length > 0 ? (
              <ul className="list-disc pl-6">
                {realmRoles.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No realm roles assigned</p>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-2">Client Roles</h3>
            {Object.keys(clientRoles).length > 0 ? (
              Object.entries(clientRoles).map(([client, access]) => (
                <div key={client} className="mb-2">
                  <h4 className="text-sm font-semibold">{client}</h4>
                  <ul className="list-disc pl-6">
                    {access.roles.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No client roles assigned</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
