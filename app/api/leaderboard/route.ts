import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const period = (searchParams.get("period") || "all").toLowerCase()
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 50)))
  // Temporarily: use Yahoo Finance top movers as recommendations proxy
  if (searchParams.get("as") === "recommendations") {
    try {
      const [gainersRes, losersRes] = await Promise.all([
        fetch(`https://query2.finance.yahoo.com/screener/predefined/saved?scrIds=DAY_GAINERS&count=6&lang=en-US&region=US`, { cache: 'no-store' }),
        fetch(`https://query2.finance.yahoo.com/screener/predefined/saved?scrIds=DAY_LOSERS&count=6&lang=en-US&region=US`, { cache: 'no-store' }),
      ])
      const [gainersJson, losersJson] = await Promise.all([gainersRes.json(), losersRes.json()])
      const G = (gainersJson?.finance?.result?.[0]?.quotes || []).slice(0, 6)
      const L = (losersJson?.finance?.result?.[0]?.quotes || []).slice(0, 6)
      const picks = [
        ...G.slice(0, 2).map((q: any) => ({ type: 'gainer', symbol: q.symbol, name: q.shortName, changePct: q.regularMarketChangePercent })),
        ...L.slice(0, 2).map((q: any) => ({ type: 'loser', symbol: q.symbol, name: q.shortName, changePct: q.regularMarketChangePercent })),
        ...[...G.slice(2, 5), ...L.slice(2, 5)].slice(0, 4).map((q: any) => ({ type: 'neutral', symbol: q.symbol, name: q.shortName, changePct: q.regularMarketChangePercent })),
      ]
      return NextResponse.json({ items: picks })
    } catch (e: any) {
      return NextResponse.json({ items: [] })
    }
  }
  // Temporarily disabled leaderboard while Firebase is removed
  return NextResponse.json({ period, items: [] })
}


