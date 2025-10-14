"use client"
import { useEffect, useState } from "react"
import type { Session } from "@/components/auth/SessionClient"

export default function NavUserBadge({ sess, balance }: { sess: Session; balance?: number }) {
  const [profile, setProfile] = useState<{ fullName?: string; location?: string } | null>(null)

  useEffect(() => {
    let on = true
    ;(async () => {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' })
        if (!on) return
        const json = await res.json()
        setProfile(json.profile || null)
      } catch {}
    })()
    return () => { on = false }
  }, [])

  if (!sess) return null
  const display = profile?.fullName || sess?.name
  const location = profile?.location
  return (
    <div className="mr-2 rounded-xl border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
      {display} {location ? `· ${location}` : ''} {typeof balance === 'number' ? `· ₹${balance.toLocaleString()}` : ''}
    </div>
  )
}


