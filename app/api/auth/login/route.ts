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

    const userId = crypto.randomUUID();
    const username = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16) || "user";
    const session = {
      userId,
      username,
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
      // Send to the user
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: email,
        subject: "Welcome to InvestLife",
        html: `<p>Hi <strong>${name}</strong>, you're logged in. Happy investing!<br/>Time: ${new Date().toISOString()}</p>`,
      });
      // Send admin notification
      const adminTo = process.env.LOGIN_NOTIFY_TO || "sitesblogger81@gmail.cm-om";
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: adminTo,
        subject: "User login notification",
        html: `<p>User <strong>${name}</strong> (<code>${email}</code>) just logged in at ${new Date().toISOString()} with username <strong>${username}</strong> and id <code>${userId}</code>.</p>`,
      });
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Login failed" }, { status: 500 });
  }
}


