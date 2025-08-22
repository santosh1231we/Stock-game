import { loadState } from "@/lib/sim";

export const metadata = { title: "InvestLife • History" };

export default function HistoryPage() {
  const sim = loadState();
  const trades = sim.txns;
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Trade History</h1>
      <div className="rounded-2xl border p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-60">
              <tr>
                <th className="py-2">Time</th>
                <th>Type</th>
                <th>Ticker</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="py-2">{new Date(t.ts).toLocaleString()}</td>
                  <td>{t.type}</td>
                  <td>{t.symbol ?? "-"}</td>
                  <td>{t.qty ?? "-"}</td>
                  <td>{t.price != null ? `₹${Number(t.price).toFixed(2)}` : "-"}</td>
                  <td className={t.amount >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {t.amount >= 0 ? "+" : ""}₹{Math.abs(t.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!trades.length && (
                <tr>
                  <td className="py-3 text-sm opacity-60" colSpan={6}>
                    No activity yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}


