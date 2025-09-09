import { unstable_noStore as noStore } from "next/cache"

const ITEMS_PER_PAGE = 40

export async function fetchScreenerStocks(query: string, count?: number) {
  noStore()
  const scrIds = encodeURIComponent(query)
  const cnt = encodeURIComponent(String(count ?? ITEMS_PER_PAGE))

  try {
    // Try query2 first
    const url2 = `https://query2.finance.yahoo.com/screener/predefined/saved?scrIds=${scrIds}&count=${cnt}&lang=en-US&region=US`
    let res = await fetch(url2, { cache: "no-store" })
    if (!res.ok) {
      // Fallback to query1
      const url1 = `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=${scrIds}&count=${cnt}&lang=en-US&region=US`
      res = await fetch(url1, { cache: "no-store" })
    }
    if (!res.ok) throw new Error(`screener upstream ${res.status}`)
    const data = await res.json()
    const quotes = data?.finance?.result?.[0]?.quotes || data?.quotes || []
    return { quotes }
  } catch (error) {
    console.log("Failed to fetch screener stocks", error)
    // Graceful fallback to avoid crashing the page
    return { quotes: [] as any[] }
  }
}
