import { loadState } from "@/lib/sim";

export const metadata = { title: "InvestLife • Positions" };

export default function PositionsPage() {
  const sim = loadState();
  const positions = sim.portfolio;
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Positions</h1>
      <div className="rounded-2xl border p-4">
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
                <tr key={p.symbol} className="border-t">
                  <td className="py-2 font-medium">{p.symbol}</td>
                  <td>{p.qty}</td>
                  <td>₹{p.avgPrice.toFixed(2)}</td>
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
    </main>
  );
}


