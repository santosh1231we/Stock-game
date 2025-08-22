import SellContent from "./SellContent";

export const metadata = { title: "InvestLife • Sell" };

export default function SellPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Sell — Suggestions only</h1>
      <SellContent />
    </main>
  );
}


