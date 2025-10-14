import Link from "next/link"

export default function FriendsPage() {
  // Placeholder for future Firebase-backed friends directory
  return (
    <main className="min-h-screen px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold">Friends</h1>
        <p className="mt-2 text-sm text-zinc-400">Coming soon: browse users, view profiles and game certificates.</p>
        <div className="mt-6 rounded-2xl border border-zinc-800 p-6">
          <div className="text-sm text-zinc-500">We will list users here from Firestore (`users` collection). Clicking a user will open their portfolio certificate popup.</div>
          <div className="mt-4">
            <Link href="/dashboard" className="rounded-xl border border-zinc-800 px-3 py-2 text-sm hover:bg-zinc-900">Back to dashboard</Link>
          </div>
        </div>
      </div>
    </main>
  )
}


