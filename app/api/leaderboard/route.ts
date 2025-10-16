import { NextResponse } from "next/server"
import { fetchScreenerStocks } from "@/lib/yahoo-finance/fetchScreenerStocks"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const period = (searchParams.get("period") || "all").toLowerCase()
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 50)))
  // Temporarily: use Yahoo Finance top movers as recommendations proxy
  if (searchParams.get("as") === "recommendations") {
    try {
      const [gainers, losers, actives] = await Promise.all([
        fetchScreenerStocks("DAY_GAINERS", 15),
        fetchScreenerStocks("DAY_LOSERS", 15),
        fetchScreenerStocks("MOST_ACTIVES", 20),
      ])
      const G: any[] = (gainers?.quotes || [])
      const L: any[] = (losers?.quotes || [])
      const A: any[] = (actives?.quotes || [])
      const neutralPool = A.filter((q: any) => Math.abs(q?.regularMarketChangePercent || 0) < 1.5)
      const picks = [
        ...G.slice(0, 1).map((q: any) => ({ type: 'gainer', symbol: q.symbol, name: q.shortName, changePct: q.regularMarketChangePercent })),
        ...L.slice(0, 1).map((q: any) => ({ type: 'loser', symbol: q.symbol, name: q.shortName, changePct: q.regularMarketChangePercent })),
        ...neutralPool.slice(0, 2).map((q: any) => ({ type: 'neutral', symbol: q.symbol, name: q.shortName, changePct: q.regularMarketChangePercent })),
      ].slice(0, 4)
      // Fallbacks if any bucket is empty
      while (picks.length < 4 && G.length) picks.push({ type: 'gainer', symbol: G.shift().symbol, name: G[0]?.shortName, changePct: G[0]?.regularMarketChangePercent })
      while (picks.length < 4 && L.length) picks.push({ type: 'loser', symbol: L.shift().symbol, name: L[0]?.shortName, changePct: L[0]?.regularMarketChangePercent })
      while (picks.length < 4 && A.length) picks.push({ type: 'neutral', symbol: A.shift().symbol, name: A[0]?.shortName, changePct: A[0]?.regularMarketChangePercent })
      return NextResponse.json({ items: picks })
    } catch (e: any) {
      return NextResponse.json({ items: [] })
    }
  }
  // Temporarily disabled leaderboard while Firebase is removed
  return NextResponse.json({ period, items: [] })
}


