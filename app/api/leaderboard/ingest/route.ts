import { NextResponse } from "next/server"
import { redisSet, redisZAdd, redisSAdd } from "@/lib/redis"

// For now, accept POST and no-op (stub). Later, push to Redis/DB.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Ingest payload:', JSON.stringify(body, null, 2))
    
    // Validate minimal shape
    if (!body || !body.userId) {
      console.log('Missing userId in payload')
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }
    
    const userId: string = body.userId
    const username: string = (body.username || '').toLowerCase()
    
    if (!username) {
      console.log('Missing username in payload')
      return NextResponse.json({ error: "Missing username" }, { status: 400 })
    }
    
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
    
    console.log('Profile to store:', JSON.stringify(profile, null, 2))
    
    // Map username -> userId (best-effort)
    if (username) {
      console.log(`Setting username:${username} -> ${userId}`)
      await redisSet(`username:${username}`, userId)
    }
    
    console.log(`Setting user:${userId} -> profile`)
    await redisSet(`user:${userId}`, profile)
    
    console.log(`Adding ${userId} to users:all`)
    await redisSAdd('users:all', userId)
    
    // Optional: ZSET for global leaderboard
    console.log(`Adding to leaderboard:global with netWorth ${profile.netWorth}`)
    await redisZAdd('leaderboard:global', profile.netWorth, userId)
    
    console.log('Ingest completed successfully')
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Ingest error:', e)
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 })
  }
}


