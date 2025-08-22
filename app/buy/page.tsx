import BuyContent from "./BuyContent";

export const metadata = { title: "InvestLife • Buy" };

export default function BuyPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Buy — Suggestions only</h1>
      <BuyContent />
    </main>
  );
}


