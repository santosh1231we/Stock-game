"use client"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [leaderboard, setLeaderboard] = useState(true)
  const [portfolioPublic, setPortfolioPublic] = useState(true)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    // load placeholder settings from localStorage
    try {
      const raw = localStorage.getItem("investlife-settings")
      if (raw) {
        const s = JSON.parse(raw)
        setName(s.name || "")
        setLocation(s.location || "")
        setLeaderboard(!!s.leaderboard)
        setPortfolioPublic(!!s.portfolioPublic)
        setNotifications(!!s.notifications)
      }
    } catch {}
  }, [])

  const save = () => {
    const s = { name, location, leaderboard, portfolioPublic, notifications }
    localStorage.setItem("investlife-settings", JSON.stringify(s))
    // save quick profile cookie for display across the app
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: name, location }),
      credentials: 'include',
    }).catch(() => {})
    // push flags to ingest endpoint for public profile visibility
    fetch('/api/session', { credentials: 'include' })
      .then(r => r.json())
      .then(({ session }) => {
        if (!session?.userId) return
        fetch('/api/leaderboard/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.userId, username: session.username, displayName: name, location, portfolioPublic }),
        }).catch(() => {})
      }).catch(() => {})
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 p-6">
        <div className="mb-2 text-sm text-zinc-400">User Info Settings</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display Name" className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location (optional)" className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500" />
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 p-6">
        <div className="mb-2 text-sm text-zinc-400">Account Settings</div>
        <div className="flex flex-col gap-3 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} /> Notification Preferences</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={portfolioPublic} onChange={(e) => setPortfolioPublic(e.target.checked)} /> Portfolio public</label>
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 p-6">
        <div className="mb-2 text-sm text-zinc-400">Leaderboard Settings</div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={leaderboard} onChange={(e) => setLeaderboard(e.target.checked)} /> Include in leaderboard</label>
      </div>
      <button onClick={save} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400">Save Settings</button>
    </div>
  )
}


