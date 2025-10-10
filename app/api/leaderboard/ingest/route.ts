import { NextResponse } from "next/server"

// For now, accept POST and no-op (stub). Later, push to Redis/DB.
export async function POST(req: Request) {
  try {
    // Temporarily disabled storage while Firebase is removed; accept payload and no-op
    const body = await req.json().catch(() => ({}))
    if (!body?.userId || !body?.username) {
      return NextResponse.json({ error: "Missing userId/username" }, { status: 400 })
    }
    return NextResponse.json({ ok: true, disabled: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 })
  }
}


