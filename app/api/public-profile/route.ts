import { NextResponse } from "next/server"
import { redisGet } from "@/lib/redis"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = (searchParams.get('username') || '').trim().toLowerCase()
  if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 })
  try {
    const userId = await redisGet<string>(`username:${username}`)
    if (!userId) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const profile = await redisGet<any>(`user:${userId}`)
    if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (profile.portfolioPublic === false) return NextResponse.json({ error: 'private' }, { status: 403 })
    const sanitized = {
      username: profile.username,
      displayName: profile.displayName || profile.username,
      location: profile.location || null,
      balance: profile.balance ?? 0,
      netWorth: profile.netWorth ?? 0,
      totalInvested: profile.totalInvested ?? 0,
      holdings: Array.isArray(profile.holdings) ? profile.holdings.slice(0, 5) : [],
    }
    return NextResponse.json({ profile: sanitized })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}


