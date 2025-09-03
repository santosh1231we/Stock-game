import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "investlife-session";

export async function POST() {
  cookies().set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}


