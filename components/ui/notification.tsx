"use client"
import { useEffect, useState } from "react"

export default function NotificationBus() {
  const [msg, setMsg] = useState<string>("")

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ credits: number }>
      const n = ce.detail?.credits ?? 1
      setMsg(n === 1 ? "Salary credited" : `${n} salaries credited`)
      const t = setTimeout(() => setMsg(""), 3000)
      return () => clearTimeout(t)
    }
    window.addEventListener("investlife-salary", handler as any)
    return () => window.removeEventListener("investlife-salary", handler as any)
  }, [])

  if (!msg) return null
  return (
    <div className="fixed right-4 top-4 z-[1000] rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-black shadow-lg">
      {msg}
    </div>
  )
}


