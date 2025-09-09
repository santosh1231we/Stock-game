"use client"
import Link from "next/link"
import SessionClient, { type Session } from "@/components/auth/SessionClient"

export default function HomeCta() {
  return (
    <SessionClient>
      {(s: Session) => (
        <>
          {!s ? (
            <Link href="/login" className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400">Get Started</Link>
          ) : (
            <Link href="/dashboard" className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400">Enter →</Link>
          )}
          <a href="/?range=1d" className="rounded-2xl border border-zinc-800 px-5 py-3 hover:bg-zinc-900">View Markets</a>
        </>
      )}
    </SessionClient>
  )
}


