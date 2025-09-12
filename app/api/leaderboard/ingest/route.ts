import { NextResponse } from "next/server"
import { redisSet, redisZAdd, redisSAdd } from "@/lib/redis"

// For now, accept POST and no-op (stub). Later, push to Redis/DB.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Validate minimal shape
    if (!body || !body.userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }
    const userId: string = body.userId
    const username: string = (body.username || '').toLowerCase()
    const profile = {
      username,
      displayName: body.displayName || username,
      location: body.location || null,
      portfolioPublic: body.portfolioPublic !== false,
      netWorth: Number(body.netWorth || 0),
      totalInvested: Number(body.totalInvested || 0),
      balance: Number(body.balance || 0),
      holdings: Array.isArray(body.holdings) ? body.holdings.slice(0, 5) : [],
    }
    // Map username -> userId (best-effort)
    if (username) await redisSet(`username:${username}`, userId)
    await redisSet(`user:${userId}`, profile)
    await redisSAdd('users:all', userId)
    // Optional: ZSET for global leaderboard
    await redisZAdd('leaderboard:global', profile.netWorth, userId)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 400 })
  }
}


