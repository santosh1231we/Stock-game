import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const period = (searchParams.get("period") || "all").toLowerCase()
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 50)))
  // Temporarily disabled leaderboard while Firebase is removed
  return NextResponse.json({ period, items: [] })
}


