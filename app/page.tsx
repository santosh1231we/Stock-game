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
  // Check if user has seen roadmap
  const hasSeenRoadmap = jar.get("inquest-roadmap-seen")?.value;
  if (!hasSeenRoadmap) {
    redirect("/roadmap");
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-zinc-100 relative overflow-hidden">
      {/* Dynamic color-shifting background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-1/4 -top-1/4 h-[120vh] w-[120vw] animate-[pulse_15s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle_at_25%_30%,rgba(16,185,129,0.2),transparent_50%),radial-gradient(circle_at_75%_40%,rgba(239,68,68,0.15),transparent_48%),radial-gradient(circle_at_50%_70%,rgba(24,24,27,0.8),transparent_60%)] blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[120vh] w-[120vw] animate-[pulse_20s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle_at_70%_20%,rgba(239,68,68,0.18),transparent_45%),radial-gradient(circle_at_30%_60%,rgba(16,185,129,0.16),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(0,0,0,0.7),transparent_55%)] blur-3xl" />
      </div>
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-5xl font-extrabold tracking-tight">
          InQuest — Learn. Play. Profit
        </h1>
        <p className="mt-4 text-zinc-300 max-w-2xl">
          Your sandbox for mastering investing — risk-free, profit-ready.
          Start easy by creating an account and simulate live trading with <span className="font-semibold">₹0 risk</span>.
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
