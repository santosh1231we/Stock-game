import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = (searchParams.get("username") || "").toLowerCase().trim()
  if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 })

  try {
    const unameDoc = await db.collection("usernames").doc(username).get()
    const userId = unameDoc.exists ? unameDoc.data()?.userId : null
    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const userDoc = await db.collection("users").doc(userId).get()
    if (!userDoc.exists) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

    const p = userDoc.data()!
    if (p.portfolioPublic === false) return NextResponse.json({ error: "Profile is private" }, { status: 403 })

    return NextResponse.json({
      profile: {
        username: p.username,
        displayName: p.displayName || p.username,
        location: p.location || null,
        balance: p.balance || 0,
        netWorth: p.netWorth || 0,
        totalInvested: p.totalInvested || 0,
        holdings: p.topHoldings || [],
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}


