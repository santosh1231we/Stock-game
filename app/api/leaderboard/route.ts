import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const period = (searchParams.get("period") || "all").toLowerCase()
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 50)))
  try {
    const snap = await db.collection("leaderboards").doc(period).collection("entries")
      .orderBy("netWorth", "desc").limit(limit).get()

    const items = snap.docs.map((d, i) => {
      const v = d.data()
      return {
        rank: i + 1,
        userId: v.userId,
        username: v.username,
        netWorth: v.netWorth || 0,
        profileUrl: `/u/${v.username}`,
      }
    })
    return NextResponse.json({ period, items })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 })
  }
}


