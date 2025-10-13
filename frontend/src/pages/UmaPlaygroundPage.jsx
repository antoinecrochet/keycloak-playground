import UmaPlayground from '../components/UmaPlayground'

export default function UmaPlaygroundPage({ kc, apiBase }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">UMA Playground</h2>
      <UmaPlayground kc={kc} apiBase={apiBase} />
    </div>
  )
}
