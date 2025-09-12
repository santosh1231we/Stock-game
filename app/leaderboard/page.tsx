export const dynamic = 'force-dynamic'

async function fetchLeaderboard(period: string = 'all') {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/leaderboard?period=${period}`, { cache: 'no-store' }).catch(() => null)
  if (!res?.ok) return { items: [], period }
  try { return await res.json() } catch { return { items: [], period } }
}

export default async function LeaderboardPage({ searchParams }: { searchParams?: { period?: string } }) {
  const period = (searchParams?.period || 'all').toLowerCase()
  const data = await fetchLeaderboard(period)
  const items = data.items || []
  return (
    <main className="min-h-screen bg-black px-4 py-6 text-zinc-100">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <div className="mt-2 text-sm text-zinc-400">Period: {period}</div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-950 text-zinc-400">
              <tr>
                <th className="px-3 py-2 text-left">Rank</th>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-right">Net Worth</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it: any) => (
                <tr key={it.userId} className="border-t border-zinc-900">
                  <td className="px-3 py-2">{it.rank}</td>
                  <td className="px-3 py-2"><a href={it.profileUrl} className="text-emerald-400 hover:underline">@{it.username}</a></td>
                  <td className="px-3 py-2 text-right">₹{Number(it.netWorth || 0).toLocaleString()}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-zinc-500">No data yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}


