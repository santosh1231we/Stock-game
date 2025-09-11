import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const KEY = "investlife-profile"

export async function GET() {
  try {
    const raw = cookies().get(KEY)?.value
    const profile = raw ? JSON.parse(raw) : {}
    return NextResponse.json({ profile })
  } catch {
    return NextResponse.json({ profile: {} })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const next = JSON.stringify(body || {})
    cookies().set(KEY, next, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 365 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 400 })
  }
}


