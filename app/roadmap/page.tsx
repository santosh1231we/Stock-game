"use client"
import Link from "next/link"

const features = [
  {
    title: "Leaderboard & Social",
    status: "Coming Soon",
    description: "Compete with friends, see top performers, and share your achievements.",
    items: ["Global leaderboard", "Friend profiles", "Social sharing", "Achievement badges"]
  },
  {
    title: "Badges & Quests",
    status: "In Development",
    description: "Earn rewards for hitting milestones and completing trading challenges.",
    items: ["Milestone badges", "Daily quests", "Achievement system", "Reward unlocks"]
  },
  {
    title: "OAuth & Security",
    status: "Planned",
    description: "Secure login with Google, GitHub, and enhanced account protection.",
    items: ["Google OAuth", "GitHub login", "2FA support", "Account recovery"]
  },
  {
    title: "Advanced Analytics",
    status: "Planned", 
    description: "Deep insights into your trading patterns and portfolio performance.",
    items: ["Performance analytics", "Risk metrics", "Portfolio optimization", "Custom reports"]
  },
  {
    title: "Real-time Features",
    status: "Coming Soon",
    description: "Live market data, instant notifications, and real-time collaboration.",
    items: ["Live price feeds", "Push notifications", "Real-time chat", "Market alerts"]
  }
]

export default function RoadmapPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">InQuest Roadmap</h1>
          <p className="mt-2 text-zinc-400">What&#39;s coming next to your investing sandbox</p>
        </div>

        <div className="grid gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="rounded-2xl border border-zinc-800 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{feature.title}</h2>
                  <p className="mt-1 text-zinc-400">{feature.description}</p>
                </div>
                <div className="rounded-xl bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
                  {feature.status}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {feature.items.map((item, i) => (
                  <div key={i} className="rounded-xl bg-zinc-950/50 px-3 py-2 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-xl font-semibold">Ready to start?</h2>
          <p className="mt-2 text-zinc-400">Join thousands learning to invest risk-free</p>
          <div className="mt-4 flex gap-3">
            <Link href="/" className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black hover:bg-emerald-400">
              Start Trading Now
            </Link>
            <button 
              onClick={() => {
                // Set cookie to mark roadmap as seen
                document.cookie = "inquest-roadmap-seen=true; path=/; max-age=31536000";
                window.location.href = "/";
              }}
              className="rounded-xl border border-zinc-800 px-6 py-3 font-semibold hover:bg-zinc-900"
            >
              Continue to App
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
