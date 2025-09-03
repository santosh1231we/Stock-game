import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "investlife-session";

export async function GET() {
  try {
    const raw = cookies().get(SESSION_COOKIE)?.value;
    const session = raw ? JSON.parse(raw) : null;
    return NextResponse.json({ session });
  } catch {
    return NextResponse.json({ session: null });
  }
}


