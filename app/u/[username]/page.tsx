import type { Metadata } from "next"
import { headers } from "next/headers"

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return {
    title: `${params.username} • Portfolio`,
    description: `Public portfolio for ${params.username}`,
  }
}

export default async function PublicUserPortfolio({ params }: { params: { username: string } }) {
  const username = params.username
  const host = headers().get('x-forwarded-host') || headers().get('host') || ''
  const proto = headers().get('x-forwarded-proto') || 'https'
  const base = host ? `${proto}://${host}` : ''
  const res = await fetch(`${base}/api/public-profile?username=${encodeURIComponent(username)}`, { cache: 'no-store' })
  let data: any = null
  try { data = await res.json() } catch {}
  const profile = data?.profile

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-zinc-800 p-6">
          <div className="mb-2 text-sm text-zinc-400">Public Profile</div>
          {!profile ? (
            <div className="text-sm text-zinc-500">{data?.error === 'private' ? 'This profile is private.' : 'Profile not found.'}</div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold">{profile.displayName || username}</div>
                  <div className="text-xs text-zinc-500">@{profile.username}</div>
                </div>
                <div className="rounded-xl bg-zinc-950 p-3 text-right">
                  <div className="text-xs text-zinc-500">Net Worth</div>
                  <div className="text-2xl font-bold">₹{Number(profile.netWorth || 0).toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-zinc-950 p-3">
                  <div className="text-xs text-zinc-500">Balance</div>
                  <div className="text-xl font-semibold">₹{Number(profile.balance || 0).toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-zinc-950 p-3">
                  <div className="text-xs text-zinc-500">Total Invested</div>
                  <div className="text-xl font-semibold">₹{Number(profile.totalInvested || 0).toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-zinc-950 p-3">
                  <div className="text-xs text-zinc-500">Holdings</div>
                  <div className="text-xl font-semibold">{(profile.holdings || []).length}</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2 text-sm text-zinc-400">Top Holdings</div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {(profile.holdings || []).map((h: any) => (
                    <div key={h.symbol} className="flex items-center justify-between rounded-xl bg-zinc-950 px-3 py-2">
                      <div className="font-semibold">{h.symbol}</div>
                      <div className="text-sm text-zinc-500">₹{Number(h.value || 0).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


