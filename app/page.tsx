import Link from "next/link";
import HomeCta from "@/components/home/HomeCta";
import TopMovers from "@/components/stocks/TopMovers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Landing() {
  const jar = cookies();
  const sess = jar.get("investlife-session")?.value;
  if (sess) {
    redirect("/dashboard");
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-5xl font-extrabold tracking-tight">
          InvestLife — Practice markets. Build habits. Risk <span className="text-emerald-400">₹0</span>.
        </h1>
        <p className="mt-4 text-zinc-300 max-w-2xl">
          Get a monthly “salary”, buy real-world stocks with virtual cash, and learn safely.
          Your mission: <span className="font-semibold">grow your net worth</span>.
        </p>
        <div className="mt-8 flex gap-4">
          {/* Client-only CTA wrapper to avoid function-as-children from server */}
          <HomeCta />
        </div>
        <div className="mt-12 rounded-2xl border border-zinc-800 p-6">
          <p className="text-sm uppercase text-zinc-400">Tip</p>
          <p className="mt-1">Every 1 hour ≈ 1 month. Claim salary, then invest wisely. 💸</p>
        </div>
        {/* Top Gainers / Losers */}
        <TopMovers />
      </div>
    </main>
  );
}
