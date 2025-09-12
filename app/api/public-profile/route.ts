import { NextResponse } from "next/server"
import { redisGet } from "@/lib/redis"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = (searchParams.get('username') || '').trim().toLowerCase()
  
  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 })
  }
  
  try {
    // Check if Redis is configured
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return NextResponse.json({ error: 'Redis not configured' }, { status: 500 })
    }
    
    const userId = await redisGet<string>(`username:${username}`)
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const profile = await redisGet<any>(`user:${userId}`)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    // Check if portfolio is public
    if (profile.portfolioPublic === false) {
      return NextResponse.json({ error: 'Profile is private' }, { status: 403 })
    }
    
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
    console.error('Public profile error:', e)
    return NextResponse.json({ 
      error: e?.message?.includes('Redis error 400') ? 'User not found' : 'Server error' 
    }, { status: 500 })
  }
}


