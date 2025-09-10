"use client"
import { useEffect, useMemo, useState } from "react"
import { loadState, SimState } from "@/lib/sim"

export default function PublicPortfolioPage() {
  const [state, setState] = useState<SimState | null>(null)

  useEffect(() => {
    setState(loadState())
  }, [])

  const netWorth = useMemo(() => {
    if (!state) return 0
    const invested = state.portfolio.reduce((sum, h) => sum + h.avgPrice * h.qty, 0)
    return state.balance + invested
  }, [state])

  if (!state) return null

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 p-6">
        <div className="mb-2 text-sm text-zinc-400">Public Profile Card</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">{state.user.name}</div>
            <div className="text-sm text-zinc-500">Location hidden</div>
          </div>
          <div className="rounded-xl bg-zinc-950 p-3 text-right">
            <div className="text-xs text-zinc-500">Net Worth</div>
            <div className="text-2xl font-bold">₹{netWorth.toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 p-6">
        <div className="mb-2 text-sm text-zinc-400">Key Holdings Snapshot</div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {state.portfolio.length === 0 && (
            <div className="text-sm text-zinc-500">No holdings yet.</div>
          )}
          {state.portfolio.map((h) => (
            <div key={h.symbol} className="flex items-center justify-between rounded-xl bg-zinc-950 px-3 py-2">
              <div className="font-semibold">{h.symbol}</div>
              <div className="text-sm text-zinc-500">Qty {h.qty} • Avg ₹{h.avgPrice.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


