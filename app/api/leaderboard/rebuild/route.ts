import { NextResponse } from "next/server"

export async function POST() {
  // Temporarily disabled rebuild while Firebase is removed
  return NextResponse.json({ ok: true, count: 0, disabled: true })
}


