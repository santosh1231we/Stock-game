import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "investlife-session";

export async function POST() {
<<<<<<< HEAD
  cookies().set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
=======
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });
>>>>>>> c72da89 (commit)
  return NextResponse.json({ ok: true });
}


