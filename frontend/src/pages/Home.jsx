import TokenView from '../components/TokenView'

export default function Home({ kc }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Tokens</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TokenView label="Access Token" token={kc?.token} />
        <TokenView label="ID Token" token={kc?.idToken} />
      </div>
    </div>
  )
}