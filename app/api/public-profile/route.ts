import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = (searchParams.get("username") || "").toLowerCase().trim()
  if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 })
  // Temporarily disabled profile fetch while Firebase is removed
  return NextResponse.json({ error: "Profile lookup disabled" }, { status: 503 })
}


