"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadState, SimState, advanceActive } from "@/lib/sim";

type QuoteLite = { symbol: string; regularMarketPrice?: number; regularMarketChangePercent?: number };

export default function ClientDashboard() {
  const [state, setState] = useState<SimState | null>(null);
  const router = useRouter();
  const [symbol, setSymbol] = useState("AAPL");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<{ symbol: string; name: string; exchange?: string; type?: string }[]>([]);
  const [chart, setChart] = useState<{ t: string; c: number }[] | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  // dashboard no longer fetches individual quotes; detailed view on stock page

  useEffect(() => {
    let on = true;
    const q = search.trim();
    if (q.length === 0) {
      setSuggestions([]);
      return;
    }
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (!on) return;
        if (!res.ok) return setSuggestions([]);
        const json = (await res.json()) as { results: any[] };
        setSuggestions((json.results || []) as any);
      } catch {
        if (!on) return;
        setSuggestions([]);
      }
    })();
    return () => {
      on = false;
      ctrl.abort();
    };
  }, [search]);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const res = await fetch(`/api/chart?symbol=${encodeURIComponent(symbol)}&range=1m&interval=1d`);
        if (!on) return;
        if (!res.ok) return setChart(null);
        const json = (await res.json()) as { points: { t: string; c: number }[] };
        setChart(json.points);
      } catch {
        if (!on) return;
        setChart(null);
      }
    })();
    return () => {
      on = false;
    };
  }, [symbol]);

  const lastTickRef = useRef<number | null>(null);
  useEffect(() => {
    let on = true;
    const tick = () => {
      if (!on) return;
      const now = Date.now();
      const last = lastTickRef.current ?? now;
      lastTickRef.current = now;
      const visible = document.visibilityState === "visible";
      if (visible) {
        const { state: s, credits } = advanceActive(now - last);
        setState({ ...s });
        if (credits > 0) {
          // fire a lightweight toast via custom event
          window.dispatchEvent(new CustomEvent("investlife-salary", { detail: { credits } }));
        }
      }
      requestAnimationFrame(tick);
    };
    lastTickRef.current = Date.now();
    const id = requestAnimationFrame(tick);
    return () => {
      on = false;
      cancelAnimationFrame(id);
    };
  }, []);

  const nextPayoutSeconds = useMemo(() => {
    if (!state) return 0;
    const ms = Math.max(0, state.remainingActiveMs ?? 0);
    return Math.floor(ms / 1000);
  }, [state]);
  
  // trading moved to per-stock page

  const portfolioValue = useMemo(() => {
    if (!state) return 0;
    const lastClose = chart && chart.length > 0 ? chart[chart.length - 1].c : undefined;
    return state.portfolio.reduce((sum, h) => {
      const price = h.symbol === symbol && lastClose !== undefined ? lastClose : h.avgPrice;
      return sum + price * h.qty;
    }, 0);
  }, [state, chart, symbol]);

  if (!state) return null;

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Finly Dashboard <span className="ml-2 rounded-xl bg-zinc-900 px-3 py-1 text-sm text-zinc-400">Season: Earn. Invest. Flex.</span>
          </h1>
          <div className="text-sm text-zinc-400">Every 1 hour = 1 month</div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 p-4">
            <div className="text-zinc-400 text-sm">Cash Balance</div>
            <div className="mt-1 text-3xl font-extrabold">₹{state.balance.toLocaleString()}</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 p-4">
            <div className="text-zinc-400 text-sm">Monthly Income</div>
            <div className="mt-1 text-3xl font-extrabold">₹{state.monthlyIncome.toLocaleString()}</div>
            <div className="mt-2 text-xs text-zinc-400">Next payout in {Math.floor(nextPayoutSeconds / 60)}m {nextPayoutSeconds % 60}s (active time)</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 p-4">
            <div className="text-zinc-400 text-sm">Portfolio (rough)</div>
            <div className="mt-1 text-3xl font-extrabold">₹{portfolioValue.toLocaleString()}</div>
            <div className="mt-2 text-xs text-zinc-500">We’ll fetch all quotes later for exact value.</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 p-4 lg:col-span-2">
            <div className="flex items-start gap-3">
              <div className="relative w-80">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-emerald-500"
                  placeholder="Search ticker or company"
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-zinc-800 bg-black">
                    {suggestions.map((s) => (
                      <button
                        key={s.symbol}
                        onClick={() => {
                          setSymbol(s.symbol);
                          setSearch("");
                          setSuggestions([]);
                          router.push(`/stocks/${s.symbol}`);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-zinc-900"
                      >
                        <span className="font-medium">{s.name}</span>
                        <span className="text-xs text-zinc-500">{s.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => search.trim() && suggestions[0] && router.push(`/stocks/${suggestions[0].symbol}`)}
                className="rounded-xl border border-zinc-800 px-4 py-2"
              >
                Go
              </button>
            </div>
            <div className="mt-4 text-sm text-zinc-400">Search and select a ticker to view detailed chart and trade.</div>

            {chart && chart.length > 2 && (
              <div className="mt-4 h-40 w-full overflow-hidden rounded-xl border border-zinc-800">
                <svg viewBox={`0 0 400 160`} className="h-full w-full">
                  <defs>
                    <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {(() => {
                    const xs = chart.map((_, i) => (i / (chart.length - 1)) * 380 + 10);
                    const ys = chart.map((p) => 150 - ((p.c - Math.min(...chart.map((d) => d.c))) / (Math.max(...chart.map((d) => d.c)) - Math.min(...chart.map((d) => d.c)) || 1)) * 140);
                    const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
                    const area = `M10,150 ${xs.map((x, i) => `L${x},${ys[i]}`).join(" ")} L390,150 Z`;
                    return (
                      <g>
                        <path d={area} fill="url(#g)" />
                        <path d={d} fill="none" stroke="#10b981" strokeWidth={2} />
                      </g>
                    );
                  })()}
                </svg>
              </div>
            )}

            {/* Trading UI removed from dashboard */}
          </div>

          <div className="rounded-2xl border border-zinc-800 p-4">
            <div className="mb-2 font-semibold">Holdings</div>
            <div className="space-y-2">
              {state.portfolio.length === 0 && (
                <div className="text-sm text-zinc-500">No holdings yet. Buy something.</div>
              )}
              {state.portfolio.map((h) => (
                <div key={h.symbol} className="flex items-center justify-between rounded-xl bg-zinc-950 px-3 py-2">
                  <div>
                    <div className="font-semibold">{h.symbol}</div>
                    <div className="text-xs text-zinc-500">Avg ₹{h.avgPrice.toFixed(2)} • Qty {h.qty}</div>
                  </div>
                  <button onClick={() => router.push(`/stocks/${h.symbol}`)} className="text-xs text-emerald-400 hover:underline">Trade</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 p-4">
          <div className="mb-2 font-semibold">Recent activity</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {state.txns.slice(0, 9).map((t) => (
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
            {state.txns.length === 0 && <div className="text-sm text-zinc-500">No activity yet.</div>}
          </div>
        </div>
      </div>
    </main>
  );
}


