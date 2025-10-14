"use client"
import { useEffect, useMemo, useState } from "react"

type Badge = { id: string; label: string; earnedAt?: number }

export default function CertificateDialog({
  open,
  onClose,
  user,
  stats,
  badges,
}: {
  open: boolean
  onClose: () => void
  user: { id: string; name: string; username?: string }
  stats: { netWorth: number; balance: number; invested: number }
  badges: Badge[]
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-5xl rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-black p-0 shadow-[0_0_60px_10px_rgba(255,255,255,0.06),0_0_200px_40px_rgba(16,185,129,0.08)_inset]">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
        >
          Close
        </button>
        <div className="flex flex-col gap-6 p-8 md:p-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400">InvestLife Certificate</div>
              <div className="text-2xl font-extrabold">{user.name}{user.username ? <span className="ml-2 text-zinc-500">@{user.username}</span> : null}</div>
            </div>
            <div className="rounded-2xl bg-zinc-900/60 p-4 text-right">
              <div className="text-xs text-zinc-500">Net Worth</div>
              <div className="text-3xl font-extrabold">₹{stats.netWorth.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="text-xs text-zinc-500">Balance</div>
              <div className="text-2xl font-bold">₹{stats.balance.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="text-xs text-zinc-500">Invested</div>
              <div className="text-2xl font-bold">₹{stats.invested.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="text-xs text-zinc-500">Badges</div>
              <div className="text-2xl font-bold">{badges.length}</div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm text-zinc-400">Badges</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {badges.length === 0 && (
                <div className="text-sm text-zinc-500">No badges yet. Keep playing!</div>
              )}
              {badges.map((b) => (
                <div key={b.id} className="rounded-2xl border border-emerald-900/50 bg-emerald-950/30 p-3 shadow-[0_0_20px_2px_rgba(16,185,129,0.12)_inset]">
                  <div className="font-semibold text-emerald-300">{b.label}</div>
                  {b.earnedAt ? (
                    <div className="text-xs text-emerald-400/70">{new Date(b.earnedAt).toLocaleDateString()}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4 text-xs text-zinc-500">
            <button
              onClick={() => {
                // Placeholder share intent; later we’ll export as image and copy link from Firebase doc
                const shareText = `InvestLife Certificate — ${user.name} (${user.username || ''}) · Net Worth ₹${stats.netWorth.toLocaleString()}`
                if (navigator.share) {
                  navigator.share({ title: 'InvestLife Certificate', text: shareText }).catch(() => {})
                } else {
                  navigator.clipboard?.writeText(shareText).catch(() => {})
                }
              }}
              className="rounded-xl border border-zinc-800 px-3 py-2 text-xs hover:bg-zinc-900"
            >
              Share
            </button>
            <div>Future: store in Firebase (certificates/{user.id}) for sharing with friends</div>
          </div>
        </div>
      </div>
    </div>
  )
}


