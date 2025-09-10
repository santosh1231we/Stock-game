"use client"
import Link from "next/link"
import SessionClient, { type Session } from "@/components/auth/SessionClient"

export default function ProfileSidebar() {
  return (
    <SessionClient>
      {(s: Session) => (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold">
              {s?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="font-semibold">{s?.name || "User"}</div>
              <div className="text-xs text-zinc-500">{s?.email || "anonymous"}</div>
            </div>
          </div>
          <nav className="flex flex-col gap-1 text-sm">
            <Link href="/profile/settings" className="rounded-lg px-3 py-2 hover:bg-zinc-900">Settings</Link>
            <Link href="/profile/info" className="rounded-lg px-3 py-2 hover:bg-zinc-900">User Info</Link>
            <Link href="/profile/overview" className="rounded-lg px-3 py-2 hover:bg-zinc-900">Account Overview</Link>
            <Link href="/profile/portfolio" className="rounded-lg px-3 py-2 hover:bg-zinc-900">Portfolio (Public)</Link>
          </nav>
        </div>
      )}
    </SessionClient>
  )
}


