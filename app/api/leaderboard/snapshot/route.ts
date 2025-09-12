import { NextResponse } from "next/server"
import { redisZRevRangeWithScores, redisZAdd } from "@/lib/redis"

export async function POST(req: Request) {
  try {
    const { period = 'daily', limit = 100 } = await req.json().catch(() => ({}))
    const src = 'leaderboard:global'
    const dst = `leaderboard:${String(period).toLowerCase()}`
    const rows = await redisZRevRangeWithScores(src, 0, Math.min(1000, Number(limit || 100)) - 1)
    for (const r of rows) {
      await redisZAdd(dst, r.score, r.member)
    }
    return NextResponse.json({ ok: true, period: dst, count: rows.length })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}


