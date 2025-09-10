"use client"
import { useEffect, useState } from "react"

export default function UserInfoPage() {
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem("investlife-userinfo")
      if (raw) {
        const s = JSON.parse(raw)
        setFullName(s.fullName || "")
        setUsername(s.username || "")
        setEmail(s.email || "")
        setLocation(s.location || "")
        setBio(s.bio || "")
      }
    } catch {}
  }, [])

  const save = () => {
    const s = { fullName, username, email, location, bio }
    localStorage.setItem("investlife-userinfo", JSON.stringify(s))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 p-6">
        <div className="mb-2 text-sm text-zinc-400">Basic Info</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500" />
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username / Display Name" className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500" />
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 p-6">
        <div className="mb-2 text-sm text-zinc-400">Profile Highlights / Bio</div>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio" className="h-28 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500" />
      </div>
      <button onClick={save} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400">Save</button>
    </div>
  )
}


