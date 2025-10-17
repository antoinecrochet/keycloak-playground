import RolesPermissions from '../components/RolesPermissions'

export default function RolesPermissionsPage({ kc }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Roles & Permissions</h2>
      <RolesPermissions kc={kc} />
    </div>
  )
}