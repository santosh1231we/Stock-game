"use client"
import { useEffect, useMemo, useState } from "react"
import { loadState, SimState } from "@/lib/sim"

export default function AccountOverviewPage() {
  const [state, setState] = useState<SimState | null>(null)

  useEffect(() => {
    setState(loadState())
  }, [])

  const totalInvested = useMemo(() => {
    if (!state) return 0
    return state.portfolio.reduce((sum, h) => sum + h.avgPrice * h.qty, 0)
  }, [state])

  const trades = useMemo(() => state?.txns.filter((t) => t.type !== "SALARY")?.length ?? 0, [state])

  if (!state) return null

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 p-6">
        <div className="mb-2 text-sm text-zinc-400">Account Stats</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <div className="text-zinc-400 text-sm">Current Balance</div>
            <div className="text-2xl font-bold">₹{state.balance.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-zinc-400 text-sm">Total Invested</div>
            <div className="text-2xl font-bold">₹{totalInvested.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-zinc-400 text-sm">Number of Trades</div>
            <div className="text-2xl font-bold">{trades}</div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 p-6">
        <div className="mb-2 text-sm text-zinc-400">Recent Transactions</div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {state.txns.slice(0, 10).map((t) => (
            <div key={t.id} className="rounded-xl bg-zinc-950 p-3 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">{t.type}</span>
                <span className={t.amount >= 0 ? "text-emerald-400" : "text-red-400"}>
                  {t.amount >= 0 ? "+" : ""}₹{Math.abs(t.amount).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-zinc-500">
                {t.symbol ? `${t.symbol} • ${t.qty} @ ${t.price?.toFixed(2)}` : "Salary credit"}
              </div>
              <div className="text-[10px] text-zinc-600">{new Date(t.ts).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


