import UmaPlayground from '../components/UmaPlayground'

export default function UmaPlaygroundPage({ kc, apiBase }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">User-Managed Access Playground</h2>
      <UmaPlayground kc={kc} apiBase={apiBase} />
    </div>
  )
}
