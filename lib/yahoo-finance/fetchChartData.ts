import { unstable_noStore as noStore } from "next/cache"
import type { Interval, Range } from "@/types/yahoo-finance"
import { DEFAULT_RANGE, INTERVALS_FOR_RANGE, VALID_RANGES } from "./constants"

export const validateRange = (range: string): Range =>
  VALID_RANGES.includes(range as Range) ? (range as Range) : DEFAULT_RANGE

export const validateInterval = (range: Range, interval: Interval): Interval =>
  INTERVALS_FOR_RANGE[range].includes(interval)
    ? interval
    : INTERVALS_FOR_RANGE[range][0]

export async function fetchChartData(
  ticker: string,
  range: Range,
  interval: Interval
) {
  noStore()

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      ticker
    )}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) throw new Error(`Yahoo chart upstream error: ${res.status}`)
    const data = await res.json()

    if (!data?.chart || data.chart.error) {
      throw new Error(data?.chart?.error?.description || "Invalid chart response")
    }

    const result = data.chart.result?.[0]
    if (!result) throw new Error("No chart result")

    const timestamps: number[] = (result.timestamp || []).map((ts: number) => ts * 1000)
    const quote = result.indicators?.quote?.[0] || {}

    const quotes = timestamps.map((time: number, i: number) => ({
      date: time,
      open: quote.open?.[i] ?? null,
      high: quote.high?.[i] ?? null,
      low: quote.low?.[i] ?? null,
      close: quote.close?.[i] ?? null,
      volume: quote.volume?.[i] ?? null,
    }))

    return {
      meta: result.meta,
      quotes,
    }
  } catch (error) {
    console.log("Failed to fetch chart data", error)
    throw new Error("Failed to fetch chart data.")
  }
}
