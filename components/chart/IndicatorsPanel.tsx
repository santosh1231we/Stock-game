"use client"
import { useEffect, useMemo, useState } from "react"

type QuotePoint = { date: number; close: number | null }

function computeRSI(points: QuotePoint[], period: number = 14): number | null {
  const closes = points.map((p) => (p.close ?? 0))
  if (closes.length <= period) return null
  let gains = 0
  let losses = 0
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1]
    if (diff >= 0) gains += diff
    else losses += -diff
  }
  const avgGain = gains / period
  const avgLoss = losses / period
  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

function computeMACD(points: QuotePoint[]) {
  const closes = points.map((p) => (p.close ?? 0))
  const ema = (period: number) => {
    const k = 2 / (period + 1)
    let prev = closes[0]
    return closes.map((c) => (prev = c * k + prev * (1 - k)))
  }
  const ema12 = ema(12)
  const ema26 = ema(26)
  const macdLine = ema12.map((v, i) => v - ema26[i])
  const signalLine = (() => {
    const k = 2 / (9 + 1)
    let prev = macdLine[0]
    return macdLine.map((m) => (prev = m * k + prev * (1 - k)))
  })()
  const histogram = macdLine.map((m, i) => m - signalLine[i])
  const last = macdLine.length - 1
  return { macd: macdLine[last], signal: signalLine[last], histogram: histogram[last] }
}

export default function IndicatorsPanel({ symbol }: { symbol: string }) {
  const [points, setPoints] = useState<QuotePoint[]>([])

  useEffect(() => {
    let on = true
    ;(async () => {
      try {
        const res = await fetch(`/api/chart?symbol=${encodeURIComponent(symbol)}&range=3m&interval=1d`, { cache: "no-store" })
        if (!on) return
        const json = await res.json()
        const p = (json.points || []).map((d: any) => ({ date: d.t, close: d.c }))
        setPoints(p)
      } catch {}
    })()
    return () => {
      on = false
    }
  }, [symbol])

  const rsi = useMemo(() => computeRSI(points) ?? null, [points])
  const macd = useMemo(() => (points.length ? computeMACD(points) : null), [points])

  return (
    <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-400">
      {rsi !== null && (
        <div className="rounded-xl border border-zinc-800 px-3 py-2">
          <span className="mr-2 font-semibold text-zinc-200">RSI</span>
          <span className={rsi > 70 ? "text-red-400" : rsi < 30 ? "text-emerald-400" : ""}>{rsi.toFixed(2)}</span>
        </div>
      )}
      {macd && (
        <div className="rounded-xl border border-zinc-800 px-3 py-2">
          <span className="mr-2 font-semibold text-zinc-200">MACD</span>
          <span className={macd.histogram > 0 ? "text-emerald-400" : "text-red-400"}>
            {macd.macd.toFixed(2)} / {macd.signal.toFixed(2)} ({macd.histogram.toFixed(2)})
          </span>
        </div>
      )}
    </div>
  )
}


