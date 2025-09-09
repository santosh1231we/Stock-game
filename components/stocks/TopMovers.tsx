import { fetchScreenerStocks } from "@/lib/yahoo-finance/fetchScreenerStocks"

type Item = { symbol: string; shortName?: string; regularMarketChangePercent?: number }

export default async function TopMovers() {
  const [gainers, losers] = await Promise.all([
    fetchScreenerStocks("DAY_GAINERS", 5),
    fetchScreenerStocks("DAY_LOSERS", 5),
  ])

  const G = (gainers?.quotes || []) as Item[]
  const L = (losers?.quotes || []) as Item[]

  if (G.length === 0 && L.length === 0) return null

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-zinc-800 p-4">
        <div className="mb-2 text-xs font-semibold uppercase text-emerald-400">Top Gainers</div>
        <div className="space-y-2">
          {G.map((q) => (
            <div key={q.symbol} className="flex items-center justify-between text-sm">
              <div className="truncate">
                <span className="font-semibold">{q.symbol}</span>
                {q.shortName ? <span className="ml-2 text-zinc-500">{q.shortName}</span> : null}
              </div>
              <div className="rounded-md bg-emerald-950 px-2 py-0.5 text-emerald-400">
                +{Number(q.regularMarketChangePercent || 0).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 p-4">
        <div className="mb-2 text-xs font-semibold uppercase text-red-400">Top Losers</div>
        <div className="space-y-2">
          {L.map((q) => (
            <div key={q.symbol} className="flex items-center justify-between text-sm">
              <div className="truncate">
                <span className="font-semibold">{q.symbol}</span>
                {q.shortName ? <span className="ml-2 text-zinc-500">{q.shortName}</span> : null}
              </div>
              <div className="rounded-md bg-red-950 px-2 py-0.5 text-red-400">
                {Number(q.regularMarketChangePercent || 0).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


