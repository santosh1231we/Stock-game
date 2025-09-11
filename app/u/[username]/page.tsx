import { NextResponse } from "next/server"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return {
    title: `${params.username} • Portfolio`,
    description: `Public portfolio for ${params.username}`,
  }
}

export default async function PublicUserPortfolio({ params }: { params: { username: string } }) {
  // Placeholder: later fetch from Firebase/DB. For now render a simple card.
  const username = params.username
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-zinc-800 p-6">
          <div className="mb-2 text-sm text-zinc-400">Public Profile</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold">{username}</div>
              <div className="text-xs text-zinc-500">Portfolio • Read-only</div>
            </div>
            <div className="rounded-xl bg-zinc-950 p-3 text-right">
              <div className="text-xs text-zinc-500">Net Worth</div>
              <div className="text-2xl font-bold">—</div>
            </div>
          </div>
          <div className="mt-6 text-sm text-zinc-500">Data will appear here once connected to backend storage.</div>
        </div>
      </div>
    </div>
  )
}


