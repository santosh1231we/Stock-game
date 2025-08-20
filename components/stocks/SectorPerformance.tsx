import { cn } from "@/lib/utils"
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote"

type SectorTicker = {
  sector: string
  symbol: string
}

const sectorEtfs: SectorTicker[] = [
  { sector: "Communication Services", symbol: "XLC" },
  { sector: "Consumer Discretionary", symbol: "XLY" },
  { sector: "Consumer Staples", symbol: "XLP" },
  { sector: "Energy", symbol: "XLE" },
  { sector: "Financials", symbol: "XLF" },
  { sector: "Health Care", symbol: "XLV" },
  { sector: "Industrials", symbol: "XLI" },
  { sector: "Materials", symbol: "XLB" },
  { sector: "Real Estate", symbol: "XLRE" },
  { sector: "Technology", symbol: "XLK" },
  { sector: "Utilities", symbol: "XLU" },
]

export default async function SectorPerformance() {
  const quotes = await Promise.all(
    sectorEtfs.map(async ({ sector, symbol }) => {
      const q = await fetchQuote(symbol)
      return {
        sector,
        changesPercentage: q.regularMarketChangePercent ?? 0,
      }
    })
  )

  if (!quotes || quotes.length === 0) {
    return null
  }

  const averageChange =
    quotes.reduce((total, s) => total + (s.changesPercentage || 0), 0) /
    quotes.length

  const data = [
    { sector: "All sectors", changesPercentage: averageChange },
    ...quotes,
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {data.map((sector) => (
        <div
          key={sector.sector}
          className="flex w-full flex-row items-center justify-between text-sm"
        >
          <span className="font-medium">{sector.sector}</span>
          <span
            className={cn(
              "w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right transition-colors",
              (sector.changesPercentage || 0) > 0
                ? "bg-gradient-to-l from-green-300 text-green-800 dark:from-green-950 dark:text-green-400"
                : "bg-gradient-to-l from-red-300 text-red-800 dark:from-red-950 dark:text-red-500"
            )}
          >
            {Number(sector.changesPercentage || 0).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  )
}
