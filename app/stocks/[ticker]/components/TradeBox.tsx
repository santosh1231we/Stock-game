"use client";
import { useEffect, useState } from "react";
import { placeOrder, SimState, loadState } from "@/lib/sim";

type QuoteLite = { symbol: string; regularMarketPrice?: number; regularMarketChangePercent?: number };

export default function TradeBox({ symbol }: { symbol: string }) {
  const [qty, setQty] = useState(1);
  const [quote, setQuote] = useState<QuoteLite | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [confirmMode, setConfirmMode] = useState<null | "BUY" | "SELL">(null);
  const [state, setState] = useState<SimState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const res = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`);
        if (!on) return;
        if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch");
        const json = (await res.json()) as QuoteLite;
        setQuote(json);
        setErr(null);
      } catch (e: any) {
        setErr(e.message || "Failed to fetch");
      }
    })();
    return () => {
      on = false;
    };
  }, [symbol]);

  const execute = async (mode: "BUY" | "SELL") => {
    if (!quote?.regularMarketPrice) return;
    try {
      const s = placeOrder(mode, symbol, qty, quote.regularMarketPrice);
      setState({ ...s });
      setErr(null);
      setConfirmMode(null);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 p-4">
      <div className="mb-2 text-sm text-zinc-400">Trade</div>
      {state && (
        <div className="mb-2 flex items-center gap-4 text-xs text-zinc-500">
          <div>Cash: ₹{state.balance.toLocaleString()}</div>
          {(() => {
            const h = state.portfolio.find((p) => p.symbol === symbol);
            return <div>Held: {h ? h.qty : 0} @ Avg ₹{h ? h.avgPrice.toFixed(2) : 0}</div>;
          })()}
        </div>
      )}
      <div className="text-sm text-zinc-300">
        {quote ? (
          <>
            <span className="font-semibold">{quote.symbol}</span> @ {quote.regularMarketPrice?.toFixed(2)} (
            <span className={Number(quote.regularMarketChangePercent) >= 0 ? "text-emerald-400" : "text-red-400"}>
              {quote.regularMarketChangePercent?.toFixed(2)}%
            </span>
            )
          </>
        ) : (
          <>Loading price…</>
        )}
      </div>
      <div className="mt-3 flex items-end gap-3">
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value || "0"))}
          className="w-28 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-emerald-500"
          placeholder="Qty"
        />
        <button onClick={() => setConfirmMode("BUY")} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400">
          Buy
        </button>
        <button onClick={() => setConfirmMode("SELL")} className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-black hover:bg-red-400">
          Sell
        </button>
      </div>
      {confirmMode && quote && (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="mb-2 font-semibold">Confirm {confirmMode}</div>
          {(() => {
            const price = quote.regularMarketPrice || 0;
            const total = price * qty;
            const h = state?.portfolio.find((p) => p.symbol === symbol);
            const pnl = h && confirmMode === "SELL" ? (price - h.avgPrice) * qty : 0;
            return (
              <div className="text-sm text-zinc-400 space-y-1">
                <div>Qty: {qty} · Symbol: {symbol}</div>
                <div>Price now: {price.toFixed(2)} · Total: {total.toFixed(2)}</div>
                {confirmMode === "SELL" && h ? (
                  <div>
                    You bought @ {h.avgPrice.toFixed(2)} · Selling @ {price.toFixed(2)} · PnL: {" "}
                    <span className={pnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                      {pnl >= 0 ? "+" : ""}
                      {pnl.toFixed(2)} ({(((price - h.avgPrice) / h.avgPrice) * 100).toFixed(2)}%)
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })()}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => execute(confirmMode)}
              className={`rounded-xl px-4 py-2 font-semibold text-black ${confirmMode === "BUY" ? "bg-emerald-500 hover:bg-emerald-400" : "bg-red-500 hover:bg-red-400"}`}
            >
              {confirmMode === "BUY" ? "Confirm Buy" : "Confirm Sell"}
            </button>
            <button onClick={() => setConfirmMode(null)} className="rounded-xl border border-zinc-800 px-4 py-2">
              Cancel
            </button>
          </div>
        </div>
      )}
      {err && <div className="mt-3 rounded-xl border border-red-800 bg-red-950 p-3 text-sm text-red-300">{err}</div>}
    </div>
  );
}


