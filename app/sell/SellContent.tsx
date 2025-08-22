"use client";
import { useEffect, useState } from "react";
import TickerSearch from "@/components/search/TickerSearch";
import { loadState, type SimState } from "@/lib/sim";

export default function SellContent() {
  const [sim, setSim] = useState<SimState | null>(null);
  useEffect(() => {
    setSim(loadState());
  }, []);

  return (
    <div>
      <div className="rounded-2xl border p-4">
        <div className="mb-3 text-sm opacity-70">
          Search tickers to prepare a sell. Use the stock page to execute.
        </div>
        <TickerSearch />
        <div className="mt-3 text-sm opacity-70">
          Holdings are shown on Positions; execute in each stock’s page.
        </div>
      </div>

      <div className="mt-6 rounded-2xl border p-4">
        <div className="mb-3 text-sm font-medium">Recent Sells</div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sim?.txns
            .filter((t) => t.type === "SELL")
            .map((t) => (
              <div key={t.id} className="rounded-xl bg-zinc-950 p-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">SELL</span>
                  <span className={t.amount >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {t.amount >= 0 ? "+" : ""}₹{Math.abs(t.amount).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-zinc-500">
                  {t.symbol ? `${t.symbol} • ${t.qty} @ ${t.price?.toFixed(2)}` : "-"}
                </div>
                <div className="text-[10px] text-zinc-600">
                  {new Date(t.ts).toLocaleString()}
                </div>
              </div>
            ))}
          {sim && !sim.txns.filter((t) => t.type === "SELL").length && (
            <div className="text-sm opacity-60">No sell activity yet</div>
          )}
        </div>
      </div>
    </div>
  );
}


