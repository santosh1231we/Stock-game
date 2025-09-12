import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "investlife-session";

export async function GET() {
  try {
    const jar = cookies();
    const raw = jar.get(SESSION_COOKIE)?.value;
    let session = raw ? JSON.parse(raw) : null;
    // Backfill missing identifiers for older cookies
    if (session && !session.userId) {
      const userId = crypto.randomUUID();
      const username = String(session.name || "user")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")
        .slice(0, 16) || "user";
      session = { ...session, userId, username };
      jar.set(SESSION_COOKIE, JSON.stringify(session), {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    return NextResponse.json({ session });
  } catch {
    return NextResponse.json({ session: null });
  }
}


