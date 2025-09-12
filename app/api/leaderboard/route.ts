import { NextResponse } from "next/server"
import { redisZRevRangeWithScores, redisGet } from "@/lib/redis"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const period = (searchParams.get('period') || 'all').toLowerCase()
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || 50)))
  const key = period === 'all' ? 'leaderboard:global' : `leaderboard:${period}`
  try {
    const rows = await redisZRevRangeWithScores(key, 0, limit - 1)
    const items = await Promise.all(rows.map(async (r, idx) => {
      const user = await redisGet<any>(`user:${r.member}`)
      const username = user?.username || 'user'
      return {
        rank: idx + 1,
        userId: r.member,
        username,
        netWorth: r.score,
        profileUrl: `/u/${username}`,
      }
    }))
    return NextResponse.json({ period, items })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}


