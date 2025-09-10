import Link from "next/link"
import ProfileSidebar from "@/components/profile/ProfileSidebar"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-4">
        <aside className="rounded-2xl border border-zinc-800 p-4 md:col-span-1">
          <ProfileSidebar />
        </aside>
        <section className="md:col-span-3">{children}</section>
      </div>
    </div>
  )
}


