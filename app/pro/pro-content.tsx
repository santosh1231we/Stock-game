"use client";
import { useState } from "react";
import TickerSearch from "@/components/search/TickerSearch";
import { loadState, placeOrder, claimSalary } from "@/lib/sim";

type Position = { ticker: string; qty: number; avgCost: number };
type Tx = {
  id: string;
  type: "TRADE" | "SALARY" | "ADJUSTMENT";
  side?: "BUY" | "SELL";
  ticker?: string;
  qty?: number;
  price?: number;
  createdAt: string;
};

export default function ProContent() {
  const [tab, setTab] = useState<"BUY" | "SELL" | "POSITIONS" | "HISTORY">(
    "BUY"
  );
  const [symbol, setSymbol] = useState("AAPL");
  const [qty, setQty] = useState<number>(1);
  const [status, setStatus] = useState<string>("");
  const [stateVersion, setStateVersion] = useState(0);

  const sim = loadState();

  async function fetchPrice(sym: string) {
    const res = await fetch(`/api/quote?symbol=${encodeURIComponent(sym)}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error((await res.json()).error || "quote failed");
    const json = await res.json();
    return Number(json.regularMarketPrice ?? json.price);
  }

  async function doBuy() {
    try {
      setStatus("Getting live price…");
      const price = await fetchPrice(symbol);
      const cost = price * qty;
      if (sim.balance < cost) {
        setStatus("Insufficient funds");
        return;
      }
      placeOrder("BUY", symbol, qty, price);
      setStatus(`Bought ${qty} ${symbol} @ ${price.toFixed(2)}`);
      setQty(1);
      setStateVersion((v) => v + 1);
    } catch (e: any) {
      setStatus(e.message || "Buy failed");
    }
  }

  async function doSell() {
    try {
      setStatus("Getting live price…");
      const price = await fetchPrice(symbol);
      placeOrder("SELL", symbol, qty, price);
      setStatus(`Sold ${qty} ${symbol} @ ${price.toFixed(2)}`);
      setQty(1);
      setStateVersion((v) => v + 1);
    } catch (e: any) {
      setStatus(e.message || "Sell failed");
    }
  }

  const refreshed = loadState();
  const positions = refreshed.portfolio.map((p) => ({
    ticker: p.symbol,
    qty: p.qty,
    avgCost: p.avgPrice,
  })) as Position[];
  const cash = refreshed.balance;
  const transactions = refreshed.txns.map((t) => ({
    id: t.id,
    type: "TRADE" as const,
    side: t.type === "BUY" || t.type === "SELL" ? (t.type as any) : undefined,
    ticker: t.symbol,
    qty: t.qty,
    price: t.price,
    createdAt: new Date(t.ts).toISOString(),
  })) as Tx[];

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["BUY", "SELL", "POSITIONS", "HISTORY"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-3 py-2 text-sm ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "BUY" && (
        <div className="rounded-2xl border p-4">
          <div className="mb-3 text-sm font-medium">Market Buy</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <TickerSearch onSelect={setSymbol} />
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="rounded-xl border px-3 py-2 text-sm"
              placeholder="Quantity"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={doBuy} className="rounded-xl bg-green-600 px-4 py-2 text-white">
              Buy
            </button>
            <div className="text-sm opacity-70">{status}</div>
          </div>
          <div className="mt-2 text-xs opacity-70">
            Market order uses the current live price.
          </div>
        </div>
      )}

      {tab === "SELL" && (
        <div className="rounded-2xl border p-4">
          <div className="mb-3 text-sm font-medium">Market Sell</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <TickerSearch onSelect={setSymbol} />
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="rounded-xl border px-3 py-2 text-sm"
              placeholder="Quantity"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={doSell} className="rounded-xl bg-red-600 px-4 py-2 text-white">
              Sell
            </button>
            <div className="text-sm opacity-70">{status}</div>
          </div>
        </div>
      )}

      {tab === "POSITIONS" && (
        <div className="rounded-2xl border p-4">
          <div className="mb-3 text-sm font-medium">Open Positions</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left opacity-60">
                <tr>
                  <th className="py-2">Ticker</th>
                  <th>Qty</th>
                  <th>Avg Cost</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => (
                  <tr key={p.ticker} className="border-t">
                    <td className="py-2 font-medium">{p.ticker}</td>
                    <td>{p.qty}</td>
                    <td>₹{p.avgCost.toFixed(2)}</td>
                  </tr>
                ))}
                {!positions.length && (
                  <tr>
                    <td className="py-3 text-sm opacity-60" colSpan={3}>
                      No positions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "HISTORY" && (
        <div className="rounded-2xl border p-4">
          <div className="mb-3 text-sm font-medium">Trade History</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left opacity-60">
                <tr>
                  <th className="py-2">Time</th>
                  <th>Type</th>
                  <th>Ticker</th>
                  <th>Side</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter((t) => t.type === "TRADE")
                  .map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="py-2">{new Date(t.createdAt).toLocaleString()}</td>
                      <td>{t.type}</td>
                      <td>{t.ticker ?? "-"}</td>
                      <td>{t.side ?? "-"}</td>
                      <td>{t.qty ?? "-"}</td>
                      <td>{t.price != null ? `₹${Number(t.price).toFixed(2)}` : "-"}</td>
                    </tr>
                  ))}
                {!transactions.filter((t) => t.type === "TRADE").length && (
                  <tr>
                    <td className="py-3 text-sm opacity-60" colSpan={6}>
                      No trades yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


