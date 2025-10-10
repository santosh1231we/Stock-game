import { NextResponse } from "next/server"

export async function POST(req: Request) {
  // Temporarily disabled snapshot while Firebase is removed
  const { period = 'daily' } = await req.json().catch(() => ({}))
  return NextResponse.json({ ok: true, period: String(period).toLowerCase(), count: 0, disabled: true })
}


