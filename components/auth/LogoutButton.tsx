"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogoutButton() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    
    try {
      // Clear localStorage completely
      localStorage.clear()
      
      // Call logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      
      if (response.ok) {
        // Force redirect to login page
        window.location.href = "/login"
      } else {
        // Fallback: redirect anyway
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Fallback: redirect anyway
      window.location.href = "/login"
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-900 disabled:opacity-50"
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  )
}
