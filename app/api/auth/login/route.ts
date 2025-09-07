import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const SESSION_COOKIE = "investlife-session";
const ONE_YEAR = 60 * 60 * 24 * 365; // seconds

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing name or email" },
        { status: 400 }
      );
    }

    const session = {
      name,
      email,
      ts: Date.now(),
    };

    cookies().set(SESSION_COOKIE, JSON.stringify(session), {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: ONE_YEAR,
    });

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: email,
        subject: "Welcome to InvestLife",
        html: `<p>Hi <strong>${name}</strong>, you're logged in. Happy investing!<br/>Time: ${new Date().toISOString()}</p>`,
      });
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Login failed" }, { status: 500 });
  }
}


