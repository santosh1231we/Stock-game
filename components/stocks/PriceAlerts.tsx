"use client"
import { useEffect, useMemo, useState } from "react"

type Alert = { symbol: string; above?: number; below?: number; enabled: boolean }

const STORAGE_KEY = "investlife-price-alerts"

function loadAlerts(): Alert[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Alert[]) : []
  } catch {
    return []
  }
}

function saveAlerts(alerts: Alert[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
  } catch {}
}

export default function PriceAlerts({ symbol }: { symbol: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [above, setAbove] = useState<string>("")
  const [below, setBelow] = useState<string>("")
  const [price, setPrice] = useState<number | null>(null)
  const [status, setStatus] = useState<string>("")

  useEffect(() => {
    setAlerts(loadAlerts())
  }, [])

  const myAlert = useMemo(() => alerts.find((a) => a.symbol === symbol), [alerts, symbol])

  useEffect(() => {
    let on = true
    const poll = async () => {
      try {
        const res = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`, { cache: "no-store" })
        if (!on) return
        if (!res.ok) return
        const q = await res.json()
        const p = Number(q.regularMarketPrice)
        setPrice(p)
        const a = alerts.find((al) => al.symbol === symbol && al.enabled)
        if (a && !Number.isNaN(p)) {
          if (a.above != null && p >= a.above) setStatus(`Alert: ${symbol} crossed above ${a.above}`)
          if (a.below != null && p <= a.below) setStatus(`Alert: ${symbol} fell below ${a.below}`)
        }
      } catch {}
    }
    poll()
    const id = setInterval(poll, 10000)
    return () => {
      on = false
      clearInterval(id)
    }
  }, [symbol, alerts])

  const save = () => {
    const next: Alert = {
      symbol,
      above: above ? Number(above) : undefined,
      below: below ? Number(below) : undefined,
      enabled: true,
    }
    const others = alerts.filter((a) => a.symbol !== symbol)
    const updated = [...others, next]
    setAlerts(updated)
    saveAlerts(updated)
    setStatus("Alert saved")
  }

  const toggle = (enabled: boolean) => {
    const updated = alerts.map((a) => (a.symbol === symbol ? { ...a, enabled } : a))
    setAlerts(updated)
    saveAlerts(updated)
  }

  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <div className="mb-2 text-sm font-semibold">Price Alerts</div>
      <div className="text-xs text-zinc-500">{symbol} {price != null ? `@ ${price.toFixed(2)}` : ""}</div>
      <div className="mt-3 flex flex-wrap items-end gap-3 text-sm">
        <input
          value={above}
          onChange={(e) => setAbove(e.target.value)}
          placeholder="Alert above"
          className="w-36 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-emerald-500"
        />
        <input
          value={below}
          onChange={(e) => setBelow(e.target.value)}
          placeholder="Alert below"
          className="w-36 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-emerald-500"
        />
        <button onClick={save} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400">
          Save
        </button>
        {myAlert && (
          <button
            onClick={() => toggle(!myAlert.enabled)}
            className="rounded-xl border border-zinc-800 px-4 py-2"
          >
            {myAlert.enabled ? "Disable" : "Enable"}
          </button>
        )}
      </div>
      {myAlert && (
        <div className="mt-2 text-xs text-zinc-400">
          Active: {myAlert.enabled ? "Yes" : "No"} · Above: {myAlert.above ?? "—"} · Below: {myAlert.below ?? "—"}
        </div>
      )}
      {status && <div className="mt-2 text-xs text-emerald-400">{status}</div>}
    </div>
  )}


