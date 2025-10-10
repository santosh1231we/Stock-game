import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

// For now, accept POST and no-op (stub). Later, push to Redis/DB.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, username } = body
    if (!userId || !username) return NextResponse.json({ error: "Missing userId/username" }, { status: 400 })

    const sanitized = {
      username: String(username).toLowerCase().replace(/[^a-z0-9_-]/g, ""),
      displayName: (body.displayName || username) as string,
      location: body.location || null,
      portfolioPublic: body.portfolioPublic !== false,
      netWorth: Number(body.netWorth || 0),
      totalInvested: Number(body.totalInvested || 0),
      balance: Number(body.balance || 0),
      topHoldings: Array.isArray(body.holdings) ? body.holdings.slice(0, 5) : [],
      updatedAt: Date.now(),
    }

    await db.collection("usernames").doc(sanitized.username).set({ userId }, { merge: true })
    await db.collection("users").doc(userId).set(sanitized, { merge: true })
    await db.collection("leaderboards").doc("all").collection("entries").doc(userId).set({
      userId,
      username: sanitized.username,
      netWorth: sanitized.netWorth,
      updatedAt: Date.now(),
    }, { merge: true })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 })
  }
}


