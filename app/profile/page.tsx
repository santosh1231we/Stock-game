import Link from "next/link"

export default function ProfileIndex() {
  return (
    <div className="rounded-2xl border border-zinc-800 p-6">
      <div className="mb-2 text-sm text-zinc-400">Profile</div>
      <div className="text-2xl font-bold">Choose a section</div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Link href="/profile/settings" className="rounded-xl border border-zinc-800 px-4 py-3 hover:bg-zinc-900">Settings</Link>
        <Link href="/profile/info" className="rounded-xl border border-zinc-800 px-4 py-3 hover:bg-zinc-900">User Info</Link>
        <Link href="/profile/overview" className="rounded-xl border border-zinc-800 px-4 py-3 hover:bg-zinc-900">Account Overview</Link>
        <Link href="/profile/portfolio" className="rounded-xl border border-zinc-800 px-4 py-3 hover:bg-zinc-900">Portfolio (Public)</Link>
      </div>
    </div>
  )
}


