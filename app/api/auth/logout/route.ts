import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "investlife-session";

export async function POST() {
  // Clear the session cookie completely
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
    expires: new Date(0), // Force immediate expiration
  });
  
  // Return redirect to login page
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}


