import { NextResponse } from "next/server"
import { redisSMembers, redisGet, redisZAdd } from "@/lib/redis"

export async function POST() {
  try {
    const ids = await redisSMembers('users:all')
    let count = 0
    for (const id of ids) {
      const profile = await redisGet<any>(`user:${id}`)
      if (!profile) continue
      await redisZAdd('leaderboard:global', Number(profile.netWorth || 0), id)
      count++
    }
    return NextResponse.json({ ok: true, count })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}


